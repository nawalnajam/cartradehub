"use client";

import Link from "next/link";

export default function SignInButton() {
  return (
    <Link href="/auth">
      {/* OUTER GRADIENT */}
      <div
        className="
          group p-[3px] rounded-full
          bg-gradient-to-br from-green-400 to-blue-500
          animated-gradient-border
          transition-all duration-300
        "
      >
        {/* INNER CONTENT */}
        <div
          className="
            flex items-center justify-center
            min-w-[90px] h-10 px-4
            bg-white rounded-full font-bold
            transition-all duration-300
            group-hover:bg-green-600
          "
        >
          <span className="text-green-700 group-hover:text-white text-sm">
            Sign In
          </span>
        </div>
      </div>
    </Link>
  );
}
