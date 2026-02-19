# Forward Strand

In order to insert a nucleotide, we need two things:
- A left shift by two to make room for the two new bits.
- Insert the actual nucleotide, which is done with the `|` operator (BitOR).

Hence, for the forward strand we add nucleotides from the **right side**.

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

## Handling the kmer size
Our approach kinda works, but it has a fundamental flaw. We want our storage variable to only contain k nucleotides at one time, all other leading bits should be zero. As an example:

```
nt_string = "GTGT"
kmer_size = 2

# start
0b00000000

# insert G
0b00000010

# insert T
0b00001011
```

At this point, we have inserted two nucleotides, which also is our target kmer length. In order to keep our target kmer size of 2, we need to:
- Insert the next nucleotide, G, resulting in a kmer of length 3.
- Mask anything above our kmer length to keep the length of 2.

We solve this by applying a bit-mask (as discussed previously). In the code example below, we also take care of invalid nucleotides.

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
#
#
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
fn print_nt_string(kmer: u64, k: usize) {
    let mut result = String::with_capacity(k);

    for i in 0..k {
        // Shift to extract the 2 bits corresponding to the current nucleotide
        let shift = 2 * (k - i - 1);
        let bits = (kmer >> shift) & 0b11;

        result.push(decode(bits));
    }

    println!("{}", result);
}

fn kmerize(kmer_size: usize, nt_string: &[u8]) {
    assert!(kmer_size <= nt_string.len());

    // Forward related kmer stuff
    let mut storage: u64 = 0;

    // Mask for bits above kmer size.
    let nbits = kmer_size << 1;
    let mask: u64 = (1 << nbits) - 1;

    // We keep track of how many valid nucleotides we
    // have in our storage and reset if we find an invalid nt.
    let mut valid_kmer_index: usize = 0;

    nt_string.iter().for_each(|nt_char| {
        // Forward kmer.
        let nt = LOOKUP[*nt_char as usize] as u64;

        // Reset if we found an invalid nucleotide.
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

fn main() {
    // We expect just one kmer.
    kmerize(5, b"AAAAA");

    // We expect no kmers.
    kmerize(5, b"AAAANAAAA");

    // We expect AAA, AAT, ATT, TTT.
    kmerize(3, b"AAATTT");
}
```

## Converting kmer to string
Finally, it would also be nice to be able to convert an encoded kmer to a string. We can do this by leveraging the `kmer_size` and a suitable bitmask.

Consider the kmer `0b00111010`. Here, we are using an `u8` as storage and `kmer_size = 3`. We have inserted nucleotides in the following order: `T`, `G`, `G` and would like to get the same order back. Even though there are multiple ways to do this, one is to extract the nucleotides in the order they appear in the kmer, which is the reverse of how they were inserted, and then reverse the result. We would like to:
- Find the lowest two bits (latest inserted nucleotide).
- Convert these to a stringified nucleotide and append it to something like a `Vec` or `String`.
- Eject these bits from the kmer by a left shift.
- Continue until we have processed all nucleotides (which is `kmer_size` number of times).

We need a suitable bitmask for this. To only keep the lowest two bits, we'll use `0b11` with and `&` operator. This roughly looks like:
```
0b00111010
&
0b00000011
---
0b00000010
```

The result can subsequently be matched against, and converted to the appropriate nucleotide. `0b10` in this case would translate to `G`. The code below is one way of achieving this:

```rust
fn extract_nucleotides(mut kmer: u8, kmer_size: u8) -> String {
    let mut s = String::with_capacity(kmer_size as usize);
    let mask: u8 = 0b11;

    for _ in 0..kmer_size {
        let lowest_two_nts = kmer & mask;

        match lowest_two_nts {
            0b00 => s.push('A'),
            0b01 => s.push('C'),
            0b10 => s.push('G'),
            0b11 => s.push('T'),
            _ => unreachable!(),
        }
        kmer >>= 2;
    }

    s.chars().rev().collect()
}

fn main(){
	assert!(extract_nucleotides(0b00111010, 3) == "TGG");
	assert!(extract_nucleotides(0b00000010, 3) == "AAG");
	assert!(extract_nucleotides(0b00000011, 1) == "T");	
}
```
