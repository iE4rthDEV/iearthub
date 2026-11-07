import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    // The width classes sit on the sticky header itself: wrapping it in a container div would end the sticky effect.
    <header className="page-container mt-3 sm:mt-4 xl:sticky xl:top-4 xl:z-20">
      <nav
        className="glass flex min-h-14 items-center gap-2 rounded-xl bg-solid/95 px-3 py-2 sm:px-4"
        aria-label="หลัก"
      >
        <Link
          href="/"
          aria-label="iEartHub หน้าแรก"
          className="mr-auto flex min-h-11 min-w-0 items-center gap-2.5 font-display text-lg font-extrabold tracking-tight"
        >
          <Image src="/icon.svg" width={36} height={36} alt="" className="shrink-0" unoptimized />
          <span>iEart<span className="text-brand">Hub</span></span>
        </Link>
      </nav>
    </header>
  );
}
