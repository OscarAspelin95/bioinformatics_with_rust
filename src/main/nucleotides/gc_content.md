# GC content
With the previous section in mind, it is relatively straightforward to implement a function that calculates the GC-content for a given nucleotide sequence.

```rust
fn gc_content(nt_seq: &[u8]) -> f32 {
    let gc_count = nt_seq.iter().filter(|&&nt| {
        nt == b'C' || nt == b'G'
    }).count();

    return gc_count as f32 / nt_seq.len() as f32;

}

fn main() {
   assert_eq!(gc_content(b"ATCG"), 0.5);
   assert_eq!(gc_content(b"ATTC"), 0.25);
   assert_eq!(gc_content(b"AAAA"), 0.0);
   assert_eq!(gc_content(b"CGCGCG"), 1.0);
}
```

In this code example, we use the filter method to count the number of Gs and Cs. This is not necessarily the fastest way, but it works for now.

Also, note that we are only filtering for uppercase G and C. In a real life application, we'd probably also check for `b'c'` and `b'g'`, e.g., softmasked bases.
