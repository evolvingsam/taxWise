import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Phone, ChevronRight } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "TaxWise | Intelligent Tax Filing & Financial Identity",
  description: "AI-powered tax intake, assessment, and Aegis Score for every Nigerian.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans min-h-screen flex flex-col bg-white text-brand-dark antialiased`}>
        {children}
      </body>
    </html>
  );
}
