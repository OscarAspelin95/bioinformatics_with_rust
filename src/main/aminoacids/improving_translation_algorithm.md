# Improving Translation Algorithm
The previous approach for mapping codons to amino acids works, but it is not the most efficient. Mainly because of the `HashMap`. There is a performance penalty involved in having to hash input keys and find them.

There is a more brilliant approach, which (you guessed it) involves bit shifts. Let's look again at our codon table:
```rust,noplayground
    let aa = b"FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";

    let base1 = b"TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG";
    let base2 = b"TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG";
    let base3 = b"TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG";
```

The order is not random, but rather deliberate. The order of the codons is:
```
TTT, TTC, TTA, TTG, ...,
CTT, CTC, CTA, CTG, ..., 
ATT, ATC, ATA, ATG, ...,
GTT, GTC, GTA, GTG, ...,
GGG 
```
From this, we can derive an order where `T < C < A < G`. We have a total of 64 amino acids, so we need a way to map `TTT -> index 0` and `GGG -> index 63`. Recall that a codon is essentially a kmer of length 3, so we can take inspiration from the bit shift encoding we did in section 6.3. Here, however, we need to map nucleotides accordingly:

- `T` => `0b00`
- `C` => `0b01`
- `A` => `0b10`
- `G` => `0b11`

Each nucleotide occupies 2 bits and since we need three of them to form a codon, we need 6 bits in total (we'll use `usize` for convenience though). We have a total of `4^3 = 64` combinations of triplets than can form codons. In addition, using a 6 bit encoding, we cover numbers up to `0b111111 = 2⁵ + 2⁴ ... + 2⁰ = 63`. The formula we'll use to pack the nucleotides is `(base_1 << 4) | (base_2 << 2) | base_3`.

Consider the case of `b"GGG"`, which gives us `base_1 = b'G' => 0b11`, `base_2 = b'G' => 0b11` and `base_3 = b'G' => 0b11`. Doing the bit-shifts (without the ORs) gives:

```
0b...000011 << 4 = 0b...110000	# base_1
0b...000011 << 2 = 0b...001100	# base_2
0b...000011 	 = 0b...000011	# base_3
```

Now, including the ORs, we get `0b...110000 | 0b...001100 | 0b...000011 = 0b...111111`, which is the number `63` in base 10. You can visually check that `b"GGG"` maps to the amino acid `G`. Similarly, using the 6 bit encoding for `b"TTT"` results in `0b...000000`, which is the number `0` in base 10. We can also visually check that `b"TTT"` corresponds to the first amino acid.

Putting all of this into code, it would look something like this
```rust
const CODON_STANDARD: &[u8; 64] =
    b"FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";

const NT_CODON_MAP: [u8; 256] = {
    let mut map = [0u8; 256];
    map[b'T' as usize] = 0;
    map[b'C' as usize] = 1;
    map[b'A' as usize] = 2;
    map[b'G' as usize] = 3;
    // softmask
    map[b't' as usize] = 0;
    map[b'c' as usize] = 1;
    map[b'a' as usize] = 2;
    map[b'g' as usize] = 3;

    map[b'U' as usize] = 0;

    map
};

pub enum CodonTable {
    Standard,
}

impl CodonTable {
    pub fn table(&self) -> &[u8; 64] {
        match self {
            CodonTable::Standard => CODON_STANDARD,
        }
    }
}

enum Frame {
    First,
    Second,
    Third,
}

impl Frame {
    pub fn start_pos(&self) -> usize {
        match self {
            Frame::First => 0,
            Frame::Second => 1,
            Frame::Third => 2,
        }
    }
}


fn translate(codon_table_type: CodonTable, frame: &Frame, seq: &[u8]) -> Vec<u8> {
    let start_pos = frame.start_pos();

    if seq.len() < 3 {
        return vec![];
    }

    let codon_table = codon_table_type.table();

    let mut translated: Vec<u8> = Vec::with_capacity(seq.len() / 3);

    for codon in seq[start_pos..].chunks_exact(3) {
        let b1 = NT_CODON_MAP[codon[0] as usize] as usize;
        let b2 = NT_CODON_MAP[codon[1] as usize] as usize;
        let b3 = NT_CODON_MAP[codon[2] as usize] as usize;

        let index = (b1 << 4) | (b2 << 2) | b3;

        let aa = codon_table[index];

        translated.push(aa);

        if aa == b'*' {
            break;
        }
    }

    translated
}

fn main(){
	let seq = b"ATG";
	let translated = translate(CodonTable::Standard, &Frame::First, seq);
	assert_eq!(&translated[..], b"M");	
	
	let seq = b"ATGTGA";
	let translated = translate(CodonTable::Standard, &Frame::First, seq);
	assert_eq!(&translated[..], b"M*");	
}
```

A possible improvement here would be to handle ambiguous nucleotides and not just map them to `0` (which is done implicitly since we initialize `[0_u8; 256]` before overwriting with the nucleotide specific encodings).
