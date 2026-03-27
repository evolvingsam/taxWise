"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { AuthSidebar } from "@/components/auth/AuthSidebar";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setLoading(true);
    try {
      const user = await login(email, password);
      if (!user) {
        throw new Error("Login failed: no user returned");
      }
      toast.success("Successfully logged in!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to log in";
      console.error("Login error:", errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AuthSidebar />

      <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-24 justify-center bg-white">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-brand-dark transition-colors mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
          </Link>

          <div className="mb-10 animate-fade-in-up [animation-delay:200ms] opacity-0">
            <h2 className="text-3xl font-bold font-space text-brand-dark tracking-tight mb-2">Sign in to your account</h2>
            <p className="text-gray-500">Enter your credentials to access your dashboard.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2 animate-fade-in-up [animation-delay:300ms] opacity-0">
              <label htmlFor="email" className="block text-sm font-bold text-brand-dark uppercase tracking-wider">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-bold text-brand-dark uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2 animate-fade-in-up [animation-delay:500ms] opacity-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 rounded-xl bg-brand-dark text-white font-bold tracking-wide hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In securely"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium animate-fade-in-up [animation-delay:600ms] opacity-0">
            Don&apos;t have an account? <Link href="/signup" className="text-brand-dark font-bold hover:text-brand-gold transition-colors">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
