"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function usePreviousPathname() {
  const pathname = usePathname();
  const prevRef = useRef<string | null>(null);

  // Giá trị trả về ở render này là "đường dẫn trước đó"
  const previous = prevRef.current;

  useEffect(() => {
    prevRef.current = pathname;
  }, [pathname]);

  return previous; // string | null
}
