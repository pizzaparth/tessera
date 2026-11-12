import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Sparkles, GitBranch, FileText, CheckCircle2 } from 'lucide-react';

export const ObsidianStatusBar: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNode,
    statusNotification,
    isClaudeOpen,
    toggleClaude,
  } = useWorkspace();

  const wordCount = selectedNode
    ? selectedNode.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const charCount = selectedNode ? selectedNode.content.length : 0;

  return (
    <footer className="h-6 bg-obsidian-titlebar border-t border-obsidian-border px-3 flex items-center justify-between text-[11px] text-obsidian-textMuted select-none flex-shrink-0 z-40">
      {/* Left info */}
      <div className="flex items-center gap-3">
        <span className="font-medium text-obsidian-text">Brain Vault</span>
        <span className="text-obsidian-textFaint">|</span>
        <div className="flex items-center gap-1">
          <GitBranch className="w-3 h-3 text-obsidian-purple" />
          <span>{nodes.length} notes</span>
          <span className="text-obsidian-textFaint">•</span>
          <span>{edges.length} connections</span>
        </div>

        {/* Transient notification */}
        {statusNotification && (
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium animate-pulse ml-2">
            <CheckCircle2 className="w-3 h-3" />
            <span>{statusNotification}</span>
          </div>
        )}
      </div>

      {/* Right info: active note words & Claude status */}
      <div className="flex items-center gap-3">
        {selectedNode && (
          <div className="flex items-center gap-1.5 text-obsidian-textMuted">
            <FileText className="w-3 h-3" />
            <span>{wordCount} words</span>
            <span className="text-obsidian-textFaint">•</span>
            <span>{charCount} characters</span>
          </div>
        )}

        <span className="text-obsidian-textFaint">|</span>

        <button
          onClick={toggleClaude}
          className="flex items-center gap-1 text-obsidian-claude hover:text-white transition font-medium"
        >
          <Sparkles className="w-3 h-3" />
          <span>Claude 3.5 Sonnet (Connected)</span>
        </button>
      </div>
    </footer>
  );
};
