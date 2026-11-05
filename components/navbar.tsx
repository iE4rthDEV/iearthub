import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="mt-3 xl:sticky xl:top-3 xl:z-20">
      <nav
        className="glass flex h-14 items-center gap-2 rounded-xl bg-solid/95 pr-2 pl-3.5"
        aria-label="หลัก"
      >
        <Link
          href="/"
          aria-label="iEartHub หน้าแรก"
          className="mr-auto flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight"
        >
          <Image src="/icon.svg" width={36} height={36} alt="" unoptimized />
          <span>iEart<span className="text-brand">Hub</span></span>
        </Link>
      </nav>
    </header>
  );
}
