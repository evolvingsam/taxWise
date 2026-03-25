"use client";

import { FileText, Download, ShieldCheck, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockLedger } from "@/lib/mockData";

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-space text-4xl font-black tracking-tighter text-brand-dark">Official Ledger</h1>
          <p className="text-gray-500 font-medium mt-1">
            Browse and download your verified tax returns and exemption certificates.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search records..." className="w-full pl-12 pr-4 py-3 rounded-2xl bg-muted/50 border border-gray-100 focus:outline-none focus:border-brand-gold text-sm" />
          </div>
          <Button variant="outline" className="rounded-2xl px-6 py-6 border-gray-100">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                <th className="px-8 py-6">ID / Reference</th>
                <th className="px-8 py-6">Filing Period</th>
                <th className="px-8 py-6">Type</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockLedger.map((item, i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-dark/5 text-brand-dark flex items-center justify-center font-bold text-[10px]">
                        {item.id}
                      </div>
                      <span className="font-bold text-sm text-brand-dark">TX-{2026-i}-REF</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-gray-500 uppercase">{item.date}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-brand-gold/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-gold">{item.category}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" /> VERIFIED
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button variant="ghost" size="sm" className="text-brand-dark font-bold text-[10px] uppercase tracking-widest hover:text-brand-gold">
                      <Download className="w-3.5 h-3.5 mr-2" /> Download Ref
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
