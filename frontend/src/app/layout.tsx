import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased`}>
        {/* Simple Navbar Shell */}
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                TE
              </div>
              <span className="font-space font-bold text-xl tracking-tight text-slate-900">TaxEase</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/login" className="text-slate-600 hover:text-blue-600 transition-colors">Log in</Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Get Started</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        <footer className="border-t bg-white mt-auto py-8">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-slate-700">TaxEase</span> &copy; {new Date().getFullYear()}
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
              <a href="#" className="hover:text-blue-600">Contact Support</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
