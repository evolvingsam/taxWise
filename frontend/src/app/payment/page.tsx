"use client";

import { useState, useEffect, useCallback } from "react";
import { CreditCard, Wallet, Building2, CheckCircle2, Loader2, ShieldCheck, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useSearchParams } from "next/navigation";
import * as api from "@/lib/api";
import toast from "react-hot-toast";

type PaymentStatus = "selecting" | "processing" | "pending" | "success";

type InlineCheckoutResponse = {
  resp?: string;
  txnref?: string;
  transaction_reference?: string;
  amount?: number;
  [key: string]: unknown;
};

type WebpayCheckoutPayload = {
  merchant_code: string;
  pay_item_id: string;
  txn_ref: string;
  amount: number;
  currency: number;
  cust_email: string;
  mode: "TEST" | "LIVE";
  pay_item_name?: string;
  cust_name?: string;
  cust_id?: string;
  cust_mobile_no?: string;
  onComplete: (response: InlineCheckoutResponse) => void;
};

declare global {
  interface Window {
    webpayCheckout?: (payload: WebpayCheckoutPayload) => void;
  }
}

const INTERSWITCH_TEST_CONFIG = {
  merchantCode: "MX6072",
  payItemId: "9405967",
  mode: "TEST" as const,
  currency: 566,
  scriptUrl: "https://newwebpay.qa.interswitchng.com/inline-checkout.js",
};

