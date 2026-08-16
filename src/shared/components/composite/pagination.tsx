import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface PaginationProps {
  /** Zero-indexed, matching every list endpoint's `page` field. */
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
  className?: string;
}

/**
 * Deliberately takes raw page/totalPages rather than an array of items,
 * so it composes identically across ArticleList, SearchResultsList,
 * BookmarkGrid, MarketPriceTable, etc. — every list page in the spec
 * uses the same {content, totalElements, totalPages, page} envelope.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const windowStart = Math.max(0, Math.min(page - 2, totalPages - 5));
  const windowEnd = Math.min(totalPages, windowStart + 5);
  const pageNumbers = Array.from(
    { length: windowEnd - windowStart },
    (_, i) => windowStart + i,
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        variant="outline"
        size="icon"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </Button>

      {windowStart > 0 && (
        <>
          <PageButton pageNumber={0} isActive={false} onClick={onPageChange} />
          {windowStart > 1 && <span className="text-muted-foreground px-1">…</span>}
        </>
      )}

      {pageNumbers.map((pageNumber) => (
        <PageButton
          key={pageNumber}
          pageNumber={pageNumber}
          isActive={pageNumber === page}
          onClick={onPageChange}
        />
      ))}

      {windowEnd < totalPages && (
        <>
          {windowEnd < totalPages - 1 && (
            <span className="text-muted-foreground px-1">…</span>
          )}
          <PageButton
            pageNumber={totalPages - 1}
            isActive={false}
            onClick={onPageChange}
          />
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </Button>
    </nav>
  );
}

function PageButton({
  pageNumber,
  isActive,
  onClick,
}: {
  pageNumber: number;
  isActive: boolean;
  onClick: (page: number) => void;
}) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      aria-current={isActive ? "page" : undefined}
      aria-label={`Page ${pageNumber + 1}`}
      onClick={() => onClick(pageNumber)}
    >
      {pageNumber + 1}
    </Button>
  );
}
