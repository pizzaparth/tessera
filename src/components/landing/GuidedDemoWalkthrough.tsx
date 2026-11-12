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
  ArrowRight,
  GitBranch,
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
    title: '1. Selecting a Node',
    subtitle: 'Cursor selects a concept node on the interactive knowledge canvas.',
    cursorPos: { x: '45%', y: '48%' },
    actionText: 'Selecting node "Cross-Sectional Momentum"...',
  },
  {
    id: 2,
    title: '2. Zooming into a Cluster',
    subtitle: 'Graph smoothly zooms into the neighborhood to reveal connected ideas.',
    cursorPos: { x: '58%', y: '42%' },
    actionText: 'Focusing camera on cluster neighborhood...',
  },
  {
    id: 3,
    title: '3. Opening a Markdown Note',
    subtitle: 'Inspecting readable Markdown documentation, citations, and equations.',
    cursorPos: { x: '75%', y: '60%' },
    actionText: 'Opening editable Markdown note drawer...',
  },
  {
    id: 4,
    title: '4. Mapping a Conversation',
    subtitle: 'AI analyzes conversation text to suggest candidate concepts and links.',
    cursorPos: { x: '35%', y: '72%' },
    actionText: 'AI extracting candidate structure from dialog...',
  },
  {
    id: 5,
    title: '5. Approving a Relationship',
    subtitle: 'Reviewing and approving proposed link: "Short-Term Reversal" challenges "Momentum".',
    cursorPos: { x: '68%', y: '50%' },
    actionText: 'Approving typed relationship into graph...',
  },
  {
    id: 6,
    title: '6. Returning to the Graph',
    subtitle: 'Camera relaxes back to the global map showing newly connected ideas.',
    cursorPos: { x: '50%', y: '50%' },
    actionText: 'Returning to full interactive graph view...',
  },
];

export const GuidedDemoWalkthrough: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [clickPulse, setClickPulse] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const pulseTimer = setTimeout(() => {
      setClickPulse(true);
      setTimeout(() => setClickPulse(false), 500);
    }, 1800);

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 4200);

    return () => {
      clearTimeout(pulseTimer);
      clearInterval(interval);
    };
  }, [isPlaying, currentStepIndex]);

  const currentStep = STEPS[currentStepIndex];

  return (
    <div className="relative w-full rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-card">
      {/* Top Walkthrough Navigation Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-2xs">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{currentStep.title}</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Step {currentStep.id} of 6
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentStep.subtitle}</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title={isPlaying ? 'Pause walkthrough' : 'Resume walkthrough'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(true);
            }}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scripted Simulation Stage */}
      <div className="relative h-[380px] sm:h-[420px] bg-gradient-to-b from-[#faf9fc] to-[#f4f2fa] overflow-hidden flex items-center justify-center p-4">
        {/* Background Dot Grid */}
        <div className="absolute inset-0 bg-canvas-dots opacity-40 pointer-events-none" />

        {/* Dynamic Simulated Screen Content */}
        <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {/* STEP 1: Selecting a Node */}
            {currentStep.id === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-700">Knowledge Graph Canvas</span>
                  <span className="text-[11px] text-indigo-600 font-mono">15 Nodes • 18 Edges</span>
                </div>
                <div className="flex items-center justify-center py-6 gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-indigo-500 flex flex-col items-center justify-center text-center p-1 shadow-md scale-110">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mb-0.5" />
                    <span className="text-[9px] font-bold text-slate-800 leading-tight">Momentum</span>
                  </div>
                  <div className="w-10 h-0.5 bg-indigo-300 relative">
                    <span className="absolute -top-3 left-1 text-[8px] font-mono text-slate-400">extends</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center p-1 opacity-70">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mb-0.5" />
                    <span className="text-[8px] font-medium text-slate-700">Fama-French</span>
                  </div>
                </div>
                <div className="text-center text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  Concept selected: <strong className="text-slate-900">Cross-Sectional Momentum</strong>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Zooming into a Cluster */}
            {currentStep.id === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1.15 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-6 rounded-2xl bg-white border border-indigo-200 shadow-elevated space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                    Cluster Zoom: Factor Research
                  </span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                </div>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                    <span className="font-semibold">Cross-Sectional Momentum</span>
                    <span className="text-[10px] text-indigo-600 font-mono">Central Hub</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span>Carhart 4-Factor Model</span>
                    <span className="text-[10px] text-slate-400">depends on</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span>Jegadeesh & Titman (1993)</span>
                    <span className="text-[10px] text-slate-400">source</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Opening a Markdown Note */}
            {currentStep.id === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">Cross-Sectional Momentum.md</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">In-Session Note</span>
                </div>
                <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p className="font-semibold text-slate-900"># Cross-Sectional Momentum</p>
                  <p className="text-[11px] text-slate-600">
                    A market phenomenon where intermediate-term relative winners continue to outperform relative losers over 3-12 months.
                  </p>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 font-mono text-[10px] text-indigo-700">
                    {'$$\\text{Signal}_{i,t} = \\prod_{k=2}^{12} (1 + R_{i,t-k}) - 1$$'}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Mapping a Conversation */}
            {currentStep.id === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">Conversation Extraction</span>
                  </div>
                  <span className="text-[10px] text-indigo-600 font-semibold">AI Mapping</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 italic">
                  “Researcher: At the 1-month horizon, returns are dominated by market maker inventory, inducing short-term reversal rather than momentum...”
                </div>
                <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs flex items-center justify-between">
                  <span className="font-semibold text-indigo-900">Identified: Short-Term Reversal</span>
                  <span className="text-[10px] text-indigo-600 font-bold">96% confidence</span>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Approving a Relationship */}
            {currentStep.id === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md p-5 rounded-2xl bg-white border border-emerald-200 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">Proposal Review</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Action Required
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900">Short-Term Reversal</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="font-semibold text-rose-600">challenges</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span>Cross-Sectional Momentum</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <span className="text-xs text-slate-400 mr-2">Reviewer choice:</span>
                  <div className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-2xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>Approved & Added</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Returning to the Graph */}
            {currentStep.id === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-3 text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto shadow-2xs">
                  <GitBranch className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Map Updated in Session</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  New concept and typed relationship have been linked into the active in-memory graph. Ready for exploration, neighborhood inspection, or note expansion.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                    <span>16 Concepts Connected</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animated Simulated Cursor */}
        <motion.div
          animate={{
            left: currentStep.cursorPos.x,
            top: currentStep.cursorPos.y,
          }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <MousePointer className="w-5 h-5 text-indigo-600 drop-shadow fill-indigo-600" />
            {clickPulse && (
              <span className="absolute -top-1 -left-1 w-7 h-7 rounded-full bg-indigo-500/30 animate-ping pointer-events-none" />
            )}
          </div>
        </motion.div>

        {/* Action Status Bar on Bottom */}
        <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-xs text-slate-500 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>{currentStep.actionText}</span>
          </div>

          <div className="flex items-center gap-1">
            {STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentStepIndex === idx ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title={s.title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
