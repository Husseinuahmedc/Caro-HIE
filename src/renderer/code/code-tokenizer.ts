import type { CodeLanguage, CodeLayer } from "@/core/document";
import type { CodeTokenKind } from "./code-themes";

export interface CodeToken {
  content: string;
  kind: CodeTokenKind;
}

export interface CodeVisualLine {
  tokens: CodeToken[];
  logicalLineNumber: number;
  showLineNumber: boolean;
  highlighted: boolean;
}

export interface CodeLayout {
  lines: CodeVisualLine[];
  lineAdvance: number;
  gutterWidth: number;
  maximumCharacters: number;
}

const KEYWORDS: Record<CodeLanguage, ReadonlySet<string>> = {
  typescript: new Set(["as", "async", "await", "break", "case", "catch", "class", "const", "continue", "default", "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for", "from", "function", "if", "implements", "import", "in", "instanceof", "interface", "keyof", "let", "new", "null", "of", "private", "protected", "public", "readonly", "return", "satisfies", "static", "super", "switch", "this", "throw", "true", "try", "type", "typeof", "undefined", "unknown", "void", "while", "with", "yield"]),
  tsx: new Set(["as", "async", "await", "class", "const", "else", "export", "extends", "false", "for", "from", "function", "if", "import", "interface", "let", "new", "null", "return", "satisfies", "this", "true", "type", "typeof", "undefined", "void"]),
  javascript: new Set(["async", "await", "break", "case", "catch", "class", "const", "continue", "default", "delete", "do", "else", "export", "extends", "false", "finally", "for", "from", "function", "if", "import", "in", "instanceof", "let", "new", "null", "of", "return", "static", "super", "switch", "this", "throw", "true", "try", "typeof", "undefined", "void", "while", "yield"]),
  jsx: new Set(["async", "await", "class", "const", "else", "export", "extends", "false", "for", "from", "function", "if", "import", "let", "new", "null", "return", "this", "true", "typeof", "undefined", "void"]),
  json: new Set(["false", "null", "true"]),
  html: new Set(),
  css: new Set(["and", "important", "not", "only", "or"]),
  sql: new Set(["add", "alter", "and", "as", "asc", "between", "by", "case", "create", "delete", "desc", "distinct", "drop", "else", "end", "exists", "from", "group", "having", "in", "index", "insert", "into", "is", "join", "left", "like", "limit", "not", "null", "on", "or", "order", "outer", "primary", "references", "right", "select", "set", "table", "then", "union", "unique", "update", "values", "when", "where"]),
  python: new Set(["and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del", "elif", "else", "except", "False", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "None", "nonlocal", "not", "or", "pass", "raise", "return", "True", "try", "while", "with", "yield"]),
  bash: new Set(["case", "do", "done", "elif", "else", "esac", "export", "fi", "for", "function", "if", "in", "local", "readonly", "select", "then", "until", "while"]),
  text: new Set(),
};

function pushToken(tokens: CodeToken[], content: string, kind: CodeTokenKind): void {
  if (!content) return;
  const previous = tokens.at(-1);
  if (previous?.kind === kind) previous.content += content;
  else tokens.push({ content, kind });
}

function commentStart(line: string, index: number, language: CodeLanguage): number {
  if (language === "html" && line.startsWith("<!--", index)) return 4;
  if (["typescript", "tsx", "javascript", "jsx", "css"].includes(language) && line.startsWith("/*", index)) return 2;
  if (["typescript", "tsx", "javascript", "jsx"].includes(language) && line.startsWith("//", index)) return 2;
  if (["python", "bash"].includes(language) && line[index] === "#") return 1;
  if (language === "sql" && line.startsWith("--", index)) return 2;
  return 0;
}

