<img src="https://github.com/OscarAspelin95/bioinformatics_with_rust/blob/main/src/assets/rust-bio-gray.png" style="width: 200px; border-radius: 2em;"></img>

# Bioinformatics with Rust

An introduction to writing fast and memory-safe bioinformatic applications in Rust. The book is built with [mdBook](https://github.com/rust-lang/mdBook), which lets reader run and (sometimes) edit Rust code interactively in the browser.

**Read it online:** [oscaraspelin95.github.io/bioinformatics_with_rust](https://oscaraspelin95.github.io/bioinformatics_with_rust/)

---

This is not an official introduction to Rust or bioinformatics. It is a resource for bioinformaticians who are curious about Rust and want to see how common bioinformatic concepts translate into idiomatic Rust code — implemented from scratch. Most importantly, this book references lots of crates that will make your life a bit easier.

---

## Contents

| Chapter | Topics |
|---|---|
| **Getting Started** | Setting up your environment |
| **Rust Basics** | A brief introduction to different Rust concepts |
| **File Formats Part 1** | FASTA, FASTQ |
| **Phred Score** | A background to error probability encoding and how to properly calculate mean errors |
| **Nucleotides** | Representations, Counting (GC Content, Homopolymers, Entropy), Manipulating (Compression, Reverse Complement, Trimming), Encoding |
| **Alignment** | Hamming Distance, Edit Distance (with Traceback), Smith-Waterman, Creating a Desktop App, Resources |
| **Kmers** | A First Implementation, Using Phred Scores, Bit Shift Encoding, FracMinHash, Minimizers, Syncmers |
| **Estimating Genome Size** | Kmer histograms, Deriving Genome Size|
| **Advanced Topics** | SIMD Vectorization, Building a Reverse Index |
| **Increasing Performance** | Tips and tricks for maximizing runtime performance |
| **Aminoacids** | Translation, Accounting for Frames, Improving the Translation Algorithm |
| **Amplicon** | In Silico PCR, Clustering, Classification |
| **Assembly** | Fundamentals of graphs, assemblers and methods |
| **Variant Calling** | 🚧 |
| **File Formats Part 2** | SAM, BAM, VCF, BED |
| **Data Structures** | Bloom filter |
| **Additional Topics| BLAST parser |
| **Blueprints** | Argument Parsing, Commands, DataFrames, Needletail, Bio |
| **Resources** | Awesome Rust Crates, Awesome Bioinformatic Tools |

---

## Contributions

This is a solo project and contributions are very welcome. Areas where help is particularly appreciated:

- Improving text clarity and fixing typos.
- Adding and improving tests.
- Improving Rust code quality.
- Adding new chapters or expanding existing ones.
- Enabling external crate usage for richer code examples.
