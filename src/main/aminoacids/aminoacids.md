# Aminoacids
In the past chapters, we have gone through some fundamental ways to analyze and manipulate nucleotide sequences. Now, we'll take a brief look at aminoacid sequences. Luckily, some of the concepts we have implemented for nucleotides also apply to aminoacids, with some minor tweaking of the code. Examples are:
- Counting aminoacids.
- Identifying homopolymers.
- Hamming distance.
- Global and local aligner (with suitable substitution matrix).

## Codon Table
For aminoacids, we have to think triplets of nucleotides because this is what encodes aminoacids. In Rust, we can use something like the [bio_seq](https://docs.rs/bio-seq/latest/bio_seq/translation/index.html) crate. However, for fun we'll create our own very basic `HashMap` using the [standard](https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi#SG1.) NCBI codon table.

```rust
use std::collections::HashMap;

fn generate_codon_table<'a>() -> HashMap<[u8; 3], u8> {
    let aa = b"FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";

    let base1 = b"TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG";
    let base2 = b"TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG";
    let base3 = b"TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG";

    let map: HashMap<[u8; 3], u8> = (0..aa.len())
        .map(|i| {
            let value = aa[i];
            let key = [base1[i], base2[i], base3[i]];

            return (key, value);
        })
        .collect();

    return map;
}

fn main() {
    let codon_table = generate_codon_table();

    assert_eq!(codon_table.get(b"ATG"), Some(&b'M'));
}
```