export default function PaymentPage() {
  const [status, setStatus] = useState<PaymentStatus>("selecting");
  const [method, setMethod] = useState<string>("card");
  const [isLoading, setIsLoading] = useState(false);
  const [txRef, setTxRef] = useState("");
  const [rrrCode, setRrrCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [checkoutResponseCode, setCheckoutResponseCode] = useState("");
  const params = useSearchParams();
  const { user, withFreshAccessToken } = useAuth();

  const amount = Number(params.get("amount") || 1000);
  const taxYear = Number(params.get("tax_year") || new Date().getFullYear());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const existing = document.querySelector<HTMLScriptElement>(`script[src=\"${INTERSWITCH_TEST_CONFIG.scriptUrl}\"]`);
    if (existing && window.webpayCheckout) {
      setCheckoutReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = INTERSWITCH_TEST_CONFIG.scriptUrl;
    script.async = true;
    script.onload = () => setCheckoutReady(true);
    script.onerror = () => {
      setCheckoutReady(false);
      toast.error("Unable to load Interswitch checkout script");
    };

    document.body.appendChild(script);
    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  const refreshTransactionStatus = useCallback(async (referenceOverride?: string) => {
    const reference = referenceOverride || txRef;
    if (!reference) return;

    setIsLoading(true);
    try {
      const token = await withFreshAccessToken();
      const response = await api.getTransactionStatus(token, reference);
      const message = response?.message || "Status refreshed";
      const serverStatus = (response?.status || "").toLowerCase();
      const nextRrr = response?.rrr_code || response?.rrr || "";

      if (nextRrr) setRrrCode(nextRrr);
      setStatusMessage(message);

      if (["success", "paid", "completed"].includes(serverStatus) || nextRrr) {
        setStatus("success");
      } else {
        setStatus("pending");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to check transaction status");
    } finally {
      setIsLoading(false);
    }
  }, [txRef, withFreshAccessToken]);

  const openInlineCheckout = useCallback(async (reference: string) => {
    if (!window.webpayCheckout) {
      throw new Error("Interswitch checkout is not ready yet. Please try again.");
    }

    const amountInKobo = Math.max(100, Math.round(amount * 100));
    const customerEmail = user?.email || "test.customer@taxwise.dev";

    window.webpayCheckout({
      merchant_code: INTERSWITCH_TEST_CONFIG.merchantCode,
      pay_item_id: INTERSWITCH_TEST_CONFIG.payItemId,
      txn_ref: reference,
      amount: amountInKobo,
      currency: INTERSWITCH_TEST_CONFIG.currency,
      cust_email: customerEmail,
      pay_item_name: `Tax filing ${taxYear}`,
      mode: INTERSWITCH_TEST_CONFIG.mode,
      onComplete: (response) => {
        const responseCode = response?.resp || "";
        setCheckoutResponseCode(responseCode);
        setStatus("pending");

        if (responseCode === "00") {
          setStatusMessage("Checkout completed. Verifying transaction status...");
          toast.success("Checkout completed. Verifying transaction...");
          void refreshTransactionStatus(reference);
        } else {
          setStatusMessage("Checkout ended without approval. You can retry or check transaction status.");
          toast("Checkout finished. Transaction not yet approved.");
        }
      },
    });
  }, [amount, refreshTransactionStatus, taxYear, user?.email]);

  const handlePay = async () => {
    setIsLoading(true);
    setStatus("processing");

    try {
      if (!checkoutReady) {
        throw new Error("Interswitch checkout script is still loading. Please wait a moment.");
      }

      const token = await withFreshAccessToken();
      const response = await api.initiatePayment(token, { amount, tax_year: taxYear });
      const reference = response?.tx_ref || `test_${Date.now()}`;

      setTxRef(reference);
      setStatusMessage(response?.message || "Opening Interswitch checkout...");
      await openInlineCheckout(reference);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to initiate payment");
      setStatus("selecting");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "pending" || !txRef) return;

    const timer = setInterval(() => {
      refreshTransactionStatus();
    }, 12000);

    return () => clearInterval(timer);
  }, [refreshTransactionStatus, status, txRef]);

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
              You&apos;ve successfully calculated your tax liability. Choose a payment method to complete your filing.
            </p>
            
            <div className="bg-white border rounded-[2.5rem] p-8 shadow-sm mb-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount Due</span>
                <span className="text-3xl font-black font-space tracking-tighter text-brand-dark">₦{amount.toLocaleString()}.00</span>
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
              disabled={isLoading}
              className="w-full py-8 rounded-2xl bg-brand-dark text-white font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all shadow-md"
            >
              {isLoading ? "Initiating..." : "Pay via Interswitch"}
            </Button>
            
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-gold" /> Transactions secured by Interswitch Web SDK v2.0
            </p>
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3">
              Sandbox: {INTERSWITCH_TEST_CONFIG.merchantCode} / {INTERSWITCH_TEST_CONFIG.payItemId} ({INTERSWITCH_TEST_CONFIG.mode})
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
            <p className="text-gray-500 leading-relaxed font-medium">Please do not refresh the page or close the window. We are creating your payment transaction...</p>
          </div>
        )}

        {status === "pending" && (
          <div className="text-center animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-8 mx-auto shadow-inner">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <h1 className="text-3xl font-black font-space tracking-tight text-brand-dark mb-3">Transaction Pending</h1>
            <p className="text-gray-500 mb-8 leading-relaxed font-medium px-2">
              {statusMessage || "Payment transaction initiated. Complete checkout in Interswitch, then refresh status."}
            </p>

            <div className="bg-white border rounded-[2rem] p-6 mb-8 text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Transaction Reference</p>
              <p className="font-mono font-bold text-brand-dark break-all">{txRef || "-"}</p>
            </div>

            {checkoutResponseCode && (
              <div className="bg-white border rounded-[2rem] p-6 mb-8 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Checkout Response Code</p>
                <p className="font-mono font-bold text-brand-dark break-all">{checkoutResponseCode}</p>
              </div>
            )}

            <Button
              onClick={() => {
                void refreshTransactionStatus();
              }}
              disabled={isLoading || !txRef}
              className="w-full py-8 rounded-2xl bg-brand-dark text-white font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all shadow-md"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> Check Transaction Status
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
                    <p className="text-xl font-black font-space text-brand-dark">₦{amount.toLocaleString()}.00</p>
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
