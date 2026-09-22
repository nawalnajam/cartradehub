"use client";

import { useRouter } from "next/navigation";

export default function SellButton() {
  const router = useRouter();

  const handleClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/sell/add-car");
    } else {
      router.push("/signin");
    }
  };

  return (
    <button onClick={handleClick}>
      <div
        className="
          group p-[3px] rounded-full
          bg-gradient-to-br from-green-400 to-blue-500
          animated-gradient-border
          hover:from-green-600 hover:to-green-600
          transition-all duration-300
        "
      >
        <div
          className="
            flex items-center gap-2 px-5 py-2
            bg-white rounded-full font-bold text-sm
            group-hover:bg-green-600
            transition-all duration-300
          "
        >
          <span className="text-green-700 group-hover:text-white">+</span>
          <span className="text-green-700 group-hover:text-white">SELL</span>
        </div>
      </div>
    </button>
  );
}