import katex from 'katex';

interface KatexToken {
  type: 'katex';
  raw: string;
  text: string;
  displayMode: boolean;
}

const tokenizerRules = [
  // Block-level
  { regex: /^\\\[((?:[\s\S]*?))\\\]/, displayMode: true }, // \[ ... \]
  { regex: /^\$\$((?:[\s\S]*?))\$\$/, displayMode: true }, // $$ ... $$

  // Inline-level
  { regex: /^\\\(((?:[\s\S]*?))\\\)/, displayMode: false }, // \( ... \)
  { regex: /^\$((?:[\s\S]*?))\$/, displayMode: false },    // $ ... $
];

export const katexExtension = {
  name: 'katex',
  level: 'inline' as const,
  start(src: string) {
    const match = src.match(/\$|\\\[|\\\(/);
    return match ? match.index : -1;
  },
  tokenizer(src: string): KatexToken | undefined {
    for (const rule of tokenizerRules) {
      const match = src.match(rule.regex);
      if (match) {
        return {
          type: 'katex',
          raw: match[0],
          text: match[1].trim(),
          displayMode: rule.displayMode,
        };
      }
    }
    return undefined;
  },
  renderer(token: KatexToken) {
    try {
      return katex.renderToString(token.text, {
        displayMode: token.displayMode,
        throwOnError: false,
      });
    } catch (e) {
      return `<span style="color: red;">${(e as Error).message}</span>`;
    }
  },
}; 