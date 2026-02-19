# Rust Basics
Even though I stated that this book wouldn't include an introduction to Rust, here we are. This chapter only covers some of the basics and the reader is strongly encouraged to visit [resources](../../suffix/resources.md#resources) for a more comprehensive take on Rust.

Below is a summary of some of the things I personally like and dislike with Rust. This might give the reader some insight into whether or not Rust would be a suitable language for them.

## Why I like Rust
- **The Rust Compiler Is Amazing**. The error messages it produces actually teaches you about Rust and why you cannot do certain things. It even gives you suggestions on how to make changes to your code to make it work correctly.

- **Declarative Mutability**. Variables that are not declared with the `mut` keyword are immutable, meaning that they cannot change (disregarding interior mutability, which won't be covered here).

- **Fast Growing Community**. There are endless Rust crates available at [crates.io](https://crates.io/), some of which will make your Rust programming journey much more enjoyable.

- **Cargo**. It just works. Install a crate? Use `cargo install`. Run your code? Use `cargo run`.

## Why I dislike Rust
- **Compile Times**. Compared to languages such as Go, Rust takes ages to compile. This is especially true when the dependencies are piling up.

- **Verbose Syntax**. In my personal opinion, Rust is a rather verbose language. Some people might like that, some people don't. Luckily, the rust-analyzer VScode extension helps out a lot with auto-completion and other neat features.

- **Steep Learning Curve**. Coming from the Python world, I had a really difficult time with Rust in the beginning. It was not just switching to a compiled language, but also having to learn about lifetimes, ownership and so on. But trust me, it gets easier.
