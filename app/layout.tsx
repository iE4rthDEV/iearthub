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

// Apply the saved theme before rendering the page to avoid a flash of the wrong theme.
const initializeTheme = `
  (() => {
    let theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    try {
      const savedTheme = JSON.parse(localStorage.getItem("hub.theme"));
      if (savedTheme === "light" || savedTheme === "dark") {
        theme = savedTheme;
      }
    } catch {
      // Use the system theme when the saved setting cannot be read.
    }

    document.documentElement.dataset.theme = theme;
  })();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initializeTheme }} />
      </head>
      <body className="bg-aurora min-h-screen font-sans leading-relaxed text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
