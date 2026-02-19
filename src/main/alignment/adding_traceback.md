# Adding Traceback
## Introduction
We have successfully created a basic edit distance aligner! However, we don't just want to return a simple usize of the distance between two strings. We also want to *visualize* the alignment.

To make this work, we need to implement a traceback that enables us to generate the optimal alignment after we are done filling out the array. Let's look at the final array after aligning `ATCG` to `ATCG`:

<pre>
            A   T   C   G (query)

        0   1   2   3   4

    A   1   0   1   2   3

    T   2   1   0   1   2

    C   3   2   1   0   1

    G   4   3   2   1   0 last cell

(subject)
</pre>

In this example, we clearly see that the traceback should be just traversing diagonally. But how do we implement this programmatically?

We know the origin for each cell in the array, because we have defined it as `array[i][j] = min(diagonal, left, up)`. We can store the origin of each cell in a `HashMap` and start the traceback from the last cell until we reach the start. This is rather inefficient, but it'll work for now.

For simplicity, we'll save each cells origin along with the alignment type.

## Implementation
```rust,editable
use std::collections::HashMap;

#[derive(Clone, Copy)]
enum AlignmentType {
    Match,
    Mismatch,
    DeletionQuery,
    DeletionSubject,
}

fn print_array(array: &Vec<Vec<usize>>) {
    for v in array {
        let values: String = v
            .iter()
            .map(|v| v.to_string())
            .collect::<Vec<_>>()
            .join("\t");
        println!("{values}");
    }
    println!("\n");
}

/// We could modify these if we want.
fn get_alignment_cost(aln: AlignmentType) -> usize {
    match aln {
        AlignmentType::Match => 0,
        AlignmentType::Mismatch => 1,
        AlignmentType::DeletionQuery => 1,
        AlignmentType::DeletionSubject => 1,
    }
}

fn levenshtein_distance(
    s1: &str,
    s2: &str,
) -> (
    Vec<Vec<usize>>,
    HashMap<(usize, usize), ((usize, usize), AlignmentType)>,
) {
    // We take the number of rows from the subject.
    let m = s2.len();

    // We take the number of columns from the query.
    let n = s1.len();

    // Store array as a vector of vectors.
    let mut array: Vec<Vec<usize>> = Vec::new();

    // Initialize array.
    for _ in 0..m + 1 {
        array.push(vec![0; n + 1]);
    }

    assert!(array[0].len() == s1.len() + 1);
    assert!(array.len() == s2.len() + 1);

    // We store the origin of each element in the array.
    let mut traceback: HashMap<(usize, usize), ((usize, usize), AlignmentType)> = HashMap::new();

    // We move in the i direction (down), subject is consumed and query is deleted.
    for i in 1..m + 1 {
        array[i][0] = i * get_alignment_cost(AlignmentType::DeletionQuery);
        // Remember to add trace.
        traceback.insert((i, 0), ((i - 1, 0), AlignmentType::DeletionQuery));
    }
    // We move in the j direction (right), query is consumed and subject is deleted.
    for j in 1..n + 1 {
        array[0][j] = j * get_alignment_cost(AlignmentType::DeletionSubject);
        // Remember to add trace.
        traceback.insert((0, j), ((0, j - 1), AlignmentType::DeletionSubject));
    }

    for i in 1..m + 1 {
        for j in 1..n + 1 {
            // For a diagonal move, we need to check if we have a match or mismatch.
            let match_or_mismatch = match s1.chars().nth(j - 1) == s2.chars().nth(i - 1) {
                true => (
                    (i - 1, j - 1),
                    array[i - 1][j - 1] + get_alignment_cost(AlignmentType::Match),
                    AlignmentType::Match,
                ),
                false => (
                    (i - 1, j - 1),
                    array[i - 1][j - 1] + get_alignment_cost(AlignmentType::Mismatch),
                    AlignmentType::Mismatch,
                ),
            };

            // We have moved in the j direction so query is consumed and subject is deleted
            let deletion_subject = (
                (i, j - 1),
                array[i][j - 1] + get_alignment_cost(AlignmentType::DeletionSubject),
                AlignmentType::DeletionSubject,
            );

            // We have moved in the j direction so subject is consumed and query is deleted
            let deletion_query = (
                (i - 1, j),
                array[i - 1][j] + get_alignment_cost(AlignmentType::DeletionQuery),
                AlignmentType::DeletionQuery,
            );

            // EDIT ME! Try switching the order of the
            // elements and see if this changes the traceback.
            let previous_values: Vec<((usize, usize), usize, AlignmentType)> =
                vec![match_or_mismatch, deletion_query, deletion_subject];


            let (previous_index, previous_value, alignment_type) =
                previous_values.iter().min_by_key(|x| x.1).unwrap();

            // Add trace for current element.
            traceback.insert((i, j), (*previous_index, *alignment_type));

            // Update array for current value.
            array[i][j] = *previous_value;
        }
    }

    return (array, traceback);
}

fn get_traceback(
    traceback: HashMap<(usize, usize), ((usize, usize), AlignmentType)>,
    s1: &str,
    s2: &str,
) {
    let mut m = s2.len();
    let mut n = s1.len();

    // Aligned part of s1 and s2 (including deletions).
    let mut s1_aln: Vec<char> = Vec::new();
    let mut s2_aln: Vec<char> = Vec::new();

    // We'll use "|" for match, "*" for mismatch and " " for deletion.
    let mut matches_aln: Vec<char> = Vec::new();

    loop {
        if (m, n) == (0, 0) {
            break;
        }

        let ((i, j), aln_type) = traceback.get(&(m, n)).unwrap();

        match aln_type {
            AlignmentType::Match => {
                let s1_char = s1.chars().nth(*j).unwrap();
                let s2_char = s2.chars().nth(*i).unwrap();
                s1_aln.push(s1_char);
                s2_aln.push(s2_char);
                matches_aln.push('|');
            }
            AlignmentType::Mismatch => {
                let s1_char = s1.chars().nth(*j).unwrap();
                let s2_char = s2.chars().nth(*i).unwrap();
                s1_aln.push(s1_char);
                s2_aln.push(s2_char);
                matches_aln.push('*');
            }
            AlignmentType::DeletionQuery => {
                s1_aln.push('-');
                s2_aln.push(s2.chars().nth(*i).unwrap());
                matches_aln.push(' ');
            }
            AlignmentType::DeletionSubject => {
                s1_aln.push(s1.chars().nth(*j).unwrap());
                s2_aln.push('-');
                matches_aln.push(' ');
            }
        }
        m = *i;
        n = *j;
    }

    let s1_aln_fwd: String = s1_aln.iter().rev().collect();
    let s2_aln_fwd: String = s2_aln.iter().rev().collect();
    let matches_aln_fwd: String = matches_aln.iter().rev().collect();

    println!("{}", s1_aln_fwd);
    println!("{}", matches_aln_fwd);
    println!("{}\n", s2_aln_fwd);
}

fn align(s1: &str, s2: &str) {
    let (_, traceback) = levenshtein_distance(s1, s2);

    get_traceback(traceback, s1, s2);
}

fn main() {
    align("ATCG", "ATCG");
    align("A", "T");
    align("ATCG", "ATCGATCG");
    align("TTTTTTTTTTTTTTTTA", "ATTTTTTTTTTTTT");
}
```
This is awesome! We have created a basic aligner that uses the Levenshtein distance and supports non-equal length strings. Some good exercises (left up to the reader) would be:
- Calculating percent identity and other relevant alignment metrics.
- Thinking about how the code can be optimized (trust me, it is not).
    - For example, do we really need to keep track of all rows and columns at the same time?
    - How can we optimize the traceback strategy?
- Writing a bunch of tests to make sure our code works (and fix it if it doesn't).
