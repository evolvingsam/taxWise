import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthSidebar } from "@/components/auth/AuthSidebar";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side: Constantly changing texts */}
      <AuthSidebar />

      {/* Right side: Form */}
      <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-24 justify-center bg-white">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-brand-dark transition-colors mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
          </Link>
          
          <div className="mb-10 animate-fade-in-up [animation-delay:200ms] opacity-0">
            <h2 className="text-3xl font-bold font-space text-brand-dark tracking-tight mb-2">Sign in to your account</h2>
            <p className="text-gray-500">Enter your credentials to access your dashboard.</p>
          </div>
          
          <form className="space-y-6">
            <div className="space-y-2 animate-fade-in-up [animation-delay:300ms] opacity-0">
              <label htmlFor="email" className="block text-sm font-bold text-brand-dark uppercase tracking-wider">Email Address</label>
              <input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-bold text-brand-dark uppercase tracking-wider">Password</label>
                <Link href="#" className="text-sm font-bold text-brand-gold hover:text-brand-dark transition-colors">Forgot password?</Link>
              </div>
              <input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                required
              />
            </div>
            
            <div className="pt-2 animate-fade-in-up [animation-delay:500ms] opacity-0">
              <Link href="/dashboard" className="w-full flex justify-center items-center py-4 rounded-xl bg-brand-dark text-white font-bold tracking-wide hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 shadow-md">
                Sign In securely
              </Link>
            </div>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-500 font-medium animate-fade-in-up [animation-delay:600ms] opacity-0">
            Don't have an account? <Link href="/signup" className="text-brand-dark font-bold hover:text-brand-gold transition-colors">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
