# References
References in Rust are different from pointers in languages such as C and C++. In Rust, references are always valid and cannot be null. Use `&` to reference a variable, and `*` to dereference.

```rust
fn main() {
    let my_vec: Vec<usize> = vec![1, 2, 3, 4, 5];

    println!("{:?}", &my_vec); // Pass my_vec as a reference to the println! macro.
}
```

References are useful for passing variables to other functions without needing to clone the data.

```rust
fn print_a_vec(vec: &Vec<usize>) {
    println!("{:?}", vec);
}

fn main() {
    let my_vec: Vec<usize> = vec![1, 2, 3, 4, 5];

    print_a_vec(&my_vec);
}
```
