import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  Edit3,
  Eye,
  Columns,
  Sparkles,
  Link as LinkIcon,
  Folder,
  Tag,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const VaultNoteEditor: React.FC = () => {
  const {
    selectedNode,
    updateNodeContent,
    nodes,
    edges,
    selectNode,
    sendMessageToAI,
    isAIOpen,
    toggleAI,
  } = useWorkspace();

  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'preview' | 'edit' | 'split'>('split');

  useEffect(() => {
    if (selectedNode) {
      setContent(selectedNode.content || '');
    }
  }, [selectedNode?.id]);

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#949494] bg-black select-none">
        <FileText className="w-12 h-12 mb-3 stroke-1 text-[#404040]" />
        <h3 className="text-sm font-semibold text-white">No Note Selected</h3>
        <p className="text-xs text-[#949494] mt-1 max-w-xs">
          Select a note from the files tree or click any node in the graph view.
        </p>
      </div>
    );
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);
    updateNodeContent(selectedNode.id, newText);
  };

  // Backlinks (notes linking to this note)
  const incomingEdgeSources = edges
    .filter((e) => e.target === selectedNode.id)
    .map((e) => e.source);
  const backlinkNodes = nodes.filter((n) => incomingEdgeSources.includes(n.id));

  // Forward links (notes this note links to)
  const outgoingEdgeTargets = edges
    .filter((e) => e.source === selectedNode.id)
    .map((e) => e.target);
  const outgoingNodes = nodes.filter((n) => outgoingEdgeTargets.includes(n.id));

  const handleAskAIToExpand = () => {
    if (!isAIOpen) toggleAI();
    sendMessageToAI(
      `Explore and expand on [[${selectedNode.label}]]. What new concepts, sub-theories, or cross-disciplinary connections should be linked in the knowledge vault?`
    );
  };

  // Custom text renderer to make [[wikilinks]] clickable in markdown
  const renderWikilinkContent = (rawText: string) => {
    const parts = rawText.split(/(\[\[[^\]]+\]\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const linkTargetTitle = part.slice(2, -2).trim();
        const matchedNode = nodes.find(
          (n) =>
            n.label.toLowerCase() === linkTargetTitle.toLowerCase() ||
            n.id === linkTargetTitle.toLowerCase()
        );
        return (
          <span
            key={i}
            onClick={() => {
              if (matchedNode) selectNode(matchedNode.id);
            }}
            className="internal-link"
            title={`Open [[${linkTargetTitle}]]`}
          >
            {linkTargetTitle}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="h-full flex flex-col bg-black text-white select-text overflow-hidden">
      {/* Editor Header Bar */}
      <div className="h-10 bg-black border-b border-[#1c1c1c] px-4 flex items-center justify-between flex-shrink-0 select-none text-xs">
        {/* Breadcrumb info */}
        <div className="flex items-center gap-2 text-[#949494] truncate">
          <Folder className="w-3.5 h-3.5 text-[#9d4edd]" />
          <span>{selectedNode.folder || 'Vault'}</span>
          <span className="text-[#404040]">/</span>
          <span className="font-semibold text-white truncate">{selectedNode.label}.md</span>
          {selectedNode.tags && selectedNode.tags.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 ml-2">
              {selectedNode.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 rounded bg-[#181818] text-[#9d4edd] text-[10px] font-mono border border-[#1e1e1e]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Ask AI to expand button */}
          <button
            onClick={handleAskAIToExpand}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181818] hover:bg-[#202020] border border-[#9d4edd]/40 text-[#9d4edd] hover:text-white transition font-medium text-xs shadow-[0_0_8px_rgba(157,78,221,0.2)]"
            title="Ask AI to expand this note and propose graph connections"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Expand with AI</span>
          </button>

          {/* Mode switch */}
          <div className="flex items-center bg-[#0a0a0a] border border-[#1e1e1e] rounded p-0.5">
            <button
              onClick={() => setMode('edit')}
              className={`p-1 rounded transition ${
                mode === 'edit'
                  ? 'bg-[#1e1e1e] text-white shadow-sm'
                  : 'text-[#949494] hover:text-white'
              }`}
              title="Edit Markdown"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode('split')}
              className={`p-1 rounded transition ${
                mode === 'split'
                  ? 'bg-[#1e1e1e] text-white shadow-sm'
                  : 'text-[#949494] hover:text-white'
              }`}
              title="Side-by-side Split"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`p-1 rounded transition ${
                mode === 'preview'
                  ? 'bg-[#1e1e1e] text-white shadow-sm'
                  : 'text-[#949494] hover:text-white'
              }`}
              title="Reading View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Edit Panel */}
        {(mode === 'edit' || mode === 'split') && (
          <div
            className={`h-full flex flex-col bg-black ${
              mode === 'split' ? 'w-1/2 border-r border-[#1c1c1c]' : 'w-full'
            }`}
          >
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Type note in Markdown. Use [[Wikilinks]] to link to other notes..."
              className="w-full h-full bg-black text-white p-6 font-mono text-xs sm:text-sm leading-relaxed outline-none resize-none selection:bg-[#9d4edd]/30"
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview Panel */}
        {(mode === 'preview' || mode === 'split') && (
          <div
            className={`h-full overflow-y-auto p-6 sm:p-8 bg-black ${
              mode === 'split' ? 'w-1/2' : 'w-full'
            }`}
          >
            <div className="max-w-2xl mx-auto space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-[#1c1c1c] pb-3">
                {selectedNode.label}
              </h1>

              {/* Rendered Markdown */}
              <div className="prose prose-invert prose-sm max-w-none text-[#e0e0e0] leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => {
                      if (typeof children === 'string') {
                        return <p className="mb-3">{renderWikilinkContent(children)}</p>;
                      }
                      return <p className="mb-3">{children}</p>;
                    },
                    li: ({ children }) => {
                      if (typeof children === 'string') {
                        return <li>{renderWikilinkContent(children)}</li>;
                      }
                      return <li>{children}</li>;
                    },
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold text-white mt-6 mb-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-bold text-white mt-5 mb-2 border-b border-[#1c1c1c] pb-1">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold text-white mt-4 mb-1">
                        {children}
                      </h3>
                    ),
                    code: ({ inline, children }: any) => {
                      return inline ? (
                        <code className="bg-[#141414] text-[#00f5ff] px-1.5 py-0.5 rounded font-mono text-xs border border-[#1e1e1e]">
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-[#0a0a0a] text-white p-3 rounded-lg border border-[#1c1c1c] font-mono text-xs overflow-x-auto my-3">
                          <code>{children}</code>
                        </pre>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {/* Backlinks & Forward Links Panel */}
              <div className="mt-12 pt-6 border-t border-[#1c1c1c] space-y-4">
                <h4 className="text-xs font-semibold text-[#949494] uppercase tracking-wider flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#9d4edd]" />
                  <span>Linked References ({backlinkNodes.length + outgoingNodes.length})</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Incoming Backlinks */}
                  <div className="bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg p-3 space-y-2">
                    <div className="text-[11px] font-medium text-[#949494] flex items-center justify-between">
                      <span>Linked into this note</span>
                      <span className="font-mono text-[#9d4edd]">{backlinkNodes.length}</span>
                    </div>
                    {backlinkNodes.length === 0 ? (
                      <div className="text-[10px] text-[#606060] italic">No incoming links</div>
                    ) : (
                      <div className="space-y-1">
                        {backlinkNodes.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => selectNode(n.id)}
                            className="w-full text-left px-2 py-1 rounded bg-[#121212] hover:bg-[#1c1c1c] text-white text-xs flex items-center justify-between transition group"
                          >
                            <span className="truncate group-hover:text-[#9d4edd]">{n.label}</span>
                            <ArrowRight className="w-3 h-3 text-[#606060] group-hover:text-white" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Outgoing Forward Links */}
                  <div className="bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg p-3 space-y-2">
                    <div className="text-[11px] font-medium text-[#949494] flex items-center justify-between">
                      <span>Links out from this note</span>
                      <span className="font-mono text-[#00f5ff]">{outgoingNodes.length}</span>
                    </div>
                    {outgoingNodes.length === 0 ? (
                      <div className="text-[10px] text-[#606060] italic">No outgoing links</div>
                    ) : (
                      <div className="space-y-1">
                        {outgoingNodes.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => selectNode(n.id)}
                            className="w-full text-left px-2 py-1 rounded bg-[#121212] hover:bg-[#1c1c1c] text-white text-xs flex items-center justify-between transition group"
                          >
                            <span className="truncate group-hover:text-[#00f5ff]">{n.label}</span>
                            <ExternalLink className="w-3 h-3 text-[#606060] group-hover:text-white" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
