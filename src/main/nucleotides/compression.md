# Compression
Compression algorithms have been around for a long time. Examples span everything from [Huffman encoding](https://en.wikipedia.org/wiki/Huffman_coding) (used in e.g., `gzip`) to [Burrows Wheeler](https://en.wikipedia.org/wiki/Burrows%E2%80%93Wheeler_transform). In this section, we'll just cover some very basic ways of compressing a nucleotide sequence.

One very straightforward way to implement nucleotide compression would be to save how many times the same nucleotide appears in a row. E.g., `ATAAAAAGGCGCTTTA` -> `AT5A2GCGC3TA`. Since we preserve the order, this compression is easily reversible.

Another way of compression is nucleotide encoding, which is covered in more detail later on. It turns out that if we only allow `{A, C, G, T, a, c, g, t}`, we can map each base to 2 bits. E.g., `ATCG` -> `00110110`, which is extremely efficient when generating kmers.

## Homopolymer Compression
A similar, non reversible approach is homopolymer compression. We define a length `k`, at which we cap the maximum number of allowed adjacent identical nucleotides. E.g., with `k=3` we get `ATAAAAAGGCGCTTTA` -> `ATAAAGGCGCTTTA` and with `k=1` we get `ATAAAGGCGCTTTA` -> `ATAGCGCTA`. If we also store positional information, we can make this compression reversible.

In the code example below, we implement the non-reversible version of homopolymer compression for `k=1`, inspired by [isONclust3](https://github.com/aljpetri/isONclust3).

```rust
fn homopolymer_compression(seq: &[u8]) -> String {
    let mut hp_compressed = String::new();

    let mut previous: Option<&u8> = None;

    for nt in seq {
        // We are safe to unwrap because we checked if previous is None.
        if previous.is_none() || previous.unwrap() != nt {
            hp_compressed.push(*nt as char);
        }
        previous = Some(nt);
    }

    return hp_compressed;
}

fn main() {
    assert_eq!(homopolymer_compression(b"").as_bytes(), b"");
    assert_eq!(homopolymer_compression(b"AAAAAAAAAAAAA").as_bytes(), b"A");
    assert_eq!(homopolymer_compression(b"AATTCCGG").as_bytes(), b"ATCG");
    assert_eq!(homopolymer_compression(b"AAATTTTTT").as_bytes(), b"AT");
}
```

We can improve on this idea slightly to allow for arbitrary numbers of `k`. Instead of just checking if the previous nucleotide is the same as the current, we keep track of the number of adjacent nucleotides and write maximally `k` identical, adjacent nucleotides to our string.

```rust
fn homopolymer_compression(seq: &[u8], k: usize) -> String {
    assert!(k > 0, "value of k must be > 0.");

    let mut hp_compressed: String = String::new();
    let mut i: usize = 0;

    while i < seq.len() {
        let mut j = i + 1;

        while j < seq.len() && seq[j] == seq[i] {
            j += 1;
        }

        for _ in 0..std::cmp::min(j-i, k){
            hp_compressed.push(seq[i] as char);
        }
        i = j;
    }

    hp_compressed
}

fn main() {
    assert_eq!(homopolymer_compression(b"AAAAAAAAAAAA", 1).as_bytes(), b"A");
    assert_eq!(homopolymer_compression(b"AAAAAAAAAAAA", 2).as_bytes(), b"AA");
    assert_eq!(homopolymer_compression(b"AAATTTCCCGGG", 1).as_bytes(), b"ATCG");
    assert_eq!(homopolymer_compression(b"AAATTTCCCGGG", 2).as_bytes(), b"AATTCCGG");
    assert_eq!(homopolymer_compression(b"AAATTTCCCGGG", 3).as_bytes(), b"AAATTTCCCGGG");
    assert_eq!(homopolymer_compression(b"AAATTTCCCGGG", 100).as_bytes(), b"AAATTTCCCGGG");
}
```
