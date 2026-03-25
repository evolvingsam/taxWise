"use client";

import { useState, useEffect } from "react";
import { CreditCard, Wallet, Building2, CheckCircle2, ArrowRight, Loader2, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PaymentStatus = "selecting" | "processing" | "success";

export default function PaymentPage() {
  const [status, setStatus] = useState<PaymentStatus>("selecting");
  const [method, setMethod] = useState<string>("card");

  const handlePay = () => {
    setStatus("processing");
    setTimeout(() => {
      setStatus("success");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {status === "selecting" && (
          <div className="animate-in fade-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-brand-dark text-brand-gold flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-muted rounded-full px-4 py-1.5">
                <Lock className="w-3 h-3" /> Secure Checkout
              </div>
            </div>
            
            <h1 className="text-4xl font-black font-space tracking-tight text-brand-dark mb-4">Finalize Remittance</h1>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              You've successfully calculated your tax liability. Choose a payment method to complete your filing.
            </p>
            
            <div className="bg-white border rounded-[2.5rem] p-8 shadow-sm mb-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount Due</span>
                <span className="text-3xl font-black font-space tracking-tighter text-brand-dark">₦45,000.00</span>
              </div>
              
              <div className="space-y-4">
                {[
                  { id: "card", name: "Debit / Credit Card", icon: CreditCard },
                  { id: "transfer", name: "Bank Transfer", icon: Building2 },
                  { id: "wallet", name: "Interswitch Wallet", icon: Wallet },
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${method === m.id ? "border-brand-gold bg-brand-gold/5 shadow-inner" : "border-gray-100 hover:border-gray-200"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${method === m.id ? "bg-brand-dark text-brand-gold" : "bg-muted text-gray-400"}`}>
                        <m.icon className="w-5 h-5" />
                      </div>
                      <span className={`font-bold ${method === m.id ? "text-brand-dark" : "text-gray-500"}`}>{m.name}</span>
                    </div>
                    {method === m.id && <div className="w-5 h-5 rounded-full bg-brand-dark text-brand-gold flex items-center justify-center"><CheckCircle2 className="w-3 h-3" /></div>}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handlePay}
              className="w-full py-8 rounded-2xl bg-brand-dark text-white font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all shadow-xl shadow-brand-dark/10"
            >
              Pay via Interswitch
            </Button>
            
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-gold" /> Transactions secured by Interswitch Web SDK v2.0
            </p>
          </div>
        )}

        {status === "processing" && (
          <div className="text-center animate-in fade-in zoom-in-95">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-brand-gold/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-gold rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-brand-dark font-black font-space">IS</div>
            </div>
            <h2 className="text-3xl font-black font-space tracking-tight text-brand-dark mb-4">Securing Payment</h2>
            <p className="text-gray-500 leading-relaxed font-medium">Please do not refresh the page or close the window. We are connecting to the Interswitch gateway...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center animate-in zoom-in-95 duration-700">
            <div className="w-24 h-24 rounded-full bg-green-50 text-emerald-500 flex items-center justify-center mb-8 mx-auto shadow-inner relative">
              <CheckCircle2 className="w-12 h-12" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-20"></div>
            </div>
            <h1 className="text-4xl font-black font-space tracking-tight text-brand-dark mb-4">Remittance Received</h1>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium px-4">
              Your tax payment has been successfully recorded. A digital receipt has been issued and added to your official ledger.
            </p>
            
            <div className="bg-white border-2 border-brand-gold/20 rounded-[2.5rem] p-10 mb-12 text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <ShieldCheck className="w-8 h-8 text-brand-gold opacity-20" />
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Reference</label>
                  <p className="font-bold font-mono text-brand-dark">TW-2026-X94K2-LRS</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Paid</label>
                    <p className="text-xl font-black font-space text-brand-dark">₦45,000.00</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</label>
                    <p className="text-xl font-black font-space text-emerald-500 uppercase tracking-tighter">CONFIRMED</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full py-8 rounded-2xl bg-brand-dark text-white font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all">
                  Back to Dashboard
                </Button>
              </Link>
              <Button variant="outline" className="flex-1 py-8 rounded-2xl font-bold uppercase tracking-widest border-gray-100 shadow-sm">
                Download Receipt
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Branding */}
      <div className="mt-20 flex flex-col items-center gap-4">
        <img src="https://www.interswitchgroup.com/assets/images/isw-logo.png" alt="Interswitch" className="h-6 grayscale opacity-20" />
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
          <span>Verified Merchant</span>
          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
          <span>PCI-DSS Compliant</span>
        </div>
      </div>
    </div>
  );
}
