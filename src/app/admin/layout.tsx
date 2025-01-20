"use client";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content area */}
      <main
        className={`flex-1 py-8  mt-12 md:mt-0 ${
          isOpen ? "md:ml-[280px]" : "md:ml-16"
        } overflow-y-auto`}
      >
        {children}
      </main>
    </div>
  );
}
