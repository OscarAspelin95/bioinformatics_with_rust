# Array
Arrays in Rust are fixed size that need to be known at compile time. In bioinformatic applications, we can use an array as a lookup table for nucleotide encoding, which we'll see in later chapters.

If we declare the array as mutable, we can change its values but not its size.

```rust
fn main(){
    let mut arr: [usize; 5] = [1, 2, 3, 4, 5];

    for i in (0..arr.len()){
        arr[i] = arr[i] * 2;
    }

    assert_eq!(arr, [2, 4, 6, 8, 10]);
}
```
