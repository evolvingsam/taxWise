"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ShieldCheck, Search, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as api from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [ledger, setLedger] = useState<api.LedgerEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<api.LedgerEntry | null>(null);
  const [entryLoading, setEntryLoading] = useState(false);
  const { withFreshAccessToken } = useAuth();

  const loadLedgerHistory = useCallback(async () => {
    setLoading(true);
    try {
      const token = await withFreshAccessToken();
      const response = await api.getLedgerHistory(token);
      setLedger(response?.results || []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load ledger history");
    } finally {
      setLoading(false);
    }
  }, [withFreshAccessToken]);

  useEffect(() => {
    loadLedgerHistory();
  }, [loadLedgerHistory]);

  const filteredLedger = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return ledger;

    return ledger.filter((item) => {
      return (
        item.id.toLowerCase().includes(query) ||
        item.user_type.toLowerCase().includes(query) ||
        item.period.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query) ||
        item.raw_text.toLowerCase().includes(query)
      );
    });
  }, [ledger, search]);

  const viewEntry = async (entryId: string) => {
    setSelectedId(entryId);
    setEntryLoading(true);
    try {
      const token = await withFreshAccessToken();
      const response = await api.getLedgerEntry(token, entryId);
      const entry = "data" in response ? response.data : response;
      setSelectedEntry(entry);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load ledger entry");
      setSelectedEntry(null);
    } finally {
      setEntryLoading(false);
    }
  };

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
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-muted/50 border border-gray-100 focus:outline-none focus:border-brand-gold text-sm"
            />
          </div>
          <Button variant="outline" className="rounded-2xl px-6 py-6 border-gray-100" onClick={loadLedgerHistory}>
            Refresh
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
                <th className="px-8 py-6">Income</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-sm text-gray-500">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading ledger history...
                    </span>
                  </td>
                </tr>
              )}

              {!loading && filteredLedger.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-sm text-gray-500">
                    No ledger entries found.
                  </td>
                </tr>
              )}

              {!loading && filteredLedger.map((item, i) => (
                <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-dark/5 text-brand-dark flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </div>
                      <span className="font-bold text-sm text-brand-dark">{item.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-gray-500 uppercase">{item.period}</td>
                  <td className="px-8 py-6 text-sm font-bold text-brand-dark">
                    ₦{Number(item.income || 0).toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase">
                      <ShieldCheck className="w-4 h-4" /> VERIFIED
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">{item.status}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewEntry(item.id)}
                      className="text-brand-dark font-bold text-[10px] uppercase tracking-widest hover:text-brand-gold"
                    >
                      <Eye className="w-3.5 h-3.5 mr-2" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedId && (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-space text-2xl font-black tracking-tight text-brand-dark">Ledger Entry Detail</h2>
            <Button variant="outline" className="rounded-xl" onClick={() => setSelectedId(null)}>
              Close
            </Button>
          </div>

          {entryLoading && (
            <p className="text-sm text-gray-500 inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading entry...
            </p>
          )}

          {!entryLoading && selectedEntry && (
            <div className="space-y-4 text-sm">
              <p><span className="font-bold">ID:</span> {selectedEntry.id}</p>
              <p><span className="font-bold">User type:</span> {selectedEntry.user_type}</p>
              <p><span className="font-bold">Income:</span> ₦{Number(selectedEntry.income || 0).toLocaleString()}</p>
              <p><span className="font-bold">Period:</span> {selectedEntry.period}</p>
              <p><span className="font-bold">AI confidence:</span> {selectedEntry.ai_confidence}</p>
              <p><span className="font-bold">Status:</span> {selectedEntry.status}</p>
              <p><span className="font-bold">Raw text:</span> {selectedEntry.raw_text}</p>
              <div>
                <p className="font-bold mb-1">Expenses</p>
                <pre className="bg-muted/30 p-3 rounded-xl overflow-x-auto">{JSON.stringify(selectedEntry.expenses || {}, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
