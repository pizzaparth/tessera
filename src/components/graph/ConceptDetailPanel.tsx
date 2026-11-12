import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { CONCEPT_TYPE_CONFIG, RELATIONSHIP_CONFIG, DOMAIN_COLORS } from '../../utils/visualEncoding';
import {
  FileText,
  GitBranch,
  Link as LinkIcon,
  Plus,
  Trash2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  X,
  Edit3,
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
  const { selectedNode, nodes, edges, selectNode, deleteNode } = useWorkspace();

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-white border border-slate-200/80 rounded-2xl shadow-subtle">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-3 shadow-sm">
          <GitBranch className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">No Concept Selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
          Select any node in the knowledge graph to view its definition, source passage, typed links, and Markdown note.
        </p>
      </div>
    );
  }

  const typeConfig = CONCEPT_TYPE_CONFIG[selectedNode.type] || CONCEPT_TYPE_CONFIG.model;
  const domainColor = DOMAIN_COLORS[selectedNode.domain] || '#6366f1';

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
    <div className="h-full flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-subtle">
      {/* Header bar with badges */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: typeConfig.bgColor,
                borderColor: typeConfig.borderColor,
                color: typeConfig.textColor,
              }}
            >
              {typeConfig.label}
            </span>
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 shadow-2xs"
              style={{ borderLeftColor: domainColor, borderLeftWidth: 3 }}
            >
              {selectedNode.domain}
            </span>
          </div>

          <h2 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
            {selectedNode.label}
          </h2>
        </div>

        <button
          onClick={() => selectNode(null)}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main content scroll area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {/* Definition / Summary */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            Definition & Core Idea
          </h4>
          <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
            {selectedNode.definition || selectedNode.summary}
          </p>
        </div>

        {/* Source Passage */}
        {selectedNode.provenance?.excerpt && (
          <div className="space-y-1.5">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-indigo-600 flex items-center gap-1.5">
              <span>Source Excerpt</span>
            </h4>
            <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-slate-700 text-xs italic leading-relaxed">
              "{selectedNode.provenance.excerpt}"
            </div>
          </div>
        )}

        {/* Action: Open Markdown Note */}
        {onOpenNote && (
          <button
            onClick={onOpenNote}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/60 text-indigo-900 transition group shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              <div className="text-left">
                <div className="text-xs font-semibold">Open Markdown Note</div>
                <div className="text-[10px] text-indigo-600">Edit note & related concepts</div>
              </div>
            </div>
            <Edit3 className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-0.5 transition" />
          </button>
        )}

        {/* Mathematical Formulation (LaTeX) */}
        {selectedNode.equations && selectedNode.equations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Formulation
            </h4>
            <div className="space-y-1.5">
              {selectedNode.equations.map((eq, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl overflow-x-auto text-slate-800 text-xs font-mono"
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

        {/* Typed Relationships Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Typed Connections ({outgoingLinks.length + incomingLinks.length})</span>
            </h4>
            {onAddConnection && (
              <button
                onClick={onAddConnection}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline"
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
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs group hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ color: relCfg.color, backgroundColor: `${relCfg.color}15` }}
                    >
                      {relCfg.label}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <button
                      onClick={() => selectNode(targetNode.id)}
                      className="text-slate-700 hover:text-indigo-600 font-medium truncate text-left"
                    >
                      {targetNode.label}
                    </button>
                  </div>
                </div>
              );
            })}

            {incomingLinks.map(({ edge, sourceNode }) => {
              if (!sourceNode) return null;
              const relCfg = RELATIONSHIP_CONFIG[edge.type] || { label: edge.type, color: '#64748b' };
              return (
                <div
                  key={edge.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs group hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => selectNode(sourceNode.id)}
                      className="text-slate-700 hover:text-indigo-600 font-medium truncate text-left"
                    >
                      {sourceNode.label}
                    </button>
                    <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ color: relCfg.color, backgroundColor: `${relCfg.color}15` }}
                    >
                      {relCfg.label}
                    </span>
                  </div>
                </div>
              );
            })}

            {outgoingLinks.length === 0 && incomingLinks.length === 0 && (
              <div className="text-xs text-slate-400 italic py-2 text-center bg-slate-50 rounded-xl">
                No direct connections.
              </div>
            )}
          </div>
        </div>

        {/* Provenance */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="capitalize">{selectedNode.provenance?.origin.replace('_', ' ')}</span>
          </div>
          <button
            onClick={() => deleteNode(selectedNode.id)}
            className="text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1 text-[11px]"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove Node</span>
          </button>
        </div>
      </div>
    </div>
  );
};