function tokenizeLine(source: string, language: CodeLanguage): CodeToken[] {
  const line = source.replaceAll("\t", "  ");
  const tokens: CodeToken[] = [];
  let index = 0;

  while (index < line.length) {
    const commentLength = commentStart(line, index, language);
    if (commentLength) {
      pushToken(tokens, line.slice(index), "comment");
      break;
    }

    const character = line[index]!;
    if (character === '"' || character === "'" || character === "`") {
      let end = index + 1;
      while (end < line.length) {
        if (line[end] === "\\") end += 2;
        else if (line[end] === character) { end += 1; break; }
        else end += 1;
      }
      pushToken(tokens, line.slice(index, end), "string");
      index = end;
      continue;
    }

    const number = /^\d+(?:\.\d+)?/.exec(line.slice(index));
    if (number) {
      pushToken(tokens, number[0], "number");
      index += number[0].length;
      continue;
    }

    const identifier = /^[A-Za-z_$][\w$-]*/.exec(line.slice(index));
    if (identifier) {
      const value = identifier[0];
      const rest = line.slice(index + value.length);
      const before = line.slice(0, index).trimEnd();
      const kind: CodeTokenKind = KEYWORDS[language].has(value)
        ? "keyword"
        : language === "html" && /<\/?$/.test(before)
          ? "tag"
          : (language === "json" || language === "css") && /^\s*:/.test(rest)
            ? "property"
            : "plain";
      pushToken(tokens, value, kind);
      index += value.length;
      continue;
    }

    if (/\s/.test(character)) {
      const whitespace = /^\s+/.exec(line.slice(index))?.[0] ?? character;
      pushToken(tokens, whitespace, "plain");
      index += whitespace.length;
      continue;
    }

    if (/[{}()[\];,.<>:=+\-*/!&|?]/.test(character)) {
      pushToken(tokens, character, "punctuation");
    } else {
      pushToken(tokens, character, "plain");
    }
    index += 1;
  }

  return tokens.length ? tokens : [{ content: "", kind: "plain" }];
}

function wrapTokens(tokens: CodeToken[], maximumCharacters: number): CodeToken[][] {
  const rows: CodeToken[][] = [[]];
  let rowLength = 0;

  for (const token of tokens) {
    let offset = 0;
    while (offset < token.content.length || (token.content.length === 0 && offset === 0)) {
      const room = maximumCharacters - rowLength;
      if (room === 0) {
        rows.push([]);
        rowLength = 0;
        continue;
      }
      const content = token.content.slice(offset, offset + room);
      rows.at(-1)!.push({ content, kind: token.kind });
      offset += Math.max(content.length, 1);
      rowLength += content.length;
      if (rowLength >= maximumCharacters && offset < token.content.length) {
        rows.push([]);
        rowLength = 0;
      }
    }
  }

  return rows;
}

export function getCodeLayout(layer: CodeLayer): CodeLayout {
  const logicalLines = layer.code.split("\n");
  const lineAdvance = layer.fontSize * layer.lineHeight;
  const numberWidth = String(Math.max(1, logicalLines.length)).length * layer.fontSize * 0.62;
  const gutterWidth = layer.showLineNumbers ? numberWidth + layer.fontSize * 1.15 : 0;
  const usableWidth = Math.max(layer.fontSize, layer.width - layer.padding * 2 - gutterWidth);
  const maximumCharacters = Math.max(1, Math.floor(usableWidth / (layer.fontSize * 0.62)));
  const highlighted = new Set(layer.highlightedLines);
  const lines = logicalLines.flatMap((line, index) =>
    wrapTokens(tokenizeLine(line, layer.language), maximumCharacters).map((tokens, wrappedIndex) => ({
      tokens,
      logicalLineNumber: index + 1,
      showLineNumber: wrappedIndex === 0,
      highlighted: highlighted.has(index + 1),
    })),
  );
  const maximumLines = Math.max(1, Math.floor((layer.height - layer.padding * 2) / lineAdvance));

  return {
    lines: lines.slice(0, maximumLines),
    lineAdvance,
    gutterWidth,
    maximumCharacters,
  };
}
