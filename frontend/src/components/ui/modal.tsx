"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 transition-all duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        className={`relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300 transform ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
      >
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-brand-dark hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-8">
            <h2 className="text-2xl font-black font-space tracking-tight text-brand-dark">{title}</h2>
            {description && <p className="text-gray-500 text-sm mt-2 leading-relaxed">{description}</p>}
          </div>

          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
