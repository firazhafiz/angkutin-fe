"use client";

import React from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import TopBar from "./TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "user" | "courier";
}

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <Sidebar role={role} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Shared TopBar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 p-6 pb-24 md:pb-10">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>

        {/* Mobile Bottom Nav */}
        <BottomNav role={role} />
      </div>
    </div>
  );
}
