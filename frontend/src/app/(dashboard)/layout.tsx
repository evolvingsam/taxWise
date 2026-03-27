"use client";

import Link from "next/link";
import { Home, FileText, History, Bell, Search, ShieldCheck, Settings, FlaskConical } from "lucide-react";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { useAuth } from "@/lib/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const initials = `${user?.first_name?.[0] || "U"}${user?.last_name?.[0] || "S"}`.toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD]">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between px-4 lg:px-8 mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex flex-col">
              <span className="font-space font-extrabold text-xl tracking-tighter text-brand-dark leading-none">
                TAX<span className="text-brand-gold">WISE</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-1">AI Filing Portal</span>
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search records..." className="w-full bg-muted/50 border border-gray-100 rounded-full pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-brand-gold" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-brand-dark transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-gold rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-brand-dark leading-none">
                  {user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email : "TaxWise User"}
                </div>
                <div className="text-[10px] text-brand-gold font-bold uppercase tracking-widest mt-1">{user?.user_type || "Verified"}</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-brand-dark text-brand-gold flex items-center justify-center font-bold shadow-sm">
                {initials}
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12 px-4 lg:px-8 py-10 mx-auto">
        <aside className="fixed top-24 z-30 -ml-2 hidden h-[calc(100vh-8rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full pr-6 border-r border-gray-100 text-sm flex flex-col">
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="group flex w-full items-center rounded-2xl px-4 py-3 text-brand-dark bg-white shadow-sm border border-gray-100 font-bold mb-2"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-dark text-brand-gold flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <Home className="h-4 w-4" />
                </div>
                Overview
              </Link>
              <Link
                href="/intake"
                className="group flex w-full items-center rounded-2xl px-4 py-3 text-gray-400 hover:text-brand-dark hover:bg-white hover:shadow-sm hover:border-gray-100 transition-all font-bold mb-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 group-hover:bg-brand-gold group-hover:text-brand-dark flex items-center justify-center mr-3 transition-colors">
                  <FileText className="h-4 w-4" />
                </div>
                Smart Intake
              </Link>
              <Link
                href="/history"
                className="group flex w-full items-center rounded-2xl px-4 py-3 text-gray-400 hover:text-brand-dark hover:bg-white hover:shadow-sm hover:border-gray-100 transition-all font-bold mb-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 group-hover:bg-brand-gold group-hover:text-brand-dark flex items-center justify-center mr-3 transition-colors">
                  <History className="h-4 w-4" />
                </div>
                Ledger History
              </Link>
              <Link
                href="/settings"
                className="group flex w-full items-center rounded-2xl px-4 py-3 text-gray-400 hover:text-brand-dark hover:bg-white hover:shadow-sm hover:border-gray-100 transition-all font-bold mb-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 group-hover:bg-brand-gold group-hover:text-brand-dark flex items-center justify-center mr-3 transition-colors">
                  <Settings className="h-4 w-4" />
                </div>
                Settings
              </Link>
              <Link
                href="/qa"
                className="group flex w-full items-center rounded-2xl px-4 py-3 text-gray-400 hover:text-brand-dark hover:bg-white hover:shadow-sm hover:border-gray-100 transition-all font-bold mb-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 group-hover:bg-brand-gold group-hover:text-brand-dark flex items-center justify-center mr-3 transition-colors">
                  <FlaskConical className="h-4 w-4" />
                </div>
                API QA
              </Link>
            </div>

            <div className="mt-auto mb-8 p-6 rounded-3xl bg-brand-dark text-white relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-brand-gold/10 rounded-full blur-xl"></div>
              <ShieldCheck className="w-8 h-8 text-brand-gold mb-4" />
              <h5 className="font-bold mb-2">Aegis Score</h5>
              <p className="text-[10px] text-gray-400 leading-relaxed mb-4">You are 15 points away from unlocking &quot;Elite&quot; status for low-interest loans.</p>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div className="bg-brand-gold h-full w-[85%]"></div>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden pb-24 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 md:hidden pb-safe">
        <Link href="/dashboard" className="flex flex-col items-center text-brand-dark">
          <Home className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </Link>
        <Link href="/intake" className="flex flex-col items-center text-gray-400 hover:text-brand-dark transition-colors">
          <FileText className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Intake</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center text-gray-400 hover:text-brand-dark transition-colors">
          <History className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-widest">History</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center text-gray-400 hover:text-brand-dark transition-colors">
          <Settings className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
        </Link>
        <Link href="/qa" className="flex flex-col items-center text-gray-400 hover:text-brand-dark transition-colors">
          <FlaskConical className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-widest">QA</span>
        </Link>
      </nav>
    </div>
  );
}
