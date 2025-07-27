# Enums
Rust enums are awesome and also extremely useful, especially in match statements. Assume we have implemented three different alignment functions: local, semi-global and global. We can use an enum as input to decide what alignment function to run for a given query and subject:

```rust

enum AlignmentType{
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


fn align(query: &str, subject: &str, alignment_type: AlignmentType){
    match alignment_type{
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
