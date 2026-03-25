"use client";

import { Shield, TrendingUp, Sparkles, Building2, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AegisVisionPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-24 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-dark text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">
            <Sparkles className="w-3 h-3 fill-brand-gold" /> The Aegis Protocol
          </div>
          <h1 className="font-space text-5xl md:text-7xl font-black tracking-tighter text-brand-dark leading-none">
            FROM COMPLIANCE <br/>
            <span className="text-brand-gold">TO WEALTH BUILDING.</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
            We aren't just filing taxes. We are building the first-of-its-kind digital credit rating for every Nigerian. 
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="bg-[#FDFDFD] p-12 rounded-[3.5rem] border border-gray-100 space-y-6 group hover:shadow-xl transition-all">
            <div className="w-16 h-16 rounded-2xl bg-brand-dark text-brand-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black font-space tracking-tight text-brand-dark">The Verified Identity</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              By linking your NIN and filing even zero-tax returns, you prove your fiscal existence. This is the foundation of the Aegis Score.
            </p>
          </div>
          <div className="bg-brand-dark p-12 rounded-[3.5rem] text-white space-y-6 group hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <TrendingUp className="w-40 h-40" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-brand-gold text-brand-dark flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black font-space tracking-tight">The Credit Rating</h3>
            <p className="text-gray-400 leading-relaxed font-medium">
              Your Aegis Score is calculated using 20+ fiscal data points. Banks use this verified score to approve loans in seconds, not weeks.
            </p>
          </div>
        </div>

        <div className="bg-white border-4 border-brand-gold/20 p-12 rounded-[4rem] text-center max-w-2xl mx-auto shadow-sm">
          <Building2 className="w-12 h-12 text-brand-gold mx-auto mb-6" />
          <h3 className="text-2xl font-black font-space tracking-tight text-brand-dark mb-4 uppercase tracking-widest">Partner Banks</h3>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.4em] mb-8">Accessing the shadow economy</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
            <span className="font-black text-xl">ACCESS</span>
            <span className="font-black text-xl">ZENITH</span>
            <span className="font-black text-xl">UBA</span>
            <span className="font-black text-xl">GTCO</span>
          </div>
        </div>

        <div className="mt-24 text-center">
          <Link href="/signup">
            <Button className="bg-brand-dark text-white px-12 py-8 rounded-2xl font-bold uppercase tracking-widest text-sm hover:translate-y-[-4px] transition-all shadow-md flex items-center gap-3 mx-auto">
              Build Your Score <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
