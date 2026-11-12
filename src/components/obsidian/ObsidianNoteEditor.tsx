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
  Clock,
  ArrowRight,
} from 'lucide-react';

export const ObsidianNoteEditor: React.FC = () => {
  const {
    selectedNode,
    updateNodeContent,
    nodes,
    edges,
    selectNode,
    sendMessageToClaude,
    isClaudeOpen,
    toggleClaude,
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
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-obsidian-textMuted bg-obsidian-bg select-none">
        <FileText className="w-12 h-12 mb-3 stroke-1 text-obsidian-textFaint" />
        <h3 className="text-sm font-semibold text-obsidian-text">No Note Selected</h3>
        <p className="text-xs text-obsidian-textMuted mt-1 max-w-xs">
          Select a note from the file tree or click any node in the graph view.
        </p>
      </div>
    );
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);
    updateNodeContent(selectedNode.id, newText);
  };

  // Find backlinks (notes that link to this note)
  const incomingEdgeSources = edges
    .filter((e) => e.target === selectedNode.id)
    .map((e) => e.source);
  const backlinkNodes = nodes.filter((n) => incomingEdgeSources.includes(n.id));

  // Forward links (notes this note links to)
  const outgoingEdgeTargets = edges
    .filter((e) => e.source === selectedNode.id)
    .map((e) => e.target);
  const outgoingNodes = nodes.filter((n) => outgoingEdgeTargets.includes(n.id));

  // Custom renderer for markdown that renders [[wikilinks]] as clickable items
  const renderWikilinkContent = (rawText: string) => {
    const parts = rawText.split(/(\[\[[^\]]+\]\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const linkTargetTitle = part.slice(2, -2).trim();
        const matchedNode = nodes.find(
          (n) => n.label.toLowerCase() === linkTargetTitle.toLowerCase() || n.id === linkTargetTitle.toLowerCase()
        );
        return (
          <span
            key={i}
            onClick={() => {
              if (matchedNode) selectNode(matchedNode.id);
            }}
            className="internal-link"
            title={`Open ${linkTargetTitle}`}
          >
            {linkTargetTitle}
          </span>
        );
      }
      return part;
    });
  };

  const handleAskClaudeToExpand = () => {
    if (!isClaudeOpen) toggleClaude();
    sendMessageToClaude(`Expand on [[${selectedNode.label}]]. What new concepts and connections should be added to the vault?`);
  };

  return (
    <div className="h-full flex flex-col bg-obsidian-bg text-obsidian-text select-text overflow-hidden">
      {/* Editor Top Bar */}
      <div className="h-10 border-b border-obsidian-border bg-obsidian-surface px-4 flex items-center justify-between flex-shrink-0 select-none">
        <div className="flex items-center gap-2 text-xs text-obsidian-textMuted truncate">
          <Folder className="w-3.5 h-3.5" />
          <span>{selectedNode.folder}</span>
          <span>/</span>
          <span className="font-semibold text-obsidian-text truncate">{selectedNode.label}.md</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Ask Claude button */}
          <button
            onClick={handleAskClaudeToExpand}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-obsidian-claudeBg text-obsidian-claude text-xs font-medium hover:bg-obsidian-claude/20 transition border border-obsidian-claude/30"
            title="Ask Claude to expand this note in graph"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expand with Claude</span>
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center bg-obsidian-bg border border-obsidian-border rounded p-0.5 text-xs">
            <button
              onClick={() => setMode('edit')}
              className={`p-1 rounded ${mode === 'edit' ? 'bg-obsidian-hover text-obsidian-purple' : 'text-obsidian-textMuted hover:text-obsidian-text'}`}
              title="Edit mode"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode('split')}
              className={`p-1 rounded ${mode === 'split' ? 'bg-obsidian-hover text-obsidian-purple' : 'text-obsidian-textMuted hover:text-obsidian-text'}`}
              title="Live Split mode"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`p-1 rounded ${mode === 'preview' ? 'bg-obsidian-hover text-obsidian-purple' : 'text-obsidian-textMuted hover:text-obsidian-text'}`}
              title="Reading view"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Note Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor (Edit / Split) */}
        {(mode === 'edit' || mode === 'split') && (
          <div className={`h-full flex flex-col ${mode === 'split' ? 'w-1/2 border-r border-obsidian-border' : 'w-full'}`}>
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing markdown... Use [[Note Title]] to create wikilinks."
              className="flex-1 w-full p-6 bg-obsidian-bg text-obsidian-text font-mono text-xs leading-relaxed resize-none outline-none focus:ring-0 placeholder-obsidian-textFaint"
            />
          </div>
        )}

        {/* Live Preview (Preview / Split) */}
        {(mode === 'preview' || mode === 'split') && (
          <div className={`h-full overflow-y-auto p-6 bg-obsidian-bg ${mode === 'split' ? 'w-1/2' : 'w-full'}`}>
            <div className="max-w-2xl mx-auto space-y-4">
              <h1 className="text-2xl font-bold tracking-tight text-white border-b border-obsidian-border pb-2">
                {selectedNode.label}
              </h1>

              {/* Wikilink rendered markdown */}
              <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-obsidian-text prose-p:leading-relaxed prose-a:text-obsidian-purple prose-code:text-obsidian-purple prose-code:bg-obsidian-surface prose-pre:bg-obsidian-sidebar prose-blockquote:border-obsidian-purple prose-blockquote:text-obsidian-textMuted">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p({ children }) {
                      if (typeof children === 'string') {
                        return <p>{renderWikilinkContent(children)}</p>;
                      }
                      return <p>{children}</p>;
                    },
                    li({ children }) {
                      if (typeof children === 'string') {
                        return <li>{renderWikilinkContent(children)}</li>;
                      }
                      return <li>{children}</li>;
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {/* Linked Mentions & Backlinks section (Obsidian style) */}
              <div className="mt-10 pt-6 border-t border-obsidian-border space-y-3 select-none">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-obsidian-textMuted">
                  <LinkIcon className="w-3.5 h-3.5 text-obsidian-purple" />
                  <span>Linked Mentions & Graph Connections ({backlinkNodes.length + outgoingNodes.length})</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[...outgoingNodes, ...backlinkNodes].map((n, i) => (
                    <button
                      key={`${n.id}_${i}`}
                      onClick={() => selectNode(n.id)}
                      className="px-2.5 py-1 rounded bg-obsidian-surface hover:bg-obsidian-hover border border-obsidian-border text-xs text-obsidian-purple transition flex items-center gap-1"
                    >
                      <span>{n.label}</span>
                      <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                    </button>
                  ))}
                  {outgoingNodes.length === 0 && backlinkNodes.length === 0 && (
                    <span className="text-xs text-obsidian-textFaint italic">No connections yet. Ask Claude to expand this concept!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
