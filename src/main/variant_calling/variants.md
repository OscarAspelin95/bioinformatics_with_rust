# Variants
The whole point of variant calling is to figure out how our sample differs from our reference at the nucleotide level. There are multiple different ways that our sample can differ from the reference, some of which are explained below. The nomenclature is a bit tricky, but a good start is adhering to the [HGVS](https://hgvs-nomenclature.org/stable/) recommendations which we'll use throughout this chapter.

## Substitution
A [substitution](https://hgvs-nomenclature.org/stable/recommendations/DNA/substitution/) is defined as a sequence change where a **single** nucleotide is substituted with respect to the reference. For example, the reference contains an `A` at position `p` for `contig_1` but our sample indicates a `T`.


<pre>
reads
			  CGTG<font color=red>T</font>CGCG
			AGCGTG<font color=red>T</font>CGCGTT
		      GGAGCGTG<font color=red>T</font>CGCGTTGT
			AGCGTG<font color=red>T</font>CGCGTT
		   ATCGGAGCGTG<font color=red>T</font>CGCGTTG
reference	...ATCGGAGCGTGACGCGTTGTGA...
</pre>

Nomenclature wise, we show this as `[contig_name]:[coordinate_type].[pos][ref]>[alt]`, which is our case is `contig_1:g.pA>T` for an arbitrary position `p`. Here, `g` means a linear genomic reference. There are multiple coordinate types, all of which are defined by [HGVS](https://hgvs-nomenclature.org/stable/recommendations/general/).

## Deletion
A [deletion](https://hgvs-nomenclature.org/stable/recommendations/DNA/deletion/) is defined as a sequence change where nucleoties are deleted with respect to the reference. For example, a deletion of `A` at position `p` for `contig_1` would look like:

<pre>
reads
			  CGTG<font color=red>-</font>CGCG
			AGCGTG<font color=red>-</font>CGCGTT
		      GGAGCGTG<font color=red>-</font>CGCGTTGT
			AGCGTG<font color=red>-</font>CGCGTT
		   ATCGGAGCGTG<font color=red>-</font>CGCGTTG
reference	...ATCGGAGCGTGACGCGTTGTGA...
</pre>

We show this as `[contig_name]:[coordinate_type].[range]["del"]` where `range` is the deleted region and `"del"` is the literal word. In our case, we'd have `contig_1:g.pdel` where `p` is the range of the deleted base (in this case a single base so `range = p`). If multiple bases are deleted (such as `p`, `p+1` and `p+2`) then `range = p_p+2`.

## Insertion
An [insertion](https://hgvs-nomenclature.org/stable/recommendations/DNA/insertion/) is defined as a sequence change where nucleoties are inserted with respect to the reference. There is also an additional criteria, which is that the insertion must not be a copy of a sequence that is immediately 5'. For example, an insertion of `G` between positions `p-1` and `p` for `contig_1` would look like:

<pre>
reads
			  CGTG<font color=red>G</font>ACGCG
			AGCGTG<font color=red>G</font>ACGCGTT
		      GGAGCGTG<font color=red>G</font>ACGCGTTGT
			AGCGTG<font color=red>G</font>ACGCGTT
		   ATCGGAGCGTG<font color=red>G</font>ACGCGTTG
reference	...ATCGGAGCGTG ACGCGTTGTGA...
</pre>

We show this as `[contig_name]:[coordinate_type].[range]["ins"]` where `range` is the deleted region and `"ins"` is the literal word. In our case, we'd have `contig_1:g.p-1_pins`. Note that for an insertion, we always need two coordinates. In our case, `range = p-1_p` which corresponds to `G` and `A` respectively. This is because an insertion always occurs *between* two bases in the reference.

## Other Variants
Substitutions, deletions and insertions are only three of many different variants defined by HGVS. Other examples are duplications, inversions and delins. For a full list, please refer to the official [documentation](https://hgvs-nomenclature.org/stable/).
