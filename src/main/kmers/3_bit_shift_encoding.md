# Bit Shift Encoding
## Introduction
Our naive implementation works, but it is not very efficient because:
- We are using ASCII encoding for our bases, which takes up unecessary amounts of storage.
- Using a iterative sliding window approach is not feasible for long sequences.

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
- A => 0b00
- C => 0b01
- G => 0b10
- T => 0b11

## Choosing storage size
We use unsigned integers to store our kmers. Remember that each nucleotide occupies two bits. The following types are available in Rust:
- u8 - can store kmers of max size 8/2 = 4.
- u16 - can store kmers of max size 16/2 = 8.
- u32 - can store kmers of max size 32 / 2 = 16.
- u64 - can store kmers of max size 64/2 = 32.
- u128 - can store kmers of max size 128/2 = 64.

Can we store a kmer size of length 2 in, say a u16? Yes we can, but we'll waste space. In the following examples, we'll mostly deal with u32.

## Handling the forward strand
In order to insert a nucleotide, we need two things:
- A left shift by two to make room for the two new bits.
- Insert the actual nucleotide, which is done with the "|" operator (BitOR).

Hence, we add nucleotides from the **right side**.

```rust
fn main() {
    let mut storage: u32 = 0b0;

    // Insert a T.
    storage = storage << 2 | 0b11;
    assert_eq!(storage, 0b11);

    // Insert another T.
    storage = storage << 2 | 0b11;
    assert_eq!(storage, 0b1111);

    // Insert a G.
    storage = storage << 2 | 0b10;
    assert_eq!(storage, 0b111110);

    println!("{:032b}", storage);
}
```
**Note** - it seems like new digits magically appear in our example above. However, when we print the full u32, we see the leading zeros.

#### What actually happens is something more like this:

1. Add a "T":
<pre>
0b0[...]000000 << 2 = 0b0[...]000000 # shift by two nts, all zeros so not much happens.

    0b0[...]000000
    0b0[...]000011
    BitOR # insert the actual nt.
=   0b0[...]000011
</pre>

2. Add another "T":
<pre>
0b0[...]000011 << 2 = 0b0[...]001100 # shift by two nts, move first "T" two bits.

    0b0[...]001100
    0b0[...]000011
    BitOR # insert the actual nt.
=   0b0[...]001111
</pre>

3. Add a "G":
<pre>
0b0[...]001111 << 2 = 0b0[...]111100 # shift by two nts, move both "T"s two bits.

    0b0[...]111100
    0b0[...]000010
    BitOR # insert the actual nt.
=   0b0[...]111110
</pre>
## Handling the reverse complement
As mentioned in a previous section, we also need to handle the reverse complement. How do we do this in an efficient way? We insert the reverse complement from the left side instead of the right.

Lets go back to our example of "AGT". What we want to add is its reverse complement, which is "ACT". Remember that to reverse complement, we:
- Reverse the order of the sequence.
    - Handled by the right shift, which will insert a nucleotide from the left side.

- Convert to the complementary base.
    - Handled by complementing before inserting.

**NOTE** - here we need to take the kmer size into consideration, otherwise we might run into problems. Assume we have the following storage:

<pre>
0b00[...]00
</pre>
and, as an example, we want to insert a "T" (0b00[...]11) from the left. We first need to shift our nucleotide to the most significant two bits:
<pre>
0b00[...]11
    to
0b11[...]00
</pre>

After this, we can use our BitOR:
<pre>
    0b00[...]00 # storage (empty at the moment)
    0b11[...]00
    BitOR #
=   0b11[...]00 # storage now contains our "T".
</pre>

#### How do we shift our two nucleotide bits to the two most significant bits?

We use the following formula:
<pre>
shift = (k-1) * 2 # where k is the kmer size.
nt = nt << shift # Shifts the two least significant bits to the most significant bits.
</pre>

```rust
fn main() {
    let k: u8 = 4;

    let shift = ((k - 1) * 2) as usize;

    // Nucleotide "T".
    let mut nt = 0b11;

    nt = nt << shift;

    println!("{:08b}", nt);
}
```
With a kmer size of 4, we get 0b11000000. In our case, the value (k-1) * 2 equals 6, which means that we have shifted our nucletide 6 bits to the left.

