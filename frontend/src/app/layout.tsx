import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "TaxEase | Smart Tax Assessment for Nigerians",
  description: "AI-powered tax intake and assessment platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans min-h-screen flex flex-col`}>
        {/* Simple Navbar Shell */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                TE
              </div>
              <span className="font-space font-semibold text-lg tracking-tight">TaxEase</span>
            </div>
            <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <a href="/login" className="hover:text-foreground transition-colors">Login</a>
            </nav>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        
        <footer className="border-t bg-white mt-auto py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TaxEase. Built for everyday Nigerians.
          </div>
        </footer>
      </body>
    </html>
  );
}
