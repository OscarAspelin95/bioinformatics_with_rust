# Topic Suggestions for Bioinformatics with Rust

A comprehensive review of the book's current content, with suggestions for new chapters,
expanded sections, and supplementary material.

> **Constraint:** All code examples must run in the Rust Playground. This means only crates
> available there can be used: `rayon`, `serde`/`serde_json`, `rand`, `regex`, `itertools`,
> `ndarray`, `petgraph`, `flate2`, `csv`, `hashbrown`, `smallvec`, `anyhow`/`thiserror`,
> and similar general-purpose crates. Bioinformatics crates (`bio`, `needletail`, `noodles`,
> `rust-htslib`) are not available and should not be used in examples — all parsing and
> algorithms must be implemented from scratch.

---

## Summary of Current Coverage

The book covers:
- Rust basics (comprehensive)
- File formats: FASTA, FASTQ
- Phred scores and quality
- Nucleotide operations: GC content, reverse complement, entropy, masking, encoding
- Pairwise alignment: Hamming, Levenshtein, Smith-Waterman
- Kmers: generation, bit encoding, minimizers, syncmers, FracMinHash
- Genome size estimation via kmer histograms
- Aminoacids: codon tables, translation, reading frames
- Amplicon sequencing: in silico PCR, clustering, classification
- Genome assembly: overlap/De Bruijn graphs, read overlaps
- Performance optimization: SIMD, multithreading, data structures
- Blueprints: CLI patterns, Needletail, Bio crate, DataFrames

---

## Suggested New Chapters

### 1. File Formats (Expanded)

The current file formats chapter covers only FASTA and FASTQ. A dedicated expanded chapter
would significantly increase practical value. All parsers are implemented from scratch since
bioinformatics crates are not available in the Playground.

**Topics to add:**

- **SAM format** — The standard alignment output format. SAM is plain tab-separated text,
  making it fully parsable from scratch. Cover the two sections: header lines (`@HD`, `@SQ`,
  `@RG`, `@PG`) and alignment records with their 11 mandatory fields (QNAME, FLAG, RNAME,
  POS, MAPQ, CIGAR, RNEXT, PNEXT, TLEN, SEQ, QUAL). Implement a struct and a line-by-line
  parser. Note: BAM is the binary compressed equivalent and requires external tooling; SAM
  is sufficient to teach the concepts.

- **CIGAR strings** — Alignment representation within SAM. Parse the run-length encoded
  CIGAR string (e.g. `3M1I4M2D`) into a `Vec` of `(count, operation)` tuples. Implement
  functions to compute aligned length, query length consumed, and reference length consumed
  from a CIGAR.

- **VCF format** — Variant Call Format for storing SNPs and other variants. The format is
  plain text; implement a minimal parser from scratch. Cover meta-information header lines
  (`##`), column header (`#CHROM`), and the mandatory eight columns (CHROM, POS, ID, REF,
  ALT, QUAL, FILTER, INFO). Show how to read the INFO field as key-value pairs.

- **BED format** — Genomic intervals as tab-separated text (CHROM, START, END, plus
  optional name/score/strand fields). Implement a parser and an interval overlap check.
  Discuss 0-based half-open coordinates and the common off-by-one error when converting
  to/from 1-based formats.

- **GFF3 format** — Feature annotation format. Parse the nine fields (seqname, source,
  feature, start, end, score, strand, frame, attributes). The attributes column is a
  semicolon-separated list of `key=value` pairs; implement a parser for it.

---

### 2. Sequence Indexing and Search

The book touches on index structures in the assembly chapter but a dedicated chapter on
indexing would be valuable. All implementations from scratch.

**Topics:**

- **Suffix arrays** — Lightweight index for exact pattern search. Build a suffix array by
  sorting suffixes (simple O(n² log n) approach first, then mention SA-IS for context).
  Implement binary search against the suffix array to find all occurrences of a pattern.

- **Burrows-Wheeler Transform (BWT)** — Derive the BWT from a suffix array. Show the
  last-first (LF) mapping property and implement backward search to count occurrences of a
  pattern. This is the foundation of BWA and Bowtie.

- **FM-index** — Extend the BWT with sampled suffix array and occurrence table to achieve
  O(m) pattern search where m is the query length. Walk through the data structures and
  implement a minimal version.

