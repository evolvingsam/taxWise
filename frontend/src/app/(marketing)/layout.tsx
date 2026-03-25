import Link from "next/link";
import { Phone, ChevronRight } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Professional Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col">
              <span className="font-space font-extrabold text-2xl tracking-tighter text-brand-dark leading-none">
                TAX<span className="text-brand-gold">WISE</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-1">AI Filing Assistant</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10 text-[13px] font-bold uppercase tracking-wider text-gray-600">
            <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
            <Link href="/aegis-vision" className="hover:text-brand-dark transition-colors">Aegis Score</Link>
            <Link href="/compliance" className="hover:text-brand-dark transition-colors">2026 Reforms</Link>
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block text-[13px] font-bold uppercase tracking-wider text-gray-600 hover:text-brand-dark transition-colors mr-2">Login</Link>
            <Link
              href="/signup"
              className="bg-brand-dark text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 shadow-sm"
            >
              Start Free Filing
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Professional Dark Footer */}
      <footer className="bg-brand-dark text-white pt-20 pb-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <span className="font-space font-extrabold text-2xl tracking-tighter text-white">
                TAX<span className="text-brand-gold">WISE</span>
              </span>
              <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-xs">
                The intelligent tax filing and financial identity platform for every Nigerian. Transforming tax compliance into wealth-building.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Our Services</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link href="/compliance" className="hover:text-brand-gold">Compliance Review</Link></li>
                <li><Link href="/aegis-vision" className="hover:text-brand-gold">Aegis Scoring</Link></li>
                <li><Link href="/coming-soon" className="hover:text-brand-gold">Pay-As-You-Earn</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link href="/aegis-vision" className="hover:text-brand-gold">The Vision</Link></li>
                <li><Link href="/coming-soon" className="hover:text-brand-gold">Contact Us</Link></li>
                <li><Link href="/login" className="hover:text-brand-gold">Client Portal</Link></li>
                <li><Link href="/coming-soon" className="hover:text-brand-gold">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Support</h4>
              <p className="text-sm text-gray-400 mb-4">Stay updated with the latest tax reforms.</p>
              <div className="flex">
                <input type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-l-md px-4 py-2 text-sm w-full focus:outline-none focus:border-brand-gold" />
                <button className="bg-brand-gold text-brand-dark p-2 rounded-r-md">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
            <div>&copy; {new Date().getFullYear()} TaxWise AI Platform. All rights reserved.</div>
            <div className="flex gap-6">
              <Link href="/coming-soon" className="hover:text-white">Terms of Use</Link>
              <Link href="/coming-soon" className="hover:text-white">Cookies Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
