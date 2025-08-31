# Using Phred Scores
Before we proceed with more efficient nucleotide encoding strategies, we'll cover how phred scores can be used in kmer applications. For samples such as Oxford Nanopore, where the quality generally is lower than say Illumina, we can use phred scores to identify highly erroneous kmers. Use cases could be:
- Only keep high quality kmers for downstream analyses.
- Sort a FASTQ file based on the number of high quality kmers in each read.
- Calculate the expected number of error free kmers.

[isONclust3](https://github.com/aljpetri/isONclust3) fundamentally uses some of these approaches as preprocessing steps. In the code below, we'll re-implement isONclust3's implementation of calculating the expected number of error free kmers.

In essence, we convert phred scores to error probabilities `p_e` for every nucleotide in the sequence. We can calculate the probability of the nucleotide being correctly called as `1-p_e`. For an arbitrary kmer of length `k`, we can calculate the probability of the entire kmer being correctly called as the product of the individual nucleotide probabilities.

\\[ \prod_{i=1}^k 1-\text{p_e}_i \\]

By repeating this calculation for every kmer across a sequence, we get the collection of all kmer probabilities. To get the expected number of error free kmers, we simply calculate the sum. Since we can generate `l-k+1` kmers of size `k` from a sequence of length `l`, we get:

\\[ \sum_{n=1}^{l-k+1}\prod_{i=1}^k 1-\text{p_e}_i \\]

where `n` is the position in the sequence and `i` is the position in a kmer.

```rust
fn phred_to_err(phred: u8) -> f64 {
    10_f64.powf(-1.0 * ((phred - 33) as f64) / 10.0)
}

/// Re-implementation of
/// https://github.com/aljpetri/isONclust3/blob/main/src/main.rs#L59
fn exp_error_free_kmers(qual: &[u8], kmer_size: usize) -> f64 {
    let mut sum_exp = 0.0_f64;

    // Current probability product for a rolling kmer.
    let mut current_prod = 1.0_f64;

    // We'll use a circular buffer to store up to one kmer at a time.
    let mut buf = vec![1.0_f64; kmer_size];

    // We need to keep track of the index to know when to circle back in our buffer.
    let mut idx = 0_usize;

    for i in 0..qual.len() {
        let q = qual[i];
        let p_e = phred_to_err(q);

        // Probability that the base is correct.
        let p_corr = 1.0_f64 - p_e;

        // Include new base in kmer probability.
        current_prod *= p_corr;

        // We have reached the capacity of our circular buffer.
        // Adjust by dividing (remove) the value we'll overwrite.
        if i >= kmer_size {
            let to_remove = buf[idx];
            current_prod /= to_remove;
        }

        // Add to our expected probability sum only for whole kmers.
        if i >= kmer_size - 1 {
            sum_exp += current_prod;
        }

        // Add base probability to our circular buffer and adjust index.
        buf[idx] = p_corr;
        idx = (idx + 1) % kmer_size;
    }

    sum_exp
}

fn main() {
    println!("{}", exp_error_free_kmers(b"??????????", 5));
    println!("{}", exp_error_free_kmers(b"5555555555", 5));
    println!("{}", exp_error_free_kmers(b"++++++++++", 5));
}
```

We see from the output that we get `f64` values out for the expected number of error free kmers. This might look odd, but it is in fact the *expected* value. Depending on what we want to do with the expected value, we may or may not want to round it.
