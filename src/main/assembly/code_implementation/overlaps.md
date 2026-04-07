# Overlaps
We need to codify the overlap graph somehow. Ideally, we'd use a crate like [petgraph](https://github.com/petgraph/petgraph) to handle most of this automatically. However, it is a good excercise to attempt to implement a graph based data structure because this forces us to deal with recursive data structures (which is a bit tricky in Rust).

The code below is a quick and dirty approach to defining an unweighted graph. With <q>quick</q> I actually mean it took me quite a while to implement in relation to the relatively few lines of code. With <q>dirty</q> I mean that there are numerous improvements we can do. There a few remarks about the code that are worth mentioning.

First, we'd like `Node` and `Graph` to be generic over the same type `T` so we use a trait for this. We require `Eq` and `Hash` due to the breadth first search implementation we use in `fn visualize`.

Second, we use two smart pointers `Rc` and `RefCell`. This allows multiple owners and interior mutability (runtime checked). For example, we can have a node `A` being part of multiple overlaps whilst allowing adding new overlaps to it.

Third, this code is rather verbose. I mean, the type `Option<Vec<Rc<RefCell<Node<T>>>>>` is hilariously verbose.

```rust
use std::{
    cell::RefCell,
    collections::{HashSet, VecDeque},
    fmt::Debug,
    hash::Hash,
    rc::Rc,
};

trait NodeData: Debug + Clone + Eq + Hash {}
impl<T: Debug + Clone + Eq + Hash> NodeData for T {}

#[derive(Debug)]
struct Node<T> {
    value: T,
    overlaps_with: Option<Vec<Rc<RefCell<Node<T>>>>>,
}

impl<T: NodeData> Node<T> {
    fn add_overlap(&mut self, node: Rc<RefCell<Node<T>>>) {
        self.overlaps_with.get_or_insert_default().push(node);
    }
    
    /// NOTE - only shows nodes that are part of an overlap.
    fn visualize(&self) {
        match &self.overlaps_with {
            None => {
                println!("{:?} ->", self.value);
            }
            Some(overlaps) => {
                let overlap_names = overlaps
                    .iter()
                    .map(|o| o.borrow().value.clone())
                    .collect::<Vec<_>>();

                println!("{:?} -> {:?}", self.value, overlap_names);
            }
        }
    }
}

struct Graph<T>
where
    T: Debug + Clone + Eq + Hash,
{
    nodes: Vec<Rc<RefCell<Node<T>>>>,
}

impl<T: NodeData> Graph<T> {
    fn add(&mut self, node: Rc<RefCell<Node<T>>>) {
        self.nodes.push(node);
    }

    fn visualize_overlaps(&self) {
        if self.nodes.len() == 0 {
            return;
        }

        let mut queue: VecDeque<Rc<RefCell<Node<T>>>> = VecDeque::new();
        let mut seen: HashSet<T> = HashSet::new();

        let first_node = self
            .nodes
            .first()
            .expect("expected graph to have at least one node.");

        let v = first_node.borrow().value.clone();

        seen.insert(v);
        queue.push_back(first_node.clone());

        while queue.len() > 0 {
            let current = queue.pop_front().expect("queue should not be empty");
            current.borrow().visualize();

            let Some(overlaps) = &current.borrow().overlaps_with else {
                continue;
            };

            for overlap in overlaps {
                if !seen.contains(&overlap.borrow().value) {
                    seen.insert(overlap.borrow().value.clone());
                    queue.push_back(overlap.clone());
                }
            }
        }
    }
}

fn mock_graph<'a>() -> Graph<&'a str> {
    let c = Rc::new(RefCell::new(Node {
        value: "C",
        overlaps_with: None,
    }));

    let b = Rc::new(RefCell::new(Node {
        value: "B",
        overlaps_with: Some(vec![Rc::clone(&c)]),
    }));

    let a = Rc::new(RefCell::new(Node {
        value: "A",
        overlaps_with: Some(vec![Rc::clone(&b), Rc::clone(&c)]),
    }));

    Graph {
        nodes: vec![a, b, c],
    }
}

fn main() {
    let mut graph = mock_graph();

    println!("--- Overlaps nodes (before)");
    graph.visualize_overlaps();

    // New node.
    let d = Rc::new(RefCell::new(Node {
        value: "D",
        overlaps_with: None,
    }));

    graph.add(d.clone());

    {
        let mut a = graph.nodes.first().unwrap().borrow_mut();
        a.add_overlap(d.clone());
    }

    println!("--- Overlaps nodes (after)");
    graph.visualize_overlaps();
}
```
