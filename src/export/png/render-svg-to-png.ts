export async function renderSvgToPng(
  svg: string,
  width: number,
  height: number,
  scale = 1,
): Promise<Blob> {
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(svgBlob);
  let canvas: HTMLCanvasElement | undefined;
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = objectUrl;
    await image.decode();
    canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D is unavailable.");
    context.scale(scale, scale);
    context.drawImage(image, 0, 0, width, height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas!.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error("PNG encoding failed.")),
        "image/png",
      );
    });
  } finally {
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
    }
    URL.revokeObjectURL(objectUrl);
  }
}
