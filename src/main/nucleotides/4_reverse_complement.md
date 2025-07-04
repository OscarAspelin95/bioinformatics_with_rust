# Reverse complement
Next, we cover a fundamental topic, which is reverse complementing. Why is this important?

DNA is (generally) double stranded, where bases are paired:
- A pairs with T and vice versa.
- G pairs with C and vice versa.

<pre>
5' [...]ACGAGCTTTGTGACGCGATGCGACGAGCTGCAGCGT[...] 3'
3' [...]TGCTCGAAACACTGCGCTACGCTGCTCGACGTCGCA[...] 5'
</pre>

Pretend this is a bacterial genome we want to sequence. Before sequencing, we need to separate the strands and break this molecule into smaller pieces. When doing this, we don't know which pieces are from which strand.

When we want to align the pieces back to a reference sequence (which is defined in the 5' to 3' direction), we need to take both strands into consideration. Otherwise, we loose out on information. We do this by reverse complementing, in which we first reverse the sequence, and then replace each base with the corresponding matching base.

For example, the reverse complement of ATCG would be CGAT.

We can relatively easily write a Rust function for reverse complementing a nucleotide sequence:
```rust
fn reverse(nt: char) -> char {
    match nt {
        'A' => 'T',
        'C' => 'G',
        'G' => 'C',
        'T' => 'A',
        _ => panic!("Invalid nt {nt}"),
    }
}

fn reverse_complement(nt_string: &'static str) -> String {
    let rev_comp: String = nt_string
        // Iterate over each character.
        .chars()
        // Reverse the iteration order.
        .rev()
        .map(|nt| {
            return reverse(nt);
        })
        .collect();

    return rev_comp;
}
fn main() {
    // Note that we use strings and not &[u8].
    // &[u8] will be covered in a future topic.
    assert_eq!(reverse_complement("AAA"), "TTT");
    assert_eq!(reverse_complement("GGG"), "CCC");
    assert_eq!(reverse_complement("ATCG"), "CGAT");
    assert_eq!(reverse_complement("ACACGT"), "ACGTGT");
}
```
