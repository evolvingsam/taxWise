"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { Home, FileText, History, Search, Settings } from "lucide-react";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { useAuth } from "@/lib/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/intake", label: "Smart Intake", icon: FileText },
  { href: "/history", label: "Ledger History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
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
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12 px-4 lg:px-8 py-10 mx-auto">
        <aside className="fixed top-24 z-30 -ml-2 hidden h-[calc(100vh-8rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full pb-8 pr-6 border-r border-gray-100 text-sm flex flex-col justify-between">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex w-full items-center rounded-2xl px-4 py-3 font-bold mb-2 transition-all ${
                      isActive
                        ? "text-brand-dark bg-white shadow-sm border border-gray-100"
                        : "text-gray-400 hover:text-brand-dark hover:bg-white hover:shadow-sm hover:border-gray-100"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors ${
                      isActive
                        ? "bg-brand-dark text-brand-gold group-hover:scale-110 transition-transform"
                        : "bg-gray-100 text-gray-400 group-hover:bg-brand-gold group-hover:text-brand-dark"
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3 px-2">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-dark text-brand-gold flex items-center justify-center font-bold shadow-sm">
                  {initials}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-bold text-brand-dark leading-tight truncate">
                    {user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email : "TaxWise User"}
                  </div>
                  <div className="text-[10px] text-brand-gold font-bold uppercase tracking-widest mt-1">
                    {user?.user_type || "Verified"}
                  </div>
                </div>
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
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center transition-colors ${isActive ? "text-brand-dark" : "text-gray-400 hover:text-brand-dark"}`}>
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
