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
**Note** - it seems like new digits magically appear in our test cases. However, when we print the full u32, we see the leading zeros.

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

### Handling the kmer size
Our approach kinda works, but it has a fundamental flaw. We want our storage variable to only contain k nucleotides at one time, all other leading bits should be zero. As as example:

<pre>
nt_string = "GTGT"
kmer_size = 2

# start
0b00000000

# insert G
0b00000010

# insert T
0b00001011

# When inserting the third nt G, we want this
# because our kmer size is 2.
0b00001110

If we don't account for the kmer size, we'd get
a kmer of size 3, which is not what we want.
0b00101110
</pre>


We solve this by applying a bit-mask. The example below handles this, and also handles nucleotides that are not A/T/C/T by just ignoring those kmers.

```rust

# const LOOKUP: [u8; 256] = [
#     0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 0, 4, 1, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 0, 4, 1, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
# ];


# fn decode(byte: u64) -> char {
#     match byte {
#         0 => return 'A',
#         1 => return 'C',
#         2 => return 'G',
#         3 => return 'T',
#         _ => panic!("Invalid nucleotide."),
#     };
# }

// [...]

/// Print a u64 encoded nucleotide with some bit manipulation.
pub fn print_nt_string(kmer: u64, k: usize) {
    let mut result = String::with_capacity(k);
    for i in 0..k {
        // Shift to extract the 2 bits corresponding to the current nucleotide
        let shift = 2 * (k - i - 1);
        let bits = (kmer >> shift) & 0b11;

        result.push(decode(bits));
    }
    println!("{}", result);
}

fn kmerize(kmer_size: usize, nt_string: &[u8]){
    assert!(kmer_size <= nt_string.len());

    // Forward related kmer stuff
    let mut storage: u64 = 0;

    // Mask for bits above kmer size.
    let nbits = kmer_size << 1;
    let mask: u64 = (1 << nbits) - 1;

    let mut valid_kmer_index: usize = 0;

    nt_string.iter().for_each(|nt_char| {
        // Forward kmer.
        let nt = LOOKUP[*nt_char as usize] as u64;

        if nt >= 4 {
            valid_kmer_index = 0;
            storage = 0;
            return;
        }
        storage = (storage << 2 | nt) & mask;



        if valid_kmer_index >= kmer_size - 1 {
            print_nt_string(storage, kmer_size);
        }

        valid_kmer_index += 1;
    });
}

fn main(){
    // We expect just one kmer.
    kmerize(5, b"AAAAA");

    // We expect no kmers.
    kmerize(5, b"AAAANAAAA");

    // We expect AAA, AAT, ATT, TTT.
    kmerize(3, b"AAATTT");
}

```










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

# const LOOKUP: [u8; 256] = [
#     0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 0, 4, 1, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 0, 4, 1, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
#     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
# ];


# fn decode(byte: u64) -> char {
#     match byte {
#         0 => return 'A',
#         1 => return 'C',
#         2 => return 'G',
#         3 => return 'T',
#         _ => panic!("Invalid nucleotide."),
#     };
# }

# /// Print a u64 encoded nucleotide with some bit manipulation.
# pub fn print_nt_string(kmer: u64, k: usize) {
#     let mut result = String::with_capacity(k);
#     for i in 0..k {
#         // Shift to extract the 2 bits corresponding to the current nucleotide
#         let shift = 2 * (k - i - 1);
#         let bits = (kmer >> shift) & 0b11;
#
#         result.push(decode(bits));
#     }
#     println!("{}", result);
# }

// [...]

pub fn kmerize(k: usize, nt_string: &[u8]){
    assert!(k <= nt_string.len());

    // Forward related kmer stuff
    let mut kmer_forward: u64 = 0;

    let nbits = k << 1;
    let mask: u64 = (1 << nbits) - 1;

    // Reverse related kmer stuff.
    let mut kmer_reverse: u64 = 0;
    let shift = ((k - 1) * 2) as u64;

    let mut valid_kmer_index: usize = 0;

    nt_string.iter().for_each(|nt_char| {
        // Forward kmer.
        let nt = LOOKUP[*nt_char as usize] as u64;

        if nt >= 4 {
            valid_kmer_index = 0;
            kmer_forward = 0;
            kmer_reverse = 0;
            return;
        }
        // Forward kmer.
        kmer_forward = (kmer_forward << 2 | nt) & mask;

        // Reverse kmer.
        let nt_rev = 3 - nt;
        kmer_reverse = kmer_reverse >> 2 | nt_rev << shift;

        if valid_kmer_index >= k - 1 {
            let canonical = match kmer_forward < kmer_reverse {
                true => kmer_forward,
                false => kmer_reverse,
            };

            print_nt_string(canonical, k);
        }

        valid_kmer_index += 1;
    });

}

fn main(){
    kmerize(5, b"AAAAAA");
    kmerize(5, b"TTTTTT");
    kmerize(5, b"AAAANTTTT");
}
```
