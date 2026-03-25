import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, ArrowUpRight, Clock, PlusCircle } from "lucide-react";
import { mockLedger, mockUser } from "@/lib/mockData";

export default function DashboardPage() {
  const latestTax = mockLedger[0];

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      <div>
        <h1 className="font-space text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {mockUser.name.split(" ")[0]}. Here's an overview of your tax status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-linear-to-br from-blue-500 to-primary border-blue-600 p-6 flex flex-col justify-between">
          <div>
            <h3 className="tracking-tight text-blue-100 font-medium text-sm mb-1">Total Paid (2025)</h3>
            <div className="font-space text-3xl font-bold">₦45,000</div>
          </div>
          <p className="text-blue-100 text-xs mt-4 flex items-center">
            <ArrowUpRight className="inline mr-1 h-3 w-3" /> Fully compliant
          </p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-500">Next Action Required</h3>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          <div className="font-space text-2xl font-bold">None</div>
          <p className="text-xs text-muted-foreground mt-4">
            You have no pending assessments.
          </p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-center items-center text-center hover:border-primary/50 transition-colors">
          <div className="rounded-full bg-blue-100 p-3 mb-3 text-primary">
            <PlusCircle className="h-6 w-6" />
          </div>
          <h3 className="tracking-tight font-medium">New Assessment</h3>
          <p className="text-xs text-muted-foreground mb-4 mt-1">
            Start a new tax assessment session
          </p>
          <Link href="/intake">
            <Button size="sm">Start Now</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="flex flex-col space-y-1.5 p-6 border-b bg-slate-50/50">
          <h3 className="font-semibold leading-none tracking-tight font-space">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Your most recent tax assessments</p>
        </div>
        <div className="p-0">
          <div className="divide-y">
            {mockLedger.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Tax Assessment ({new Date(record.date).getFullYear()})</p>
                    <p className="text-xs text-slate-500">
                      Input method: <span className="capitalize">{record.method}</span> • {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">
                    {record.assessment.isExempt ? "Exempt" : `₦${record.assessment.taxDue?.toLocaleString()}`}
                  </div>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mt-1 bg-green-50 text-green-700 border-green-200">
                    Paid
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t text-center bg-slate-50/50">
          <Link href="/history" className="text-sm text-primary font-medium hover:underline">
            View full ledger history
          </Link>
        </div>
      </div>
    </div>
  );
}
