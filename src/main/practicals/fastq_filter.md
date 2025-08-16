# Fastq Filter
## Problem Description
Build a CLI tool `fastq_filter` that filters a gzipped fastq file based on length and gc content. The output should be a filtered and gzipped fastq file.

Expected command:

`fastq_filter --fastq <file.fastq.gz> --outfile <filtered.fastq.gz> --min_len <usize> --max_len <usize> --min_gc <f32> --max_gc <f32>`

## Checklist
- [ ] Figure out how to read a gzipped file using `Flate2`.
- [ ] Figure out out how write a needletail `SequenceRecord` to a target `output.fastq.gz` file.

## Suggested Rust Crates
- [Clap](https://docs.rs/clap/latest/clap/) - argument parsing.
- [Needletail](https://docs.rs/needletail/latest/needletail/) - reading fastq files.
- [Flate2](https://docs.rs/flate2/latest/flate2/) - compression/decompression.


## Code Examples
- [fastq_rs](https://github.com/OscarAspelin95/fastq_rs)

## Extra Credit
- [ ] Add functionality to also filter on mean error rate.
- [ ] Handle only files with extensions `.fastq.gz`, `.fq.gz`.
- [ ] Graceful error handling.
