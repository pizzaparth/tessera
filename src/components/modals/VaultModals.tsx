import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AIProvider } from '../../types';
import {
  X,
  FileText,
  Trash2,
  RotateCcw,
  Settings,
  HelpCircle,
  Key,
  Folder,
  Check,
  Cpu,
  Sparkles,
} from 'lucide-react';

export const VaultModals: React.FC = () => {
  const {
    nodes,
    createNote,
    isCreateNoteModalOpen,
    closeCreateNoteModal,
    noteToDelete,
    closeDeleteNoteModal,
    confirmDeleteNote,
    isResetVaultModalOpen,
    closeResetVaultModal,
    resetVault,
    isSettingsModalOpen,
    closeSettingsModal,
    isHelpModalOpen,
    closeHelpModal,
    activeProvider,
    activeModel,
    setActiveModel,
    apiKeys,
    setProviderApiKey,
  } = useWorkspace();

  // Local state for Create Note Modal
  const [newTitle, setNewTitle] = useState('');
  const [newFolder, setNewFolder] = useState('Notes');

  // Local state for Settings Modal
  const [tempKeys, setTempKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isCreateNoteModalOpen) {
      setNewTitle('');
      setNewFolder('Notes');
    }
  }, [isCreateNoteModalOpen]);

  useEffect(() => {
    if (isSettingsModalOpen) {
      setTempKeys({ ...apiKeys });
    }
  }, [isSettingsModalOpen, apiKeys]);

  const uniqueFolders = Array.from(new Set(nodes.map((n) => n.folder || 'Notes')));

  const handleCreateNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createNote(newTitle.trim(), newFolder.trim() || 'Notes');
    closeCreateNoteModal();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(tempKeys).forEach(([prov, key]) => {
      setProviderApiKey(prov as AIProvider, key);
    });
    closeSettingsModal();
  };

  return (
    <>
      {/* 1. In-System Create Note Modal */}
      {isCreateNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#9d4edd]" />
                <h3 className="font-semibold text-sm text-white">Create New Note</h3>
              </div>
              <button
                onClick={closeCreateNoteModal}
                className="text-[#949494] hover:text-white p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNoteSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[#949494] font-medium">Note Title</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Cognitive Architecture, Transformer Attention..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#121212] text-white border border-[#222222] focus:border-[#9d4edd] rounded-lg px-3 py-2 text-xs outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#949494] font-medium">Vault Folder</label>
                <div className="flex gap-2">
                  <select
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    className="bg-[#121212] text-white border border-[#222222] rounded-lg px-3 py-2 text-xs outline-none cursor-pointer flex-1"
                  >
                    {uniqueFolders.map((f) => (
                      <option key={f} value={f} className="bg-black text-white">
                        {f}
                      </option>
                    ))}
                    <option value="New Folder..." className="bg-black text-white">
                      + Custom Folder...
                    </option>
                  </select>
                </div>
                {newFolder === 'New Folder...' && (
                  <input
                    type="text"
                    placeholder="Enter custom folder name..."
                    onChange={(e) => setNewFolder(e.target.value)}
                    className="w-full bg-[#121212] text-white border border-[#222222] rounded-lg px-3 py-1.5 text-xs outline-none mt-2"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={closeCreateNoteModal}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#949494] hover:text-white hover:bg-[#181818] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#9d4edd] hover:bg-[#8b3bd6] disabled:opacity-40 text-white transition shadow-sm"
                >
                  Create Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. In-System Delete Note Confirmation Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-2.5 text-[#ff2a85]">
              <div className="p-2 rounded-xl bg-[#ff2a85]/10 border border-[#ff2a85]/20">
                <Trash2 className="w-5 h-5 text-[#ff2a85]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Delete Note</h3>
                <p className="text-[11px] text-[#949494]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#d0d0d0] leading-relaxed">
              Are you sure you want to delete note{' '}
              <strong className="text-white font-mono">[[{noteToDelete.label}]]</strong>? All
              associated connections in the graph view will be unlinked.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1c1c1c]">
              <button
                type="button"
                onClick={closeDeleteNoteModal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#949494] hover:text-white hover:bg-[#181818] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteNote}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#ff2a85] hover:bg-[#e02475] text-white transition shadow-sm"
              >
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. In-System Reset Vault Confirmation Modal */}
      {isResetVaultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-2.5 text-[#ffb703]">
              <div className="p-2 rounded-xl bg-[#ffb703]/10 border border-[#ffb703]/20">
                <RotateCcw className="w-5 h-5 text-[#ffb703]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Reset Brain Vault</h3>
                <p className="text-[11px] text-[#949494]">Restore default knowledge graph</p>
              </div>
            </div>

            <p className="text-xs text-[#d0d0d0] leading-relaxed">
              Are you sure you want to reset the vault? This restores the default foundational
              notes, interlinked Wikilinks, and resets graph physics settings.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1c1c1c]">
              <button
                type="button"
                onClick={closeResetVaultModal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#949494] hover:text-white hover:bg-[#181818] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetVault();
                  closeResetVaultModal();
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#9d4edd] hover:bg-[#8b3bd6] text-white transition shadow-sm"
              >
                Reset Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. In-System Settings & API Key Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#9d4edd]" />
                <h3 className="font-semibold text-sm text-white">Vault Settings & API Keys</h3>
              </div>
              <button
                onClick={closeSettingsModal}
                className="text-[#949494] hover:text-white p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-3">
                <div className="text-[11px] font-semibold text-[#949494] uppercase tracking-wider">
                  Frontier AI Model Credentials
                </div>

                {/* Anthropic Key */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#d97757]" />
                      Anthropic API Key (Claude)
                    </span>
                    <span className="text-[10px] text-[#606060]">sk-ant-...</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter Anthropic API Key or leave empty for .env"
                    value={tempKeys['anthropic'] || ''}
                    onChange={(e) => setTempKeys({ ...tempKeys, anthropic: e.target.value })}
                    className="w-full bg-[#121212] text-white border border-[#222222] focus:border-[#9d4edd] rounded-lg px-3 py-1.5 text-xs outline-none font-mono"
                  />
                </div>

                {/* OpenAI Key */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-[#10a37f]" />
                      OpenAI API Key (GPT-4o / o1)
                    </span>
                    <span className="text-[10px] text-[#606060]">sk-...</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter OpenAI API Key or leave empty for .env"
                    value={tempKeys['openai'] || ''}
                    onChange={(e) => setTempKeys({ ...tempKeys, openai: e.target.value })}
                    className="w-full bg-[#121212] text-white border border-[#222222] focus:border-[#9d4edd] rounded-lg px-3 py-1.5 text-xs outline-none font-mono"
                  />
                </div>

                {/* Google Gemini Key */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#4285f4]" />
                      Google Gemini API Key
                    </span>
                    <span className="text-[10px] text-[#606060]">AIza...</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter Google Gemini Key or leave empty for .env"
                    value={tempKeys['gemini'] || ''}
                    onChange={(e) => setTempKeys({ ...tempKeys, gemini: e.target.value })}
                    className="w-full bg-[#121212] text-white border border-[#222222] focus:border-[#9d4edd] rounded-lg px-3 py-1.5 text-xs outline-none font-mono"
                  />
                </div>

                {/* DeepSeek Key */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-[#0066ff]" />
                      DeepSeek API Key (V3 / R1)
                    </span>
                    <span className="text-[10px] text-[#606060]">sk-...</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter DeepSeek Key or leave empty for .env"
                    value={tempKeys['deepseek'] || ''}
                    onChange={(e) => setTempKeys({ ...tempKeys, deepseek: e.target.value })}
                    className="w-full bg-[#121212] text-white border border-[#222222] focus:border-[#9d4edd] rounded-lg px-3 py-1.5 text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#121212] rounded-xl border border-[#1e1e1e] text-[11px] text-[#949494] space-y-1">
                <div className="text-white font-medium">In-System Credential Fallback</div>
                <p>
                  Keys entered here override your local <code className="text-[#9d4edd]">.env</code> file.
                  If no key is entered, the built-in intelligent semantic generator powers live graph expansions.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={closeSettingsModal}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#949494] hover:text-white hover:bg-[#181818] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#9d4edd] hover:bg-[#8b3bd6] text-white transition shadow-sm"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. In-System Help & Guide Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
          <div className="w-full max-w-lg bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6 shadow-2xl text-white space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#9d4edd]" />
                <h3 className="font-semibold text-sm text-white">Brain Vault • Guide & Shortcuts</h3>
              </div>
              <button
                onClick={closeHelpModal}
                className="text-[#949494] hover:text-white p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#d0d0d0]">
              <div className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">2D Canvas Graph View</h4>
                <ul className="list-disc pl-4 space-y-1 text-[#a0a0a0]">
                  <li>
                    <strong className="text-white">Mouse Wheel:</strong> Smooth cursor-centered zoom in / zoom out.
                  </li>
                  <li>
                    <strong className="text-white">Click & Drag Background:</strong> Pan across the infinite canvas.
                  </li>
                  <li>
                    <strong className="text-white">Click Any Node:</strong> Inspects note in reading view and illuminates its immediate 1-hop neighborhood.
                  </li>
                  <li>
                    <strong className="text-white">Drag Node:</strong> Repositions node with live Hooke’s Law physics relaxation.
                  </li>
                  <li>
                    <strong className="text-white">Gear Icon (Top Right):</strong> Adjust Forces (repulsion, gravity), Display (wire thickness, node size), Color Groups, and Filters.
                  </li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">Wikilinks & Note Connections</h4>
                <p className="text-[#a0a0a0] leading-relaxed">
                  Type <code className="text-[#9d4edd] bg-[#121212] px-1.5 py-0.5 rounded">[[Note Title]]</code> anywhere inside a note to create an instant bidirectional connection. In preview mode, wikilinks are clickable and immediately navigate across notes.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">Multi-Model AI Knowledge Expansion</h4>
                <p className="text-[#a0a0a0] leading-relaxed">
                  Chat with frontier models (Claude, GPT-4o, Gemini, DeepSeek). As you reason, the assistant analyzes the discourse and dynamically grows your graph by injecting new concepts and unlabeled connecting wires in real time.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#1c1c1c]">
              <button
                type="button"
                onClick={closeHelpModal}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#181818] hover:bg-[#222222] text-white transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
