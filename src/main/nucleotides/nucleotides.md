# Nucleotides
When dealing with DNA sequences, nucleotides are everything. Fundamentally, we are usually dealing with four canonical bases:
- `A` - Adenine.
- `C` - Cytosine.
- `G` - Guanine.
- `T` - Thymine.

However, there are some important concepts to be aware of.


## Soft masking
A lower case nucleotide indicates *soft masking* and is used to indicate a soft clipped alignment or a region which is low complexity or repetitive.

In the example below, the last part of the upper sequence is soft masked to indicate that this region is not part of the actual alignment. This is commonly encountered in local read aligners such as [Minimap2](https://github.com/lh3/minimap2).
<pre>
  AAAGTGCCAGTGACGCTTagtcgatcgatg
  ||||||||||||||||||
  AAAGTGCCAGTGACGCTT
</pre>

## Hard masking
A capital `N` indicates *hard masking*. This means there is probably a base here, but we don't know exactly what it is. This is usually for indicating uncertainty or gaps in a sequence.

## Ambiguous nucleotides
In addition to our four canonical nucleotides, there are also ambiguous nucleotides. Ambiguous in this case, means uncertainty or ambiguity:
- `R` = `A` | `G`
- `Y` = `C` | `T`
- `K` = `G` | `T`
- `M` = `A` | `C`
- `S` = `G` | `C`
- `W` = `A` | `T`
- `H` = `A` | `C` | `T`
- `V` = `A` | `C` | `G`
- `B` = `C` | `G` | `T`
- `D` = `A` | `G` | `T`
- `N` = `A` | `C` | `G` | `T`

We won't deal much with ambiguous nucleotides in this book. However, make sure not to confuse these nucleotides with one-letter amino acid abbreviations, which have overlapping naming conventions.

## Programmatic representations
There are many different ways to represent nucleotide sequences in a programming language. In this book, we'll mainly deal with these different representations:
- `String` and `&str`.
- `&[u8]` (byte slice).
- Binary.

```rust
/// Assume we want to represent the sequence ATCG.
fn main() {
  let nt_seq_string: String = "ATCG".to_string();
  let nt_seq_str: &str = "ATCG";
  let nt_seq_byte_slice: &[u8] = b"ATCG";
  let nt_seq_binary: u8 = 0b00110110; // Binary, where A = 00, T = 11, C = 01 and G = 10.

  println!("{}", nt_seq_string);
  println!("{}", nt_seq_str);
  println!("{:?}", nt_seq_byte_slice);
  println!("{:08b}", nt_seq_binary);
}
```
