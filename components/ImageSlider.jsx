"use client";
import { useState } from "react";

export default function ImageSlider({ images = [] }) {
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return (
      <img
        src="/placeholder.png"
        className="w-full md:w-44 h-32 object-cover rounded-lg"
      />
    );
  }

  const next = () =>
    setIndex((prev) => (prev + 1) % images.length);

  const prev = () =>
    setIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );

  return (
    <div className="relative w-full md:w-44 h-32">
      <img
        src={images[index]}
        className="w-full h-full object-cover rounded-lg"
      />

      {images.length > 1 && (
        <>
          {/* LEFT */}
          <button
            onClick={prev}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 text-white w-6 h-6 rounded-full text-xs"
          >
            ‹
          </button>

          {/* RIGHT */}
          <button
            onClick={next}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 text-white w-6 h-6 rounded-full text-xs"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}