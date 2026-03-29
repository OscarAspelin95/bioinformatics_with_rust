# Format
A BED file contains a minimum of three columns (covered in this book), with an additional nine optional ones (out of scope in this book). All columns are either space or tab separated.

|Column nr | Name| Type| Description |
| :-- | :-- | :-- | :-- |
|1|`chrom`| string | Chromosome name|
|2| `start`| int | Start of region (0-based, inclusive) |
|3| `end`| int| End of region (0-based, exclusive) |

A more thorough introduction to the BED format can be found [here](https://samtools.github.io/hts-specs/BEDv1.pdf). 

## Coordinates
One might wonder why the start coordinate is inclusive and the end coordinate is exclusive. The reason is that it makes it very easy to calculate the length of a region:

\\[
	\text{region_len} = end - start
\\]

For example, the first base `A` of a chromosome `chr1` with sequence `ATCGTGC` in BED format would look like

|chrom|start|end|
| :-- | :-- |:-- |
|chr1|0|1|

Where `start = 0` means the **inclusive** first base `A` and `end = 1` means the **non-inclusive** (exclusive) second base `T`. The region length is `1 - 0 = 1`.

The table below shows the different regions we can represent for `ATCGTGC` by starting from the first base `A` and monotonically increasing the range by one base.

|chrom|start|end|region|length|
| :-- | :-- |:-- | :-- | :-- |
|chr1|0|1|`A`| 1|
|chr1|0|2|`AT`| 2|
|chr1|0|3|`ATC` | 3|
|...|...|...|...|...|
|chr1|0|7|`ATCGTGC`| 7|

This is where some of the confusion (at least for me) usually sets in. We just said that the end base is exclusive - how can we capture the entire sequence `ATCGTGC (length 7)` if we set `end = 7` and it is exclusive? Wouldn't we get `length = 6` instead of `length = 7`?

Actually, no. It makes sense to look at this schematically. If the first base has index `0`, then the sequence `ATCGTGC` has the following indices:

<pre>
A T C G T G C
0 1 2 3 4 5 6
</pre>

The last base has `index = 6`, but since we start at `0`, we have a total of `num_bases = len({0, 1, 2, 3, 4, 5, 6}) = 7`. It might help to think of individual bases as being 0-based (first base has index `0`, second base has index `1`, ...). We usually think of ranges as **between** two bases.

> [!NOTE]
> The BED format strictly enforces `start >= end`, regardless of strand orientation.
>
> `start = end` represents an *insertion* before the preeeding base.
>
> `start = end = 0` represents a feature that occurs *before* the entire chromosome.


## Use Cases
BED files are used in many different bioinformatic applications. For example:
* Gene coordinates (although the `gff` format is more commonly used for this)
* Regions we want to mask or skip, for example low coverage regions during variant calling.
