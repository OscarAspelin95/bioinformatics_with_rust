# Vec
A `Vec` is like an array type with dynamic size. There are two common ways to initialize a `Vec`, either through the `vec!` macro, or through `Vec::new()`.

```rust
fn main() {
    // Create an empty vec.
    let mut my_vec: Vec<usize> = Vec::new();

    my_vec.push(1);

    assert_eq!(my_vec, vec![1]);
}
```

We can also collect an iterator into a `Vec`, which is very convenient.

```rust
fn main() {
    let my_iterator = 1..5;

    let my_vec: Vec<usize> = my_iterator.collect();

    assert_eq!(my_vec, vec![1, 2, 3, 4]); // my_iterator is right exclusive.
}
```
