# Calculating Average Errors
This is (at least according to me) actually a surprisingly interesting topic.

Assume we have a FASTQ record with only three nucleotides with the corresponding ASCII qualities `???`. How do we calculate the mean error probability across these nucleotides? There are basically two different options:
- Convert to phred scores `[30, 30, 30]`, calculate the mean `(30 + 30 + 30) / 3 = 30` and convert to error probability `10^(-30/10) = 10^(-3) = 0.001`.
- Convert all the way to error probabilities first `[0.001, 0.001, 0.001]` and then calculate the mean `(0.001 + 0.001 + 0.001) / 3 = 0.001`.

In this example, we get the same result. This is, however, not always the case. Consider an alternative sequence of only two nucleotides with ASCII qualities `+5`. Our two options give:
- `[10, 20]` -> mean is `(10 + 20) / 2 = 15` which gives an error probability of `10^(-15/10) ≈ 0.0316`.
- `[0.1, 0.01]` -> mean is `(0.1 + 0.01) / 2 = 0.055`.

All of a sudden, the results are quite different based on the method we choose. How do we know which is correct?

## Different Kinds Of Means
To investigate this, we need to understand that there are different ways of calculating means, neither of which is incorrect.

### Arithmetic Mean
The most common way is the `arithmetic mean`, which has the famous formula
\\[\\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i\\]

E.g., for `n=2` this would give `1/2 * (1 + 2) = 3/2 = 1.5`.

### Geometric Mean
A less common, but equally valid way to calculate means is the `geometric mean`:
\\[
\bar{x} = \sqrt[n]{\prod_{i=1}^{n} x_i} = {\prod_{i=1}^{n} x_i}^{1/n} 
\\]

E.g., for `n=2` this would give `(1 * 2)^(1/2) = √2 ≈ 1.414`.

## Putting It All Together
Our two approaches for calculating mean error probabilities, as defined in the start of this chapter, both use the `arithmetic mean`. However, the first approach has a fundamental flaw. We are calculating the `arithmetic mean` of log-encoded values that are not equidistant from each other with respect to error probabilities. As an example, the difference between phred scores `10` and `20` (with respect to error probabilities) is `0.1 - 0.01 = 0.09` whilst the difference between `20` and `30` is `0.01 - 0.001 = 0.009`.

Mathematically, we can derive the following formulas for our two approaches. Assume we have a set of phred scores \\[{ps_{1}, ps_{2}, ..., ps_{n}}\\]
- In the first method, we calculate a mean phred score and finally convert to an error probability.
	\\[
		\text{mean\_error\_probability} = 10^{-\\bar{ps} / 10}
	\\]

	where 
	\\[
		\\bar{ps} = \frac{1}{n} \sum_{i=1}^{n} ps_i
	\\]

	which gives
	\\[
		\text{mean\_error\_probability} = 10^{-\frac{1}{n} \sum_{i=1}^{n} ps_i / 10} = \left(10^{\sum_{i=1}^{n} -ps_i / 10}\right)^{1/n} = \left(10^{-ps_{1} / 10} \times \text{...} \times 10^{-ps_{n} / 10}\right)^{1/n} = \left(\prod_{i=1}^{n} 10^{-ps_i/10}\right)^{1/n}
	\\]

	This is the **geometric mean** of the individual error probabilities!

- In the second method, we first convert each phred score to an error probability and then calculate the arithmetic mean.

	\\[
		\text{mean\_error\_probability} = \frac{1}{n} \sum_{i=1}^{n} 10^{-ps_i / 10}
	\\]

	This is simply the **arithmetic mean** of the individual error probabilities.

## Which Mean To Choose
The natural question is which mean to choose. I'd argue that the arithmetic mean is correct, and here's why.

One way to think about this is: the **expected number of errors** in a read is the sum of all individual error probabilities.

To illustrate with a concrete example, consider a read of length `100` where `50` bases have phred score `20` and the other `50` have phred score `30`:
\\[   \underbrace{20, \text{...}, 20}\_{50}, \underbrace{30, \text{...}, 30}\_{50} \\]

Converting to error probabilities:
\\[   \underbrace{0.01, \text{...}, 0.01}\_{50}, \underbrace{0.001, \text{...}, 0.001}\_{50} \\]

The expected number of errors in this read is:
\\[   50 \times 0.01 + 50 \times 0.001 = 0.5 + 0.05 = 0.55 \\]

So the mean error probability per base should be `0.55 / 100 = 0.0055`. Now let's see what our two methods give:
- **Geometric mean (method 1):** `mean_phred = (20 * 50 + 30 * 50) / 100 = 25`, so `mean_error_probability = 10^(-25/10) ≈ 0.0032`. This predicts `0.32` expected errors — an **underestimate**.
- **Arithmetic mean (method 2):** `mean_error_probability = (0.01 * 50 + 0.001 * 50) / 100 = 0.0055`. This predicts `0.55` expected errors.

The geometric mean systematically underestimates the error rate because it is always less than or equal to the arithmetic mean (this is known as the [AM-GM inequality](https://en.wikipedia.org/wiki/AM%E2%80%93GM_inequality)). In practice, this means that if you average phred scores directly, you will be overly optimistic about your data quality.
