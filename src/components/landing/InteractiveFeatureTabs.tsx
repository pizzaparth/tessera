import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  FileText,
  Monitor,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  GitBranch,
  Layers,
  ZoomIn,
} from 'lucide-react';

interface TabItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tag: string;
  heading: string;
  description: string;
  features: string[];
  graphic: React.ReactNode;
}

export const InteractiveFeatureTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);

  const TABS: TabItem[] = [
    {
      id: 'physics',
      title: '60 FPS Graph Physics',
      subtitle: 'N-Body Electrostatic Simulation',
      icon: <Activity className="w-4 h-4" />,
      tag: 'Physics Core',
      heading: 'Smooth, organic physics calculated every single frame.',
      description:
        'Powered by a 60 FPS HTML5 Canvas engine with spring-mass-damping equations. Nodes dynamically repel through Coulomb electrostatic forces while connections maintain optimal tension through Hooke elasticity.',
      features: [
        'Degree-scaled node radii matching synaptic density',
        'Delicate connecting wires with zero label clutter',
        'Neighborhood focus highlighting with electric violet halos',
        'Cursor-centered wheel zooming and smooth drag-to-pan',
      ],
      graphic: (
        <div className="w-full h-full bg-black rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-white/60">
            <span className="flex items-center gap-1.5 text-[#00ff88]">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
              PHYSICS: 60.0 FPS ACTIVE
            </span>
            <span>COULOMB k=950 N</span>
          </div>

          {/* Animated Orbiting Ring Illustration */}
          <div className="relative w-48 h-48 mx-auto my-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-[#9d4edd]/40 animate-spin-slow" />
            <div className="absolute inset-4 rounded-full border border-dotted border-[#00f5ff]/30 animate-reverse-spin" />

            {/* Central Node */}
            <div className="w-12 h-12 rounded-full bg-[#9d4edd] shadow-[0_0_25px_#9d4edd] flex items-center justify-center text-white text-xs font-bold z-10 animate-pulse">
              Hub
            </div>

            {/* Satellite Nodes */}
            <div className="absolute top-2 left-6 w-5 h-5 rounded-full bg-[#00f5ff] shadow-[0_0_15px_#00f5ff] animate-bounce" />
            <div className="absolute bottom-3 right-6 w-6 h-6 rounded-full bg-[#00ff88] shadow-[0_0_15px_#00ff88]" />
            <div className="absolute top-10 right-2 w-4 h-4 rounded-full bg-[#ff2a85] shadow-[0_0_12px_#ff2a85]" />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-2 border-t border-white/10">
            <span>Dynamic Spring Wire: Hooke Elasticity</span>
            <span className="text-[#00f5ff]">● Zero Clutter</span>
          </div>
        </div>
      ),
    },
    {
      id: 'ai',
      title: 'Universal AI Assistant',
      subtitle: 'Dynamic Concept Expansion',
      icon: <Cpu className="w-4 h-4" />,
      tag: 'Frontier AI',
      heading: 'Reason with any model. Watch your graph expand in real time.',
      description:
        'Chat with Claude 3.7, GPT-4o, Gemini 2.0, or DeepSeek R1. When the AI proposes new concepts, they are dynamically synthesized into real interactive nodes in your live canvas graph with zero manual typing.',
      features: [
        'Universal model routing (Anthropic, OpenAI, Gemini, DeepSeek)',
        'Automatic semantic synthesis of concepts into graph nodes',
        'Interactive concept pills in chat that pan camera to new nodes',
        'Intelligent offline concept generator if no API key is supplied',
      ],
      graphic: (
        <div className="w-full h-full bg-[#09090b] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/10 text-white">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#c084fc] flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Claude 3.7 Sonnet Synthesis
            </span>
            <span className="text-emerald-400 font-bold">Live Stream</span>
          </div>

          <div className="space-y-3 my-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 font-mono">
              &quot;Synthesizing concept <span className="text-[#00f5ff]">[[Topological Data Analysis]]</span> and linking to <span className="text-[#9d4edd]">[[Manifold Learning]]</span>...&quot;
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#9d4edd]/20 border border-[#9d4edd]/40 text-[#c084fc] text-xs font-mono flex items-center gap-1 animate-pulse">
                <GitBranch className="w-3 h-3" />
                +3 Nodes Injected
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                Adjacency Matrix Updated
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-2 border-t border-white/10">
            <span>Token Streaming Latency: 16ms</span>
            <span className="text-emerald-400">● Dynamic Injection</span>
          </div>
        </div>
      ),
    },
    {
      id: 'markdown',
      title: 'Markdown & Wikilinks',
      subtitle: 'Bidirectional Backlinks',
      icon: <FileText className="w-4 h-4" />,
      tag: 'Knowledge Vault',
      heading: 'Bidirectional wikilinks that interlink your thinking.',
      description:
        'Write in clean Markdown GFM with KaTeX math equations. Type [[Note Name]] to instantly generate bidirectional connections. The bottom panel automatically shows incoming and outgoing references.',
      features: [
        'Fast dual edit and live preview modes, plus side-by-side split view',
        'Bidirectional [[Wikilinks]] with click-to-jump note navigation',
        'Linked References inspector tracking all incoming citations',
        'Local-first storage with zero cloud dependencies or tracking',
      ],
      graphic: (
        <div className="w-full h-full bg-[#0a0a0a] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/10 text-white font-mono">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Editor: Neural_Computation.md</span>
            <span className="text-[#ffb703]">GFM + KaTeX</span>
          </div>

          <div className="my-4 space-y-2 text-xs text-white/80 bg-black/60 p-4 rounded-xl border border-white/5">
            <div className="text-white/40"># Synaptic Weight Formula</div>
            <div>
              The synaptic weight <span className="text-[#00ff88]">$w_{'{ij}'}$</span> evolves via:
            </div>
            <div className="text-[#00f5ff] pl-2 border-l-2 border-[#00f5ff]">
              $\Delta w_{'{ij}'} = \eta \cdot x_i \cdot y_j$
            </div>
            <div className="text-[#c084fc] pt-2">
              See also <span className="underline cursor-pointer">[[Hebbian Plasticity]]</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/10">
            <span>Linked References: 8 incoming backlinks</span>
            <span className="text-[#ffb703]">● Instant Wiki Parse</span>
          </div>
        </div>
      ),
    },
    {
      id: 'amoled',
      title: 'AMOLED Pure Black',
      subtitle: 'Desktop Obsidian Aesthetic',
      icon: <Monitor className="w-4 h-4" />,
      tag: 'Display Perfection',
      heading: 'Designed for OLED displays. Zero backlight bleed.',
      description:
        'A desktop-grade interface styled after macOS titlebars and AMOLED studio monitors. Featuring traffic light controls, collapsible file trees, split editors, and pure #000000 pitch black contrast.',
      features: [
        '100% pure black (#000000) base for infinite OLED contrast',
        'macOS traffic light window controls and active tab strip',
        'Collapsible file tree sidebar with instant note filtering',
        'Live status bar tracking nodes, edges, words, and active model',
      ],
      graphic: (
        <div className="w-full h-full bg-black rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/15 text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="text-[11px] text-white/60 ml-2 font-mono">
                Tessera Vault • Split View
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#ff2a85]">AMOLED</span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4 h-28">
            <div className="rounded-xl border border-white/10 bg-[#050505] p-3 flex items-center justify-center text-xs text-white/50 font-mono">
              [2D Graph Canvas]
            </div>
            <div className="rounded-xl border border-white/10 bg-[#050505] p-3 flex flex-col justify-center gap-1 text-[11px] text-white/70 font-mono">
              <div className="text-[#00f5ff]"># Note Editor</div>
              <div className="text-white/40">Pure black contrast</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-2 border-t border-white/10">
            <span>Status: 48 Notes • 82 Wires</span>
            <span className="text-[#ff2a85]">● OLED True Contrast</span>
          </div>
        </div>
      ),
    },
  ];

  // Auto-cycle through tabs with continuous progress
  useEffect(() => {
    const duration = 6500;
    const intervalTime = 65;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (elapsed >= duration) {
        elapsed = 0;
        setProgress(0);
        setActiveTab((prev) => (prev + 1) % TABS.length);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [TABS.length]);

  const currentTab = TABS[activeTab];

  return (
    <section id="graph-engine" className="py-24 bg-white border-b border-[#eaecf0] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f3ff] text-[#6d55bd] text-xs font-semibold border border-[#ddd6fe]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Innovations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#100f12]">
            Four pillars of the personal second brain.
          </h2>
          <p className="text-base text-[#65646e] leading-relaxed">
            Click any tab or let the autonomous cycle guide you through the physics engine, multi-model AI synthesis, markdown wikilinks, and AMOLED aesthetics.
          </p>
        </div>

        {/* Tab Buttons Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {TABS.map((tab, idx) => {
            const isSelected = activeTab === idx;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(idx);
                  setProgress(0);
                }}
                className={`text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'bg-white border-[#6d55bd] shadow-[0_8px_24px_rgba(109,85,189,0.15)] scale-[1.02]'
                    : 'bg-[#fafafa] border-[#eaecf0] hover:bg-white hover:border-[#d1d5db]'
                }`}
              >
                {/* Continuous Progress bar on selected tab */}
                {isSelected && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-[#ebe5ff]">
                    <div
                      className="h-full bg-[#6d55bd] transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'bg-[#6d55bd] text-white shadow-sm'
                        : 'bg-[#f3f4f6] text-[#6b7280]'
                    }`}
                  >
                    {tab.icon}
                  </div>
                  <span className="font-bold text-xs text-[#100f12]">
                    {tab.title}
                  </span>
                </div>
                <div className="text-[11px] text-[#65646e] line-clamp-1">
                  {tab.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Area */}
        <div className="rounded-3xl bg-[#fafafa] border border-[#eaecf0] p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Details Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#6d55bd] text-xs font-mono font-semibold border border-[#eaecf0] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#6d55bd] animate-ping" />
              <span>{currentTab.tag}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#100f12] tracking-tight leading-snug">
              {currentTab.heading}
            </h3>

            <p className="text-sm text-[#65646e] leading-relaxed max-w-xl">
              {currentTab.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentTab.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#374151]">
                  <CheckCircle2 className="w-4 h-4 text-[#6d55bd] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <a
                href="#demo"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/demo';
                }}
                className="px-5 py-2.5 rounded-xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white text-xs font-semibold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>Launch Demo Interface</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-xs text-[#9ca3af]">
                Zero signup required • Runs in browser
              </span>
            </div>
          </div>

          {/* Right Visual Graphic Column (5 cols) */}
          <div className="lg:col-span-5 h-[340px] sm:h-[380px]">
            {currentTab.graphic}
          </div>
        </div>
      </div>
    </section>
  );
};
