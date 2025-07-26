# Counting nucleotides
We'll start of with a something relatively easy - counting nucleotides. We'll create a HashMap for storing the counts of the nucleotides we encounter in the sequence.

```rust
use std::collections::HashMap;

fn count_nucleotides(seq: &[u8]){
    let mut map: HashMap<&u8, usize> = HashMap::new();

    // Iterate over each nucleotide.
    seq.iter().for_each(|nt| match nt {
        // If we have a canonical nucleotide, we bind it to the variable c.
        c @ (b'A' | b'C' | b'G' | b'T') => match map.contains_key(c) {
            // If nucleotide is already in HashMap, increment its count.
            true => {
                let v = map.get_mut(c).unwrap();
                *v += 1;
            }
            // Otherwise, add it.
            false => {
                map.insert(c, 1);
            }
        },
        _ => panic!("Invalid nt {nt}"),
    });

    assert_eq!(map.values().sum::<usize>(), seq.len());
    println!("{:?}", map);
}

fn main() {
    count_nucleotides(b"ATCG");
}
```
Run the code and inspect the output. The resulting HashMap will have the ASCII encoded nucleotides as keys.

Note that there are lots of alternative solutions and further optimizations we can do. For example, if we input a string b"AAAA", our HashMap will only contain As. One alternative here would be to initialize the HashMap with empty counts for A, T, C and G.
