import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  search?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Поиск...",
  filters,
  className,
}: FilterBarProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-4 flex-wrap", className)}>
      {onSearchChange !== undefined && (
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            className="pl-9"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            data-testid="input-search"
          />
        </div>
      )}
      {filters}
    </div>
  );
}
