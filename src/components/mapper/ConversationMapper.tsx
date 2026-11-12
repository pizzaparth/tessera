import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { sampleConversations } from '../../data/sampleConversations';
import { ExtractionResult, ExtractionSuggestion } from '../../types';
import { CONCEPT_TYPE_CONFIG, RELATIONSHIP_CONFIG, DOMAIN_COLORS } from '../../utils/visualEncoding';
import {
  Sparkles,
  Key,
  ArrowRight,
  CheckCircle,
  Check,
  X,
  Edit2,
  FileText,
  AlertTriangle,
  RotateCcw,
  CheckCheck,
  GitBranch,
  Layers,
} from 'lucide-react';

interface ConversationMapperProps {
  onOpenApiKeyModal?: () => void;
  onNavigateToGraph?: () => void;
}

export const ConversationMapper: React.FC<ConversationMapperProps> = ({
  onOpenApiKeyModal,
  onNavigateToGraph,
}) => {
  const {
    apiKey,
    aiProvider,
    setExtractionResult,
    extractionResult,
    reviewQueue,
    acceptSuggestion,
    rejectSuggestion,
    acceptAllSuggestions,
    updateSuggestion,
    nodes,
    setActiveTab,
  } = useWorkspace();

  const [inputText, setInputText] = useState(sampleConversations[0].text);
  const [selectedSampleId, setSelectedSampleId] = useState(sampleConversations[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSelectSample = (id: string) => {
    setSelectedSampleId(id);
    const sample = sampleConversations.find((s) => s.id === id);
    if (sample) {
      setInputText(sample.text);
      setErrorMsg(null);
    }
  };

  const handleExtract = async () => {
    if (!inputText.trim()) {
      setErrorMsg('Please enter or paste a conversation to map.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      setProcessingStep('Parsing conversation and context...');
      await new Promise((r) => setTimeout(r, 350));

      setProcessingStep('Identifying key concepts and potential connections...');
      await new Promise((r) => setTimeout(r, 350));

      if (apiKey) {
        // Live AI Extraction via stateless proxy
        setProcessingStep(`Querying ${aiProvider.toUpperCase()} for candidate structure...`);
        const response = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputText,
            provider: aiProvider,
            apiKey: apiKey,
            existingNodeIds: nodes.map((n) => n.id),
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `HTTP ${response.status}`);
        }

        const data: ExtractionResult = await response.json();
        setProcessingStep('Preparing review suggestions...');
        await new Promise((r) => setTimeout(r, 200));
        setExtractionResult(data);
      } else {
        // Guided Demo Mode using built-in sample extraction
        setProcessingStep('Analyzing concepts with sample extractor (Guided Mode)...');
        await new Promise((r) => setTimeout(r, 450));

        const sampleMatch = sampleConversations.find(
          (s) => s.id === selectedSampleId || inputText.includes(s.title)
        );

        if (sampleMatch) {
          setExtractionResult(sampleMatch.extraction);
        } else {
          // Fallback heuristic extraction for arbitrary text
          const words = inputText
            .split(/\s+/)
            .map((w) => w.replace(/[^a-zA-Z]/g, ''))
            .filter((w) => w.length > 5);
          const topWords = Array.from(new Set(words)).slice(0, 3);

          const fallbackResult: ExtractionResult = {
            summary: `Automated summary of conversation discussing ${topWords.join(', ')}.`,
            claims: [
              `Core ideas revolve around ${topWords[0] || 'concepts'} and their practical interactions.`,
            ],
            openQuestions: [
              `How does this framework integrate with existing mapped ideas?`,
            ],
            assumptions: [
              `Underlying conditions remain stable across observations.`,
            ],
            concepts: topWords.map((word, idx) => ({
              id: `extracted_${word.toLowerCase()}_${Date.now()}_${idx}`,
              label: word.charAt(0).toUpperCase() + word.slice(1),
              type: idx === 0 ? 'model' : idx === 1 ? 'method' : 'metric',
              domain: 'Factor Research',
              summary: `Concept identified from discussion context: ${word}.`,
              confidence: 0.9,
              excerpt: inputText.slice(0, 100) + '...',
              suggestedEdges:
                nodes.length > 0
                  ? [
                      {
                        targetId: nodes[0].id,
                        type: 'related_to',
                        label: 'related to',
                      },
                    ]
                  : [],
              status: 'pending',
            })),
          };
          setExtractionResult(fallbackResult);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract concepts from text');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const pendingSuggestions = reviewQueue.filter((s) => s.status === 'pending');
  const acceptedSuggestions = reviewQueue.filter((s) => s.status === 'accepted');

  return (
    <div className="h-full flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-subtle">
      {/* Top Banner */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              AI Conversation Mapper
            </h2>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {apiKey ? `Live AI (${aiProvider.toUpperCase()})` : 'Guided Demo Mode'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Paste a conversation or select a sample. AI suggests candidate concepts and relationships for review before updating your graph.
          </p>
        </div>

        {!apiKey && onOpenApiKeyModal && (
          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium transition shadow-2xs"
          >
            <Key className="w-3.5 h-3.5 text-indigo-500" />
            <span>Use Custom API Key</span>
          </button>
        )}
      </div>

      {/* Main Content: Split Grid with Input & Suggestions */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input and Extraction Control (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Sample Selectors */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Choose a Sample Conversation</span>
              <span className="text-[11px] font-normal text-slate-400">No key required</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {sampleConversations.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample.id)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition ${
                    selectedSampleId === sample.id
                      ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{sample.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {sample.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Conversation Transcript or Passage</span>
              <span className="text-[11px] font-mono text-slate-400">{inputText.length} chars</span>
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste conversation or discussion here..."
              rows={9}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none placeholder-slate-400 font-sans"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Extract Button */}
          <button
            onClick={handleExtract}
            disabled={isProcessing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>{processingStep || 'Processing conversation...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Map Conversation with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Review Suggestions & Graph Update (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Review Suggested Structure</span>
              {pendingSuggestions.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                  {pendingSuggestions.length} pending
                </span>
              )}
            </h3>

            {pendingSuggestions.length > 0 && (
              <button
                onClick={acceptAllSuggestions}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Approve All Proposals</span>
              </button>
            )}
          </div>

          {/* If no extraction yet */}
          {!extractionResult && (
            <div className="h-64 flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
              <Sparkles className="w-8 h-8 mb-2 text-slate-300 stroke-[1.5]" />
              <div className="text-xs font-semibold text-slate-600">No Proposals Yet</div>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                Click “Map Conversation with AI” to generate candidate concepts, definitions, and typed relationships.
              </p>
            </div>
          )}

          {/* Extraction Summary */}
          {extractionResult && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                Conversation Summary
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {extractionResult.summary}
              </p>
            </div>
          )}

          {/* Suggestions List */}
          {reviewQueue.length > 0 && (
            <div className="space-y-3">
              {reviewQueue.map((sug) => {
                const typeCfg = CONCEPT_TYPE_CONFIG[sug.type] || CONCEPT_TYPE_CONFIG.model;
                const isAccepted = sug.status === 'accepted';
                const isRejected = sug.status === 'rejected';
                const isPending = sug.status === 'pending';

                return (
                  <div
                    key={sug.id}
                    className={`p-3.5 rounded-xl border transition space-y-2.5 ${
                      isAccepted
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : isRejected
                        ? 'bg-slate-50/60 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 shadow-2xs hover:border-indigo-200'
                    }`}
                  >
                    {/* Top Row: Type badge, title, status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
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
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {sug.label}
                        </h4>
                      </div>

                      {/* Approval Actions */}
                      <div className="flex items-center gap-1">
                        {isPending && (
                          <>
                            <button
                              onClick={() => acceptSuggestion(sug.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition"
                              title="Accept into knowledge graph"
                            >
                              <Check className="w-3 h-3" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => rejectSuggestion(sug.id)}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                              title="Reject suggestion"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {isAccepted && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Added to Graph</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="text-[10px] text-slate-400 font-medium italic">
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Summary / Definition */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sug.summary}
                    </p>

                    {/* Source Excerpt */}
                    {sug.excerpt && (
                      <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{sug.excerpt}"
                      </div>
                    )}

                    {/* Proposed typed links */}
                    {sug.suggestedEdges && sug.suggestedEdges.length > 0 && (
                      <div className="pt-1 space-y-1">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">
                          Proposed Connections:
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

          {/* Done Reviewing - Jump to Graph */}
          {acceptedSuggestions.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => {
                  if (onNavigateToGraph) {
                    onNavigateToGraph();
                  } else {
                    setActiveTab('graph');
                  }
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
              >
                <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                <span>Explore Approved Concepts in Knowledge Graph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
