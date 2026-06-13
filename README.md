# ComplianceIQ — 跨境合规检索引擎 / CJK-aware compliance search

A small, dependency-free **CJK-aware BM25 retrieval engine** over a curated corpus of
Chinese cross-border-payment **regulations and enforcement cases**, returning a
**structured 5-section answer** (结论 / 法律依据 / 案例支撑 / 风险 / 建议) whose every
sentence is grounded in a retrieved source — so it cannot fabricate statutes.

> **Live demo:** https://complianceiq.vercel.app
> **Stack:** Vite + React + TypeScript, zero runtime dependencies. Fully client-side — runs with no backend and no API key.

---

## Why this exists

General LLMs answer Chinese compliance questions fluently but ungrounded — they
invent plausible-sounding statutes and cases that compliance teams can't act on.
Two concrete problems:

1. **Grounding.** Answers must cite real regulations and real precedents, traceable to source.
2. **CJK retrieval.** Chinese has no whitespace word boundaries, so English-first
   tokenizers (split on spaces) wreck recall on terms like `备付金`, `可疑交易`, `逃汇`.

ComplianceIQ tackles both with a transparent retrieval-first design.

## How it works

```
query ──► CJK tokenizer ──► BM25 ranking ──► top-k evidence ──► structured composer ──► 5-section answer
            (unigram + bigram)   (k1=1.5,b=0.75)   (regs + cases)     (source-grounded)
```

### 1. CJK-aware tokenization (`src/lib/bm25.ts`)
For each CJK run we emit **both character unigrams and adjacent bigrams**
(`备付金` → `备`,`付`,`金`,`备付`,`付金`). This is a cheap, dictionary-free
approximation of word segmentation that recalls multi-character terms without a
segmentation model. ASCII runs are lowercased word tokens. A small stop-character
set drops high-frequency particles (的, 了, 在 …).

### 2. BM25 ranking (`src/lib/bm25.ts`)
A standard Okapi BM25 (`k1 = 1.5`, `b = 0.75`) computed over the corpus: term
frequency saturation + document-length normalization + IDF. ~80 lines, no deps.

### 3. Source-grounded answer composition (`src/lib/answer.ts`)
The top hits are assembled into five sections. **There is no free-form generation** —
法律依据 lists matched regulations with their official source line; 案例支撑 lists
matched cases; 风险 / 建议 aggregate the curated `risk` / `advice` fields of the hit
entries. Because every sentence comes from a retrieved record, the output is
auditable and can't hallucinate a law.

### 4. Corpus (`src/data/corpus.ts`)
A curated sample: **8 regulations** (real: 《非银行支付机构监督管理条例》《反洗钱法》
《外汇管理条例》《个人信息保护法》…) + **6 representative enforcement cases**
(illustrative composites — no real entities named). Each entry carries a quotable
`excerpt`, `tags`, and where relevant `risk` / `advice` notes.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static build → dist/
```

No environment variables, no API key, no server.

## Design notes & honesty

- **Retrieval, not generation, is the core.** The 5-section answer is a deterministic
  view over retrieved sources. This is a deliberate trade-off for *trustworthiness*.
- The corpus is a curated demonstration sample, not an exhaustive legal database.
- This is a research/portfolio demo, **not legal advice**.

## Roadmap

- [ ] Optional LLM-synthesis mode: feed retrieved evidence to a model for natural-language
      reasoning while keeping citations (serverless function, opt-in via `ANTHROPIC_API_KEY`).
- [ ] Cross-encoder re-ranking of BM25 candidates.
- [ ] Expand corpus + per-clause anchoring.
- [ ] Bilingual corpus and answers.

## License

MIT © Longyu Xu
