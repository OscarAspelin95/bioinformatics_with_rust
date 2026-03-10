# Building a Reverse Index
Enough with SIMD, let's talk about another very useful concept within bioinformatics - the reverse index.

But before this, what even is a "forward" index? Imagine you have a FASTA file, which contains your database sequences. This could be e.g., resistance genes, MLST alleles or something else. A "forward" index stores information about what database sequence contains what kmer hash. For example a simple `HashMap` with keys and values.


```json
{
	"seq_1": [14184540469240097163, 18446744073709551615, ...],
	"seq_2": [4512398701234987123, 3141592653589793238, ...],
	...
	"seq_n": [6672914039128457702, 14184540469240097163, ...],
}
```
Remember, a kmer hash is simply a kmer (e.g., `b"AAA"`) that is u64 encoded and that has been fed into a hash function to generate a new u64.

Why would we store information like this? One reason is that if we have a bunch of kmer hashes from a query sequence, we can check which database sequence matches and how well. One way would be to loop over each (key, value) pair in the index (possibly in parallel) and check how many of the query kmer hashes are identical. This gives us an approximate sequence similarity.

## Why A Reverse Index Is Better
A reverse index is simply the reverse of a "forward" index, meaning that kmer hashes are the keys and the IDs of the database sequences that contain each hash are the values. E.g.,

```json
{
	"14184540469240097163": ["seq_1", "seq_n"],
	"18446744073709551615": ["seq_1"],
	"4512398701234987123":  ["seq_2"],
	...
	"6672914039128457702":  ["seq_n"]
}
```

For the first entry, the reverse index above reads: "kmer hash `14184540469240097163` is found in `seq_1` and `seq_n`".

We can do better. If we know the number of sequences, e.g., from reading the FASTA file, we can define a fixed size for the length of the value arrays. We can set them to exactly length `n` since each kmer hash can be present in at most `n` unique sequences. Also, let's switch out the array of strings to a bitset. A bitset is essentially an array where each element can have one of two values, either 0 or 1:
- `0` at index `i` means that sequence `i` does not contain the kmer hash.
- `1` at index `i` means that sequence `i` does contain the kmer hash.

This refined reverse index would look something like:

```json
{
	"14184540469240097163": [1, 0, ..., 1],
	"18446744073709551615": [1, 0, ..., 0],
	"4512398701234987123":  [0, 1, ..., 0],
	...
	"6672914039128457702":  [0, 0, ..., 1]
}
```

For the first entry, the reverse index now reads: "kmer hash `14184540469240097163` exists at index `0` and `n-1`". If we originally had all sequences stored as something like a `sequences: Vec<FastaRecord> = [record_1, record_2, ..., record_n]` it would be as easy as to access the ids as `sequences[0].id` and `sequences[n-1].id`.

Why is this better than a forward index? Because using fixed size bitsets enables very efficient processing and minimal storage.

## Using A Reverse Index In Practice
Reverse indices are a cornerstone of many state-of-the-art bioinformatics tools that need to search or classify sequences at scale. For example, [COBS](https://github.com/bingmann/cobs) (Compact Bit-Sliced Signature Index) uses a compressed reverse index to enable fast approximate membership queries across massive sequence collections. Similarly, [sourmash](https://github.com/sourmash-bio/sourmash) leverages FracMinHash sketches with reverse index structures for rapid genome search and taxonomic classification. Other tools like [BIGSI](https://github.com/Phelimb/BIGSI) and [sylph](https://github.com/bluenote-1577/sylph) also rely on variations of this pattern. The core idea remains the same: by indexing kmer hashes and mapping them back to their source sequences, we can quickly identify which database entries share content with a query — without aligning every sequence pair.
