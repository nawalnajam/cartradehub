"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/signin");
    }, 1800);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      
      <div className="relative w-100 h-110 animate-logo-zoom">
        <Image
          src="/car-Photoroom.png"
          alt="Car Trade Hub"
          fill
          className="object-contain"
          priority
        />
      </div>

    </div>
  );
}
