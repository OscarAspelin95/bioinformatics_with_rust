# Clustering
Within amplicon analysis, read clustering is commonly applied as a type of dimensionality reduction. A typical example of this is prior to taxonomic classification. Usually, it is redundant and computationally expensive to classify every single read in a sample. Especially if multiple reads belong to the same taxa.

Consider a theoretical example with a known prior taxonomic distribution where we have 100,000 reads, half of which belong to *Escherichia coli* and the rest belong to *Staphylococcus aureus*. Instead of classifying all reads, we apply read clustering and get two distinct clusters, each containing 50,000 reads. From each cluster, we pick one representative sequence (E.g., the read with the highest quality) and classify only that one. Pretend that our two representatives (one for each cluster) classifies as *Escherichia coli* and *Staphylococcus aureus* respectively. We then extrapolate the classification for both clusters and say that 50,000 reads belong to *Escherichia coli* and 50,000 reads belong to *Staphylococcus aureus*, even though we only classified two sequences.

Obviously, we don't always know the taxonomic distribution beforehand. Maybe if we use a mock sample, otherwise generally we don't. There are also several questions that need to be adressed regarding our theoretical example:
- What algorithm should we use for read clustering?
- What thresholds are suitable for considering a read part of a cluster?
- How do we pick a suitable representative sequence from each cluster?

## Algorithms
There are multiple different approaches we can use for read clustering, each with its pros and cons. Common methods include:

**Alignment based** methods rely on some version of global, semi-global or local alignment. This approach is relatively slow but can be highly accurate.

**Kmer based** methods rely on kmers for sequence similarity. This is an alignment free method that is fast but not always as sensitive as alignment based methods. In order to save even more space and time, we can use minimizers or syncmers.

**Cluster free** methods do not really belong in this chapter, but we'll briefly mention them anyways. These methods usually try to classify reads directly without an intermediary clustering step. One example is [EMU](https://github.com/treangenlab/emu), which leverages read error rates and an iterative maximum likelihood algorithm.

## Thresholds
We need some kind of metric to decide if a read belongs to an already existing cluster, or if it should initiate a new cluster. Obviously, this depends on if we use an alignment based method, or a kmer based method.

