# Using Appropriate Data Structures
It is easy to default to using e.g., a `HashMap` or other variable sized data structures for convenience. This is usually fine until it isn't. Below we'll go through some data structures and why they might not be an optimal choice.

## HashMap
A `HashMap` is a very convenient way of storing data as key-value pairs. For example, if we want to count nucleotides in a string, we can use the nucleotide as the key and the count as the value. For the sequence `ACTTCC` it would look something like (pretty printed): 

```json
{
	"A": 1,
	"C": 3,
	"G": 0,
	"T": 2
}
```

Performance wise, a `HashMap` might provide some overhead due to:
- The need of hashing the key.
- Potential memory re-allocation when it reaches its maximum capacity.

These are not really of concern in the example above because the sequence is short and we are only concerned with four unique keys. In other instances however, it might be more relevant.

We can improve our `HashMap` by:
- Choosing a fast hash function such as [FxHasher](https://docs.rs/rustc-hash/latest/rustc_hash/struct.FxHasher.html).
- Initializing our `HashMap` with a specified capacity. In our case, we could use `HashMap::with_capacity(4)` to ensure it can accommodate all our keys without having to re-allocate.

With that said, there are cases when a `HashMap` is probably justified, such as in the chapter about [building a reverse index](../kmers/building_a_reverse_index.md).

## Vec
`Vec` is another familiar and convenient data structure. Similar to a `HashMap`, a `Vec` is also dynamically sized and requires re-allocation when its capacity is reached. Consider the case where we'd like to kmerize the sequence `ATCATC` with `k=3` and store the kmers in a `Vec`. Since we know that the number of kmers we can generate is `6 - 3 + 1 = 4`, we can initialize a `Vec` with a capacity of `4` to avoid re-allocations when adding kmers.

## Fixed Size Array
In the case of counting nucleotides, using a fixed size array is much better than both a `HashMap` and a `Vec`. This data structure is of type `[<dtype>; <length>]` where `<length>` must be known at compile time.

The trick here is to utilize the nucleotide encoding, first encountered in the [encoding](../nucleotides/nucleotide_encoding.md) chapter. If we assume that our sequence only consists of `{"A", "C", "G", "T"}` we can use a fixed size array of length `4`. The encoding maps each nucleotide `A, C, G, T` to `0, 1, 2, 3` which exactly corresponds to the indices we have in our array. Conceptually, we'd:
- Initialize a fixed size array of length `4` with all values set to `0`.
- Loop over each nucleotide and encode.
- Increment that index in the array.

```rust
fn main(){
	let seq = b"AATCG";
	
	let mut counts: [usize; 4] = [0; 4];
	
	for nt in seq{
		let encoding = match nt{
			b'A' => 0,
			b'C' => 1,
			b'G' => 2,
			b'T' => 3,
			_ => continue
		};
		
		counts[encoding] += 1;
	}
	
	assert_eq!(counts, [2, 1, 1, 1]);
}
```

It is not elegant to just skip unexpected characters. In practise, we could use a lookup table to map:
- canonical bases `{A, C, G, T}` (and possibly `{a, c, g, t}`) to `{0, 1, 2, 3}`.
- ambiguous bases `N` to `4`.
- everything else to `5`.

This, however, requires us to use an array of length `6`.
