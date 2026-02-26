# A First Implementation
For a naive implementation of kmers, we'll just use a sliding window of the specified kmer size in the forward direction. For now, we skip the reverse complement.

```rust
fn kmerize(nt_string: &[u8], kmer_size: usize) -> Vec<&[u8]> {
    assert!(kmer_size <= nt_string.len());

    // Rust has a very handy windows function that works perfectly here.
    let kmers: Vec<&[u8]> = nt_string.windows(kmer_size).collect();

    // Make sure we generated the correct number of kmers.
    assert_eq!(kmers.len(), nt_string.len() - kmer_size + 1);
    return kmers;
}

fn main() {
    assert_eq!(kmerize(b"AAAA", 2), vec![b"AA", b"AA", b"AA"]);
    assert_eq!(kmerize(b"ATCGATCG", 7), vec![b"ATCGATC", b"TCGATCG"]);
    assert_eq!(
        kmerize(b"AATTCCGG", 2),
        vec![b"AA", b"AT", b"TT", b"TC", b"CC", b"CG", b"GG"]
    );
}
```

This naive implementation has several flaws that we need to handle:
- We currently don't consider the reverse complement.
- Once the reverse complement is handled, should we use all forward and all reverse kmers, or can we be smart about which kmers to pick?
- We still use ASCII encoding, which takes up unnecessary amounts of storage.
- Using a window function is not feasible when dealing with huge amounts of data. We need another approach.

> [!TIP]
> These flaws are addressed in the following chapters: [Bit Shift Encoding](./bit_shift_encoding.md) replaces ASCII with 2-bit encoding, [Forward Strand](./forward_strand.md) and [Reverse Strand](./reverse_strand.md) handle both strands, and the [Final Implementation](./final_implementation.md) combines everything into a canonical kmer generator.
