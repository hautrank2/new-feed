"use client";
import { useState } from "react";
import Image from "next/image";

type ImageGridProps = {
  imgs: string[];
  objectFit?: "cover" | "contain";
  cellSize?: number; // chiều cao cho từng ô grid
};

export default function ImageGrid({
  imgs,
  objectFit = "cover",
  cellSize = 200,
}: ImageGridProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (!imgs || imgs.length === 0) return null;

  const displayImgs = imgs.slice(0, 4);
  const moreCount = imgs.length - 4;

  return (
    <div data-testid="image-grid" className="image-grid">
      {/* GRID */}
      <div
        className={`grid gap-1 ${
          displayImgs.length === 1
            ? "grid-cols-1"
            : displayImgs.length === 2
            ? "grid-cols-2"
            : "grid-cols-2"
        }`}
      >
        {displayImgs.map((src, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer overflow-hidden rounded-md"
            style={{ height: cellSize }}
            onClick={() => setSelected(src)}
          >
            <Image
              src={src}
              alt={`img-${idx}`}
              fill={true}
              sizes={`${cellSize}px`}
              style={{ objectFit }}
            />
            {idx === 3 && moreCount > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xl font-bold">
                +{moreCount}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelected(null)}
        >
          <div className="relative w-[90vw] h-[90vh]">
            <Image
              src={selected}
              alt="preview"
              fill
              sizes="90vw"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
