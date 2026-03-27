"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthSidebar } from "@/components/auth/AuthSidebar";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { register } = useAuth() as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        user_type: "individual", // default for now
      });
      // Registration successful, redirect to login page
      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AuthSidebar />

      <div className="flex flex-col w-full lg:w-1/2 p-8 lg:p-24 justify-center bg-white">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-brand-dark transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
          </Link>

          <div className="mb-10 animate-fade-in-up [animation-delay:200ms] opacity-0">
            <h2 className="text-3xl font-bold font-space text-brand-dark tracking-tight mb-2">Start your compliance journey</h2>
            <p className="text-gray-500">Create a free account to assess your liability. No credit card required.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>

            <div className="space-y-2 animate-fade-in-up [animation-delay:300ms] opacity-0">
              <label htmlFor="name" className="block text-sm font-bold text-brand-dark uppercase tracking-wider">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adeola Chinedu"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                required
              />
            </div>

            <div className="space-y-2">
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
              <label htmlFor="password" className="block text-sm font-bold text-brand-dark uppercase tracking-wider">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                required
              />
            </div>

            <div className="pt-4 animate-fade-in-up [animation-delay:600ms] opacity-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 rounded-xl bg-brand-dark text-white font-bold tracking-wide hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium pb-10 animate-fade-in-up [animation-delay:700ms] opacity-0">
            Already have an account? <Link href="/login" className="text-brand-dark font-bold hover:text-brand-gold transition-colors">Sign in instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
