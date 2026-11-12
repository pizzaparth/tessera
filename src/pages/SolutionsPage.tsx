import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { MagneticButton } from '../components/landing/MagneticButton';
import { BookOpen, Code, Compass, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const SolutionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#100f12] font-sans selection:bg-[#ebe5ff] selection:text-[#6d55bd]">
      <LandingNavbar />

      <section className="pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#eaecf0] bg-[#faf9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebe5ff] text-[#6d55bd] text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Tailored Workflows</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#100f12] max-w-4xl mx-auto leading-tight">
            Designed for those who think in complex systems.
          </h1>

          <p className="text-base sm:text-lg text-[#65646e] max-w-2xl mx-auto leading-relaxed">
            Whether you are synthesizing academic papers, architecting distributed systems, or authoring long-form thought, Brain Vault adapts to how you reason.
          </p>

          <div className="pt-2">
            <MagneticButton
              onClick={() => navigate('/demo')}
              className="px-7 py-3.5 rounded-2xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white font-semibold text-sm shadow-md transition flex items-center gap-2 mx-auto"
            >
              <span>Try Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 md:py-28 bg-white border-b border-[#eaecf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Solution 1: Researchers */}
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-8 space-y-6 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#6d55bd]" />
              </div>
              <h3 className="text-2xl font-bold text-[#100f12]">Researchers & Academics</h3>
              <p className="text-xs sm:text-sm text-[#65646e] leading-relaxed">
                Connect papers across disparate disciplines. Use AI reasoning to identify underlying analogies between cognitive science, artificial intelligence, and philosophy of mind.
              </p>
              <ul className="space-y-2 text-xs text-[#100f12]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Bidirectional citations with [[Wikilinks]]</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>AI literature synthesis & gap discovery</span>
                </li>
              </ul>
            </div>

            {/* Solution 2: Engineers */}
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-8 space-y-6 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center">
                <Code className="w-6 h-6 text-[#6d55bd]" />
              </div>
              <h3 className="text-2xl font-bold text-[#100f12]">System Architects</h3>
              <p className="text-xs sm:text-sm text-[#65646e] leading-relaxed">
                Map complex microservices, technical specifications, and architectural decision records. Navigate dependencies spatially on a high-DPI canvas.
              </p>
              <ul className="space-y-2 text-xs text-[#100f12]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Degree-scaled service connectivity view</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Clean wires with zero label noise</span>
                </li>
              </ul>
            </div>

            {/* Solution 3: Writers */}
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-8 space-y-6 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#6d55bd]" />
              </div>
              <h3 className="text-2xl font-bold text-[#100f12]">Writers & Knowledge Workers</h3>
              <p className="text-xs sm:text-sm text-[#65646e] leading-relaxed">
                Build a real second brain where insights never get lost in nested folders. Watch emergent clusters form naturally through force-directed physics.
              </p>
              <ul className="space-y-2 text-xs text-[#100f12]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Serendipitous graph exploration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Interactive AI expansion partner</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
