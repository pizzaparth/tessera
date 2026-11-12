import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { CONCEPT_TYPE_CONFIG, RELATIONSHIP_CONFIG, DOMAIN_COLORS } from '../../utils/visualEncoding';
import {
  Check,
  X,
  CheckCheck,
  Layers,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  GitBranch,
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
    nodes,
    setActiveTab,
  } = useWorkspace();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const filteredQueue = reviewQueue.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const pendingCount = reviewQueue.filter((s) => s.status === 'pending').length;

  return (
    <div className="h-full flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-subtle">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {onBackToGraph && (
              <button
                onClick={onBackToGraph}
                className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition mr-1"
                title="Return to Graph"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Review Suggestions</span>
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {pendingCount} Pending Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review proposed concepts, definitions, and typed connections before approving them into your graph.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button
              onClick={acceptAllSuggestions}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Accept All Proposals</span>
            </button>
          )}

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {(['all', 'pending', 'accepted', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-md capitalize transition ${
                  filterStatus === st
                    ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Queue Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {filteredQueue.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Layers className="w-8 h-8 mb-2 text-slate-300 stroke-[1.5]" />
            <h4 className="text-xs font-semibold text-slate-700">No proposals in this view</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Extract new concepts in the Conversation Mapper to populate the review queue.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQueue.map((sug) => {
              const typeCfg = CONCEPT_TYPE_CONFIG[sug.type] || CONCEPT_TYPE_CONFIG.model;
              const isAccepted = sug.status === 'accepted';
              const isRejected = sug.status === 'rejected';
              const isPending = sug.status === 'pending';

              return (
                <div
                  key={sug.id}
                  className={`p-4 rounded-xl border space-y-3 transition ${
                    isAccepted
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : isRejected
                      ? 'bg-slate-50/60 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 shadow-2xs hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: typeCfg.bgColor,
                            borderColor: typeCfg.borderColor,
                            color: typeCfg.textColor,
                          }}
                        >
                          {typeCfg.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {(sug.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{sug.label}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      {isPending && (
                        <>
                          <button
                            onClick={() => acceptSuggestion(sug.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-2xs transition"
                          >
                            <Check className="w-3 h-3" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => rejectSuggestion(sug.id)}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {isAccepted && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Approved
                        </span>
                      )}
                      {isRejected && (
                        <span className="text-[11px] font-medium text-slate-400 italic">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{sug.summary}</p>

                  {sug.excerpt && (
                    <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{sug.excerpt}"
                    </div>
                  )}

                  {sug.suggestedEdges && sug.suggestedEdges.length > 0 && (
                    <div className="pt-1 space-y-1">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        Connections:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {sug.suggestedEdges.map((e, idx) => {
                          const relCfg = RELATIONSHIP_CONFIG[e.type] || {
                            label: e.type,
                            color: '#64748b',
                          };
                          const targetNode = nodes.find((n) => n.id === e.targetId);
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-slate-100 border border-slate-200 text-slate-700"
                            >
                              <span style={{ color: relCfg.color }} className="font-semibold">
                                {relCfg.label}
                              </span>
                              <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                              <span>{targetNode?.label || e.targetId}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
