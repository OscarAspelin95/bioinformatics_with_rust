# Syncmers
Minimizers are widely used in bioinformatics by softwares such as [Minimap2](https://github.com/lh3/minimap2) and [Kraken2](https://github.com/DerrickWood/kraken2). Recently, the concept of [syncmers](https://pmc.ncbi.nlm.nih.gov/articles/PMC7869670/) was proposed as an alternative to minimizers. To quote the paper:<br>

<q><em>Syncmers are defined here as a family of alternative methods which select k-mers by inspecting the position of the smallest-valued substring of length s < k within the k-mer.</em></q>

Basically what this means is:
- Take a kmer of length `k`.
- Check for the smallest substring (by value) of length `s` in the kmer.
- If the location of this substring fulfills a given criteria, classify the kmer as a syncmer.

A very simplified example is a nucleotide `ATCG` of length 4. Let `k = 3` and `s = 2`. Let's assume that our criteria is that the smallest valued substring must be located at the start of the kmer.

We can generate two kmers and for each of them, we check if the smallest valued substring of length `s = 2` is located at the start of the kmer.
```
ATCG    # nucleotide sequence.

ATC     # kmer_1
 TCG    # kmer_2
```

We see that:
- `ATC` has `AT` as its smallest valued substring and `AT` is located at the start. `ATC` is a syncmer.
- `TCG` has `CG` as its smallest valued substring and `CG` is not located at the start. `TCG` is not a syncmer.

## Closed syncmers
In this section, we'll go through *closed syncmers* where the location criteria is that the smallest value substring must be located at either the start or end of the kmer. Expanding our previous example with this location criteria, we get

```
ATCG    # nucleotide sequence.

ATC     # kmer_1
 TCG    # kmer_2
```

We see that:
- `ATC` has `AT` as its smallest valued substring and `AT` is located at the start. `ATC` is a closed syncmer.
- `TCG` has `CG` as its smallest valued substring and `CG` is located at the end. `TCG` is a closed syncmer.

## Implementation
In the example below, we won't bother with nucleotide encoding. Rather, we'll just find closed syncmers by iterate over the kmers, using the `.windows()` function and check the location of the smallest valued substring.

```rust
fn get_closed_syncmers<'a>(seq: &'a [u8], k: usize, s: usize) -> Vec<&'a [u8]> {
    assert!(k <= seq.len());
    assert!(s <= k);

    let closed_syncmers: Vec<&[u8]> = seq
        .windows(k) // Generate kmers.
        .filter_map(|kmer| {

            let (smallest_index, _) = kmer
                .windows(s) // Substrings of length s for a given kmer.
                .enumerate()
                .min_by_key(|substring| substring.1) // Find smallest valued substring.
                .unwrap();

            // Location criteria.
            if smallest_index == 0 || smallest_index == (k - s) {
                return Some(kmer);
            }

            return None;
        })
        .collect();

    return closed_syncmers;
}

fn main() {
    // Generate one single kmer. Syncmer "AT" is not in the start or end.
    assert_eq!(get_closed_syncmers(b"TTATT", 5, 2), Vec::<&[u8]>::new());

    // The example from the introduction to this chapter.
    assert_eq!(get_closed_syncmers(b"ATCG", 3, 2), vec![b"ATC", b"TCG"]);

    // Example from the syncmer paper.
    assert_eq!(get_closed_syncmers(b"GGCAAGTGACA", 5, 2), vec![b"GGCAA", b"AAGTG", b"AGTGA", b"GTGAC"]);
}
```
