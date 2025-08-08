# Control Flow
An `if` statement works very similar to other languages. E.g.,

```rust
fn main() {
    let x: usize = 5;

    if x >= 10 {
        println!("{x} is large");
    }
    else {
        println!("{x} is small");
    }
}
```

A [`match`](https://doc.rust-lang.org/book/ch06-02-match.html) statement works similarly to a `switch` statement in C and C++ and needs to be exhaustive.

```rust
fn main() {
    let x: usize = 1;

    match x {
        1 => println!("x is 1"),
        2 => println!("x is 2"),
        _ => println!("x is something else"),
    }
}
```

Rust supports relatively advanced [pattern matching](https://doc.rust-lang.org/book/ch19-03-pattern-syntax.html) which is extremely useful.
