# GC content
With the previous section in mind, it is relatively straightforward to implement a function that calculates the GC-content for a nucleotide string.

```rust
fn gc_content(nt_string: &[u8]) -> f32{
    let gc_count = nt_string.iter().filter(|&&nt| {
        nt == b'C' || nt == b'G'
    }).count();

    return gc_count as f32 / nt_string.len() as f32;

}
fn main(){
   assert_eq!(gc_content(b"ATCG"), 0.5);
   assert_eq!(gc_content(b"ATTC"), 0.25);
   assert_eq!(gc_content(b"AAAA"), 0.0);
   assert_eq!(gc_content(b"CGCGCG"), 1.0);
}

```
