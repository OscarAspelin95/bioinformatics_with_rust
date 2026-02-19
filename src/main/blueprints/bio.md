# Bio
An alternative needletail is the [bio](https://docs.rs/bio/latest/bio/) crate. This fastq reader is not as fast as needletail and does not natively handle both gzipped files. It is however easily parallelized with [rayon](https://docs.rs/rayon/latest/rayon/) using `par_bridge()`. In the following example, we use [flate2](https://docs.rs/flate2/latest/flate2/) together with rayon and `bio::io::fastq::Reader` to enable multi-thread support for gzipped fastq files. For a FASTA equivalent reader, check out `bio::io::fasta::Reader`.

For reproducibility purposes, the code example uses the following Cargo.toml dependencies:

```toml
[dependencies]
bio = { version = "2.3.0" }
flate2 = { version = "1.1.2" }
rayon = { version = "1.10.0" }
```

```rust,noplayground
use bio::io::fastq::Reader;
use flate2::read::MultiGzDecoder;
use rayon::prelude::*;
use std::{fs::File, path::PathBuf};

fn main() {
    let fastq_file = PathBuf::from("file.fastq.gz");

    let f = File::open(fastq_file).expect("Failed to open provided file.");

    // Wrap in GzDecoder since file is in gzip format.
    let gzip_reader = Reader::new(MultiGzDecoder::new(f));

    gzip_reader.records().par_bridge().for_each(|record| {
        let record = match record {
            Ok(record) => record,
            Err(_) => return,
        };

        // Do stuff with the record...
    });
}
```

Since `.records()` returns an iterator, we can apply loads of different iterator chaining steps here, such as `.map()` or `.filter_map()` followed by `.collect()`.

**A word of caution** - multithreading is great in certain circumstances, but not all. If the processing time for each record is very short, for example if we only calculate the length of each record, multithreading probably does not help. It might actually be slower. In those cases, needletail is probably a better alternative.
