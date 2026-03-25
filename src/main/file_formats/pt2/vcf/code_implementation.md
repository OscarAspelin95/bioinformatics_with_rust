# Code Implementation
To get a feel for the VCF format, we'll implement a quick and dirty parser that should never be used for anything other than educational purposes. We try to parse each variant row and extract a pre-determined number of INFO, FORMAT and SAMPLE tags. In practice, we'd use a robust alternative such as [noodles](https://docs.rs/noodles/latest/noodles/). Click the <q>show hidden lines</q> button to view the entire code snippet.

```rust
# #[derive(Debug)]
# struct VcfError(String);
# 
	# #[derive(Debug)]
# enum Info {
#     DP(usize),
#     AF(f64),
# }
# 
	# #[derive(Debug)]
# enum FormatSample {
#     GT(String),
#     GQ(usize),
#     DP(usize),
# }
# 
	# #[derive(Debug)]
# struct VcfRecord {
#     chrom: String,
#     pos: usize,
#     id: String,
#     _ref: String,
#     alt: String,
#     qual: usize,
#     filter: String,
#     info: Vec<Info>, // HashMap might be more suitable.
#     format_sample: Vec<FormatSample>, // HashMap might be more suitable.
# }
# 
# fn parse_info(info: &str) -> Result<Vec<Info>, VcfError> {
#     let mut info_vec: Vec<Info> = vec![];
# 
#     for info_value in info.split(";") {
	#         let [identifier, value] = &info_value.split("=").collect::<Vec<&str>>()[..] else {
		#             return Err(VcfError("".into()));
		#         };
	# 
	#         match *identifier {
		#             "DP" => {
			#                 info_vec.push(Info::DP(value.parse::<usize>().expect(&format!(
				#                     "Failed to parse {} as usize ({})",
				#                     value, identifier
				#                 ))));
			#             }
		#             "AF" => {
			#                 info_vec.push(Info::AF(value.parse::<f64>().expect(&format!(
				#                     "Failed to parse {} as f64 ({})",
				#                     value, identifier
				#                 ))));
			#             }
		#             _ => continue,
		#         }
		#     }
		# 
		#     Ok(info_vec)
		# }

# fn parse_format_sample(format: &str, sample: &str) -> Result<Vec<FormatSample>, VcfError> {
#     let mut format_sample: Vec<FormatSample> = vec![];
# 
#     for (f, s) in format.split(":").zip(sample.split(":")) {
#         match f {
#             "GT" => format_sample.push(FormatSample::GT(s.to_string())),
#             "GQ" => format_sample.push(FormatSample::GQ(
#                 s.parse::<usize>()
	#                     .expect(&format!("Failed to parse {} as usize", s)),
#             )),
#             "DP" => format_sample.push(FormatSample::DP(
#                 s.parse::<usize>()
	#                     .expect(&format!("Failed to parse {} as usize", s)),
#             )),
#             _ => continue,
#         }
#     }
# 
#     Ok(format_sample)
# }
// [...]

impl TryFrom<String> for VcfRecord {
    type Error = VcfError;

    fn try_from(line: String) -> Result<Self, Self::Error> {
        let v: Vec<&str> = line.split('\t').collect();

        if v.len() < 10 {
            println!("{}", v.len());
            return Err(VcfError(format!("Not enough values: `{}`", line)));
        }

        let [
            chrom,
            pos,
            id,
            _ref,
            alt,
            qual,
            filter,
            info,
            format,
            sample,
            ..,
        ] = &v[..]
        else {
            return Err(VcfError(format!(
                "Failed to extract information from: `{}`",
                line
            )));
        };

        let record = Self {
            chrom: chrom.to_string(),
            pos: pos
                .parse::<usize>()
                .expect(&format!("Failed to parse {} as usize", pos)),
            id: id.to_string(),
            _ref: _ref.to_string(),
            alt: alt.to_string(),
            qual: qual
                .parse::<usize>()
                .expect(&format!("Failed to parse {} as usize", qual)),
            filter: filter.to_string(),
            info: parse_info(info)?,
            format_sample: parse_format_sample(format, sample)?,
        };

        Ok(record)
    }
}

fn main() -> Result<(), VcfError> {
    let vcf = "20\t14370\t.\tG\tA\t29\tPASS\tDP=14;AF=0.5\tGT:GQ:DP\t0|0:48:65";

    for line in vcf.lines() {
        let vcf_record = VcfRecord::try_from(line.to_string())?;
        println!("{:?}", vcf_record);
    }

    Ok(())
}

```
