# Pileup
The statistical power in variant calling mainly comes from the read depth. We leverage reads as evidence of variants with respect to our reference. In the image below, we have an indication of a substitution `A>T` with a read depth of `5` which is relatively low. The higher the read depth (to a certain extent), the more statistical power we have.

<pre>
reads
			  CGTG<font color=red>T</font>CGCG
			AGCGTG<font color=red>T</font>CGCGTT
		      GGAGCGTG<font color=red>T</font>CGCGTTGT
			AGCGTG<font color=red>T</font>CGCGTT
		   ATCGGAGCGTG<font color=red>T</font>CGCGTTG
reference	...ATCGGAGCGTGACGCGTTGTGA...
</pre>


> [!NOTE]
> Higher read depth is favorable within reason. Too high read depth most likely hurts more than it helps because the variant calling runtime might become unrealistically long.

## The Problem
To get the information in the image above, we need single base resolution that shows us what read bases aligned to a particular reference position. The problem is that a `.sam` or `.bam` file does not give us this. These formats just contain alignment information between individual reads and the reference. There is no <q>read aggregated</q> information per reference base.

## The Solution
We need to convert our `.sam` or `.bam` file to [pileup](https://en.wikipedia.org/wiki/Pileup_format) format. The pileup file is just another text file with the following columns

|Column| Name| Note |
| :-- | :-- | :-- |
|1| Chrom| Reference chromosome/contig name|
|2| Pos| 1-based position in `Chrom`|
|3| Ref| Reference base at `Pos`|
|4| Read Count| Number of reads covering this position|
|5| Base Information| Shows how the read bases agree or disagree with the reference base|
|6| Quality Information| ASCII encoded base quality for each read base|

We won't do a deep dive into the pileup format. Run `bcftools mpileup` and inspect the output, or even better, create your own parser using [rust-htslib](https://docs.rs/rust-htslib/latest/rust_htslib/).

> [!NOTE]
> Many variant calling softwares expect a `.bam` file and therefore perform the pileup conversion intrinsically.
