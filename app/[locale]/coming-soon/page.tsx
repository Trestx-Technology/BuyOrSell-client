"use client";

import React from "react";
import Image from "next/image";

export default function ComingSoonPage() {
  return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-7xl aspect-[1280/832] rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                          src="/assets/coming-soon.svg"
                          alt="Coming Soon to BuyOrSell"
                          fill
                          className="object-cover"
                          priority
                    />
              </div>
    </div>
  );
}
