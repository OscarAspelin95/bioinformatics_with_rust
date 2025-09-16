# Classification
The final part of the amplicon chapter is classification. In essence, classification means we have some kind of confidence that a sequence originates from a specific taxa

## Alignment based methods
Usually, we'd use a global, semi-global or local aligner. The advantage of alignment based methods is that we can easily extract alignment metrics, such as the number of mismatches and indels, as well as alignment length, percent identity and other metrics. This is relevant if we not only want to find the best database hit, but also know how and where this database hit differs from our sequence.

The downside to alignment based methods is that they are slow when the number of sequences and database entries grow. Another downside, not commonly talked about, is the fundamental issue with choosing only the best database hit. Pretend that our sequence matches to a particular database entry (taxa X) with 99.9% identity, but is also matches to another database entry (taxa Y) with 99.85% identity. Can we really be sure that our sequence belongs to taxa X? The difference in identities between the hits could be as little as a single nucleotide. We better make sure our sequence does not contain any errors, since a single sequencing error theoretically could flip the classification from taxa Y to taxa X. If taxa X and taxa Y are different species from the same genus, maybe it makes sense to classify this sequence on genus level. This is especially true for Nanopore data, where sequencing errors can reach serveral percent.

One algorithm that is worth mentioning here is [EMU](https://github.com/treangenlab/emu), which uses minimap2 to align Nanopore reads to the entire database. Through an iterative maximum likelihood algorithm, based on alignment metrics, it can accurately estimate taxonomic abundances in the sample.

## Alignment free methods
These typically use kmers and are based on exact matches. There are numerous ways to use kmers for classification, but one algorithm in particular is worth mentioning. [SINTAX](https://doi.org/10.1101/074161) from the [USEARCH](https://github.com/rcedgar/usearch12) toolkit uses a rather interesting kmer based classification approach that relies on bootstrapped subsampling of kmers to generate a classification confidence score for each sequence.

In the code example below, we'll implement our own working prototype of a kmer based classifier. To keep things simple, we'll just compare and extract common kmers between our sequences and database entries. For each sequence, we keep the database hit that had the highest match to our sequence.

```rust
fn main() {
    println!("");

    // Define some mock sequences.

    // Define some mock database entries.

    // Extract kmers from both sequences and database entries.

    // For each sequence, return the database entry that had the most number of common kmers.
}
```
