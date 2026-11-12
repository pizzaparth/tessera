import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagneticButton } from './MagneticButton';
import {
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Share2,
  Github,
  Heart,
  Activity,
  Layers,
} from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLaunchDemo = () => {
    navigate('/demo');
  };

  return (
    <>
      {/* Top Announcement Bar - Rootly Style with Hobby Project & Parth Pancholi branding */}
      <div className="bg-[#100f12] text-white text-xs font-medium py-2 px-4 text-center flex items-center justify-center gap-2 select-none border-b border-white/10">
        <span className="inline-flex items-center gap-1 bg-[#6d55bd] px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
          <Sparkles className="w-3 h-3" /> HOBBY PROJECT
        </span>
        <span className="truncate text-white/90">
          Handcrafted by <strong>Parth Pancholi</strong> • 60 FPS AMOLED Physics & Multi-Model AI Engine.
        </span>
        <button
          onClick={handleLaunchDemo}
          className="underline hover:text-[#00f5ff] inline-flex items-center gap-0.5 text-xs font-semibold ml-1 cursor-pointer transition-colors"
        >
          <span>Launch Demo</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main SaaS Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#eaecf0] transition-colors select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Creator Badge */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Logo Icon */}
            <div className="w-9 h-9 rounded-xl bg-black border border-white/20 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Share2 className="w-5 h-5 text-[#00f5ff] -rotate-12" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-[#100f12]">
                  Brain Vault
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#ebe5ff] text-[#6d55bd] font-bold">
                  2.0
                </span>
              </div>
              <span className="text-[10px] text-[#6b7280] font-mono">
                by Parth Pancholi
              </span>
            </div>
          </Link>

          {/* In-page Anchor Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-[#4b5563]">
            <a
              href="#graph-engine"
              className="px-3.5 py-2 rounded-lg hover:text-[#100f12] hover:bg-[#f9fafb] transition"
            >
              Physics Engine
            </a>
            <a
              href="#ai-synthesis"
              className="px-3.5 py-2 rounded-lg hover:text-[#100f12] hover:bg-[#f9fafb] transition"
            >
              Universal AI
            </a>
            <a
              href="#architecture"
              className="px-3.5 py-2 rounded-lg hover:text-[#100f12] hover:bg-[#f9fafb] transition"
            >
              Architecture
            </a>
            <a
              href="#features"
              className="px-3.5 py-2 rounded-lg hover:text-[#100f12] hover:bg-[#f9fafb] transition"
            >
              Capabilities
            </a>
            <a
              href="#creator"
              className="px-3.5 py-2 rounded-lg hover:text-[#100f12] hover:bg-[#f9fafb] transition flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 text-[#db2777]" />
              <span>About Creator</span>
            </a>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* GitHub Stars Link */}
            <a
              href="https://github.com/pizzaparth/tessera"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#4b5563] hover:text-[#100f12] px-3 py-2 rounded-xl border border-[#eaecf0] hover:bg-[#f9fafb] transition flex items-center gap-1.5"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            {/* Magnetic Button: Launch Live Demo */}
            <MagneticButton
              onClick={handleLaunchDemo}
              className="px-4 py-2 rounded-xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white text-xs font-semibold shadow-[0_2px_12px_rgba(109,85,189,0.35)] hover:shadow-[0_4px_18px_rgba(109,85,189,0.45)] transition flex items-center gap-1.5"
            >
              <span>Try Interactive Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </MagneticButton>
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <MagneticButton
              onClick={handleLaunchDemo}
              className="px-3 py-1.5 rounded-lg bg-[#6d55bd] text-white text-xs font-semibold"
            >
              Demo
            </MagneticButton>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4b5563] hover:text-[#100f12] rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#eaecf0] px-4 pt-2 pb-4 space-y-1 text-sm font-medium">
            <a
              href="#graph-engine"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#f9fafb] text-[#100f12]"
            >
              Physics Engine
            </a>
            <a
              href="#ai-synthesis"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#f9fafb] text-[#100f12]"
            >
              Universal AI
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#f9fafb] text-[#100f12]"
            >
              Architecture
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#f9fafb] text-[#100f12]"
            >
              Capabilities
            </a>
            <a
              href="#creator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#f9fafb] text-[#100f12]"
            >
              About Creator (Parth Pancholi)
            </a>
            <div className="pt-2 border-t border-[#eaecf0] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLaunchDemo();
                }}
                className="w-full py-2.5 rounded-xl bg-[#6d55bd] text-white font-semibold text-center text-xs shadow-sm cursor-pointer"
              >
                Launch Live Demo Interface
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
