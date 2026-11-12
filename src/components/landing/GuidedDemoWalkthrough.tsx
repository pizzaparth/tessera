import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  FileText,
  Activity,
  Check,
  MousePointer,
  ExternalLink,
  ChevronRight,
  Route,
} from 'lucide-react';

interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
  cursorPos: { x: string; y: string };
  actionText: string;
}

const STEPS: StepConfig[] = [
  {
    id: 1,
    title: '1. Inspecting Graph Neighborhood',
    subtitle: 'Navigating to Cross-Sectional Momentum and isolating connected factor models.',
    cursorPos: { x: '42%', y: '48%' },
    actionText: 'Clicking node "momentum_factor"...',
  },
  {
    id: 2,
    title: '2. Opening Markdown Detail Note',
    subtitle: 'Inspecting mathematical formulations, LaTeX formulas, and Jegadeesh & Titman derivation.',
    cursorPos: { x: '78%', y: '65%' },
    actionText: 'Opening detail note drawer...',
  },
  {
    id: 3,
    title: '3. Mapping Research Conversation',
    subtitle: 'Parsing quantitative discussion on Almgren-Chriss execution drag and short-term reversal.',
    cursorPos: { x: '35%', y: '75%' },
    actionText: 'Triggering AI concept extraction...',
  },
  {
    id: 4,
    title: '4. Reviewing & Approving Proposals',
    subtitle: 'Researcher verifies proposed typed link: "Short-Term Reversal" challenges "Momentum".',
    cursorPos: { x: '68%', y: '45%' },
    actionText: 'Accepting proposal into in-memory graph...',
  },
  {
    id: 5,
    title: '5. Descriptive Graph Analytics',
    subtitle: 'Examining degree centrality hubs, bridge nodes, and domain distribution.',
    cursorPos: { x: '55%', y: '35%' },
    actionText: 'Inspecting network topology metrics...',
  },
  {
    id: 6,
    title: '6. Global Network Synthesis',
    subtitle: 'Relaxing force-directed camera back to the broader quantitative research landscape.',
    cursorPos: { x: '50%', y: '50%' },
    actionText: 'Zooming out to full network view...',
  },
];

