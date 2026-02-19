# Accounting For Frames
We can refine our approach for translating a nucleotide sequence by considering the six frames (three in the forward direction and three in the reverse).

The Rust code becomes a bit complex, but basically we:
1. Iterate over our three start positions at (zero-based) indices 0, 1 and 2.
2. From each start position, we chunk the sequence by length 3 to produce complete codons.
3. For each codon we translate to an aminoacid.
4. Finally, we extract the longest translated sequence from the three different frames.

We use `chunk_exact` to skip the last chunks that are not of length 3. `map_while` makes sure we stop iterating when we reach a stop codon (or invalid codon, e.g., if we have ambiguous nucleotides).

The code below does not take the reverse complement into consideration (the reader is encouraged to implement this).
```rust
use std::collections::HashMap;

# fn generate_codon_table() -> HashMap<Vec<u8>, u8> {
#    let aa = b"FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
#
#    let base1 = b"TTTTTTTTTTTTTTTTCCCCCCCCCCCCCCCCAAAAAAAAAAAAAAAAGGGGGGGGGGGGGGGG";
#    let base2 = b"TTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGGTTTTCCCCAAAAGGGG";
#    let base3 = b"TCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAG";
#
#    let map: HashMap<Vec<u8>, u8> = (0..aa.len())
#        .map(|i| {
#            let value = aa[i];
#            let key = vec![base1[i], base2[i], base3[i]];
#
#            return (key, value);
#        })
#        .collect();
#
#    return map;
# }
// [...]

fn get_longest_translation(codon_table: &HashMap<Vec<u8>, u8>, seq: &[u8]) -> Vec<u8> {
    let frames: usize = 3;

    let longest_translations: Vec<u8> = (0..frames)
        .map(|start_pos| {
            // Process nt string in chunks of three and stop when we don't have enough nucleotides for a codon.
            let translated: Vec<u8> = seq[start_pos..]
                .chunks_exact(3)
                .map_while(|codon| {
                    let aa = match codon_table.get(codon) {
                        None | Some(b'*') => None,
                        Some(valid) => Some(*valid),
                    };

                    aa
                })
                .collect();

            translated
        })
        .max_by_key(|translation| translation.len())
        .expect("Failed to extract longest translated sequence");

    longest_translations
}

fn main() {
    let codon_table = generate_codon_table();

    // Single codon in first frame.
    assert_eq!(get_longest_translation(&codon_table, b"ATG"), vec![b'M']);

    // Two valid codons in first frame.
    assert_eq!(
        get_longest_translation(&codon_table, b"ATGGGG"),
        vec![b'M', b'G']
    );

    // In frame 1 -> M*PP -> M
    // In frame 2 -> CNPP
    // In frame 3 -> VTP
    assert_eq!(
        get_longest_translation(&codon_table, b"ATGTAACCCCCCC"),
        vec![b'C', b'N', b'P', b'P']
    );
}
```

There is still room for improvement. First, we end the iteration when we encounter a stop codon, but don't actually include it in the return value. Second, using a `HashMap` is not ideal.
