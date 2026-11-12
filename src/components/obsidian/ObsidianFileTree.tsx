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
} from 'lucide-react';

export const ObsidianFileTree: React.FC = () => {
  const {
    nodes,
    selectedNodeId,
    selectNode,
    setActiveView,
    createNote,
    isSidebarOpen,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});

  if (!isSidebarOpen) return null;

  // Group nodes by folder
  const groupedNodes: Record<string, typeof nodes> = {};
  nodes.forEach((node) => {
    const folder = node.folder || 'Notes';
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
    <div className="w-56 sm:w-64 bg-obsidian-sidebar border-r border-obsidian-border flex flex-col h-full flex-shrink-0 select-none text-xs">
      {/* Sidebar Header & Search */}
      <div className="p-2 border-b border-obsidian-border space-y-2">
        <div className="flex items-center justify-between text-obsidian-textMuted px-1">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-obsidian-text">
            Files
          </span>
          <button
            onClick={() => {
              const title = prompt('Enter title for new note:');
              if (title && title.trim()) createNote(title.trim());
            }}
            className="p-1 hover:text-obsidian-text hover:bg-obsidian-hover rounded transition"
            title="New note"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-1.5 bg-obsidian-surface border border-obsidian-border rounded px-2 py-1 text-xs">
          <Search className="w-3.5 h-3.5 text-obsidian-textMuted" />
          <input
            type="text"
            placeholder="Filter files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-obsidian-text placeholder-obsidian-textFaint outline-none w-full text-xs"
          />
        </div>
      </div>

      {/* File List Scroll Area */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {filteredNodes ? (
          // Search results view
          <div className="space-y-0.5">
            <div className="text-[10px] text-obsidian-textMuted px-2 py-1">
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
                    ? 'bg-obsidian-purple/20 text-obsidian-purple font-semibold'
                    : 'text-obsidian-text hover:bg-obsidian-hover'
                }`}
              >
                <FileText className="w-3.5 h-3.5 flex-shrink-0 text-obsidian-textMuted" />
                <span className="truncate">{node.label}.md</span>
              </button>
            ))}
          </div>
        ) : (
          // Grouped Folder Tree View
          Object.entries(groupedNodes).map(([folderName, folderNodes]) => {
            const isCollapsed = collapsedFolders[folderName];
            return (
              <div key={folderName} className="space-y-0.5">
                {/* Folder Row */}
                <button
                  onClick={() => toggleFolder(folderName)}
                  className="w-full flex items-center gap-1.5 px-1.5 py-1 text-obsidian-textMuted hover:text-obsidian-text hover:bg-obsidian-hover rounded transition group text-left"
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-obsidian-textFaint group-hover:text-obsidian-text" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-obsidian-textFaint group-hover:text-obsidian-text" />
                  )}
                  {isCollapsed ? (
                    <Folder className="w-3.5 h-3.5 text-obsidian-textMuted" />
                  ) : (
                    <FolderOpen className="w-3.5 h-3.5 text-obsidian-text" />
                  )}
                  <span className="font-medium truncate text-obsidian-text">{folderName}</span>
                  <span className="ml-auto text-[10px] text-obsidian-textFaint">
                    {folderNodes.length}
                  </span>
                </button>

                {/* Notes in Folder */}
                {!isCollapsed && (
                  <div className="pl-4 space-y-0.5">
                    {folderNodes.map((node) => {
                      const isSelected = selectedNodeId === node.id;
                      return (
                        <button
                          key={node.id}
                          onClick={() => {
                            selectNode(node.id);
                            setActiveView('note');
                          }}
                          className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition ${
                            isSelected
                              ? 'bg-obsidian-purple/20 text-obsidian-purple font-medium border-l-2 border-obsidian-purple'
                              : 'text-obsidian-text hover:bg-obsidian-hover'
                          }`}
                        >
                          <FileText className="w-3 h-3 flex-shrink-0 text-obsidian-textMuted" />
                          <span className="truncate">{node.label}.md</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Vault Total Count Footer */}
      <div className="p-2 border-t border-obsidian-border text-[11px] text-obsidian-textMuted flex items-center justify-between">
        <span>{nodes.length} notes</span>
        <span>Obsidian Vault</span>
      </div>
    </div>
  );
};
