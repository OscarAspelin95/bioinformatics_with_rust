# Strings
There are multiple string types in Rust. Two of the ones I use mostly are `String` and `&str`.

`String` is an owned, mutable and heap-allocated type. We can allow it to be mutable with the `mut` keyword. E.g.,

```rust
fn main() {
    let mut seq: String = "ATCG".to_string();
    seq.push_str("ATCG"); // Mutate.

    assert_eq!(seq, "ATCGATCG".to_string());
}
```

`&str` is a borrowed and immutable type. We can read from it, but cannot mutate it. `&str` is suitable when one wants to avoid heap-allocation.

```rust
fn main() {
    let seq: &str = "ATCG";

    println!("{seq}");
}
```
