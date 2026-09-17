import * as SDK from "azure-devops-extension-sdk";
import grammar from "../../grammar/semantic.tmLanguage.json";

type Rule = { name?: string; match?: string; begin?: string; end?: string };
type Grammar = { repository?: Record<string, { patterns?: Rule[] }> };

const tm = grammar as Grammar;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
}

function classForScope(scope: string | undefined): string {
  if (!scope) return "";
  if (scope.startsWith("comment.")) return "sem-comment";
  if (scope.startsWith("keyword.")) return "sem-keyword";
  if (scope.startsWith("string.")) return "sem-string";
  if (scope.includes("numeric")) return "sem-number";
  if (scope.startsWith("constant.language")) return "sem-constant";
  if (scope.includes("reference")) return "sem-reference";
  if (scope.includes("member")) return "sem-field";
  if (scope.includes("operator")) return "sem-operator";
  if (scope.startsWith("punctuation.")) return "sem-punctuation";
  return "";
}

interface CompiledRule { re: RegExp; css: string; priority: number }

function buildRules(): CompiledRule[] {
  const repo = tm.repository || {};
  const order = ["comments", "header", "references", "keywords", "constants", "numbers", "field-keys", "operators"];
  const rules: CompiledRule[] = [];
  let priority = 0;
  for (const key of order) {
    for (const rule of repo[key]?.patterns || []) {
      if (!rule.match) continue;
      try {
        rules.push({ re: new RegExp(rule.match, "gy"), css: classForScope(rule.name), priority: priority++ });
      } catch (e) {
        console.warn("[Semantic renderer] could not compile TextMate rule", key, rule.match, e);
      }
    }
  }
  return rules;
}

const compiledRules = buildRules();

function renderSemantic(source: string): string {
  let out = "";
  let i = 0;
  while (i < source.length) {
    // String handling follows the TextMate begin/end rule and is deliberately line-safe.
    if (source[i] === '"') {
      let j = i + 1;
      let escaped = false;
      while (j < source.length) {
        const ch = source[j];
        if (ch === "\n" || ch === "\r") break;
        if (!escaped && ch === '"') { j++; break; }
        if (!escaped && ch === "\\") escaped = true; else escaped = false;
        j++;
      }
      out += `<span class="sem-string">${escapeHtml(source.slice(i, j))}</span>`;
      i = j;
      continue;
    }

    let best: { end: number; css: string } | undefined;
    for (const rule of compiledRules) {
      rule.re.lastIndex = i;
      const m = rule.re.exec(source);
      if (m && m.index === i && m[0].length > 0) {
        if (!best || m[0].length > best.end - i) best = { end: i + m[0].length, css: rule.css };
      }
    }

    if (best) {
      const text = escapeHtml(source.slice(i, best.end));
      out += best.css ? `<span class="${best.css}">${text}</span>` : text;
      i = best.end;
    } else {
      out += escapeHtml(source[i]);
      i++;
    }
  }
  return out;
}

class SemanticRenderer {
  async renderContent(rawContent: string): Promise<void> {
    const target = document.getElementById("semantic-viewer");
    if (!target) throw new Error("Semantic renderer target missing");
    target.innerHTML = renderSemantic(rawContent);
    try {
      const height = Math.max(document.documentElement.scrollHeight, target.scrollHeight, 100);
      const width = Math.max(document.documentElement.scrollWidth, target.scrollWidth, 100);
      SDK.resize(width, height);
    } catch (_) {}
  }
}

(async () => {
  console.log("[Semantic renderer] loading");
  SDK.init({ loaded: false });
  await SDK.ready();
  SDK.register("semantic_content_renderer", () => new SemanticRenderer());
  SDK.notifyLoadSucceeded();
  console.log("[Semantic renderer] registered; TextMate grammar embedded", grammar);
})();
