# Trait Bounds and Generics
Rust support generic types, but due to the its strict type checker we need to put some restrictions on the generic type. In python, we can use unions to signify that a variable or argument can be of different types.

```python
def display(s: str | int | list[str]):
    print(s)

print('my_string')
print(1)
print(['my', 'string'])

# This will actually run but the linter will complain.
print({'my', 'string'})
```

In Rust, this works a bit differently. To print something, the variable needs to implement either the [`Display`](https://doc.rust-lang.org/rust-by-example/hello/print/print_display.html) trait ("normal" print) or the [`Debug`](https://doc.rust-lang.org/rust-by-example/hello/print/print_debug.html) trait (debug print). By using a `trait bound`, we can tell the compiler that only generic types which implement the `Display` or `Debug` trait are allowed as a argument to the function.

In the example below, we implement a function that accepts an argument of a generic type `T` that implements the `Debug` trait. Luckily, all Rust types in the `std` library automatically implement `Debug`.

```rust
use std::fmt::Debug;

fn display<T: Debug>(arg: T) {
    println!("{:?}", arg);
}

fn main() {
    display(1);
    display("my_string");
    display("my_string".to_string());
    display(vec!["my", "string"]);
}
```

## Deriving traits
What if we have a type that does not implement `Debug` by default? We can derive it using the `derive` macro.

In the following example, we'll create a `Struct` that by default does not implement `Debug`. By using the `derive` macro, we can subsequently call our `display` function.

```rust,editable
use std::fmt::Debug;

#[derive(Debug)] // Try commenting this out!
struct MyStruct<'a> {
    field_1: usize,
    field_2: &'a str,
    field_3: String,
    field_4: Vec<&'a str>,
}

fn display<T: Debug>(arg: T) {
    println!("{:?}", arg);
}

fn main() {
    let my_struct = MyStruct {
        field_1: 1,
        field_2: "my_string",
        field_3: "my_string".to_string(),
        field_4: vec!["my", "string"],
    };

    display(my_struct);
}
```

Other common Rust traits that can be derived or implemented manually are:
- [`Display`](https://doc.rust-lang.org/rust-by-example/hello/print/print_display.html)
- [`Clone`](https://doc.rust-lang.org/rust-by-example/trait/clone.html)
- [`Send`](https://doc.rust-lang.org/nomicon/send-and-sync.html)
- [`Sync`](https://doc.rust-lang.org/nomicon/send-and-sync.html)
- [`Ord`](https://doc.rust-lang.org/std/cmp/trait.Ord.html)
- [`PartialOrd`](https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html)
