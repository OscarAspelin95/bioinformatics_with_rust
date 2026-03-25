# VCF
The **V**ariant **C**all **F**ormat is related to, you guessed it, variant calling. In essence, a `.vcf` file is a text file containing potential variants (SNPs, indels, etc) in our sample (reads) with respect to the reference. A typical (simplified) variant call workflow is illustrated below. 


```mermaid
graph TD

A["<pre>Reads<br><br>AACG	AACG	AACG	AACG<br>GTTCG	GATCG	GATCG	GATCG<br>GATCG	CGGGTA	CGGGTA	CGGGTA<br>CGGGTA	CGGCTA</pre>"]

B["<pre>...ATCGATCGGCTA...	reference</pre>"]

C["align and variant call"]

A e1@ --> C
B e2@ --> C

C --> D["<pre>   A<font color=red>A</font>CG	 CGG<font color=red>G</font>TA<br>   A<font color=red>A</font>CG	 CGG<font color=red>G</font>TA<br>   A<font color=red>A</font>CG	 CGG<font color=red>G</font>TA<br>   A<font color=red>A</font>CG	 CGG<font color=red>G</font>TA<br>       	 CGGCTA<br>  G<font color=red>T</font>TCG<br>  GATCG<br>  GATCG<br>  GATCG<br>  GATCG<br>   ...ATCGATCGGCTA...</pre>"]

D --> E["<pre>VCF file<pre><pre>POS	REF	ALT	FRAC</pre><pre>2	T	A	1.00<br>5	A	T	0.17<br>10	C	G	0.80</pre>"]

e1@{animate: true, animation: slow}
e2@{animate: true, animation: slow}
```
