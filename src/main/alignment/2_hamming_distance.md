# Hamming Distance
The [Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance) is defined as the number of positions between two strings of equal length that are different. Hence, it measures the number of substitutions needed to convert one string to the other. This also means that it is a kind of *global alignment* that only supports substitutions.

In the example below, the Hamming distance is 1.
<pre>
query   ATCTACCG
        |||||*||
subject ATCTATCG
</pre>

```rust
use std::iter::zip;

fn hamming_distance(query: &str, subject: &str) -> usize {
    assert_eq!(query.len(), subject.len());

    let mut distance = 0;

    for (query_nt, subject_nt) in zip(query.chars(), subject.chars()) {
        if query_nt != subject_nt {
            distance += 1;
        }
    }

    return distance;
}
fn main() {
    assert_eq!(hamming_distance("ATCG", "ATCG"), 0);
    assert_eq!(hamming_distance("ATCG", "TTCG"), 1);
    // Our function can actually handle non-nucleotide strings.
    assert_eq!(hamming_distance("Hello", "Heiol"), 3);
}
```
