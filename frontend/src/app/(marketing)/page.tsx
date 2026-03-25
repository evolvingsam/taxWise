import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap, TrendingUp, Sparkles, MessageSquare, Cpu, BarChart3, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-white w-full">

      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-brand-dark/[0.02] rounded-full blur-3xl pointer-events-none"></div>

        <div className="container px-4 md:px-8 mx-auto flex flex-col items-center text-center">
          <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-dark text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
              <Zap className="w-3 h-3 fill-brand-gold" /> The 2026 Tax Reform Standard
            </div>

            <h1 className="font-space text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-brand-dark leading-[1.05] md:leading-[0.95]">
              TAX FILING, <br className="hidden md:block" />
              <span className="text-brand-gold underline decoration-brand-dark/10">ZERO FRICTION.</span>
            </h1>

            <p className="max-w-2xl text-xl md:text-2xl text-gray-400 font-medium mx-auto leading-relaxed">
              Replacing 20-page forms with a conversational AI interface. The intelligent platform for every Nigerian freelancer, artisan, and executive.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center">
              <Link
                href="/signup"
                className="group bg-brand-dark text-white px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark transition-all shadow-md flex items-center gap-3"
              >
                Start Free Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/aegis-vision"
                className="bg-white text-brand-dark border-2 border-brand-dark/5 px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:border-brand-dark transition-all"
              >
                View The Vision
              </Link>
            </div>
          </div>

          <div className="mt-24 relative w-full max-w-6xl mx-auto px-4 group">
            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-8 border-white transform hover:-rotate-1 transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop"
                alt="TaxWise Platform"
                className="w-full aspect-[16/8] object-cover ring-1 ring-gray-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent"></div>

              {/* UI Overlay Mockup */}
              <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-md border border-white/50 max-w-[280px] md:max-w-sm animate-in slide-in-from-left-10 duration-1000">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-brand-dark text-brand-gold flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Extraction</span>
                  </div>
                  <p className="text-xs font-medium text-gray-500 italic">"I earned ₦40,200 this week from my shop sales..."</p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-bold">
                    <span>Income Detected</span>
                    <span className="text-brand-gold">+₦40,200</span>
                  </div>
                </div>

                <div className="bg-brand-dark text-white p-8 rounded-[2.5rem] shadow-md border border-white/10 hidden lg:block animate-in slide-in-from-right-10 duration-1000">
                  <div className="flex items-center gap-4 mb-4">
                    <Shield className="w-6 h-6 text-brand-gold" />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Aegis Score</div>
                      <div className="text-2xl font-black font-space">842 <span className="text-sm opacity-50">/ 900</span></div>
                    </div>
                  </div>
                  <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gold w-[85%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="w-full py-24 bg-brand-dark text-white overflow-hidden">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h4 className="text-brand-gold font-bold uppercase tracking-[0.3em] text-xs">The Complexity Barrier</h4>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black font-space tracking-tighter leading-[1.1] md:leading-none">
                BUILT FOR <span className="text-white/20">CITIZENS,</span> <br />
                NOT ACCOUNTANTS.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                The Nigerian tax system is overwhelmingly complex. The 2026 reforms bring total exemptions for small businesses, but the forms look like they were written for PhDs. We bridged the gap.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  "No more 20-page cumbersome forms",
                  "Automated exemption detection for artisans",
                  "Verified fiscal identity for bank loans",
                  "Direct integration with FIRS & LIRS"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm font-bold">
                    <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-white/[0.02] rounded-full border border-white/5 flex items-center justify-center p-12">
                <div className="aspect-square w-full bg-white/[0.03] rounded-full border border-white/5 flex items-center justify-center p-12">
                  <Cpu className="w-32 h-32 text-brand-gold opacity-50 animate-pulse" />
                </div>
              </div>
              {/* Floating stats */}
              <div className="absolute top-1/4 -right-10 bg-white p-6 rounded-3xl shadow-md text-brand-dark">
                <div className="text-3xl font-black font-space tracking-tight">0%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tax for Small Biz</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions / Features Section */}
      <section className="w-full py-32 bg-[#FDFDFD]">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h4 className="text-brand-gold font-bold uppercase tracking-[0.3em] text-[10px]">The 2-Day MVP Focus</h4>
            <h2 className="text-5xl font-black font-space tracking-tighter text-brand-dark">THREE STRICTLY ESSENTIAL TOOLS</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-500 group">
              <div className="w-20 h-20 rounded-3xl bg-brand-dark text-brand-gold flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black font-space tracking-tight mb-4">Smart Intake</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Instead of filling out grids, just talk to TaxAI. Tell it about your finances in plain English, and our ML layer maps it directly to the correct brackets.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-500 group">
              <div className="w-20 h-20 rounded-3xl bg-brand-gold text-brand-dark flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <Cpu className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black font-space tracking-tight mb-4">Tax Engine</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                The core logic instantly processes your data. If you earn under ₦800k, get an immediate "Zero-Tax Exemption" certificate. No more guesswork.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-500 group">
              <div className="w-20 h-20 rounded-3xl bg-brand-dark text-brand-gold flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black font-space tracking-tight mb-4">Aegis Score</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Turn your tax history into a credit rating. Partner banks use your Aegis Score to offer loans, bridging the gap between you and the formal economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision / CTA Section */}
      <section className="w-full py-24 bg-white">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="bg-brand-dark rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 lg:p-24 overflow-hidden relative group shadow-md">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-3xl group-hover:bg-brand-gold/20 transition-all duration-1000"></div>

            <div className="max-w-3xl relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black font-space tracking-tighter text-white mb-6 md:mb-8 leading-[1.1] md:leading-none">
                READY TO BUILD YOUR <span className="text-brand-gold italic">FISCAL IDENTITY?</span>
              </h2>
              <p className="text-gray-400 text-xl font-medium mb-12 max-w-xl">
                Join thousands of Nigerians moving from the shadow economy into the banking sector through simple tax compliance.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  href="/signup"
                  className="bg-brand-gold text-brand-dark px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-3 group"
                >
                  Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-6 px-4">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-dark bg-gray-600 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-white uppercase tracking-widest">1k+ Joined Today</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-12 right-12 hidden lg:block opacity-20 hover:opacity-100 transition-opacity">
              <div className="flex flex-col items-center gap-4">
                <Lock className="w-12 h-12 text-white" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
