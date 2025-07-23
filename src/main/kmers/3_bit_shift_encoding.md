# Bit Shift Encoding
## Introduction
To streamline our kmer generation function, we need to understand a bit about bit shifting and how computers interpret data. Computers are ridiculously fast at [bitwise operations](https://www.geeksforgeeks.org/dsa/all-about-bit-manipulation/). We won't cover the details in this book, but we'll go over the things we need in order for our kmer script to work properly.

In our case, we'll use 2-bit encoding for our nucleotides:
- A => 0b00 (0 in base 10)
- C => 0b01 (1 in base 10)
- G => 0b10 (2 in base 10)
- T => 0b11 (3 in base 10)

### Bit shift
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

A left shift by one is equivalent to multiplying by 2. It make sense by considering 10-based numbers. Left shifting the number 10 by one results in 100, which is equivalent to multiplying by 10. The same is true for binary numbers.

### BitOR
The bitor operation (usually denoted with a pipe character "|") applies the OR operation to two binary numbers. Assume we want to insert a T (0b11) into an integer with value 0b00. We apply the bitor operation for this:

<pre>
0b00 # Storage.
bitor
0b11 # T.
=
0b11 # T.
</pre>

because applying the OR bitwise, we'll get 0b(0 OR 1)(0 OR 1) = 0b11

```rust
fn main() {
    // Insert A
    assert_eq!(0b00 | 0b00, 0b00);
    // Insert C
    assert_eq!(0b00 | 0b01, 0b01);
    // Insert G
    assert_eq!(0b00 | 0b10, 0b10);
    // Insert T.
    assert_eq!(0b00 | 0b11, 0b11);
}
```

### Bit masks
Bit masks can be used to manipulate a binary number certain ways. In our context, we'll use it to mask certain parts of our storage integer to ensure proper kmer length. Say we have inserted three Gs (0b101010), but we want to "mask" the upper two bits (the "oldest" G) because our kmer size is 2. Masking the upper two bits is the same as saying we only want to keep the lower 4 bits (two Gs).

For this, we'll use the AND operator, which only returns 1 if both bits at a given position in our numbers are 1. This way, we can use 1 for every bit we want to keep, and 0 for the rest.

```rust
fn main() {
    // Only keep the lower 4 bits, mask the rest (e.g., set to zero).
    assert_eq!(0b101010 & 0b001111, 0b001010);
}
```

How do we construct this mask programmatically? If we know our kmer size, we can do it. In the previous example, if our kmer size is 2, we want to keep 4 bits and mask the upper two. If we start with 1 (0b000001) and shift it 4 bits to the left, we get 0b010000. This number is larger than our desired mask, but only by one. Hence, we subtract 1. See code below:

```rust
fn main() {
    // Kmer size.
    let k = 2;

    // Number of bits we want to keep.
    let nbits = k << 1;
    assert_eq!(nbits, 4);

    // We start with a 1 (0b000001) and shifts it nbits to the left.
    // this results in 0b010000, hence we overshoot since we wanted 0b001111.
    // This is why we substract one, because 0b010000 - 0b000001 = 0b001111.
    let mask: u64 = (1 << nbits) - 1;


    assert_eq!(mask, 0b1111);

}
```



## Choosing storage size
We use unsigned integers to store our kmers. Remember that each nucleotide, with our encoding, occupies two bits. The following types are available in Rust:
- u8 - can store kmers of max size 8/2 = 4.
- u16 - can store kmers of max size 16/2 = 8.
- u32 - can store kmers of max size 32 / 2 = 16.
- u64 - can store kmers of max size 64/2 = 32.
- u128 - can store kmers of max size 128/2 = 64.

Can we store a kmer size of length 2 in, say a u16? Yes we can, but we'll waste space.
