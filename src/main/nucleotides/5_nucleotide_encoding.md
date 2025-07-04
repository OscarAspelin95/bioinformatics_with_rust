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
