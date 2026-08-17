import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "./globals.css";

const applicationFont = localFont({
  src: "../fonts/ui/noto-sans-arabic.woff2",
  variable: "--font-application",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Carousel Studio — محرر كاروسيل عربي",
  description: "أنشئ كاروسيلات عربية واضحة، عدّلها بصرياً، وصدّرها بالصيغ التي تحتاجها.",
  applicationName: "Carousel Studio",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f0eee9",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${applicationFont.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
