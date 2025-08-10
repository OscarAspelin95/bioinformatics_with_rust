# Minimizers
We saw earlier how FracMinHash could be used to downsample the number of kmers generated from our sequences. Another approach is to use so called minimizers. First introduced in 2004, [minimizers](https://doi.org/10.1093/bioinformatics/bth408) are very commonly used in bioinformatic applications to reduce storage requirements for DNA sequences.

The basic idea is to use a sliding window of w consecutive kmers a sequence and in each window identify one representative kmer to keep. Since we choose a reduced set of kmers, these will act as an approximate representation for the original sequence. There are multiple ways to choose a representative kmer inside the sliding window, but typically the lexicographically smallest kmer is chosen. We need to define some terms to make things more clear:
- `k` - length of a kmer.
- `w` - number of consecutive kmers to check for minimizers in.
- `|w|` - The actual length (in nucleotides) we need for our sliding window to accomodate `w` consecutive kmers of length `k`.

We can calculate |*w*| since we know how many kmers we can generate from a given sequence.<br>
`w = |w| - k + 1`

See the example below, where we set w=4 and k=3, hence calculating |*w*| = 6.
<pre>
AAACCCGGGAAACCCGGGAAACCCGGG
AAACCC
 AACCCG    ...        ...
  ACCCGG
   CCCGGG            CCCGGG
</pre>

Let's consider the first window `AAACCC`. The possible kmers we can generate in the forward direction are `AAA`, `AAC`, `ACC`, `CCC`. Out of these, the lexicographically smallest one is AAA and we choose this kmer as this windows minimizer. We then do the same for the remaining windows.

We can get even more space efficient by storing the minimizers in a hashset, since this removes duplicates. However, this is not suitable if we also want to store information such as the minimizers positions. We also have to take the reverse complement into consideration, similarly to what we did in the bit shift encoding section.

There are several Rust crates, such as [Needletail](https://docs.rs/needletail/0.6.3/needletail/) and [bio-seq](https://docs.rs/bio-seq/latest/bio_seq/) that implement minimizers quite efficiently. In the code snippet below, we just implement a minimally viable prototype.


```rust
use std::{cmp::min, vec};

fn reverse(nt: &u8) -> u8 {
    match nt {
        b'A' => b'T',
        b'C' => b'G',
        b'G' => b'C',
        b'T' => b'A',
        _ => panic!("Invalid nt."),
    }
}

/// Find the lexicographically smallest kmers from
/// either the forward or reverse window.
fn minimizer_from_windows<'a>(
    w_forward: &'a [u8],
    w_reverse: &'a [u8],
    kmer_size: usize,
) -> &'a [u8] {
    let min_fwd = w_forward.windows(kmer_size).min().unwrap();
    let min_rev = w_reverse.windows(kmer_size).min().unwrap();

    return min(min_fwd, min_rev);
}

fn get_minimizers(seq: &[u8], window_size: usize, kmer_size: usize) -> Vec<String> {
    // This is the actual length (in nucleoties) of the sliding
    // window we need for w consecutive kmers of length k.
    let sliding_window_size = window_size + kmer_size - 1;
    assert!(sliding_window_size <= seq.len());

    // We'll store the minimizers as strings convenience.
    let mut m: Vec<String> = Vec::new();

    let rev_comp: Vec<u8> = seq.iter().rev().map(|nt| reverse(nt)).collect();

    // Create windows for both forward and reverse sequences.
    seq.windows(sliding_window_size)
        .zip(rev_comp.as_slice().windows(sliding_window_size))
        // Iterate over forward/reverse windows at the same time.
        .for_each(|(w_forward, w_reverse)| {
            let minimizer = minimizer_from_windows(w_forward, w_reverse, kmer_size);
            m.push(String::from_utf8(minimizer.to_vec()).unwrap());
        });

    return m;
}

fn main() {
    assert_eq!(get_minimizers(b"AAATTT", 4, 3), vec!["AAA"]);

    // Use all canonical kmers as minimizers.
    assert_eq!(
        get_minimizers(b"AAATTT", 1, 3),
        vec!["AAA", "AAT", "ATT", "TTT"]
    );
}
```

For a more thorough review on minimizers, check out this awesome [paper](https://doi.org/10.1186/s13059-024-03414-4).
