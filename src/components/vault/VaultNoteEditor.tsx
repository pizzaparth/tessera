import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useWorkspace, findNodeByTitle } from '../../context/WorkspaceContext';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  Edit3,
  Eye,
  Columns,
  Sparkles,
  Link as LinkIcon,
  Folder,
  ArrowRight,
  ArrowLeft,
  Search,
  Plus,
  Check,
} from 'lucide-react';
import { MOD, TOGGLE_EDIT_EVENT } from './shortcuts';

type EditorMode = 'preview' | 'edit' | 'split';

const MODE_KEY = 'brain-vault:editor-mode';
/** Below this pane width, side-by-side edit/preview is too cramped. */
const SPLIT_MIN_WIDTH = 760;

const readMode = (): EditorMode => {
  try {
    const m = localStorage.getItem(MODE_KEY);
    if (m === 'preview' || m === 'edit' || m === 'split') return m;
  } catch {
    /* ignore */
  }
  return 'split';
};

const WIKILINK_PREFIX = '#wikilink:';
const TAG_PREFIX = '#tag:';

const encodeTarget = (t: string) => encodeURIComponent(t).replace(/\(/g, '%28').replace(/\)/g, '%29');

/**
 * Turn [[Wikilinks]] and #tags into ordinary markdown links with private
 * hrefs, so they render correctly anywhere (lists, bold text, tables).
 * Fenced and inline code are left untouched.
 */
const preprocessMarkdown = (md: string) =>
  md
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((chunk, i) => {
      if (i % 2 === 1) return chunk; // code
      return chunk
        .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target: string, alias?: string) => {
          const text = (alias || target).trim().replace(/[[\]]/g, '');
          return `[${text}](<${WIKILINK_PREFIX}${encodeTarget(target.trim())}>)`;
        })
        .replace(/(^|[\s(])#([a-zA-Z][\w-]*)/g, (_, pre: string, tag: string) => `${pre}[#${tag}](<${TAG_PREFIX}${tag}>)`);
    })
    .join('');

/** Hide the leading "# Title" line when it simply repeats the note title. */
const stripLeadingTitle = (md: string, label: string) => {
  const match = md.match(/^\s*#\s+(.+)\n?/);
  if (match && match[1].trim().toLowerCase() === label.trim().toLowerCase()) return md.slice(match[0].length);
  return md;
};

const useElementWidth = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
};