- **Bloom filters** — Probabilistic set membership for kmer screening. Implement from
  scratch: a fixed-size `Vec<bool>` (or bit array using `u64`), multiple hash functions
  derived from two base hashes (double hashing), insertion, and lookup. Explain the
  false-positive rate formula and how to choose size and hash count.

- **Count-min sketch** — Approximate kmer frequency counting with bounded memory. Implement
  with a 2D array of counts and multiple hash functions. Show that estimates are upper
  bounds on true counts.

---

### 3. Variant Calling

Going from an alignment to a list of variants is one of the most common tasks in genomics.
All implementations from scratch using parsed SAM text.

**Topics:**

- **Types of variants** — SNPs, MNPs, small indels, structural variants (deletions,
  inversions, copy-number variants). Focus on small variants that can be detected from
  basic pileup.

- **Pileup** — Compute per-position base counts from SAM records. Implement a pileup loop:
  parse CIGAR operations to project query bases onto reference coordinates, tally bases and
  quality scores per position.

- **Simple haploid SNP calling** — Bayesian genotype likelihood model. Define prior
  probability, compute likelihood as product of base error probabilities (from Phred
  scores), calculate posterior. Implement a minimal caller that emits candidate SNPs above
  a confidence threshold.

- **VCF output** — Write a well-formed VCF from scratch. Implement a function that formats
  variant calls into tab-separated VCF lines with the correct header.

---

### 4. RNA and Transcriptomics

The book explicitly focuses on DNA. Adding an RNA chapter would cover a large, practical
domain. All algorithms from scratch.

**Topics:**

- **RNA biology basics** — mRNA, rRNA, tRNA, miRNA, lncRNA. Key differences from DNA:
  uracil instead of thymine, single-stranded, post-transcriptional modification. Adjust the
  reverse-complement function for RNA (U instead of T).

- **RNA-seq read preprocessing** — Adapter trimming and quality filtering using the same
  Phred machinery already covered. The algorithms are identical to DNA preprocessing;
  highlight what changes (adapter sequences, poly-A tails).

- **Pseudo-alignment and quantification** — Explain the kmer compatibility approach behind
  tools like Kallisto. Build a simplified transcript-to-kmer index (`HashMap<u64, Vec<usize>>`
  mapping encoded kmer to transcript IDs) and show how reads are assigned to transcripts
  by kmer intersection — no full alignment needed.

- **Transcript assembly (splicing)** — Splice junctions, exon graphs, the challenge of
  isoform reconstruction. Contrast with genome assembly: the graph nodes represent exons,
  edges represent splice junctions supported by split reads.

- **Count matrices and normalization** — Construct a gene-by-sample count matrix. Implement
  CPM and TPM normalization from scratch. Use `serde_json` or `csv` (both Playground-
  available) to read/write count data.

---

### 5. Metagenomics

Shotgun metagenomics maps naturally onto the existing kmer and assembly content.

**Topics:**

- **Community profiling** — Estimating the taxonomic composition of a mixed-organism
  sample. Contrast read-level kmer classification (exact kmer matches to a taxonomic
  reference database) with alignment-based methods.

- **Taxonomic tree structures** — Represent the NCBI taxonomy as a tree: nodes are taxon
  IDs, edges are parent-child relationships. Implement with `petgraph` (Playground-available)
  or a simple `HashMap<u32, u32>` (child → parent). Support traversal from a leaf to the
  root to build a full lineage.

- **Lowest common ancestor (LCA)** — When a read's kmers match multiple taxa, assign it
  to their LCA. Implement LCA using the parent map: walk both nodes to the root and find
  the first shared ancestor.

- **Relative abundance estimation** — Convert read counts to relative abundances.
  Implement a genome-size-corrected relative abundance calculation and discuss the
  compositionality problem.

---

### 6. Multiple Sequence Alignment (MSA)

The current alignment chapter covers only pairwise methods. MSA is essential for
phylogenetics and comparative genomics. All algorithms from scratch.

**Topics:**

- **The MSA problem** — Why extending pairwise DP to N sequences exactly is exponential.
  Overview of heuristic approaches.

- **Pairwise distance matrix** — Compute all N(N-1)/2 pairwise edit distances from the
  Levenshtein implementation already in the book. Represent as a 2D `Vec` or use `ndarray`
  (Playground-available) for a matrix.

