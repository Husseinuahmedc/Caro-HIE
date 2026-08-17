import { describe, expect, it } from "vitest";

import { collectRemoteFontFileUrls, replaceRemoteFontFileUrls } from "@/export/shared/embed-remote-font-css";

describe("remote Google Fonts export", () => {
  const stylesheet = `
    @font-face {
      font-family: 'Cairo';
      font-weight: 400;
      src: url(https://fonts.gstatic.com/s/cairo/v1/regular.woff2) format('woff2');
    }
    @font-face {
      font-family: 'Cairo';
      font-weight: 700;
      src: url('https://fonts.gstatic.com/s/cairo/v1/bold.woff2') format('woff2');
    }
  `;

  it("collects unique Google font files", () => {
    expect(collectRemoteFontFileUrls(`${stylesheet}${stylesheet}`)).toEqual([
      "https://fonts.gstatic.com/s/cairo/v1/regular.woff2",
      "https://fonts.gstatic.com/s/cairo/v1/bold.woff2",
    ]);
  });

  it("replaces remote files with portable data URLs", () => {
    const result = replaceRemoteFontFileUrls(stylesheet, new Map([
      ["https://fonts.gstatic.com/s/cairo/v1/regular.woff2", "data:font/woff2;base64,regular"],
      ["https://fonts.gstatic.com/s/cairo/v1/bold.woff2", "data:font/woff2;base64,bold"],
    ]));

    expect(result).not.toContain("fonts.gstatic.com");
    expect(result).toContain("data:font/woff2;base64,regular");
    expect(result).toContain("data:font/woff2;base64,bold");
  });
});
