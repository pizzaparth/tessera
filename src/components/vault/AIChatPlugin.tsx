import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AIProvider } from '../../types';
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
  Key,
  ChevronDown,
  Layers,
  Settings2,
  Check,
  Cpu,
} from 'lucide-react';

interface ProviderOption {
  id: AIProvider;
  name: string;
  models: { id: string; name: string }[];
  accentColor: string;
}

const PROVIDERS: ProviderOption[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    accentColor: '#d97757',
    models: [
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet' },
      { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku' },
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
    accentColor: '#0066ff',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat (V3)' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (R1)' },
    ],
  },
  {
    id: 'custom',
    name: 'Custom / Other',
    accentColor: '#9d4edd',
    models: [
      { id: 'custom-model', name: 'Custom Endpoint' },
    ],
  },
];

export const AIChatPlugin: React.FC = () => {
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
    apiKeys,
    setProviderApiKey,
  } = useWorkspace();

  const [input, setInput] = useState('');
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  useEffect(() => {
    if (showKeyDialog) {
      setTempApiKey(apiKeys[activeProvider] || '');
    }
  }, [showKeyDialog, activeProvider, apiKeys]);

  if (!isAIOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isChatLoading) return;
    const textToSend = input;
    setInput('');
    sendMessageToAI(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentProviderConfig =
    PROVIDERS.find((p) => p.id === activeProvider) || PROVIDERS[0];

  const handleSaveKey = () => {
    setProviderApiKey(activeProvider, tempApiKey.trim());
    setShowKeyDialog(false);
  };

  return (
    <aside className="w-80 sm:w-96 bg-black border-l border-[#1c1c1c] flex flex-col h-full flex-shrink-0 z-30 select-none text-xs">
      {/* Plugin Header: Universal AI Branding & Provider Selector */}
      <div className="p-3 border-b border-[#1c1c1c] bg-black flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: currentProviderConfig.accentColor }}
          >
            <Sparkles className="w-3.5 h-3.5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs">AI Assistant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" title="Ready" />
            </div>
            <div className="text-[10px] text-[#949494] font-mono">
              Universal Graph Intelligence
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* API Key Modal Toggle */}
          <button
            onClick={() => setShowKeyDialog(true)}
            className={`p-1.5 rounded transition ${
              apiKeys[activeProvider]
                ? 'text-[#00ff88] bg-[#181818]'
                : 'text-[#949494] hover:text-white hover:bg-[#181818]'
            }`}
            title="Configure API Keys for AI Models"
          >
            <Key className="w-3.5 h-3.5" />
          </button>

          {/* Close Sidebar */}
          <button
            onClick={toggleAI}
            className="p-1.5 text-[#949494] hover:text-white hover:bg-[#181818] rounded transition"
            title="Close AI Assistant"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Model & Provider Selector Strip */}
      <div className="px-3 py-2 bg-[#080808] border-b border-[#1c1c1c] space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          {/* Provider Selector */}
          <div className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#949494]" />
            <select
              value={activeProvider}
              onChange={(e) => {
                const newProvider = e.target.value as AIProvider;
                const found = PROVIDERS.find((p) => p.id === newProvider);
                if (found && found.models.length > 0) {
                  setActiveModel(found.models[0].id, newProvider);
                }
              }}
              className="bg-transparent text-white font-medium outline-none cursor-pointer text-xs"
            >
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id} className="bg-black text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Model Selector */}
          <select
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value, activeProvider)}
            className="bg-[#121212] text-[#9d4edd] font-mono px-2 py-0.5 rounded border border-[#1e1e1e] outline-none cursor-pointer text-[11px]"
          >
            {currentProviderConfig.models.map((m) => (
              <option key={m.id} value={m.id} className="bg-black text-white">
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Note Context Pill */}
        {selectedNode && (
          <div className="flex items-center justify-between text-[10px] text-[#949494] bg-[#101010] px-2 py-1 rounded border border-[#1c1c1c]">
            <span className="truncate">
              Focus: <strong className="text-white">[[{selectedNode.label}]]</strong>
            </span>
            <button
              onClick={() =>
                sendMessageToAI(
                  `Analyze [[${selectedNode.label}]] and propose 2 new connecting notes with explanations.`
                )
              }
              className="text-[#9d4edd] hover:text-white transition font-medium flex items-center gap-0.5"
            >
              <span>+ Expand</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
      </div>

      {/* API Key Modal Popup */}
      {showKeyDialog && (
        <div className="p-3 bg-[#0e0e0e] border-b border-[#1c1c1c] space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white text-xs flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#9d4edd]" />
              {currentProviderConfig.name} API Key
            </span>
            <button
              onClick={() => setShowKeyDialog(false)}
              className="text-[#949494] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-[#949494] leading-relaxed">
            Enter your key or leave blank to use the server environment variable.
          </p>
          <div className="flex items-center gap-1.5">
            <input
              type="password"
              placeholder={`Enter ${currentProviderConfig.name} key...`}
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              className="flex-1 bg-black text-white border border-[#1e1e1e] rounded px-2.5 py-1 text-xs outline-none focus:border-[#9d4edd]"
            />
            <button
              onClick={handleSaveKey}
              className="px-3 py-1 bg-[#9d4edd] hover:bg-[#8b3bd6] text-white rounded font-medium text-xs transition"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 select-text">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col space-y-1 ${isUser ? 'items-end' : 'items-start'}`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-1.5 text-[10px] text-[#606060] px-1">
                {isUser ? (
                  <>
                    <span>{msg.timestamp}</span>
                    <span className="text-[#949494] font-medium">You</span>
                    <User className="w-3 h-3 text-[#949494]" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-[#9d4edd]" />
                    <span className="text-white font-medium">
                      {msg.model || activeModel}
                    </span>
                    <span>• {msg.timestamp}</span>
                  </>
                )}
              </div>

              {/* Message Body */}
              <div
                className={`max-w-[92%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#181818] text-white border border-[#222222]'
                    : 'bg-[#0a0a0a] text-white border border-[#1a1a1a] shadow-sm'
                }`}
              >
                <div className="prose prose-invert prose-xs max-w-none text-white">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => (
                        <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
                      ),
                      code: ({ inline, children }: any) =>
                        inline ? (
                          <code className="bg-[#141414] text-[#00f5ff] px-1 py-0.5 rounded font-mono text-[11px] border border-[#1e1e1e]">
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-black text-white p-2 rounded border border-[#1e1e1e] font-mono text-[11px] my-2 overflow-x-auto">
                            <code>{children}</code>
                          </pre>
                        ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* If AI dynamically expanded nodes, display interactive pills */}
                {msg.expandedNodes && msg.expandedNodes.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#1e1e1e] space-y-1.5">
                    <div className="text-[10px] text-[#00ff88] font-semibold flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      <span>Dynamically expanded graph ({msg.expandedNodes.length} nodes):</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {msg.expandedNodes.map((node) => (
                        <button
                          key={node.id}
                          onClick={() => {
                            selectNode(node.id);
                            setActiveView('graph');
                          }}
                          className="px-2 py-0.5 rounded-full bg-[#141414] hover:bg-[#1e1e1e] border border-[#252525] hover:border-[#9d4edd] text-[10px] text-white transition flex items-center gap-1 group"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: node.color || '#00f5ff' }}
                          />
                          <span>{node.label}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-[#606060] group-hover:text-white" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isChatLoading && (
          <div className="flex items-center gap-2 text-xs text-[#949494] p-2 bg-[#0a0a0a] rounded-lg border border-[#1c1c1c] w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#9d4edd] animate-spin" />
            <span>Reasoning & expanding graph with {activeModel}...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-3 py-1.5 bg-[#080808] border-t border-[#1c1c1c] flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none">
        <button
          onClick={() =>
            sendMessageToAI(
              'What are the deepest connections between Artificial Intelligence and Cognitive Science in this vault?'
            )
          }
          className="whitespace-nowrap px-2 py-1 rounded bg-[#101010] hover:bg-[#181818] text-[10px] text-[#949494] hover:text-white transition border border-[#1c1c1c]"
        >
          AI & Cognitive Science
        </button>
        <button
          onClick={() =>
            sendMessageToAI(
              'Generate 3 novel cross-disciplinary research ideas connecting our Philosophy of Mind and Systems Theory nodes.'
            )
          }
          className="whitespace-nowrap px-2 py-1 rounded bg-[#101010] hover:bg-[#181818] text-[10px] text-[#949494] hover:text-white transition border border-[#1c1c1c]"
        >
          Synthesize Philosophy & Systems
        </button>
        <button
          onClick={() =>
            sendMessageToAI(
              'Expand our graph: Propose 4 new frontier concepts with edges to existing notes.'
            )
          }
          className="whitespace-nowrap px-2 py-1 rounded bg-[#101010] hover:bg-[#181818] text-[10px] text-[#949494] hover:text-white transition border border-[#1c1c1c]"
        >
          + Expand Frontier Concepts
        </button>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-2.5 border-t border-[#1c1c1c] bg-black">
        <div className="flex items-end gap-1.5 bg-[#0a0a0a] border border-[#1e1e1e] focus-within:border-[#9d4edd] rounded-lg px-2.5 py-1.5 transition">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${activeModel} to expand your vault graph...`}
            rows={2}
            className="w-full bg-transparent text-white placeholder-[#606060] outline-none text-xs resize-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatLoading}
            className="p-1.5 rounded-md bg-[#9d4edd] hover:bg-[#8b3bd6] disabled:opacity-30 disabled:hover:bg-[#9d4edd] text-white transition flex-shrink-0"
            title="Send (Enter)"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-[#505050] px-1">
          <span>Enter to send, Shift+Enter for newline</span>
          <span className="font-mono">{activeProvider}</span>
        </div>
      </form>
    </aside>
  );
};
