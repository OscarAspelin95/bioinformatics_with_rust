# Keywords
`use` - is used for importing. E.g., `use std::num::ParseIntError`

`let` - initializes something immutable. E.g., `let x: usize = 10;`

`mut` - makes something mutable. E.g., `let mut x: usize = 10;`

`fn` - defines a function. This is analogous to Python's `def` keyword. E.g.,
```rust
fn main() {
    println!("Hello, world!");
}
```

`struct` - defines a struct. This is kind of analogous to `class` in Python. E.g.,
```rust,noplayground
struct MyStruct {
    field1: usize,
    field2: f32,
    field3: bool,
}
```
`enum` - defines an enum. This is kind of analogous to `Enum` in Python. E.g.,
```rust,noplayground
enum MyEnum {
    Choice1,
    Choice2,
    Choice3,
}
```

`pub` - makes something like a function or struct public, meaning that other Rust files can access them. E.g.,
```rust,noplayground
pub struct MyStruct {
    field1: usize,
    field2: f32,
    field3: bool,
}
```

`loop` - creates an infinite loop until a `break` statement is encountered. E.g.,
```rust
fn main() {
    let mut x: usize = 0;

    loop{
        x += 1;

        println!("{x}");

        if x >= 5{
            break;
        }
    }
}
```

`for` - creates a loop over an iterator. E.g.,
```rust
fn main() {
    for i in (0..5){
        println!("{i}");
    }
}
```

`while` - creates a loop that keeps running as long as its condition is true. E.g.,
```rust
fn main() {
    let mut x: usize = 0;

    while x <= 5 {
        println!("{x}");
        x += 1;
    }
}
```
