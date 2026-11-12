import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AIProvider } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, ArrowUp, X, GitBranch, ArrowRight, AlertTriangle, ChevronDown } from 'lucide-react';
import { MOD } from './shortcuts';

interface ProviderOption {
  id: AIProvider;
  name: string;
  models: { id: string; name: string }[];
  accentColor: string;
}

export const PROVIDERS: ProviderOption[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    accentColor: '#d97757',
    models: [
      { id: 'claude-sonnet-5-5', name: 'Claude Sonnet 5.5' },
      { id: 'claude-opus-5-5', name: 'Claude Opus 5.5' },
      { id: 'claude-haiku-5-5', name: 'Claude Haiku 5.5' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    accentColor: '#10a37f',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'o1', name: 'o1 Reasoning' },
    ],
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    accentColor: '#4285f4',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    accentColor: '#4d6bfe',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat (V3)' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (R1)' },
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    accentColor: '#9d4edd',
    models: [{ id: 'custom-model', name: 'Custom endpoint' }],
  },
];

export const modelDisplayName = (modelId: string) =>
  PROVIDERS.flatMap((p) => p.models).find((m) => m.id === modelId)?.name ?? modelId;

const SUGGESTIONS = [
  { label: 'Connect AI & Cognitive Science', prompt: 'What are the deepest connections between Artificial Intelligence and Cognitive Science in this vault?' },
  { label: 'Bridge Philosophy & Systems', prompt: 'Generate 3 novel cross-disciplinary research ideas connecting our Philosophy of Mind and Systems Theory notes.' },
  { label: 'Propose frontier concepts', prompt: 'Expand our graph: propose 4 new frontier concepts with links to existing notes.' },
];

const MAX_INPUT_HEIGHT = 160;

