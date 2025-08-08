# Functions
As we saw earlier, a function is defined with `fn`.

```rust
fn main(){
    println!("Hello, world!");
}
```

To define a function that takes arguments, we need to define the argument names and types.
```rust
fn my_function(a: usize, b: usize) {
    println!("Arguments are {a} and {b}");
}

fn main() {
    let a: usize = 1;
    let b: usize = 2;

    my_function(a, b);
}
```

We also need to take into consideration if we are passing values as references and whether or not they are mutable. In the example below, we define a `Vec` as mutable and pass it by reference to a function `mutate_vec`. In order for this to work, the argument type of `mutate_vec` must be `&mut Vec<usize>` to signify that we are passing a mutable `Vec` by reference. We call `mutate_vec` from the main function with `&mut my_vec` to match the defined argument type `&mut Vec<usize>`.

```rust
fn mutate_vec(a: &mut Vec<usize>) {
    a[0] = 10;

    println!("{:?}", a);
}

fn main() {
    let mut my_vec: Vec<usize> = vec![1, 2, 3, 4, 5];

    mutate_vec(&mut my_vec);
}
```

Finally, we'll also add a return type, which is done with `->` in the function signature. In this example, we mutate the `Vec` inside `mutate_vec`, return a mutable reference to it and mutate it again.

```rust
fn mutate_vec(a: &mut Vec<usize>) -> &mut Vec<usize> {
    a[0] = 10;

    return a;
}

fn main() {
    let mut my_vec: Vec<usize> = vec![1, 2, 3, 4, 5];

    let mut my_mutated_vec: &mut Vec<usize> = mutate_vec(&mut my_vec);

    my_mutated_vec[0] = 20;
    println!("{:?}", my_mutated_vec);

}
```
