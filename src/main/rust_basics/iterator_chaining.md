# Iterator Chaining
One of my favorite Rust features is its powerful [iterator](https://doc.rust-lang.org/std/iter/trait.Iterator.html) chaining. One basic example is using `map` to apply a custom function to each element in the iterator.

```rust
fn main() {
    let x: Vec<usize> = vec![1, 2, 3, 4, 5];

    let x_mapped: Vec<usize> = x.iter().map(|v| *v * 2).collect();

    assert_eq!(x_mapped, vec![2, 4, 6, 8, 10]);
}
```

A slightly more advanced example is trying to parse a `Vec` of strings, only keeping the values we successfully parsed. In the example below, we use `filter_map` to both filter and map values at the same time.


```rust
fn main() {
    let x: Vec<&str> = vec!["3", "hello", "8", "10", "world"];

    let x_parsed: Vec<usize> = x.iter().filter_map(|v| v.parse::<usize>().ok()).collect();

    println!("{:?}", x_parsed);
}
```

`filter_map` accepts an `Option<T>` to filter on. In our case, `parse` returns a `Result<T, Err>` so we use `.ok()` to convert `Result<T, Err>` to `Option<T>`.

We can also use scopes to create extremely versatile chaining. In the last example, we'll loop over a `Vec` that contains some mock fastq reads, gather some stats, and collect into a new `Vec`. Even though this is a silly example, it shows how we can use iterator chaining to provide structure to unstructured data.

```rust
#[allow(unused)]
#[derive(Debug, PartialEq)]
struct FastqRead<'a> {
    name: &'a str,
    seq: &'a [u8],
    qual: &'a [u8],
    length: usize,
    mean_error: f64,
}

fn collect_fastq_reads<'a>(fastq_reads: &'a [(&str, &[u8], &[u8])]) -> Vec<FastqRead<'a>> {
    let fastq_stats: Vec<FastqRead<'a>> = fastq_reads
        .iter()
        .map(|(name, seq, qual)| {
            // Calculate mean error rate.
            let error_sum: f64 = qual
                .iter()
                .map(|q| 10_f64.powf(-1.0 * ((q - 33) as f64) / 10.0))
                .sum();

            let fastq_read = FastqRead {
                name: name,
                seq: seq,
                qual: qual,
                length: seq.len(),
                mean_error: error_sum / qual.len() as f64,
            };

            return fastq_read;
        })
        .collect();

    fastq_stats
}

fn main() {
    let fastq_reads: Vec<(&str, &[u8], &[u8])> = vec![
        ("read_1", b"ATCG", b"????"),
        ("read_2", b"AAAAAAA", b"???????"),
    ];

    let fastq_stats = collect_fastq_reads(&fastq_reads);

    assert_eq!(
        fastq_stats,
        vec![
            FastqRead {
                name: "read_1",
                seq: b"ATCG",
                qual: b"????",
                length: 4,
                mean_error: 0.001
            },
            FastqRead {
                name: "read_2",
                seq: b"AAAAAAA",
                qual: b"???????",
                length: 7,
                mean_error: 0.001
            }
        ]
    );
}
```
