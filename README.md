<img src="https://github.com/OscarAspelin95/bioinformatics_with_rust/blob/main/src/assets/rust-bio-gray.png" style="width: 200px; border-radius: 2em;"></img>

# Bioinformatics with Rust

An introduction to writing fast and memory-safe bioinformatic applications in Rust. The book is built with [mdBook](https://github.com/rust-lang/mdBook), which lets readers run and edit Rust code interactively in the browser.

**Read it online:** [oscaraspelin95.github.io/bioinformatics_with_rust](https://oscaraspelin95.github.io/bioinformatics_with_rust/)

---

This is not an official introduction to Rust or bioinformatics. It is a resource for bioinformaticians who are curious about Rust and want to see how common bioinformatic concepts translate into idiomatic, performant Rust code — implemented from scratch.

---

## Contents

| Chapter | Topics |
|---|---|
| **Getting Started** | Setting up your environment |
| **Rust Basics** | Create a Project, Syntax, Keywords, Macros, Data Types, Strings, Array, Vec, Control Flow, References, Functions, Enums, Structs, Option and Result, Error Handling, Ownership and Borrowing, Lifetimes, Iterator Chaining, Concurrency, Trait Bounds and Generics, Smart Pointers |
| **File Formats** | FASTA, FASTQ |
| **Nucleotides** | Representations, Counting (GC Content, Homopolymers, Entropy), Manipulating (Compression, Reverse Complement), Encoding |
| **Alignment** | Hamming Distance, Edit Distance (with Traceback), Smith-Waterman, Creating a Desktop App, Resources |
| **Kmers** | A First Implementation, Using Phred Scores, Bit Shift Encoding, FracMinHash, Minimizers, Syncmers |
| **Advanced Topics** | SIMD Vectorization, Building a Reverse Index |
| **Aminoacids** | Translation, Accounting for Frames, Improving the Translation Algorithm |
| **Amplicon** | In Silico PCR, Clustering, Classification |
| **Practicals** | Fasta Parser CLI, Fastq Filter CLI, Fastx Toolkit CLI, Classifier CLI |
| **Blueprints** | Argument Parsing, Commands, DataFrames, Needletail, Bio |
| **Resources** | Awesome Rust Crates, Awesome Bioinformatic Tools |

---

## Contributions

This is a solo project and contributions are very welcome. Areas where help is particularly appreciated:

- Improving text clarity and fixing typos
- Adding and improving tests
- Improving Rust code quality and idioms
- Adding new chapters or expanding existing ones
- Enabling external crate usage for richer code examples
