# Making something useful
We'll finish this chapter off by calculating the similarity between two nucleotide strings by applying MinFracHash. We'll simply generate all MinFracHashes for the query and subject, followed by calculating the fraction of query hashes that are identical to the subject.


```rust
# use std::collections::HashSet;
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
# /// https://github.com/bluenote-1577/sylph
# fn mm_hash64(kmer: u64) -> u64 {
#     let mut key = kmer;
#     key = !key.wrapping_add(key << 21);
#     key = key ^ key >> 24;
#     key = (key.wrapping_add(key << 3)).wrapping_add(key << 8);
#     key = key ^ key >> 14;
#     key = (key.wrapping_add(key << 2)).wrapping_add(key << 4);
#     key = key ^ key >> 28;
#     key = key.wrapping_add(key << 31);
#     key
# }
#
# fn kmerize(k: usize, ds_factor: u64, nt_string: &[u8]) -> HashSet<u64> {
#     if k >= nt_string.len() {
#         panic!("kmer: {k}, nt_string: {}", nt_string.len());
#     };
#
#     // Forward related kmer stuff
#     let mut kmer_forward: u64 = 0;
#
#     let nbits = k << 1;
#     let mask: u64 = (1 << nbits) - 1;
#
#     // Reverse related kmer stuff.
#     let mut kmer_reverse: u64 = 0;
#     let shift = ((k - 1) * 2) as u64;
#
#     // Storage.
#     let mut canonical_hashes: HashSet<u64> = HashSet::with_capacity(nt_string.len() - k + 1);
#
#     let mut valid_kmer_index: usize = 0;
#
#     nt_string.iter().for_each(|nt_char| {
#         // Forward kmer.
#         let nt = LOOKUP[*nt_char as usize] as u64;
#
#         if nt >= 4 {
#             valid_kmer_index = 0;
#             kmer_forward = 0;
#             kmer_reverse = 0;
#             return;
#         }
#         kmer_forward = (kmer_forward << 2 | nt) & mask;
#
#         // Reverse kmer.
#         let nt_rev = 3 - nt;
#         kmer_reverse = kmer_reverse >> 2 | nt_rev << shift;
#
#         if valid_kmer_index >= k - 1 {
#             let canonical = match kmer_forward < kmer_reverse {
#                 true => kmer_forward,
#                 false => kmer_reverse,
#             };
#             // MinFracHash
#             if canonical <= u64::MAX / ds_factor {
#                 canonical_hashes.insert(mm_hash64(canonical));
#             }
#         }
#
#         valid_kmer_index += 1;
#     });
#
#     return canonical_hashes;
# }
// [...]

fn similarity(query: &[u8], subject: &[u8], kmer_size: usize, ds_factor: u64) -> f32 {
    let query_hashes: HashSet<u64> = kmerize(kmer_size, ds_factor, query);
    let subject_hashes: HashSet<u64> = kmerize(kmer_size, ds_factor, subject);

    // This is one way to check for common elements between two sets.
    let common_hashes = subject_hashes.intersection(&query_hashes).count();

    return common_hashes as f32 / subject_hashes.len() as f32;
}

fn main() {
    let s = similarity(b"AAAAAAAAAA", b"ATTTTTTTTTTTTTTTTTT", 5, 1);
    println!("Frac common hashes: {s:.1}");
}
```

In this case, we can only generate two unique kmers from the subject, of which one is found in the query.
