import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Hash,
  Trash2,
  Check,
  X,
} from 'lucide-react';

export const VaultFileTree: React.FC = () => {
  const {
    nodes,
    selectedNodeId,
    selectNode,
    setActiveView,
    createNote,
    openDeleteNoteModal,
    openCreateNoteModal,
    isSidebarOpen,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [isInlineCreating, setIsInlineCreating] = useState(false);
  const [inlineTitle, setInlineTitle] = useState('');

  if (!isSidebarOpen) return null;

  const handleInlineCreate = () => {
    if (inlineTitle.trim()) {
      createNote(inlineTitle.trim());
      setInlineTitle('');
      setIsInlineCreating(false);
    }
  };

  // Group nodes by folder
  const groupedNodes: Record<string, typeof nodes> = {};
  nodes.forEach((node) => {
    const folder = node.folder || 'General Notes';
    if (!groupedNodes[folder]) groupedNodes[folder] = [];
    groupedNodes[folder].push(node);
  });

  const toggleFolder = (folderName: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const filteredNodes = searchQuery.trim()
    ? nodes.filter(
        (n) =>
          n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.folder.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="w-56 sm:w-64 bg-black border-r border-[#1c1c1c] flex flex-col h-full flex-shrink-0 select-none text-xs">
      {/* Sidebar Header & Search */}
      <div className="p-2.5 border-b border-[#1c1c1c] space-y-2">
        <div className="flex items-center justify-between text-[#949494] px-1">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-white">
            Files & Folders
          </span>
          <button
            onClick={() => setIsInlineCreating(true)}
            className="p-1 hover:text-white hover:bg-[#181818] rounded transition text-[#949494]"
            title="New note"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-[#1e1e1e] rounded px-2 py-1 text-xs">
          <Search className="w-3.5 h-3.5 text-[#949494]" />
          <input
            type="text"
            placeholder="Filter files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white placeholder-[#606060] outline-none w-full text-xs"
          />
        </div>
      </div>

      {/* File List Scroll Area */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {/* In-system Inline New Note Input Field */}
        {isInlineCreating && (
          <div className="p-1.5 bg-[#121212] border border-[#9d4edd] rounded-md mb-1.5 flex items-center gap-1.5 animate-in fade-in duration-100">
            <FileText className="w-3.5 h-3.5 text-[#9d4edd] flex-shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Note title (Enter to save)..."
              value={inlineTitle}
              onChange={(e) => setInlineTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleInlineCreate();
                if (e.key === 'Escape') setIsInlineCreating(false);
              }}
              className="w-full bg-transparent text-white text-xs outline-none"
            />
            <button
              onClick={handleInlineCreate}
              className="p-0.5 text-[#00ff88] hover:text-white rounded"
              title="Save (Enter)"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsInlineCreating(false)}
              className="p-0.5 text-[#949494] hover:text-white rounded"
              title="Cancel (Esc)"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        {filteredNodes ? (
          // Search results view
          <div className="space-y-0.5">
            <div className="text-[10px] text-[#949494] px-2 py-1">
              Found {filteredNodes.length} notes
            </div>
            {filteredNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => {
                  selectNode(node.id);
                  setActiveView('note');
                }}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition ${
                  selectedNodeId === node.id
                    ? 'bg-[#181818] text-white font-medium shadow-sm'
                    : 'text-[#949494] hover:text-white hover:bg-[#0f0f0f]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#949494] flex-shrink-0" />
                <span className="truncate">{node.label}</span>
              </button>
            ))}
          </div>
        ) : (
          // Hierarchical folder view
          Object.entries(groupedNodes).map(([folderName, folderNodes]) => {
            const isCollapsed = collapsedFolders[folderName];
            return (
              <div key={folderName} className="mb-1">
                {/* Folder Header */}
                <button
                  onClick={() => toggleFolder(folderName)}
                  className="w-full flex items-center justify-between px-1.5 py-1 rounded text-[#949494] hover:text-white hover:bg-[#121212] transition font-medium group text-[11px]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {isCollapsed ? (
                      <ChevronRight className="w-3 h-3 text-[#606060]" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-[#606060]" />
                    )}
                    {isCollapsed ? (
                      <Folder className="w-3.5 h-3.5 text-[#9d4edd]" />
                    ) : (
                      <FolderOpen className="w-3.5 h-3.5 text-[#9d4edd]" />
                    )}
                    <span className="truncate">{folderName}</span>
                  </div>
                  <span className="text-[10px] text-[#606060] group-hover:text-[#949494] font-mono">
                    {folderNodes.length}
                  </span>
                </button>

                {/* Folder Notes */}
                {!isCollapsed && (
                  <div className="ml-3 pl-2 border-l border-[#1c1c1c] space-y-0.5 mt-0.5">
                    {folderNodes.map((node) => {
                      const isSelected = selectedNodeId === node.id;
                      return (
                        <div
                          key={node.id}
                          className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition ${
                            isSelected
                              ? 'bg-[#181818] text-white font-medium border-l-2 border-[#9d4edd]'
                              : 'text-[#949494] hover:text-white hover:bg-[#0f0f0f]'
                          }`}
                          onClick={() => {
                            selectNode(node.id);
                            setActiveView('note');
                          }}
                        >
                          <div className="flex items-center gap-1.5 truncate flex-1">
                            <FileText
                              className={`w-3.5 h-3.5 flex-shrink-0 ${
                                isSelected ? 'text-[#9d4edd]' : 'text-[#606060]'
                              }`}
                            />
                            <span className="truncate">{node.label}</span>
                          </div>

                          {/* Quick delete note */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteNoteModal(node.id, node.label);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-[#606060] hover:text-[#ff2a85] transition"
                            title="Delete note"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Vault Footer Info */}
      <div className="p-2 border-t border-[#1c1c1c] text-[10px] text-[#606060] flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Hash className="w-3 h-3 text-[#9d4edd]" />
          <span>{nodes.length} total notes</span>
        </div>
        <button
          onClick={() => setIsInlineCreating(true)}
          className="text-[#949494] hover:text-white transition"
        >
          + Note
        </button>
      </div>
    </div>
  );
};
