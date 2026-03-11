import "./globals.css";
import Sidebar from "@/components/Sidebar";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gradient-to-br from-black via-neutral-950 to-neutral-900 text-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
      </body>
    </html>
  );
}
