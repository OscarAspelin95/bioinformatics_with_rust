# BAM
The binary format of SAM is called BAM and is used to save diskspace. The SAM format contains a lot of information and the files quickly become very large. Because of this, it makes sense to use BAM format when possible.

The conversion between SAM and BAM is easily carried out with `samtools`:

```bash
samtools view -o aln.bam aln.sam # SAM -> BAM
samtools view -o aln.sam aln.bam # BAM -> SAM
```

BAM files are often sorted by genomic coordinate and indexed, which allows tools to quickly jump to a specific region without scanning the entire file. This is done with:

```bash
samtools sort -o aln.sorted.bam aln.bam
samtools index aln.sorted.bam
```

The index is stored in a separate `.bai` file alongside the BAM. Note that most downstream tools (e.g. variant callers, genome browsers) expect a sorted, indexed BAM.
