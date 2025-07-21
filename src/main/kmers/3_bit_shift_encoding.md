# Bit Shift Encoding
## Introduction
To streamline our kmer generation function, we need to understand a bit about bit shifting and how computers interpret data. Computers are ridiculously fast at [bitwise operations](https://www.geeksforgeeks.org/dsa/all-about-bit-manipulation/). We won't cover the details in this book, but we'll go over the things we need in order for our kmer script to work properly.


A *left shift* is defined as an operation in which the bits in a binary number are shifted to the left. The most significant bit (leftmost) is lost, and the least significant bit (righmost) is shifted after which a zero is added.

- Example: 0010 << 1 = 0100

A *right shift* does the opposite.

- Example: 0100 >> 1 = 0010

```rust
fn main() {
    // Perform a left shift.
    assert_eq!(0b0010 << 1, 0b0100);

    // Perform a right shift.
    assert_eq!(0b0100 >> 1, 0b0010);
}
```

In our case, we'll use 2-bit encoding for our nucleotides:
- A => 0b00 (0 in base 10)
- C => 0b01 (1 in base 10)
- G => 0b10 (2 in base 10)
- T => 0b11 (3 in base 10)

## Choosing storage size
We use unsigned integers to store our kmers. Remember that each nucleotide, with our encoding, occupies two bits. The following types are available in Rust:
- u8 - can store kmers of max size 8/2 = 4.
- u16 - can store kmers of max size 16/2 = 8.
- u32 - can store kmers of max size 32 / 2 = 16.
- u64 - can store kmers of max size 64/2 = 32.
- u128 - can store kmers of max size 128/2 = 64.

Can we store a kmer size of length 2 in, say a u16? Yes we can, but we'll waste space.
