import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { sampleConversations } from '../../data/sampleConversations';
import { ExtractionResult } from '../../types';
import {
  Sparkles,
  Bot,
  Key,
  Layers,
  ArrowRight,
  BookOpen,
  HelpCircle,
  CheckCircle,
  FileText,
  AlertTriangle,
  RefreshCw,
  Sliders,
} from 'lucide-react';

interface ConversationMapperProps {
  onOpenReview?: () => void;
  onOpenApiKeyModal?: () => void;
}

export const ConversationMapper: React.FC<ConversationMapperProps> = ({
  onOpenReview,
  onOpenApiKeyModal,
}) => {
  const {
    apiKey,
    aiProvider,
    setExtractionResult,
    extractionResult,
    nodes,
    reviewQueue,
  } = useWorkspace();

  const [inputText, setInputText] = useState(sampleConversations[0].text);
  const [selectedSampleId, setSelectedSampleId] = useState(sampleConversations[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      setErrorMsg('Please enter or paste a research text/conversation to map.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      setProcessingStep('1/4 Parsing research dialog and quant terminology...');
      await new Promise((r) => setTimeout(r, 400));

      setProcessingStep('2/4 Identifying candidate concepts, models, and formulas...');
      await new Promise((r) => setTimeout(r, 400));

      if (apiKey) {
        // Live AI Extraction via stateless proxy
        setProcessingStep(`3/4 Querying ${aiProvider.toUpperCase()} for typed relationships...`);
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
        setProcessingStep('4/4 Preparing review proposal queue...');
        await new Promise((r) => setTimeout(r, 300));
        setExtractionResult(data);
      } else {
        // Guided Demo Mode using built-in deterministic extraction
        setProcessingStep('3/4 Matching against quantitative ontology (Guided Demo Mode)...');
        await new Promise((r) => setTimeout(r, 500));

        // Find closest sample or generate standard candidate structure
        const sampleMatch = sampleConversations.find(
          (s) => s.id === selectedSampleId || inputText.includes(s.title)
        );

        const result: ExtractionResult = sampleMatch
          ? JSON.parse(JSON.stringify(sampleMatch.extraction))
          : {
              summary: 'Synthesized proposal from researcher input examining empirical behavior and risk interactions.',
              claims: [
                'Factor returns are contingent on liquidity regimes and execution friction.',
                'Model parameter uncertainty requires dynamic shrinkage or Bayesian priors.',
              ],
              openQuestions: [
                'How does transaction cost drag scale with capital under management?',
              ],
              assumptions: [
                'Stationary covariance matrices over short estimation windows.',
              ],
              concepts: [
                {
                  id: `extracted_${Date.now()}`,
                  label: 'Dynamic Factor Allocation',
                  type: 'method',
                  domain: 'Factor Research',
                  summary: 'Regime-switching tactical allocation across equity style factors.',
                  confidence: 0.93,
                  excerpt: inputText.slice(0, 100),
                  suggestedEdges: [
                    {
                      targetId: 'momentum_factor',
                      type: 'related_to',
                      label: 'related to',
                    },
                  ],
                  status: 'pending',
                },
              ],
            };

        setProcessingStep('4/4 Generated reviewable proposal queue');
        await new Promise((r) => setTimeout(r, 200));
        setExtractionResult(result);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Extraction failed: ${err.message}. Try guided demo mode or check your API key.`);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface border border-surface-border rounded-xl overflow-hidden shadow-2xl">
      {/* Top Banner */}
      <div className="p-4 border-b border-surface-border bg-surface-elevated flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Conversation & Note Mapper</span>
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Stateless Parser
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Extract candidate concepts, claims, questions, and typed relationships into a reviewable proposal.
          </p>
        </div>

        {/* API Key Status / Modal Trigger */}
        <div className="flex items-center gap-2">
          {apiKey ? (
            <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs px-2.5 py-1 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="font-mono capitalize">{aiProvider} Live Mode</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg font-mono">
                Guided Demo Mode (No Key Needed)
              </span>
              {onOpenApiKeyModal && (
                <button
                  onClick={onOpenApiKeyModal}
                  className="text-xs px-2.5 py-1 rounded-lg bg-surface-card hover:bg-surface border border-surface-border text-slate-300 hover:text-white flex items-center gap-1.5 transition"
                >
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Use API Key</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Input text & Sample selector */}
        <div className="flex-1 flex flex-col p-4 border-b lg:border-b-0 lg:border-r border-surface-border overflow-y-auto space-y-4">
          {/* Sample Picker Buttons */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Load Ready-Made Quant Conversation</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleConversations.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample.id)}
                  className={`p-2.5 rounded-lg border text-left transition ${
                    selectedSampleId === sample.id
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200 shadow-sm'
                      : 'bg-surface-card border-surface-border text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <div className="font-medium text-xs text-white truncate">{sample.title}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{sample.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="flex-1 flex flex-col space-y-1.5 min-h-[220px]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Conversation Excerpt / Research Note
              </label>
              <button
                onClick={() => setInputText('')}
                className="text-[11px] text-slate-500 hover:text-slate-300"
              >
                Clear text
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste research discussion, meeting notes, or quant hypothesis here..."
              className="flex-1 w-full p-3.5 rounded-lg bg-[#080b12] text-slate-200 text-xs font-mono leading-relaxed border border-surface-border focus:border-cyan-500/50 outline-none resize-none"
              spellCheck={false}
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-1">
            <button
              onClick={handleExtract}
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                isProcessing
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>{processingStep}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {apiKey ? 'Run Live AI Concept Extraction' : 'Extract Concepts (Guided Demo Mode)'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Extraction Proposal Summary & Queue Link */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4 bg-[#090c14]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Extracted Proposal Summary</span>
            </h3>

            {reviewQueue.length > 0 && onOpenReview && (
              <button
                onClick={onOpenReview}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                <span>Review Queue ({reviewQueue.filter((s) => s.status === 'pending').length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {extractionResult ? (
            <div className="space-y-4 text-xs">
              {/* Summary */}
              <div className="p-3.5 rounded-lg bg-surface border border-surface-border space-y-1.5">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wide">
                  Executive Synthesis
                </span>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {extractionResult.summary}
                </p>
              </div>

              {/* Proposed Concepts Badge Count */}
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <div className="text-emerald-400 font-semibold">
                    {extractionResult.concepts.length} Candidate Concepts Found
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Includes formulas, typed relationships, and supporting source quotes.
                  </div>
                </div>
                {onOpenReview && (
                  <button
                    onClick={onOpenReview}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-md font-semibold text-xs transition"
                  >
                    Open Review
                  </button>
                )}
              </div>

              {/* Identified Claims */}
              {extractionResult.claims && extractionResult.claims.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Extracted Claims & Hypotheses
                  </span>
                  <div className="space-y-1">
                    {extractionResult.claims.map((claim, i) => (
                      <div
                        key={i}
                        className="p-2 rounded bg-surface border border-surface-border text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-cyan-400 font-mono text-[10px] mt-0.5">[{i + 1}]</span>
                        <span>{claim}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Open Questions */}
              {extractionResult.openQuestions && extractionResult.openQuestions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">
                    Unresolved Research Questions
                  </span>
                  <div className="space-y-1">
                    {extractionResult.openQuestions.map((q, i) => (
                      <div
                        key={i}
                        className="p-2 rounded bg-amber-500/5 border border-amber-500/20 text-amber-200 flex items-start gap-2"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 border border-dashed border-surface-border rounded-lg">
              <Bot className="w-10 h-10 mb-2 text-slate-600 stroke-1" />
              <h4 className="text-xs font-semibold text-slate-400">No Active Extraction</h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                Select a quant discussion and click Extract to generate concept candidates and typed links.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
