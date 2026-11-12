import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MagneticButton } from './MagneticButton';
import {
  Share2,
  ArrowRight,
  Sparkles,
  Github,
  Heart,
  ShieldCheck,
  Cpu,
  Activity,
} from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#f9fafb] border-t border-[#eaecf0] text-sm text-[#65646e] select-none">
      {/* Top Pre-Footer Callout Banner */}
      <div className="border-b border-[#eaecf0] bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-black text-white p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#6d55bd]/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="space-y-3 relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#00f5ff] text-xs font-mono border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero-Barrier Live Playground</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to explore your personal second brain?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Launch the full AMOLED desktop app right inside your browser. No sign-up, no credit card, no telemetry.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <MagneticButton
              onClick={() => navigate('/demo')}
              className="px-6 py-3.5 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-sm shadow-xl transition flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Desktop Demo</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Bio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black border border-white/20 flex items-center justify-center shadow-sm">
                <Share2 className="w-4 h-4 text-[#00f5ff] -rotate-12" />
              </div>
              <span className="font-extrabold text-lg text-[#100f12] tracking-tight">
                Brain Vault
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#fdf2f8] text-[#db2777] font-bold border border-[#fbcfe8]">
                Hobby Project
              </span>
            </div>

            <p className="text-xs text-[#65646e] max-w-sm leading-relaxed">
              An AMOLED neural graph engine and multi-model AI assistant designed to explore high-performance 2D force physics and dynamic knowledge synthesis.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-[#6b7280]">
              <span className="flex items-center gap-1.5 font-medium text-[#100f12]">
                <Heart className="w-3.5 h-3.5 text-[#db2777] fill-current" />
                Handcrafted by Parth Pancholi
              </span>
              <span>•</span>
              <a
                href="https://github.com/pizzaparth/tessera"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#6d55bd] flex items-center gap-1 font-mono text-xs transition"
              >
                <Github className="w-3.5 h-3.5" />
                <span>pizzaparth/tessera</span>
              </a>
            </div>
          </div>

          {/* Quick Anchor Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#100f12]">
              Exploration
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#graph-engine" className="hover:text-[#6d55bd] transition">
                  60 FPS Physics Engine
                </a>
              </li>
              <li>
                <a href="#ai-synthesis" className="hover:text-[#6d55bd] transition">
                  Universal AI Expander
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-[#6d55bd] transition">
                  Architecture Pipeline
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#6d55bd] transition">
                  AMOLED 0x0 Base
                </a>
              </li>
              <li>
                <a href="#creator" className="hover:text-[#6d55bd] transition">
                  About Parth Pancholi
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#100f12]">
              Technical Stack
            </h5>
            <ul className="space-y-2 text-xs font-mono text-[#65646e]">
              <li>HTML5 Canvas 2D Retina</li>
              <li>Hooke & Coulomb N-Body</li>
              <li>Claude, GPT-4o, DeepSeek, Gemini</li>
              <li>Markdown GFM & KaTeX</li>
              <li>Local-First Storage</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-[#eaecf0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9ca3af]">
          <div>
            © {new Date().getFullYear()} Brain Vault. Non-commercial personal hobby project created by Parth Pancholi.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-[#10b981]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              100% Client-Side Engine
            </span>
            <span>•</span>
            <span className="text-[#6d55bd]">MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
