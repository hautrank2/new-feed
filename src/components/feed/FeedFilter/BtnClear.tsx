import { X } from "lucide-react";
import { Button } from "~/components/ui/button";

// Nút clear tái sử dụng
export function ClearIconButton({
  onClick,
  disabled,
  title = "Clear",
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      aria-label={title}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation(); // tránh mở Popover/Select
        onClick(e);
      }}
      disabled={disabled}
      className="shrink-0"
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
