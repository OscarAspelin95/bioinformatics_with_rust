# Error Handling
It took a while for me to understand errors in Rust. However, one day, I came across the concept of [recoverable and non-recoverable](https://doc.rust-lang.org/book/ch09-00-error-handling.html) errors and that is when everything start making sense.

An `unrecoverable` error occurs when it makes sense to terminate the code. One example would be failing to read a file because it is corrupt. If our only goal is to parse the file and print its contents, but we cannot even read it, then we'd classify this as a unrecoverable error.


A `recoverable` error you can think of as when it is still safe or okay to proceed executing code. One example would be parsing lines from a file and one line has an unexpected structure. If we are okay with this, we can just skip this line and proceed to the next.

There are different ways of handling errors, some of which are listed below:

- [`panic!`](https://doc.rust-lang.org/rust-by-example/std/panic.html) - Is a macro that, in single threaded applications, will cause the program to exit.

- [`unwrap`](https://doc.rust-lang.org/rust-by-example/error/option_unwrap.html) - Will panic if an `Option<T>` is `None` or if a `Result<T, Error>` is `Error`.

- `expect` - Is similar to `unwrap` but also displays a provided error message on panic.

- [`?`](https://doc.rust-lang.org/rust-by-example/std/result/question_mark.html) - Is used for error propagation and can be handled by e.g., upstream functions. This is a very elegant way of handling errors and is preferred over `unwrap` and `expect` in real world appilcations. `?` must always be inside a function that returns the `Result` type.

## Unrecoverable errors

In the code snippet below, we try to open a file that does not exist. Using `.expect()` will cause a panic, but this is okay because we allow this to be an unrecoverable error.

```rust
use std::fs::File;

fn main() {
    let _ = File::open("file_does_not_exist.txt").expect("Failed to open file.");
}
```

## Recoverable errors
In the following example, we implement a recoverable error for integer division using the `?` operator. The code looks quite complex for such a simple example, but the general pattern can be applied to other code as well.

- We define a custom error type called `MathError`. We could define multiple `MathError` types, but in our case, `DivisionByZero` will suffice.

- We implement the `Display` trait for our custom error to avoid having to use `Debug` print.

- We implement a function `divide` that returns a `Result`, containing either a `f32`, or a `MathError`.

- We implement a function `division` that uses the `?` operator. Think of the `?` as <q>assume no error</q>, then we can return `Ok(result)`. If `result` contains an error, the function `division` will make an early return.

- In `main`, we handle the division result accordingly.

```rust
#[derive(Debug)]
enum MathError {
    DivisionByZero,
}

impl std::fmt::Display for MathError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            MathError::DivisionByZero => write!(f, "Cannot divide by zero!"),
        }
    }
}

fn divide(a: usize, b: usize) -> Result<f32, MathError> {
    match b {
        0 => Err(MathError::DivisionByZero),
        _ => Ok(a as f32 / b as f32),
    }
}

fn division(a: usize, b: usize) -> Result<f32, MathError> {
    let result = divide(a, b)?;

    return Ok(result);
}

fn main() {
    let values: Vec<(usize, usize)> = vec![(1, 1), (1, 0)];

    for (a, b) in values {
        match division(a, b) {
            Ok(r) => println!("{r}"),
            Err(e) => println!("{e}"),
        }
    }
}
```

The takehome message here is that by handling recoverable errors, we avoid crashing our program when it does not need to.

Visit the [official documentation](https://doc.rust-lang.org/book/ch09-00-error-handling.html) for error handling to learn more. In addition, there are crates such as [anyhow](https://docs.rs/anyhow/latest/anyhow/) and [thiserror](https://docs.rs/thiserror/latest/thiserror/) that simplifies the generation of custom error types.
