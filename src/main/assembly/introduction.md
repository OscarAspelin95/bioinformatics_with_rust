# Assembly
Genome assembly is an intricate and rather advanced concept that requires knowledge within biology, bioinformatics, mathematics and computer science. There are two main reasons why we won't cover assembly in full depth:
- I personally don't have the knowledge and expertise to write a genome assembler from scratch.
- Even if I did, writing an assembler from scratch deserves its own book.

Instead, this chapter will cover the fundamentals of genome assembly and showcase some basic code implementations.


## Resources
Luckily for us, the bioinformatic open source community is huge and contains loads of good resources related to genome assembly.

### Open Source Assemblers

| Name       | GitHub                                             | Paper                                                                     | Platform                           |
|------------|----------------------------------------------------|---------------------------------------------------------------------------|------------------------------------|
| Flye       | [link](https://github.com/mikolmogorov/Flye)       | [doi](https://doi.org/10.1038/s41592-020-00971-x)                        | Oxford Nanopore, PacBio            |
| Myloasm    | [link](https://github.com/bluenote-1577/myloasm)   | [biorxiv](https://www.biorxiv.org/content/10.1101/2025.09.05.674543v1)   | Oxford Nanopore, PacBio            |
| SPAdes     | [link](https://github.com/ablab/spades)            | [doi](https://doi.org/10.1002/cpbi.102)                                   | Oxford Nanopore, PacBio, Illumina  |
| Autocycler | [link](https://github.com/rrwick/Autocycler)       | [doi](https://doi.org/10.1093/bioinformatics/btaf474)                     | Oxford Nanopore, PacBio            |
| IDBA       | [link](https://github.com/loneknightpy/idba)       | -                                                                         | Illumina                           |
| ...        | ...       										  | ...                                                                       | ...                           		|

### Key Papers

| Title                                                                    | Authors                  | Year | Link                                                                               |
|--------------------------------------------------------------------------|--------------------------|------|------------------------------------------------------------------------------------|
| Genomic mapping by fingerprinting random clones: A mathematical analysis  | Lander, Waterman         | 1988 | [doi](https://doi.org/10.1016/0888-7543(88)90007-9)      |
| An Eulerian path approach to DNA fragment assembly                        | Pevzner, Tang, Waterman  | 2001 | [doi](https://doi.org/10.1073/pnas.171285098)                  |
| The fragment assembly string graph                                        | Myers                    | 2005 | [doi](https://doi.org/10.1093/bioinformatics/bti1114)  |
| Assembly algorithms for next-generation sequencing data                   | Miller, Koren, Sutton    | 2010 | [doi](https://doi.org/10.1016/j.ygeno.2010.03.001)        |
| How to apply de Bruijn graphs to genome assembly                          | Compeau, Pevzner, Tesler | 2011 | [doi](https://doi.org/10.1038/nbt.2023)                              |
| Sequence assembly demystified                                             | Nagarajan, Pop           | 2013 | [doi](https://doi.org/10.1038/nrg3367)                                |
| Velvet: Algorithms for de novo short read assembly using de Bruijn graphs | Zerbino, Birney          | 2008 | [doi](https://doi.org/10.1101/gr.074492.107)                    |
| SPAdes: A New Genome Assembly Algorithm                                   | Bankevich et al.         | 2012 | [doi](https://doi.org/10.1089/cmb.2012.0021)                    |
| Assembly of long, error-prone reads using repeat graphs                   | Kolmogorov et al.        | 2019 | [doi](https://doi.org/10.1038/s41587-019-0072-8)            |
| Haplotype-resolved assembly using phased assembly graphs with hifiasm     | Cheng et al.             | 2021 | [doi](https://doi.org/10.1038/s41592-020-01056-5)          |