export const GuidedDemoWalkthrough: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [clickPulse, setClickPulse] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    // Trigger click pulse halfway through each step
    const pulseTimer = setTimeout(() => {
      setClickPulse(true);
      setTimeout(() => setClickPulse(false), 500);
    }, 2000);

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 4500);

    return () => {
      clearTimeout(pulseTimer);
      clearInterval(interval);
    };
  }, [isPlaying, currentStepIndex]);

  const currentStep = STEPS[currentStepIndex];

  return (
    <div className="relative w-full rounded-2xl border border-surface-border bg-[#07090e] overflow-hidden shadow-2xl">
      {/* Top Walkthrough Navigation Header */}
      <div className="p-4 border-b border-surface-border bg-surface-elevated/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Interactive Product Walkthrough</span>
              <span className="text-[10px] font-mono font-normal text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Deterministic Demo
              </span>
            </h3>
            <p className="text-xs text-slate-400">{currentStep.subtitle}</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Step Pill Buttons */}
          <div className="flex items-center gap-1 bg-surface-card border border-surface-border p-1 rounded-lg">
            {STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`w-6 h-6 rounded text-xs font-mono font-semibold transition ${
                  currentStepIndex === idx
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={s.title}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-surface-card hover:bg-surface border border-surface-border text-slate-300 hover:text-white transition"
            title={isPlaying ? 'Pause Walkthrough' : 'Play Walkthrough'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(true);
            }}
            className="p-2 rounded-lg bg-surface-card hover:bg-surface border border-surface-border text-slate-300 hover:text-white transition"
            title="Replay from Beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Simulated Screen Stage */}
      <div className="relative w-full h-[440px] bg-[#090c14] overflow-hidden flex items-center justify-center">
        {/* Animated Background Grid & Particles */}
        <div className="absolute inset-0 bg-grid opacity-30" />

        {/* Screen 1: Graph Neighborhood Focus */}
        {currentStep.id === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full p-8 flex items-center justify-center relative"
          >
            {/* Simulated graph nodes */}
            <div className="relative w-96 h-72 border border-surface-border rounded-xl bg-[#06080d]/80 p-4">
              {/* Central selected node */}
              <div className="absolute left-[40%] top-[45%] -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl bg-rose-500/20 border-2 border-rose-400 text-rose-200 text-xs font-bold shadow-lg shadow-rose-500/20 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Momentum Factor</span>
              </div>

              {/* Neighbor 1 */}
              <div className="absolute left-[15%] top-[20%] p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
                Carhart 4-Factor (extends)
              </div>
              {/* Neighbor 2 */}
              <div className="absolute left-[70%] top-[25%] p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
                Fama-French 3-Factor
              </div>
              {/* Neighbor 3 */}
              <div className="absolute left-[65%] top-[70%] p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
                Factor Crowding (challenges)
              </div>

              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyan-500/30 stroke-1">
                <line x1="150" y1="130" x2="80" y2="70" />
                <line x1="150" y1="130" x2="270" y2="80" />
                <line x1="150" y1="130" x2="260" y2="210" strokeDasharray="3 3" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Screen 2: Note Drawer Slides In */}
        {currentStep.id === 2 && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full p-6 flex justify-end"
          >
            <div className="w-full max-w-lg h-full bg-surface border border-surface-border rounded-xl p-5 shadow-2xl space-y-3 overflow-hidden">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <span className="text-xs font-mono text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded">
                  Hypothesis / Factor Research
                </span>
                <span className="text-[10px] text-slate-500 font-mono">CRSP / Compustat Universe</span>
              </div>
              <h4 className="text-sm font-bold text-white">Cross-Sectional Momentum (12-2 Signal)</h4>
              <p className="text-xs text-slate-300">
                Jegadeesh and Titman (1993) documented persistence over 3 to 12 months. Skipping month $t-1$ circumvents short-term bid-ask bounce.
              </p>
              <div className="p-3 bg-[#06080e] border border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-300">
                {"$$\\text{Signal}_{i,t} = \\prod_{k=2}^{12} (1 + R_{i,t-k}) - 1$$"}
              </div>
              <div className="text-[11px] text-slate-400 bg-white/5 p-2.5 rounded border border-white/5">
                <strong>Provenance:</strong> Journal of Finance (1993) • 98% Extraction Confidence
              </div>
            </div>
          </motion.div>
        )}

        {/* Screen 3: Conversation Mapper Extraction */}
        {currentStep.id === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl h-full p-6 flex flex-col justify-center space-y-3"
          >
            <div className="bg-surface border border-surface-border rounded-xl p-4 space-y-2.5 shadow-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Concept Extraction in Progress</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">Stateless Proxy</span>
              </div>
              <div className="p-3 bg-[#06080e] rounded-lg text-xs text-slate-300 font-mono border border-surface-border">
                "Researcher: At the 1-month horizon, returns are dominated by bid-ask bounce and inventory adjustments..."
              </div>
              <div className="flex items-center gap-2 text-xs text-cyan-300">
                <span className="w-3 h-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <span>Identifying typed relationship: Short-Term Reversal → challenges → Momentum Factor</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Screen 4: Extraction Review Queue */}
        {currentStep.id === 4 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-xl h-full p-6 flex flex-col justify-center space-y-3"
          >
            <div className="bg-surface-card border border-emerald-500/40 rounded-xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Proposed Concept: Short-Term Reversal Anomaly</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  96% Confidence
                </span>
              </div>
              <p className="text-xs text-slate-300">
                1-month equity reversals driven by dealer inventory hedging and liquidity imbalances.
              </p>
              <div className="p-2.5 bg-[#06080e] rounded border border-surface-border text-xs flex items-center justify-between">
                <span className="text-cyan-400 font-mono text-[11px]">Proposed typed link:</span>
                <span className="text-amber-400 font-mono text-[11px]">challenges → Momentum Factor</span>
                <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px]">
                  Approved ✓
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Screen 5: Analytics Charts */}
        {currentStep.id === 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl h-full p-6 grid grid-cols-2 gap-4 items-center"
          >
            <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Domain Cluster Volume
              </span>
              <div className="space-y-1.5 pt-1">
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Factor Research</span>
                    <span className="font-mono text-white">5 concepts</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full w-[80%]" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Market Microstructure</span>
                    <span className="font-mono text-white">3 concepts</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[55%]" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Execution & Trading</span>
                    <span className="font-mono text-white">2 concepts</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full w-[40%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-2">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                Top Degree Hubs
              </span>
              <div className="space-y-1 text-xs">
                <div className="p-1.5 rounded bg-white/5 flex justify-between">
                  <span className="text-white">Fama-French 3-Factor</span>
                  <span className="font-mono text-cyan-300">4 links</span>
                </div>
                <div className="p-1.5 rounded bg-white/5 flex justify-between">
                  <span className="text-white">Kyle's Lambda</span>
                  <span className="font-mono text-cyan-300">3 links</span>
                </div>
                <div className="p-1.5 rounded bg-white/5 flex justify-between">
                  <span className="text-white">Almgren-Chriss</span>
                  <span className="font-mono text-cyan-300">3 links</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Screen 6: Full Network Zoom Out */}
        {currentStep.id === 6 && (
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-full flex flex-col items-center justify-center text-center p-8 space-y-3"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
              <Route className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">
              Complete Knowledge Graph Unified
            </h4>
            <p className="text-xs text-slate-400 max-w-md">
              15+ interconnected quantitative concepts, mathematical proofs, typed relationships, and editable Markdown notes.
            </p>
          </motion.div>
        )}

        {/* Simulated Animated Cursor with Click Ripple */}
        <motion.div
          animate={{
            left: currentStep.cursorPos.x,
            top: currentStep.cursorPos.y,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <MousePointer className="w-6 h-6 text-white drop-shadow-md fill-white" />
            {clickPulse && (
              <span className="absolute -inset-2 rounded-full border-2 border-emerald-400 animate-ping opacity-75" />
            )}
          </div>
        </motion.div>

        {/* Bottom Floating Action Indicator */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-400 bg-[#06080e]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-surface-border">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-mono text-slate-300">{currentStep.actionText}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Step {currentStep.id} of {STEPS.length}
          </span>
        </div>
      </div>
    </div>
  );
};
