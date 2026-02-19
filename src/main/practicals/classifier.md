# Classifier
In this exercise, a lot of concepts will come together to form a basic classifier.

## Problem Description
Build a CLI tool `classifier` for sequence classification of reads against a database. The output should be a .tsv file, containing the classification in sorted order. E.g., the database sequence with the best classification should be first in the list.

Expected command:

`classifier --fastq <reads.fastq.gz> --db <db.fasta>`.

Expected example output:

```
sequence_x  1.0
sequence y  0.95
sequence z  0.94
...
```
Where `sequence_x` was fully covered, `sequence_y` was 95% covered, etc. Define the `score` as 1.0 if 100% of the FracMinHash kmers from a sequence is contained in the reads.

## Checklist
- [ ] Implement FracMinHash generation for a given byte slice `&[u8]`.
- [ ] Generate FracMinHashes for all reads.
- [ ] Calculate the score for each db sequence.

## Suggested Rust Crates
- [Clap](https://docs.rs/clap/latest/clap/) - argument parsing.
- [Needletail](https://docs.rs/needletail/latest/needletail/) - reading fasta files.


## Code Examples
- Take inspiration from code examples in this book.

## Extra Credits
- [ ] Only allow input files with extensions `.fasta`, `.fa`, `.fsa`, `.fna` for the database file and `.fastq`, `.fastq.gz` for the reads.
- [ ] Graceful error handling.
- [ ] Replace `Needletail` with `Bio` + `Rayon` to enable multi-threading.
- [ ] Add a coverage metric to show the mean FracMinHash coverage for each sequence. Hint - don't use a `HashSet`, but rather a `HashMap` to count the FracMinHash read kmers.
