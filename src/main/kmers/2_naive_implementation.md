# Naive Implementation
For the naive implementation of kmers, we just use a sliding window of the specified kmer size in the forward direction. For now, we skip the reverse complement.

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
