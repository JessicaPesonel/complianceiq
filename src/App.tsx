import { useMemo, useState } from "react";
import { BM25 } from "./lib/bm25";
import { corpus, indexText } from "./data/corpus";
import { compose, type StructuredAnswer } from "./lib/answer";

const PRESETS = [
  "跨境电商收款是否需要支付牌照？",
  "什么情况下要提交可疑交易报告？",
  "支付用户数据可以传到境外服务器吗？",
  "虚假贸易背景跨境付汇有什么风险？",
  "客户备付金可以挪用吗？",
];

export default function App() {
  const index = useMemo(
    () => new BM25(corpus.map((e) => ({ id: e.id, text: indexText(e) }))),
    [],
  );
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [ans, setAns] = useState<StructuredAnswer | null>(null);

  const run = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setInput(text);
    setQuery(text);
    setAns(compose(text, index.search(text, 6)));
  };

  const regCount = corpus.filter((e) => e.type === "regulation").length;
  const caseCount = corpus.filter((e) => e.type === "case").length;

  return (
    <div className="app">
      <header className="hero">
        <div className="wrap">
          <div className="brand">ComplianceIQ</div>
          <h1>跨境合规检索引擎</h1>
          <p className="sub">
            CJK-aware BM25 retrieval over Chinese cross-border payment regulations &amp; enforcement cases — structured 5-section answers, fully source-grounded.
          </p>
          <div className="stats">
            <span><b>{regCount}</b> 法规 / regulations</span>
            <span><b>{caseCount}</b> 案例 / cases</span>
            <span><b>BM25</b> + CJK bigram</span>
            <span><b>0</b> 依赖 / deps</span>
          </div>
        </div>
      </header>

      <main className="wrap">
        <form
          className="search"
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入合规问题，例如：跨境电商收款需要支付牌照吗？"
            aria-label="合规问题"
          />
          <button type="submit">检索</button>
        </form>

        <div className="presets">
          {PRESETS.map((p) => (
            <button key={p} className="chip" onClick={() => run(p)}>
              {p}
            </button>
          ))}
        </div>

        {ans && (
          <section className="result">
            <div className="qline">
              <span className="qlabel">QUERY</span> {query}
            </div>

            <div className="conclusion">
              <div className="sec-head">结论 · Conclusion</div>
              <p>{ans.conclusion}</p>
            </div>

            {ans.sections.map((s) => (
              <div key={s.head} className="block">
                <div className="sec-head">{s.head}</div>
                {s.body.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ))}

            {!ans.empty && (
              <div className="evidence">
                <div className="sec-head">检索证据 · Retrieved evidence（BM25）</div>
                {ans.evidence.map(({ entry, score }) => (
                  <div key={entry.id} className="ev">
                    <div className="ev-top">
                      <span className={"badge " + entry.type}>
                        {entry.type === "regulation" ? "法规" : "案例"}
                      </span>
                      <span className="ev-title">{entry.title.zh}</span>
                      <span className="ev-score">{score.toFixed(2)}</span>
                    </div>
                    <div className="ev-src">{entry.source}</div>
                    <div className="ev-tags">
                      {entry.tags.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {!ans && (
          <p className="hint">
            点击上方任一示例，或输入自己的问题 —— 引擎用 BM25 在本地语料中检索，并把命中的法规与案例组织成「结论 / 法律依据 / 案例支撑 / 风险 / 建议」5 段式回答。
          </p>
        )}
      </main>

      <footer className="wrap foot">
        <p>
          ComplianceIQ · 检索结果均来自本地策划语料，每句均可溯源（不做自由生成，避免编造法条）。仅供研究演示，非法律意见。
        </p>
        <p>
          <a href="https://github.com/JessicaPesonel/complianceiq" target="_blank" rel="noreferrer">
            GitHub · 源码与技术实现 ↗
          </a>
        </p>
      </footer>
    </div>
  );
}
