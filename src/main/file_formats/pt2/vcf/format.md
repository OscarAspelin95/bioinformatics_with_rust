# Format
The VCF format is, similar to the SAM format, [versioned](https://samtools.github.io/hts-specs/VCFv4.5.pdf) and must follow strict rules. There are three main sections that make up a VCF file - meta, header and data.

## Meta Section
Lines prefixed by `##` belong to the meta section and contain relevant metadata. Some examples are

```
##fileformat=VCFv4.5
##reference=file:///path/to/reference.fasta
##contig=<ID=1,length=100000>
##INFO=<ID=AF,Number=A,Type=Float,Description="Allele Frequency">
##FILTER=<ID=q10,Description="Quality below 10">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">
##FORMAT=<ID=DP,Number=1,Type=Integer,Description="Read Depth">
```

where the uppercase `INFO`, `FILTER` and `FORMAT` are column/header names (see header section).

## Header Section
Prefixed by `#`, this row specifies the column names. Commonly, it looks something like

```
#CHROM POS ID REF ALT QUAL FILTER INFO FORMAT ...
```

where `...` can be an arbitrary number of sample ids.

|Header|Description|
| :-- | :-- |
|CHROM| Name of the contig|
|POS| 1-based position in the contig. E.g., `1` means the first base. |
|ID| Identifier name.|
|REF|Reference base|
|ALT| Alternative base (as evidenced by the reads)|
|QUAL| Phred-scaled quality score of the variant call|
|FILTER| Filter tags, as specified by the metadata section.|
|INFO| Info tags, as specified by the metadata section.|
|FORMAT| Format tags, as specified by the metadata section.|

## Data Section
Tab separated values, where each row corresponds to a single call. The context for which these values make sense are dictated by the meta and header sections. A mock VCF file with a single variant might look like this

```
##fileformat=VCFv4.5
##reference=file:///path/to/reference.fasta
##contig=<ID=1,length=100000>
##INFO=<ID=AF,Number=A,Type=Float,Description="Allele Frequency">
##FILTER=<ID=q10,Description="Quality below 10">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">
##FORMAT=<ID=DP,Number=1,Type=Integer,Description="Read Depth">
#CHROM POS ID REF ALT QUAL FILTER INFO FORMAT SAMPLE
1 10  A T 60 PASS AF=0.7 GT:GQ:DP 1:50:75
```

Which tells us that in base `10` in contig `1`, we have a potential variant (SNP `A -> T`) with a frequency of `0.7`.

Real VCF files are usually much more complex than this and we won't do a deep dive into every single detail. There are, however, two tags we'll look into a bit more: `GQ` and `GT`.

### Genotype Quality (GQ)
The GQ value is, similar to base and mapping quality, a phred encoded probability. Specifically, it is the probability that the genotype call is incorrect given that the site is a variant.

\\[ 
\text{call_error} = 10^{-\text{GQ}/10}
\\]

\\[
\text{GQ} = -10\cdot log_{10}({\text{call_error}})
\\]

### Genotype (GT)
This tag still confuses me even to this day. We won't cover *how* this value is produced since it is the variant callers job. We do, however, care about the *interpretation*. We need to keep three things in mind when interpreting the GT value: ploidy, alternate alleles and phasing.

#### Ploidy
Refers to the sample ploidy. For example, humans are diploid because we have two sets of each chromosome. This means we have to take both chromosomes into consideration during the variant call procedure because we can have variant(s) in either one, or both.

#### Alternate Alleles
Refers to how many alternative alleles we have. In the example below we have a position with *one* alternative allele.

<pre>
   ATCGT<font color=red>T</font>CG	reads
   ATCGT<font color=red>T</font>CG	
   ATCGT<font color=red>T</font>CG	
   ATCGT<font color=red>T</font>CG	
...ATCGTACG....	reference
</pre>

We see that `T` is the alternate. In practice, we could also have something like this

<pre>
   ATCGT<font color=red>T</font>CG	reads
   ATCGT<font color=red>G</font>CG	
   ATCGT<font color=red>G</font>CG	
   ATCGT<font color=red>T</font>CG	
...ATCGTACG....	reference
</pre>

where two alternate alleles `T` and `G` are present.

#### Phasing
Assume we have a human sample, meaning that variants can be maternal (inherited by mother) or paternal (inherited by father). How do we know which variants are maternal and which are paternal? The VCF file only tells us that variants exist, but not how they relate. This becomes more clear with an example.

<pre>
   ATCGT<font color=red>T</font>CG    GAGAGCGT<font color=red>C</font>A	reads
   ATCGT<font color=red>G</font>CG    GAGAGCGT<font color=red>C</font>A
   ATCGT<font color=red>G</font>CG    GAGAGCGT<font color=red>T</font>A
   ATCGT<font color=red>T</font>CG    GAGAGCGT<font color=red>T</font>A	
...ATCGTACG....GAGAGCGTGA	reference
</pre>

We have two variants `A -> T|G` in one position and two variants `G -> C|T` in another position. Since the sample is diploid, we have two sets of this chromosome, but we don't know if we have

<pre>
...ATCGT<font color=red>T</font>CG....GAGAGCGT<font color=red>C</font>A
...ATCGT<font color=red>G</font>CG....GAGAGCGT<font color=red>T</font>A
</pre>

Or

<pre>
...ATCGT<font color=red>T</font>CG....GAGAGCGT<font color=red>T</font>A
...ATCGT<font color=red>G</font>CG....GAGAGCGT<font color=red>C</font>A
</pre>

*Phasing* is the process of figuring this out. The details of how this works is out of scope, but we need to keep in mind that variants can be phased or unphased.


--------------

With these concepts in mind, we can now understand and interpret the GT value:
- Phasing is represented by either `/` for unphased or `|` for phased variants.
- The alternate allele is represented by an integer `0, 1, ...` where `0` is the reference.
- The ploidy is calculated as `num_phasing separators + 1`.

The table below lists some examles of GT values

|GT| REF | ALT | Phasing | Ploidy | Alternate Allele(s) |
| :-- | :-- | :-- | :-- | :-- | :-- |
|0| T | . | N/A| 1 | T (ref) |
|0/1| A| T | Unphased | 2 | A (ref), T | 
|1/2| A| T, G | Unphased | 2 | T, G |
|1\|2\|1\|2| C| A, T | Phased | 4 | A, T, A, T |

Lets dive into the last row a bit more. The phasing separator is "|", so these are phased. We have a total of 3 phasing separators, so the ploidy is `3 + 1 = 4` (tetraploid). `REF` tells us the reference base is `C` and `ALT` tells us there is some kind of evidence that our sample has `A` and `T` as alternatives. Finally, `1|2|1|2` maps to `A, T, A, T` because `A` is the first (1) alternate allele and `T` is the second (2).
