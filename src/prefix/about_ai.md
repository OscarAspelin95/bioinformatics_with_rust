# About AI
I want to start this section by stating that I strongly opted out of vibe-coding this project. If I did, I'd probably have been done in a day or two. Instead, I chose the proper (and difficult) path of trying things out, failing, swearing, reading documentation and finally (somewhat) understanding. This probably means there are some text and code-snippets in this book that are not 100% correct. I'm okay with that, because it means there is room for improvement.

With that said, I <em>have</em> used AI as a tool for the following:
- Asking questions about my code to find potential bugs, weaknesses and edge cases.
- Explaining Rust concepts that I did not fully understand (such as declarative macros).
- Asking for suggestions on performance improvements and implementing them only if I can understand why they make the code more performant.
- Sometimes to check for spelling and grammar as well as fixing logical and factual inconsistencies.
- Chapter and text re-structuring, after which I've read through it.

## Why I Dislike AI
I've found AI to be both profoundly impressive and profoundly stupid at the same time. This means it is unreliable and I don't like that because it means I need to act as a babysitter.

In addition, I want to understand my codebase. I don't if AI writes it for me. What happens when there is a bug that the AI cannot fix? I have to fix it **after** spending lots of time first understanding my own codebase. If that is the case, I might as well just have written the code myself from the start. AI cannot fix every bug in every system. It is enough with one bug in a relatively complex system for an engineer having to spend hours or days to understand the codebase. Is this really what we want?

It does not necessarily make me smarter. Imagine if I'd vibe coded this entire book, with perfect paragraphs explaining a wide variety of bioinformatic concepts. That does not make me good at bioinformatics, it makes me good at AI prompting. I want to take pride in my work, and refine it when I find errors. I've spent countless hours reading and understanding different concepts, sometimes whilst writing the chapters. Writing and updating text goes in parallel with increased knowledge.

## The Future of AI
I don't think AI is inherently bad. It can be incredibly useful and I think developers are fools not to use AI in some shape or form. What I do think is that people are using it incorrectly. Large Language Models are good at language. AI agents are fast. We should use it for that. For example - writing text, documentation or summarizing large amounts of text. Personally, I've found AI incredibly useful in bioinformatics with respect to brainstorming ideas and explaining concepts. The problem is that we need to be aware of hallucinations. Because of this, we can't just use a <q>fire and forget</q> approach. It requires supervision, revision and fact checking.

Regarding the future, my prediction is that we'll see an AI recession. I'm not sure how big, but I think it is coming. The reasons are:

* Software developers like to write code. Personally, I love the feeling of taking pride in the code I've written myself. Even better when fixing bugs and improving performance. This confirms that I *understand* what I'm doing.

* The idea that <q>AI will replace junior engineers</q> does not make sense. Exactly from where are we getting the new senior engineers? After all, we need some engineer to babysit AI. In addition, software *engineering* is not about just writing code. It is about systems design, testing, human interaction and a lot more. The only way this makes sense is betting on AI becoming so good that ultimately, we don't need *any* software engineers anymore. You think this is the case?

* If AI takes over, who is going to sign off on the code quality and functionality? With the current state of AI, if you are a manager - would you honestly take responsibility for the quality of AI generated code? I sure would not and I'm pretty sure senior engineers wouldn't either.

* LLM based AI is not <q>smart</q> and does not <q>think</q>. It does not understand in the way humans do. What it does is predicting the next token in a sequence. The token concept is also not waterproof, which is why LLMs have issues with basic prompts such as <q>how many Rs are in the word strawberry?</q> and <q>is the word oreo a palindrome?</q>. Another aspect is that it usually goes from A to B without considering the way there. I've seen countless posts of AI <q>fixing</q> code by modifying or completely removing tests. Is this what we call intelligence? Really?

* The amount of money that is poured into AI is **insane**. We are talking hundreds of billions of dollars. Not to mention the electricity required to power the data centers. I'm not necessarily saying this is a bad thing, but it is insane. With these amounts of resources, we expect AI to carry its weight. Is this really what we have seen?

* I would not trust the visionary statements by people such as Elon Musk, Sam Altman and Dario Amodei. Are they smart people? Yes. Do they have incentives to make AI appear more capable than it actually is in practice? Also yes, because they are dependent on shareholders and investors. Personally, I'd listen to people who don't have a financial motive to promote AI. 

