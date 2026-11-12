import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { CONCEPT_TYPE_CONFIG, DOMAIN_COLORS } from '../../utils/visualEncoding';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  FileText,
  Eye,
  Edit3,
  Columns,
  History,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  Save,
  Check,
  BookOpen,
  Code,
  Sigma,
} from 'lucide-react';

interface MarkdownEditorProps {
  onBackToGraph?: () => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ onBackToGraph }) => {
  const { selectedNode, updateNode, nodes, selectNode } = useWorkspace();
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [showHistory, setShowHistory] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    if (selectedNode) {
      setContent(selectedNode.markdownContent || '');
      setIsSaved(true);
    }
  }, [selectedNode?.id]);

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-surface border border-surface-border rounded-xl">
        <FileText className="w-12 h-12 mb-3 text-slate-600 stroke-1" />
        <h3 className="text-base font-semibold text-slate-300">No Note Selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mb-4">
          Select any concept in the workspace or pick from the sample quantitative research library below:
        </p>
        <div className="flex flex-wrap gap-2 max-w-md justify-center">
          {nodes.slice(0, 6).map((n) => (
            <button
              key={n.id}
              onClick={() => selectNode(n.id)}
              className="text-xs px-2.5 py-1 bg-surface-card hover:bg-surface-elevated text-slate-300 border border-surface-border rounded transition"
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const typeConfig = CONCEPT_TYPE_CONFIG[selectedNode.type];
  const domainColor = DOMAIN_COLORS[selectedNode.domain];

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);
    updateNode(selectedNode.id, { markdownContent: e.target.value });
    setTimeout(() => setIsSaved(true), 600);
  };

  const insertSnippet = (snippet: string) => {
    const updated = content + '\n' + snippet;
    setContent(updated);
    updateNode(selectedNode.id, { markdownContent: updated });
  };

  return (
    <div className="h-full flex flex-col bg-surface border border-surface-border rounded-xl overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-surface-border bg-surface-elevated flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBackToGraph && (
            <button
              onClick={onBackToGraph}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-lg transition"
              title="Return to Knowledge Graph"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold border"
                style={{
                  backgroundColor: typeConfig.bgColor,
                  borderColor: typeConfig.borderColor,
                  color: typeConfig.color,
                }}
              >
                {typeConfig.label}
              </span>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded text-slate-400 border border-slate-700"
                style={{ borderLeftColor: domainColor, borderLeftWidth: 3 }}
              >
                {selectedNode.domain}
              </span>
              <span className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                <ShieldAlert className="w-3 h-3" />
                <span>Session Memory Only</span>
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {selectedNode.label}
            </h2>
          </div>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2">
          {/* Save status badge */}
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-2 font-mono">
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Synced</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-amber-400">Updating...</span>
              </>
            )}
          </span>

          {/* View toggle */}
          <div className="flex items-center bg-[#070a10] border border-surface-border rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('edit')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition ${
                viewMode === 'edit'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Editor Only"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition ${
                viewMode === 'split'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Split View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition ${
                viewMode === 'preview'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Preview Only"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Version history toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-1.5 rounded-lg border border-surface-border text-xs flex items-center gap-1.5 transition ${
              showHistory
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-surface-card text-slate-400 hover:text-slate-200'
            }`}
            title="Temporary Version Timeline"
          >
            <History className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
        </div>
      </div>

      {/* Editor Formatting Quickbar */}
      {viewMode !== 'preview' && (
        <div className="px-3.5 py-1.5 border-b border-surface-border bg-[#090c14] flex items-center gap-2 text-xs text-slate-400 overflow-x-auto">
          <span className="text-[11px] font-mono text-slate-500 mr-1">Insert:</span>
          <button
            onClick={() => insertSnippet('$$\n\\text{Sharpe} = \\frac{E[R_p - R_f]}{\\sigma(R_p - R_f)}\n$$')}
            className="hover:text-cyan-300 px-2 py-0.5 rounded bg-white/5 border border-white/5 flex items-center gap-1 text-[11px]"
          >
            <Sigma className="w-3 h-3 text-cyan-400" />
            <span>Formula</span>
          </button>
          <button
            onClick={() => insertSnippet('### Assumption\n- Must hold under stationarity conditions')}
            className="hover:text-amber-300 px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[11px]"
          >
            + Assumption
          </button>
          <button
            onClick={() => insertSnippet('### Empirical Evidence\n- Out-of-sample test period: 2010 - 2024')}
            className="hover:text-emerald-300 px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[11px]"
          >
            + Evidence
          </button>
          <button
            onClick={() => insertSnippet('> Source citation: Author, Year. Journal Name.')}
            className="hover:text-purple-300 px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[11px]"
          >
            + Citation
          </button>
        </div>
      )}

      {/* Main Split / Full Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="flex-1 flex flex-col h-full border-r border-surface-border">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Write Markdown research note with $LaTeX$ formulas..."
              className="w-full h-full p-4 bg-[#080a11] text-slate-200 text-sm font-mono leading-relaxed resize-none outline-none focus:ring-1 focus:ring-cyan-500/40"
              spellCheck={false}
            />
          </div>
        )}

        {/* Live Rendered Markdown Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex-1 h-full overflow-y-auto p-6 bg-[#0a0d16] prose prose-invert prose-emerald max-w-none prose-sm leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-xl font-bold text-white border-b border-surface-border pb-2 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-base font-semibold text-cyan-300 mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-sm font-semibold text-emerald-300 mt-4 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-slate-300 leading-relaxed text-xs mb-3" {...props} />
                ),
                code: ({ node, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <pre className="bg-[#05070c] p-3 rounded-lg border border-surface-border text-xs font-mono text-cyan-200 overflow-x-auto my-3">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300 text-[11px] font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-2 border-emerald-500/50 pl-3 italic text-slate-400 my-3 text-xs bg-emerald-500/5 py-1 rounded-r" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}

        {/* In-Memory Temporary Version Timeline Drawer */}
        {showHistory && (
          <div className="w-72 h-full border-l border-surface-border bg-surface-card flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-200">
            <div className="p-3 border-b border-surface-border flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>Session Timeline</span>
              </span>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            <div className="p-3 text-[11px] text-slate-400 bg-purple-500/5 border-b border-surface-border">
              Tracks changes made to this note during the current tab session. Cleared upon page reload.
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {(selectedNode.versions || [
                {
                  id: 'v_init',
                  timestamp: new Date().toISOString(),
                  change: 'Initial note created in sample library',
                  author: 'Sample Dataset',
                },
              ]).map((ver) => (
                <div
                  key={ver.id}
                  className="p-2.5 rounded-lg bg-surface border border-surface-border space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-mono">{new Date(ver.timestamp).toLocaleTimeString()}</span>
                    <span className="text-purple-400 font-medium">{ver.author}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{ver.change}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