- **Progressive alignment** — Build a guide tree from the distance matrix using UPGMA
  (implement from scratch: find minimum-distance pair, merge, update distances). Then align
  sequences following the tree using profile-profile alignment.

- **Profile alignment** — Represent a partial MSA as a position-specific frequency matrix
  and align a new sequence to it using a modified DP.

- **Consensus sequences** — Derive a single representative from an MSA by majority vote
  at each column. Output IUPAC ambiguity codes for positions with tied bases.

---

### 7. Phylogenetics

Evolutionary analysis naturally follows MSA. Use `petgraph` for tree data structures
(Playground-available).

**Topics:**

- **Distance-based trees** — Compute pairwise distances (p-distance, Jukes-Cantor
  correction) from an MSA and build a tree with UPGMA or neighbour-joining. Implement
  neighbour-joining in Rust with a `HashMap`-based distance matrix.

- **Tree data structures** — Represent rooted/unrooted trees using `petgraph::Graph` or
  a custom arena-based structure. Implement Newick format parsing and writing from scratch.

- **Tree traversal** — DFS, BFS, and post-order traversal using `petgraph` iterators or
  a recursive implementation. Compute subtree properties (leaf count, total branch length).

- **Bootstrap support** — Resample columns of an MSA with `rand` (Playground-available)
  to estimate confidence in tree topology. Implement a bootstrap loop and annotate tree
  nodes with support values.

---

### 8. Long-Read Sequencing

Oxford Nanopore and PacBio reads have different error profiles and lengths that warrant
dedicated treatment. All algorithms from scratch.

**Topics:**

- **Platforms overview** — PacBio HiFi (~15 kb, <1% error), PacBio CLR (longer, higher
  error), Oxford Nanopore (variable length up to megabases, improving with R10.4+).

- **Error profiles** — Substitution vs indel error rates, homopolymer errors in Nanopore,
  systematic vs random errors. Show how these affect the Phred score distribution compared
  to short reads.

- **Overlap finding for long reads** — Minimap2-style all-vs-all overlap finding via
  shared minimizers. Implement a simplified chaining algorithm: collect matching minimizer
  pairs, sort by diagonal (ref_pos - query_pos), and extend chains greedily.

- **Consensus and polishing** — The concept of draft assembly + polishing rounds. Implement
  a simple majority-vote consensus from a pileup of long reads aligned to a draft contig.

- **Structural variant signatures** — Long reads span SVs that short reads cannot. Show
  how to detect large deletions (long N-operations in CIGAR), inversions (supplementary
  alignments on opposite strands), and insertions from SAM records.

---

### 9. Repeat Elements and Genome Complexity

Repetitive sequences complicate nearly every analysis.

**Topics:**

- **Types of repeats** — Tandem repeats (STRs, VNTRs, satellites), interspersed repeats
  (SINEs, LINEs, DNA transposons), segmental duplications.

- **Dot plots** — Self-alignment visualization. Implement an ASCII dot plot: for each pair
  of positions (i, j), print `*` if the k-mer starting at position i equals the k-mer at j.
  Diagonal streaks indicate direct repeats; off-diagonal diagonals indicate inverted repeats.

- **Kmer frequency to detect repeats** — Positions whose kmer occurs many times in the
  genome are likely repetitive. Show how the kmer frequency histogram (already covered)
  can identify repeat content.

- **Tandem repeat finding** — Scan for runs of a repeated unit using kmer autocorrelation:
  compare sequence to a copy of itself shifted by period p; high match rate at offset p
  indicates a tandem repeat with that period.

---

### 10. Gene Prediction and Annotation

Going from a raw assembly to biological insight requires annotation. All from scratch.

**Topics:**

- **ORF finding** — Scan all six reading frames (three forward, three reverse complement)
  for open reading frames from start codon (ATG) to stop codon (TAA, TAG, TGA). Implement
  an ORF finder with configurable minimum length that returns start position, frame, and
  translated sequence using the codon table from the existing aminoacids chapter.

- **Signal-based gene finding concepts** — Splice sites (GT...AG rule), Kozak sequences,
  promoter motifs. Show how regex (Playground-available) can find simple sequence motifs.

- **GFF3 output** — Produce well-formed GFF3 from predicted ORFs. Implement a GFF3 writer
  from scratch that generates correct feature records for gene, mRNA, CDS, and exon features.

