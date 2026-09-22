"use client";
import { useEffect, useState } from "react";

const text = ["C", "T", " ", "H", "U", "B"];

export default function CTText() {
  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay((prev) => prev + text[index]);
      setIndex((prev) => prev + 1);
    }, 300);

    if (index === text.length) {
      setTimeout(() => {
        setDisplay("");
        setIndex(0);
      }, 2000);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [index]);

  return (
    <span
      className="mt-3 text-5xl md:text-6xl lg:text-7xl font-extrabold
      bg-gradient-to-r from-green-400 via-cyan-400 to-emerald-700
      bg-clip-text text-transparent"
      style={{ textShadow: "0 0 35px rgba(34,197,94,0.45)" }}
    >
      {display}
    </span>
  );
}
