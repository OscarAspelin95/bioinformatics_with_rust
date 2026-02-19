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


## Quality, Phred Scores and Error Probabilities
There are three concepts we need to understand before proceeding:
- `Quality` - The ASCII character associated with a particular nucleotide. This is what is found in the actual FASTQ file. Can be converted to a `phred score` by taking the ASCII value and subtracting the phred offset (which is usually `33`). For example, `?` in ASCII corresponds to the value `63`. If the phred offset is `33` (depends on the sequencing machine), then our phred score is `63` - `33` = `30`.

- `Phred Score` - A logarithmically encoded error probability. These are integers that can be converted to error probabilities. E.g., a phred score of `30` corresponds to an error probability of `0.001`.

- `Error probabilities` - The probability that a particular nucleotide was called incorrectly by the sequencing machine. For example, a nucleotide `A` with error probability `0.001` means there is a 0.1% likelihood that this `A` is actually something else, like a `C`, `G` or `T`.


Since ASCII, phred scores and error probabilities are related, we can convert between them.

\\[ ASCII \iff phred \iff error \\]

Before we proceed with this, why are error probabilities not used directly in the FASTQ file? The answer is convenience, efficiency and discretization. We don't want the FASTQ file to contain lots of (potentially very small) floating point numbers. That would be messy and unfeasible.

We won't go through the [math](https://en.wikipedia.org/wiki/Phred_quality_score) regarding phred scores and error probabilities, but the equality looks something like this:

\\[ error = 10^{-(ASCII - \text{phred_offset})/10} \\]

We can now test this formula. Assume we'd want to convert `?` to an error probability using `phred_offset = 33`. This would equate to:

\\[ error = 10^{-(63 - 33)/10}  = 10^{-3} = 0.001 \\]

To make things a bit more concrete, we'll go through a code example of how to do this in Rust.

```rust

fn phred_to_err(phred: u8) -> f64 {
    10_f64.powf(-1.0 * ((phred - 33) as f64) / 10.0)
}

fn main() {
    assert_eq!(phred_to_err(b'?'), 0.001);
    assert_eq!(phred_to_err(b'5'), 0.01);
    assert_eq!(phred_to_err(b'+'), 0.1);
    assert_eq!(phred_to_err(b'!'), 1.0);
}
```

Note that the conversion from ASCII character to ASCII value is implicit by using `b'.'`.

## Phred Offset
Why are phred offsets even used? The reason is related to ASCII characters. More precisely, the first ASCII characters with values 0-31 are non printable characters so it does not make sense to use them. In addition, ASCII 32 corresponds to a space which also does not make sense to use.

The first usable character is therefore ASCII 33, which is `!`. To adjust for the fact that our <q>zero</q> starts at 33, we simply subtract 33.
