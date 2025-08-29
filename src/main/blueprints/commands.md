# Commands
In Python, commands can easily be run with `subprocess` or through the very neat [`sh`](https://github.com/amoffat/sh) module.

In Rust, we can use `std::process::Command` to achieve something similar to `subprocess`. The example below shows how to call `minimap2` to align reads against a genome. We'll use `thiserror` to create two custom errors, the last of which will capture stderr if the command exits with a non-zero exitcode.

For reproducibility purposes, the code example uses the following Cargo.toml dependency:

```toml
[dependencies]
thiserror = { version = "2.0.16" }
```

Note, we obviously need `minimap2` installed in order for this code to work properly.
```rust,noplayground
use std::{path::PathBuf, process::Command};
use thiserror::Error;

#[derive(Debug, Error)]
enum RunCommandError {
    #[error("Failed to initialize child process.")]
    CommandInitError,

    #[error("Command exited with non-zero exit code.")]
    NonZeroExitCodeError(String),
}

fn minimap2_align(fastq: PathBuf, fasta: PathBuf, outfile: PathBuf) -> Result<(), RunCommandError> {
    let result = Command::new("minimap2")
        .arg(fastq)
        .arg(fasta)
        .arg("-o")
        .arg(outfile)
        .arg("-a")
        .output()
        .map_err(|_| RunCommandError::CommandInitError)?;

    match result.status.success() {
        true => Ok(()),
        false => Err(RunCommandError::NonZeroExitCodeError(
            String::from_utf8(result.stderr).unwrap(),
        )),
    }
}

fn main() {
    let fastq = PathBuf::from("reads.fastq.gz");
    let fasta = PathBuf::from("genome.fasta");
    let outfile = PathBuf::from("out.sam");

    minimap2_align(fastq, fasta, outfile).unwrap();
}
```

Why would we want to call `minimap2` from Rust instead of e.g., Python or Bash? In many cases, we wouldn't. If the goal is to simply align reads and parse the generated .sam file with SAMtools, then Python or Bash are probably better alternatives.

However, maybe our goal is to align reads and parse the .sam file with [rust_htslib](https://docs.rs/rust-htslib/latest/rust_htslib/) to calculate some more advanced alignment statistics that require high performance. Maybe we also had a Rust preprocessing step for the fastq file prior to alignment. In those cases, it *could* be justified to also call `minimap2` from Rust to make the codebase more unified.
