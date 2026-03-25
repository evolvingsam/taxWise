import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-dark/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-8 animate-fade-in-up opacity-0">
        <div className="w-24 h-24 mx-auto rounded-full bg-brand-dark flex items-center justify-center shadow-xl">
          <SearchX className="w-10 h-10 text-brand-gold" />
        </div>
        
        <div className="space-y-4">
          <div className="text-brand-gold font-black tracking-[0.2em] uppercase text-xs">Error 404</div>
          <h1 className="text-4xl md:text-5xl font-black font-space tracking-tighter text-brand-dark">Page Not Found</h1>
          <p className="text-gray-500 text-lg">
            The jurisdiction or protocol you are looking for has been moved or does not exist in the current fiscal ledger.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-brand-dark text-white font-bold hover:bg-brand-gold hover:text-brand-dark transition-colors duration-300 shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
