# Count nucleotides

We can implement a simple script for calculating nucleotides.
```rust
fn main(){
    let nt_string: &[u8] = b"AAACGTGACGT";

    // Variables must be mutable for us to increment the count.
    let mut a = 0;
    let mut c = 0;
    let mut g = 0;
    let mut t = 0;

    // Iterate over each nucleotide.
    nt_string.iter().for_each(|nt| match nt {
        b'A' => a += 1,
        b'C' => c += 1,
        b'G' => g += 1,
        b'T' => t += 1,
        // We only allow canonical, non masked bases.
        _ => panic!("Invalid nt {nt}"),
    });

    assert_eq!(a + c + g + c, nt_string.len());
    println!("A: {a}, C: {c}, G: {g}, T: {t}");
}
```
This approach is not that elegant, because we initialize four different variables, one for each nucleotide. An alternative approach is to use a HashMap.

```rust
use std::collections::HashMap;

fn main() {
    let nt_string: &[u8] = b"AAACGTGACGT";

    // HashMap must be mutable for us to modify it.
    let mut map: HashMap<&u8, usize> = HashMap::new();

    // Iterate over each nucleotide.
    nt_string.iter().for_each(|nt| match nt {
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

    assert_eq!(map.values().sum::<usize>(), nt_string.len());
    println!("{:?}", map);
}
```
Run the code and inspect the output. The resulting HashMap will have the ASCII encoded nucleotides as keys.

Note that there are lots of alternative solutions and further optimizations we can do.
