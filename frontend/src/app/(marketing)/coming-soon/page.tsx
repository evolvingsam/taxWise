"use client";

import { Hourglass, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-white">
      <div className="w-24 h-24 rounded-3xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-10 animate-bounce" style={{ animationDuration: '3s' }}>
        <Hourglass className="w-10 h-10" />
      </div>

      <div className="space-y-6 max-w-xl animate-fade-in-up opacity-0 [animation-delay:200ms]">
        <h1 className="font-space text-5xl font-black tracking-tighter text-brand-dark leading-none uppercase">
          COMING <span className="text-brand-gold">SOON</span>
        </h1>
        <p className="text-lg text-gray-400 font-medium leading-relaxed">
          The TaxWise team is working hard to bring this feature to life as part of our mission to digitize the Nigerian financial landscape.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-10 justify-center">
          <Link href="/dashboard">
            <Button className="bg-brand-dark text-white px-8 py-6 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-gold hover:text-brand-dark transition-all">
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="px-8 py-6 rounded-2xl font-bold uppercase tracking-widest text-xs border-gray-100">
              Go Home
            </Button>
          </Link>
        </div>
      </div>

      <p className="mt-20 text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em] flex items-center gap-2">
        <Sparkles className="w-3 h-3" /> Part of the 2026 Tax Reform Standard
      </p>
    </div>
  );
}
