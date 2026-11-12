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
  ArrowLeft,
  Check,
  Code,
  List,
  Bold,
  Italic,
  Quote,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';

interface MarkdownEditorProps {
  onBackToGraph?: () => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ onBackToGraph }) => {
  const { selectedNode, updateNode, nodes, edges, selectNode } = useWorkspace();
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    if (selectedNode) {
      setContent(selectedNode.markdownContent || '');
      setIsSaved(true);
    }
  }, [selectedNode?.id]);

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-white border border-slate-200/80 rounded-2xl shadow-subtle">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-4 shadow-sm">
          <FileText className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No Note Selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mb-4 leading-relaxed">
          Select any concept in the workspace or pick from the sample knowledge graph below:
        </p>
        <div className="flex flex-wrap gap-2 max-w-md justify-center">
          {nodes.slice(0, 6).map((n) => (
            <button
              key={n.id}
              onClick={() => selectNode(n.id)}
              className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 rounded-lg transition font-medium"
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const typeConfig = CONCEPT_TYPE_CONFIG[selectedNode.type] || CONCEPT_TYPE_CONFIG.model;
  const domainColor = DOMAIN_COLORS[selectedNode.domain] || '#6366f1';

  // Find related concepts
  const relatedNodeIds = edges
    .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
    .map((e) => (e.source === selectedNode.id ? e.target : e.source));
  const relatedNodes = nodes.filter((n) => relatedNodeIds.includes(n.id));

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setIsSaved(false);
    updateNode(selectedNode.id, { markdownContent: val });
    setTimeout(() => setIsSaved(true), 500);
  };

  const insertSnippet = (snippet: string) => {
    const updated = content + '\n' + snippet;
    setContent(updated);
    updateNode(selectedNode.id, { markdownContent: updated });
  };

  return (
    <div className="h-full flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-subtle">
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBackToGraph && (
            <button
              onClick={onBackToGraph}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition"
              title="Return to Knowledge Graph"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: typeConfig.bgColor,
                  borderColor: typeConfig.borderColor,
                  color: typeConfig.textColor,
                }}
              >
                {typeConfig.label}
              </span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600"
                style={{ borderLeftColor: domainColor, borderLeftWidth: 3 }}
              >
                {selectedNode.domain}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              {selectedNode.label}
            </h2>
          </div>
        </div>

        {/* View mode toggle & Save status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{isSaved ? 'In-session auto-saved' : 'Saving...'}</span>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('edit')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'edit'
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Editor only"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'split'
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Split view"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'preview'
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Preview only"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Formatting Quick Toolbar (Edit & Split Modes) */}
      {(viewMode === 'edit' || viewMode === 'split') && (
        <div className="px-4 py-2 border-b border-slate-100 bg-white flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
          <button
            onClick={() => insertSnippet('**bold text**')}
            className="p-1 hover:bg-slate-100 rounded transition"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSnippet('*italic text*')}
            className="p-1 hover:bg-slate-100 rounded transition"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSnippet('## Section Heading')}
            className="px-1.5 py-0.5 hover:bg-slate-100 rounded font-bold text-xs"
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => insertSnippet('- Bullet list item')}
            className="p-1 hover:bg-slate-100 rounded transition"
            title="Bullet list"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSnippet('> Quoted excerpt from source...')}
            className="p-1 hover:bg-slate-100 rounded transition"
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSnippet('`code or inline term`')}
            className="p-1 hover:bg-slate-100 rounded transition"
            title="Inline code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <div className="h-3.5 w-px bg-slate-200 mx-1" />

          {/* Quick Insert Related Concept Links */}
          <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-medium">Link concept:</span>
            {relatedNodes.slice(0, 3).map((rn) => (
              <button
                key={rn.id}
                onClick={() => insertSnippet(`- [[${rn.label}]]`)}
                className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition"
              >
                +{rn.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Editor & Preview Split Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div
            className={`h-full flex flex-col ${
              viewMode === 'split' ? 'w-1/2 border-r border-slate-100' : 'w-full'
            }`}
          >
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Write Markdown note here... Include definitions, explanations, formulas, and connections."
              className="flex-1 w-full p-4 bg-white text-slate-800 font-mono text-xs leading-relaxed resize-none outline-none focus:ring-0 placeholder-slate-400"
            />
          </div>
        )}

        {/* Live Preview Area */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`h-full overflow-y-auto p-6 bg-slate-50/50 ${
              viewMode === 'split' ? 'w-1/2' : 'w-full'
            }`}
          >
            <div className="max-w-2xl mx-auto prose prose-slate prose-sm prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-indigo-600 prose-blockquote:border-indigo-300 prose-blockquote:text-slate-600">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {content || '*No content written yet.*'}
              </ReactMarkdown>

              {/* Related Concepts footer within note */}
              {relatedNodes.length > 0 && (
                <div className="mt-8 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Connected Concepts in Graph</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {relatedNodes.map((rn) => (
                      <button
                        key={rn.id}
                        onClick={() => selectNode(rn.id)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-indigo-600 font-medium hover:bg-indigo-50 transition"
                      >
                        {rn.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
