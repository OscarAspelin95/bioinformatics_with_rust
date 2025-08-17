# Smart Pointers
In Rust, there is a set of smart-pointers to make our lives easier when it comes to things such as ownership, references, etc.

### Box
The `Box` smart-pointer is used to enforce heap allocation of the value, and stack allocation of the reference. It can be used in various applications, two of which are recursive datatypes and dynamic traits.

#### Recursive Datatypes
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

The problem is that the size of `MyStruct` is not known at compile time, which is a requirement for stack allocation. However, by using a `Box` we can enforce heap allocation of `MyStruct`, keeping its reference on the stack. Since references are fixed size, this works.

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

#### Dynamic Traits
Another use of `Box` is for dynamic traits.

### Rc
`Rc` stands for <q>Reference Count</q>

### Arc
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

### Cow
