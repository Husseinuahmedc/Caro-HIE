function wrapParagraph(paragraph: string, maximumCharacters: number): string[] {
  if (!paragraph) return [""];
  const lines: string[] = [];
  let current = "";
  for (const word of paragraph.split(/\s+/)) {
    if (!word) continue;
    if (word.length > maximumCharacters) {
      if (current) lines.push(current);
      for (let offset = 0; offset < word.length; offset += maximumCharacters) {
        lines.push(word.slice(offset, offset + maximumCharacters));
      }
      current = "";
    } else if (!current) {
      current = word;
    } else if (`${current} ${word}`.length <= maximumCharacters) {
      current = `${current} ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

export function wrapText(content: string, maximumCharacters: number): string[] {
  return content
    .split("\n")
    .flatMap((paragraph) => wrapParagraph(paragraph, maximumCharacters));
}
