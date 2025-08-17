# Why Rust?

## The different kinds of bioinformaticians
Bioinformatics encompasses lots of programming languages, from high level languages such as Python and R, to low level languages such as C and C++. The choice of language depends entirely on the target application. Below, I'll list my interpretation of the different kinds of bioinformaticians I know of:

- **The tool developer** - usually has a strong background in computer science and writes high-performance, open source tools for others to use. A name that comes to mind is [Heng Li](https://github.com/lh3).
    - Language of choice is usually C or C++.

- **The pipeline developer** - has a strong sense of what bioinformatic tools are suitable for which task. They are experts in chaining multiple tools together to create complete pipelines for a given application.
    - Language of choice is usually Python, R and/or Bash, preferably in combination with ChatGPT.

- **The yak-shaver** - is interested in the details of things. Does not hesitate to spend weeks or months building custom databases and reading through literature. Usually starts digging into things and has troubles stopping.
    - Language of choice is usually Python and/or Bash.

- **The jack-of-all-trades** - has no prominent strengths nor weaknesses. Good at multi-tasking and knows a bit about everything. Might not have the strongest background in bioinformatics or programming, but has very high versatility.
    - Language of choice is whatever gets the job done.

## Where the Rust programming language fits in
In my own experience, programming is complex and difficult. In addition, there are almost countless programming languages to choose from, each with their own pros and cons.

Traditionally, C and C++ have been used to write high-performance code because they are low level languages. You have to manage a lot of things, such as memory, manually. However, this comes with the advantage of experienced developers being able to write blazingly fast programs.

There is a fundamental problem with manual memory management - it is easy to introduce bugs and security vulnerabilities that can be hard to debug. This can be detrimental for performance-critical applications. Check out this [blogpost](https://security.googleblog.com/2024/10/safer-with-google-advancing-memory.html) as an example.

What is different about Rust? It prioritizes [memory safety](https://doc.rust-lang.org/nomicon/meet-safe-and-unsafe.html) in order to reduce the accidental introduction of bugs and security vulnerabilities, whilst maintaining high performance. In my opinion (coming from a Python background), this comes with a cost of added complexity. I would like to reference my favorite quote from some random person on the internet:

<q><em>The Rust compiler is stricter than my highschool chemistry teacher".</em></q>

When I started learning Rust, I'd agree with this statement. However, today I'd say it is a blessing rather than a curse.

To conclude, use Rust for bioinformatics if:
- You are interested in learning a low level, high performance language for bioinformatic applications.
- You want to create memory safe and performance critical bioinformatic pipelines.
- You want to traverse a steep learning curve, especially if coming from the Python world.


## Why Not Python?
Traditionally, Python has been used as a wrapper around bioinformatic software to generate capable pipelines with great success. It this is your only intent, it makes sense to stick to Python. It is easy to learn and has a straighforward syntax.

However, as soon as one diverges from this and aims for implementing any sort of high-performance library, Python is not your friend. It is usually too slow, even though libraries such as pandas (which is basically C in disguise) improve runtimes. Sure, one can use the C interoperability interface but this is a bit cumbersome and not inherently memory safe.


## Bioinformatic tools written in Rust
Finally, I just want to give a quick shoutout to some awesome bioinformatic tools written in Rust. There is actually quite a lot of bioinformatics-related crates available, but here are some of my favorites:
- [Bio](http://docs.rs/bio/latest/bio/) - General purpose bioinformatic tool for alignment, file processing and much more.
- [Sylph](https://github.com/bluenote-1577/sylph) - Metagenomic classification tool.
- [NextClade](https://github.com/nextstrain/nextclade) - Virus specific tool for alignment, SNP calling, clade assignment and more.

For a more exhaustive list, see [resources](../suffix/3_awesome_bioinformatic_tools.md).


## Alternatives To Rust
We'll finish this chapter off with listing some alternative programming languages, outside of Rust, that have been shown to work well within bioinformatics.
- `C/C++` - Lots of bioinformatic software (dare I say the majority?) is written is C and C++. Some examples that come to mind are [Minimap2](https://github.com/lh3/minimap2), [Freebayes](https://github.com/freebayes/freebayes) and [Flye](https://github.com/mikolmogorov/Flye).
- `Go` - Believe it or not, the fastx toolkit [Seqkit](https://github.com/shenwei356/seqkit) is actually written in Go.
- `Python` - Despite its downsides, there are some high performance bioinformatic applications written in Python (with C interoperability) such as [Cutadapt](https://github.com/marcelm/cutadapt/). This also includes machine learning modules such as [Medaka](https://github.com/nanoporetech/medaka).
- `Perl` - Yes you read that right. Perl might have been voted one of ugliest programming languages, regardless there is at least one awesome tool [SAMclip](https://github.com/tseemann/samclip) that makes the list.
- `Zig` - There might not be many existing bioinformatic tools written in Zig (yet), but due to its cross compilation functionality with C, I expect we'll see much more of this language in the coming years.
- `Mojo` - If I were to bet my money on any programming language becoming the go-to for bioinformatics, Mojo would be it. Designed to be a superset of Python (similar to what TypeScript is to JavaScript) whilst having similar performance to C and Rust, but with an intuitive GPU acceleration support, Mojo seems particularly promising within the field of bioinformatics.
- `R` - If you want a slow language, R is the way to go. With that said, there are seemingly endless R-packages for various bioinformatic applications, such as transcriptomics and metabolomics. In addition, it is actually awesome for generating beautiful plots with [ggplot2](https://ggplot2.tidyverse.org/).
