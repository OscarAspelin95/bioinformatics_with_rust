# Estimating Genome Size
Now that we know a bit about kmers, let's look at a practical application - genome size estimation. Why is genome size interesting? Because it enables us to calculate *mean genome coverage* and also run *downsampling* if the sample is very large.

### Mean Genome Coverage
It is relevant to know that we have (on average) enough data to proceed with downstream bioinformatic analyses. For example, assume we have a FASTQ file that contains a known species with a genome size of 4Mbp. What would we consider an acceptable number of bases that our FASTQ file contains?

If the file contains a total of 4 million bases, we'd have a mean genome coverage of 1x. This would mean every base on average is covered a single time. This is a bit low because:
- Our genome assembly will be extremely fragmented.
- We don't have any statistical power for analyses such as variant calling. 

If the file contains 4 billion bases, we'd have a mean coverage of 1000x. This might be a bit too much because:
- Our genome assembly will take forever to run.
- At a certain point, higher coverage no longer provides new biological information — the returns diminish rapidly.


We define the *mean genome coverage* as

\\[ 
	\bar{C} = \frac{N}{G}
\\]

Where `N` is the number of bases and `G` is the genome size.

### Downsampling
If we have too low coverage, there is not much we can do other than to re-sequence the sample. On the other hand, if we have too high coverage we can *downsample* the FASTQ file. This means to remove data, based on some criteria, to reduce the mean genome coverage to a reasonable level. We can remove data in different ways, such as:
- **Randomly** - We just randomly remove reads until we reach our target coverage. This works well for Illumina data since the reads are roughly the same length.
- **Semi Randomly** - For Oxford Nanopore and PacBio data, it might make sense to not downsample completely randomly. The reason is that very, very long reads are often valuable. A common approach is to <q>lock</q> these reads to prevent them from being removed.
- **Custom** - We can decide custom metric(s) to downsample by. Maybe we prioritize to remove low complexity reads, low quality reads and reads that are too short. The possibilities here are endless.

We can calculate the *downsampling factor* as:

\\[ 
	DS = \frac{G \times \bar{C}}{N}
\\]

Where `G` is the genome size, `\bar{C}` is the target mean genome coverage and `N` is the number of bases.

As an example - with a genome size of 4Mbp, a target coverage of 100x and 4 billion bases in the FASTQ file, we'd calculate the downsampling factor as

\\[
	DS = \frac{4 \times 10^6 \times 100}{4 \times 10^9} = \frac{4 \times 10^8}{4 \times 10^9} = 10^{-1} = 0.1
\\]

And we'd need to remove 90% of all reads, quite a heavy downsample.

## Approaches
We've now seen that genome size is important for both mean genome coverage and downsampling. There are many different approaches to estimate the genome size. A few examples are:
- **Taxonomic classification**: Check the mean genome size of the identified species on NCBI. This works as long as the species is well characterized but only gives us a rough estimate.
- **Genome assembly**: calculate the total assembly size. The problem is that assembly is computationally expensive. If we don't need the assembly for any downstream analysis, we've probably wasted lots of resources.
- **Kmer Analysis**: This is the method we'll dive a bit deeper into. It uses kmer frequencies to produce relatively accurate genome size estimations with a relatively small computational footprint.
