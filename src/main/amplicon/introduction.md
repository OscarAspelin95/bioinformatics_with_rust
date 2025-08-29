# Amplicon
As we all know, there are multiple different approaches to genome sequencing. I'll list my interpretation of the different approaches below:
- `WGS` - Is a rather broad term, but generally refers to single isolate sequencing. This could be for example sequencing the entire genome from a single bacterial colony.
- `Shotgun` - Generally refers to sequencing the entire genomes from multiple taxa (metagenomic sample). For example, sequencing a gut sample from a patient.
- `Amplicon` - Is a targeted approach, commonly used with PCR. The goal here is to sequence a part of the target genome. One example is amplicon sequencing of the 16S bacterial rRNA region.

Amplicon sequencing has several advantages compared to other sequencing protocols:
- Reduced costs per sample due to sequencing less DNA for a shorter period of time.
- Enables sequencing more samples in parallel due to smalles sample sizes.
- The bioinformatic analysis is generally less computationally heavy.

However, this does not come without disadvantages:
- PCR can introduce artifacts.
- Off targets, depending on the primer design.
- Reduced genomic resolution.

In the following chapters, we'll go through some very basic Rust implementations of common amplicon based analyses.
