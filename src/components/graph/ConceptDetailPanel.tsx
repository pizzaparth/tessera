import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { CONCEPT_TYPE_CONFIG, RELATIONSHIP_CONFIG, DOMAIN_COLORS } from '../../utils/visualEncoding';
import {
  FileText,
  GitBranch,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ConceptDetailPanelProps {
  onOpenNote?: () => void;
  onAddConnection?: () => void;
}

export const ConceptDetailPanel: React.FC<ConceptDetailPanelProps> = ({
  onOpenNote,
  onAddConnection,
}) => {
  const { selectedNode, nodes, edges, selectNode, deleteNode, deleteEdge } = useWorkspace();

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-surface border border-surface-border rounded-xl">
        <GitBranch className="w-10 h-10 mb-3 text-slate-600 stroke-1" />
        <h3 className="text-sm font-semibold text-slate-400">No Concept Selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Select any node in the knowledge graph to inspect its mathematical formulation, typed links, and provenance.
        </p>
      </div>
    );
  }

  const typeConfig = CONCEPT_TYPE_CONFIG[selectedNode.type];
  const domainColor = DOMAIN_COLORS[selectedNode.domain] || '#38bdf8';

  // Compute incoming and outgoing relationships
  const outgoingLinks = edges
    .filter((e) => e.source === selectedNode.id)
    .map((e) => ({
      edge: e,
      targetNode: nodes.find((n) => n.id === e.target),
      direction: 'outgoing' as const,
    }));

  const incomingLinks = edges
    .filter((e) => e.target === selectedNode.id)
    .map((e) => ({
      edge: e,
      sourceNode: nodes.find((n) => n.id === e.source),
      direction: 'incoming' as const,
    }));

  return (
    <div className="h-full flex flex-col bg-surface border border-surface-border rounded-xl overflow-hidden shadow-xl">
      {/* Header bar with badges */}
      <div className="p-4 border-b border-surface-border bg-surface-elevated flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded font-medium border"
              style={{
                backgroundColor: typeConfig.bgColor,
                borderColor: typeConfig.borderColor,
                color: typeConfig.color,
              }}
            >
              {typeConfig.label}
            </span>
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded border border-slate-700 text-slate-300"
              style={{ borderLeftColor: domainColor, borderLeftWidth: 3 }}
            >
              {selectedNode.domain}
            </span>
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
            {selectedNode.label}
          </h2>
        </div>

        <button
          onClick={() => selectNode(null)}
          className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-white/5 transition"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main content scroll area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
        {/* Definition / Summary */}
        <div className="space-y-1.5">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Definition & Core Idea
          </h4>
          <p className="text-xs leading-relaxed text-slate-300 bg-white/5 p-3 rounded-lg border border-surface-border">
            {selectedNode.definition || selectedNode.summary}
          </p>
        </div>

        {/* Mathematical Formulation (LaTeX) */}
        {selectedNode.equations && selectedNode.equations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-cyan-400 flex items-center gap-1.5">
              <span>Mathematical Equations</span>
            </h4>
            <div className="space-y-1.5">
              {selectedNode.equations.map((eq, i) => (
                <div
                  key={i}
                  className="bg-[#080b12] border border-cyan-950/60 p-3 rounded-lg overflow-x-auto text-cyan-200 text-xs font-mono"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {`$$${eq}$$`}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Structural Assumptions */}
        {selectedNode.assumptions && selectedNode.assumptions.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400">
              Key Assumptions & Limitations
            </h4>
            <ul className="space-y-1">
              {selectedNode.assumptions.map((asm, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-300 flex items-start gap-2 bg-amber-500/5 border border-amber-500/20 px-2.5 py-1.5 rounded"
                >
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>{asm}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Typed Relationships Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Typed Connections ({outgoingLinks.length + incomingLinks.length})</span>
            </h4>
            {onAddConnection && (
              <button
                onClick={onAddConnection}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" />
                <span>Add Link</span>
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {outgoingLinks.map(({ edge, targetNode }) => {
              if (!targetNode) return null;
              const relCfg = RELATIONSHIP_CONFIG[edge.type] || { label: edge.type, color: '#64748b' };
              return (
                <div
                  key={edge.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-card border border-surface-border text-xs group hover:border-slate-600 transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold"
                      style={{ color: relCfg.color, backgroundColor: `${relCfg.color}15` }}
                    >
                      {relCfg.label}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <button
                      onClick={() => selectNode(targetNode.id)}
                      className="text-slate-200 hover:text-cyan-300 font-medium truncate text-left"
                    >
                      {targetNode.label}
                    </button>
                  </div>
                  <button
                    onClick={() => deleteEdge(edge.id)}
                    className="text-slate-600 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition"
                    title="Remove connection"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            {incomingLinks.map(({ edge, sourceNode }) => {
              if (!sourceNode) return null;
              const relCfg = RELATIONSHIP_CONFIG[edge.type] || { label: edge.type, color: '#64748b' };
              return (
                <div
                  key={edge.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-card border border-surface-border text-xs group hover:border-slate-600 transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => selectNode(sourceNode.id)}
                      className="text-slate-200 hover:text-cyan-300 font-medium truncate text-left"
                    >
                      {sourceNode.label}
                    </button>
                    <span
                      className="font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold"
                      style={{ color: relCfg.color, backgroundColor: `${relCfg.color}15` }}
                    >
                      {relCfg.label}
                    </span>
                    <span className="text-slate-500 text-[10px]">(this)</span>
                  </div>
                  <button
                    onClick={() => deleteEdge(edge.id)}
                    className="text-slate-600 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition"
                    title="Remove connection"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            {outgoingLinks.length === 0 && incomingLinks.length === 0 && (
              <p className="text-xs text-slate-500 italic p-2 bg-white/5 rounded">
                No active connections. Link this node to explore structural clusters.
              </p>
            )}
          </div>
        </div>

        {/* Provenance Card */}
        <div className="p-3 rounded-lg bg-[#080d16] border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Provenance & Audit Trail</span>
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded capitalize ${
                selectedNode.provenance.origin === 'ai_suggested'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : selectedNode.provenance.origin === 'researcher_authored'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              {selectedNode.provenance.origin.replace('_', ' ')}
            </span>
          </div>

          <div className="text-xs text-slate-300 space-y-1">
            <p className="line-clamp-2 text-slate-400">
              <strong className="text-slate-300">Source:</strong> {selectedNode.provenance.source}
            </p>
            {selectedNode.provenance.excerpt && (
              <p className="italic bg-white/5 p-2 rounded border border-white/5 text-[11px] text-slate-300">
                "{selectedNode.provenance.excerpt}"
              </p>
            )}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Added: {new Date(selectedNode.provenance.createdAt).toLocaleDateString()}</span>
              {selectedNode.provenance.confidence && (
                <span className="text-emerald-400 font-mono">
                  {(selectedNode.provenance.confidence * 100).toFixed(0)}% confidence
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-surface-border bg-surface-elevated flex items-center justify-between gap-2">
        <button
          onClick={onOpenNote}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Open Markdown Note</span>
        </button>

        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg border border-transparent hover:border-rose-500/30 transition"
          title="Delete concept from active session"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
