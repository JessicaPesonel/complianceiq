import { type Entry, byId } from "../data/corpus";
import { type Hit } from "./bm25";

export interface Section {
  head: string;
  body: string;
}

export interface StructuredAnswer {
  conclusion: string;
  sections: Section[];
  evidence: { entry: Entry; score: number }[];
  empty: boolean;
}

/**
 * Compose a 5-section answer (结论 / 法律依据 / 案例支撑 / 风险 / 建议) strictly from
 * retrieved corpus entries. Every sentence is sourced — there is no free-form
 * generation here, so the output cannot hallucinate statutes or cases. (An
 * optional LLM-synthesis mode can be layered on top; see README.)
 */
export function compose(query: string, hits: Hit[]): StructuredAnswer {
  const evidence = hits
    .map((h) => ({ entry: byId(h.id)!, score: h.score }))
    .filter((e) => e.entry);

  if (evidence.length === 0) {
    return {
      conclusion: `未在本地法规 / 案例库中检索到与「${query}」相关的条目。请尝试更换关键词（如“支付牌照”“可疑交易”“跨境数据”“逃汇”）。`,
      sections: [],
      evidence: [],
      empty: true,
    };
  }

  const regs = evidence.filter((e) => e.entry.type === "regulation");
  const cases = evidence.filter((e) => e.entry.type === "case");
  const top = evidence[0].entry;

  const conclusion = `围绕「${query}」，共命中 ${regs.length} 条法规与 ${cases.length} 个案例。核心依据：${top.excerpt}`;

  const uniq = (xs: (string | undefined)[]) => [...new Set(xs.filter(Boolean) as string[])];
  const sections: Section[] = [];

  if (regs.length) {
    sections.push({
      head: "法律依据",
      body: regs
        .slice(0, 3)
        .map((r) => `《${r.entry.title.zh}》（${r.entry.source}）\n${r.entry.excerpt}`)
        .join("\n\n"),
    });
  }
  if (cases.length) {
    sections.push({
      head: "案例支撑",
      body: cases.slice(0, 2).map((c) => `${c.entry.title.zh}\n${c.entry.excerpt}`).join("\n\n"),
    });
  }
  const risks = uniq(evidence.map((e) => e.entry.risk)).slice(0, 3);
  if (risks.length) sections.push({ head: "风险提示", body: risks.join("\n\n") });

  const advice = uniq(evidence.map((e) => e.entry.advice)).slice(0, 3);
  if (advice.length) sections.push({ head: "操作建议", body: advice.join("\n\n") });

  return { conclusion, sections, evidence, empty: false };
}
