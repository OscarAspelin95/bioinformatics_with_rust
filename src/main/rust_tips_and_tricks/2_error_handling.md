# Error Handling
It took a while for me to understand errors in Rust. I never understood the concept of using the <q>?</q> operator and why I could not simply use the panic! macro everywhere. One day, I came across the concept of recoverable and non-recoverable errors and that is when everything start making sense.

An *unrecoverable* error occurs when it makes sense to terminate the code. One example would be failing to read a file because it is corrupt. If our only goal is to parse the file and print its contents, but we cannot even read it, then we'd classify this as a unrecoverable error.


A *recoverable* error you can think of as when it is still safe or okay to proceed executing code. One example would be parsing lines from a file and one line has an unexpected structure. If we are okay with this, we can just skip this line and proceed to the next.

## Unrecoverable errors
In the code snippet below, we try to open a file that does not exist. Using .expect() will cause a panic, but this is okay because we allow this to be an unrecoverable error.
```rust
use std::fs::File;

fn main() {
    let _ = File::open("file_does_not_exist.txt").expect("Failed to open file");
}

```

## Recoverable errors
In the following example, our goal is to print out nucleotide sequences of a defined length, otherwise we print an error message. This is an example of handling recoverable errors by defining and catching specific errors.

```rust
#[derive(Debug)]
enum SeqError {
    InvalidLength(String),
}

impl std::fmt::Display for SeqError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            SeqError::InvalidLength(seq) => write!(f, "Invalid length: {seq}"),
        }
    }
}

fn get_nt_string(seq: String) -> Result<String, SeqError> {
    match seq.len() {
        5 => return Ok(seq), // In this example, we hard code length 5.
        _ => return Err(SeqError::InvalidLength(seq)),
    };
}

fn main() {
    let seqs: Vec<String> = vec!["ATCGA".to_string(), "ATCG".to_string(), "TTTTT".to_string()];

    for seq in seqs {
        let s = get_nt_string(seq);

        match s {
            Ok(seq) => println!("{seq}"),
            Err(e) => println!("{e}"),
        }
    }
}
```


Visit the [official documentation](https://doc.rust-lang.org/book/ch09-00-error-handling.html) for error handling to learn more. In addition, there are crates such as [anyhow](https://docs.rs/anyhow/latest/anyhow/) and [thiserror](https://docs.rs/thiserror/latest/thiserror/) that simplifies the generation of custom error types.
