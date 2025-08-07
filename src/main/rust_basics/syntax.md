# Syntax
The Rust syntax is similar to other languages such as C and C++:

### Variable declaration
Rust is a statically typed language, which means that the type of a variable needs to be known, either explicitly or implicitly. The basic syntax for variable declaration is `let name: type = value;`. E.g.,
```rust
fn main(){
    let x: usize = 0; // unsigned integer.
    let x: &str = "Hello, world!"; // string slice.
    let x: String = "Hello, world!".to_string(); // string.
    let x: &[u8] = b"Hello, world!"; // byte slice.
    let x: Vec<usize> = vec![1, 2, 3, 4, 5]; // vec.
}
```

### Scopes
`{` and `}` define scopes. E.g.,
```rust
fn main(){ // start of function scope.
    println!("Hello, world!");
} // end of function scope.
```

We can also have nested scopes. E.g.,
```rust
fn main(){
    let x: &str = "Hello, world!";

    {
        println!("{x}");
    }
}
```
Scopes are important for ownership and lifetimes, which will be covered in later on.

### Statement deliminators
`;` is used for statement deliminators. E.g.,
```rust
fn main(){
    println!("Hello, world!"); // Defines the println! statement.
} // does not need a ";".
```
Note that scopes do not need a `;` terminator.
