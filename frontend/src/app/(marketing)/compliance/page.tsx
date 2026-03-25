"use client";

import { FileText, CheckCircle2, AlertCircle, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompliancePage() {
  const reforms = [
    {
      title: "Low-Income Exemption",
      desc: "Total tax holiday for individuals earning below the updated threshold. No more monthly PAYE or direct assessments.",
      logic: "Automatic detection via TaxAI Intake"
    },
    {
      title: "Artisan Simplified Returns",
      desc: "Special simplified filing requirements for informal sector workers including traders, transporters, and craftsmen.",
      logic: "Conversational intake maps to LIRS standards"
    },
    {
      title: "Corporate PAYE Brackets",
      desc: "Progressive tax brackets ranging from 0% to 25% for high-income earners and executives.",
      logic: "Calculated instantly by Universal Tax Engine"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-24 space-y-6 animate-fade-in-up opacity-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold text-brand-dark text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            2026 Fiscal Policy
          </div>
          <h1 className="font-space text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-brand-dark leading-[1.1] md:leading-[0.9]">
            UNDERSTANDING <br className="hidden sm:block" />
            <span className="text-gray-300">THE REFORMS.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto mt-6">
            The new 2026 reforms bring total exemptions for artisans and small businesses making under ₦800k. We ensure you get every benefit you're legally entitled to.
          </p>
        </div>

        {/* The 3 Core Reforms Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {reforms.map((reform, i) => (
            <div key={i} className="bg-white p-6 md:p-10 rounded-4xl md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-start hover:border-brand-gold hover:shadow-md transition-all group animate-fade-in-up opacity-0" style={{ animationDelay: `${200 + i * 150}ms` }}>
              <div className="w-14 h-14 rounded-2xl bg-brand-dark text-brand-gold flex items-center justify-center shrink-0 mb-8 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-space tracking-tight text-brand-dark mb-4">{reform.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">{reform.desc}</p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-gold uppercase tracking-widest bg-brand-gold/5 px-3 py-2 rounded-xl w-full">
                <CheckCircle2 className="w-3 h-3 shrink-0" /> <span className="truncate">{reform.logic}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Value Props Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="bg-brand-dark text-white p-8 md:p-10 lg:p-14 rounded-[2.5rem] md:rounded-[3rem] flex flex-col justify-center relative overflow-hidden animate-slide-in-left [animation-delay:600ms] opacity-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
              <AlertCircle className="w-7 h-7 text-brand-gold" />
            </div>
            <h4 className="text-3xl font-black font-space tracking-tight mb-4 relative z-10">Avoid Extortion</h4>
            <p className="text-gray-400 text-base leading-relaxed mb-10 relative z-10 max-w-md">
              Many informal workers are extorted because they don't know their official exemption status. TaxWise provides a <strong className="text-white">Verified Exemption Certificate</strong> to legally protect you on the streets.
            </p>
            <Link href="/signup" className="relative z-10 w-fit">
              <button className="bg-brand-gold text-brand-dark font-black uppercase text-xs tracking-widest px-8 py-4 rounded-xl hover:bg-white transition-all shadow-lg hover:-translate-y-1">
                Check Eligibility Now
              </button>
            </Link>
          </div>

          <div className="bg-white border-2 border-brand-dark/5 p-8 md:p-10 lg:p-14 rounded-[2.5rem] md:rounded-[3rem] flex flex-col justify-center items-start group hover:border-brand-gold/20 transition-colors animate-slide-in-right [animation-delay:700ms] opacity-0">
            <div className="w-14 h-14 rounded-2xl bg-brand-dark/5 flex items-center justify-center mb-8 group-hover:bg-brand-gold/10 transition-colors">
              <Shield className="w-7 h-7 text-brand-gold" />
            </div>
            <h4 className="text-3xl font-black font-space tracking-tight text-brand-dark mb-4">Federal Compliance</h4>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              Rest perfectly assured. The TaxWise Artificial Intelligence engine is rigorously aligned with the Federal Inland Revenue Service (FIRS) 2026 guidelines for digitalized tax collection across all 36 states.
            </p>
            <div className="w-full h-1 bg-linear-to-r from-brand-gold to-transparent mt-auto opacity-50"></div>
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="border-t border-gray-100 pt-20 flex flex-col items-center animate-fade-in-up [animation-delay:800ms] opacity-0">
          <div className="text-center max-w-2xl mb-10">
            <h2 className="text-4xl font-black font-space tracking-tight text-brand-dark mb-4">READY TO FILE?</h2>
            <p className="text-lg text-gray-500 font-medium">Join 50,000+ Nigerians who have already digitized their returns and secured their peace of mind.</p>
          </div>
          <Link href="/intake">
            <button className="bg-brand-dark text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-brand-gold hover:text-brand-dark transition-all shadow-xl hover:-translate-y-1">
              Start Your Free Intake <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
