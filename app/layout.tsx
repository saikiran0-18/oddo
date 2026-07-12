import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

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
        {session && <Sidebar userRole={session.role} />}
        <main className={`w-full ${session ? 'p-6' : ''}`} style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
