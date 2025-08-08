# Lifetimes
The concept of [lifetimes](https://doc.rust-lang.org/rust-by-example/scope/lifetime.html) is related to for how long variables are valid. As an example, we'll create a struct with a single field `my_string`, which is of type `&str`.

```rust
struct MyStruct {
    my_string: &str
}

fn main() {
    let my_struct = MyStruct {my_string: "Hello, world!"};
}
```

Try running the code and see what happens. We get a compiler error, stating that we need a lifetime parameter. Why is this? `my_string` is of type `&str`, which means that `MyStruct` does not own it. This also means `MyStruct` does not control when `my_string` is no longer valid. This is dangerous, because if `my_string` would go out of scope and we subsequently try to read its value in `MyStruct`, we'd be in trouble. The Rust compiler needs some kind of assurance that `MyStruct` will be valid at least for as long as `my_string`. This is what lifetimes are for.

Lifetimes are signified with a `'`, followed by a name. E.g., `'a` would be a lifetime called `a`. To make the code run, we'll bind `MyStruct` and `my_string` to the same lifetime, telling the Rust compiler that `MyStruct` will live for at least as long as `my_string`.

```rust
struct MyStruct<'a> {
    my_string: &'a str
}

fn main() {
    let my_struct = MyStruct {my_string: "Hello, world!"};
}
```

Note that lifetimes also apply to functions and other objects!
