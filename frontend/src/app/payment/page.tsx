"use client";

import { Suspense, useState } from "react";
import { CreditCard, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useSearchParams } from "next/navigation";
import * as api from "@/lib/api";
import toast from "react-hot-toast";

type PaymentStatus = "selecting" | "processing" | "success" | "error";


function PaymentContent() {
  const [status, setStatus] = useState<PaymentStatus>("selecting");
  const [isLoading, setIsLoading] = useState(false);
  const [txRef, setTxRef] = useState("");
  const [rrrCode, setRrrCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const params = useSearchParams();
  const { withFreshAccessToken } = useAuth();

  const rawAmount = params.get("amount");
  const parsedAmount = rawAmount ? Number(rawAmount.replace(/,/g, "")) : NaN;
  const amountInNaira = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 1000;
  const amountInKobo = Math.round(amountInNaira * 100);
  const taxYear = Number(params.get("tax_year") || new Date().getFullYear());
  const hardcodedCheckoutUrl = "https://newwebpay.qa.interswitchng.com/collections/w/pay";
  const merchantCode = "MX276397";
  const payItemId = "Default_Payable_MX276397";

  const handlePay = async () => {
    setIsLoading(true);
    setStatus("processing");
    setErrorMessage("");

    // Open tab immediately in direct click context to avoid popup blocking.
    const checkoutTab = typeof window !== "undefined"
      ? window.open("about:blank", "_blank", "noopener,noreferrer")
      : null;
    const checkoutTarget = checkoutTab ? `isw_checkout_${Date.now()}` : "_self";
    if (checkoutTab) {
      checkoutTab.name = checkoutTarget;
    }

    try {
      const token = await withFreshAccessToken();
      
      // Get the callback redirect URL for after payment
      const callbackUrl = typeof window !== "undefined" 
        ? new URL("/payment", window.location.origin).toString()
        : "https://taxwise-mu.vercel.app/payment";
      
      
      const response = await api.initiatePayment(token, { 
        amount: amountInNaira,
        tax_year: taxYear,
      });

     
      // Check for error from backend
      if ((response as any).error) {
        throw new Error((response as any).error);
      }

      const redirectUrl = hardcodedCheckoutUrl;
      setTxRef(response.tx_ref || "");
      setStatusMessage("Opening payment page in a new tab...");

      if (typeof window !== "undefined") {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = redirectUrl;
        form.target = checkoutTarget;

        const safeTxnRef = (response.tx_ref || `TX_${Date.now()}`)
          .replace(/[^a-zA-Z0-9_-]/g, "")
          .slice(0, 48);

        const fields: Record<string, string> = {
          merchant_code: merchantCode,
          pay_item_id: payItemId,
          txn_ref: safeTxnRef,
          amount: String(amountInKobo),
          currency: "566",
          site_redirect_url: callbackUrl,
        };

        console.log("[Interswitch Redirect Payload]", fields);

        Object.entries(fields).forEach(([name, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        form.remove();
      }
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to initiate payment";
      toast.error(message);
      setErrorMessage(message);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {status === "selecting" && (
          <div className="animate-in fade-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-xl bg-brand-dark text-brand-gold flex items-center justify-center shadow-sm">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-muted rounded-full px-4 py-1.5">
                <Lock className="w-3 h-3" /> Secure Checkout
              </div>
            </div>
            
            <h1 className="text-4xl font-black font-space tracking-tight text-brand-dark mb-4">Finalize Remittance</h1>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              You've successfully calculated your tax liability. Click below to pay with Interswitch.
            </p>
            
            <div className="bg-white border rounded-[2.5rem] p-8 shadow-sm mb-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount Due</span>
                <span className="text-3xl font-black font-space tracking-tighter text-brand-dark">₦{amountInNaira.toLocaleString()}.00</span>
              </div>
              
              <div className="rounded-2xl border-2 border-brand-gold bg-brand-gold/5 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm bg-brand-dark text-brand-gold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-dark">Pay with Interswitch</p>
                    <p className="text-xs text-gray-500">Checkout opens in a new browser tab</p>
                  </div>
                  <div className="ml-auto w-5 h-5 rounded-full bg-brand-dark text-brand-gold flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePay}
              disabled={isLoading}
              className="w-full py-8 rounded-2xl bg-brand-dark text-white font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all shadow-md"
            >
              {isLoading ? "Initiating..." : "Pay with Interswitch"}
            </Button>
            
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-gold" /> Powered by Interswitch Checkout
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
            <p className="text-gray-500 leading-relaxed font-medium mb-6">
              {statusMessage || "Preparing your payment transaction..."}
            </p>
            <p className="text-[10px] text-gray-400 font-mono">
              A new tab will open shortly
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center animate-in fade-in zoom-in-95">
            <div className="w-24 h-24 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-8 mx-auto shadow-inner">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-3xl font-black font-space tracking-tight text-brand-dark mb-4">Payment Failed</h2>
            <p className="text-gray-500 leading-relaxed font-medium mb-6">
              {errorMessage || "An error occurred while initiating payment."}
            </p>
            <Button 
              onClick={() => {
                setStatus("selecting");
                setErrorMessage("");
              }}
              className="w-full py-8 rounded-2xl bg-brand-dark text-white font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all shadow-md"
            >
              Try Again
            </Button>
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
                  <p className="font-bold font-mono text-brand-dark">{txRef || "N/A"}</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Paid</label>
                    <p className="text-xl font-black font-space text-brand-dark">₦{amountInNaira.toLocaleString()}.00</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</label>
                    <p className="text-xl font-black font-space text-emerald-500 uppercase tracking-tighter">CONFIRMED</p>
                  </div>
                </div>
                {rrrCode && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">RRR Code</label>
                    <p className="font-bold font-mono text-brand-dark">{rrrCode}</p>
                  </div>
                )}
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

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4 text-sm text-gray-500">Loading payment...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
