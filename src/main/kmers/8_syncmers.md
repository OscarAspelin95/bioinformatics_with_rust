# Syncmers
Minimizers are widely used in bioinformatics by softwares such as [Minimap2](https://github.com/lh3/minimap2) and [Kraken2](https://github.com/DerrickWood/kraken2). Recently, the concept of [syncmers](https://pmc.ncbi.nlm.nih.gov/articles/PMC7869670/) was proposed as an alternative to minimizers. To quote the paper:<br>

<q><em>Syncmers are defined here as a family of alternative methods which select k-mers by inspecting the position of the smallest-valued substring of length s < k within the k-mer.</em></q>

In this section, we'll go through *closed syncmers* and also write some code to showcase an example of how to identify them.

## Closed syncmers
Again, citing the paper:<br>

<q><em>For example, a closed syncmer selected if its smallest s-mer is at the start of end of the k-mer.</em></q>

## Implementation

```rust
fn main(){
    todo!();
}
```
