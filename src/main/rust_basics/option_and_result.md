# Option and Result

## Option
In contrast to Python, there is no `None` type in Rust. There is, however, something called [`Option`](https://doc.rust-lang.org/std/option/), which is of type `Option<T>`. An `Option<T>` can either be `Some(T)` (there is a value) or `None` (there is no value). Usually, one would pattern match to extract the value from an `Option` if it exists.

```rust
fn print_value_if_exist(x: Option<usize>) {
    match x {
        Some(value) => println!("Value is {value}"),
        None => println!("No value"),
    };
}

fn main() {
    let x: Option<usize> = Some(5);
    print_value_if_exist(x);

    // We can define x have the value None, but
    // its type will always be Option<T>.
    let x: Option<usize> = None;
    print_value_if_exist(x);
}
```

## Result
Similarly for errors, there is `Result`, which is of type `Result<T, E>`. A `Result<T, E>` can be either `Ok(T)` or `Err(E)`, which we can pattern match against.

```rust
use std::num::ParseIntError;

fn parse_to_usize(x: &str) {
    let parsed: Result<usize, ParseIntError> = x.parse::<usize>();

    match parsed {
        Ok(number) => println!("{number}"),
        Err(err) => println!("{}: {x}", err),
    }
}

fn main() {
    let x: &str = "5";
    parse_to_usize(x);

    let x: &str = "5ab";
    parse_to_usize(x);
}
```
