<img src="https://github.com/OscarAspelin95/bioinformatics_with_rust/blob/main/src/assets/rust-bio-gray.png" style="width: 200px; border-radius: 2em;"></img>


Welcome to [Bioinformatics with Rust](https://oscaraspelin95.github.io/bioinformatics_with_rust/), an introduction on how to write fast and memory safe bioinformatic applications! The project was created with [mdbook](https://github.com/rust-lang/mdBook), which enables the reader to run and edit Rust code interactively.

The purpose of this book is **not** to be an official introduction to neither Rust nor bioinformatics, but rather a resource for passionate bioinformaticians who are curious about the Rust programming language.

The book is structured into different chapters that cover both programmatic and bioinformatic concepts, along with interative Rust code where these concepts are implemented from scratch. These chapters are covered so far:

<div style="display:flex; flex-wrap: wrap;">
    <p style="margin: 10px;">
        🪄 Rust Basics:<br>
        &emsp;&emsp; ✔ Create a Project.<br>
        &emsp;&emsp; ✔ Syntax.<br>
        &emsp;&emsp; ✔ Keywords.<br>
        &emsp;&emsp; ✔ Common Macros.<br>
        &emsp;&emsp; ✔ Data Types.<br>
        &emsp;&emsp; ✔ Strings.<br>
        &emsp;&emsp; ✔ Array.<br>
        &emsp;&emsp; ✔ Vec.<br>
        &emsp;&emsp; ✔ Control Flow.<br>
        &emsp;&emsp; ✔ References.<br>
        &emsp;&emsp; ✔ Functions.<br>
        &emsp;&emsp; ✔ Enums.<br>
        &emsp;&emsp; ✔ Structs.<br>
        &emsp;&emsp; ✔ Option and Result.<br>
        &emsp;&emsp; ✔ Error Handling.<br>
        &emsp;&emsp; ✔ Ownership and Borrowing.<br>
        &emsp;&emsp; ✔ Lifetimes.<br>
        &emsp;&emsp; ✔ Iterator Chaining.<br>
        &emsp;&emsp; ✔ Concurrency.<br>
        &emsp;&emsp; ✔ Trait Bounds and Generics.<br>
    </p>
    <p style="margin: 10px;">
        🧬 The Basics of Nucleotides:<br>
        &emsp;&emsp; ✔ GC content.<br>
        &emsp;&emsp; ✔ Homopolymers.<br>
        &emsp;&emsp; ✔ Entropy.<br>
        &emsp;&emsp; 🚧 Compression.<br>
        &emsp;&emsp; 🚧 Filtering and Trimming.<br>
        &emsp;&emsp; ✔ Reverse Complement.<br>
        &emsp;&emsp; ✔ Encoding.<br>
    </p>
    <p style="margin: 10px;">
        🧬 The Basics of Alignment:<br>
        &emsp;&emsp; ✔ Hamming Distance.<br>
        &emsp;&emsp; ✔ Edit Distance.<br>
        &emsp;&emsp; ✔ Smith-Waterman.<br>
    </p>
    <p style="margin: 10px;">
        🧬 The Basics of Kmers:<br>
        &emsp;&emsp; ✔ Naive Implementation.<br>
        &emsp;&emsp; ✔ Bit Shift Encoding.<br>
        &emsp;&emsp; ✔ FracMinHash.<br>
        &emsp;&emsp; 🚧 SIMD vectorization.<br>
        &emsp;&emsp; ✔ Minimizers.<br>
        &emsp;&emsp; 🚧 Syncmers.<br>
    </p>
    <p style="margin: 10px;">
        🧬 Aminoacids:<br>
        &emsp;&emsp; Translation.<br>
    </p>
    <p style="margin: 10px;">
        🧬 Amplicon:<br>
        &emsp;&emsp; 🚧 In Silico PCR.<br>
        &emsp;&emsp; 🚧 Clustering.<br>
        &emsp;&emsp; 🚧 Classification.<br>
    </p>
    <p style="margin: 10px;">
        🖋️ Practical Excercises:<br>
        &emsp;&emsp; ✔ Create a basic fasta parser CLI.<br>
        &emsp;&emsp; ✔ Create a basic fastq filter CLI.<br>
    </p>
</div>

### Contributions
I'm currently a single person working on this project, so contributions are welcome! There are several things that can be improved, including but not limited to:
- Reworking some parts of the text for better clarity.
- Adding and improving on tests.
- Improving the actual Rust code.
- Adding entire new chapters.
- Enable using external crates for better code examples.
