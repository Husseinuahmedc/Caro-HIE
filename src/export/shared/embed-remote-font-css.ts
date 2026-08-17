import { blobToDataUrl } from "./blob-to-data-url";

const FONT_FILE_PATTERN = /url\((?:"|')?(https:\/\/fonts\.gstatic\.com\/[^)"']+)(?:"|')?\)/g;
const embeddedStylesheetCache = new Map<string, Promise<string>>();

export function collectRemoteFontFileUrls(stylesheet: string): string[] {
  return [...new Set([...stylesheet.matchAll(FONT_FILE_PATTERN)].map((match) => match[1]).filter((url): url is string => Boolean(url)))];
}

export function replaceRemoteFontFileUrls(stylesheet: string, replacements: ReadonlyMap<string, string>): string {
  let embedded = stylesheet;
  for (const [url, dataUrl] of replacements) embedded = embedded.replaceAll(url, dataUrl);
  return embedded;
}

async function fetchEmbeddedStylesheet(stylesheetUrl: string): Promise<string> {
  const stylesheetResponse = await fetch(stylesheetUrl);
  if (!stylesheetResponse.ok) throw new Error(`Failed to load Google Fonts stylesheet: ${stylesheetUrl}`);
  const stylesheet = await stylesheetResponse.text();
  const fontUrls = collectRemoteFontFileUrls(stylesheet);
  const files = await Promise.all(fontUrls.map(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load Google Fonts file: ${url}`);
    return [url, await blobToDataUrl(await response.blob())] as const;
  }));
  return replaceRemoteFontFileUrls(stylesheet, new Map(files));
}

export function embedRemoteFontStylesheet(stylesheetUrl: string): Promise<string> {
  const cached = embeddedStylesheetCache.get(stylesheetUrl);
  if (cached) return cached;
  const pending = fetchEmbeddedStylesheet(stylesheetUrl).catch((error: unknown) => {
    embeddedStylesheetCache.delete(stylesheetUrl);
    throw error;
  });
  embeddedStylesheetCache.set(stylesheetUrl, pending);
  return pending;
}
