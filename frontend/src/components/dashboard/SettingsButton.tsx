"use client";

import { useState } from "react";
import { Settings, Wrench } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export function SettingsButton({ mobile = false }: { mobile?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {mobile ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center text-gray-400 hover:text-brand-dark transition-colors"
        >
          <Settings className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex w-full items-center rounded-2xl px-4 py-3 text-gray-400 hover:text-brand-dark hover:bg-white hover:shadow-sm hover:border-gray-100 transition-all font-bold mb-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 group-hover:bg-brand-gold group-hover:text-brand-dark flex items-center justify-center mr-3 transition-colors">
            <Settings className="h-4 w-4" />
          </div>
          Settings
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Feature in Development"
        description="The detailed account settings center is currently being upgraded for the 2026 Tax Season."
      >
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6 animate-pulse">
            <Wrench className="w-8 h-8 text-brand-gold" />
          </div>
          <p className="text-sm font-bold text-gray-500 max-w-xs leading-relaxed">
            Our engineers are finalizing the integration with partner banks for the Elite Aegis tier. Updates rolling out shortly.
          </p>
        </div>
        
        <div className="pt-4">
          <Button 
            className="w-full rounded-xl bg-brand-dark text-white shadow-xl hover:bg-brand-gold hover:text-brand-dark transition-all"
            onClick={() => setIsOpen(false)}
          >
            Got it
          </Button>
        </div>
      </Modal>
    </>
  );
}
