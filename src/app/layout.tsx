import type { Metadata } from "next";
import "@fontsource/noto-sans-thai-looped/400.css";
import "@fontsource/noto-sans-thai-looped/500.css";
import "@fontsource/noto-sans-thai-looped/600.css";
import "@fontsource/noto-sans-thai-looped/700.css";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: {
    default: "iEartHub",
    template: "%s | iEartHub",
  },
  description: "iEartHub — your tool hearth · ศูนย์รวมเครื่องมือของ iEarth",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th">
      <body className="bg-aurora min-h-dvh font-sans leading-relaxed text-ink antialiased">
        <div className="flex min-h-dvh min-w-0 flex-col">
          <Navbar />
          <div className="min-w-0 flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
