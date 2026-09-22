import * as React from "react";

export function Input({ className, ...props }) {
  return (
    <input
      className={`
        w-full h-11 px-4 rounded-xl border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-green-500
        ${className}
      `}
      {...props}
    />
  );
}