export const VaultNoteEditor: React.FC = () => {
  const {
    selectedNode,
    updateNodeContent,
    nodes,
    edges,
    openNote,
    createNote,
    sendMessageToAI,
    isChatLoading,
    openQuickSwitcher,
    openCreateNoteModal,
  } = useWorkspace();

  const [content, setContent] = useState('');
  const [mode, setModeState] = useState<EditorMode>(readMode);
  const [saveState, setSaveState] = useState<'saved' | 'saving'>('saved');
  const [rootRef, rootWidth] = useElementWidth<HTMLDivElement>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const saveTimer = useRef<number | undefined>(undefined);

  const canSplit = rootWidth === 0 || rootWidth >= SPLIT_MIN_WIDTH;
  const effectiveMode: EditorMode = mode === 'split' && !canSplit ? 'preview' : mode;

  const setMode = (m: EditorMode) => {
    setModeState(m);
    try {
      localStorage.setItem(MODE_KEY, m);
    } catch {
      /* ignore */
    }
  };

  // Load content when switching notes; drop straight into editing for fresh notes
  useEffect(() => {
    if (!selectedNode) return;
    setContent(selectedNode.content || '');
    setSaveState('saved');
    const isFresh = stripLeadingTitle(selectedNode.content || '', selectedNode.label).trim() === '';
    if (isFresh) {
      setModeState((m) => (m === 'preview' ? 'edit' : m));
      window.setTimeout(() => {
        const ta = textareaRef.current;
        if (ta) {
          ta.focus();
          ta.setSelectionRange(ta.value.length, ta.value.length);
        }
      }, 30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode?.id]);

  // Keep in sync if the note changes from elsewhere (e.g. reset)
  useEffect(() => {
    if (selectedNode && selectedNode.content !== content && document.activeElement !== textareaRef.current) {
      setContent(selectedNode.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode?.content]);

  // Global ⌘E toggles between editing and reading
  useEffect(() => {
    const onToggle = () => {
      setModeState((m) => {
        const next: EditorMode = m === 'preview' ? (canSplit ? 'split' : 'edit') : 'preview';
        try {
          localStorage.setItem(MODE_KEY, next);
        } catch {
          /* ignore */
        }
        if (next !== 'preview') window.setTimeout(() => textareaRef.current?.focus(), 30);
        return next;
      });
    };
    window.addEventListener(TOGGLE_EDIT_EVENT, onToggle);
    return () => window.removeEventListener(TOGGLE_EDIT_EVENT, onToggle);
  }, [canSplit]);

  useEffect(() => () => window.clearTimeout(saveTimer.current), []);

  const { backlinkNodes, outgoingNodes } = useMemo(() => {
    if (!selectedNode) return { backlinkNodes: [], outgoingNodes: [] };
    const inIds = new Set(edges.filter((e) => e.target === selectedNode.id).map((e) => e.source));
    const outIds = new Set(edges.filter((e) => e.source === selectedNode.id).map((e) => e.target));
    return {
      backlinkNodes: nodes.filter((n) => inIds.has(n.id)),
      outgoingNodes: nodes.filter((n) => outIds.has(n.id)),
    };
  }, [selectedNode, nodes, edges]);

  const renderedMarkdown = useMemo(
    () => (selectedNode ? preprocessMarkdown(stripLeadingTitle(content, selectedNode.label)) : ''),
    [content, selectedNode]
  );

  const wordCount = useMemo(() => content.trim().split(/\s+/).filter(Boolean).length, [content]);

  if (!selectedNode) {
    return (
      <div ref={rootRef} className="h-full flex flex-col items-center justify-center p-8 text-center bg-black select-none">
        <FileText className="w-10 h-10 mb-3 stroke-1 text-[#4a4a4a]" />
        <h3 className="text-sm font-semibold text-white">No note open</h3>
        <p className="text-xs text-[#8a8a8a] mt-1 max-w-xs">
          Pick a note from the file list, click a node in the graph, or start something new.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={openQuickSwitcher}
            className="flex items-center gap-1.5 rounded-md border border-[#262626] bg-[#0f0f0f] px-3 py-1.5 text-xs text-white hover:bg-[#181818]"
          >
            <Search className="w-3.5 h-3.5" /> Search notes <kbd className="vault-kbd ml-1">{MOD} K</kbd>
          </button>
          <button
            onClick={openCreateNoteModal}
            className="flex items-center gap-1.5 rounded-md bg-[#9d4edd] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#8b3bd6]"
          >
            <Plus className="w-3.5 h-3.5" /> New note
          </button>
        </div>
      </div>
    );
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);
    updateNodeContent(selectedNode.id, newText);
    setSaveState('saving');
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => setSaveState('saved'), 600);
  };

  // Tab indents instead of leaving the editor
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      const ta = e.currentTarget;
      const { selectionStart: start, selectionEnd: end } = ta;
      const next = content.slice(0, start) + '  ' + content.slice(end);
      setContent(next);
      updateNodeContent(selectedNode.id, next);
      window.requestAnimationFrame(() => ta.setSelectionRange(start + 2, start + 2));
    }
  };

  const handleAskAIToExpand = () => {
    sendMessageToAI(
      `Explore and expand on [[${selectedNode.label}]]. What new concepts, sub-theories, or cross-disciplinary connections should be linked in the knowledge vault?`
    );
  };

  const markdownComponents: Components = {
    a: ({ href, children }) => {
      if (href?.startsWith(WIKILINK_PREFIX)) {
        const target = decodeURIComponent(href.slice(WIKILINK_PREFIX.length));
        const match = findNodeByTitle(nodes, target);
        return (
          <button
            type="button"
            onClick={() => (match ? openNote(match.id) : createNote(target, selectedNode.folder))}
            className={`internal-link ${match ? '' : 'is-unresolved'}`}
            title={match ? `Open “${match.label}”` : `“${target}” doesn't exist yet. Click to create it`}
          >
            {children}
          </button>
        );
      }
      if (href?.startsWith(TAG_PREFIX)) {
        return <span className="vault-tag">{children}</span>;
      }
      return (
        <a href={href} target="_blank" rel="noreferrer" className="text-[#b57aed] underline underline-offset-2 hover:text-white">
          {children}
        </a>
      );
    },
    p: ({ children }) => <p className="mb-3">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 marker:text-[#6b6b6b]">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 marker:text-[#6b6b6b]">{children}</ol>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#9d4edd]/60 pl-3 my-3 text-[#b0b0b0]">{children}</blockquote>
    ),
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-6 mb-2">{children}</h1>,
    h2: ({ children }) => (
      <h2 className="text-base font-semibold text-white mt-6 mb-2 pb-1 border-b border-[#1c1c1c]">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="text-sm font-semibold text-white mt-4 mb-1">{children}</h3>,
    hr: () => <hr className="my-6 border-[#1c1c1c]" />,
    code: ({ className, children }) => {
      const isBlock = /language-/.test(className || '') || String(children).includes('\n');
      return isBlock ? (
        <pre className="bg-[#0a0a0a] text-white p-3 rounded-lg border border-[#1c1c1c] font-mono text-xs overflow-x-auto my-3">
          <code>{children}</code>
        </pre>
      ) : (
        <code className="bg-[#141414] text-[#7df9ff] px-1.5 py-0.5 rounded font-mono text-[0.85em] border border-[#1e1e1e]">
          {children}
        </code>
      );
    },
    pre: ({ children }) => <>{children}</>,
  };

  const modeButtons: { id: EditorMode; label: string; icon: typeof Edit3; disabled?: boolean }[] = [
    { id: 'edit', label: 'Edit', icon: Edit3 },
    { id: 'split', label: 'Side by side', icon: Columns, disabled: !canSplit },
    { id: 'preview', label: 'Read', icon: Eye },
  ];

  const narrow = rootWidth > 0 && rootWidth < 560;
  // Pane width available to the reading column decides whether link lists sit side by side
  const readingWidth = effectiveMode === 'split' ? rootWidth / 2 : rootWidth;
  const stackLinks = readingWidth > 0 && readingWidth < 620;
  const linkCount = backlinkNodes.length + outgoingNodes.length;

  const LinkList: React.FC<{ title: string; items: typeof nodes; icon: typeof ArrowRight; empty: string }> = ({
    title,
    items,
    icon: Icon,
    empty,
  }) => (
    <div className="bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg p-3 space-y-2 min-w-0">
      <div className="text-[11px] font-medium text-[#a3a3a3] flex items-center justify-between">
        <span>{title}</span>
        <span className="tabular-nums text-[#7c7c7c]">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <div className="text-[11px] text-[#7c7c7c]">{empty}</div>
      ) : (
        <div className="space-y-1">
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => openNote(n.id)}
              className="w-full text-left px-2 py-1.5 rounded-md bg-[#121212] hover:bg-[#1a1a1a] text-white text-xs flex items-center gap-2 transition-colors group"
              title={n.label}
            >
              <Icon className="w-3 h-3 text-[#6b6b6b] group-hover:text-[#b57aed] flex-shrink-0" />
              <span className="truncate">{n.label}</span>
              <span className="ml-auto text-[10px] text-[#6b6b6b] truncate max-w-[40%]">{n.folder}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div ref={rootRef} className="h-full flex flex-col bg-black text-white select-text overflow-hidden">
      {/* Header */}
      <div className="h-10 bg-black border-b border-[#1c1c1c] px-3 sm:px-4 flex items-center justify-between gap-3 flex-shrink-0 select-none text-xs">
        <div className="flex items-center gap-1.5 text-[#8a8a8a] min-w-0">
          <Folder className="w-3.5 h-3.5 text-[#9d4edd] flex-shrink-0" />
          {!narrow && (
            <>
              <span className="truncate max-w-[140px]">{selectedNode.folder || 'Vault'}</span>
              <span className="text-[#404040]">/</span>
            </>
          )}
          <span className="font-semibold text-white truncate">{selectedNode.label}</span>
          <span
            className={`ml-2 hidden sm:flex items-center gap-1 text-[10px] whitespace-nowrap transition-colors ${
              saveState === 'saved' ? 'text-[#6b6b6b]' : 'text-[#a3a3a3]'
            }`}
            aria-live="polite"
          >
            {saveState === 'saved' ? (
              <>
                <Check className="w-3 h-3" /> Saved
              </>
            ) : (
              'Saving…'
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleAskAIToExpand}
            disabled={isChatLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md whitespace-nowrap bg-[#141414] hover:bg-[#1c1c1c] border border-[#9d4edd]/40 text-[#c9a4f2] hover:text-white disabled:opacity-50 transition font-medium text-xs"
            title="Ask the AI to expand this note and propose new connections"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {!narrow && <span>Expand with AI</span>}
          </button>

          <div
            className="flex items-center bg-[#0a0a0a] border border-[#1e1e1e] rounded-md p-0.5"
            role="radiogroup"
            aria-label="Editor mode"
          >
            {modeButtons.map(({ id, label, icon: Icon, disabled }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                disabled={disabled}
                role="radio"
                aria-checked={effectiveMode === id}
                className={`p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                  effectiveMode === id ? 'bg-[#1e1e1e] text-white' : 'text-[#8a8a8a] hover:text-white'
                }`}
                title={disabled ? `${label} (needs a wider window)` : `${label} (${MOD} E toggles)`}
                aria-label={label}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {(effectiveMode === 'edit' || effectiveMode === 'split') && (
          <div
            className={`h-full flex flex-col bg-black ${
              effectiveMode === 'split' ? 'w-1/2 border-r border-[#1c1c1c]' : 'w-full'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleEditorKeyDown}
              placeholder={'Write in Markdown.\n\nLink notes with [[Note Title]]: links appear in the graph instantly.'}
              className={`w-full h-full bg-black text-[#e6e6e6] font-mono text-[13px] leading-relaxed outline-none resize-none selection:bg-[#9d4edd]/30 placeholder-[#5a5a5a] ${
                effectiveMode === 'edit' ? 'px-6 sm:px-10 py-8 max-w-3xl mx-auto' : 'p-6'
              }`}
              spellCheck={false}
              aria-label={`Edit ${selectedNode.label}`}
            />
            <div className="flex items-center justify-between px-4 py-1.5 border-t border-[#141414] text-[10px] text-[#6b6b6b] select-none">
              <span>
                Type <code className="text-[#b57aed]">[[</code> to link a note · <code className="text-[#b57aed]">#</code> for tags
              </span>
              <span className="tabular-nums">{wordCount} words</span>
            </div>
          </div>
        )}

        {(effectiveMode === 'preview' || effectiveMode === 'split') && (
          <div
            className={`h-full overflow-y-auto px-6 sm:px-10 py-8 bg-black ${effectiveMode === 'split' ? 'w-1/2' : 'w-full'}`}
          >
            <article className="max-w-2xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">{selectedNode.label}</h1>
              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {selectedNode.tags.map((tag) => (
                    <span key={tag} className="vault-tag text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="border-b border-[#1c1c1c] mb-5" />

              <div className="text-[14px] text-[#d9d9d9] leading-[1.7]">
                {renderedMarkdown.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {renderedMarkdown}
                  </ReactMarkdown>
                ) : (
                  <button
                    onClick={() => setMode(canSplit ? 'split' : 'edit')}
                    className="text-[#7c7c7c] italic hover:text-white"
                  >
                    This note is empty. Click to start writing.
                  </button>
                )}
              </div>

              {/* Linked references */}
              <section className="mt-12 pt-6 border-t border-[#1c1c1c] space-y-3 select-none" aria-label="Linked notes">
                <h4 className="text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#9d4edd]" />
                  Linked notes ({linkCount})
                </h4>
                <div className={`grid gap-3 ${stackLinks ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  <LinkList title="Backlinks" items={backlinkNodes} icon={ArrowLeft} empty="No notes link here yet." />
                  <LinkList
                    title="Outgoing links"
                    items={outgoingNodes}
                    icon={ArrowRight}
                    empty="Add [[Note Title]] to link out."
                  />
                </div>
              </section>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};
