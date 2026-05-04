"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthWrapperProps {
  children: React.ReactNode;
  leftTitle: string;
  leftSubtitle: string;
}

export default function AuthWrapper({
  children,
  leftTitle,
  leftSubtitle,
}: AuthWrapperProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-0 md:p-8">
      <div className="rounded-3xl overflow-hidden w-full flex flex-col md:flex-row min-h-screen md:min-h-[600px]">
        {/* Left Side: Gradient Card (Hidden on mobile) */}
        <div className="hidden md:flex w-full md:w-[45%] p-8 md:p-12 relative flex-col justify-between overflow-hidden m-4 rounded-3xl">
          {/* Background Gradient Image */}
          <Image
            src="/images/gradient.jpg"
            alt="Gradient Background"
            fill
            className="object-cover z-0"
            priority
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="w-16 h-16 flex items-center justify-center mb-12">
              <Link href="/">
                <Image
                  src="/logo/trash-white.svg"
                  alt="Logo White"
                  width={48}
                  height={48}
                />
              </Link>
            </div>
          </div>

          <div className="relative z-10 mb-8">
            <p className="text-white text-base font-medium mb-12 opacity-90">
              {leftSubtitle}
            </p>
            <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight">
              {leftTitle}
            </h1>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="w-full md:w-[55%] p-6 md:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto flex flex-col">
            <div className="mb-6">
              <Link href="/">
                <Image
                  src="/logo/trash-green.svg"
                  alt="Logo Green"
                  width={32}
                  height={32}
                />
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
