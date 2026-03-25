"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    tag: "Client Portal",
    title: "Welcome back to intelligent compliance.",
    desc: "Access your Aegis Score, manage your assessed liabilities, and handle your 2026 filings with zero friction."
  },
  {
    tag: "Join 10k+ businesses",
    title: "Stop guessing your tax liabilities.",
    desc: "Upload your documents or voice notes, and let our AI handle the complex calculations. Accuracy guaranteed, penalties avoided."
  },
  {
    tag: "Aegis Vision",
    title: "Transforming compliance into wealth.",
    desc: "The intelligent tax filing and financial identity platform for every hardworking Nigerian."
  }
];

export function AuthSidebar() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex flex-col w-1/2 bg-brand-dark text-white p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
      
      <Link href="/" className="relative z-10 flex items-center gap-2 mb-auto">
        <span className="font-space font-extrabold text-3xl tracking-tighter text-white">
          TAX<span className="text-brand-gold">WISE</span>
        </span>
      </Link>
      
      <div className="relative z-10 my-auto max-w-lg min-h-[250px] flex flex-col justify-center">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? "opacity-100 translate-y-0 relative z-20 pointer-events-auto" 
                : "opacity-0 translate-y-8 absolute z-0 pointer-events-none"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-brand-gold text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
              {slide.tag}
            </div>
            <h1 className="text-4xl lg:text-5xl font-space font-bold tracking-tight mb-6 leading-tight">
              {slide.title}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              {slide.desc}
            </p>
          </div>
        ))}

        <div className="flex gap-2 mt-8 absolute -bottom-12">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentSlide ? "w-8 bg-brand-gold" : "w-4 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10 mt-auto text-sm text-gray-500">
        &copy; {new Date().getFullYear()} TaxWise AI Platform.
      </div>
    </div>
  );
}
