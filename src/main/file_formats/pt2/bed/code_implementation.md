# Code Implementation
This code implementation won't be about parsing an entire BED file but rather just merging overlaps. The reader in encouraged to improve on this code, based on what has been discussed throughout this chapter.

```rust
use std::collections::HashMap;

#[derive(Debug)]
struct BedError(String);

#[derive(Debug)]
struct BedRecord {
    start: usize,
    end: usize,
}

impl BedRecord {
    fn new(start: usize, end: usize) -> Self {
        if start > end {
            panic!("start {} must be larger than end {}", start, end);
        }

        Self { start, end }
    }
}
fn parse_bed(bed: &str) -> Result<HashMap<String, Vec<BedRecord>>, BedError> {
    let mut bed_records: HashMap<String, Vec<BedRecord>> = HashMap::new();

    for line in bed.lines() {
        let v: Vec<&str> = line.split('\t').take(3).collect();

        if v.len() != 3 {
            return Err(BedError(format!(
                "Invalid line `{:?}`. Must be tab separated with at least three values.",
                v
            )));
        }

        match &v[..] {
            &[chrom, start, end] => {
                let Ok(start) = start.parse::<usize>() else {
                    continue;
                };

                let Ok(end) = end.parse::<usize>() else {
                    continue;
                };

                bed_records
                    .entry(chrom.to_string())
                    .or_default()
                    .push(BedRecord::new(start, end));
            }
            _ => continue,
        }
    }

    Ok(bed_records)
}

fn merge_records(mut records: Vec<BedRecord>) -> Vec<BedRecord> {
    records.sort_by_key(|c| c.start);

    if records.len() <= 1 {
        return records;
    }

    // Guaranteed to have at least two records.
    let mut iter = records.into_iter();
    let mut current = iter.next().expect("must exist.");

    let mut merged = vec![];

    for c in iter {
        // We have an overlap, just keep extending the max end.
        if c.start < current.end {
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

fn merge(bed_records: HashMap<String, Vec<BedRecord>>) -> Result<(), BedError> {
    bed_records.into_iter().for_each(|(chr, records)| {
        for merged_record in merge_records(records) {
            println!("{}\t{}\t{}", &chr, merged_record.start, merged_record.end);
        }
    });
    Ok(())
}

fn mock_bed() -> String {
    let bed = [
        // should yield 10->150
        "chr1\t10\t100",
        "chr1\t50\t150",
        "chr1\t20\t60",
        // should yield 25->50 and 50->100.
        "chr2\t25\t50",
        "chr2\t50\t100",
        // should yield 100->500.
        "chr3\t100\t500",
        // should yield 5->300.
        "chr4\t20\t50",
        "chr4\t5\t300",
        "chr4\t70\t150",
    ]
    .join("\n");

    bed
}
fn main() -> Result<(), BedError> {
    let bed = mock_bed();

    let bed_records = parse_bed(&bed)?;
    merge(bed_records)?;

    Ok(())
}
```

> [!NOTE]
> In this code, we don't merge *adjacent* regions. For example `(25, 50)` and `(50, 100)` are adjacent but not overlapping because the second region starts exactly after the first region ends.
