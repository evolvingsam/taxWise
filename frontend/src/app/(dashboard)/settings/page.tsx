"use client";

import { useEffect, useState } from "react";
import { User, Shield, Bell, Key, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isRefreshingSession, setIsRefreshingSession] = useState(false);
  const { user, updateProfile, refreshSession } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [userType, setUserType] = useState(user?.user_type || "individual");

  useEffect(() => {
    if (!user) return;
    setFirstName(user.first_name || "");
    setLastName(user.last_name || "");
    setUserType(user.user_type || "individual");
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        user_type: userType,
      });
      setIsSaving(false);
      setSaved(true);
      toast.success("Profile updated successfully");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setIsSaving(false);
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const handleSessionRefresh = async () => {
    setIsRefreshingSession(true);
    try {
      await refreshSession();
      toast.success("Session token refreshed");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to refresh session token");
    } finally {
      setIsRefreshingSession(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto animate-fade-in pb-10">
      <div>
        <h1 className="font-space text-4xl font-black tracking-tighter text-brand-dark">Settings</h1>
        <p className="text-gray-500 font-medium mt-1">
          Manage your account preferences, fiscal identity, and security.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0 animate-slide-in-left [animation-delay:100ms] opacity-0">
          {[
            { id: "profile", icon: User, label: "Personal Profile" },
            { id: "fiscal", icon: Shield, label: "Fiscal Identity" },
            { id: "notifications", icon: Bell, label: "Notifications" },
            { id: "security", icon: Key, label: "Security" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-left ${
                activeTab === tab.id 
                  ? "bg-brand-dark text-brand-gold shadow-md" 
                  : "bg-transparent text-gray-500 hover:bg-white hover:text-brand-dark hover:shadow-sm"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-brand-gold" : "text-gray-400"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 w-full bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm animate-fade-in-up [animation-delay:200ms] opacity-0 min-h-[500px]">
          
          {activeTab === "profile" && (
            <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-2xl font-black font-space tracking-tight text-brand-dark mb-1">Personal Profile</h3>
                <p className="text-sm text-gray-500">Update your basic account information.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-dark">First Name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-dark">Last Name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-dark">Email Address</label>
                  <input type="email" value={user?.email || ""} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-dark">User Type</label>
                  <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all appearance-none cursor-pointer">
                    <option value="individual">Individual</option>
                    <option value="sme">SME</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                {saved && <span className="flex items-center text-emerald-600 text-sm font-bold mr-auto animate-fade-in"><CheckCircle2 className="w-4 h-4 mr-2" /> Saved successfully</span>}
                <Button type="button" variant="outline" className="rounded-xl border-gray-200">Discard</Button>
                <Button type="submit" disabled={isSaving} className="rounded-xl bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark shadow-md px-8 disabled:opacity-50">
                  {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2"/> Save Changes</>}
                </Button>
              </div>
            </form>
          )}

          {activeTab === "fiscal" && (
            <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-2xl font-black font-space tracking-tight text-brand-dark mb-1">Fiscal Identity</h3>
                <p className="text-sm text-gray-500">Manage the credentials that make up your Aegis Score.</p>
              </div>
              
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-4 mb-8">
                <Shield className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-emerald-900 border-emerald-900 leading-none mb-1">Identity Verified</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">Your NIN is fully linked with FIRS databases. Your fiscal identity is secure and actively building credit.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-dark">National ID (NIN)</label>
                  <input disabled type="text" defaultValue="21****5689" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-dark">Tax ID (TIN)</label>
                  <input type="text" defaultValue="1004567890" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-dark">Primary Occupation / Sector</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all appearance-none cursor-pointer">
                    <option>Artisan / Trade</option>
                    <option>Freelancer / Gig Worker</option>
                    <option>Corporate Employee</option>
                    <option>SME Business Owner</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                {saved && <span className="flex items-center text-emerald-600 text-sm font-bold mr-auto animate-fade-in"><CheckCircle2 className="w-4 h-4 mr-2" /> Updated successfully</span>}
                <Button type="submit" disabled={isSaving} className="rounded-xl bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark shadow-md px-8 disabled:opacity-50">
                  {isSaving ? "Updaing..." : <><Save className="w-4 h-4 mr-2"/> Update Records</>}
                </Button>
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-2xl font-black font-space tracking-tight text-brand-dark mb-1">Notifications</h3>
                <p className="text-sm text-gray-500">Configure how TaxWise alerts you about compliance milestones.</p>
              </div>
              <div className="space-y-6">
                {[
                  { title: "Tax Assessment Results", desc: "Get notified when the AI calculates your tax bracket.", defaultOn: true },
                  { title: "Aegis Score Updates", desc: "Alerts when your credit rating changes.", defaultOn: true },
                  { title: "FIRS Regulatory Alerts", desc: "Updates about the 2026 Fiscal Policies affecting you.", defaultOn: true },
                  { title: "Marketing & Offers", desc: "Promotions from partner banks.", defaultOn: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-brand-gold/50 transition-colors">
                    <div>
                      <h4 className="font-bold text-sm text-brand-dark">{item.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.defaultOn} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-2xl font-black font-space tracking-tight text-brand-dark mb-1">Security</h3>
                <p className="text-sm text-gray-500">Manage your passwords and 2FA authentication.</p>
              </div>
              
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-dark">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-dark">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all" />
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-100 flex justify-start gap-4">
                <Button type="submit" disabled={isSaving} className="rounded-xl bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark shadow-md px-8 disabled:opacity-50">
                  {isSaving ? "Updating..." : "Update Password"}
                </Button>
                <Button type="button" variant="outline" onClick={handleSessionRefresh} disabled={isRefreshingSession} className="rounded-xl border-gray-200">
                  {isRefreshingSession ? "Refreshing Session..." : "Refresh Access Token"}
                </Button>
                {saved && <span className="flex items-center text-emerald-600 text-sm font-bold ml-auto animate-fade-in"><CheckCircle2 className="w-4 h-4 mr-2" /> Password Secured</span>}
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
