"use client";

import { FileText, CheckCircle2, AlertCircle, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold text-brand-dark text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            2026 Fiscal Policy
          </div>
          <h1 className="font-space text-5xl font-black tracking-tighter text-brand-dark leading-[0.9]">
            UNDERSTANDING <span className="text-gray-300">THE REFORMS.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            The new 2026 reforms bring total exemptions for artisans and small businesses making under ₦800k. We ensure you get every benefit you're legally entitled to.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 space-y-8">
            {[
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
            ].map((reform, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:border-brand-gold transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-brand-dark text-brand-gold flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black font-space tracking-tight text-brand-dark mb-2">{reform.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{reform.desc}</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-brand-gold uppercase tracking-widest bg-brand-gold/5 px-3 py-1.5 rounded-full w-fit">
                    <CheckCircle2 className="w-3 h-3" /> {reform.logic}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="bg-brand-dark text-white p-10 rounded-[3rem] space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-brand-gold" />
              </div>
              <h4 className="text-xl font-bold tracking-tight">Avoid Extortion</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Many informal workers are extorted because they don't know their official exemption status. TaxWise provides a **Verified Exemption Certificate** to protect you.
              </p>
              <Link href="/signup" className="block pt-4">
                <Button className="w-full bg-brand-gold text-brand-dark font-black uppercase text-xs tracking-widest py-6 rounded-2xl hover:bg-white transition-all">
                  Check Eligibility
                </Button>
              </Link>
            </div>

            <div className="bg-white border-2 border-brand-dark/5 p-10 rounded-[3rem] space-y-4">
              <Shield className="w-8 h-8 text-brand-gold" />
              <h4 className="text-xl font-bold tracking-tight text-brand-dark">FIRS Compliance</h4>
              <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-widest font-bold font-mono">
                TaxWise is aligned with the Federal Inland Revenue Service (FIRS) 2026 guidelines for digitalized tax collection.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-20 flex flex-col items-center">
          <div className="text-center max-w-2xl mb-12">
            <h2 className="text-3xl font-black font-space tracking-tight text-brand-dark mb-4">READY TO FILE?</h2>
            <p className="text-gray-500 font-medium">Join 50,000+ Nigerians who have already digitized their tax returns.</p>
          </div>
          <Link href="/intake">
            <Button className="bg-brand-dark text-white px-12 py-8 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center gap-3">
              Start Free Intake <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
