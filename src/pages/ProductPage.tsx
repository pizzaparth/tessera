import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { MagneticButton } from '../components/landing/MagneticButton';
import {
  Sparkles,
  GitBranch,
  FileText,
  Cpu,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';

export const ProductPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#100f12] font-sans selection:bg-[#ebe5ff] selection:text-[#6d55bd]">
      <LandingNavbar />

      {/* Hero */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#eaecf0] bg-[#faf9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebe5ff] text-[#6d55bd] text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Product Architecture & Features</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#100f12] max-w-4xl mx-auto leading-tight">
            Engineered from first principles for non-linear thought.
          </h1>

          <p className="text-base sm:text-lg text-[#65646e] max-w-2xl mx-auto leading-relaxed">
            Explore the core architectural primitives of Brain Vault: 60 FPS HTML5 Canvas graph physics, universal multi-model AI routing, and bidirectional Markdown wikilinks.
          </p>

          <div className="pt-2">
            <MagneticButton
              onClick={() => navigate('/demo')}
              className="px-7 py-3.5 rounded-2xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white font-semibold text-sm shadow-md transition flex items-center gap-2 mx-auto"
            >
              <span>Try Demo in Browser</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Feature Pillar 1: Graph Engine */}
      <section className="py-20 md:py-28 border-b border-[#eaecf0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-[#6d55bd]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#100f12] tracking-tight">
              High-DPI 2D Canvas Graph Physics
            </h2>
            <p className="text-sm sm:text-base text-[#65646e] leading-relaxed">
              Native graph views often choke on large vaults with DOM overhead. Brain Vault renders on an optimized HTML5 Canvas with devicePixelRatio scaling, Hooke’s Law spring attraction, and Coulomb many-body repulsion.
            </p>
            <ul className="space-y-3 text-xs text-[#100f12]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span><strong>Unlabeled Connecting Wires:</strong> Delicate, clean edges with zero label text clutter.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span><strong>Degree-Scaled Radii:</strong> Nodes scale smoothly with degree connectivity.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span><strong>Neighborhood Glow:</strong> Hovering a node highlights immediate 1-hop neighbors and dims background noise.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#000000] rounded-3xl p-8 border border-[#1e1e1e] text-white space-y-4 shadow-xl">
            <div className="text-xs font-mono text-[#9d4edd]">// Live Physics Model Formula</div>
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222222] font-mono text-xs text-[#00f5ff] space-y-1">
              <div>F_spring = (distance - linkDistance) * 0.04 * linkForce</div>
              <div>F_coulomb = (repelForce * 18) / (distance^2 + 100)</div>
              <div>F_gravity = (0 - position) * 0.0045 * centerForce</div>
              <div className="text-[#00ff88]">radius = max(5, 5 + sqrt(degree) * 2.8)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar 2: Universal AI Plugin */}
      <section className="py-20 md:py-28 border-b border-[#eaecf0] bg-[#faf9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-3xl p-8 border border-[#eaecf0] space-y-4 shadow-xl order-2 lg:order-1">
            <div className="text-xs font-mono text-[#6d55bd] uppercase font-semibold">Universal AI Model Matrix</div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#faf9ff] border border-[#eaecf0] flex items-center justify-between">
                <span className="font-semibold text-[#100f12]">Anthropic Claude</span>
                <span className="text-[#65646e] font-mono">claude-3-5-sonnet, claude-3-7-sonnet</span>
              </div>
              <div className="p-3 rounded-xl bg-[#faf9ff] border border-[#eaecf0] flex items-center justify-between">
                <span className="font-semibold text-[#100f12]">OpenAI</span>
                <span className="text-[#65646e] font-mono">gpt-4o, gpt-4o-mini, o1 reasoning</span>
              </div>
              <div className="p-3 rounded-xl bg-[#faf9ff] border border-[#eaecf0] flex items-center justify-between">
                <span className="font-semibold text-[#100f12]">Google Gemini</span>
                <span className="text-[#65646e] font-mono">gemini-2.0-flash, gemini-1.5-pro</span>
              </div>
              <div className="p-3 rounded-xl bg-[#faf9ff] border border-[#eaecf0] flex items-center justify-between">
                <span className="font-semibold text-[#100f12]">DeepSeek</span>
                <span className="text-[#65646e] font-mono">deepseek-chat V3, deepseek-reasoner R1</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <div className="w-12 h-12 rounded-2xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-[#6d55bd]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#100f12] tracking-tight">
              Universal AI Assistant Plugin
            </h2>
            <p className="text-sm sm:text-base text-[#65646e] leading-relaxed">
              Don’t let your notes be isolated from frontier intelligence. Our embedded AI assistant directly participates in your vault, analyzing your active note and dynamically injecting new concepts and connections into the graph.
            </p>
            <div className="pt-2">
              <MagneticButton
                onClick={() => navigate('/demo')}
                className="px-6 py-3 rounded-xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white text-xs font-semibold shadow-sm transition"
              >
                Try Multi-Model Demo
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
