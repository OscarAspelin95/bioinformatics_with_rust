# Code Implementation
For this code implementation, we'll just create a basic SAM parser from some mock data to get a feel for the format. In practice, we probably want to use a crate such as [noodles](https://docs.rs/noodles/latest/noodles/) or [rust-htslib](https://docs.rs/rust-htslib/latest/rust_htslib/). Click the <q>show hidden lines</q> button to view the entire code snippet.

```rust
# #[derive(Debug)]
# enum CigarOperation {
#     AlignmentMatch(usize),
#     ReferenceInsertion(usize),
#     ReferenceDeletion(usize),
#     ReferenceRegionSkipped(usize),
#     SoftClip(usize),
#     HardClip(usize),
#     Padding(usize),
#     SequenceMatch(usize),
#     SequenceMismatch(usize),
# }
# 
	# #[derive(Debug)]
# enum SamError {
#     OperationError(String),
# }
# 
# impl TryFrom<&str> for CigarOperation {
#     type Error = SamError;
# 
#     fn try_from(value: &str) -> Result<Self, Self::Error> {
#         let (num_operators, op) = value.split_at(value.len() - 1);
# 
#         let num = num_operators
#             .parse::<usize>()
#             .expect(&format!("failed to parse as int: {}", num_operators));
# 
#         let operator = match op {
#             "M" => Self::AlignmentMatch(num),
#             "I" => Self::ReferenceInsertion(num),
#             "D" => Self::ReferenceDeletion(num),
#             "N" => Self::ReferenceRegionSkipped(num),
#             "S" => Self::SoftClip(num),
#             "H" => Self::HardClip(num),
#             "P" => Self::Padding(num),
#             "=" => Self::SequenceMatch(num),
#             "X" => Self::SequenceMismatch(num),
#             _ => {
#                 return Err(SamError::OperationError(format!(
	#                     "Invalid operator: {}",
	#                     op
	#                 )));
#             }
#         };
# 
#         Ok(operator)
#     }
# }
# 
# #[derive(Debug)]
# struct SamRecord {
#     qname: String,
#     flag: i16,
#     tname: String,
#     mpos: i32,
#     mq: u8,
#     cigar: String,
# }
# 
# impl SamRecord {
#     fn cigar_starts(&self) -> Vec<usize> {
#         let mut starts: Vec<usize> = vec![0];
# 
#         let mut previous: Option<char> = None;
# 
#         for (i, c) in self.cigar.chars().enumerate() {
#             if let Some(p) = previous
#                 && p.is_ascii_digit()
#                 && !c.is_ascii_digit()
#             {
#                 starts.push(i + 1);
#             }
#             previous = Some(c);
#         }
# 
#         if starts.last() != Some(&self.cigar.len()) {
#             starts.push(self.cigar.len());
#         }
# 
#         starts
#     }
# 
#     pub fn parse_cigar(&self) -> Result<Vec<CigarOperation>, SamError> {
#         let mut v: Vec<CigarOperation> = vec![];
# 
#         let starts = self.cigar_starts();
#         for i in 0..starts.len() - 1 {
#             // e.g., "123D"
#             let operation = &self.cigar[starts[i]..starts[i + 1]];
# 
#             // e.g., ReferenceDeletion(123)
#             let op = CigarOperation::try_from(operation)?;
# 
#             v.push(op)
#         }
# 
#         Ok(v)
#     }
# }
# 
# fn parse_sam(sam: &str) -> Result<Vec<SamRecord>, SamError> {
#     let mut v: Vec<SamRecord> = vec![];
# 
#     for line in sam.lines() {
#         let s: Vec<&str> = line.split('\t').collect();
# 
#         let record = match &s[..] {
#             [qname, flag, tname, mpos, mq, cigar, _, _, _, _, ..] => SamRecord {
#                 qname: qname.to_string(),
#                 flag: flag
	#                     .parse::<i16>()
	#                     .expect(&format!("failed to parse flag {}", flag)),
#                 tname: tname.to_string(),
#                 mpos: mpos
	#                     .parse::<i32>()
	#                     .expect(&format!("failed to parse mpos: {mpos}")),
#                 mq: mq
	#                     .parse::<u8>()
	#                     .expect(&format!("failed to parse mq: {mq}")),
#                 cigar: cigar.to_string(),
#             },
#             _ => continue,
#         };
# 
#         record.parse_cigar()?;
#         v.push(record);
#     }
# 
#     Ok(v)
# }
// [...]

fn main() -> Result<(), SamError> {

	// Note that we use mock data here. The values don't make much sense.
    let sam = "\
read_1\t0\tchr1\t100\t60\t5M1D3M\t*\t0\t0\tACGTN\tIIIII\n\
read_2\t16\tchr1\t200\t30\t4M2I2M\t*\t0\t0\tTGCAT\tHHHHH";

    let records = parse_sam(sam)?;

    for record in records {
        println!("{:?}", record);
        println!(
            "{:?}\n",
            record.parse_cigar().expect("failed to parse CIGAR string")
        );
    }

    Ok(())
}
```
