# Reverse complement
Next, we cover a fundamental topic, which is reverse complementing. Why is this important?

DNA is (generally) double stranded, where bases are paired:
- A pairs with T and vice versa.
- G pairs with C and vice versa.


5' `[...]ACGAGCTTTGTGACGCGATGCGACGAGCTGCAGCGT[...]` 3'<br>
3' `[...]TGCTCGAAACACTGCGCTACGCTGCTCGACGTCGCA[...]` 5'


Pretend this is a bacterial genome we want to sequence. Before sequencing, we need to separate the strands and break this molecule into smaller pieces. When doing this, we don't know which pieces are from which strand.

When we want to align the pieces back to a reference sequence (which is defined in the 5' to 3' direction), we need to take both strands into consideration. Otherwise, we lose out on information. We do this by reverse complementing, in which we first reverse the sequence, and then replace each base with the corresponding matching base.

```rust
fn reverse(nt: &u8) -> u8 {
    match nt {
        b'A' => b'T',
        b'C' => b'G',
        b'G' => b'C',
        b'T' => b'A',
        _ => panic!("Invalid nt {nt}"),
    }
}

fn reverse_complement(nt_string: &[u8]) -> Vec<u8> {
    let rev_comp: Vec<u8> = nt_string
        // Iterate over each character.
        .iter()
        // Reverse the iteration order.
        .rev()
        .map(|nt| {
            return reverse(nt);
        })
        .collect();

    return rev_comp;
}

fn main() {
    assert_eq!(reverse_complement(b"AAA"), b"TTT");
    assert_eq!(reverse_complement(b"GGG"), b"CCC");
    assert_eq!(reverse_complement(b"ATCG"), b"CGAT");
    assert_eq!(reverse_complement(b"ACACGT"), b"ACGTGT");
}
```

> [!TIP]
> A more elegant approach to reverse complementing uses 2-bit nucleotide encoding, where the complement of a base is simply `3 - encoded_value`. This is covered in the [Encoding](./nucleotide_encoding.md) chapter and becomes critical for efficient kmer generation.
