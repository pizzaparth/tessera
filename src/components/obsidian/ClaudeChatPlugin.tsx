import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  GitBranch,
  ArrowRight,
  Plus,
  RefreshCw,
  Key,
  ChevronDown,
} from 'lucide-react';

export const ClaudeChatPlugin: React.FC = () => {
  const {
    chatMessages,
    sendMessageToClaude,
    isChatLoading,
    isClaudeOpen,
    toggleClaude,
    selectedNode,
    selectNode,
    setActiveView,
    apiKey,
    setApiKey,
  } = useWorkspace();

  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('Claude 3.5 Sonnet');
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  if (!isClaudeOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isChatLoading) return;
    const textToSend = input;
    setInput('');
    sendMessageToClaude(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (actionPrompt: string) => {
    sendMessageToClaude(actionPrompt);
  };

  const handleSaveKey = () => {
    setApiKey(tempApiKey.trim() || null);
    setShowKeyDialog(false);
  };

  return (
    <aside className="w-80 sm:w-96 bg-obsidian-sidebar border-l border-obsidian-border flex flex-col h-full flex-shrink-0 z-30 select-none text-xs">
      {/* Plugin Header: Claude Branding & Model Selector */}
      <div className="p-3 border-b border-obsidian-border bg-obsidian-titlebar flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-obsidian-claude flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-obsidian-text text-xs">Claude</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Connected" />
            </div>
            <div className="text-[10px] text-obsidian-textMuted font-mono">
              Obsidian Assistant v1.4.2
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* API Key Modal Toggle */}
          <button
            onClick={() => setShowKeyDialog(true)}
            className={`p-1.5 rounded transition ${
              apiKey
                ? 'text-emerald-400 hover:bg-obsidian-hover'
                : 'text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-hover'
            }`}
            title={apiKey ? 'Anthropic API Key configured' : 'Set custom API key'}
          >
            <Key className="w-3.5 h-3.5" />
          </button>

          {/* Close Sidebar */}
          <button
            onClick={toggleClaude}
            className="p-1.5 text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-hover rounded transition"
            title="Close Claude Assistant"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Model Indicator & Quick Settings */}
      <div className="px-3 py-1.5 bg-obsidian-surface border-b border-obsidian-border flex items-center justify-between text-[11px] text-obsidian-textMuted">
        <div className="flex items-center gap-1 font-medium text-obsidian-text">
          <span>Model:</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-transparent text-obsidian-claude font-semibold outline-none cursor-pointer"
          >
            <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
            <option value="Claude 3.5 Haiku">Claude 3.5 Haiku</option>
            <option value="Claude 3 Opus">Claude 3 Opus</option>
          </select>
        </div>
        <span className="text-[10px] text-obsidian-textFaint">
          {apiKey ? 'API: Live Key' : 'API: Auto-Fallback'}
        </span>
      </div>

      {/* API Key Dialog Overlay (if open) */}
      {showKeyDialog && (
        <div className="p-3 bg-obsidian-activeTab border-b border-obsidian-border space-y-2 animate-in fade-in duration-150">
          <div className="text-[11px] font-semibold text-obsidian-text flex items-center justify-between">
            <span>Anthropic API Key</span>
            <button onClick={() => setShowKeyDialog(false)} className="text-obsidian-textMuted hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[10px] text-obsidian-textMuted">
            You can also configure this by placing <code className="text-obsidian-purple">ANTHROPIC_API_KEY</code> into your <code className="text-obsidian-purple">.env</code> file.
          </p>
          <input
            type="password"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full p-1.5 bg-obsidian-bg border border-obsidian-border rounded text-xs text-obsidian-text font-mono outline-none focus:border-obsidian-claude"
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => {
                setTempApiKey('');
                setApiKey(null);
                setShowKeyDialog(false);
              }}
              className="px-2 py-0.5 text-[11px] text-rose-400 hover:underline"
            >
              Clear
            </button>
            <button
              onClick={handleSaveKey}
              className="px-3 py-1 bg-obsidian-claude hover:bg-obsidian-claudeHover text-white rounded text-[11px] font-semibold transition"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 select-text">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className="space-y-1.5">
              {/* Header row */}
              <div className="flex items-center gap-1.5 text-[10px] text-obsidian-textMuted font-medium select-none">
                {isUser ? (
                  <>
                    <User className="w-3 h-3 text-obsidian-textMuted" />
                    <span>You</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-obsidian-claude" />
                    <span className="text-obsidian-claude font-semibold">Claude</span>
                  </>
                )}
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Content */}
              <div
                className={`p-3 rounded-xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-obsidian-hover text-obsidian-text border border-obsidian-border'
                    : 'bg-obsidian-surface text-obsidian-text border border-obsidian-border/60 shadow-sm'
                }`}
              >
                <div className="prose prose-invert prose-xs max-w-none prose-p:leading-relaxed prose-headings:text-white prose-a:text-obsidian-purple prose-code:text-obsidian-claude">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Graph Expansion Indicator */}
                {msg.expandedNodes && msg.expandedNodes.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-obsidian-border/80 space-y-1.5 select-none">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                      <GitBranch className="w-3 h-3" />
                      <span>Expanded Graph (+{msg.expandedNodes.length} notes added to vault)</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {msg.expandedNodes.map((node) => (
                        <button
                          key={node.id}
                          onClick={() => {
                            selectNode(node.id);
                            setActiveView('graph');
                          }}
                          className="px-2 py-0.5 rounded bg-obsidian-activeTab hover:bg-obsidian-hover border border-obsidian-border text-[10px] text-obsidian-purple font-medium flex items-center gap-1 transition"
                        >
                          <span>{node.label}</span>
                          <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isChatLoading && (
          <div className="p-3 bg-obsidian-surface border border-obsidian-border rounded-xl text-xs text-obsidian-textMuted flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-obsidian-claude animate-spin" />
            <span>Claude is synthesizing thoughts and expanding graph nodes...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-1.5 border-t border-obsidian-border bg-obsidian-titlebar flex items-center gap-1 overflow-x-auto no-scrollbar">
        {selectedNode && (
          <button
            onClick={() => handleQuickAction(`Expand on [[${selectedNode.label}]]. What new concepts and links connect to it?`)}
            className="px-2 py-1 rounded bg-obsidian-surface hover:bg-obsidian-hover border border-obsidian-border text-[10px] text-obsidian-text truncate whitespace-nowrap transition"
          >
            Expand [[{selectedNode.label}]]
          </button>
        )}
        <button
          onClick={() => handleQuickAction('Discover hidden connections across different folders in this vault.')}
          className="px-2 py-1 rounded bg-obsidian-surface hover:bg-obsidian-hover border border-obsidian-border text-[10px] text-obsidian-text whitespace-nowrap transition"
        >
          Find hidden links
        </button>
        <button
          onClick={() => handleQuickAction('Synthesize key open questions between Artificial General Intelligence and Philosophy of Mind.')}
          className="px-2 py-1 rounded bg-obsidian-surface hover:bg-obsidian-hover border border-obsidian-border text-[10px] text-obsidian-text whitespace-nowrap transition"
        >
          Synthesize AGI & Mind
        </button>
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-2.5 border-t border-obsidian-border bg-obsidian-surface">
        <div className="relative flex items-center bg-obsidian-bg border border-obsidian-border rounded-xl focus-within:border-obsidian-claude transition p-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Claude to expand nodes or explore ideas..."
            rows={2}
            className="w-full bg-transparent text-obsidian-text placeholder-obsidian-textFaint text-xs px-2 py-1 resize-none outline-none focus:ring-0 leading-relaxed font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatLoading}
            className="p-2 bg-obsidian-claude hover:bg-obsidian-claudeHover disabled:opacity-40 text-white rounded-lg transition self-end mb-1 mr-1"
            title="Send to Claude (Enter)"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-[10px] text-obsidian-textFaint mt-1 px-1 flex items-center justify-between">
          <span>Shift+Enter for new line</span>
          <span>Claude plugin for Obsidian</span>
        </div>
      </form>
    </aside>
  );
};
