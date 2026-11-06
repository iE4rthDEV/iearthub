import type { Metadata } from "next";
import "@fontsource/noto-sans-thai-looped/400.css";
import "@fontsource/noto-sans-thai-looped/500.css";
import "@fontsource/noto-sans-thai-looped/600.css";
import "@fontsource/noto-sans-thai-looped/700.css";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

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
      <body className="bg-aurora min-h-screen font-sans leading-relaxed text-ink antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          {/* At least one viewport tall, so every page scrolls and the scrollbar always covers the reserved gutter. */}
          <div className="min-h-dvh">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
