# Structs
Implementing structs in Rust is a bit different from languages such as Python. In Python, we have the excellent [Pydantic](https://docs.pydantic.dev/latest/) module for data validation and other awesome features. In Rust, we can use something like the [Validify](https://docs.rs/validify/latest/validify/) crate, however in this book we won't bother much with validation.

Pretend we have a fastq parser for filtering and trimming reads. However, we want to change the filtering and trimming parameters based on sequencing platform. Maybe we want different behavior depending on if our data originated from PacBio or Oxford Nanopore. An example of this would be to implement a default function based on a provided platform:

```rust
enum Platform {
    PacBio,
    Nanopore,
}

#[allow(unused)]
#[derive(Debug)]
struct Parameters {
    min_len: usize,
    max_len: usize,
    min_phred: usize,
}

impl Parameters {
    fn default(platform: Platform) -> Self {
        match platform {
            Platform::PacBio => Self {
                min_len: 100,
                max_len: 1000,
                min_phred: 20,
            },
            Platform::Nanopore => Self {
                min_len: 200,
                max_len: 900,
                min_phred: 15,
            },
        }
    }
}

fn main() {
    let pacbio_parameters = Parameters::default(Platform::PacBio);
    println!("PacBio: {:?}", pacbio_parameters);

    let nanopore_parameters = Parameters::default(Platform::Nanopore);
    println!("Nanopore: {:?}", nanopore_parameters);
}
```
This works, but might not be very idiomatic. Another way is to leverage Rust's type traits by implementing *from*. By specifying our parameter variable as type *Parameters*, we can call .into() directly.

```rust
# enum Platform {
#     PacBio,
#     Nanopore,
# }
#
# #[allow(unused)]
# #[derive(Debug)]
# struct Parameters {
#     min_len: usize,
#     max_len: usize,
#     min_phred: usize,
# }
// [...]

impl From<Platform> for Parameters{
    fn from(platform: Platform) -> Self{
        match platform{
            Platform::PacBio => Self{
                min_len: 100,
                max_len: 1000,
                min_phred: 20,
            },
            Platform::Nanopore => Self{
                min_len: 200,
                max_len: 900,
                min_phred: 15
            },
        }
    }
}

fn main(){
    let pacbio_parameters: Parameters = Platform::PacBio.into();
    println!("PacBio: {:?}", pacbio_parameters);

    let nanopore_parameters: Parameters = Platform::Nanopore.into();
    println!("Nanopore: {:?}", nanopore_parameters);
}
```
Again, note that these are just examples that might not be real-world applicable. However, the point here is that structuring the code in certain ways will be of help in the long run.
