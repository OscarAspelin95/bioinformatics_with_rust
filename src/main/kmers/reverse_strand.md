# Reverse Strand

As mentioned in a previous section, we also need to handle the reverse complement. How do we do this in an efficient way? We can insert the reverse complement from the left side instead of the right, ensuring the correct order. To insert from the left side, we first need to shift the two least significant bits, our nucleotide, to the upper most significant bits of our kmer. Then, we shift our storage to the right by 2 and finally apply BitOR to insert.

The following pseudo-code shows how to insert a nucleotide A whilst using `k=4`.
```
// Define variables.
k = 4
nt      =   0b0000000000 # A
nt_rev  =   0b0000000011 # T (reverse complement)
storage =   0b0000000000

// Shift reverse nucleotide to the upper two bits of the kmer size.
0b0000000011 << (k-1) * 2 = 0b0011000000

// Shift storage to the right to make room (empty at the moment).
0b0000000000 >> 2 = 0b0000000000

// Insert.
0b0000000000 | 0b0011000000 = 0b0011000000
```

The following code is an example of inserting the reverse complement of `AGT` into a `u32`. We'll make it easy for us and use a `k=3` to exactly fit the entire reverse complement into the kmer.

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

    // Verify: reverse complement of AGT is ACT, encoded as 00 01 11.
    assert_eq!(storage, 0b000111);
}
```

Run the code and inspect the result. Our output is:
<pre>
00 [...] 00 01 11
         A  C  T

</pre>
Which is the reverse complement of `AGT`, inserted in the correct order.
