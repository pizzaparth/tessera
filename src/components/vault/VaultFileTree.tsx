import React, { useMemo, useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Folder, FolderOpen, FileText, ChevronRight, Plus, Search, Trash2, X } from 'lucide-react';

/** Wrap the matched part of `text` in a highlight. */
const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const q = query.trim().toLowerCase();
  const idx = q ? text.toLowerCase().indexOf(q) : -1;
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#9d4edd]/30 text-white rounded-sm">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
};

export const VaultFileTree: React.FC = () => {
  const { nodes, edges, selectedNodeId, openNote, createNote, openDeleteNoteModal, isSidebarOpen } = useWorkspace();

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
    const isSelected = selectedNodeId === node.id;
    const isOrphan = !linkCounts[node.id];
    return (
      <div
        key={node.id}
        className={`group relative flex items-center rounded-md transition-colors ${
          isSelected ? 'bg-[#1a1a1a] text-white' : 'text-[#a3a3a3] hover:text-white hover:bg-[#111111]'
        }`}
      >
        {isSelected && <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-[#9d4edd]" />}
        <button
          onClick={() => openNote(node.id)}
          className="flex-1 min-w-0 flex items-center gap-1.5 py-1 pr-1 pl-2 text-left"
          aria-current={isSelected ? 'true' : undefined}
          title={node.label}
        >
          <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-[#b57aed]' : 'text-[#6b6b6b]'}`} />
          <span className={`truncate ${isSelected ? 'font-medium' : ''}`}>
            <Highlight text={node.label} query={searchQuery} />
          </span>
          {isOrphan && (
            <span className="ml-auto text-[9px] text-[#7c7c7c] group-hover:hidden" title="No links to other notes">
              unlinked
            </span>
          )}
        </button>
        <button
          onClick={() => openDeleteNoteModal(node.id, node.label)}
          className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 p-1 mr-0.5 rounded text-[#7c7c7c] hover:text-[#ff5c9d] hover:bg-[#1f1f1f] transition"
          title={`Delete “${node.label}”`}
          aria-label={`Delete ${node.label}`}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  return (
    <aside
      className="w-60 bg-black border-r border-[#1c1c1c] flex flex-col h-full flex-shrink-0 select-none text-xs absolute left-11 inset-y-0 z-30 shadow-2xl md:static md:shadow-none vault-fade-in"
      aria-label="Files"
    >
      {/* Header & search */}
      <div className="p-2.5 border-b border-[#1c1c1c] space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-white">Files</span>
          <button
            onClick={() => setIsInlineCreating(true)}
            className="p-1 hover:text-white hover:bg-[#181818] rounded transition text-[#949494]"
            title="New note in “Notes”"
            aria-label="New note"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-[#1e1e1e] focus-within:border-[#9d4edd]/70 rounded-md px-2 py-1 transition-colors">
          <Search className="w-3.5 h-3.5 text-[#7c7c7c] flex-shrink-0" />
          <input
            type="text"
            placeholder="Filter notes…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearchQuery('');
              if (e.key === 'Enter' && filteredNodes?.length) openNote(filteredNodes[0].id);
            }}
            className="bg-transparent text-white placeholder-[#6b6b6b] outline-none w-full text-xs"
            aria-label="Filter notes"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-0.5 rounded text-[#7c7c7c] hover:text-white"
              aria-label="Clear filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {isInlineCreating && (
          <div className="p-1.5 bg-[#121212] border border-[#9d4edd]/70 rounded-md mb-1.5 vault-fade-in">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#b57aed] flex-shrink-0" />
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
                className="w-full bg-transparent text-white text-xs outline-none"
              />
            </div>
            <div className="mt-1 pl-5 text-[10px] text-[#7c7c7c]">Enter to create · Esc to cancel</div>
          </div>
        )}

        {filteredNodes ? (
          <div className="space-y-0.5">
            <div className="text-[10px] text-[#7c7c7c] px-2 py-1">
              {filteredNodes.length} {filteredNodes.length === 1 ? 'match' : 'matches'}
            </div>
            {filteredNodes.map((node) => renderNoteRow(node))}
            {!nodes.some((n) => n.label.toLowerCase() === q) && (
              <button
                onClick={() => {
                  createNote(searchQuery.trim());
                  setSearchQuery('');
                }}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 mt-1 rounded-md text-left text-[#b57aed] hover:bg-[#141414] transition"
              >
                <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  Create “<span className="text-white">{searchQuery.trim()}</span>”
                </span>
              </button>
            )}
          </div>
        ) : nodes.length === 0 ? (
          <div className="px-3 py-8 text-center text-[#7c7c7c]">
            <p>Your vault is empty.</p>
            <button onClick={() => setIsInlineCreating(true)} className="mt-2 text-[#b57aed] hover:text-white">
              Create your first note
            </button>
          </div>
        ) : (
          Object.entries(groupedNodes).map(([folderName, folderNodes]) => {
            const isCollapsed = collapsedFolders[folderName];
            return (
              <div key={folderName} className="mb-1">
                <button
                  onClick={() => toggleFolder(folderName)}
                  className="w-full flex items-center justify-between px-1.5 py-1 rounded-md text-[#a3a3a3] hover:text-white hover:bg-[#111111] transition font-medium group text-[11px]"
                  aria-expanded={!isCollapsed}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ChevronRight
                      className={`w-3 h-3 text-[#6b6b6b] transition-transform duration-150 ${isCollapsed ? '' : 'rotate-90'}`}
                    />
                    {isCollapsed ? (
                      <Folder className="w-3.5 h-3.5 text-[#9d4edd]" />
                    ) : (
                      <FolderOpen className="w-3.5 h-3.5 text-[#9d4edd]" />
                    )}
                    <span className="truncate">{folderName}</span>
                  </div>
                  <span className="text-[10px] text-[#6b6b6b] group-hover:text-[#949494] tabular-nums">
                    {folderNodes.length}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="ml-3 pl-1.5 border-l border-[#1c1c1c] space-y-px mt-0.5">
                    {folderNodes.map((node) => renderNoteRow(node))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="px-3 py-2 border-t border-[#1c1c1c] text-[10px] text-[#7c7c7c] flex items-center justify-between">
        <span>
          {nodes.length} notes · {Object.keys(groupedNodes).length} folders
        </span>
        <button onClick={() => setIsInlineCreating(true)} className="text-[#949494] hover:text-white transition">
          + New note
        </button>
      </div>
    </aside>
  );
};
