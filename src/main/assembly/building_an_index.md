# Building An Index
The next step would be to build some kind of index to keep track of all minimizers. Intuitively, one might think that the [reverse index](../kmers/building_a_reverse_index.md) works (with some tweaks). We have several issues we have to address for our reverse index approach:
- We only store *what* contig contains a minimizer, not *where* in the contig it originates from.
- We have to consider that a minimizer can exist in multiple different locations in a single contig.
- We are using a `HashMap`, which has both pros and cons. Even though `FxHasher` is incredibly fast, and the fact that a `HashMap` can access values in `O(1)` time, there is a risk of hash collisions when we have many, many different minimizers. We should consider another data structure, but still keep in mind that `HashMap`s are still very good. 

One solution, inspired by tools such as [minimap2](https://github.com/lh3/minimap2) is to use three different arrays (`Vec` in our case).
- One to store deduplicated, sorted minimizers.
- One to store offsets. This is used to identify which tuples `(contig_id, contig_location)` belong to a certain minimizer.
- One to store the actual contig information. This will be a `Vec<(usize, usize)>`.

## How It Works
Since this section won't contain a lot of code, we'll go through more of the theory and concepts behind how building a minimizer index works.

### Extracting Minimizers
Assume we want to query reads from a FASTQ file against a set of contigs from a FASTA file. We decide to build a minimizer index from the FASTA file because using the FASTQ file does not make sense. We'll have many spurious and erroneous read kmers that we don't want to store.

For simplicity, assume the entire FASTA file, across all contigs, only contains three unique minimizers (in reality, there will be many thousands or millions). We loop over the contigs and extract all minimizers, the contig ids and the location in the contig where a minimizer occurs. It could look something like this (in table form):

| minimizer (hashed) | contig_id | contig_loc |
|--|--|--|
|20 | 1| 3 	|
|20 | 2| 10 |
|50 | 1| 7 	|
|50	| 3| 14	| 
|90 | 3| 25 |
|20 | 1| 15 |
|... |... |... |

The first column is the hashed value of the minimizer. We have a total of three unique minimizers (with arbitrarily chosen values for this example of `20`, `50` and `90`).

The second column is the contig index. E.g., the first contig in the FASTA file gets index 1, the second gets index 2, etc.

The third column is the start position of a given minimizer in a given contig. E.g., the first row reads as "minimizer with hashed value `20` is present in contig 1 and starts at the third base".

Realistically, we won't build a table in Rust but something more along the lines of a `Vec<(u64, usize, usize)>`

### Sorting And Deduplicating
We want to deduplicate the minimizers because there is a lot of redundant information. In addition, to make the minimizer search later on more efficient we'll also sort on minimizer value. After sorting, we get something like this:

`sorted = [(20, 1, 3), (20, 2, 10), (20, 1, 15), (50, 1, 7), (50, 3, 14), (90, 3, 25)]`

Here, we have the first, very important observation:
- minimizer hash with value `20` corresponds to indices `0,1,2` in `sorted`.
- minimizer hash with value `50` corresponds to indices `3,4` in `sorted`.
- minimizer hash with value `90` corresponds to index `5` in `sorted`.

This will be our **offset**. We can now construct our first two arrays, `kmer_hashes` and `offset`. It will look like

```
kmer_hashes	=	[20, 50, 90] # deduplicated
offset		=	[0, 3, 5, 6]
```

These two arrays together read as <q>kmer hash with value `20` has an offset of `0 -> 2` (three indices). Kmer hash with value `50` has an offset of `3 -> 4` (two indices) and kmer hash with value `90` has an offset of `5` (one index)</q>. The last value, `6`, is the total number of `(contig_id, contig_location)` tuples we have and we'll soon see why we need this.

Finally, we extract our `(contig_id, contig_location)` tuples into the third and final `Vec`. We now have:

```
kmer_hashes	=	[20, 50, 90]
offset		=	[0, 3, 5, 6]
entries		=	[(1, 3), (2, 10), (1, 15), (1, 7), (3, 14), (3, 25)], 
```

### Querying
The reason why this approach is so brilliant will show in the example. Assume we have a read from the FASTQ file that we extract minimizers from. Assume we get minimizers `[35, 20, 48, 50, 10]`. We want to check which of these minimizers correspond to what contig and location.

We start with the first minimizer hash `35`. We do a binary search against `kmer_hashes`, which runs in `O(log(n))` time because it is sorted and deduplicated. We see that `35` does not exist, so we continue.

We check the next hash, which is `20`. The binary search returns index `0`. We now use this index to find the offset, which is `(offset[0], offset[1]) = (0, 3)`. Note that we earlier said that the offset for `20` maps to `0 -> 2`, not `0 -> 3`. This is okay because indices in Rust are end-exclusive. With our `offset = (0, 3)` we can now access our entries as `entries[offset[0]..offset[1]] = entries[0..3] = [(1, 3), (2, 10), (1, 15)]`.

Now, we also see why we needed to add `6`, which is the total number of `(contig_id, contig_location)` tuples. If we were to query hash `90`, we'd get index `2` in `kmer_hashes`, which is the value `5` in offset. Without adding the total number of tuples, we would not be able to access `(offset[2], offset[3])` because `offset[2] = 5` is the last element in `offset`. Technically, we could do `entries[offset[2]..]`, but we'd need to know that `offset[2]` is the last element in `offset`.

## In Practice
We've, in theory, built an index that is free of a `HashMap`. This has good potential in terms of performance because we can skip any overhead related to hashing and potential hash collisions. Instead, we index directly into contiguous memory segments which is incredibly fast. I honestly don't know of any Rust crate that implements this kind of index. There probably is one somewhere. Otherwise, we could build one ourselves using crates such as [bio](https://docs.rs/bio/latest/bio/) and [rayon](https://docs.rs/rayon/latest/rayon/).

Are there any disadvantages to our `HashMap`-free approach? Sure there are:
- We now have three different `Vec` instances to keep track of, instead of a single `HashMap`.
- We have to manually deduplicate kmer hashes. In a `HashMap`, this is a bit easier.
- The sorting step has a time complexity of `O(n log(n))`. We can, however, probably speed this up with Rayons `par_sort_by_key` function.

Honestly, I'm not sure which method is best. It probably depends factors such as the number of minimizers, their distribution and also each methods own bottlenecks.
