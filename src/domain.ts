/** Domain overlay for a11y-contrast-laser — zAx4hub */
import { createHash } from "crypto";

export const DOMAIN = {
  project: "a11y-contrast-laser",
  author: "zAx4hub",
  oneLiner: "WCAG contrast laser with autofix token suggestions",
  keywords: ["wcag","contrast","laser","autofix","token","suggestions","a11y"],
  seed: 2253819084,
  fingerprint: "bc42cd8901af",
} as const;

function tok(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9_.-]+/).filter(Boolean);
}

function h01(s: string, salt = 0): number {
  const buf = createHash("sha256").update(String(DOMAIN.seed + salt)).update(s).digest();
  return buf.readUInt32BE(0) / 0xffffffff;
}

/** Score how tightly an input matches this project's niche (oneLiner-derived). */
export function domainRelevance(text: string): { score: number; hits: string[]; signals: string[] } {
  const t = tok(text);
  const set = new Set(t);
  const hits = DOMAIN.keywords.filter((k) => set.has(k) || text.toLowerCase().includes(k));
  const signals: string[] = [];
  let score = hits.length / Math.max(1, DOMAIN.keywords.length);

  // Heuristics tied to niche language in the one-liner
  const lower = text.toLowerCase();
  if (/diff|blame|regress/.test(lower)) signals.push("change-attribution");
  if (/secret|token|pii|exfil|leak/.test(lower)) signals.push("data-leak-risk");
  if (/policy|allow|deny|firewall|sandbox/.test(lower)) signals.push("policy-gate");
  if (/queue|retry|saga|exactly-once|poison/.test(lower)) signals.push("reliability");
  if (/trace|otel|slo|latency|cardinality/.test(lower)) signals.push("observability");
  if (/sbom|lockfile|supply|typosquat|dep/.test(lower)) signals.push("supply-chain");
  if (/rag|embed|chunk|prompt|llm|agent|mcp/.test(lower)) signals.push("ai-systems");
  if (/dns|tls|packet|bgp|wasm|browser/.test(lower)) signals.push("edge-security");
  if (/carbon|schedule|cost|idle|budget/.test(lower)) signals.push("efficiency");
  if (/test|flaky|chaos|fuzz|mutation/.test(lower)) signals.push("quality");
  if (/game|match|elo|loot|replay|netcode/.test(lower)) signals.push("realtime-sim");

  score = Math.min(1, score + signals.length * 0.08 + h01(text, 3) * 0.05);
  return { score: Math.round(score * 1000) / 1000, hits, signals };
}

/** Lightweight niche engine: keyword TF + signal graph + deterministic risk. */
export function domainAnalyze(items: string[]) {
  const rows = items.map((text, i) => {
    const r = domainRelevance(text);
    const weight = Math.round((0.55 * r.score + 0.45 * h01(text, i)) * 1000) / 1000;
    return {
      id: `d${i}`,
      kind: "domain",
      score: weight,
      detail: text.slice(0, 96),
      tag: r.signals[0] || (r.hits.length ? "on-niche" : "off-niche"),
      hits: r.hits,
      signals: r.signals,
    };
  });
  const nicheCoverage =
    rows.reduce((a, r) => a + (r.tag === "off-niche" ? 0 : 1), 0) / Math.max(1, rows.length);
  return {
    author: "zAx4hub",
    project: DOMAIN.project,
    fingerprint: DOMAIN.fingerprint,
    nicheCoverage: Math.round(nicheCoverage * 1000) / 1000,
    keywords: DOMAIN.keywords,
    findings: rows,
  };
}
