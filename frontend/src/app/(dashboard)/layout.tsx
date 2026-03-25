import Link from "next/link";
import { LogOut, Home, FileText, History, Settings } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 py-4 mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold font-space">
              TE
            </div>
            <span className="font-space font-semibold tracking-tight text-lg hidden sm:inline-block">
              TaxEase Panel
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:inline-block">Adeola Chinedu</span>
            <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-primary/20 flex items-center justify-center text-sm font-medium">
              AC
            </div>
            <Link href="/" className="text-slate-400 hover:text-slate-600">
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 px-4 py-8 mx-auto">
        <aside className="fixed top-20 z-30 -ml-2 hidden h-[calc(100vh-5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pl-8 pr-6 border-r text-sm">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold tracking-tight">
              Main Menu
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm">
              <Link
                href="/dashboard"
                className="group flex w-full items-center rounded-md border border-transparent px-2 py-2 text-primary bg-blue-50/50 hover:underline mb-1"
              >
                <Home className="h-4 w-4 mr-2" /> Overview
              </Link>
              <Link
                href="/intake"
                className="group flex w-full items-center rounded-md border border-transparent px-2 py-2 text-muted-foreground hover:bg-slate-100 mb-1"
              >
                <FileText className="h-4 w-4 mr-2" /> New Assessment
              </Link>
              <Link
                href="/history"
                className="group flex w-full items-center rounded-md border border-transparent px-2 py-2 text-muted-foreground hover:bg-slate-100 mb-1"
              >
                <History className="h-4 w-4 mr-2" /> Ledger History
              </Link>
              <Link
                href="/settings"
                className="group flex w-full items-center rounded-md border border-transparent px-2 py-2 text-muted-foreground hover:bg-slate-100 mb-1"
              >
                <Settings className="h-4 w-4 mr-2" /> Settings
              </Link>
            </div>
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
