"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, User, Bot, Sparkles, CheckCircle2 } from "lucide-react";
import * as api from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  extractedData?: {
    income?: number;
    expenses?: Record<string, number>;
    user_type?: string;
    period?: string;
    confidence?: number;
  };
}

export default function SmartIntakePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your TaxWise AI assistant. To help calculate your tax at the end of the month, please tell me your total income and expenses for the month (e.g., 'This month my shop made ₦150k in total, and I spent ₦20k on rent').",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [source, setSource] = useState("web");
  const [isTyping, setIsTyping] = useState(false);
  const [lastLedgerId, setLastLedgerId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { withFreshAccessToken } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const token = await withFreshAccessToken();
      const response = await api.submitSmartIntake(token, userMessage.content, source);
      const parsed = response?.parsed || {};
      const isPartial = response?.status === "partial_failure";

      if (response?.ledger_id) {
        setLastLedgerId(response.ledger_id);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isPartial
          ? `I parsed your entry with partial confidence. ${response?.message || "Please review extracted values before filing."}`
          : `Entry captured successfully. ${response?.message || "Your intake has been added to your ledger."}`,
        timestamp: new Date(),
        extractedData: {
          income: parsed.income,
          expenses: parsed.expenses,
          user_type: parsed.user_type,
          period: parsed.period,
          confidence: parsed.confidence,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      toast.success(isPartial ? "Intake saved with partial extraction" : "Intake submitted");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Please try again.";
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I could not submit this intake. ${errorMessage}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      toast.error(errorMessage || "Failed to submit financial intake");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto w-full border rounded-3xl bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-dark text-brand-gold flex items-center justify-center shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-none">Smart Intake</h2>
            <p className="text-xs text-muted-foreground mt-1">AI-Powered Financial Logging</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-widest">+1.2k Active</span>
        </div>
      </div>

      <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <p className="text-xs text-amber-800 font-semibold">
          Source value is required by backend. Current source: <span className="uppercase">{source}</span>
        </p>
        <div className="flex gap-2">
          {[
            { id: "web", label: "Web" },
            { id: "mobile", label: "Mobile" },
            { id: "voice", label: "Voice" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setSource(option.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                source === option.id
                  ? "bg-brand-dark text-brand-gold border-brand-dark"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex gap-3 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${m.role === "user" ? "bg-brand-gold text-brand-dark" : "bg-brand-dark text-brand-gold"}`}>
                {m.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className="space-y-2">
                <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${m.role === "user" ? "bg-brand-dark text-white rounded-tr-none" : "bg-white text-brand-dark border rounded-tl-none"}`}>
                  {m.content}
                </div>

                {/* Extracted Data Card */}
                {m.extractedData && (
                  <div className="bg-white border-2 border-brand-gold/20 p-4 rounded-2xl shadow-sm space-y-3 animate-in zoom-in-95 duration-500">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Data Extracted
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                    </div>
                    {lastLedgerId && (
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        Ledger ID: <span className="normal-case tracking-normal">{lastLedgerId}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {typeof m.extractedData.income === "number" && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Income</p>
                          <p className="font-bold text-lg">₦{m.extractedData.income.toLocaleString()}</p>
                        </div>
                      )}
                      {m.extractedData.user_type && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">User Type</p>
                          <p className="font-bold text-sm capitalize">{m.extractedData.user_type}</p>
                        </div>
                      )}
                      {m.extractedData.period && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Period</p>
                          <p className="font-bold text-sm capitalize">{m.extractedData.period}</p>
                        </div>
                      )}
                      {typeof m.extractedData.confidence === "number" && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Confidence</p>
                          <p className="font-bold text-sm">{(m.extractedData.confidence * 100).toFixed(1)}%</p>
                        </div>
                      )}
                    </div>
                    {m.extractedData.expenses && Object.keys(m.extractedData.expenses).length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Expenses</p>
                        <div className="space-y-1">
                          {Object.entries(m.extractedData.expenses).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-xs font-medium">
                              <span className="capitalize">{key}</span>
                              <span>₦{value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-[10px] text-gray-400 px-2">{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-3 max-w-[80%] items-center">
              <div className="w-10 h-10 rounded-full bg-brand-dark text-brand-gold flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border p-3 rounded-2xl flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t">
        <div className="relative flex items-center gap-3">
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-colors">
            <Mic className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your monthly income and expenses (e.g., I earned ₦150,000 this month from sales)"
            className="flex-1 bg-muted/30 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-gold"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-gold transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">
          Powered by TaxWise AI • 2026 Tax Engine Integrated
        </p>
      </div>
    </div>
  );
}
