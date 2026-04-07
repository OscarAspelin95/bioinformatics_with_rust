# Minimizer Index
We previously covered one way to build a `HashMap` free [minimizer index](../building_an_index.md). `HashMap` or not, it is still rather difficult to build an index efficiently without using external crates. Because of this, the code implementation is not built from scratch. Instead, it uses a bunch of awesome crates:

|name| desciption| link|
| :-- | :-- | :-- |
|Rayon| Multithreading library|[GitHub](https://github.com/rayon-rs/rayon)|
|DashMap| Concurrent `HashMap`s and `HashSet`s|[GitHub](https://github.com/xacrimon/dashmap)|
|Packed Seq|Compact DNA sequence storage|[GitHub](https://github.com/rust-seq/packed-seq)|
|Simd Minimizers|SIMD accelerated minimizer generator|[GitHub](https://github.com/rust-seq/simd-minimizers)|

The code consists of two functions, one for building the index and one for filtering out low and high frequency minimizers.

`fn build_index` - takes records in the form of tuples `(String, PackedSeqVec)`. This assumes that we previously have read our FASTQ file and converted `seq: &[u8]` into a `PackedSeqVec`. By using `Rayon` and `DashMap`, we can process and insert minimizers in parallel. I haven't actually benchmarked this against a single-thread implementation so the potential performance gain is unknown.

`fn filter_index` - by using `.retain`, we can filter the index in place whilst removing low and high frequency minimizers.

```rust,noplayground
use dashmap::DashMap;
use tracing::info;
use packed_seq::{PackedSeqVec, SeqVec};
use rayon::prelude::*;
use rustc_hash::FxBuildHasher;
use simd_minimizers::canonical_minimizers;

/// Build a minimizer index of type
/// {
/// 	"m_1": [(s_1, p_1), ..., (s_n, p_n)]
/// 	...
/// 	"m_n": [(s_1, p_1), ..., ]
/// }
///
/// where:
/// - m_x is the minimizer hash
/// - s_x is the sequence id (as integer) for a given miminizer.
/// - p_x is the position for a given sequence and minimizer.
fn build_index(
    records: &[(String, PackedSeqVec)],
    kmer_size: usize,
    window_size: usize,
) -> DashMap<u64, Vec<(usize, u32)>, FxBuildHasher> {
    let index: DashMap<u64, Vec<(usize, u32)>, FxBuildHasher> =
        DashMap::with_capacity_and_hasher(1_000, FxBuildHasher);

    records
        .par_iter()
        .enumerate()
        .for_each(|(rec_idx, (_, seq))| {
            let mut _simd_positions = vec![];

            for (pos, minimizer) in canonical_minimizers(kmer_size, window_size)
                .run(seq.as_slice(), &mut _simd_positions)
                .pos_and_values_u64()
            {
                index.entry(minimizer).or_default().push((rec_idx, pos));
            }
        });

    index
}

/// We need to filter out minimizers that occur
/// - very very rarely (sequencing errors)
/// - very very commonly (repeats)
fn filter_index(
    index: &DashMap<u64, Vec<(usize, u32)>, FxBuildHasher>,
    min_minimizer_count: usize,
) {
    info!("Filtering out minimizer outliers");

    // threshold for very common minimizers
    let mut counts: Vec<usize> = index.par_iter().map(|entry| entry.value().len()).collect();
    counts.par_sort_unstable();
    let max_minimizer_count = counts[(counts.len() as f64 * 0.999) as usize];
    drop(counts);

    // in place modification.
    index.retain(|_, value| {
        let num_counts = value.len();

        if num_counts >= min_minimizer_count && num_counts <= max_minimizer_count {
            // cleanup from the index generation process.
            value.shrink_to_fit();
            return true;
        }

        false
    })
}
```
