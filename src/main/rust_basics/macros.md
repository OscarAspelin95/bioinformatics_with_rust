# Macros

[`println!`](https://doc.rust-lang.org/std/macro.println.html) - prints to stdout. Requires a formatter depending on the data type. E.g.,
```rust
fn main(){
    println!("This is a string");
    println!("This is an int: {}", 5);
    println!("{:?}", vec!["This", "is", "a", "vec"]); // {:?} means debug mode.
}
```

[`assert!`](https://doc.rust-lang.org/std/macro.assert.html) - runtime assert that a boolean expression evaluates to `true`. E.g.,
```rust
fn main(){
    assert!(5 < 6);
}
```

[`assert_eq!`](https://doc.rust-lang.org/std/macro.assert_eq.html) - runtime equality assert. E.g.,
```rust
fn main(){
    assert_eq!(6, 5 + 1);
}
```
