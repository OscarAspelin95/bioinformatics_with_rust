# Fasta Parser
## Problem Description
Build a CLI tool `fasta_stats` that calculates the number of sequences for a provided fasta file and writes the results to a json file.

- Input argument: `--fasta <file.fasta>`
- Output argument: `--outfile <outfile.json>`

Expected command:

`fasta_stats --fasta <file.fasta> --outfile <outfile.json>`

Expected contents of output file:
```
{
    num_sequences: usize,
}
```

## Checklist
- [ ] Define a struct for CLI arguments with clap.
- [ ] Define a struct `FastaStats` for storing calculated stats.
- [ ] Define a function `get_fasta_stats` that takes `fasta: PathBuf` and `outfile: PathBuf` as arguments.
    - [ ] Iterate over fasta records and keep track of `num_sequences`.
    - [ ] Store `num_sequences` in an instance of `FastaStats`
- [ ] Define a function `write_json` that writes the `FastaStats` instance to `outfile`.

## Suggested Rust Crates
- [Clap](https://docs.rs/clap/latest/clap/) - argument parsing.
- [Needletail](https://docs.rs/needletail/latest/needletail/) - reading fasta files.
- [Serde](https://docs.rs/serde/latest/serde/) - serializing data.
- [Serde json](https://docs.rs/serde_json/latest/serde_json/) - serializing json.


## Code Examples
- [fasta_rs](https://github.com/OscarAspelin95/fasta_rs)

## Extra Credits
- [ ] Only allow input files with extensions `.fasta`, `.fa`, `.fsa`, `.fna`.
- [ ] Add more stats: average sequence length, average gc content and total number of bases.
- [ ] Graceful error handling.
