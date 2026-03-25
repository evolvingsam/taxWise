import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Mic, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 bg-linear-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Tax Assessment Made Simple for Nigerians
          </div>

          <h1 className="font-space text-4xl md:text-6xl font-bold tracking-tight max-w-3xl text-slate-900">
            Smart AI-Powered Tax Intake & Assessment
          </h1>

          <p className="max-w-[600px] text-lg text-slate-600 md:text-xl leading-relaxed">
            Submit your financial information securely through text, voice, or document upload. We automatically structure the data and determine your exact tax obligation instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-8 text-base font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-space text-3xl font-bold tracking-tight sm:text-4xl">
              Three Simple Ways to Submit
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Our AI engine understands your context regardless of how you prefer to share your financial information.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="font-space text-xl font-semibold mb-3">Typed Text</h3>
              <p className="text-slate-600">
                Simply type out your earnings, expenses, and other details in plain English. We extract what matters.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <Mic className="h-7 w-7" />
              </div>
              <h3 className="font-space text-xl font-semibold mb-3">Voice Input</h3>
              <p className="text-slate-600">
                Speak directly into your phone. Describe your financial status and let the AI transcribe and structure it.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="font-space text-xl font-semibold mb-3">Document Upload</h3>
              <p className="text-slate-600">
                Upload receipts or ledgers. Our system extracts the key metrics necessary for assessment securely.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
