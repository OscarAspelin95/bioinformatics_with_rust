# Create a Project
Time to start! Enter your favorite directory and run `cargo new my_rust_project`. In the generated directory, you'll see one file `Cargo.toml` and one directory `src`.

`Cargo.toml` is where all of your dependencies go. For more information, visit the [official reference](https://doc.rust-lang.org/cargo/reference/manifest.html).

`src` is where all of your Rust scripts go. For now, we only have `main.rs`, which is the entrypoint to the program.

Use `cargo run` to compile and run the program. It should output <q>Hello, world!</q>. The `main.rs` file is very basic and should look something like this:

```rust
fn main() {
    println!("Hello, world!");
}
```
Note that we must have a `main()` function, otherwise it won't compile.
