# Lifetimes
The concept of [lifetimes](https://doc.rust-lang.org/rust-by-example/scope/lifetime.html) is related to how long variables are valid. Even though lifetimes are a rather complex concept, there are two common cases one has to consider:
- Variables are dropped at the end of their defined scope.
- References might need an explicit lifetime notation.

## Scopes
By default, variables are dropped at the end of their defined scope.

```rust
fn main() {
    let x: usize = 0;
} // x is dropped here.
```

The example above gets more interesting if we add a nested scope inside `main`. Try running the code below and see what happens.

```rust
fn main() {
    {
        let x: usize = 0;
    } // x is dropped here.

    println!("{x}");
}
```

The variable `x` goes out of scope before we try to print it, which is why the compiler complains. Switching the order around by defining `x` in the outer scope and printing it in the inner scope works, because `x` is still valid there.

```rust
fn main() {
    let x: usize = 0;

    { // x is still valid here.
        println!("{x}");
    }

} // x is dropped here.
```

The same principle applies to function scopes. Unless we `return`, variables defined inside a function scope will be dropped at the end.

```rust
fn my_function() -> String {
    let x: String = "my_string".to_string();

    // Anything else we define here and don't return
    // will be dropped at the end of the function scope.

    return x;
}

fn main() {
    let x = my_function();

    println!("{x}");
}
```

## Lifetime notation
To illustrate explicit lifetime notation, we'll create a `Struct` with a single field `my_string`, which is of type `&str`.

```rust
struct MyStruct {
    my_string: &str
}

fn main() {
    let my_struct = MyStruct {my_string: "Hello, world!"};
}
```

Try running the code and see what happens. We get a compiler error, stating that we need a lifetime parameter. Why is this? `my_string` is of type `&str`, which means that `MyStruct` does not own it. This also means `MyStruct` does not control when `my_string` is no longer valid. This is dangerous, because if `my_string` would get dropped and we subsequently try to read its value in `MyStruct`, we'd be in trouble. The Rust compiler needs some kind of assurance that `MyStruct` and `my_string` will both be valid for at least as long as each other. This is what lifetimes are for.

Lifetimes are signified with a `'`, followed by a name. E.g., `'a` would be a lifetime called `a`. To make the code run, we'll bind `MyStruct` and `my_string` to the same lifetime, telling the Rust compiler that `MyStruct` will live for at least as long as `my_string`.

```rust
struct MyStruct<'a> {
    my_string: &'a str
}

fn main() {
    let my_struct = MyStruct {my_string: "Hello, world!"};
}
```

The same concept applies to functions. In the following example, we'll define a function that takes no arguments and returns a `&str`.

```rust
fn my_function<'a>() -> &'a str{
    let x: &'a str = "my_string";

    return x;
}

fn main() {
    let x = my_function();

    println!("{x}");
}
```
