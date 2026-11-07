import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type BentoGridProps = ComponentPropsWithoutRef<"div">;

type BentoCardProps = ComponentPropsWithoutRef<"article"> & {
  name: string;
  description: string;
  Icon: ElementType;
  background: ReactNode;
  cta: ReactNode;
  cardLink?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  featured?: boolean;
};

export function BentoGrid({ className, ...props }: BentoGridProps) {
  return <div className={cn("grid w-full auto-rows-auto grid-cols-1 gap-3", className)} {...props} />;
}

export function BentoCard({
  name,
  description,
  Icon,
  background,
  cta,
  cardLink,
  action,
  children,
  featured = false,
  className,
  ...props
}: BentoCardProps) {
  return (
    <article
      className={cn(
        "group relative isolate flex min-h-56 min-w-0 flex-col justify-end overflow-hidden rounded-2xl border shadow-glass transition-[border-color,box-shadow] duration-300 hover:border-brand hover:shadow-lift focus-within:border-brand motion-reduce:transition-none",
        featured ? "bg-brand-hero border-transparent text-white" : "border-line bg-solid text-ink",
        className,
      )}
      {...props}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">{background}</div>
      <div className="p-5 pb-16 sm:p-6 sm:pb-16">
        <div className="pointer-events-none flex flex-col gap-2 transition-transform duration-300 lg:pointer-fine:group-hover:-translate-y-4 lg:pointer-fine:group-focus-within:-translate-y-4 motion-reduce:transform-none motion-reduce:transition-none">
          <Icon
            aria-hidden="true"
            className={cn(
              "mb-1 size-11 origin-left transition-transform duration-300 group-hover:scale-75 group-focus-within:scale-75 motion-reduce:transform-none motion-reduce:transition-none",
              featured ? "text-white" : "text-brand",
            )}
          />
          <h3 className={cn("font-semibold wrap-anywhere", featured ? "text-xl sm:text-2xl" : "text-lg")}>{name}</h3>
          <p className={cn("text-sm wrap-anywhere", featured ? "text-white/85" : "text-ink-2")}>{description}</p>
          {children}
        </div>
      </div>
      <div className={cn(
        "absolute inset-x-0 bottom-0 z-10 flex min-h-14 items-center px-5 pb-3 transition-[transform,opacity] duration-300 sm:px-6 lg:pointer-fine:translate-y-10 lg:pointer-fine:opacity-0 lg:pointer-fine:group-hover:translate-y-0 lg:pointer-fine:group-hover:opacity-100 lg:pointer-fine:group-focus-within:translate-y-0 lg:pointer-fine:group-focus-within:opacity-100 motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none",
        cardLink && "pointer-events-none",
      )}>
        {cta}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 transition-colors duration-300 group-hover:bg-brand/3 group-focus-within:bg-brand/3 motion-reduce:transition-none" />
      {cardLink}
      {action}
    </article>
  );
}
