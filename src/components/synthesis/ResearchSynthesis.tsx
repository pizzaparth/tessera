import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { FileText, Copy, Check, Sparkles, Download, BookOpen, Plus, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export const ResearchSynthesis: React.FC = () => {
  const { nodes, selectedNode } = useWorkspace();
  const [copied, setCopied] = useState(false);

  const [briefTitle, setBriefTitle] = useState('Momentum Factor & Microstructure Execution Synthesis');
  const [researchQuestion, setResearchQuestion] = useState(
    'Does cross-sectional momentum alpha survive implementation shortfall when scaled across illiquid micro-cap equities?'
  );
  const [contextText, setContextText] = useState(
    'While intermediate-term momentum (12-2) yields documented cross-sectional premia, execution costs modeled under Kyle’s lambda and Almgren-Chriss framework can erode substantial portions of gross alpha. Survivorship bias in historical backtests further distorts strategy evaluation.'
  );
  const [selectedConceptIds, setSelectedConceptIds] = useState<string[]>([
    'momentum_factor',
    'kyles_lambda',
    'almgren_chriss',
    'volatility_targeting',
  ]);
  const [nextSteps, setNextSteps] = useState(
    '1. Calibrate empirical Kyle lambda across ADV deciles using TAQ tick data.\n2. Backtest 12-2 signal with delisting return adjustments to eliminate survivorship bias.\n3. Implement volatility targeting overlay to curb momentum crash drawdowns.'
  );

  const toggleConcept = (id: string) => {
    setSelectedConceptIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const generateFullMarkdown = () => {
    const includedNodes = nodes.filter((n) => selectedConceptIds.includes(n.id));

    return `# Research Brief: ${briefTitle}

## 1. Primary Research Question
> ${researchQuestion}

## 2. Theoretical Context & Motivation
${contextText}

## 3. Referenced Quantitative Concepts (${includedNodes.length})
${includedNodes
  .map(
    (n) => `### ${n.label} (*${n.type}* / ${n.domain})
- **Summary:** ${n.summary}
${n.equations && n.equations.length > 0 ? `- **Equation:** $$${n.equations[0]}$$` : ''}
${n.assumptions && n.assumptions.length > 0 ? `- **Assumptions:** ${n.assumptions.join('; ')}` : ''}
- **Source:** ${n.provenance.source}
`
  )
  .join('\n')}

## 4. Empirical Roadmap & Next Experiments
${nextSteps}

---
*Generated via TESSERA Quantitative Research Knowledge System — Stateless In-Memory Session*`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateFullMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-surface border border-surface-border rounded-xl overflow-hidden shadow-2xl">
      {/* Top Banner */}
      <div className="p-4 border-b border-surface-border bg-surface-elevated flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Research Synthesis Composer</span>
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Structured Brief Builder
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Assemble graph concepts, claims, equations, and next steps into a coherent research brief.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition shadow"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Brief!' : 'Copy Markdown Brief'}</span>
        </button>
      </div>

      {/* Main Workspace Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Form Inputs */}
        <div className="flex-1 flex flex-col p-4 border-b lg:border-b-0 lg:border-r border-surface-border overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Brief Title
            </label>
            <input
              type="text"
              value={briefTitle}
              onChange={(e) => setBriefTitle(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#080b12] text-white text-xs border border-surface-border focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              1. Core Research Question
            </label>
            <textarea
              value={researchQuestion}
              onChange={(e) => setResearchQuestion(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-lg bg-[#080b12] text-slate-200 text-xs border border-surface-border focus:border-cyan-500 outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              2. Theoretical Context & Assumptions
            </label>
            <textarea
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              rows={4}
              className="w-full p-2.5 rounded-lg bg-[#080b12] text-slate-200 text-xs border border-surface-border focus:border-cyan-500 outline-none resize-none"
            />
          </div>

          {/* Reference Graph Concepts */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>3. Include Graph Concepts ({selectedConceptIds.length})</span>
              <span className="text-[10px] text-slate-500 font-mono">Toggle to insert</span>
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-[#080b12] rounded-lg border border-surface-border">
              {nodes.map((node) => {
                const isSelected = selectedConceptIds.includes(node.id);
                return (
                  <button
                    key={node.id}
                    onClick={() => toggleConcept(node.id)}
                    className={`text-[11px] font-mono px-2 py-1 rounded transition border ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold'
                        : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {node.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              4. Next Experimental Steps
            </label>
            <textarea
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-lg bg-[#080b12] text-slate-200 text-xs font-mono border border-surface-border focus:border-cyan-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Right Column: Live Markdown Document Preview */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-[#0a0d16]">
          <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Generated Brief Preview
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Ready to Export
            </span>
          </div>

          <div className="prose prose-invert prose-emerald max-w-none prose-sm leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {generateFullMarkdown()}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
