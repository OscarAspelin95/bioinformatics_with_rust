# Kmers
The concept of kmers is widely used in bioinformatics and is applied is concepts such as alignment and genome assembly. Here, we'll just go through the basics.

Basically, kmers are just subsequences of a specific length. For example, in the following sequence we generate all consecutive kmers of length 3:

<pre>
5' ATCGATCGATCG 3'

   ATC ATC ATC
    TCG TCG TCG
     CGA CGA
      GAT GAT
</pre>

Note that our sequence length is 12 and the kmer length is 3. How many consecutive kmers can we generate? The answer is `len(sequence) - kmer_size + 1`, which in our case would `12 - 3 + 1 = 10`. But why this exact formula?

If we had `kmer_size = 1`, the number of kmers would be equal to the sequence length. We just slide along the sequence with a window size of 1. We are losing out on *zero* nucleotides.

If we had `kmer_size = 2`, we use a sliding window of length 2. However, we cannot use the last nucleotide in the sequence, because we need two nucleotides for our sliding window. We are losing out on *one* nucleotide.

We see a pattern here, which is that the number of kmers we can generate is the length of our sequence minus how many nucleotides in the end we are missing out on (which is one less than our kmer size).

`num_kmers = len(sequence) - (kmer_size - 1) = len(sequence) + kmer_size - 1.`
