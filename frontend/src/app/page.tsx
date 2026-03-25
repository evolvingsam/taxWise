import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Mic, FileDigit, Building2, Wallet, Users2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center bg-white w-full">
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#0A192F] pt-24 pb-32 lg:pt-32 lg:pb-40">
        {/* Abstract Geometry */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-[#112240] opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] rounded-full bg-[#112240] opacity-50 blur-3xl"></div>
        
        <div className="container relative z-10 px-4 md:px-6 mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-10 text-center lg:text-left relative z-20">
            <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIRS & FIRS Compliant
            </div>
            
            <h1 className="font-space text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Tax compliance,<br/>
              <span className="text-emerald-400">zero friction.</span>
            </h1>
            
            <p className="max-w-[550px] text-lg text-slate-300 md:text-xl leading-relaxed mx-auto lg:mx-0 font-light">
              We replace complex tax codes with intelligent parsing. Speak, upload, or type your income—TaxEase calculates your exact liability and handles the remittance instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center lg:justify-start">
              <Link 
                href="/signup" 
                className="inline-flex h-14 items-center justify-center rounded-lg bg-emerald-500 px-8 text-base font-bold text-[#0A192F] transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                Start Free Assessment
              </Link>
              <Link 
                href="/login" 
                className="inline-flex h-14 items-center justify-center rounded-lg bg-transparent border border-slate-600 px-8 text-base font-bold text-white transition-all hover:bg-slate-800"
              >
                Sign In
              </Link>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-400 font-medium justify-center lg:justify-start pt-6 border-t border-slate-800">
              <span className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400"><CheckCircle2 className="h-3 w-3" /></div> Instant</span>
              <span className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400"><CheckCircle2 className="h-3 w-3" /></div> Accurate</span>
              <span className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400"><CheckCircle2 className="h-3 w-3" /></div> Bank-level Security</span>
            </div>
          </div>
          
          {/* High-fidelity Mockup */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 lg:translate-x-12">
            <div className="relative rounded-[2rem] bg-[#112240] border border-slate-700 p-8 shadow-2xl">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full"></div>
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-slate-400 text-sm font-medium mb-1">Total Tax Liability</div>
                  <div className="text-white font-space text-4xl font-bold">₦45,000<span className="text-slate-500 text-lg">.00</span></div>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <ArrowRight className="h-5 w-5 text-emerald-400 -rotate-45" />
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="bg-[#0A192F] border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-slate-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Declared Income</div>
                      <div className="text-slate-400 text-xs">Self-employed, Q1 2025</div>
                    </div>
                  </div>
                  <div className="text-white font-medium">₦1,200,000</div>
                </div>

                <div className="bg-[#0A192F] border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-slate-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <FileDigit className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Standard Deductions</div>
                      <div className="text-slate-400 text-xs">Automated rule applied</div>
                    </div>
                  </div>
                  <div className="text-emerald-400 font-medium">-₦200,000</div>
                </div>
              </div>

              <button className="w-full h-14 rounded-xl bg-white text-[#0A192F] font-bold text-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]">
                Pay via Interswitch <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            
            {/* Floating verification badge */}
            <div className="absolute -bottom-6 -right-6 lg:-right-12 bg-white rounded-xl p-4 shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-slate-900 font-bold text-sm">Clearance Generated</div>
                <div className="text-slate-500 text-xs font-medium">Just now</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust Bar (Paystack, Interswitch visually represented textually as professional partners) */}
      <div className="w-full bg-white border-b border-slate-100 py-10">
        <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-12 text-slate-400 font-semibold tracking-wide uppercase text-sm">
          <div className="flex items-center gap-2"><Building2 className="w-5 h-5"/> FIRS Integrated</div>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2"><Users2 className="w-5 h-5"/> LIRS Partner</div>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2"><Wallet className="w-5 h-5"/> Secure Payments</div>
        </div>
      </div>

      {/* Features Section */}
      <section className="w-full py-24 lg:py-32 bg-[#F8FAFC]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mb-20 lg:mb-24">
            <h2 className="font-space text-4xl lg:text-5xl font-bold tracking-tight text-[#0A192F] mb-6">
              A workflow designed for reality.
            </h2>
            <p className="text-xl text-slate-600 font-light leading-relaxed">
              We ditched the cumbersome government forms. TaxEase uses AI to extract exactly what the tax engine needs from the formats you naturally use.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[4.5rem] left-10 right-10 h-px bg-slate-300"></div>

            {/* Feature 1 */}
            <div className="relative z-10 flex flex-col pt-8">
              <div className="h-16 w-16 rounded-2xl bg-[#0A192F] text-white flex items-center justify-center mb-8 shadow-xl">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#0A192F]">Natural Text</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-light">
                Write a simple summary of your quarterly earnings and expenses. Our NLP engine structures the figures automatically.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="relative z-10 flex flex-col pt-8">
              <div className="h-16 w-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20">
                <Mic className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#0A192F]">Voice Dictation</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-light">
                Speak directly into the app. We accurately transcribe financial terminology and recognize Nigerian speech patterns.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="relative z-10 flex flex-col pt-8">
              <div className="h-16 w-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20">
                <FileDigit className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#0A192F]">Document Upload</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-light">
                Upload bank statements or handwritten ledgers. We use advanced OCR to securely extract required data points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="bg-[#0A192F] rounded-[2.5rem] p-10 md:p-16 lg:p-20 overflow-hidden relative shadow-2xl">
            {/* BG Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-center lg:text-left">
                <h2 className="font-space text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                  Ready to gain clarity on your taxes?
                </h2>
                <p className="text-xl text-slate-400 font-light mb-0">
                  Join thousands of Nigerians managing their compliance effortlessly. No more penalties, no more guesswork.
                </p>
              </div>
              <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/signup" 
                  className="inline-flex h-16 items-center justify-center rounded-xl bg-emerald-500 px-10 text-lg font-bold text-[#0A192F] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
