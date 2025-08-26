# Homopolymers
A *homopolymer* is defined stretch of consecutive, identical nucleotides. One example is the sequence below, in which there is a A-homopolymer of length 7.

<pre>
...ATCG<u>AAAAAAA</u>CACA...
</pre>

Why are homopolymers important? Biologically, they play a role in multiple functions, such as promoters and other regulatory regions. In addition, homopolymer regions have been shown to introduce systematic errors in Oxford Nanopore data, which is why these regions are important to identify and inspect.

In the code-snippet below, we implement a simple function for identifying homopolymer regions of a defined minimum length in a sequence.


```rust
fn find_homopolymers(seq: &[u8], min_hp_len: usize) -> Vec<&[u8]> {
    let mut homopolymers: Vec<&[u8]> = Vec::new();

    let seq_len = seq.len();

    // Skip checking if seq length is too short.
    if seq_len < min_hp_len {
        return homopolymers
    }

    let mut i = 0;
    let mut j = 1;

    // We only need to check homopolymers until our start index
    // is closer than min_hp_len to the end of the sequence.
    while i <= seq_len - min_hp_len {
        while j < seq_len && seq[j] == seq[i] {
            j += 1;
        }

        // We have a homopolymer of required length.
        if j - i >= min_hp_len{
            homopolymers.push(&seq[i..j]);
        }

        i = j;
        j += 1;
    }


    return homopolymers
}

fn main() {
    // Find all homopolymers of length >= 5.
    assert_eq!(find_homopolymers(b"AAAAA", 5), vec![b"AAAAA"]);

    // Find all homopolymers of length >= 3.
    assert_eq!(find_homopolymers(b"AAACCCTTTGGG", 3), vec![b"AAA", b"CCC", b"TTT", b"GGG"]);

    // Find all homopolymers of length >= 5.
    assert_eq!(find_homopolymers(b"ATCGAAAAAAAAAAGCTA", 5), vec![b"AAAAAAAAAA"]);

    // Find every nucleotide (makes no sense).
    assert_eq!(find_homopolymers(b"ATC", 1), vec![b"A", b"T", b"C"]);

}
```

In a real life application, we'd most likely do more than this such as saving the positions for identified homopolymers.
