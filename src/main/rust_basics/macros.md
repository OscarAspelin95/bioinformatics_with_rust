# Macros
Macros should have a decicated book to themselves. Rust supports both declarative and procedural [macros](https://doc.rust-lang.org/book/ch20-05-macros.html), which are either built-in or user created. In this book, we'll cover some of the most common build-in macros.

For more information about Rust macros, also see [The Little Book of Rust Macros](https://lukaswirth.dev/tlborm/)

## Declarative macros

[`println!`](https://doc.rust-lang.org/std/macro.println.html) - prints to stdout. Requires a formatter depending on the data type. E.g.,
```rust
fn main() {
    println!("This is a string");
    println!("This is an int: {}", 5);
    println!("{:?}", vec!["This", "is", "a", "vec"]); // {:?} means debug mode.
}
```

[`vec!`](https://doc.rust-lang.org/std/macro.vec.html) - creates a `Vec` based on the provided input.
```rust
fn main() {
    let x: Vec<usize> = vec![1, 2, 3, 4, 5];
    println!("{:?}", x);
}
```

[`panic!`](https://doc.rust-lang.org/rust-by-example/std/panic.html) - causes the program to exit and starts unwinding the stack.
```rust
fn main() {
    panic!("This will exit the program!")
}
```

[`assert!`](https://doc.rust-lang.org/std/macro.assert.html) - runtime assert that a boolean expression evaluates to `true`. E.g.,
```rust
fn main() {
    assert!(5 < 6);
}
```

[`assert_eq!`](https://doc.rust-lang.org/std/macro.assert_eq.html) - runtime equality assert. E.g.,
```rust
fn main() {
    assert_eq!(6, 5 + 1);
}
```

## Declarative macros
Are divided into three categories, all of which are outside the scope of this book. Regardless, they are very handy for deriving traits, such as `Debug`. As an example, assume we've created a `Struct` that we'd want to be able to print to stdout using `println!`. In this case, we need use derive the `Debug` trait through `#[derive(Debug)]`.

```rust,editable
#[derive(Debug)] // Try commenting out this line!
struct MyStruct{
    my_vec: Vec<usize>,
}

fn main() {
    let my_struct = MyStruct { my_vec: vec![1, 2, 3, 4, 5] };

    println!("{:?}", my_struct);
}
```
