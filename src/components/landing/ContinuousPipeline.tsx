import React, { useState } from 'react';
import {
  FileText,
  Share2,
  Cpu,
  Activity,
  Monitor,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  tag: string;
  desc: string;
  tech: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
  metric: string;
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Local Markdown Vault',
    tag: 'Raw Ingestion',
    desc: 'Local-first Markdown files with bidirectional [[wikilinks]] parsed in memory with zero cloud tracking.',
    tech: 'Remark GFM • KaTeX Math',
    icon: <FileText className="w-5 h-5" />,
    color: '#9d4edd',
    glow: 'rgba(157, 78, 221, 0.4)',
    metric: '< 0.2ms Parse Time',
  },
  {
    id: 2,
    title: 'Synaptic Resolver',
    tag: 'Graph Topology',
    desc: 'Adjacency matrix compiles in real time. Dynamic node degrees determine mass, radius, and gravitational pull.',
    tech: 'Degree Scaled • In/Out Matrix',
    icon: <Share2 className="w-5 h-5" />,
    color: '#00f5ff',
    glow: 'rgba(0, 245, 255, 0.4)',
    metric: 'O(V + E) Traversal',
  },
  {
    id: 3,
    title: 'Universal AI Expander',
    tag: 'Frontier AI Router',
    desc: 'Stream reasoning tokens from Claude 3.7, GPT-4o, Gemini 2.0 or DeepSeek. Injects concepts directly into the graph.',
    tech: 'Anthropic • OpenAI • DeepSeek',
    icon: <Cpu className="w-5 h-5" />,
    color: '#ffb703',
    glow: 'rgba(255, 183, 3, 0.4)',
    metric: 'Realtime Token Stream',
  },
  {
    id: 4,
    title: 'Spring-Coulomb Matrix',
    tag: 'Physics Core',
    desc: 'High-frequency physics loop evaluates N-body electrostatic repulsion and Hooke spring tension at 60 FPS.',
    tech: 'Coulomb k=950 • Hooke k=0.02',
    icon: <Activity className="w-5 h-5" />,
    color: '#00ff88',
    glow: 'rgba(0, 255, 136, 0.4)',
    metric: '60.0 FPS Physics',
  },
  {
    id: 5,
    title: 'AMOLED Retina Canvas',
    tag: 'Pixel-Perfect Render',
    desc: 'Rendered on pure black #000000 with subpixel resolution, neighborhood focus halos, and zero-clutter wires.',
    tech: 'HTML5 Canvas 2D • Subpixel Glow',
    icon: <Monitor className="w-5 h-5" />,
    color: '#ff2a85',
    glow: 'rgba(255, 42, 133, 0.4)',
    metric: '∞:1 Dynamic Contrast',
  },
];

export const ContinuousPipeline: React.FC = () => {
  const [activeStage, setActiveStage] = useState(2);

  return (
    <section id="architecture" className="py-24 bg-white border-y border-[#eaecf0] relative overflow-hidden select-none">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#6d55bd]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f3ff] text-[#6d55bd] text-xs font-semibold border border-[#ddd6fe]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Data Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#100f12]">
            From raw thought to a living neural universe.
          </h2>
          <p className="text-base text-[#65646e] leading-relaxed">
            Witness how your local markdown thoughts and frontier AI reasoning flow continuously into an interactive 60 FPS physics graph.
          </p>
        </div>

        {/* Animated Continuous Pipeline Canvas / Cards */}
        <div className="relative">
          {/* Connecting Continuous Energy Conduit Wire (Desktop) */}
          <div className="hidden lg:block absolute top-[74px] left-[6%] right-[6%] h-[3px] bg-[#eaecf0] z-0 overflow-hidden rounded-full">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#6d55bd] to-transparent animate-beam-shine" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
            {STAGES.map((stage) => {
              const isSelected = activeStage === stage.id;
              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 relative flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-white border-[#6d55bd] shadow-[0_12px_32px_rgba(109,85,189,0.18)] scale-[1.02]'
                      : 'bg-[#fafafa] border-[#eaecf0] hover:bg-white hover:border-[#d1d5db]'
                  }`}
                >
                  {/* Top Header Badge & Pulse */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: stage.color }}
                      >
                        {stage.icon}
                      </div>

                      <span className="font-mono text-[11px] font-bold text-[#6d55bd] px-2 py-0.5 rounded-full bg-[#f5f3ff] border border-[#ddd6fe]">
                        0{stage.id}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-[#65646e] uppercase tracking-wider mb-1 font-semibold">
                      {stage.tag}
                    </div>

                    <h3 className="font-bold text-sm text-[#100f12] mb-2">
                      {stage.title}
                    </h3>

                    <p className="text-xs text-[#65646e] leading-relaxed mb-4">
                      {stage.desc}
                    </p>
                  </div>

                  {/* Bottom Metric Chip */}
                  <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[#100f12] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                      {stage.metric}
                    </span>
                    <span className="text-[10px] text-[#9ca3af] font-mono">
                      {stage.tech}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Deep Dive Inspection Tray */}
        <div className="mt-8 rounded-2xl bg-[#09090b] text-white p-6 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#6d55bd]/20 blur-[90px] rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00f5ff]">
                <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-ping" />
                <span>INSPECTION CONSOLE: STAGE 0{activeStage} ACTIVE</span>
              </div>
              <h4 className="text-xl font-bold text-white">
                {STAGES[activeStage - 1].title} — Technical Implementation
              </h4>
              <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
                {STAGES[activeStage - 1].desc} Optimized for client-side execution with zero latency bottlenecks and zero server dependencies.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right font-mono text-xs hidden sm:block">
                <div className="text-white/50 text-[10px]">Benchmark</div>
                <div className="text-[#00ff88] font-bold">
                  {STAGES[activeStage - 1].metric}
                </div>
              </div>

              <a
                href="#demo"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/demo';
                }}
                className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Test in Live App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
