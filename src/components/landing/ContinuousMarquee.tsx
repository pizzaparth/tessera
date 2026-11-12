import React from 'react';
import {
  Sparkles,
  Cpu,
  Activity,
  Layers,
  Zap,
  GitBranch,
  ShieldCheck,
  Code2,
} from 'lucide-react';

const ROW_ONE = [
  { label: 'Claude 3.7 Sonnet', badge: 'Frontier AI', color: 'text-amber-500' },
  { label: '60 FPS Canvas Engine', badge: 'Retina 2D', color: 'text-emerald-500' },
  { label: 'GPT-4o & o1 Reasoning', badge: 'Synthesis', color: 'text-purple-500' },
  { label: 'Spring-Coulomb Physics', badge: 'N-Body', color: 'text-cyan-500' },
  { label: 'DeepSeek R1 / V3', badge: 'Reasoning', color: 'text-rose-500' },
  { label: 'AMOLED Pure Black (#000000)', badge: 'OLED', color: 'text-violet-500' },
  { label: 'Gemini 2.0 Flash', badge: 'Multimodal', color: 'text-amber-500' },
  { label: 'Bidirectional [[Wikilinks]]', badge: 'Synaptic', color: 'text-emerald-500' },
  { label: '100% Local-First Privacy', badge: 'Zero Cost', color: 'text-cyan-500' },
];

const ROW_TWO = [
  { label: 'Created by Parth Pancholi', badge: 'Hobby Project', color: 'text-purple-600' },
  { label: 'Dynamic Graph Expansion', badge: 'Realtime', color: 'text-amber-500' },
  { label: 'Degree-Scaled Node Radii', badge: 'Topology', color: 'text-emerald-500' },
  { label: 'Zero-Wire Visual Clutter', badge: 'Clarity', color: 'text-cyan-500' },
  { label: 'Neighborhood Focus Halos', badge: 'Optics', color: 'text-rose-500' },
  { label: 'KaTeX Math Equations', badge: 'LaTeX', color: 'text-violet-500' },
  { label: 'Markdown GFM Editor', badge: 'Dual View', color: 'text-emerald-500' },
  { label: 'Free & Open Source forever', badge: 'MIT', color: 'text-amber-500' },
];

export const ContinuousMarquee: React.FC = () => {
  return (
    <div className="py-12 bg-white border-y border-[#eaecf0] overflow-hidden select-none space-y-4">
      {/* Marquee Row 1 (Leftward) */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee-left flex items-center gap-4 py-1">
          {[...ROW_ONE, ...ROW_ONE].map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#fafafa] border border-[#eaecf0] text-xs font-medium text-[#100f12] shadow-sm hover:border-[#6d55bd] transition-colors shrink-0"
            >
              <span className={`w-2 h-2 rounded-full bg-current ${item.color} animate-pulse`} />
              <span className="font-semibold">{item.label}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-[#e5e7eb] text-[#6b7280]">
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 (Rightward) */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee-right flex items-center gap-4 py-1">
          {[...ROW_TWO, ...ROW_TWO].map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#fafafa] border border-[#eaecf0] text-xs font-medium text-[#100f12] shadow-sm hover:border-[#6d55bd] transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#6d55bd]" />
              <span className="font-semibold">{item.label}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-[#e5e7eb] text-[#6b7280]">
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
