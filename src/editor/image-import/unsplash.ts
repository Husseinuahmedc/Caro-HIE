const UNSPLASH_IMAGE_HOST = "images.unsplash.com";

export function getUnsplashImageUrl(value: string): URL {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("أدخل رابط صورة صالحاً يبدأ بـ https://images.unsplash.com/");
  }

  if (url.protocol !== "https:" || url.hostname !== UNSPLASH_IMAGE_HOST) {
    throw new Error("هذا رابط صفحة من Unsplash. استخدم Copy Image Address لنسخ عنوان الصورة المباشر.");
  }

  url.searchParams.set("auto", url.searchParams.get("auto") ?? "format");
  url.searchParams.set("fit", url.searchParams.get("fit") ?? "crop");
  url.searchParams.set("w", url.searchParams.get("w") ?? "1600");
  url.searchParams.set("q", url.searchParams.get("q") ?? "80");
  if (!url.searchParams.has("fm")) url.searchParams.set("fm", "jpg");
  return url;
}

export async function fetchUnsplashImage(value: string): Promise<{ blob: Blob; name: string }> {
  const url = getUnsplashImageUrl(value);
  let response: Response;
  try {
    response = await fetch(url, { mode: "cors" });
  } catch {
    throw new Error("تعذر الاتصال بالصورة. تحقق من اتصالك ومن صلاحية الرابط.");
  }

  if (!response.ok) throw new Error("تعذر جلب الصورة من Unsplash. تحقق من الرابط وحاول مجدداً.");

  const source = await response.blob();
  if (source.type !== "image/jpeg" && source.type !== "image/png") {
    throw new Error("صيغة الصورة غير مدعومة. استخدم صورة JPEG أو PNG من Unsplash.");
  }

  return { blob: new Blob([source], { type: source.type }), name: `unsplash-${Date.now()}.${source.type === "image/png" ? "png" : "jpg"}` };
}