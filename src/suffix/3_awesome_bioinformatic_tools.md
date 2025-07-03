# Awesome bioinformatic tools
Alignment related:
- [Minimap2](https://github.com/lh3/minimap2) - Pairwise aligner. Written by the legendary [Heng Li](https://github.com/lh3). The go-to for Oxford Nanopore and PacBio data.
- [BWA-MEM](https://github.com/lh3/bwa) - Pairwise aligner suitable for Illumina data.
- [Parasail](https://github.com/jeffdaily/parasail) - General purpose pairwise aligner.
- [Parasail-rs](https://docs.rs/parasail-rs/latest/parasail_rs/) - Rust bindings for the parasail library.
- [BLAST](https://blast.ncbi.nlm.nih.gov/Blast.cgi) - The usual go-to for local sequence alignment.

Assembly related:
- [Flye](https://github.com/mikolmogorov/Flye) - Genome assembler for Oxford Nanopore or PacBio data.
- [IDBA](https://github.com/loneknightpy/idba) - Illumina specific genome assembler.
- [SPAdes](https://github.com/ablab/spades) - Genome assembler suitable for Illumina or IonTorrent data.

Variant calling related:
- [Clair3](https://github.com/HKU-BAL/Clair3) - Variant caller suitable for Illumina, Oxford Nanopore or PacBio data.
- [Medaka](https://github.com/nanoporetech/medaka) - Variant caller and polishing tool specifically for Oxford Nanopore data.
- [Freebayes](https://github.com/freebayes/freebayes) - Variant caller suitable for Illumina and IonTorrent data. Questionable use for Oxford Nanopore data.

Misc:
- [SAMtools](https://github.com/samtools/samtools) - SAM file manipulation.
- [BCFtools](https://github.com/samtools/bcftools) - VCF file manipulation.
- [Kmer-cnt](https://github.com/lh3/kmer-cnt) - Several kmer counting algorithms.

Tools written in Rust:
- [Needletail](https://docs.rs/needletail/latest/needletail/) - Parsing and processing FASTA/Q files.
- [Bio](http://docs.rs/bio/latest/bio/) - General purpose bioinformatic tool for alignment, file processing and much more.
- [Sylph](https://github.com/bluenote-1577/sylph) - Metagenomic classification tool.
- [Rust Htslib](https://docs.rs/rust-htslib/latest/rust_htslib/) - Rust bindings for Htslib.
- [NextClade](https://github.com/nextstrain/nextclade) - Virus specific tool for alignment, SNP calling, clade assignment and more.
