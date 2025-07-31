# Concurrency
In bioinformatics, concurrency can be vital and has the potential decrease runtimes. Sometimes even by several magnitudes. The Rust [documentation](https://doc.rust-lang.org/book/ch16-00-concurrency.html) covers concurrency in detail and there are also several crates that make concurrency easier to implement. Below is a list of Rust crates that work very well for creating fast, concurrent and memory-safe bioinformatic applications:
- [Bio](https://docs.rs/bio/latest/bio/) - General purpose bioinformatic tool for e.g., parsing fastq/fasta files.
- [Rayon](https://docs.rs/rayon/latest/rayon/) - Data parallelism library that works well together with the Bio crate. Enables parallel processing of sequences through [par_bridge()](https://docs.rs/rayon/latest/rayon/iter/trait.ParallelBridge.html#tymethod.par_bridge).
- [DashMap](https://docs.rs/dashmap/latest/dashmap/) - Concurrent HashMaps and HashSets.


## Tips And Tricks
Below, I've gathered some tips and tricks when it comes to using concurrency with Rust, especially for bioinformatic applications.

### Start by creating a MVBA
A MVBA (Minimally Viable Bioinformatic Application) is something that runs and the produces the expected output. I've found that starting out this way is easier, because one can always optimize the code later on. For me, it is tempting to start out by trying to create the most optimized code from the beginning. However, I've learned that programming this way takes more time and is less productive.

### Optimize the MVBA
Once the MVBA is done, it is time to optimize. We must not forget this if we want an application that performs well under heavy loads. Optimization can be done in several ways, such as:
- Testing the application in release mode (cargo build --release).
- Use a profiler such as [Samply](https://crates.io/crates/samply) to identify bottlenecks.
- Implement concurrency if applicable.
- Using appropriate data structures. Maybe a Vec is not always the best approach?

### Concurrency is not always the answer
Even though concurrency is a useful tool within bioinformatics, there are cases where it might hurt more than it helps.

Cases where concurrency shines:
- CPU heavy loads (such as genome assembly, read alignment, etc).
- Tasks can be executed relatively independently.

Cases where concurrency might not be the answer:
- Tasks are extremely small and frequent.
- Each task is expected to take up a lot of RAM (risking out of memory error).

### Find code examples
One excellent way to learn about concurrency is to look at code examples. There is plenty of well-established open source Rust projects that use concurrency. As a start, here are some of my own not-so-well-established-and-work-in-progress projects:
- [fastq_rs](https://github.com/OscarAspelin95/fastq_rs) - Fastq parser.
- [sintax_rs](https://github.com/OscarAspelin95/sintax_rs) - Rust implementation of the SINTAX classifier.
- [is_pcr_rs](https://github.com/OscarAspelin95/is_pcr_rs) - In silico PCR of exact primer matches.
