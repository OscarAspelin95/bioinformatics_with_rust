# Extending parser
## Problem Description
Expand the fasta parser to calculate additional stats and only allow files with certain file endings.

Expected command:<br>

`fasta_stats --fasta <file.fasta> --outfile <outfile.json>`

Expected output file:
```
{
    num_sequences: usize,
    num_bases: usize,
    avg_len: f32,
    gc_content: f32,
}
```

## Checklist
- [ ] Extend `FastaStats` with the new fields.
- [ ] In `get_fasta_stats`:
    - [ ] Calculate number of bases.
    - [ ] Calcular average sequence length.
    - [ ] Calculate average gc content.
- [ ] Only allow input files with extensions `.fasta`, `.fa`, `.fsa`, `.fna`.

## Suggested Rust Crates
- [Clap](https://docs.rs/clap/latest/clap/) - argument parsing.
- [Needletail](https://docs.rs/needletail/latest/needletail/) - reading fasta files.
- [Serde](https://docs.rs/serde/latest/serde/) - serializing data.
- [Serde json](https://docs.rs/serde_json/latest/serde_json/) - serializing json.


## Code Examples
- [fasta_rs](https://github.com/OscarAspelin95/fasta_rs)
