import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagneticButton } from './MagneticButton';
import {
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLaunchDemo = () => {
    navigate('/demo');
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#6d55bd] text-white text-xs font-medium py-2 px-4 text-center flex items-center justify-center gap-2 select-none">
        <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold">
          <Sparkles className="w-3 h-3" /> New
        </span>
        <span className="truncate">
          AI-Native Knowledge Vault 2.0 is live: Experience dynamic neural graph expansion.
        </span>
        <button
          onClick={handleLaunchDemo}
          className="underline hover:text-white/80 inline-flex items-center gap-0.5 text-xs font-semibold ml-1"
        >
          <span>Try Demo</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main SaaS Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#eaecf0] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#6d55bd] flex items-center justify-center text-white shadow-sm group-hover:bg-[#5b45a3] transition">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-[#100f12]">
                Brain Vault
              </span>
              <span className="text-[10px] text-[#65646e] font-medium -mt-1 tracking-wider uppercase">
                Neural Graph AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#4b5563]">
            <Link
              to="/product"
              className="px-3 py-2 rounded-lg hover:text-[#100f12] hover:bg-[#f9fafb] transition"
            >
              Product
            </Link>
            <Link
              to="/solutions"
              className="px-3 py-2 rounded-lg hover:text-[#100f12] hover:bg-[#f9fafb] transition"
            >
              Solutions
            </Link>
            <Link
              to="/customers"
              className="px-3 py-2 rounded-lg hover:text-[#100f12] hover:bg-[#f9fafb] transition"
            >
              Customers
            </Link>
            <Link
              to="/pricing"
              className="px-3 py-2 rounded-lg hover:text-[#100f12] hover:bg-[#f9fafb] transition"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 rounded-lg hover:text-[#100f12] hover:bg-[#f9fafb] transition"
            >
              About
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handleLaunchDemo}
              className="text-sm font-medium text-[#4b5563] hover:text-[#100f12] px-3 py-2 rounded-lg hover:bg-[#f9fafb] transition"
            >
              Log in
            </button>

            {/* Magnetic Button: Try Demo */}
            <MagneticButton
              onClick={handleLaunchDemo}
              className="px-4 py-2 rounded-xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white text-sm font-semibold shadow-[0_2px_10px_rgba(109,85,189,0.35)] hover:shadow-[0_4px_16px_rgba(109,85,189,0.45)] transition flex items-center gap-1.5"
            >
              <span>Try Demo</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <MagneticButton
              onClick={handleLaunchDemo}
              className="px-3 py-1.5 rounded-lg bg-[#6d55bd] text-white text-xs font-semibold"
            >
              Try Demo
            </MagneticButton>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4b5563] hover:text-[#100f12] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#eaecf0] px-4 pt-2 pb-4 space-y-1 text-sm font-medium">
            <Link
              to="/product"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#f9fafb] text-[#100f12]"
            >
              Product
            </Link>
            <Link
              to="/solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#f9fafb] text-[#100f12]"
            >
              Solutions
            </Link>
            <Link
              to="/customers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#f9fafb] text-[#100f12]"
            >
              Customers
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#f9fafb] text-[#100f12]"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-[#f9fafb] text-[#100f12]"
            >
              About
            </Link>
            <div className="pt-2 border-t border-[#eaecf0] flex flex-col gap-2">
              <button
                onClick={handleLaunchDemo}
                className="w-full py-2.5 rounded-xl bg-[#6d55bd] text-white font-semibold text-center shadow-sm"
              >
                Try Demo Now
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
