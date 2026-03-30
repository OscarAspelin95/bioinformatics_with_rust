# Code Implementation
We can implement a relatively good overlap parser. It does not catch every edge case (try modifying the code to find out why!) but works as a start. We've added a parameter `overlap_margin` to ignore very short overlaps. For example, if two hits `a` and `b` overlap by one or two nucleotides, we might want to split them into separate regions.

```rust,editable
use std::collections::HashMap;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum Strand {
    Forward,
    Reverse,
}

#[allow(unused)]
#[derive(Debug, Clone)]
struct BlastHit {
    strand: Strand,
    // metrics
    pident: f64,
    qcov: f64,
    // query
    qname: String,
    // subject = assembly
    sname: String,
    sstart: usize,
    send: usize,
}

impl BlastHit {
    fn new(
        strand: Strand,
        pident: f64,
        qcov: f64,
        qname: String,
        sname: String,
        sstart: usize,
        send: usize,
    ) -> Self {
        if strand == Strand::Reverse && sstart <= send {
            panic!("Reverse strand must have sstart > send.")
        }

        if strand == Strand::Forward && sstart >= send {
            panic!("Forward strand must have sstart < send.")
        }

        Self {
            strand,
            pident,
            qcov,
            qname,
            sname,
            sstart,
            send,
        }
    }

    fn coordinates(&self) -> (usize, usize) {
        match self.strand {
            Strand::Forward => {
                assert!(self.sstart < self.send);
                (self.sstart, self.send)
            }
            Strand::Reverse => {
                assert!(self.send < self.sstart);
                (self.send, self.sstart)
            }
        }
    }
}

fn mock_hits() -> Vec<BlastHit> {
    let h1 = BlastHit::new(
        Strand::Forward,
        1.0,
        1.0,
        "gene_1|variant_1".into(),
        "contig_1".into(),
        10,
        100,
    );

    let h2 = BlastHit::new(
        Strand::Forward,
        0.99,
        0.99,
        "gene_1|variant_2".into(),
        "contig_1".into(),
        15,
        110,
    );

    let h3 = BlastHit::new(
        Strand::Forward,
        0.99,
        0.99,
        "gene_1|variant_2".into(),
        "contig_1".into(),
        109,
        200,
    );

    let h4 = BlastHit::new(
        Strand::Reverse,
        1.0,
        1.0,
        "gene_1|variant_2".into(),
        "contig_1".into(),
        200,
        100,
    );

    vec![h1, h2, h3, h4]
}

struct BlastConfig {
    min_pident: f64,
    min_qcov: f64,
    overlap_margin: usize,
}

impl BlastConfig {
    fn default() -> Self {
        Self {
            min_pident: 0.90,
            min_qcov: 0.90,
            overlap_margin: 2,
        }
    }
}

fn group_by_contig_strand(
    hits: Vec<BlastHit>,
    cfg: &BlastConfig,
) -> HashMap<(String, Strand), Vec<BlastHit>> {
    // We need to assign hit regions.
    let mut by_contig_strand: HashMap<(String, Strand), Vec<BlastHit>> = HashMap::new();

    // group by hit location.
    for hit in hits {
        // Remove low quality hits.
        if hit.pident < cfg.min_pident || hit.qcov < cfg.min_qcov {
            continue;
        }

        by_contig_strand
            .entry((hit.sname.clone(), hit.strand))
            .or_default()
            .push(hit);
    }

    by_contig_strand
}

fn parse_hits(hits: Vec<BlastHit>, cfg: BlastConfig) -> Vec<(usize, BlastHit)> {
    // Group by contig and strand.
    let per_contig_strand = group_by_contig_strand(hits, &cfg);

    // We'll keep a global, unique hit region.
    let mut hit_region: usize = 0;

    let mut best_hits: Vec<(usize, BlastHit)> = vec![];

    for (_, mut hits) in per_contig_strand.into_iter() {
        // Prioritize hits with lowest start AND that is the longest.
        hits.sort_by(|a, b| {
            let (a_start, a_end) = a.coordinates();
            let (b_start, b_end) = b.coordinates();

            a_start
                .cmp(&b_start)
                .then_with(|| a_end.cmp(&b_end).reverse())
        });

        // Should not happen.
        if hits.len() == 0 {
            continue;
        }

        for hits_in_region in hits.as_slice().chunk_by(|a, b| {
            let (_, a_end) = a.coordinates();
            let (b_start, _) = b.coordinates();

            a_end > b_start + cfg.overlap_margin
        }) {
            hit_region += 1;

            let best_hit = hits_in_region
                .iter()
                .max_by(|a, b| {
                    a.pident
                        .total_cmp(&b.pident)
                        .then_with(|| a.qcov.total_cmp(&b.qcov))
                })
                .expect(&format!(
                    "Failed to extract best hit from {:?}",
                    hits_in_region
                ));

            best_hits.push((hit_region, best_hit.to_owned()));
        }
    }

    best_hits
}

fn main() {
    // We need hits without hit region.
    let hits = mock_hits();

    let cfg = BlastConfig::default();

    let best_hits = parse_hits(hits, cfg);

    for h in best_hits {
        println!("{}\t{:?}", h.0, h.1);
    }
}
```

As mentioned before, this parser does not handle every single edge case. The reason is that `chunk_by` only compares adjacent elements and we cannot guarantee a transitive overlap property. In the image below, even though `a` overlaps with `b` and `c`, the adjacent hits `b` and `c` don't overlap and our code will generate two hit regions instead of one.

<pre>
a	|-----------------------------------------------|
b		|---------|
c				|-------------|
</pre>

We should improve our code with some method that takes this into account, such as a rolling max approach. If we really want to go bananas, an [interval tree](https://en.wikipedia.org/wiki/Interval_tree) is an excellent alternative.