Historically, for alignment methods a threshold of 97% similarity has been used to classify two sequences as belonging to the same [Operational Taxonomic Unit](https://en.wikipedia.org/wiki/Operational_taxonomic_unit) (OTU). The obvious downside to the OTU approach is that taxa with >97% similarity are collapsed.

A more recent approach is to use [Amplicon Sequence Variants](https://doi.org/10.1038/ismej.2017.119), which is a more high resolution approach. With the improvements in NGS data quality, it is much easier to distinguish sequencing errors from true biological variation. This means we can relatively accurately identify the exact taxonomic variation in the sample and leverage that. The ASV approach is commonly used for Illumina data, but might be unsuitable for error prone Nanopore data.

For kmer approaches, we can use set theory to calculate how many, and the fraction of, shared kmers we have between the read and the cluster. The [jaccard index](https://en.wikipedia.org/wiki/Jaccard_index) is a good example of this.

Read error rates are also something that must be considered. This is not generally a problem for Illumina data, but it can be for Nanopore. For example, if the average error rate in a sample is 3%, we need to take this into consideration when we choose a threshold. Error rates also become a problem during classification. If the average error rate is 3%, but the taxa we are trying to distinguish are >97% similar, we might run into issues.

## Representatives
How to choose a representative sequence from a cluster varies across bioinformatic tools. A few common ways are:
- **First seen in cluster**. The most straightforward way is to choose the read that initiated the cluster. However, since we don't consider read length, error rate or anything else, this method might not be appropriate unless we have done any prior read sorting.

- **Choosing the longest sequence**. One could argue that the longer the representative, the longer alignment or the most kmers we can generate. However, we probably need to consider factors such as outliers and sequence errors as well.

- **Choosing a random sequence**. This approach introduces a bit of stochasticity unless we use a seed.

- **Choosing the highest quality sequence**. For Nanopore samples, this is a highly suitable approach because the sequence with the lowest error rate generally has the potential to generate the best classification.

- **Least intercluster distance**. For each cluster, we choose the sequence that has the least total distance to all other sequences in the cluster. This approach uses some kind of concept of a <q>mean</q> and is a bit more robust towards accidentally picking outliers, but might be a bit more computationally heavy.

- **Generating a consensus sequence**. If we expect the sequences in a cluster to be highly similar, we could generate a consensus sequence. This essentially mean we generate a new sequence, based on some kind of multiple sequence alignment of all reads in the cluster, and take the majority vote in each position.

## Code example
Clustering algorithms can be quite complex so we'll create a *very* basic native Rust implementation here, which uses minimizers (using code from our sloppy, earlier implementation). We won't bother with sorting sequences or choosing representatives but rather just keeping track of how many clusters we generate and their members.

Conceptually what we do is:
- Start with zero clusters.
- Iterate over the sequences.
    - Extract minimizers for sequence.
    - Iterate over each cluster.
        - Calculate the jaccard index.
        - If jaccard index is larger than threshold, assign the read to this cluster.
    - If sequence has not been assigned, initiate a new cluster.

```rust
# use std::{cmp::min, collections::HashSet, vec};
#
# fn reverse(nt: &u8) -> u8 {
#     match nt {
#         b'A' => b'T',
#         b'C' => b'G',
#         b'G' => b'C',
#         b'T' => b'A',
#         _ => panic!("Invalid nt."),
#     }
# }
#
# fn minimizer_from_windows<'a>(
#     w_forward: &'a [u8],
#     w_reverse: &'a [u8],
#     kmer_size: usize,
# ) -> &'a [u8] {
#     let min_fwd = w_forward.windows(kmer_size).min().unwrap();
#     let min_rev = w_reverse.windows(kmer_size).min().unwrap();
#
#     return min(min_fwd, min_rev);
# }
#
# fn get_minimizers(seq: &[u8], window_size: usize, kmer_size: usize) -> HashSet<String> {
#     let sliding_window_size = window_size + kmer_size - 1;
#     assert!(sliding_window_size <= seq.len());
#
#     // We'll store the minimizers as strings convenience.
#     let mut h: HashSet<String> = HashSet::new();
#
#     let rev_comp: Vec<u8> = seq.iter().rev().map(|nt| reverse(nt)).collect();
#
#     // Create windows for both forward and reverse sequences.
#     seq.windows(sliding_window_size)
#         .zip(rev_comp.as_slice().windows(sliding_window_size))
#         // Iterate over forward/reverse windows at the same time.
#         .for_each(|(w_forward, w_reverse)| {
#             let minimizer = minimizer_from_windows(w_forward, w_reverse, kmer_size);
#             h.insert(String::from_utf8(minimizer.to_vec()).unwrap());
#         });
#
#     return h;
# }
// [...]

fn jaccard_index(h1: &HashSet<&[u8]>, h2: &HashSet<&[u8]>) -> f64 {
    let num_common = h1.intersection(h2).count();
    let num_total = h1.union(h2).count();

    return num_common as f64 / num_total as f64;
}

fn cluster<'a>(
    seqs: &[(&'a str, &[u8])],
    kmer_size: usize,
    window_size: usize,
    threshold: f64,
) -> Vec<(HashSet<String>, Vec<&'a str>)> {
    let mut clusters: Vec<(HashSet<String>, Vec<&str>)> = Vec::new();

    for (seq_name, seq) in seqs {
        let minimizers = get_minimizers(seq, window_size, kmer_size);
        let minimizer_set: HashSet<&[u8]> = minimizers.iter().map(|m| m.as_bytes()).collect();

        let mut assigned: bool = false;

        for (cluster_hashset, cluster_members) in &mut clusters {
            let cluster_hashset: HashSet<&[u8]> =
                cluster_hashset.iter().map(|h| h.as_bytes()).collect();

            let d = jaccard_index(&minimizer_set, &cluster_hashset);

            if d >= threshold {
                assigned = true;
                cluster_members.push(seq_name);
                break;
            }
        }

        if !assigned {
            clusters.push((minimizers, vec![seq_name]));
        }
    }

    clusters
}

fn main() {
    let seqs: Vec<(&str, &[u8])> = vec![
        ("seq_1", b"AAACACCGTGTGGGGCTAGCTATTTCACATGTGTCATGCAT"),
        ("seq_2", b"AAACACCGTGTGGGGCTAGCTATTTCACATGTGTCATGCAT"),
        ("seq_3", b"TACGTACGTACGTACGTACGATCGATCGTACGATCGATCGT"),
        ("seq_4", b"TACGTACGTCCGTACGTACGATCGATCGTACGATCGTTCGT"),
    ];

    let window_size: usize = 3;
    let kmer_size: usize = 3;
    let threshold: f64 = 0.6;

    let clusters = cluster(&seqs[..], kmer_size, window_size, threshold);

    println!("Num clusters: {}", clusters.len());

    for (_, members) in clusters {
        println!("{:?}", members)
    }
}
```

In this example, we have plenty of room for improvement. Firstly, we'd probably want to filter out low quality sequences if we have access to phred scores. Second, we could sort by quality in descending order. This ensures that new clusters are initiated with the highest quality sequences. In addition, our current approach is greedy, meaning that a sequence is assigned to the first best cluster we find. We don't know if there is a better matching cluster later in the iteration. Finally, we obviously want a more efficient approach for generating minimizers (such at [minimizer_iter](https://docs.rs/minimizer-iter/latest/minimizer_iter/index.html) or maybe even our own bit-shift encoded implementation).

In summary, this example is crap when it comes to performance. It does, however, conceptually illustrate how clustering algorithms work. [isONclust3](https://github.com/aljpetri/isONclust3) and [USEARCH](https://github.com/rcedgar/usearch12) are great examples of fast and high performance implementations.
