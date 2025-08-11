# Translation
When it comes to translation, there is a couple of things we need to consider:

- `sequence_length` - Is the length of our nucleotide string divisible by 3? If no, then we need to handle this. Otherwise, we might encounter a partial codon.

    E.g., `ATGTTTTAG` -> `ATG TTT TAG` is a well behaved nucleotide string.

- `frames` - The forward strand has three reading frames, so does the reverse strand. Ideally, we'd try translating all six frames.

    E.g., `...ATGTTTTAG...` can be read in the forward direction as:<br>
        `...ATG TTT TAG...` or<br>
        `....TGT TTT AG...` or<br>
        `.....GTT TTA G...`<br><br>
        where `...` is the remaining part of the string.

- `ambiguous nucleotides` - We need to decide how to handle ambiguous and softmasked nucleotides.


For this first implementation, we'll use the first frame of the forward strand and `panic!` if the length is not divisible by 3.
```rust
# use std::collections::HashMap;
#
# fn generate_codon_table() -> HashMap<[u8; 3], u8> {
#     let aa = b"FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
#
#     let base1 = b"TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG";
#     let base2 = b"TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG";
#     let base3 = b"TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG";
#
#     let map: HashMap<[u8; 3], u8> = (0..aa.len())
#         .map(|i| {
#             let value = aa[i];
#             let key = [base1[i], base2[i], base3[i]];
#
#             return (key, value);
#         })
#         .collect();
#
#     return map;
# }
// [...]

fn translate(seq: &[u8], codon_table: &HashMap<[u8; 3], u8>) -> Vec<u8> {
    if seq.len() % 3 != 0 {
        panic!("Length of sequence must be divisible by three.");
    }

    let translation: Vec<u8> = seq
        .chunks(3)
        .filter_map(|codon| match codon_table.get(codon) {
            Some(aa) => Some(*aa),
            None => None,
        })
        .collect();

    return translation;
}

fn main() {
    let codon_table = generate_codon_table();

    assert_eq!(translate(b"ATGTAG", &codon_table), b"M*");
}
```
