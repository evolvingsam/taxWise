"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, User, Bot, Sparkles, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  extractedData?: {
    income?: number;
    expenses?: Record<string, number>;
    category?: string;
  };
}

export default function SmartIntakePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your TaxWise AI assistant. How can I help you with your tax filing today? You can just tell me what you earned or spent (e.g., 'I run a shop, I earned ₦40k'), and I'll map it to the correct tax bracket for you.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
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

    // Simulate AI behavior
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: simulateAIResponse(input),
        timestamp: new Date(),
        extractedData: simulateExtraction(input),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
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
                    <div className="grid grid-cols-2 gap-4">
                      {m.extractedData.income && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Income</p>
                          <p className="font-bold text-lg">₦{m.extractedData.income.toLocaleString()}</p>
                        </div>
                      )}
                      {m.extractedData.category && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Category</p>
                          <p className="font-bold text-sm">{m.extractedData.category}</p>
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
            placeholder="Type your income/expenses (e.g. I earned ₦40,000 today from sales)"
            className="flex-1 bg-muted/30 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-gold"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
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

function simulateAIResponse(input: string): string {
  const text = input.toLowerCase();
  if (text.includes("earned") || text.includes("made") || text.includes("income") || text.includes("profit")) {
    return "Great! I've logged that income for you. Your fiscal history is building up. Would you like to add any expenses related to this earning?";
  }
  if (text.includes("spent") || text.includes("paid") || text.includes("expense") || text.includes("rent")) {
    return "Understood. I've recorded those expenses. This will be deductible from your taxable income. Is there anything else you'd like to report?";
  }
  return "I've analyzed that information. I'm adding it to your structured financial ledger now. You're doing great with your compliance!";
}

function simulateExtraction(input: string): Message["extractedData"] {
  const numbers = input.match(/\d+([,]\d+)*/g);
  if (!numbers) return undefined;

  const val = parseInt(numbers[0].replace(/,/g, ""));
  if (input.toLowerCase().includes("earned") || input.toLowerCase().includes("income")) {
    return { income: val, category: "Business Revenue" };
  }
  if (input.toLowerCase().includes("rent")) {
    return { expenses: { "rent": val }, category: "Operational Expense" };
  }
  if (input.toLowerCase().includes("spent") || input.toLowerCase().includes("paid")) {
    return { expenses: { "miscellaneous": val }, category: "General Expense" };
  }
  return { income: val, category: "Uncategorized" };
}
