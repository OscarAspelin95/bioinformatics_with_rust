# Fastx Toolkit
It is suggested that both exercises `Fasta Parser` and `Fastq Filter` are completed before proceeding.

## Problem Description
Build a CLI tool `fastx_toolkit` for parsing and manipulating both fasta and fastq files.

Expected command:<br>

`fastx_toolkit <subcommand> --fastx <fastx_file> <optional args>`.

Where `subcommand` can be:
- `head` - output the `n` first sequences.
- `filter` - filter sequences based on relevant metrics, such as length, gc_content, etc.
- `sort` - sort sequences based on length.

## Checklist
- [ ] Figure out how `Clap` subcommands work.
- [ ] Define a dispatch function that, for given a subcommand, runs the correct function(s).
- [ ] Understand how needletail can be used to read a fasta or fastq file interchangably.
- [ ] Define common functions for reading/writing results.

## Suggested Rust Crates
- [Clap](https://docs.rs/clap/latest/clap/) - argument parsing.
- [Needletail](https://docs.rs/needletail/latest/needletail/) - reading fasta files.


## Code Examples
- [fasta_rs](https://github.com/OscarAspelin95/fasta_rs)
- [fastq_rs](https://github.com/OscarAspelin95/fastq_rs)

## Extra Credits
- [ ] Only allow input files with extensions `.fasta`, `.fa`, `.fsa`, `.fna`, `.fastq`, `.fastq.gz`.
- [ ] Graceful error handling.
- [ ] Replacing `Needletail` with `Bio` + `Rayon` to enable multi-threading.
