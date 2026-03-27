"use client";

import { useState } from "react";
import { LogOut, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";

export function LogoutButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast.success("Signed out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to sign out cleanly");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
      >
        <LogOut className="h-5 w-5" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Sign Out"
        description="Are you sure you want to end your secure session?"
      >
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-50 text-red-600 mb-6">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <p className="text-xs font-bold uppercase tracking-widest">
            Always protect your Aegis Score on public devices.
          </p>
        </div>
        
        <div className="flex gap-4 w-full">
          <Button 
            variant="outline" 
            className="w-full rounded-xl border-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            className="w-full rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-md border-0"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? "Signing Out..." : "Sign Out"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
