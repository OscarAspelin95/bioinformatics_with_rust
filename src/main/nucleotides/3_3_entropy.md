# Entropy
Typically, one associates entropy with the physical term for the measure of disorder. In bioinformatics, entropy can be used for quantifying the diversity or randomness of nucleotide sequences.

Although there are different kinds of entropies, the *Shannon* entropy is probably the most famous one. It is defined by the following equation:

\\[ -\sum_{i=\\{A,T,C,G\\}} p_i \cdot log_2(p_i) \quad log_2(p_i) = \begin{cases} log_2(p_i) \\; if \\; p_i > 0 \\\\ 0 \\; if \\; p_i \\; == \\; 0 \end{cases} \\ \\]

That is, we calculate the proportions of each nucleotide {A, T, C, G} and calculate the sum of the probability times its logarithm. For example, consider the sequence "AAAAA". Calculating the Shannon entropy would result in:

\\[ -(1 \cdot log_2(1) + 0 + 0 + 0) = 0\\]

Which tells us there is very little disorder or randomness. This makes sense, because we have the same nucleotide repeated five times. The code snippet below implements the Shannon entropy for a given nucleotide sequence. We'll reuse the previous code for counting nucleotides (with a few modifications) and add the entropy calculation.

```rust
# use std::collections::HashMap;
#
# fn count_nucleotides(seq: &[u8]) -> HashMap<u8, usize> {
#     let mut map: HashMap<u8, usize> = HashMap::with_capacity(4);
#
#     // Pre-fill with empty counts for all expected nucleotides.
#     map.insert(b'A', 0);
#     map.insert(b'T', 0);
#     map.insert(b'C', 0);
#     map.insert(b'G', 0);
#
#     // Iterate over each nucleotide.
#     seq.iter().for_each(|nt| match nt {
#         // If we have a canonical nucleotide, we bind it to the variable c.
#         c @ (b'A' | b'C' | b'G' | b'T') => match map.contains_key(c) {
#             // If nucleotide is already in HashMap, increment its count.
#             true => {
#                 let v = map.get_mut(c).unwrap();
#                 *v += 1;
#             }
#             // Otherwise, add it.
#             false => {
#                 map.insert(*c, 1);
#             }
#         },
#         _ => panic!("Invalid nt {nt}"),
#     });
#
#     return map;
# }
#
// [...]

fn shannon_entropy(counts: &HashMap<u8, usize>) -> f32 {
    let sum_count: usize = counts.values().sum();

    // Probabilities of each nucleotide.
    let probs: Vec<f32> = counts
        .values()
        .map(|count| (*count as f32 / sum_count as f32))
        .collect();

    let shannon: f32 = probs
        .iter()
        .map(|prob| match prob {
            0_f32 => return 0 as f32,
            // This is safe because prob is never negative since
            // both count and sum_count are of type usize.
            _ => {
                return prob * prob.log2();
            }
        })
        .sum();

    return -shannon;
}

fn get_shannon_entropy(seq: &[u8]) -> f32 {
    let counts = count_nucleotides(seq);
    let shannon = shannon_entropy(&counts);

    return shannon;
}

fn main() {
    assert_eq!(get_shannon_entropy(b"AAAAA"), 0.0_f32);
    assert_eq!(get_shannon_entropy(b"ATCG"), 2.0_f32);
    assert_eq!(get_shannon_entropy(b"ATCGATCGATCG"), 2.0_f32);
    assert_eq!(get_shannon_entropy(b"AAAAAAG"), 0.5916728_f32);
}
```
