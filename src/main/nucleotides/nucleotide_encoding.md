# Encoding
Being able to encode and decode nucleotides is a vital part of writing high performance bioinformatic code. What it means is essentially converting nucleotides into a more compact form. There are multiple ways of doing nucleotide encoding. However if we assume we only have to deal with `{A,C,G,T}` then there is a straightforward way for this:
- `A` is encoded as `0` (binary `00`).
- `C` is encoded as `1` (binary `01`).
- `G` is encoded as `2` (binary `10`).
- `T` is encoded as `3` (binary `11`).

The advantages of this approach are:
- Each nucleotide only takes up 2 bits.
- Reverse complementing a base is as easy as:
    - `rev_nt = 3 - nt`
- With some bit-shifting, we can very efficiently generate kmers from our sequences (covered in a later topic).


The following code is just a very straightforward encoding/decoding protocol. However, this enables us to do some more advanced stuff in future topics.
```rust
/// Convert ASCII to our own 2-bit encoded nt.
fn encode(nt_decoded: u8) -> u8 {
    match nt_decoded {
        b'A' => 0,
        b'C' => 1,
        b'G' => 2,
        b'T' => 3,
        _ => panic!("Invalid nt {nt_decoded}"),
    }
}

/// Convert our own 2-bit encoded nt to ASCII.
fn decode(nt_encoded: u8) -> u8 {
    match nt_encoded {
        0 => b'A',
        1 => b'C',
        2 => b'G',
        3 => b'T',
        _ => panic!("Invalid nt {nt_encoded}"),
    }
}

/// Reverse complement an ASCII base.
fn reverse(nt: u8) -> u8 {
    return decode(3 - encode(nt));
}

/// Reverse complement a nucleotide sequence.
fn reverse_complement(nt_string: &[u8]) -> Vec<u8> {
    nt_string.iter().rev().map(|nt| reverse(*nt)).collect()
}

fn main() {
    // Reverse complement a single nucleotide.
    assert_eq!(reverse(b'A'), b'T');
    assert_eq!(reverse(b'T'), b'A');
    assert_eq!(reverse(b'C'), b'G');
    assert_eq!(reverse(b'G'), b'C');

    // We can also reverse complement a nucleotide sequence.
    assert_eq!(reverse_complement(b"AAAA"), b"TTTT");
    assert_eq!(reverse_complement(b"ATCG"), b"CGAT");
}

```

##  Using a lookup table
We used match statements to encode and decode nucleotides, which works. However, we only handle the canonical bases `{A,C,G,T}`. This is not ideal, because our FASTA/Q file might contain soft masked bases `{a,c,g,t}` or hard masked bases `N`.

We could just extend our match statement to handle this, but we still have not safe-guarded against any other ambiguous nucleotide that we might encounter. A better approach is to use a compile-time lookup table that supports all 256 ASCII characters, where all irrelevant characters are set to 4.


```rust
const LOOKUP_TABLE: [u8; 256] = [
	0, 1, 2, 3,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 0, 4, 1,  4, 4, 4, 2,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  3, 3, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 0, 4, 1,  4, 4, 4, 2,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  3, 3, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4
];

fn main() {
    LOOKUP_TABLE.iter().enumerate().for_each(|(index, value)| {
        if *value != 4 {
            println!("[{index}] {} -> {}", index as u8 as char, value);
        }
    });
}
```

Run the code and inspect the output. Using a lookup table, we are able to map `{A,C,G,T,U,a,c,g,t,u}` to their corresponding encodings. This means we handle both upper and lowercase nucleotides, and also get U/u for free, meaning that we can now handle RNA as well.

However, we see that the first four values at index `[0], [1], [2], [3]` map to some weird characters. ASCII characters less than 32 are not actually printable characters, but rather control characters where `0, 1, 2, 3` correspond to null, start of heading, start of text and end of text respectively.

That does not make any sense. However, it does enable us to map already encoded nucleotides to themselves, which could serve as some kind of redundancy if we ever would have a mix of encoded and non-encoded nucleotides.

```rust
# const LOOKUP_TABLE: [u8; 256] = [
# 	0, 1, 2, 3,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 0, 4, 1,  4, 4, 4, 2,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  3, 3, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 0, 4, 1,  4, 4, 4, 2,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  3, 3, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,
# 	4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4,  4, 4, 4, 4
# ];
// [...]

fn main() {
    // We have a mix of non-encoded and encoded nucleotides.
    let mix_encoded: &[u8] = &[65, 65, 0, 0]; // AAAA

    // Encode all nucleotides.
    let all_encoded: Vec<u8> = mix_encoded.iter().map(|nt| LOOKUP_TABLE[*nt as usize]).collect();

    assert_eq!(all_encoded, vec![0, 0, 0, 0]);
}
```
