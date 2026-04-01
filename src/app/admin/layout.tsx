"use client";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Sidebar />

      <main className="ml-64 flex-1 p-6 bg-transparent">
        {children}
      </main>
    </div>
  );
}