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
Our approach kinda works, but it has a fundamental flaw. We want our storage variable to only contain k nucleotides at one time, all other leading bits should be zero. As as example:

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
