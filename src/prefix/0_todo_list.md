# TODO list
Here are some things I'd want to add to this book, in no particular order:
- Misc:
    - Width of book, the end of some lines disappear to the right.
    - GC content for a sliding window of a long nucleotide string (with plot).
    - Break kmer bit shift into separate sections?

- Alignment:
    - Implement a local aligner (Smith-Waterman, with traceback).
    - Add support for finding all alignments from a local aligner?
    - Create a simple multiple sequence alignment?


- Visualization
    - Alignment visualization.
    - How to generate nice plots in Rust.

- Assembly:
    - The basics of assembly.
    - Build a De-Bruijn graph.
    - Build an overlap graph.
    - Eularian walk?
    - Section about the difficulties and challenges with assembly.

- Pipelines (how do we solve dependencies in mdbook?):
    - Basic BLAST pipeline.
    - Basic read alignment pipeline.
    - Basic assembly pipeline.
    - Metagenomic classification with sylph.
    - Kmer coverage pipeline from scratch:
        - Input is fastq and fasta file.
        - Outputs the kmer coverage for each contig in fasta file, based on kmers in fastq file.
    - [Based on previous point] - SINTAX classifier in Rust.
