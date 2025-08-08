# Ownership and Borrowing
Ownership can initially be a rather tricky topic to understand. The reader is adviced to read the official [reference](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html) on ownership.

I like to think of ownership in terms of scopes. A variable is valid when it inside the scope it was defined in. When the scope ends, the variable is dropped from memory. This might not always be true, but this way of thinking simplified the ownership concept for me quite a lot. Consider the following example:

```rust
fn main() {
    // Create a nested scope.
    {
        let x: usize = 0;
        println!("{x}");
    }
}
```

It is perfectly valid to use `println!` whilst we are inside the scope, because `x` is still valid here. Once we move outside of this scope, `x` is dropped. This means we cannot move our `println!` outside of the scope where `x` is defined.

```rust,editable
fn main() {
    // Create a nested scope.
    {
        let x: usize = 0;
    }

    // try commenting this out!
    // println!("{x}");
}
```

The same goes for heap-allocated variables that are passed by value (i.e., we are not passing a reference). In the following example, we'll create a `Vec` and pass it by value to a function `print_vec`. As we will see, the Rust compiler won't let us print the `Vec` anymore in the main function.

```rust,editable
fn print_vec(x: Vec<usize>) {
    println!("[print_vec]: {:?}", x);
}


fn main() {
    let x: Vec<usize> = vec![1, 2, 3, 4, 5];

    print_vec(x); // x is passed by value here. Ownership is transferred to print_vec.

    // try commenting this out!
    // println!("[main]: {:?}", x);
}
```

How do we solve this? We can pass `x` by reference. This way, `x` is still owned by `main` and borrowed by `print_vec`.

```rust
fn print_vec(x: &Vec<usize>) {
    println!("[print_vec]: {:?}", x);
}

fn main() {
    let x: Vec<usize> = vec![1, 2, 3, 4, 5];

    print_vec(&x); // x is passed by reference here. main still owns x.
    println!("[main]: {:?}", x);
}
```

What about mutable references? Remember that a variable can only have one mutable reference existing at a given time. If we pass `x` as a mutable reference to a new function `mutate_vec`, `main` still has ownership of `x` so we are good.

```rust
fn mutate_vec(x: &mut Vec<usize>) {
    x[0] = 10;

    println!("[mutate_vec]: {:?}", x);
}

fn main() {
    let mut x: Vec<usize> = vec![1, 2, 3, 4, 5];

    mutate_vec(&mut x); // x is passed by (mutable) reference here. main still owns r.
    println!("[main]: {:?}", x);
}
```

However, we would run into issues if we try dereferencing `x` inside `mutate_vec`. In the example below, we try dereferencing `x` into a variable `y` inside `mutate_vec`. This is not allowed because we don't own `x`. We have only borrowed it, so we cannot move its value.

```rust,editable
fn mutate_vec(x: &mut Vec<usize>) {
    x[0] = 10;

    // try commenting this out!
    // let y = *x;

    println!("[mutate_vec]: {:?}", x);
}

fn main() {
    let mut x: Vec<usize> = vec![1, 2, 3, 4, 5];

    mutate_vec(&mut x); // x is passed by (mutable) reference here. main still owns r.
    println!("[main]: {:?}", x);
}
```
