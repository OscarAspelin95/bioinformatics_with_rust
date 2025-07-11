# Nucleotides
When dealing with DNA sequences, nucleotides are everything. Fundamentally, we are usually dealing with four canonical bases:
- A - Adenosine.
- C - Cytosine.
- G - Guanine.
- T - Thymine.

However, there are some important concepts to be aware of:


- **Soft masking**: A lower case nucleotide indicates *soft masking* and is used to indicate a soft clipped alignment or a region which is low complexity or repetitive.

    Example of soft masked, highly repetitive sequence:
    * ATCGatatatatatatatatatat[...]AGCGAGT

    Example of soft clipped alignment:
    <pre>
    * AAAGTGCCAGTGACGCTTagtcgatcgatg
      ||||||||||||||||||
      AAAGTGCCAGTGACGCTT
    <pre>

- **Hard masking**: A capital "N" indicates *hard masking*. This means there is probably a base here, but we don't know exactly what it is. This is usually for indicating uncertainty or gaps in a sequence.

## Ambiguous nucleotides
In addition to our four canonical nucleotides, there are also ambiguous nucleotides. Ambiguous in this case, means uncertainty or ambiguity:
- R = A | G
- Y = C | T
- K = G | T
- M = A | C
- S = G | C
- W = A | T
- H = A | C | T
- V = A | C | G
- B = C | G | T
- D = A | G | T
- N = A | C | G | T

We won't deal much with ambiguous nucleotides in this book. However, make sure not to confuse these nucleotides with one-letter amino acid abbreviations, which have overlapping naming conventions.
