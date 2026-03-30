# Code Implementation
This code implementation won't be about parsing an entire BED file but rather just sorting and merging overlaps. The reader in encouraged to improve on this code, based on what has been discussed throughout this chapter.

```rust
#[derive(Debug)]
struct Coordinate {
    start: usize,
    end: usize,
}

impl Coordinate {
    fn new(start: usize, end: usize) -> Self {
        if start > end {
            panic!("start {} must be larger than end {}", start, end);
        }

        Self { start, end }
    }
}

fn mock_coordinates() -> Vec<Coordinate> {
    let c1 = Coordinate::new(1, 10);
    let c2 = Coordinate::new(4, 7);
    let c3 = Coordinate::new(8, 15);
    let c4 = Coordinate::new(16, 30);
    let c5 = Coordinate::new(18, 56);

    let mut coordinates = vec![c1, c2, c3, c4, c5];
    coordinates.reverse();

    coordinates
}

fn merge_coordinates(mut coordinates: Vec<Coordinate>) -> Vec<Coordinate> {
    coordinates.sort_by_key(|c| c.start);

    if coordinates.len() <= 1 {
        return coordinates;
    }

    // Guaranteed to have at least two coordinates.
    let mut iter = coordinates.into_iter();
    let mut current = iter.next().expect("must exist.");

    let mut merged = vec![];

    for c in iter {
        // We have an overlap, just keep extending the max end.
        if c.start <= current.end {
            current.end = current.end.max(c.end);
        }
        // We have entered a new hit region
        else {
            merged.push(current);
            current = c;
        }
    }

    merged.push(current);
    merged
}

fn main() {
    let coordinates = mock_coordinates();
    let merged = merge_coordinates(coordinates);

    println!("{:?}", merged);
}
```
