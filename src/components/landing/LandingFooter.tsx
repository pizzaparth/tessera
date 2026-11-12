import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagneticButton } from './MagneticButton';
import { Layers, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#f9fafb] border-t border-[#eaecf0] text-sm text-[#65646e] select-none">
      {/* Top Banner: See what your favorite AI says */}
      <div className="border-b border-[#eaecf0] bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ebe5ff] flex items-center justify-center text-[#6d55bd]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-base text-[#100f12]">
                Ask your frontier AI model about Brain Vault
              </h4>
              <p className="text-xs text-[#65646e]">
                Compare our 60 FPS 2D canvas graph engine and multi-model routing with legacy note apps.
              </p>
            </div>
          </div>
          <MagneticButton
            onClick={() => navigate('/demo')}
            className="px-5 py-2.5 rounded-xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white font-semibold text-xs shadow-md transition flex items-center gap-2"
          >
            <span>Try Interactive Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </MagneticButton>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/assets/rootly/rootly-full-logo-black.svg"
                alt="Rootly"
                className="h-6 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-[#65646e] max-w-sm leading-relaxed">
              The AI-native personal knowledge base and 2D canvas graph engine.
              Connect any frontier model, brainstorm seamlessly, and watch your thoughts interlink.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#059669] text-xs font-medium border border-[#a7f3d0]">
                <CheckCircle2 className="w-3 h-3" />
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#100f12]">Product</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/product" className="hover:text-[#6d55bd] transition">
                  Graph Engine
                </Link>
              </li>
              <li>
                <Link to="/product" className="hover:text-[#6d55bd] transition">
                  Universal AI Plugin
                </Link>
              </li>
              <li>
                <Link to="/product" className="hover:text-[#6d55bd] transition">
                  Wikilinks & Markdown
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-[#6d55bd] transition">
                  Live Interactive Demo
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#6d55bd] transition">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#100f12]">Solutions</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/solutions" className="hover:text-[#6d55bd] transition">
                  For Researchers
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-[#6d55bd] transition">
                  For Systems Thinkers
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-[#6d55bd] transition">
                  For Engineers
                </Link>
              </li>
              <li>
                <Link to="/customers" className="hover:text-[#6d55bd] transition">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-[#6d55bd] transition">
                  Literature Synthesis
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Resources */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#100f12]">Company</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-[#6d55bd] transition">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#6d55bd] transition">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#6d55bd] transition">
                  Reliability Tenets
                </Link>
              </li>
              <li>
                <Link to="/customers" className="hover:text-[#6d55bd] transition">
                  Testimonials
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/pizzaparth/tessera"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#6d55bd] transition"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-[#eaecf0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} Brain Vault Inc. All rights reserved. Built with pride for deep thinkers.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#100f12] cursor-pointer">Privacy policy</span>
            <span className="hover:text-[#100f12] cursor-pointer">Terms of service</span>
            <span className="hover:text-[#100f12] cursor-pointer">Security disclosure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
