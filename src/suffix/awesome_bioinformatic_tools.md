# Awesome bioinformatic tools
Alignment related:
- [Minimap2](https://github.com/lh3/minimap2) [C] - Pairwise aligner. Written by the legendary [Heng Li](https://github.com/lh3). The go-to for Oxford Nanopore and PacBio data.
- [BWA-MEM](https://github.com/lh3/bwa) [C] - Pairwise aligner suitable for Illumina data.
- [Parasail](https://github.com/jeffdaily/parasail) [C] - General purpose pairwise aligner.
- [Parasail-rs](https://docs.rs/parasail-rs/latest/parasail_rs/) [Rust] - Rust bindings for the parasail library.
- [BLAST](https://blast.ncbi.nlm.nih.gov/Blast.cgi) [C++] - The usual go-to for local sequence alignment.
- [MAFFT](https://mafft.cbrc.jp/alignment/server/index.html) - Multiple sequence aligner.
- [Clustal Omega](https://www.ebi.ac.uk/jdispatcher/msa/clustalo) - Multiple sequence aligner.

Assembly related:
- [Flye](https://github.com/mikolmogorov/Flye) [C/C++] - Genome assembler for Oxford Nanopore or PacBio data.
- [IDBA](https://github.com/loneknightpy/idba) [C++] - Illumina specific genome assembler.
- [SPAdes](https://github.com/ablab/spades) [C++] - Genome assembler suitable for Illumina or IonTorrent data.

Variant calling related:
- [Clair3](https://github.com/HKU-BAL/Clair3) [Python] - Variant caller suitable for Illumina, Oxford Nanopore or PacBio data.
- [Medaka](https://github.com/nanoporetech/medaka) [Python] - Variant caller and polishing tool specifically for Oxford Nanopore data.
- [Freebayes](https://github.com/freebayes/freebayes) [C++] - Variant caller suitable for Illumina and IonTorrent data. Questionable use for Oxford Nanopore data.

Misc:
- [SAMtools](https://github.com/samtools/samtools) [C] - SAM file manipulation.
- [BCFtools](https://github.com/samtools/bcftools) [C] - VCF file manipulation.
- [Kmer-cnt](https://github.com/lh3/kmer-cnt) [C] - Several kmer counting algorithms.
- [Seqkit](https://github.com/shenwei356/seqkit) [Go] - Parsing and processing FASTA/Q files.
- [Tablet](https://ics.hutton.ac.uk/tablet/) [Java] - Graphical alignment visualizer.
- [Bandage](https://github.com/rrwick/Bandage) [C++] - Assembly graph visualizer.

Tools written in Rust:
- [Needletail](https://docs.rs/needletail/latest/needletail/) [Rust] - Parsing and processing FASTA/Q files.
- [Bio](http://docs.rs/bio/latest/bio/) [Rust] - General purpose bioinformatic tool for alignment, file processing and much more.
- [Bio-seq](https://docs.rs/bio-seq/latest/bio_seq/) [Rust] - Toolbox for bit-packed biological sequences.
- [Sylph](https://github.com/bluenote-1577/sylph) [Rust] - Metagenomic classification tool.
- [Rust Htslib](https://docs.rs/rust-htslib/latest/rust_htslib/) [Rust] - Rust bindings for Htslib.
- [Nextclade](https://github.com/nextstrain/nextclade) [Rust] - Virus specific tool for alignment, SNP calling, clade assignment and more.
- [Herro](https://github.com/lbcb-sci/herro) [Rust] - Deep-learning based error correction tool for Oxford Nanopore data.
