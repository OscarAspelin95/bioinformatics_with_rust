# Basics Of Alignment
## Introduction
In bioinformatics, alignment is the process of determining how well biological sequences match to each other. Usually, we refer to the sequences as the `query` and `subject` respectively. For simplicity, we'll assume that the `query` and `subject` both are single sequences.

There are three important alignment features to understand:
- Match.
- Mismatch.
- Insertion/Deletion.

In the following alignment, matches are shown with a vertical bar `|`, mismatches as asterisks `*` and insertions or deletions as hyphens `-`.

<pre>
query   AGCGACTCGTGCTCGA-CTT
        | |||||||*|||||| |||
subject A-CGACTCGAGCTCGAGCTT
</pre>

## Definitions
- `Query length` - The length of the query sequence. Here, we need to be a bit careful about if we mean either the original query length, or the length of the aligned part of the query.

- `Subject length` - The length of the subject sequence (either original or aligned, same reasoning as for query).

- `Alignment length` - The length of the aligned part between the query and subject.

- `Percent identity` - `100 * (num_matches / alignment_length)`. Here, we also need to be a bit careful since this metric only considers the aligned part of the query and subject. Theoretically, if our query and subject are of length 100, but they align only in the first 10 bases with no mismatches, this would be `percent identity` = `100` * (`10` / `10`) = `100`.

- `Fraction aligned (query)` - `query_length / alignment_length` (how much of the query is aligned). Here, we use the original query length.

- `Fraction aligned (subject)` - `subject_length / alignment_length` (how much of the subject is aligned). Here, we use the original subject length.

In the example below, we have the following alignment metrics:
<pre>
query   CATCGT
         ||||
subject  ATCG
</pre>

- `Query length` = `6` (original) or `4` (aligned).
- `Subject length` = `4` (original and aligned).
- `Alignment length` = `4`.
- `Percent Identity` = `100`.
- `Fraction aligned (query)` = `4` / `6` = `0.67`.
- `Fraction aligned (subject)` = `4` / `4` = `1.0`.

## Types Of Alignments
There are three basic types of alignments:
- `Global Alignment` - Aligns the entire query against the entire subject. Suitable if query and subject are of similar length, or one expects the entire query to align against the entire subject. An example is aligning two very similar genomes of roughly the same length.

<pre>
        ATCGATCG
        ||||||||
        ATCGATCG
</pre>

- `Semi Global Alignment` - Fully aligns the shorter of query/subject. An example is trying to align a gene (shorter) against an entire genome (longer).

<pre>
        CCCATCGTTT
           ||||
           ATCG
</pre>

- `Local Alignment` - Allows partial alignment of the query against the subject. This is the type of alignments that [BLAST](https://pubmed.ncbi.nlm.nih.gov/2231712/) outputs.
<pre>
        CCCATCGTTT
           ||||
        GGGATCGAAA
</pre>
