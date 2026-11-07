import { Skeleton } from "@/components/ui/skeleton";

// Shown right away while the JSON tool page loads. It mirrors the layout of page.tsx and json-formatter.tsx.
export default function JsonFormatterLoading() {
  return (
    <div className="page-container">
      <main
        role="status"
        aria-label="กำลังโหลดเครื่องมือ"
        className="pt-4 pb-6 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-14"
      >
        <div className="flex min-h-11 items-center">
          <Skeleton className="h-5 w-32" />
        </div>

        <div className="mt-3 mb-5 flex items-start gap-3 sm:mt-4 sm:mb-6 sm:items-center sm:gap-4">
          <Skeleton className="size-11 shrink-0 rounded-xl sm:size-13" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-7 w-48 max-w-full sm:h-9" />
            <Skeleton className="h-4 w-72 max-w-full sm:h-5" />
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-line bg-white shadow-glass">
          <div className="flex items-center gap-3 border-b border-line p-3 sm:p-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="ml-auto h-8 w-28 rounded-full sm:h-10" />
          </div>
          <div className="h-[clamp(12rem,55dvh,40rem)] min-h-48 p-4 sm:min-h-60">
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="flex gap-2 border-t border-line bg-solid p-5 sm:px-4">
            <Skeleton className="h-8 w-20 rounded-full sm:h-10 sm:w-28" />
            <Skeleton className="h-8 w-20 rounded-full sm:h-10 sm:w-28" />
            <Skeleton className="h-8 w-20 rounded-full sm:h-10 sm:w-28" />
          </div>
        </div>
      </main>
    </div>
  );
}
