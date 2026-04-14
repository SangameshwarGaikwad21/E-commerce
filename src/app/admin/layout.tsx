"use client";

import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <div className="min-h-screen bg-black">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="p-4 md:p-6 md:ml-64">
        <div className="w-full">
          {children}
        </div>
      </main>

    </div>
  );
}