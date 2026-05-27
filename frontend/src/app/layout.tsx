import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import MobileNav from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "VedaAI | AI Assessment Creator for Educators",
  description: "Upload study materials, configure blueprints, generate structured AI question papers, and export professional PDFs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex-1 flex flex-col md:ml-[220px]">
            {/* Top Navigation */}
            <TopNav />

            {/* Page content */}
            <main className="flex-1 px-4 md:px-8 py-6 pb-20 md:pb-8 pt-14 md:pt-6">
              {children}
            </main>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </body>
    </html>
  );
}
