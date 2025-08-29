# In Silico PCR
The first amplicon based analysis we'll cover is in silico PCR. The goal is to find certain genomic regions, not by searching for the sequences themselves, but rather through identifying flanking primer regions.

Consider a case where we are looking for a genomic region which can be quite diverse across taxa, but has very conserved flanking sites. This is the case for e.g., the 16S rRNA region in bacteria. Alignment approaches might not be suitable if we are unsure of, or expect a large diversity in the target region.

The following example tries to illustrate this, where the conserved flanking regions are `ATATAT` and `GTGTGT`.

```
...ATATAT ACGTGACGTGACGGAGAT GTGTGT...  # taxa_1
...ATATAT ACCTAGCGTAGTCGAGTG GTGTGT...  # taxa_2
...ATATAT ACCTAGCGTACGAGTG GTGTGT...    # taxa_3
```

Instead of looking directly at the target region we can search for flanking sites, extract the target region and use some kind of length cutoff to prevent outliers. In the example above, using flanking sites `ATATAT` and `GTGTGT` with a length threshold of `>= 15` and `<= 20` would capture all three target regions with some margin.

```rust
fn primer_search(primer: &[u8], seq: &[u8]) -> Option<usize> {
    for (i, window) in seq.windows(primer.len()).enumerate() {
        if window == primer {
            return Some(i);
        }
    }
    return None;
}

fn is_pcr<'a>(start: &'a [u8], end: &'a [u8], seq: &'a [u8]) -> Option<&'a [u8]> {
    let start_index = primer_search(start, seq);

    let end_index = primer_search(end, seq);

    match (start_index, end_index) {
        (Some(s), Some(e)) => {
            let actual_start = s + start.len();

            if actual_start < e {
                return Some(&seq[actual_start..e]);
            }

            return None;
        }
        _ => return None,
    }
}

fn main() {
    assert_eq!(is_pcr(b"A", b"G", b""), None);
    assert_eq!(is_pcr(b"AT", b"CG", b"ATCG"), None);
    assert_eq!(is_pcr(b"AT", b"CG", b"ATTCG"), Some(&b"T"[..]));
    assert_eq!(
        is_pcr(b"AAA", b"TTT", b"CGCGCGAAACCCCCCTTTCGCGCG"),
        Some(&b"CCCCCC"[..])
    );
}
```

In the code example above, our naive implementation just uses an exact string search for our flanking regions. We then check if the start primer is located prior to the end primer. If it is, we extract the interjacent sequence. Some good improvements to the code would be:
- Enable multiple matches to the start and end primer for finding multiple interjacent regions.
- Add a `min_len` and `max_len` criteria to filter out potential outliers.
- Check both forward and reverse complements.
- Replace `.windows()` with something faster. For exact matches, [memchr](https://docs.rs/memchr/latest/memchr/) is a good alternative.
- Add fuzzy search to allow for a few mismatches between the primers and the sequence. A good alternative here is [myers](https://docs.rs/bio/latest/bio/pattern_matching/myers/index.html) from the [bio](https://docs.rs/bio/latest/bio/) crate since it supports ambiguous nucleotides.
