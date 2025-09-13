"use client";

import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "~/lib/utils";

export type ToggleHeart = { liked: boolean; count: number };
export function HeartButton({
  liked: initLiked,
  count: initCount,
  onToggleHeart,
  disabled,
}: {
  liked: boolean;
  count: number;
  onToggleHeart: () => Promise<ToggleHeart>;
  disabled: boolean;
}) {
  const [liked, setLiked] = useState(initLiked);
  const [count, setCount] = useState(initCount);
  const inflight = useRef(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (inflight.current || timer.current) return; // chặn spam

    // optimistic update
    setLiked((v) => !v);
    setCount((c) => (liked ? c - 1 : c + 1));

    // debounce: gom click trong 300ms thành 1 request
    timer.current = setTimeout(async () => {
      inflight.current = true;
      try {
        const res = await onToggleHeart();
        setLiked(res.liked);
        setCount(res.count);
      } catch {
        // revert nếu lỗi
        setLiked(initLiked);
        setCount(initCount);
      } finally {
        inflight.current = false;
        timer.current = null;
      }
    }, 300);
  };

  return (
    <Button
      data-testid="heart-btn"
      className={cn("flex-1", liked ? "fill-red-500 text-red-500" : "")}
      variant="ghost"
      onClick={handleClick}
      disabled={disabled}
    >
      <Heart className={liked ? "fill-red-500 text-red-500" : ""} />
      Heart ({count})
    </Button>
  );
}
