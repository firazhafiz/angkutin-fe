"use client";

import React from "react";
import { Bell, Search } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const [greeting, setGreeting] = React.useState("");

  React.useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 11) setGreeting("Selamat Pagi");
    else if (hours >= 11 && hours < 15) setGreeting("Selamat Siang");
    else if (hours >= 15 && hours < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
  }, []);

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-20 bg-white/60 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
      <div className="flex items-center gap-4 md:hidden">
        <Image
          src="/logo/angkutin_tosca.png"
          alt="Logo Angkutin"
          width={100}
          height={100}
        />
      </div>

      {/* Breadcrumb Menu */}
      <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        <span className="hover:text-primary transition-colors cursor-pointer">
          {segments[1] || "User"}
        </span>
        {segments.length > 2 && (
          <>
            <span className="text-gray-300">/</span>
            <span className="text-dark">
              {segments[segments.length - 1].replace(/-/g, " ")}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center gap-3 pl-2 md:pl-0 border-l border-gray-100 md:border-none">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-dark leading-tight">
              Muhammad Ilham
            </p>
            <p className="text-xs font-medium text-gray-400 leading-tight">
              {greeting}!
            </p>
          </div>
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary/10 border-2 border-white ring-1 ring-gray-100 overflow-hidden shadow-sm">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ilham"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
