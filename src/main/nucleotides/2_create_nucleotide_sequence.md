# Create nucleotide sequence

To start off, we just create a nucleotide sequence as a String.
```rust
fn main(){
    let nt_string: String = "ACGT".to_string();

    println!("{nt_string}");
}

```

However, usually when reading nucleotide sequences from a FASTA/Q parser, we get it in binary form &[u8] which is a more convenient format.

```rust
fn main(){
    let nt_string_binary: &[u8] = b"ACGT";

    // Here, we need to print in debug mode.
    println!("{:?}", nt_string_binary);
}
```
Run the code and examine the output. We get a bunch of numbers. This is the ASCII representation of our nucleotides, where A/T/C/G corresponds to an 8-bit representation. For more information, visit [this link](https://www.ascii-code.com/).

We can check that the following representations are equivalent:
```rust
fn main(){
    // Note that here we use single quotes
    // because we are dealing with single chars.
    assert_eq!(b'A', 65);
    assert_eq!(b'C', 67);
    assert_eq!(b'G', 71);
    assert_eq!(b'T', 84);
}
```
Onwards, we'll work with nucleotide sequences in both binary and string representations. Remember:
- Binary form looks like b"[...]" and has the type &[u8].
- String form looks like "[...]" (&str) or "[...]".to_string() (String).

For more information about string types in Rust, click [here](https://doc.rust-lang.org/rust-by-example/std/str.html).
