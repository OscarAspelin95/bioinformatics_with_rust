# FASTQ
The [FASTQ](https://en.wikipedia.org/wiki/FASTQ_format) format is similar to FASTA, but also associates each nucleotide with an error probability. This is relevant because it enables us to do things such as trimming, filtering and estimating sample quality. Each record takes up four lines:
1. Sequence id with an optional description. Must start with the `@` character.
2. Actual sequence.
3. `+`.
4. Quality ([ASCII](https://www.ascii-code.com/) encoded [phred scores](https://en.wikipedia.org/wiki/Phred_quality_score)).

In addition, the sequence and quality lines must contain the same number of characters. One simple example of a FASTQ record is:

```
@sequence_1
ATCG
+
????
```

which tells us that there is a record called `sequence_1` with the nucleotide sequence `ATCG` and associated qualities `????`. How do we know that these are nucleotides and not aminoacids? Strictly, we don't. However, the FASTQ format is almost exclusively used for nucleotides.

> [!TIP]
> The quality line in a FASTQ file uses ASCII-encoded phred scores. To understand how to convert characters like `?` to error probabilities, see the [Phred Score](../phred_score/introduction.md) chapter.
