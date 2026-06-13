/**
 * CJK-aware tokenizer + BM25 ranking — zero dependencies.
 *
 * Chinese text has no whitespace word boundaries, so English-first tokenizers
 * (split on spaces) fail badly on it. Here we emit BOTH character unigrams and
 * adjacent-character bigrams for CJK runs (a cheap, dictionary-free approximation
 * of word segmentation that recalls multi-char terms like "支付" / "备付金"),
 * and normal lowercased word tokens for ASCII.
 */

const STOP = new Set(
  "的 了 和 与 及 或 在 是 对 为 以 其 等 也 就 都 而 之 你 我 他 这 那 有 无 不 会 要 可 能 上 下 中 个 被 把 向 给"
    .split(" "),
);

const CJK = /[一-鿿]/;

export function tokenize(text: string): string[] {
  const out: string[] = [];
  const segs = text.toLowerCase().match(/[一-鿿]+|[a-z0-9]+/g) ?? [];
  for (const seg of segs) {
    if (CJK.test(seg)) {
      const chars = Array.from(seg);
      for (let i = 0; i < chars.length; i++) {
        if (!STOP.has(chars[i])) out.push(chars[i]); // unigram
        if (i < chars.length - 1) out.push(chars[i] + chars[i + 1]); // bigram
      }
    } else {
      out.push(seg);
    }
  }
  return out;
}

export interface IndexedDoc {
  id: string;
  text: string;
}

interface DocStat {
  id: string;
  len: number;
  tf: Map<string, number>;
}

export interface Hit {
  id: string;
  score: number;
}

export class BM25 {
  private readonly k1 = 1.5;
  private readonly b = 0.75;
  private readonly docs: DocStat[] = [];
  private readonly df = new Map<string, number>();
  private readonly N: number;
  private readonly avgdl: number;

  constructor(corpus: IndexedDoc[]) {
    let total = 0;
    for (const d of corpus) {
      const toks = tokenize(d.text);
      const tf = new Map<string, number>();
      for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1);
      for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
      this.docs.push({ id: d.id, len: toks.length, tf });
      total += toks.length;
    }
    this.N = corpus.length;
    this.avgdl = total / Math.max(1, this.N);
  }

  private idf(term: string): number {
    const n = this.df.get(term) ?? 0;
    return Math.log(1 + (this.N - n + 0.5) / (n + 0.5));
  }

  search(query: string, topK = 6): Hit[] {
    const terms = [...new Set(tokenize(query))];
    const scored: Hit[] = this.docs.map((d) => {
      let score = 0;
      for (const t of terms) {
        const f = d.tf.get(t);
        if (!f) continue;
        const norm = f + this.k1 * (1 - this.b + (this.b * d.len) / this.avgdl);
        score += this.idf(t) * ((f * (this.k1 + 1)) / norm);
      }
      return { id: d.id, score };
    });
    return scored
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}
