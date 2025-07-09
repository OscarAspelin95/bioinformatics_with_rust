# Encoding
Being able to encode and decode nucletides is a vital part of writing high performance bioinformatic code. What it means is essentially converting nucleotides into a more compact form. There are multiple ways of doing nucleotide encoding. However if we assume we only have to deal with A/C/G/T, then there is a straightforward way for this:
- A is encoded as 0 (binary 00).
- C is encoded as 1 (binary 01).
- G is encoded as 2 (binary 10).
- T is encoded as 3 (binary 11).

The advantages of this approach are:
- Each nucleotides only takes up 2 bits.
- Reverse complementing a base is as easy as:
    - rev_nt = 3 - nt
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
    assert_eq!(reverse_complement(b"AAAA").as_slice(), b"TTTT");
    assert_eq!(reverse_complement(b"ATCG").as_slice(), b"CGAT");
}

```

##  Using a lookup table
We used match statements to encode and decode nucleotides, which works. However, we only handle the canonical bases A/C/G/T. This is not ideal, because our FASTA/Q file might contain soft masked bases a/c/g/t or hard masked bases N.

We could just extend our match statement to handle this, but we still have not safe-guarded against any other ambiguous nucleotide that we might encounter. A better approach is to use a compile-time lookup table that supports all 256 ASCII characters.


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

Run the code and inspect the output. Using a lookup table (which has a very cheap cost for index lookup) we are able to map A/C/T/U/a/c/g/t/u to their corresponding encodings. This means we handle both upper and lowercase nucleotides, and also get U/u for free, meaning that we can now handle RNA as well.

However, we see that the first four values at index 0/1/2/3 map some weird characters to 0/1/2/3. ASCII characters with DEC values (index in our case) less that 32 are not actually printable characters, but rather control characters. 0/1/2/3 correspond to null character, start of heading, start of text and end of text respectively. We must not use those for encoding ASCII control characters. What we can use them for though, is reverse complement.

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


fn reverse(nt: u8) -> u8{
    return 3 - LOOKUP_TABLE[nt as usize]
}
fn main() {
    // We can reverse both ASCII and encoded A into T.
    assert_eq!(reverse(b'A'), LOOKUP_TABLE[b'T' as usize]);
    assert_eq!(reverse(0 as u8), LOOKUP_TABLE[b'T' as usize]);

}
```
Note that Rust requires us to use usize for index lookup in the lookup table, which requires us some type casting.
