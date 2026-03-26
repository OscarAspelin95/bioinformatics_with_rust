# BED
The **B**rowser **E**stensible **D**ata (BED) format is relatively <q>simple</q> compared to other file formats we have seen previously. It is a text file format that represents genomic ranges and is commonly used in e.g., variant calling.

It is a compact way to represent genomic regions through coordinates rather than actual bases. Assume we have a sequence `ATCGGGGATG` of length 10. We can represent the region `GGGG` with the coordinates `start = 3` and `end = 7`.
