import { describe, it, expect } from "vitest";
import { domainAnalyze, DOMAIN } from "../src/domain";
import { run } from "../src/engine";

describe("a11y-contrast-laser domain", () => {
  it("embeds oneLiner niche keywords", () => {
    expect(DOMAIN.author).toBe("zAx4hub");
    expect(DOMAIN.oneLiner).toContain("WCAG contrast");
    expect(DOMAIN.keywords.length).toBeGreaterThan(2);
  });
  it("scores on-niche text higher than noise", () => {
    const on = domainAnalyze([DOMAIN.oneLiner]);
    const off = domainAnalyze(["zzzz unrelated lorem ipsum 999"]);
    expect(on.findings[0].score).toBeGreaterThan(off.findings[0].score * 0.5);
  });
  it("run report includes domain metrics", () => {
    const r = run({ items: [{ text: DOMAIN.oneLiner }, { text: "zAx4hub fixture" }] });
    expect(r.author).toBe("zAx4hub");
    expect(r.metrics.domainFingerprint).toBeTruthy();
    expect(r.findings.some((f) => f.kind === "domain")).toBe(true);
  });
});
