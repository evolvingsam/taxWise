import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, ArrowUpRight, Clock, PlusCircle, ShieldCheck, TrendingUp, Download, Sparkles, CheckCircle2 } from "lucide-react";
import { mockLedger, mockUser } from "@/lib/mockData";
import { ExportButton } from "@/components/dashboard/ExportButton";

export default function DashboardPage() {
  const latestTax = mockLedger[0];

  return (
    <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-space text-4xl font-black tracking-tighter text-brand-dark">Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">
            Welcome back, {mockUser.name.split(" ")[0]}. Your verified fiscal identity is in good standing.
          </p>
        </div>
        <div className="flex gap-3">
          <ExportButton />
          <Link href="/intake">
            <Button className="rounded-full bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark transition-all px-8 shadow-md">
              <PlusCircle className="w-4 h-4 mr-2" /> Log Income/Expense
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Aegis Score Card - Feature 3: The Innovation */}
        <div className="rounded-[2.5rem] bg-brand-dark text-white p-8 flex flex-col justify-between shadow-md relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl group-hover:bg-brand-gold/10 transition-all duration-700"></div>
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Aegis Score
            </h3>
            <span className="text-[10px] bg-white/10 text-brand-gold px-2 py-1 rounded-full font-bold">ALPHA VERSION</span>
          </div>
          
          <div className="relative z-10 mt-6 flex items-baseline gap-2">
            <div className="font-space text-6xl font-black">842</div>
            <div className="text-gray-400 font-bold">/ 900</div>
          </div>
          
          <div className="relative z-10 mt-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-400 uppercase tracking-widest">Tax Compliance Level</span>
              <span className="text-brand-gold">EXCELLENT</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-gold h-full w-[85%] rounded-full shadow-[0_0_15px_#FBB03B]"></div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed italic">
              "Your verified tax history has unlocked a ₦2.5M credit limit at partner banks."
            </p>
          </div>
        </div>

        {/* Tax Liability Card - Feature 2: Universal Tax Engine */}
        <div className="rounded-[2.5rem] border bg-white p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Tax Liability (2025)</h3>
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-brand-dark">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-6">
            <div className="font-space text-4xl font-black text-brand-dark tracking-tighter">₦45,000</div>
            <p className="text-[10px] text-brand-gold font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Fully Compliant
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">L</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">F</div>
            </div>
            <span className="text-[10px] font-bold text-gray-400">LIRS & FIRS Verified</span>
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="rounded-[2.5rem] border bg-muted/30 p-8 flex flex-col items-center text-center justify-center border-dashed border-gray-300 hover:border-brand-gold/50 transition-colors group">
          <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform duration-300 mb-6">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-xl tracking-tight mb-2">New Assessment</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-6 px-4">
            Talk to our AI to update your tax records and building your Aegis Score for bank loan eligibility.
          </p>
          <Link href="/intake">
            <Button size="sm" className="rounded-full px-6 bg-white text-brand-dark border border-gray-200 hover:bg-brand-dark hover:text-white transiton-all">Start Intake</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-[2.5rem] border bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col space-y-1 p-8 border-b bg-muted/10">
          <h3 className="font-bold text-xl tracking-tight">Recent Activity</h3>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Your Fiscal Trace</p>
        </div>
        <div className="p-0">
          <div className="divide-y divide-gray-50">
            {mockLedger.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner ${record.method === 'voice' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark">Tax Assessment ({new Date(record.date).getFullYear()})</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-gray-100 rounded-md text-gray-500">
                        {record.method}
                      </span>
                      <span className="text-[10px] font-bold text-gray-300"> • </span>
                      <span className="text-[10px] font-bold text-gray-400">{new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-brand-dark">
                    {record.assessment.isExempt ? "EXEMPT" : `₦${record.assessment.taxDue?.toLocaleString()}`}
                  </div>
                  <div className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold mt-2 bg-green-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                    Verified Pair
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t text-center bg-muted/10">
          <Link href="/history" className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:text-brand-dark transition-colors flex items-center justify-center gap-2">
            View Full Official Ledger <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
