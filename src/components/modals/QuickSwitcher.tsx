import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ModalShell } from './ModalShell';
import { FileText, Plus, Search, CornerDownLeft } from 'lucide-react';

const MAX_RESULTS = 8;

/** Score a note against the query: title prefix > title match > folder > body. */
const score = (label: string, folder: string, content: string, q: string) => {
  const l = label.toLowerCase();
  if (l.startsWith(q)) return 4;
  if (l.includes(q)) return 3;
  if (folder.toLowerCase().includes(q)) return 2;
  if (content.toLowerCase().includes(q)) return 1;
  return 0;
};

export const QuickSwitcher: React.FC = () => {
  const { nodes, selectedNodeId, openNote, closeQuickSwitcher, createNote } = useWorkspace();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) {
      // Recently updated first, then the rest
      return [...nodes]
        .sort((a, b) => (b.updatedAt || b.createdAt || '').localeCompare(a.updatedAt || a.createdAt || ''))
        .slice(0, MAX_RESULTS);
    }
    return nodes
      .map((n) => ({ n, s: score(n.label, n.folder, n.content, q) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || a.n.label.localeCompare(b.n.label))
      .slice(0, MAX_RESULTS)
      .map((r) => r.n);
  }, [nodes, q]);

  const exactMatch = nodes.some((n) => n.label.toLowerCase() === q);
  const canCreate = q.length > 0 && !exactMatch;
  const optionCount = results.length + (canCreate ? 1 : 0);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const choose = (index: number) => {
    if (index < results.length) {
      openNote(results[index].id);
    } else if (canCreate) {
      createNote(query.trim());
    }
    closeQuickSwitcher();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (optionCount ? (i + 1) % optionCount : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (optionCount ? (i - 1 + optionCount) % optionCount : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (optionCount) choose(active);
    }
  };

  const snippet = (content: string) => {
    if (!q) return null;
    const idx = content.toLowerCase().indexOf(q);
    if (idx < 0) return null;
    const start = Math.max(0, idx - 30);
    const text = content.slice(start, idx + q.length + 50).replace(/[#*\[\]\n]+/g, ' ');
    return (start > 0 ? '…' : '') + text.trim() + '…';
  };

  return (
    <ModalShell onClose={closeQuickSwitcher} widthClass="max-w-lg" align="top" labelledBy="quick-switcher-label">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#1e1e1e]">
        <Search className="w-4 h-4 text-[#8a8a8a] flex-shrink-0" />
        <label id="quick-switcher-label" className="sr-only">
          Search notes
        </label>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search notes or type a new title…"
          className="flex-1 bg-transparent text-sm text-white placeholder-[#6b6b6b] outline-none"
          role="combobox"
          aria-expanded="true"
          aria-controls="quick-switcher-list"
          aria-activedescendant={optionCount ? `qs-opt-${active}` : undefined}
        />
        <kbd className="vault-kbd">Esc</kbd>
      </div>

      <div ref={listRef} id="quick-switcher-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-1.5">
        {!q && <div className="px-2.5 pt-1 pb-1.5 text-[10px] uppercase tracking-wider text-[#7c7c7c]">Recent</div>}

        {results.map((n, i) => {
          const snip = score(n.label, n.folder, '', q) === 0 ? snippet(n.content) : null;
          return (
            <button
              key={n.id}
              id={`qs-opt-${i}`}
              data-index={i}
              role="option"
              aria-selected={active === i}
              onMouseMove={() => setActive(i)}
              onClick={() => choose(i)}
              className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                active === i ? 'bg-[#1a1a1a]' : ''
              }`}
            >
              <FileText
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${active === i ? 'text-[#b57aed]' : 'text-[#6b6b6b]'}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-white truncate">{n.label}</span>
                  {n.id === selectedNodeId && (
                    <span className="text-[10px] text-[#8a8a8a] border border-[#2a2a2a] rounded px-1">open</span>
                  )}
                </div>
                <div className="text-[11px] text-[#7c7c7c] truncate">{snip ?? n.folder}</div>
              </div>
              {active === i && <CornerDownLeft className="w-3.5 h-3.5 mt-1 text-[#7c7c7c] flex-shrink-0" />}
            </button>
          );
        })}

        {canCreate && (
          <button
            id={`qs-opt-${results.length}`}
            data-index={results.length}
            role="option"
            aria-selected={active === results.length}
            onMouseMove={() => setActive(results.length)}
            onClick={() => choose(results.length)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
              active === results.length ? 'bg-[#1a1a1a]' : ''
            }`}
          >
            <Plus className="w-4 h-4 text-[#b57aed] flex-shrink-0" />
            <span className="text-[13px] text-white truncate">
              Create note <span className="font-semibold">“{query.trim()}”</span>
            </span>
          </button>
        )}

        {!optionCount && <div className="px-3 py-6 text-center text-xs text-[#7c7c7c]">No notes yet</div>}
      </div>

      <div className="flex items-center gap-4 px-4 py-2 border-t border-[#1e1e1e] text-[10px] text-[#7c7c7c]">
        <span className="flex items-center gap-1">
          <kbd className="vault-kbd">↑</kbd>
          <kbd className="vault-kbd">↓</kbd> navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="vault-kbd">↵</kbd> open
        </span>
      </div>
    </ModalShell>
  );
};
