# Enums
Rust enums are awesome and also extremely useful, especially in match statements. Assume we have implemented three different alignment functions: local, semi-global and global. We can use an enum as input to decide what alignment function to run for a given query and subject:

```rust
enum AlignmentType {
    Local,
    SemiGlobal,
    Global,
}

#[allow(unused)]
fn local_alignment(query: &str, subject: &str){
    println!("Running local alignment...");
}

#[allow(unused)]
fn semi_global_alignment(query: &str, subject: &str){
    println!("Running semi-global alignment...");
}

#[allow(unused)]
fn global_alignment(query: &str, subject: &str){
    println!("Running global alignment...");
}


fn align(query: &str, subject: &str, alignment_type: AlignmentType) {
    match alignment_type {
        AlignmentType::Local => local_alignment(query, subject),
        AlignmentType::SemiGlobal => semi_global_alignment(query, subject),
        AlignmentType::Global => global_alignment(query, subject),
    }
}

fn main(){
    align("ATCG", "ATCG", AlignmentType::Local);
    align("ATCG", "ATCG", AlignmentType::SemiGlobal);
    align("ATCG", "ATCG", AlignmentType::Global);
}
```

Another use case of enums could be if we have an alignment between two sequences for which we want to calculate an alignment score. We could create an alignment type enum that is associated with increasing or decreasing an alignment score.

```rust
enum AlignmentCost {
    Match(usize),
    Mismatch(usize),
    DeletionQuery(usize),
    DeletionSubject(usize),
}

fn update_score(score: &mut i32, alignment_cost: AlignmentCost) {
    match alignment_cost {
        AlignmentCost::Match(c) => {
            *score += c as i32;
        }
        AlignmentCost::Mismatch(c) => {
            *score -= c as i32;
        }
        AlignmentCost::DeletionQuery(c) => {
            *score -= c as i32;
        }
        AlignmentCost::DeletionSubject(c) => {
            *score -= c as i32;
        }
    };
}

fn main() {
    let mut score: i32 = 0;
    println!("Initial score: {score}");

    // Match will increase the score.
    update_score(&mut score, AlignmentCost::Match(4));
    println!("Score after match: {score}");

    // Mismatch will decrease the score.
    update_score(&mut score, AlignmentCost::Mismatch(1));
    println!("Score after mismatch: {score}");

    // Query deletion will decrease the score.
    update_score(&mut score, AlignmentCost::DeletionQuery(1));
    println!("Score after query deletion: {score}");

    // Subject deletion will decrease the score.
    update_score(&mut score, AlignmentCost::DeletionSubject(1));
    println!("Score after subject deletion: {score}");
}
```
This is a pretty silly example, but showcases how enums are very convenient for handling and taking action based on a specific set of cases.