---

### 11. Probabilistic Models

Many bioinformatics algorithms use probabilistic foundations that are only lightly touched
on in the current text.

**Topics:**

- **Hidden Markov Models (HMMs)** — Forward algorithm, Viterbi algorithm, Baum-Welch
  training. Use CpG island detection as the example: a two-state HMM (CpG island vs
  background) with emission probabilities for each nucleotide. Implement in Rust with
  log-space arithmetic for numerical stability. Use `ndarray` (Playground-available) for
  the transition and emission matrices.

- **Profile HMMs** — Extension of HMMs to sequence families. Match/insert/delete states,
  plan7 architecture, Viterbi alignment to a profile. Show how a profile HMM represents
  a protein family like Pfam.

- **Log-odds scores** — Explain BLAST bit scores, E-values, and the statistical framework
  behind significance thresholds. Implement a simple scoring matrix lookup and raw-to-bit-
  score conversion.

---

### 12. Compression and Efficient I/O

Large-scale bioinformatics is often I/O-bound.

**Topics:**

- **Streaming large files** — Read FASTQ/FASTA files line by line without loading into
  memory. Compare a whole-file `read_to_string` approach vs a `BufReader` line iterator.
  Show memory profile differences conceptually.

- **BGZF compression** — Block-gzipped files enable random access into compressed data.
  Implement a basic BGZF reader using `flate2` (Playground-available): parse the extra
  field containing the block size, decompress each block independently.

- **Sequence compression** — 2-bit encoding (already in the kmers chapter) reduces storage
  by 4×. Extend this to implement a compact in-memory sequence store that packs bases into
  `u64` values and supports random access.

- **Run-length encoding** — Useful for homopolymer-heavy sequences (Nanopore). Implement
  RLE encode and decode for nucleotide sequences and measure compression ratio on real
  sequence examples.

---

## Suggested Expansions to Existing Chapters

### Alignment chapter

- **Affine gap penalties** — Linear gap cost (each gap position costs the same) is
  biologically unrealistic. Affine gaps (gap-open + gap-extend cost) are used in BLAST,
  BWA, and most modern aligners. Add a section deriving the three-matrix DP formulation
  (M, Ix, Iy matrices) and implement it. No external crates needed.

- **Banded alignment** — When sequences are known to be similar, restrict the DP to a
  diagonal band of width 2k+1 for O(n·k) instead of O(n²). Implement as an extension of
  the existing Levenshtein code.

- **Alignment statistics** — Explain E-values and Z-scores: what makes an alignment
  statistically significant vs a chance match. Implement a simple random shuffling approach
  to estimate background score distributions.

- **Dot plots** — (Also relevant to repeat detection.) Implement an ASCII dot plot for
  two sequences. Diagonal line = consecutive matches; no external crates needed.

### Kmers chapter

- **Canonical kmers** — Store only the lexicographically smaller of a kmer and its reverse
  complement. This halves storage and makes kmer sets strand-agnostic. Show how canonical
  kmers resolve the odd-kmer-size note already in the chapter.

- **Kmer set operations** — Intersection, union, and Jaccard similarity between kmer sets.
  Implement containment index (|A ∩ B| / |A|) which is used by Sourmash for sequence
  comparison.

- **HyperLogLog** — Cardinality estimation for unique kmers with sub-percent error using
  O(log log n) space. Implement from scratch: hash each kmer, observe the maximum number
  of leading zeros in any hash, derive cardinality estimate.

### Assembly chapter

- **Error correction** — Most assemblers correct reads before assembly. The kmer-spectrum
  approach: kmers occurring fewer than a threshold number of times are likely errors.
  Implement a simple tip-correction that replaces a low-frequency kmer by finding the
  most similar high-frequency kmer.

- **Assembly quality metrics** — N50, NG50, and auNG are standard measures of assembly
  contiguity. Implement N50 calculation (sort contig lengths descending, find the contig
  at which cumulative length ≥ 50% of total). Explain what it does and does not capture.

- **Scaffolding concepts** — After producing contigs, paired-end or long-read information
  can order and orient them into scaffolds. Describe the graph formulation without a full
  implementation.

- **Heterozygosity and diploid assembly** — How heterozygosity creates bubbles in De Bruijn
  graphs. Define haplotype phasing and why diploid organisms need special treatment.

