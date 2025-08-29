# Argument Parsing
There are multiple ways to handle argument parsing in Rust. One easy way is to use [`std::env`](https://doc.rust-lang.org/book/ch12-01-accepting-command-line-arguments.html), but it quickly becomes rather complex when the number and types of arguments increase.

An alternative approach is to use [clap](https://docs.rs/clap/latest/clap/), which has worked really well for me personally. Defining arguments is as easy as defining a struct with a clap specific derive macro.

For reproducibility purposes, the code example uses the following Cargo.toml dependency:
```toml
[dependencies]
clap = { version = "4.5.39", features = ["derive"] }
```

Pretend we are creating a CLI called `fasta_cli` for filtering and parsing a FASTA file. These might be some of the arguments we think are relevant.

```rust,noplayground
use clap::Parser;
use clap::value_parser;
use std::path::PathBuf;

#[derive(Parser, Debug)]
struct Args {
    #[arg(short, long, help = "Path to fasta file.")]
    fasta: PathBuf,

    #[arg(long, default_value_t = 100, help = "Min allowed read length.")]
    min_len: usize,

    #[arg(long, default_value_t = 1000, help = "Max allowed read length.")]
    max_len: usize,

    #[arg(long, default_value_t = 15, value_parser = value_parser!(u16).range(7..31))]
    kmer_size: u16,

    #[arg(short, long, default_value_t = 8)]
    threads: usize,
}

fn main() {
    let args = Args::parse();

    // Now, we can access the values as args.fasta, args.min_len, etc.
}
```

Once compiled, we can run our binary as `fasta_cli --fasta <file.fasta> --min_len <min_len> --max_len <max_len> --kmer_size <kmer_size> --threads <threads>`.

Clap also supports more complex argument parsing, such as global flags, subcommands and enums. See e.g., [fastq_rs](https://github.com/OscarAspelin95/fastq_rs/blob/main/src/args.rs) for examples of this.
