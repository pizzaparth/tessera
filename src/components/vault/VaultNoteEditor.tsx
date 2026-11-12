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
  Hash,
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
      <div ref={rootRef} className="h-full flex flex-col items-center justify-center p-8 text-center bg-white select-none">
        <FileText className="w-9 h-9 mb-4 stroke-[1.5] text-black/25" />
        <h3 className="atlas-display text-[22px] text-black">No note open</h3>
        <p className="text-[15px] text-black/55 mt-1.5 max-w-xs leading-[1.45]">
          Pick a note from the sidebar, click a node in the graph, or start something new.
        </p>
        <div className="mt-6 flex gap-2">
          <button onClick={openQuickSwitcher} className="vault-pill-ghost">
            <Search className="w-4 h-4" /> Search <kbd className="vault-kbd ml-1">{MOD} K</kbd>
          </button>
          <button onClick={openCreateNoteModal} className="atlas-pill atlas-pill-sm">
            <Plus className="w-4 h-4" /> New note
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
        <a href={href} target="_blank" rel="noreferrer" className="text-[#6d55bd] font-medium underline underline-offset-2">
          {children}
        </a>
      );
    },
    p: ({ children }) => <p className="mb-4">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1.5 marker:text-black/30">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1.5 marker:text-black/40">{children}</ol>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#6d55bd]/50 pl-4 my-4 text-black/60">{children}</blockquote>
    ),
    strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
    h1: ({ children }) => <h1 className="atlas-display text-[24px] text-black mt-8 mb-3">{children}</h1>,
    h2: ({ children }) => <h2 className="atlas-display text-[20px] text-black mt-8 mb-2.5">{children}</h2>,
    h3: ({ children }) => <h3 className="text-[16px] font-semibold text-black mt-6 mb-2">{children}</h3>,
    hr: () => <hr className="my-8 border-black/5" />,
    code: ({ className, children }) => {
      const isBlock = /language-/.test(className || '') || String(children).includes('\n');
      return isBlock ? (
        <pre className="bg-[#f7f5ff] text-black/85 p-4 rounded-xl ring-1 ring-black/5 font-mono text-[13px] overflow-x-auto my-4">
          <code>{children}</code>
        </pre>
      ) : (
        <code className="bg-black/5 text-black/80 px-1.5 py-0.5 rounded-md font-mono text-[0.85em]">{children}</code>
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

  const linkList = (title: string, items: typeof nodes, Icon: typeof ArrowRight, empty: string) => (
    <div className="vault-sidebar rounded-2xl ring-1 ring-black/5 p-3 min-w-0">
      <div className="px-1.5 mb-1.5 text-[12px] text-black/45 flex items-center justify-between">
        <span>{title}</span>
        <span className="tabular-nums">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <div className="px-1.5 pb-1 text-[13px] text-black/45">{empty}</div>
      ) : (
        <div className="space-y-0.5">
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => openNote(n.id)}
              className="w-full text-left px-2 py-1.5 rounded-md hover:bg-white hover:shadow-[0_1px_2px_rgba(15,10,20,0.08)] text-[14px] text-black/75 hover:text-black flex items-center gap-2 transition group"
              title={n.label}
            >
              <Icon className="w-3.5 h-3.5 text-black/35 group-hover:text-[#6d55bd] flex-shrink-0" />
              <span className="truncate">{n.label}</span>
              <span className="ml-auto text-[12px] text-black/35 truncate max-w-[45%]">{n.folder}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div ref={rootRef} className="h-full flex flex-col bg-white text-black select-text overflow-hidden">
      {/* Header: "# Note" like the landing preview */}
      <div className="h-12 border-b border-black/5 px-4 sm:px-5 flex items-center justify-between gap-3 flex-shrink-0 select-none">
        <div className="flex items-center gap-1.5 min-w-0">
          <Hash className="w-4 h-4 text-black/45 flex-shrink-0" />
          <span className="font-semibold text-[16px] tracking-[-0.01em] truncate">{selectedNode.label}</span>
          {!narrow && (
            <span className="ml-1.5 text-[13px] text-black/40 truncate hidden md:inline">in {selectedNode.folder || 'Vault'}</span>
          )}
          <span
            className="ml-2 hidden sm:flex items-center gap-1 text-[12px] whitespace-nowrap text-black/35"
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
            className="vault-pill-ghost !py-1 !px-3 !text-[13px]"
            title="Ask Vault AI to expand this note and propose new connections"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6d55bd]" />
            {!narrow && <span>Expand with AI</span>}
          </button>

          <div className="flex items-center rounded-full p-0.5 bg-black/[0.04]" role="radiogroup" aria-label="Editor mode">
            {modeButtons.map(({ id, label, icon: Icon, disabled }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                disabled={disabled}
                role="radio"
                aria-checked={effectiveMode === id}
                className={`p-1.5 rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed ${
                  effectiveMode === id
                    ? 'bg-white text-black shadow-[0_1px_3px_rgba(15,10,20,0.15)]'
                    : 'text-black/45 hover:text-black'
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
            className={`h-full flex flex-col ${
              effectiveMode === 'split' ? 'w-1/2 border-r border-black/5 bg-[#fcfbff]' : 'w-full bg-white'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleEditorKeyDown}
              placeholder={'Write in Markdown.\n\nLink notes with [[Note Title]]: links appear in the graph instantly.'}
              className={`w-full h-full bg-transparent text-black/80 font-mono text-[13.5px] leading-[1.75] outline-none resize-none selection:bg-[#6d55bd]/20 placeholder-black/30 ${
                effectiveMode === 'edit' ? 'px-6 sm:px-12 py-10 max-w-3xl mx-auto' : 'px-6 py-8'
              }`}
              spellCheck={false}
              aria-label={`Edit ${selectedNode.label}`}
            />
            <div className="flex items-center justify-between px-5 py-2 border-t border-black/5 text-[12px] text-black/40 select-none">
              <span>
                <code className="text-[#6d55bd] font-medium">[[</code> links a note ·{' '}
                <code className="text-[#6d55bd] font-medium">#</code> adds a tag
              </span>
              <span className="tabular-nums">{wordCount} words</span>
            </div>
          </div>
        )}

        {(effectiveMode === 'preview' || effectiveMode === 'split') && (
          <div className={`h-full overflow-y-auto px-6 sm:px-12 py-10 bg-white ${effectiveMode === 'split' ? 'w-1/2' : 'w-full'}`}>
            <article className="max-w-[680px] mx-auto">
              <div className="text-[13px] text-black/45 mb-2">{selectedNode.folder}</div>
              <h1 className="atlas-display text-[34px] sm:text-[40px] leading-[1.08] text-black">{selectedNode.label}</h1>
              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {selectedNode.tags.map((tag) => (
                    <span key={tag} className="vault-tag !text-[12px]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 text-[16px] text-black/80 leading-[1.65]">
                {renderedMarkdown.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {renderedMarkdown}
                  </ReactMarkdown>
                ) : (
                  <button
                    onClick={() => setMode(canSplit ? 'split' : 'edit')}
                    className="text-black/40 hover:text-black"
                  >
                    This note is empty. Click to start writing.
                  </button>
                )}
              </div>

              {/* Linked notes */}
              <section className="mt-14 pt-8 border-t border-black/5 select-none" aria-label="Linked notes">
                <h4 className="text-[16px] text-black/55 mb-4">
                  Linked notes <span className="text-black/35 tabular-nums">{linkCount}</span>
                </h4>
                <div className={`grid gap-3 ${stackLinks ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {linkList('Backlinks', backlinkNodes, ArrowLeft, 'No notes link here yet.')}
                  {linkList('Outgoing links', outgoingNodes, ArrowRight, 'Add [[Note Title]] to link out.')}
                </div>
              </section>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};
