# Why Rust?

## The different kinds of bioinformaticians
Bioinformatics encompasses lots of programming languages, from high level languages such as Python and R, to low level languages such as C and C++. The choice of language depends entirely on the target application. Below, I'll list my interpretation of the different kinds of bioinformaticians I know of:

- **The tool developer** - usually has a strong background in computer science and writes high-performance, open source tools for others to use. A name that comes to mind is [Heng Li](https://github.com/lh3).
    - Language of choice is usually C or C++.

- **The pipeline developer** - has a strong sense of what bioinformatic tools are suitable for which task. They are experts in chaining multiple tools together to create complete pipelines for a given application.
    - Language of choice is usually Python, R and/or Bash, preferably in combination with ChatGPT.

- **The yak-shaver** - is interested in the details of things. Does not hesitate to spend weeks or months building custom databases and reading through literature. Usually start digging into things and has troubles stopping.
    - Language of choice is usually Python and/or Bash.

- **The jack-of-all-trades** - has no prominent strengths nor weaknesses. Good at multi-tasking and knows a bit about everything. Might not have the strongest background in bioinformatics or programming, but has very high versatility.
    - Language of choice is whatever gets the job done.

## Where the Rust programming language fits in
In my own experience, programming is complex and difficult. In addition, there are almost countless programming languages to choose from, each with their own pros and cons.

Traditionally, C and C++ have been used for high-performance code because they are low level languages. You have to manage a lot of things, such as memory, manually. However, this comes with advantage of experienced developers being able to write blazingly fast programs.

There is a fundamental problem with manual memory management - it is easy to introduce bugs and security vulnerabilities that can be hard to debug. This can be detrimental for performance-critical applications. Check out this [blogpost](https://security.googleblog.com/2024/10/safer-with-google-advancing-memory.html) as an example.

What is different about Rust? It prioritizes [memory safety](https://doc.rust-lang.org/nomicon/meet-safe-and-unsafe.html) in order to reduce the accidental introduction of bugs and security vulnerabilities, whilst maintaining high performance. In my opinion (coming from a Python background), this comes with a cost of added complexity. I want to reference my favorite quote from some random person from the internet - "The Rust compiler is stricter than my highschool chemistry teacher". When I started learning Rust, I'd agree with this statement. However, today I'd say it is a blessing rather than a curse.

To conclude, use Rust for bioinformatics if:
- You are interested in learning a high performance language for bioinformatic applications.
- You want to create memory safe and performance critical bioinformatic pipelines.
- You want to traverse a steep learning curve, especially if coming from the Python world.

Probably do not use Rust for bioinformatics if:
- You want to run a single open-source bioinformatics tool. I'd advice using Bash or Python.
- You want to quickly start developing bioinformatic piplines.

## Bioinformatic tools written in Rust
Finally, I just want to give a quick shoutout to some awesome bioinformatic tools written in Rust:
- [Bio](http://docs.rs/bio/latest/bio/) - General purpose bioinformatic tool for alignment, file processing and much more.
- [Sylph](https://github.com/bluenote-1577/sylph) - Metagenomic classification tool.
- [NextClade](https://github.com/nextstrain/nextclade) - Virus specific tool for alignment, SNP calling, clade assignment and more.
- [Herro](https://github.com/lbcb-sci/herro) - Deep-learning based error correction tool for Oxford Nanopore data.



For a more exhaustive list, visit [resources](../suffix/3_awesome_bioinformatic_tools.md).
