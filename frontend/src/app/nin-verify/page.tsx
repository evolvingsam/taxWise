"use client";

import { useState } from "react";
import { Shield, Fingerprint, Smartphone, CheckCircle2, ArrowRight, ArrowLeft, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Step = "nin" | "otp" | "success";

export default function NINVerifyPage() {
  const [step, setStep] = useState<Step>("nin");
  const [loading, setLoading] = useState(false);
  const [nin, setNin] = useState("");
  const [otp, setOtp] = useState("");

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (step === "nin") setStep("otp");
      else if (step === "otp") setStep("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step === "nin" || step === "otp" || step === "success" ? "bg-brand-dark" : "bg-gray-100"}`}></div>
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step === "otp" || step === "success" ? "bg-brand-dark" : "bg-gray-100"}`}></div>
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step === "success" ? "bg-brand-gold shadow-[0_0_10px_#FBB03B]" : "bg-gray-100"}`}></div>
        </div>

        {step === "nin" && (
          <div className="animate-in fade-in slide-in-from-bottom-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-dark text-brand-gold flex items-center justify-center mb-8 shadow-md">
              <Fingerprint className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black font-space tracking-tight text-brand-dark mb-4">Identity Verification</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              To build your <span className="text-brand-dark font-bold">TaxWise Fiscal Identity</span> and generate an Aegis Score, we need to verify your National Identification Number.
            </p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">NIN Number (11 Digits)</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    maxLength={11}
                    value={nin}
                    onChange={(e) => setNin(e.target.value)}
                    placeholder="0000 0000 000" 
                    className="w-full bg-muted/30 border border-gray-100 rounded-2xl pl-12 pr-4 py-5 text-lg font-bold tracking-[0.2em] focus:outline-none focus:border-brand-gold transition-colors" 
                  />
                </div>
              </div>
              
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                <Shield className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                  Your NIN is only used for one-time verification with NIMC. We do not store your full biometric profile.
                </p>
              </div>

              <Button 
                onClick={handleNext} 
                disabled={nin.length < 11 || loading}
                className="w-full py-8 rounded-2xl bg-brand-dark text-white font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify Identity"}
              </Button>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="animate-in fade-in slide-in-from-right-5">
            <button onClick={() => setStep("nin")} className="flex items-center gap-2 text-gray-400 hover:text-brand-dark mb-8 font-bold text-xs uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <div className="w-16 h-16 rounded-2xl bg-brand-dark text-brand-gold flex items-center justify-center mb-8 shadow-md">
              <Smartphone className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black font-space tracking-tight text-brand-dark mb-4">Security Code</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              We've sent a 6-digit verification code to the phone number linked to your NIN.
            </p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Verification Code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000" 
                  className="w-full bg-muted/30 border border-gray-100 rounded-2xl px-6 py-5 text-2xl text-center font-black tracking-[0.5em] focus:outline-none focus:border-brand-gold transition-colors" 
                />
              </div>

              <Button 
                onClick={handleNext} 
                disabled={otp.length < 6 || loading}
                className="w-full py-8 rounded-2xl bg-brand-dark text-white font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm & Verify"}
              </Button>
              
              <button className="w-full text-center text-xs font-bold text-gray-400 hover:text-brand-gold transition-colors">
                Didn't receive code? Resend (45s)
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center animate-in zoom-in-95 duration-700">
            <div className="w-24 h-24 rounded-full bg-green-50 text-emerald-500 flex items-center justify-center mb-8 mx-auto shadow-inner relative">
              <CheckCircle2 className="w-12 h-12" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-20"></div>
            </div>
            <h1 className="text-4xl font-black font-space tracking-tight text-brand-dark mb-4">Identity Verified</h1>
            <p className="text-gray-500 mb-12 leading-relaxed">
              Congratulations! Your identity has been verified. Your <span className="text-brand-gold font-bold">Aegis Score</span> is now active and based on your NIN-linked fiscal history.
            </p>
            
            <div className="bg-brand-dark p-8 rounded-[2.5rem] mb-12 text-left relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Initial Aegis Score
                </span>
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full font-bold">CALCULATED</span>
              </div>
              <div className="font-space text-5xl font-black text-white">712<span className="text-gray-500 text-xl"> / 900</span></div>
            </div>

            <Link href="/dashboard" className="block w-full">
              <Button className="w-full py-8 rounded-2xl bg-brand-dark text-white font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-md flex items-center justify-center gap-3 group">
                Enter Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Footer Branding */}
      <div className="mt-20 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
          <span>NIMC Partner</span>
          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
          <span>FIRS Approved</span>
          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
          <span>Bank Grade Security</span>
        </div>
        <div className="font-space font-black text-brand-dark/10 text-4xl">TAXWISE</div>
      </div>
    </div>
  );
}
