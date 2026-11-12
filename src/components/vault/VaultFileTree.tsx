import React, { useMemo, useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { FileText, ChevronDown, Plus, Search, Trash2, X, Network, Sparkles, HelpCircle } from 'lucide-react';
import { VaultLogo } from './Avatars';
import { MOD } from './shortcuts';

/** Wrap the matched part of `text` in a highlight. */
const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const q = query.trim().toLowerCase();
  const idx = q ? text.toLowerCase().indexOf(q) : -1;
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#6d55bd]/15 text-black rounded-sm">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
};

const NavItem: React.FC<{
  icon: typeof Network;
  label: string;
  active?: boolean;
  shortcut?: string;
  /** Shows a small "on" dot instead of the selected-card style */
  indicator?: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, active, shortcut, indicator, onClick }) => (
  <button
    onClick={onClick}
    className={`group w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
      active ? 'bg-white shadow-[0_1px_2px_rgba(15,10,20,0.08)] font-semibold text-black' : 'text-black/70 hover:bg-white/60 hover:text-black'
    }`}
    aria-pressed={active}
  >
    <Icon className="w-4 h-4 flex-shrink-0" />
    <span className="truncate">{label}</span>
    {indicator && <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" title="Open" />}
    {shortcut && (
      <kbd className="vault-kbd ml-auto opacity-0 group-hover:opacity-100 transition-opacity">{shortcut}</kbd>
    )}
  </button>
);

export const VaultFileTree: React.FC<{ floating?: boolean }> = ({ floating = false }) => {
  const {
    nodes,
    edges,
    selectedNodeId,
    openNote,
    createNote,
    openDeleteNoteModal,
    isSidebarOpen,
    activeView,
    setActiveView,
    isAIOpen,
    toggleAI,
    openQuickSwitcher,
    openHelpModal,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [isInlineCreating, setIsInlineCreating] = useState(false);
  const [inlineTitle, setInlineTitle] = useState('');

  const linkCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    edges.forEach((e) => {
      counts[e.source] = (counts[e.source] || 0) + 1;
      counts[e.target] = (counts[e.target] || 0) + 1;
    });
    return counts;
  }, [edges]);

  const groupedNodes = useMemo(() => {
    const groups: Record<string, typeof nodes> = {};
    nodes.forEach((node) => {
      const folder = node.folder || 'Notes';
      (groups[folder] ||= []).push(node);
    });
    return groups;
  }, [nodes]);

  const q = searchQuery.trim().toLowerCase();
  const filteredNodes = q
    ? nodes.filter((n) => n.label.toLowerCase().includes(q) || n.folder.toLowerCase().includes(q))
    : null;

  if (!isSidebarOpen) return null;

  const handleInlineCreate = () => {
    if (inlineTitle.trim()) {
      createNote(inlineTitle.trim());
      setInlineTitle('');
      setIsInlineCreating(false);
    }
  };

  const toggleFolder = (folderName: string) =>
    setCollapsedFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));

  const renderNoteRow = (node: (typeof nodes)[number]) => {
    const isSelected = selectedNodeId === node.id && activeView !== 'graph';
    const isOrphan = !linkCounts[node.id];
    return (
      <div
        key={node.id}
        className={`group relative flex items-center rounded-md transition-colors ${
          isSelected
            ? 'bg-white shadow-[0_1px_2px_rgba(15,10,20,0.08)] text-black'
            : selectedNodeId === node.id
            ? 'bg-white/50 text-black'
            : 'text-black/65 hover:text-black hover:bg-white/60'
        }`}
      >
        <button
          onClick={() => openNote(node.id)}
          className="flex-1 min-w-0 flex items-center gap-2 py-1.5 pl-2 pr-1 text-left"
          aria-current={isSelected ? 'true' : undefined}
          title={node.label}
        >
          <FileText className="w-4 h-4 flex-shrink-0 opacity-60" />
          <span className={`truncate ${isSelected ? 'font-semibold' : ''}`}>
            <Highlight text={node.label} query={searchQuery} />
          </span>
          {isOrphan && (
            <span
              className="ml-auto w-1.5 h-1.5 rounded-full bg-black/20 flex-shrink-0 group-hover:hidden"
              title="Not linked to any other note"
            />
          )}
        </button>
        <button
          onClick={() => openDeleteNoteModal(node.id, node.label)}
          className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 p-1 mr-1 rounded text-black/40 hover:text-[#e21e86] hover:bg-black/5 transition"
          title={`Delete “${node.label}”`}
          aria-label={`Delete ${node.label}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <aside
      className={`vault-sidebar w-[240px] border-r border-black/5 flex flex-col h-full flex-shrink-0 select-none text-[14px] ${
        floating ? 'absolute left-0 inset-y-0 z-40 shadow-[24px_0_60px_-24px_rgba(20,10,50,0.35)] vault-slide-in-left' : ''
      }`}
      aria-label="Vault"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <span className="flex items-center gap-2 font-semibold text-[16px] tracking-[-0.01em] text-black">
          <VaultLogo className="w-4 h-4" /> Brain Vault
        </span>
        <div className="flex items-center gap-0.5 -mr-1.5">
          <button
            onClick={openQuickSwitcher}
            className="p-1.5 rounded-md text-black/45 hover:text-black hover:bg-white/70 transition-colors"
            title={`Search notes (${MOD} K)`}
            aria-label="Search notes"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsInlineCreating(true)}
            className="p-1.5 rounded-md text-black/45 hover:text-black hover:bg-white/70 transition-colors"
            title={`New note (${MOD} Shift N)`}
            aria-label="New note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary nav */}
      <div className="px-3 space-y-0.5 mb-3">
        <NavItem
          icon={Network}
          label="Graph view"
          shortcut={`${MOD} G`}
          active={activeView === 'graph'}
          onClick={() => setActiveView('graph')}
        />
        <NavItem icon={Sparkles} label="Vault AI" shortcut={`${MOD} J`} indicator={isAIOpen} onClick={toggleAI} />
      </div>

      {/* Filter */}
      <div className="px-3 mb-2">
        <div className="flex items-center gap-2 rounded-lg bg-white/70 ring-1 ring-black/5 focus-within:ring-[#6d55bd]/50 focus-within:bg-white px-2.5 py-1.5 transition">
          <Search className="w-3.5 h-3.5 text-black/40 flex-shrink-0" />
          <input
            type="text"
            placeholder="Filter notes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearchQuery('');
              if (e.key === 'Enter' && filteredNodes?.length) openNote(filteredNodes[0].id);
            }}
            className="bg-transparent text-black placeholder-black/40 outline-none w-full text-[13px]"
            aria-label="Filter notes"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-black/40 hover:text-black" aria-label="Clear filter">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {isInlineCreating && (
          <div className="mb-2 rounded-lg bg-white ring-1 ring-[#6d55bd]/40 shadow-[0_1px_2px_rgba(15,10,20,0.08)] p-2 vault-fade-in">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6d55bd] flex-shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Note title"
                value={inlineTitle}
                onChange={(e) => setInlineTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInlineCreate();
                  if (e.key === 'Escape') setIsInlineCreating(false);
                }}
                onBlur={() => !inlineTitle.trim() && setIsInlineCreating(false)}
                className="w-full bg-transparent text-black outline-none text-[14px] placeholder-black/35"
              />
            </div>
            <div className="mt-1 pl-6 text-[11px] text-black/40">Enter to create · Esc to cancel</div>
          </div>
        )}

        {filteredNodes ? (
          <div className="space-y-0.5">
            <div className="px-2 pt-1 pb-1 text-[12px] text-black/45">
              {filteredNodes.length} {filteredNodes.length === 1 ? 'match' : 'matches'}
            </div>
            {filteredNodes.map(renderNoteRow)}
            {!nodes.some((n) => n.label.toLowerCase() === q) && (
              <button
                onClick={() => {
                  createNote(searchQuery.trim());
                  setSearchQuery('');
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 mt-1 rounded-md text-left text-[#6d55bd] hover:bg-white/70 transition"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  Create “<span className="font-medium">{searchQuery.trim()}</span>”
                </span>
              </button>
            )}
          </div>
        ) : nodes.length === 0 ? (
          <div className="px-3 py-8 text-center text-black/50 text-[13px]">
            <p>Your vault is empty.</p>
            <button onClick={() => setIsInlineCreating(true)} className="mt-2 text-[#6d55bd] font-medium hover:underline">
              Create your first note
            </button>
          </div>
        ) : (
          Object.entries(groupedNodes).map(([folderName, folderNodes]) => {
            const isCollapsed = collapsedFolders[folderName];
            return (
              <div key={folderName} className="mb-3">
                <button
                  onClick={() => toggleFolder(folderName)}
                  className="w-full flex items-center gap-1 px-2 mb-1 text-[12px] text-black/45 hover:text-black/70 transition-colors"
                  aria-expanded={!isCollapsed}
                >
                  <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isCollapsed ? '-rotate-90' : ''}`} />
                  <span className="truncate">{folderName}</span>
                  <span className="ml-auto tabular-nums">{folderNodes.length}</span>
                </button>
                {!isCollapsed && <div className="space-y-0.5">{folderNodes.map(renderNoteRow)}</div>}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-black/5 flex items-center justify-between text-[13px]">
        <button
          onClick={openHelpModal}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-black/55 hover:text-black hover:bg-white/60 transition-colors"
        >
          <HelpCircle className="w-4 h-4" /> Shortcuts
        </button>
        <button
          onClick={() => setIsInlineCreating(true)}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-black/55 hover:text-black hover:bg-white/60 transition-colors"
        >
          <Plus className="w-4 h-4" /> New note
        </button>
      </div>
    </aside>
  );
};
