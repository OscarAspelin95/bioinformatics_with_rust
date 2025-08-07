# FracMinHash
Previously, we implemented an efficient way of generating canonical kmers from nucleotide strings. Now, we'll take this a step further by covering FracMinHash. Briefly, FracMinHash is a clever way of downsampling a large set of kmers into a representative set. For a more detailed explanation, please check out this [paper](https://doi.org/10.1186/s13015-025-00276-8).

Essentially, we only add two steps to our canonical kmer pipeline:
- We hash our canonical kmer using an appropriate hashing function.
- We add our hashed kmer only if its hash is less than or equal to a defined threshold.

We define our threshold as the maximum possible integer value (in our case we'll use u64), divided by a downsampling factor.


```rust
# use std::collections::HashSet;
#
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
# fn decode(byte: u64) -> char {
#     match byte {
#         0 => return 'A',
#         1 => return 'C',
#         2 => return 'G',
#         3 => return 'T',
#         _ => panic!("Invalid nucleotide."),
#     };
# }
#
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

/// https://github.com/bluenote-1577/sylph
fn mm_hash64(kmer: u64) -> u64 {
    let mut key = kmer;
    key = !key.wrapping_add(key << 21);
    key = key ^ key >> 24;
    key = (key.wrapping_add(key << 3)).wrapping_add(key << 8);
    key = key ^ key >> 14;
    key = (key.wrapping_add(key << 2)).wrapping_add(key << 4);
    key = key ^ key >> 28;
    key = key.wrapping_add(key << 31);
    key
}

fn kmerize(k: usize, ds_factor: u64, nt_string: &[u8]) -> HashSet<u64> {
    if k >= nt_string.len() {
        panic!("kmer: {k}, nt_string: {}", nt_string.len());
    };

    // Forward related kmer stuff
    let mut kmer_forward: u64 = 0;

    let nbits = k << 1;
    let mask: u64 = (1 << nbits) - 1;

    // Reverse related kmer stuff.
    let mut kmer_reverse: u64 = 0;
    let shift = ((k - 1) * 2) as u64;

    // Storage.
    let mut canonical_hashes: HashSet<u64> = HashSet::with_capacity(nt_string.len() - k + 1);

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
        kmer_forward = (kmer_forward << 2 | nt) & mask;

        // Reverse kmer.
        let nt_rev = 3 - nt;
        kmer_reverse = kmer_reverse >> 2 | nt_rev << shift;

        if valid_kmer_index >= k - 1 {
            let canonical = match kmer_forward < kmer_reverse {
                true => kmer_forward,
                false => kmer_reverse,
            };
            // MinFracHash
            if canonical <= u64::MAX / ds_factor {
                canonical_hashes.insert(mm_hash64(canonical));
            }
        }

        valid_kmer_index += 1;
    });

    return canonical_hashes;
}

fn print_canonical_hashes(canonical_hashes: &HashSet<u64>){
    for canonical_hash in canonical_hashes{
        println!("{canonical_hash}");
    }
}

/// In these examples, we don't downsample because our
/// nucleotide strings are very short and have low complexity.
fn main(){
    let canonical_hashes = kmerize(5, 1, b"AAAAAAAAAA");
    print_canonical_hashes(&canonical_hashes);

    let canonical_hashes = kmerize(5, 1, b"TTTTTTTTTT");
    print_canonical_hashes(&canonical_hashes);

}
```
The result is a seemingly nonsensical number for each sequence. However, we note two important things:
- Each sequence only generated one hash.
- Both sequences generated the same hash.

The reasons for this are:
- The sequences are reverse complements, so they generate the same canonical kmers.
- Both sequences generate only one unique canonical kmer, `AAAAA`
