# References
References in Rust are different from pointers in languages such as C and C++. In Rust, references are always valid and cannot be null. Use `&` to reference a variable, and `*` to dereference.

```rust
fn main() {
    let my_vec: Vec<usize> = vec![1, 2, 3, 4, 5];

    println!("{:?}", &my_vec); // Pass my_vec as a reference to the println! macro.
}
```

References are useful for passing variables to other functions without needing to clone the data. In the following example below, we'll create a `Vec` and then pass it by reference to a function. Note the syntax here, we actually don't pass a reference `&Vec<usize>`. We could, but a more idiomatic approach (in my opinion) is to pass a slice instead.

```rust
fn print_a_vec(x: &[usize]) {
    println!("{:?}", x);
}

fn main() {
    let my_vec: Vec<usize> = vec![1, 2, 3, 4, 5];

    print_a_vec(&my_vec[..]);
}
```

There is an important rule when it comes to references, which I'll quote from the official Rust [book](http://127.0.0.1:3000/main/rust_basics/references.html):

<q><em>At any given time, you can have either one mutable reference or any number of immutable references.</em></q>

This makes perfect sense when you think about it. If we are able to mutate a variable, we do not want a bunch of read-only references with unpredictable values when read.
