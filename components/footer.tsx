import { CodeXml, MessageCircle } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="daisy-footer mt-12 border-t border-line bg-solid text-ink">
      <div className="mx-auto w-full max-w-303 justify-items-center gap-x-10 gap-y-8 px-4 py-12 text-center md:grid-cols-3 md:py-14">
        <div className="grid justify-items-center  gap-4 md:justify-self-start md:justify-items-start">
          <div className="flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight">
            <Image src="/icon.svg" width={40} height={40} alt="" unoptimized />
            <span>iEart<span className="text-brand">Hub</span></span>
          </div>
          <small className="text-xs text-ink-3">© {new Date().getUTCFullYear()} iEartHub</small>
        </div>

        <div className="grid gap-3 place-self-center">
          <p className="text-sm text-ink-2">ศูนย์รวมเครื่องมือของ iEarthDEV</p>
        </div>

        <nav aria-labelledby="footer-links-title" className="grid justify-items-center gap-3 md:justify-self-end md:justify-items-end">
          <ul className="grid justify-items-center gap-3 text-sm text-ink-2 md:justify-items-end">
            <li>
              <a href="https://github.com/iE4rthDEV" className="inline-flex items-center gap-2 font-medium hover:text-brand focus-visible:outline-brand">
                <CodeXml className="size-4 text-brand" aria-hidden="true" />
                GitHub
              </a>
            </li>
            <li>
              <a href="https://discord.com/users/239962549871837184" className="inline-flex items-center gap-2 font-medium hover:text-brand focus-visible:outline-brand">
                <MessageCircle className="size-4 text-brand" aria-hidden="true" />
                Discord
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
