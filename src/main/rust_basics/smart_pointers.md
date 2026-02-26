# Smart Pointers
In Rust, there is a set of smart-pointers to make our lives easier when it comes to things such as ownership, references, etc.

## Box
The `Box` smart-pointer is used to enforce heap allocation of the value, and stack allocation of the reference. It can be used in various applications, two of which are recursive datatypes and dynamic traits.

### Recursive Datatypes
Let's define a `Struct` which has a field `inner` that references itself (i.e., a recursive structure). If we try to run this, we'll get a compiler error.

```rust
struct MyStruct{
    inner: Option<MyStruct>,
    value: usize
}

fn main(){
    let my_struct = MyStruct {value: 0, inner: Some(MyStruct { value: 1, inner: None}) };
}
```

The problem is that the size of `MyStruct` is not known at compile time, which is a requirement for stack allocation. However, by using a `Box` we can enforce heap allocation of `MyStruct`, keeping its reference on the stack. Since references are compile-size-known, this works.

```rust
struct MyStruct{
    inner: Option<Box<MyStruct>>,
    value: usize
}

fn main(){
    let my_struct = Box::new(MyStruct {value: 0, inner: Some(Box::new(MyStruct { value: 1, inner: None})) });
}
```

The obvious downside here is that the code becomes rather verbose.

### Dynamic Traits
Another use of `Box` is for dynamic traits. One example of this is to create a `BufWriter` that writes either to file or stdout depending on if we provide an output file. We'll define a function `get_bufwriter`, that wraps `BufWriter` around either `File` or `Stdout` depending on the argument `outfile`. We want something like this (in pseudo-code):

```rust,noplayground
fn get_bufwriter(outfile: Option<PathBuf>) -> ??? {
    match outfile {
        Some(outfile) => return BufWriter::new(File::create(outfile).unwrap());
        None => return BufWriter::New(stdout());
    }
}
```

However, Rust does not natively allow us to return a value that can be of two different types, `BufWriter<File>` or `BufWriter<Stdout>`. Fortunately, both types have the `Write` trait implemented. By wrapping `File` and `Stdout` in a `Box`, we can change our return type to the more generic `BufWriter<Box<dyn Write>>`. Conceptually, this signature means that the return type is a `BufWriter` wrapped around a type that implements the `Write` trait. The `dyn` keyword is related a [trait object](https://doc.rust-lang.org/std/keyword.dyn.html)'s type. Because the exact size of `Write` is not known at compile-time, we need to use `Box`.

```rust
use std::{
    fs::File,
    io::{BufWriter, Write, stdout},
    path::PathBuf,
};

fn get_bufwriter(outfile: Option<PathBuf>) -> BufWriter<Box<dyn Write>> {
    match outfile {
        Some(outfile) => return BufWriter::new(Box::new(File::create(outfile).unwrap())),
        None => return BufWriter::new(Box::new(stdout())),
    }
}

fn main() {
    // Create a writer that writes to stdout.
    let mut writer = get_bufwriter(None);
    writer.write(b"This will be written to stdout!\n").unwrap();

    // // Commented out for obvious reasons.
    // let mut writer = get_bufwriter(Some(PathBuf::from("file.txt")));
    // writer
    //     .write(b"This will be written to the output file!\n")
    //     .unwrap();
}
```

## Rc
`Rc` stands for <q>Reference Counting</q> and is for single-threaded, multiple ownership. By creating multiple references to a variable (increasing the reference count), we can prevent the variable from being dropped until the reference count reaches zero. A good analogy would be multiple people watching the same TV. We don't want the TV to turn off until all people stop watching.

```rust
use std::rc::Rc;

#[allow(unused)]
fn main() {
    let x: Rc<usize> = Rc::new(0);

    assert_eq!(Rc::strong_count(&x), 1);
    println!("{}", Rc::strong_count(&x));

    {
        let x_clone = x.clone();
        assert_eq!(Rc::strong_count(&x), 2);
        println!("{}", Rc::strong_count(&x));
    } // x_clone is dropped here, reference count to x will decrease by one.

    assert_eq!(Rc::strong_count(&x), 1);
    println!("{}", Rc::strong_count(&x));
}
```

## Arc
`Arc` stands for <q>Atomic Reference Count</q> and is a thread safe alternative to `Rc`. It is commonly used together with `Mutex` for exclusive read/write access. One example is trying to push elements from different threads to a shared `Vec` instance. We need to ensure that our threads do not read and write at the same time since this can cause lockings and undefined behavior.

In the example below, we create a `Vec` for storing a message from each thread. We wrap it in `Arc<Mutex<>>` to ensure thread safety. Then we spawn four threads, each of which will push a `String` to our `Vec`. By using `.lock()` we can make sure only one thread can access our `Vec` at a given time. Finally, we wait for all threads to finish and print the results.

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let v: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(vec![]));

    let mut handles = Vec::new();

    for i in 0..4 {
        // Each thread will get its own reference to the Arc<Mutex<Vec<String>>>.
        let v_clone = v.clone();

        let s = thread::spawn(move || {
            v_clone
                .lock()
                .unwrap()
                .push(format!("Hello from thread {}", i));
        });

        handles.push(s);
    }

    // Wait for and join the spawned threads.
    for h in handles {
        h.join().unwrap();
    }

    // Extract our Vec from the Arc<Mutex<>>.
    let v_done = Arc::into_inner(v).unwrap().into_inner().unwrap();

    for s in v_done {
        println!("{s}");
    }
}
```

## Cow
The Clone-On-Write smart pointer provides immutable access to borrowed data with the ability to lazily clone data when mutability or ownership is required. `Cow` is usable for cases where most of the time, we don't need to mutate data.

Consider the example below, where we want to convert a `&str` to lowercase. If we expect that most of the time our `&str` is already lowercase, we can return it as is most of the time with `Cow::Borrowed()`. However, for those rare cases when we need to modify it, we use `Cow::Owned()`.


```rust
use std::borrow::Cow;

fn convert_to_lowercase(x: &str) -> Cow<'_, str> {
    if x.chars().any(|c| c.is_uppercase()) {
        return Cow::Owned(x.to_lowercase());
    }

    return Cow::Borrowed(x);
}

fn make_lowercase(x: &str) -> Cow<'_, str> {
    let x_uppercase = convert_to_lowercase(&x);

    match &x_uppercase {
        Cow::Borrowed(_) => {
            println!("Is borrowed.");
        }
        Cow::Owned(_) => {
            println!("Is owned.");
        }
    }

    return x_uppercase;
}

#[allow(unused)]
fn main() {
    // Lowercase conversion not needed.
    let x = "my_string";
    let x_lowercase = make_lowercase(x);

    // Lowercase conversion needed.
    let y = "My_String";
    let y_lowercase = make_lowercase(y);
}
```

To be honest, I still fully do not understand the details of `Cow` and I rarely use it in my own code. However, I'm sure it is useful.
