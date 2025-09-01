# Needletail
The [needletail](https://docs.rs/needletail/0.6.3/needletail/) crate is perfectly suited for reading and parsing FASTA and FASTQ files. It is very fast and efficient but not easily parallelized. Here, we'll outline a template for reading a fastq file and looping over each record.

For reproducibility purposes, the code example uses the following Cargo.toml dependency:

```toml
[dependencies]
needletail = { version = "0.6.3" }
```

```rust,noplayground
use needletail::parse_fastx_file;
use std::path::PathBuf;

fn main() {
    let fastx_file = PathBuf::from("file.fastq.gz");

    let mut reader = parse_fastx_file(&fastx_file).expect("Failed to initialize FastxReader.");

    while let Some(record) = reader.next() {
        let record = match record {
            Ok(record) => record,
            Err(_) => continue,
        };
    }

    // Do stuff with the record...
}
```

The advantage of using `parse_fastx_file` is that we can read both .fasta and .fastq files in plain or gzip format, which is very convenient.

Note that in this example, we just skip invalid records. In practice, we probably want to log that as a warning or error.
