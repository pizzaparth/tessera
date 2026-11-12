import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ExtractionSuggestion, ConceptType, ConceptDomain, RelationshipType } from '../../types';
import { CONCEPT_TYPE_CONFIG, RELATIONSHIP_CONFIG, DOMAIN_COLORS } from '../../utils/visualEncoding';
import {
  Check,
  X,
  Edit2,
  CheckCheck,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  Clock,
} from 'lucide-react';

interface ExtractionReviewProps {
  onBackToGraph?: () => void;
}

export const ExtractionReview: React.FC<ExtractionReviewProps> = ({ onBackToGraph }) => {
  const {
    reviewQueue,
    acceptSuggestion,
    rejectSuggestion,
    acceptAllSuggestions,
    updateSuggestion,
    nodes,
  } = useWorkspace();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredQueue = reviewQueue.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const pendingCount = reviewQueue.filter((s) => s.status === 'pending').length;

  return (
    <div className="h-full flex flex-col bg-surface border border-surface-border rounded-xl overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="p-4 border-b border-surface-border bg-surface-elevated flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Extraction Review Queue</span>
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {pendingCount} Pending Review
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Researcher in control: review, refine types and links, then accept suggestions into the active demo graph.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex bg-[#070a10] border border-surface-border rounded-lg p-0.5 text-xs">
            {(['all', 'pending', 'accepted', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1 rounded capitalize transition ${
                  filterStatus === status
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {pendingCount > 0 && (
            <button
              onClick={acceptAllSuggestions}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Accept All ({pendingCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Review List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredQueue.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 text-slate-500 border border-dashed border-surface-border rounded-xl">
            <Sparkles className="w-10 h-10 mb-2 text-slate-600 stroke-1" />
            <h4 className="text-sm font-semibold text-slate-400">Queue is Empty</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              No suggestions found matching this status filter. Go to the Conversation Mapper to analyze text and generate candidate concepts.
            </p>
          </div>
        ) : (
          filteredQueue.map((item) => {
            const typeCfg = CONCEPT_TYPE_CONFIG[item.type] || CONCEPT_TYPE_CONFIG.method;
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.status === 'accepted'
                    ? 'bg-emerald-950/15 border-emerald-500/30'
                    : item.status === 'rejected'
                    ? 'bg-rose-950/10 border-rose-500/20 opacity-60'
                    : 'bg-surface-card border-surface-border hover:border-slate-600 shadow-md'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  {/* Left Column: Metadata & Content */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {isEditing ? (
                        <>
                          <select
                            value={item.type}
                            onChange={(e) =>
                              updateSuggestion(item.id, { type: e.target.value as ConceptType })
                            }
                            className="text-xs bg-[#090d16] text-slate-200 border border-surface-border rounded px-2 py-0.5"
                          >
                            {Object.keys(CONCEPT_TYPE_CONFIG).map((k) => (
                              <option key={k} value={k}>
                                {CONCEPT_TYPE_CONFIG[k as ConceptType].label}
                              </option>
                            ))}
                          </select>
                          <select
                            value={item.domain}
                            onChange={(e) =>
                              updateSuggestion(item.id, { domain: e.target.value as ConceptDomain })
                            }
                            className="text-xs bg-[#090d16] text-slate-200 border border-surface-border rounded px-2 py-0.5"
                          >
                            {Object.keys(DOMAIN_COLORS).map((k) => (
                              <option key={k} value={k}>
                                {k}
                              </option>
                            ))}
                          </select>
                        </>
                      ) : (
                        <>
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold border"
                            style={{
                              backgroundColor: typeCfg.bgColor,
                              borderColor: typeCfg.borderColor,
                              color: typeCfg.color,
                            }}
                          >
                            {typeCfg.label}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-slate-700">
                            {item.domain}
                          </span>
                        </>
                      )}

                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {(item.confidence * 100).toFixed(0)}% confidence
                      </span>

                      {item.status !== 'pending' && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            item.status === 'accepted'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </div>

                    {/* Concept Label */}
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateSuggestion(item.id, { label: e.target.value })}
                        className="w-full text-sm font-bold bg-[#090d16] text-white border border-surface-border rounded px-2.5 py-1"
                      />
                    ) : (
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {item.label}
                      </h3>
                    )}

                    {/* Summary */}
                    {isEditing ? (
                      <textarea
                        value={item.summary}
                        onChange={(e) => updateSuggestion(item.id, { summary: e.target.value })}
                        className="w-full text-xs bg-[#090d16] text-slate-300 border border-surface-border rounded p-2 resize-none"
                        rows={2}
                      />
                    ) : (
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.summary}
                      </p>
                    )}

                    {/* Source Excerpt */}
                    {item.excerpt && (
                      <div className="text-[11px] text-slate-400 italic bg-white/5 p-2.5 rounded-lg border border-white/5">
                        <strong className="text-slate-300 not-italic">Source Excerpt:</strong> "{item.excerpt}"
                      </div>
                    )}

                    {/* Proposed Links */}
                    {item.suggestedEdges && item.suggestedEdges.length > 0 && (
                      <div className="pt-1 space-y-1">
                        <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                          <LinkIcon className="w-3 h-3 text-cyan-400" />
                          <span>Proposed Graph Connections:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.suggestedEdges.map((e, idx) => {
                            const targetNode = nodes.find((n) => n.id === e.targetId);
                            const relCfg = RELATIONSHIP_CONFIG[e.type] || { label: e.type, color: '#64748b' };
                            return (
                              <div
                                key={idx}
                                className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#090e18] border border-surface-border flex items-center gap-1.5"
                              >
                                <span style={{ color: relCfg.color }} className="font-semibold">
                                  {relCfg.label}
                                </span>
                                <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                                <span className="text-slate-200">
                                  {targetNode?.label || e.targetId}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Accept/Reject/Edit Actions */}
                  <div className="flex md:flex-col items-center gap-2 pt-2 md:pt-0">
                    {item.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => acceptSuggestion(item.id)}
                          className="flex-1 md:flex-none px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 shadow transition"
                          title="Accept into active knowledge graph"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => rejectSuggestion(item.id)}
                          className="flex-1 md:flex-none px-3 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-surface-border text-xs flex items-center justify-center gap-1.5 transition"
                          title="Discard proposal"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => setEditingId(isEditing ? null : item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-surface-border transition text-xs"
                          title="Edit wording, type, or domain"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => updateSuggestion(item.id, { status: 'pending' })}
                        className="text-[11px] text-slate-400 hover:text-slate-200 underline"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Return */}
      {onBackToGraph && (
        <div className="p-3 border-t border-surface-border bg-surface-elevated flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Accepted concepts are instantly visible in the Knowledge Graph and editable as Markdown notes.
          </span>
          <button
            onClick={onBackToGraph}
            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Return to Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
