import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";
import "./print.css";

export const metadata: Metadata = {
  title: "TransitOps | Smart Transport Operations",
  description: "End-to-end transport operations platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={session ? "flex" : ""}>
        <div className="aurora-bg" />
        {session && <Sidebar userRole={session.role} />}
        <main className={`w-full ${session ? 'p-6' : ''}`} style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
          {session && (
            <div className="flex justify-end mb-4">
              <ThemeToggle />
            </div>
          )}
          {children}
        </main>
      </body>
    </html>
  );
}
