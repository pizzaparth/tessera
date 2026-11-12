import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useWorkspace, findNodeByTitle } from '../../context/WorkspaceContext';
import { AIProvider } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, X, GitBranch, ArrowRight, AlertTriangle, ChevronDown } from 'lucide-react';
import { AgentAvatar, UserAvatar } from './Avatars';
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
const WIKILINK_PREFIX = '#wikilink:';

/** Make [[links]] in AI answers clickable. */
const linkify = (md: string) =>
  md.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, t: string, alias?: string) =>
    `[${(alias || t).trim()}](<${WIKILINK_PREFIX}${encodeURIComponent(t.trim())}>)`
  );

export const AIChatPlugin: React.FC<{ floating?: boolean }> = ({ floating = false }) => {
  const {
    chatMessages,
    sendMessageToAI,
    isChatLoading,
    isAIOpen,
    toggleAI,
    selectedNode,
    selectNode,
    openNote,
    setActiveView,
    nodes,
    activeProvider,
    activeModel,
    setActiveModel,
  } = useWorkspace();

  const [input, setInput] = useState('');
  const [statusIndex, setStatusIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Stick to the bottom as messages arrive
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  // Cycle through progress lines while waiting, like the landing preview
  useEffect(() => {
    if (!isChatLoading) return;
    setStatusIndex(0);
    const t = window.setInterval(() => setStatusIndex((i) => i + 1), 1300);
    return () => window.clearInterval(t);
  }, [isChatLoading]);

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

  const hasUserMessages = chatMessages.some((m) => m.role === 'user');
  const statuses = [
    `Reading ${nodes.length} notes in your vault…`,
    selectedNode ? `Looking at ${selectedNode.label}…` : 'Matching concepts across folders…',
    'Drafting linked notes…',
  ];

  return (
    <aside
      className={`w-[min(400px,calc(100vw-24px))] bg-white border-l border-black/5 flex flex-col h-full flex-shrink-0 select-none ${
        floating ? 'absolute inset-y-0 right-0 z-40 shadow-[-24px_0_60px_-24px_rgba(20,10,50,0.35)] vault-slide-in-right' : 'relative z-30'
      }`}
      aria-label="Vault AI"
    >
      {/* Header */}
      <div className="h-12 px-4 border-b border-black/5 flex items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-semibold text-[16px] tracking-[-0.01em]">Vault AI</span>
          <span className="vault-badge">Agent</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Single model picker */}
          <label className="relative flex items-center rounded-full bg-black/[0.04] hover:bg-black/[0.07] transition-colors cursor-pointer">
            <span className="sr-only">Model</span>
            <select
              value={`${activeProvider}::${activeModel}`}
              onChange={(e) => {
                const [prov, model] = e.target.value.split('::');
                setActiveModel(model, prov as AIProvider);
              }}
              className="appearance-none bg-transparent pl-3 pr-7 py-1 text-[12.5px] font-medium text-black/70 outline-none cursor-pointer max-w-[170px] truncate"
            >
              {PROVIDERS.map((p) => (
                <optgroup key={p.id} label={p.name}>
                  {p.models.map((m) => (
                    <option key={m.id} value={`${p.id}::${m.id}`}>
                      {m.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 pointer-events-none text-black/45" />
          </label>
          <button
            onClick={toggleAI}
            className="p-1.5 rounded-full text-black/45 hover:text-black hover:bg-black/5 transition"
            title={`Close (${MOD} J)`}
            aria-label="Close Vault AI"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thread */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5 select-text" aria-live="polite">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className="flex gap-3 vault-fade-in">
              {isUser ? <UserAvatar /> : <AgentAvatar />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[14px] select-none">
                  <span className="font-semibold">{isUser ? 'You' : 'Vault AI'}</span>
                  {!isUser && <span className="vault-badge">Agent</span>}
                  <span className="text-black/40 text-[12px]">{msg.timestamp}</span>
                  {msg.isSimulated && (
                    <span
                      className="text-[11px] text-black/40 ring-1 ring-black/10 rounded px-1"
                      title="This answer came from the built-in demo generator"
                    >
                      demo
                    </span>
                  )}
                </div>

                {isUser ? (
                  <p className="text-[14.5px] leading-[1.5] text-black/85 whitespace-pre-wrap break-words">{msg.content}</p>
                ) : (
                  <div
                    className={`text-[14.5px] leading-[1.5] break-words ${
                      msg.isError ? 'mt-1 rounded-xl bg-[#fff1f6] ring-1 ring-[#e21e86]/15 px-3 py-2.5 text-black/80' : 'text-black/85'
                    }`}
                  >
                    {msg.isError && <AlertTriangle className="w-4 h-4 text-[#e21e86] mb-1" />}
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1 marker:text-black/30">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1 marker:text-black/40">{children}</ol>,
                        strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
                        em: ({ children }) => <em className="text-black/65">{children}</em>,
                        code: ({ children }) => (
                          <code className="bg-black/5 px-1 py-0.5 rounded font-mono text-[12.5px]">{children}</code>
                        ),
                        a: ({ href, children }) => {
                          if (href?.startsWith(WIKILINK_PREFIX)) {
                            const match = findNodeByTitle(nodes, decodeURIComponent(href.slice(WIKILINK_PREFIX.length)));
                            return match ? (
                              <button type="button" onClick={() => openNote(match.id)} className="internal-link">
                                {children}
                              </button>
                            ) : (
                              <span className="text-[#6d55bd] font-medium">{children}</span>
                            );
                          }
                          return (
                            <a href={href} target="_blank" rel="noreferrer" className="text-[#6d55bd] font-medium underline">
                              {children}
                            </a>
                          );
                        },
                      }}
                    >
                      {linkify(msg.content)}
                    </ReactMarkdown>
                  </div>
                )}

                {msg.expandedNodes && msg.expandedNodes.length > 0 && (
                  <div className="mt-3 rounded-xl vault-sidebar ring-1 ring-black/5 p-2.5 select-none">
                    <div className="px-1 mb-1.5 text-[12px] text-black/50 flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-[#0891b2]" />
                      Added {msg.expandedNodes.length} note{msg.expandedNodes.length === 1 ? '' : 's'} to your graph
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.expandedNodes.map((node) => (
                        <button
                          key={node.id}
                          onClick={() => {
                            selectNode(node.id);
                            setActiveView('graph');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white shadow-[0_1px_2px_rgba(15,10,20,0.08)] text-[12.5px] text-black/80 hover:text-black hover:shadow-[0_1px_4px_rgba(15,10,20,0.14)] transition flex items-center gap-1.5 group"
                          title="Show in graph"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                          {node.label}
                          <ArrowRight className="w-3 h-3 text-black/30 group-hover:text-black/60" />
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
          <div className="flex gap-3 vault-fade-in" role="status">
            <AgentAvatar />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[14px]">
                <span className="font-semibold">Vault AI</span>
                <span className="vault-badge">Agent</span>
              </div>
              <p className="atlas-shimmer-text text-[14.5px]">{statuses[statusIndex % statuses.length]}</p>
            </div>
          </div>
        )}

        {/* Suggestions until the first question, styled like the landing prompt chips */}
        {!hasUserMessages && !isChatLoading && (
          <div className="pl-12 space-y-1.5 select-none">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => send(s.prompt)}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl ring-1 ring-black/10 hover:ring-black/20 hover:bg-[#faf9ff] text-left text-[14px] text-black/75 hover:text-black transition group"
              >
                {s.label}
                <ArrowRight className="w-3.5 h-3.5 text-black/30 group-hover:text-[#6d55bd] flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer, like the landing preview */}
      <form onSubmit={handleSend} className="px-4 pb-4 pt-1 flex-shrink-0">
        {selectedNode && (
          <div className="flex items-center justify-between gap-2 px-1 pb-2 text-[12px] text-black/45">
            <span className="truncate">
              Reading <span className="text-black/75 font-medium">{selectedNode.label}</span>
            </span>
            <button
              type="button"
              onClick={() => send(`Analyze [[${selectedNode.label}]] and propose 2 new connecting notes with explanations.`)}
              disabled={isChatLoading}
              className="text-[#6d55bd] font-medium hover:underline disabled:opacity-40 whitespace-nowrap"
            >
              Expand this note
            </button>
          </div>
        )}
        <div className="flex items-end gap-2 rounded-xl ring-1 ring-black/10 focus-within:ring-[#6d55bd]/60 focus-within:shadow-[0_0_0_4px_rgba(109,85,189,0.1)] px-3.5 py-2.5 transition">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your vault…"
            rows={1}
            className="w-full bg-transparent text-black placeholder-black/40 outline-none text-[14px] leading-6 resize-none"
            aria-label="Message Vault AI"
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatLoading}
            className="mb-1 text-black/70 hover:text-black disabled:text-black/25 transition-colors flex-shrink-0"
            title="Send (Enter)"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </aside>
  );
};
