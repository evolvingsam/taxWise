"use client";

import { useState } from "react";
import { Download, FileDown, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as api from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";

export function ExportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { withFreshAccessToken, user } = useAuth();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const token = await withFreshAccessToken();
      const historyRes = await api.getLedgerHistory(token);
      
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(17, 24, 39); // Tailwind brand-dark
      doc.text("TaxWise Official Ledger", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128); // Tailwind gray-500
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`User: ${user?.first_name || ""} ${user?.last_name || ""} (${user?.email || "N/A"})`, 14, 35);
      doc.text("FIRS-Compliant Financial Record", 14, 40);
      
      let tableData: (string|number)[][] = [];
      if (historyRes.results && historyRes.results.length > 0) {
        tableData = historyRes.results.map((entry) => {
          let totalExpenses = 0;
          if (entry.expenses) {
            totalExpenses = Object.values(entry.expenses).reduce((a, b) => Number(a) + Number(b), 0);
          }
          return [
            new Date(entry.created_at).toLocaleDateString(),
            entry.period,
            entry.user_type,
            `N${Number(entry.income).toLocaleString()}`,
            `N${totalExpenses.toLocaleString()}`,
            `${(Number(entry.ai_confidence) * 100).toFixed(0)}%`,
            entry.status,
          ];
        });
      }
      
      if (tableData.length === 0) {
        // Fallback or empty state
        doc.setFontSize(12);
        doc.setTextColor(0,0,0);
        doc.text("No ledger entries found.", 14, 55);
      } else {
        autoTable(doc, {
          startY: 50,
          head: [["Date", "Period", "Type", "Income", "Total Expenses", "Confidence", "Status"]],
          body: tableData,
          theme: "striped",
          headStyles: { fillColor: [17, 24, 39] },
          styles: { fontSize: 9, cellPadding: 3 },
        });
      }
      
      doc.save(`taxwise-ledger-${new Date().getTime()}.pdf`);
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => setIsSuccess(false), 500); 
      }, 2000);
      
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to export ledger.";
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="rounded-full shadow-sm hover:bg-gray-50 border-gray-200"
        onClick={() => setIsOpen(true)}
      >
        <Download className="w-4 h-4 mr-2" /> Export Ledger
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => { if (!isExporting) setIsOpen(false); }}
        title="Export Official Ledger"
        description="Generate a digitally signed PDF of your 2025/2026 tax records, fully compliant with FIRS guidelines."
      >
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">Export Complete</h3>
            <p className="text-sm text-gray-500">Your FIRS-compliant ledger is ready.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-brand-dark/5 border border-brand-dark/10 group cursor-pointer hover:border-brand-gold/50 hover:bg-white transition-all">
              <div className="flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-dark text-white flex items-center justify-center shadow-md">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-brand-dark">Detailed Ledger</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">PDF Document</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border-4 border-brand-gold bg-white"></div>
              </div>
            </div>
            
            <div className="flex gap-4 w-full pt-4">
              <Button 
                variant="outline" 
                className="w-full rounded-xl border-gray-200 text-gray-500 font-bold"
                onClick={() => setIsOpen(false)}
                disabled={isExporting}
              >
                Cancel
              </Button>
              <Button 
                className="w-full rounded-xl bg-brand-dark text-white shadow-xl flex items-center justify-center gap-2 hover:bg-brand-gold hover:text-brand-dark transition-all disabled:opacity-50"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>Generate Export</>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