This is our final implementation of handling reverse complements:
```rust
fn main() {
    let mut storage: u32 = 0b0;

    // Use kmer size 3 to exactly fit our three nucleotides
    // In the least significant bits.
    let k: u32 = 3;

    let forward = b"AGT";

    let shift: u32 = (k - 1) * 2;

    forward.iter().for_each(|nt| {
        let nt_encoded = match nt {
            b'A' => 0 as u32,
            b'C' => 1 as u32,
            b'G' => 2 as u32,
            b'T' => 3 as u32,
            _ => panic!(""),
        };
        // Use 3 - nt_encoded to get the reverse base.
        storage = storage >> 2 | (3 - nt_encoded) << shift;
    });

    // Print the full u32-bit.
    println!("{:032b}", &storage);
}
```

Run the code and inspect the result. Our output is:
<pre>
00 [...] 00 01 11
         A  C  T

</pre>
Which is the reverse complement of "AGT", inserted in the correct order.


## Implementation
```rust
fn encode(nt: &u8) -> u64 {
    match nt {
        b'A' => 0,
        b'C' => 1,
        b'G' => 2,
        b'T' => 3,
        _ => panic!("invalid nt {nt}"),
    }
}

fn decode(nt: &u64) -> u8 {
    match nt {
        0 => b'A',
        1 => b'C',
        2 => b'G',
        3 => b'T',
        _ => panic!("Invalid nt {nt}"),
    }
}

pub fn u64_kmer_to_string(kmer: &u64, k: usize) -> Vec<u8> {
    let mut bytes: Vec<u8> = vec![];

    let mask = 3;

    for i in 0..k {
        let val = kmer >> 2 * i;
        let val = val & mask;
        bytes.push(decode(&val));
    }

    let kmer_as_string = bytes.into_iter().rev().collect::<Vec<u8>>();

    return kmer_as_string;
}

fn kmerize(k: usize, nt_string: &[u8]) -> Vec<u64> {
    // Our kmer size cannot be larger then the sequence length.
    assert!(k <= nt_string.len());

    // This is where we store our "rolling" kmer.
    let mut kmer: u64 = 0;

    // This is where we store the generated kmers.
    let mut kmers: Vec<u64> = Vec::new();

    // Iterate over each nucleotide in the sequence.
    for i in 0..nt_string.len() {
        // Convert ASCII to u64 (A/T/C/G to 0/1/2/3).
        let nt = encode(&nt_string[i]);

        // Make room for nucleotide and then insert it.
        kmer = (kmer << 2) | nt;

        // For the first k-1 nt insertions, we don't have a full kmer yet.
        // However, note that index i starts at 0 (0-based) whilst our kmer size
        // is 1-based (we don't count 0). Hence, when i >= k-1, we have actually
        // inserted k nucleotides, which is our target.
        //
        // Example - a kmer_size of 3 means we push after inserting three nucleotides.
        // Since i starts at 0, we have inserted three nucleotides when i reaches 2 (index 0, 1 and 2).
        if i >= k - 1 {
            kmers.push(kmer);
        }
    }

    return kmers;
}

fn kmerize_wrapper(kmer_size: usize, nt_string: &[u8]) -> Vec<Vec<u8>> {
    let kmers = kmerize(kmer_size, nt_string);

    let kmers_as_strings: Vec<Vec<u8>> = kmers
        .iter()
        .map(|kmer| u64_kmer_to_string(kmer, kmer_size))
        .collect();

    return kmers_as_strings;
}
fn main() {
    let kmers = kmerize_wrapper(4, b"ATCGATCG");
    let formatted_kmers: Vec<&[u8]> = kmers.iter().map(|kmer| kmer.as_slice()).collect();
    assert_eq!(
        formatted_kmers,
        vec![b"ATCG", b"TCGA", b"CGAT", b"GATC", b"ATCG"]
    );
}
```
