# DataFrames
Reading and manipulating dataframes in Rust is actually not that easy. [Polars](https://docs.rs/polars/latest/polars/) is the crate to use for dataframes but honestly, the Rust API is not that good. In my opinion, it is much easier to either use the Python API, or simply use [pandas](https://pandas.pydata.org/) and completely skip Rust.

With that said, here is a small example of reading a .tsv file in Rust, using polars.


For reproducibility purposes, the code example uses the following Cargo.toml dependency:
```toml
[dependencies]
polars = { version = "0.50.0", features = ["lazy", "csv"]}
```

```rust,noplayground
use polars::prelude::*;

/// Assumes tab separated values and that the first line is the header.
fn tsv_to_df(tsv: &PathBuf) -> LazyFrame {
    let df = LazyCsvReader::new(PlPath::new(tsv.to_str().unwrap()))
        .with_separator(b'\t')
        .with_has_header(true)
        .with_truncate_ragged_lines(true)
        .finish()
        .expect("Failed to read tsv to DataFrame.");

    df
}

fn main() {
    let tsv: PathBuf = PathBuf::from("my_file.tsv");

    let df = tsv_to_df(&tsv);

    // Do stuff with the dataframe...
}
```
