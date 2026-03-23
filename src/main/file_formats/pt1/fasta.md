# FASTA
The [FASTA](https://en.wikipedia.org/wiki/FASTA_format) format is a standardized way of storing biological sequences such as nucleotides and aminoacids. Each record occupies two lines:
1. Sequence id with an optional description. Must start with the `>` character.
2. Actual sequence.

A simple example of this is the following record:
```
>sequence_1
ATCG
```

which tells us that there is a record called `sequence_1` with the sequence `ATCG`. In this particular example, we actually do not know if these are nucleotides or aminoacids.

## Multi FASTA format
There is an alternative to the canonical FASTA format that is commonly referred to as multi FASTA format. Essentially what this means is distributing the sequence over multiple lines of a defined width. E.g., 60 characters per line.

For example, assume we have an arbitrary sequence of length 180. With width 60, it would look something like this.

```
>sequence_1
ATCG...AGAC # End of bases 1-60.
AGAG...TTTA # End of bases 61-120.
ACGC...AATG # End of bases 121-180.
```