### Performance chapter

- **Profiling with `perf` and flamegraphs** — Step-by-step guide to finding hot spots in
  a Rust bioinformatic program. Show how to interpret a flamegraph.

- **Criterion benchmarks** — Setting up reproducible micro-benchmarks with the `criterion`
  crate (Playground-available). Show a kmer counting function benchmarked at different
  sequence lengths.

- **Memory layout and cache efficiency** — Array-of-structs vs struct-of-arrays layout.
  Show a concrete example where switching layout speeds up kmer processing because of
  better cache locality.

---

## Suggested Supplementary Material

### Worked case studies

End-to-end worked examples tie concepts together across chapters:

1. **Bacterial genome assembly pipeline** — Raw FASTQ reads → quality filter → kmer
   histogram → genome size estimate → De Bruijn graph assembly → N50 assessment. Each step
   uses code from earlier chapters.

2. **16S amplicon OTU pipeline** — In silico PCR → quality filter → dereplication → OTU
   clustering → taxonomic classification. Maps directly to the existing amplicon chapter.

3. **SNP calling on a small genome** — Parse SAM records from scratch → pileup → Bayesian
   SNP caller → VCF output. Connects the file formats, alignment, and variant calling
   material.

### Testing and validation

The book emphasizes minimally viable implementations but does not discuss validation:

- **Read simulation** — Generate synthetic reads from a known reference genome for testing
  implementations. Implement a uniform read simulator using `rand` (Playground-available)
  and a simple error model that introduces substitutions at a given rate.

- **Property-based testing with `proptest`** — Automatically generate random sequences and
  assert invariants (e.g. reverse complement of reverse complement equals the original,
  kmer count equals sequence length minus k plus one). Note: `proptest` is not in the
  Playground but this section can show the pattern with manual random testing using `rand`.

- **Comparing output to known results** — Validate your implementations against small
  hand-computed examples. Include worked examples with expected outputs in the chapter text.

### Rust-specific additions

- **`serde` for bioinformatic data** — Serialize/deserialize custom structs (kmer tables,
  alignment results, variant calls) to JSON and CSV. Both `serde_json` and `csv` are
  Playground-available.

- **`rayon` deep dive** — Parallel iterators applied specifically to sequence processing.
  Show how to parallelise kmer counting over a batch of sequences using `par_iter()`. The
  `rayon` crate is Playground-available.

- **Error handling patterns** — Build ergonomic error types with `thiserror` and `anyhow`
  (both Playground-available) for a realistic bioinformatic tool. Show the difference
  between library errors and application errors.

---

## Priority Ordering

Ordered roughly by expected reader demand and coherence with existing content:

| Priority | Topic | Rationale |
|----------|--------|-----------|
| High | SAM format and CIGAR strings | Gap in file formats; SAM is plain text so fully implementable from scratch |
| High | VCF format and simple variant calling | Very common task; plain text so no external crates needed |
| High | Affine gap penalties | Important algorithmic upgrade to the alignment chapter |
| High | Assembly quality metrics (N50) | Practical, short to implement, high reader value |
| High | Canonical kmers | Straightforward addition resolving the existing odd-kmer-size note |
| High | HMMs with CpG island example | Foundational probabilistic model; `ndarray` is Playground-available |
| Medium | ORF finding | Short to implement, high practical value, uses existing codon table |
| Medium | Dot plots | Visual and teachable; pure Rust, no crates needed |
| Medium | Suffix arrays and BWT | Core CS topic with direct bioinformatics application |
| Medium | Bloom filters | Practical probabilistic structure; implement from scratch |
| Medium | Kmer set operations and Jaccard | Natural extension of FracMinHash material |
| Medium | Long-read sequencing overview | Increasingly dominant sequencing paradigm |
| Medium | Error correction | Important pre-assembly step; connects kmers and assembly chapters |
| Medium | MSA and progressive alignment | Needed for phylogenetics; `ndarray` helps |
| Medium | Neighbour-joining trees | Practical; `petgraph` is Playground-available |
| Medium | RNA-seq overview | Large domain; pseudo-alignment is implementable from scratch |
| Low | Metagenomics | Focused subtopics (LCA, profiling) are manageable |
| Low | Read simulation | Useful for testing; `rand` is Playground-available |
| Low | Population genetics | Relevant to a subset of readers |
