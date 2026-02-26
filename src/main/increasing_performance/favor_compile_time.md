# Favor Compile Time
A general rule I've found to work quite nicely is to favor compile time when possible. An excellent example of this is our lookup tables for nucleotide encoding and phred-score-to-error. 

## Lookup Tables
> [!TIP]
> As of recent Rust versions, many use cases for `lazy_static!` can be replaced with `std::sync::LazyLock` (stabilized in Rust 1.80). Consider this alternative for simpler, dependency-free compile-time initialization.

We can use the [lazy_static](https://docs.rs/lazy_static/latest/lazy_static/) crate to define static lookup tables. In the code example below, we define two lookup tables:
* One for converting ASCII characters to nucleotide encoding.
* One for converting ASCII qualities to error probabilities.

```rust
use lazy_static::lazy_static;

const PHRED_OFFSET: usize = 33;
const MAX_PHRED_INDEX: usize = 93;

lazy_static! {
    pub static ref NT_LOOKUP: [u8; 256] = {
        let mut table = [4u8; 256];

        for i in 0u8..=255 {
            table[i as usize] = match i {
                b'A' | b'a' => 0,
                b'C' | b'c' => 1,
                b'G' | b'g' => 2,
                b'T' | b't' | b'U' | b'u' => 3,
                _ => 4,
            };
        }

        table
    };

    pub static ref PHRED_TO_ERROR: [f64; MAX_PHRED_INDEX + 1] = {
        let mut error_lookup = [1.0; MAX_PHRED_INDEX + 1];

        for (i, entry) in error_lookup.iter_mut().enumerate().skip(PHRED_OFFSET) {
            *entry = 10_f64.powf(-((i - PHRED_OFFSET) as f64) / 10.0);
        }

        error_lookup
    };
}
```

At least for `PHRED_TO_ERROR`, the advantage of using a static lookup table is obvious. We avoid repeated calculations of 

\\[ \text{error_probability} = 10^{-phred/10}\\]

since the values are now <q>cached</q> in the lookup table. Note that in the code above, we also cap the ASCII value `93`, which corresponds to a phred score of `93 - 33 = 60` (an error probability of `10e-6`). This is optional, but avoids storing non-sensically low error probabilities that are very rarely encountered. The disadvantage of this approach is that when iterating over the ASCII qualities in a FASTQ record, we must make sure to cap the quality at `93` before indexing into the lookup table.
