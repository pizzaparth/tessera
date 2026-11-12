import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  Cpu,
  ArrowRight,
  GitBranch,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface SimulationStep {
  model: string;
  provider: 'anthropic' | 'openai' | 'deepseek' | 'google';
  color: string;
  badgeBg: string;
  query: string;
  reasoning: string;
  concepts: string[];
  connections: number;
}

const SIMULATION_DATA: SimulationStep[] = [
  {
    model: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    color: '#d97706',
    badgeBg: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    query: 'Synthesize connections between Hebbian plasticity and neural graph embeddings',
    reasoning:
      'Identifying topological manifolds: Neurons that fire together wire together. Constructing bidirectional synaptic edge weights...',
    concepts: ['[[Hebbian Plasticity]]', '[[Manifold Learning]]', '[[Synaptic Weighting]]'],
    connections: 5,
  },
  {
    model: 'GPT-4o Reasoning',
    provider: 'openai',
    color: '#10b981',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    query: 'Extract core architectural pillars of AMOLED high-DPI canvas computing',
    reasoning:
      'Calculating Coulomb repulsion coefficients. Sub-pixel anti-aliasing on 2D Retina contexts with zero-labeled wire clutter...',
    concepts: ['[[AMOLED 0x0]]', '[[Coulomb Matrix]]', '[[Subpixel Anti-Aliasing]]'],
    connections: 4,
  },
  {
    model: 'DeepSeek R1',
    provider: 'deepseek',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30',
    query: 'Resolve circular backlink dependencies in local Markdown Wikilink graph',
    reasoning:
      'Traversing Tarjan strongly connected components. Transforming undirected cycles into directed semantic hypergraphs...',
    concepts: ['[[Tarjan SCC]]', '[[Semantic Hypergraph]]', '[[Zero-Lag Wikilinks]]'],
    connections: 6,
  },
  {
    model: 'Gemini 2.0 Flash',
    provider: 'google',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    query: 'Synthesize cross-modal memory vault architecture with local-first privacy',
    reasoning:
      'Binding episodic memory vector coordinates. Zero external telemetry verified. Streaming real-time node coordinates to canvas...',
    concepts: ['[[Episodic Vectors]]', '[[Local Privacy Vault]]', '[[Client-Side Index]]'],
    connections: 4,
  },
];

export const LiveAIStreamer: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showPills, setShowPills] = useState(false);
  const [injectedCount, setInjectedCount] = useState(142);
  const [progressPercent, setProgressPercent] = useState(0);

  const currentStep = SIMULATION_DATA[currentStepIndex];

  useEffect(() => {
    let charIndex = 0;
    const fullText = currentStep.reasoning;
    setTypedText('');
    setIsTyping(true);
    setShowPills(false);

    const typeInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setTypedText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setShowPills(true);
        setInjectedCount((prev) => prev + currentStep.connections);
      }
    }, 24);

    // Progress bar runner
    const startTime = Date.now();
    const duration = 5400;
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgressPercent(pct);
    }, 50);

    const switchTimeout = setTimeout(() => {
      setCurrentStepIndex((prev) => (prev + 1) % SIMULATION_DATA.length);
    }, duration);

    return () => {
      clearInterval(typeInterval);
      clearInterval(progressInterval);
      clearTimeout(switchTimeout);
    };
  }, [currentStepIndex]);

  return (
    <div className="relative rounded-2xl bg-white border border-[#e5e7eb] shadow-xl overflow-hidden text-[#100f12]">
      {/* Top Header Bar */}
      <div className="px-5 py-3.5 bg-[#fafafa] border-b border-[#e5e7eb] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-[#100f12] flex items-center gap-1.5">
              <span>Universal AI Dynamic Expander</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
            </h4>
            <p className="text-[11px] text-[#6b7280]">
              Continuous reasoning & real-time node synthesis
            </p>
          </div>
        </div>

        {/* Model Pill */}
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${currentStep.badgeBg}`}>
          <Bot className="w-3.5 h-3.5" />
          <span>{currentStep.model}</span>
        </div>
      </div>

      {/* Progress Bar (Continuous) */}
      <div className="w-full h-1 bg-[#f3f4f6]">
        <div
          className="h-full bg-gradient-to-r from-[#6d55bd] to-[#00f5ff] transition-all duration-75"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Body */}
      <div className="p-5 space-y-4">
        {/* User Prompt */}
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#f3f4f6] text-[#4b5563] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
            You
          </div>
          <div className="text-xs font-medium text-[#374151] bg-[#f9fafb] px-3 py-2 rounded-xl border border-[#e5e7eb] w-full">
            {currentStep.query}
          </div>
        </div>

        {/* Model Streamed Reasoning */}
        <div className="flex items-start gap-2.5">
          <div
            className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-sm"
            style={{ backgroundColor: currentStep.color }}
          >
            AI
          </div>
          <div className="text-xs text-[#1f2937] leading-relaxed bg-[#f8f9ff] px-3.5 py-2.5 rounded-xl border border-[#e0e7ff] w-full min-h-[58px]">
            <span>{typedText}</span>
            {isTyping && (
              <span className="inline-block w-1.5 h-3.5 bg-[#6d55bd] ml-1 animate-pulse align-middle" />
            )}
          </div>
        </div>

        {/* Dynamic Concept Ingestion Pills */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[11px] text-[#6b7280] mb-2 font-mono">
            <span className="flex items-center gap-1 text-[#6d55bd] font-semibold">
              <Share2 className="w-3 h-3" />
              Dynamic Synaptic Injection
            </span>
            <span>Total Nodes Created: {injectedCount}</span>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {currentStep.concepts.map((concept, idx) => (
              <div
                key={idx}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-all duration-300 ${
                  showPills
                    ? 'bg-[#f5f3ff] text-[#6d55bd] border-[#ddd6fe] scale-100 opacity-100 shadow-sm'
                    : 'bg-gray-50 text-gray-400 border-gray-200 scale-95 opacity-40'
                }`}
              >
                <GitBranch className="w-3 h-3 text-[#7c3aed]" />
                <span>{concept}</span>
              </div>
            ))}
            {showPills && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold px-2 py-1 bg-emerald-50 rounded-md border border-emerald-200 animate-pulse">
                <CheckCircle2 className="w-3 h-3" />
                +{currentStep.connections} Edges Linked
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="px-5 py-2.5 bg-[#fafafa] border-t border-[#e5e7eb] flex items-center justify-between text-[11px] text-[#6b7280]">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Switch between Claude, OpenAI, Gemini & DeepSeek with 1 click</span>
        </span>
        <span className="font-mono text-[10px] text-[#9ca3af]">Latency: 18ms</span>
      </div>
    </div>
  );
};
