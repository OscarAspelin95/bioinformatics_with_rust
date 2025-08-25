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

### Implementing our own declarative macro
I want to emphasize that I personally do not know that much about Rust macros. However, in this example we'll try to implement something that resembles Python's `Path`, which is a part of the `Pathlib` module. Using `Path`, there is a very handy way to define a file path by chaining multiple directories.

```python
from pathlib import Path

outdir = Path("my_outdir")
outfile = outdir / "sub_dir" / "another_sub_dir" / "my_file.txt"
```

Essentially, if the top directory `outdir` is of type `Path`, we can generate a file path through `/`. Personally, I think this is way more neat than having to use an f-string or similar. Let's try to implement something similar using a Rust declarative macro.

There are endless ways of implementing this, but below is one example. We'll define our macro `file_path` to require a base directory and at least one more argument. The syntax is a bit strange. It kinda looks like a function, but kinda not.

The [expression](https://doc.rust-lang.org/reference/expressions.html) `($base:expr $(, $sub:expr)+)` defines the pattern that we enforce. In this case, we require one expression `$base`, followed by one or more comma-separated expressions `$sub`.

We use import statements with a leading `::` to signify that we want the root crate `std` to not accidentally use some locally defined crate called `std`.

Finally, we create a `PathBuf` from our base dir and iteratively build up the path.

```rust
use std::path::PathBuf;

macro_rules! file_path {
    ($base:expr $(, $sub:expr)+) => {{
        use ::std::path::PathBuf;
        use ::std::fs;

        let mut full_path = PathBuf::from($base);

        $(
            full_path.push($sub);
        )*

        full_path
    }};
}

fn main(){

    let outdir = "my_outdir".to_string();
    let outfile = file_path!(outdir, "sub_dir", "another_sub_dir", "my_file.txt");

    println!("{:?}", outfile);
}
```

The point with the simple example above is not to generate a bullet proof, production ready macro but rather showcase that declarative macros can be very handy for defining custom behaviors. If we'd try to implement `file_path` as a function, we'd probably have to handle the variable number of sub-directories through a `Vec` or similar.

## Procedural macros
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
