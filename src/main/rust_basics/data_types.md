# Data Types
Rust has a lot of [data types](https://doc.rust-lang.org/book/ch03-02-data-types.html). Here is a rundown of the ones I use most often:



| Data type                        |   Rust type   |   Example                                        |
| --------                         | -------       | -------                                          |
| boolean                          | `bool`        | `let x: bool = true;`                            |
| string                           | `String`      | `let x: String = "Hello".to_string();`           |
| string slice                     | `&str`        | `let x: &str = "Hello";`                          |
| array                            | `[type; len]` | `let x: [usize; 3] = [1, 2, 3];`           |
| vec                              | `Vec<type>`   | `let x: Vec<usize> = vec![1, 2, 3];`       |
| byte slice                       |  `&[u8]`      | `let x: &[u8] = b"Hello";`                       |
| unsigned 32-bit int              |   `u32`       | `let x: u32 = 0;`                                |
| unsigned 64-bit int              |   `u64`       | `let x: u64 = 0;`                                |
| unsigned (32 or 64)[^note]-bit int      |   `usize`     | `let x: usize = 0;`                       |
| 32-bit float                     | `f32`         | `let x: f32 = 0.0`;                                |
| 64-bit float                     | `f64`         | `let x: f64 = 0.0`;                                |

[^note]: Depends on computer architecture.
