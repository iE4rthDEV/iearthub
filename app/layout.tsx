import type { Metadata } from "next";
import "@fontsource/noto-sans-thai-looped/400.css";
import "@fontsource/noto-sans-thai-looped/500.css";
import "@fontsource/noto-sans-thai-looped/600.css";
import "@fontsource/noto-sans-thai-looped/700.css";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "iEartHub",
  description: "iEartHub — your tool hearth · ศูนย์รวมเครื่องมือของ iEarth",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th">
      <body className="bg-aurora min-h-screen font-sans leading-relaxed text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