export const AIChatPlugin: React.FC<{ floating?: boolean }> = ({ floating = false }) => {
  const {
    chatMessages,
    sendMessageToAI,
    isChatLoading,
    isAIOpen,
    toggleAI,
    selectedNode,
    selectNode,
    setActiveView,
    activeProvider,
    activeModel,
    setActiveModel,
  } = useWorkspace();

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Stick to the bottom as messages arrive
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  // Focus the composer when the panel opens
  useEffect(() => {
    if (isAIOpen) window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
  }, [isAIOpen]);

  // Auto-grow the composer
  useLayoutEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }, [input, isAIOpen]);

  if (!isAIOpen) return null;

  const send = (text: string) => {
    if (!text.trim() || isChatLoading) return;
    sendMessageToAI(text);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isChatLoading) return;
    const textToSend = input;
    setInput('');
    send(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentProvider = PROVIDERS.find((p) => p.id === activeProvider) || PROVIDERS[0];
  const hasUserMessages = chatMessages.some((m) => m.role === 'user');

  return (
    <aside
      className={`w-[min(380px,calc(100vw-44px))] bg-black border-l border-[#1c1c1c] flex flex-col h-full flex-shrink-0 select-none text-xs ${
        floating ? 'absolute inset-y-0 right-0 z-40 shadow-[-24px_0_60px_-20px_rgba(0,0,0,0.9)] vault-slide-in-right' : 'relative z-30'
      }`}
      aria-label="AI assistant"
    >
      {/* Header */}
      <div className="h-12 px-3 border-b border-[#1c1c1c] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: currentProvider.accentColor }}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white text-xs">AI Assistant</div>
            {/* Model picker: one control instead of separate provider + model selects */}
            <label className="relative flex items-center gap-1 text-[11px] text-[#a3a3a3] hover:text-white cursor-pointer">
              <span className="sr-only">Model</span>
              <select
                value={`${activeProvider}::${activeModel}`}
                onChange={(e) => {
                  const [prov, model] = e.target.value.split('::');
                  setActiveModel(model, prov as AIProvider);
                }}
                className="appearance-none bg-transparent pr-4 outline-none cursor-pointer truncate max-w-[200px]"
              >
                {PROVIDERS.map((p) => (
                  <optgroup key={p.id} label={p.name} className="bg-black">
                    {p.models.map((m) => (
                      <option key={m.id} value={`${p.id}::${m.id}`} className="bg-black text-white">
                        {m.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-0 pointer-events-none" />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={toggleAI}
            className="p-1.5 text-[#8a8a8a] hover:text-white hover:bg-[#181818] rounded transition"
            title={`Close (${MOD} J)`}
            aria-label="Close AI assistant"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-4 select-text" aria-live="polite">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[88%] rounded-2xl rounded-br-md px-3.5 py-2 bg-[#1c1530] border border-[#9d4edd]/25 text-white text-[12.5px] leading-relaxed whitespace-pre-wrap break-words">
                  {msg.content}
                </div>
              </div>
            );
          }
          return (
            <div key={msg.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[10px] text-[#7c7c7c] px-0.5 select-none">
                <Sparkles className="w-3 h-3 text-[#b57aed]" />
                <span className="text-[#c4c4c4] font-medium">{modelDisplayName(msg.model || activeModel)}</span>
                <span>· {msg.timestamp}</span>
                {msg.isSimulated && (
                  <span
                    className="ml-1 rounded border border-[#2a2a2a] px-1 text-[9px] uppercase tracking-wide text-[#8a8a8a]"
                    title="This answer came from the built-in demo generator"
                  >
                    demo
                  </span>
                )}
              </div>
              <div
                className={`rounded-xl px-3.5 py-2.5 text-[12.5px] leading-relaxed break-words ${
                  msg.isError
                    ? 'bg-[#1a0d12] border border-[#ff2a85]/30 text-[#f3d5df]'
                    : 'bg-[#0b0b0b] border border-[#1a1a1a] text-[#e6e6e6]'
                }`}
              >
                {msg.isError && <AlertTriangle className="w-3.5 h-3.5 text-[#ff5c9d] mb-1" />}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1 marker:text-[#6b6b6b]">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1 marker:text-[#6b6b6b]">{children}</ol>,
                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    code: ({ children }) => (
                      <code className="bg-[#141414] text-[#7df9ff] px-1 py-0.5 rounded font-mono text-[11px] border border-[#1e1e1e]">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>

                {msg.expandedNodes && msg.expandedNodes.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#1e1e1e] space-y-1.5 select-none">
                    <div className="text-[10px] text-[#4ade80] font-medium flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      Added {msg.expandedNodes.length} note{msg.expandedNodes.length === 1 ? '' : 's'} to your graph
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {msg.expandedNodes.map((node) => (
                        <button
                          key={node.id}
                          onClick={() => {
                            selectNode(node.id);
                            setActiveView('graph');
                          }}
                          className="px-2 py-0.5 rounded-full bg-[#141414] hover:bg-[#1e1e1e] border border-[#262626] hover:border-[#9d4edd] text-[10px] text-white transition flex items-center gap-1 group"
                          title="Show in graph"
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color || '#00f5ff' }} />
                          <span>{node.label}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-[#6b6b6b] group-hover:text-white" />
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
          <div className="flex items-center gap-2 text-[11px] text-[#8a8a8a] px-1 select-none" role="status">
            <span className="flex items-center gap-1" aria-hidden="true">
              <span className="vault-typing-dot" />
              <span className="vault-typing-dot" />
              <span className="vault-typing-dot" />
            </span>
            Thinking with {modelDisplayName(activeModel)}…
          </div>
        )}

        {/* Suggestions sit under the welcome message until the first question */}
        {!hasUserMessages && !isChatLoading && (
          <div className="space-y-1.5 select-none">
            <div className="text-[10px] uppercase tracking-wider text-[#6b6b6b] px-0.5">Suggestions</div>
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => send(s.prompt)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#0b0b0b] hover:bg-[#141414] border border-[#1c1c1c] hover:border-[#2c2c2c] text-left text-[12px] text-[#c4c4c4] hover:text-white transition-colors group"
              >
                {s.label}
                <ArrowRight className="w-3 h-3 text-[#6b6b6b] group-hover:text-[#b57aed] flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={handleSend} className="p-2.5 border-t border-[#1c1c1c] bg-black space-y-1.5">
        {selectedNode && (
          <div className="flex items-center justify-between gap-2 text-[10px] text-[#8a8a8a] px-1">
            <span className="truncate">
              Context: <span className="text-[#d4d4d4]">{selectedNode.label}</span>
            </span>
            <button
              type="button"
              onClick={() => send(`Analyze [[${selectedNode.label}]] and propose 2 new connecting notes with explanations.`)}
              disabled={isChatLoading}
              className="text-[#b57aed] hover:text-white disabled:opacity-40 transition font-medium flex items-center gap-0.5 whitespace-nowrap"
            >
              Expand this note <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
        <div className="flex items-end gap-1.5 bg-[#0a0a0a] border border-[#222222] focus-within:border-[#9d4edd]/80 rounded-xl pl-3 pr-1.5 py-1.5 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedNode ? `Ask about ${selectedNode.label}…` : 'Ask anything about your vault…'}
            rows={1}
            className="w-full bg-transparent text-white placeholder-[#6b6b6b] outline-none text-[12.5px] leading-5 resize-none py-1"
            aria-label="Message the AI assistant"
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatLoading}
            className="p-1.5 rounded-lg bg-[#9d4edd] hover:bg-[#8b3bd6] disabled:bg-[#262626] disabled:text-[#6b6b6b] text-white transition-colors flex-shrink-0"
            title="Send (Enter)"
            aria-label="Send message"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-[10px] text-[#5f5f5f] px-1">Enter to send · Shift+Enter for a new line</div>
      </form>
    </aside>
  );
};
