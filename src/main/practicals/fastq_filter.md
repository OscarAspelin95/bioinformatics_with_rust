# Fastq filter
## Problem Description
Build a CLI tool `fastq_filter` that filters a gzipped fastq file based on length and gc content. The output should be a filtered and gzipped fastq file.

Expected command:<br>

`fastq_filter --fastq <file.fastq.gz> --outfile <filtered.fastq.gz> --min_len <usize> --max_len <usize> --min_gc <f32> --max_gc <f32>`


## Checklist
- [ ] Figure out how to read a gzipped file using `Flate2`.
- [ ] Create a function `run_fastq_filter` that:
    - [ ] Iterates over each read.
    - [ ] Calculate length and average gc content.
    - [ ] Only stores valid reads.
- [ ] Create a function `write_fastq` that:
    - [ ] Writes the valid reads to `outfile` in gzip format.
- [ ] Handle only files with extensions `.fastq.gz`, `.fq.gz`.

## Suggested Rust Crates
- [Clap](https://docs.rs/clap/latest/clap/) - argument parsing.
- [Needletail](https://docs.rs/needletail/latest/needletail/) - reading fastq files.
- [Flate2](https://docs.rs/flate2/latest/flate2/) - compression/decompression.


## Code Examples
- [fastq_rs](https://github.com/OscarAspelin95/fastq_rs)
