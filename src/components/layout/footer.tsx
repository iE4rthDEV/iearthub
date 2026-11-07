import { CodeXml, MessageCircle } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="daisy-footer mt-10 border-t border-line bg-solid text-ink sm:mt-12">
      <div className="page-container grid grid-cols-1 items-center justify-items-center gap-x-6 gap-y-6 py-8 text-center md:grid-cols-[1fr_auto_1fr] md:py-10 lg:gap-x-10">
        <div className="grid min-w-0 justify-items-center gap-3 md:justify-self-start md:justify-items-start">
          <div className="flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight">
            <Image src="/icon.svg" width={40} height={40} alt="" unoptimized />
            <span>iEart<span className="text-brand">Hub</span></span>
          </div>
          <small className="text-xs text-ink-3">© {new Date().getUTCFullYear()} iEartHub</small>
        </div>

        <div className="grid min-w-0 gap-3 place-self-center">
          <p className="text-sm text-ink-2">ศูนย์รวมเครื่องมือของ iEarthDEV</p>
        </div>

        <nav aria-label="ช่องทางติดต่อ" className="grid min-w-0 justify-items-center md:justify-self-end md:justify-items-end">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink-2 md:flex-col md:items-end md:gap-y-1">
            <li>
              <a href="https://github.com/iE4rthDEV" className="inline-flex min-h-11 items-center gap-2 rounded-sm font-medium hover:text-brand focus-visible:outline-brand">
                <CodeXml className="size-4 text-brand" aria-hidden="true" />
                GitHub
              </a>
            </li>
            <li>
              <a href="https://discord.com/users/239962549871837184" className="inline-flex min-h-11 items-center gap-2 rounded-sm font-medium hover:text-brand focus-visible:outline-brand">
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
