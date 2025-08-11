# Create A nucleotide sequence

## String
There are many different string types in Rust, but the two most common ones are `String` and `&str`. Both can be used to store nucleotide sequences, but they have different characteristics. Usually, use `String` if you intend to mutate the sequence, otherwise use `&str`. For more information, visit the rust docs for [`String`](https://doc.rust-lang.org/std/string/struct.String.html) and [`&str`](https://doc.rust-lang.org/std/primitive.str.html) respectively.
```rust
fn main() {
    let nt_string: String = "ACGT".to_string();
    let nt_string: &str = "ACGT";
}
```

## Byte slice
Usually when reading nucleotide sequences from a FASTA/Q file, we get it as a byte slice, `&[u8]`, which is a more convenient format.

```rust
fn main() {
    let nt_string: &[u8] = b"ACGT";

    println!("{:?}", nt_string);
}
```
Run the code and examine the output. We get a bunch of numbers. This is the ASCII representation of our nucleotides, where `A/T/C/G` corresponds to an 8-bit representation. For more information, visit [this link](https://www.ascii-code.com/).

We can check that the following representations are equivalent:
```rust
fn main() {
    assert_eq!(b'A', 65);
    assert_eq!(b'C', 67);
    assert_eq!(b'G', 71);
    assert_eq!(b'T', 84);
}
```
## Binary
Will be covered in a later section. In short, using 8-bits is overkill for representing only four nucleotides. Instead, we can map `A/C/G/T` to the corresponding binary representation:

- `A` => `00`
- `C` => `01`
- `G` => `10`
- `T` => `11`
