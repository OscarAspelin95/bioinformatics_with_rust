# Basics Of Alignment
## Introduction
In bioinformatics, alignment is the process of determining how well biological sequences match to each other. Usually, we refer to the sequences as the *query* and *subject* respectively. For simplicity, we'll assume that the query and subject both are single sequences.

There are three important alignment features to understand:
- Match.
- Mismatch.
- Insertion/Deletion.

In the following alignment, matches are shown with a vertical bar (|), mismatches as asterisks (*) and insertions or deletions as hyphens (-).

<pre>
query   AGCGACTCGTGCTCGA-CTT
        | |||||||*|||||| |||
subject A-CGACTCGAGCTCGAGCTT
</pre>

## Definitions
- *Query length* = The length of the query sequence.

- *Subject length* = The length of the subject sequence.

- *Alignment length* = The length of the aligned part between the query and subject.

- *Percent Identity* = 100 * (num_matches / alignment_length).

- *Fraction Aligned (Query)* = query_length / alignment_length (how much of the query is aligned).

- *Fraction Aligned (Subject)* = subject_length / alignment_length (how much of the subject is aligned).

## Types Of Alignments
There are three basic types of alignments:
- *Global Alignment* - Aligns the entire query against the entire subject. Suitable if query and subject are of similar length, or one expects the entire query to align against the entire subject. An example is aligning two very similar genomes of roughly the same length.

<pre>
        ATCGATCG
        ||||||||
        ATCGATCG
</pre>

- *Semi Global Alignment* - Fully aligns the shorter of query/subject. An example is trying to align a gene (shorter) against an entire genome (longer).

<pre>
        CCCATCGTTT
           ||||
           ATCG
</pre>

- *Local Alignment* - Allows partial alignment of the query against the subject.
<pre>
        CCCATCGTTT
           ||||
        GGGATCGAAA
</pre>