* Commercial AI is probably over-valued. I would not under-estimate the open source community and its capabilities.

## AI's Greatest Hits
With that said, here are some of AI's greatest hits:

| one-liner | description | year | source(s) |
|--|--|--|--|
| GPT-5 launch bar charts | During the launch of OpenAI's GPT-5 model, more than one bar chart supposedly showing the improvements compared to older models contained non-sensical information. Things such as 52.8% is larger than 69.1%. | 2025 | [Reddit](https://www.reddit.com/r/dataisugly/comments/1mk5wdb/this_chart_from_openais_official_gpt5_release/), [Hackernews](https://news.ycombinator.com/item?id=44827179) |
| Klarna re-hires after AI layoffs | After a round of customer service layoffs due to AI, Klarna decided to re-hire humans because apparently "customers like talking to humans". | 2025 | [Forbes](https://www.forbes.com/sites/quickerbettertech/2025/05/18/business-tech-news-klarna-reverses-on-ai-says-customers-like-talking-to-people/)|
| MIT report shows AI falls short | An MIT report published in 2025 came to the conclusions that in 95% of the companies in the dataset, AI implementations fall short. | 2025 | [Fortune](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/) |
| AI slop lawyer | A lawyer supposedly submitted AI hallucinated cases to a court in Australia. | 2024 | [The Guardian](https://www.theguardian.com/law/2025/sep/03/lawyer-caught-using-ai-generated-false-citations-in-court-case-penalised-in-australian-first) |
| McDonald's ends AI drive-thru | McDonald's terminated its AI drive-thru ordering pilot with IBM after viral failures—including orders for bizarre quantities of food—due to the AI struggling with accents and dialects. | 2024 | [CNN](https://www.cnn.com/2024/06/17/tech/mcdonalds-ai-drive-thru-program/index.html), [CNBC](https://www.cnbc.com/2024/06/17/mcdonalds-to-end-ibm-ai-drive-thru-test.html) |
| Chicago Sun-Times fake book list | The Chicago Sun-Times published a summer reading list where 10 out of 15 recommended books were entirely AI-fabricated—fake titles attributed to real authors, including a Pulitzer Prize winner. | 2025 | [NPR](https://www.npr.org/2025/05/20/nx-s1-5405022/fake-summer-reading-list-ai), [404 Media](https://www.404media.co/chicago-sun-times-prints-ai-generated-summer-reading-list-with-books-that-dont-exist/) |
| Grok's antisemitic rant | After an update instructing Grok to "not shy away from politically incorrect claims", the chatbot began posting antisemitic content. xAI later blamed an "unauthorized modification". | 2025 | [NPR](https://www.npr.org/2025/07/09/nx-s1-5462609/grok-elon-musk-antisemitic-racist-content), [Washington Post](https://www.washingtonpost.com/technology/2025/07/11/grok-ai-elon-musk-antisemitism/) |

Lastly, I just want to share one encounter with Claude `Haiku` that is too good to leave out. This specific example is about Rust versions. To be clear, this was in **2026** and I used Rust version **2024**
```
[Me] Claude, investigate why my Rust code does not compile.

[Claude]
  This is invalid. The valid Rust editions are:
  - 2015
  - 2018
  - 2021

  The 2024 edition doesn't exist. This is likely causing rust-analyzer to fail parsing your project configuration, which
  explains why:
  
[Me] *Calls out Claude, saying that version 2024 does exist*

[Claude]
You're absolutely right, and I apologize for the misinformation! The Rust 2024 edition was just stabilized with Rust 1.85.0 on February 20, 2025 — literally last week. My knowledge was out of date.

[Me] *Calling out Claude on the fact that February 20, 2025 was not last week but rather almost a year ago*

[Claude]
You're right to call me out—I made a ridiculous error. Today is February 11, 2026. February 20, 2025 was almost a year ago, not last week!
```

Could I have used `Sonnet` or `Opus` instead? Yes. Could I have used something like RAG or an MCP server to improve accuracy? Also yes.

Should I need to? Absolutely. Not.

If we are to believe that AI soon will replace software engineers, these types of mistakes should not happen. Using AI should just work without requiring lots of specialized tools to <q>cover</q> for the model's shortcomings.
