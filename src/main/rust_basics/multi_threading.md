# Multi-threading
In bioinformatics, multithreading can be vital and has the potential to decrease runtimes. Sometimes even by several magnitudes. The Rust [documentation](https://doc.rust-lang.org/book/ch16-00-concurrency.html) covers concurrency and multithreading in detail and there are also several crates that make multithreading easier to implement. Below is a list of Rust crates that work very well for creating fast and memory-safe bioinformatic applications:
- [Bio](https://docs.rs/bio/latest/bio/) - General purpose bioinformatic tool for e.g., parsing fastq/fasta files.
- [Rayon](https://docs.rs/rayon/latest/rayon/) - Data parallelism library that works well together with the Bio crate. Enables parallel processing of sequences through [par_bridge()](https://docs.rs/rayon/latest/rayon/iter/trait.ParallelBridge.html#tymethod.par_bridge).
- [DashMap](https://docs.rs/dashmap/latest/dashmap/) - Concurrent HashMaps and HashSets.

## Tips And Tricks
Below, I've gathered some tips and tricks when it comes to using multithreading with Rust, especially for bioinformatic applications.


### Start by creating a MVBA
A MVBA (Minimally Viable Bioinformatic Application) is something that runs and produces the expected output. I've found that starting out this way is easier, because one can always optimize the code later on. For me, it is tempting to start out writing the most optimized code from the beginning. However, I've learned that programming this way takes more time and is less productive.

### Optimize the MVBA
Once the MVBA is done, it is time to optimize. We must not forget this if we want an application that performs well under heavy loads. Optimization can be done in several ways, such as:
- Testing the application in release mode `cargo build --release`.
- Use a profiler such as [Samply](https://crates.io/crates/samply) to identify bottlenecks.
- Implement concurrency and multithreading if applicable.
- Using appropriate data structures.

### Multithreading is not always the answer
Even though multithreading is a useful tool within bioinformatics, there are cases where it might hurt more than it helps.

Cases where multithreading shines:
- CPU heavy loads (such as genome assembly, read alignment, etc).
- Tasks can be executed relatively independently.

Cases where multithreading might not be the answer:
- Tasks are extremely small and frequent.
- Each task is expected to take up a lot of RAM (risking out of memory error).

### Find code examples
One excellent way to learn about concurrency is to look at code examples. There is plenty of well-established open source Rust projects that use multithreading. As a start, here are some of my own not-so-well-established-and-work-in-progress projects:
- [sintax_rs](https://github.com/OscarAspelin95/sintax_rs) - Rust implementation of the SINTAX classifier.
- [ani_rs](https://github.com/OscarAspelin95/ani_rs) - Fast approximate genome similarity.
