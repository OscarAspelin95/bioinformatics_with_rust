# Implementation
It is time to implement our own, basic genome size estimator. We need:
- To generate minimizers from a set of reads.
- Count the occurence of minimizers. We'll store this in a HashMap.
- Convert the HashMap counts to the kmer frequency array.
- Find the sequence error peak and remember to disregard it.
- Calculate the approximate genome size from the remaining frequencies.

The biggest question is, how do we programmatically find the error peak?

One naive approach is to empirically find a threshold that we hard code and use. In our example histogram from before, this would be to ignore all kmer counts with frequencies <= 2. This method is however not particularly robust.

Another is to identify the <q>dip</q> where the error peaks ends and the valid kmer peak starts. For example, in our histogram we saw that values went from `90 -> 40 -> 1 -> 5`. The <q>dip</q> would be the sequence `40 -> 1 -> 5` because we switch from monotonically decreasing values to monotonically increasing values. This method is better than the first, but still not very robust.

A better approach is to apply some statistics. For example Non-Linear Least Squares (NLLS). Assume that our histogram consists of two separate distributions, the error `E(x)` and the kmer `K(x)`. We can think of these distributions as each contributing a certain amount to the frequency for every point `x`. E.g., for `x = 1` we know that the error distribution dominates whilst at `x>=3` the kmer distribution dominates. We don't know what the true distributions are, so we'll have a residual value to account for this. We can define the frequency value as:

\\[
	H(x) = E(x) + K(x) + \epsilon
\\]

We can thus try to minimize this residual through:

\\[
	\min_{E\, K} \sum_{x} \left( H(x) - \left( E(x) + K(x) \right) \right)^2
\\]

This is statistically elegant but a bit more difficult than just modeling a normal distribution through disregarding the error peak (both of which are quite easily implemented with `Python` and `scikit`).

For the sake of simplicity, we can just try to identify the <q>dip</q>, followed by trying to find the peak kmer multiplicity. There won't be a code example of this, but to get some inspiration please see my example repository [gsize_rs](https://github.com/OscarAspelin95/gsize_rs).
