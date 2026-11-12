import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, FileText, Trash2, RotateCcw, HelpCircle } from 'lucide-react';
import { ModalShell } from './ModalShell';
import { SHORTCUTS } from '../vault/shortcuts';

const NEW_FOLDER = '__new_folder__';

const inputClass =
  'w-full bg-[#121212] text-white border border-[#262626] focus:border-[#9d4edd] rounded-lg px-3 py-2 text-xs outline-none transition-colors placeholder-[#5f5f5f]';
const secondaryBtn =
  'px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#a3a3a3] hover:text-white hover:bg-[#181818] transition-colors';
const primaryBtn =
  'px-4 py-1.5 rounded-lg text-xs font-medium bg-[#9d4edd] hover:bg-[#8b3bd6] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors';

const ModalHeader: React.FC<{ id: string; icon: React.ReactNode; title: string; subtitle?: string; onClose: () => void }> = ({
  id,
  icon,
  title,
  subtitle,
  onClose,
}) => (
  <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4 border-b border-[#1c1c1c]">
    <div className="flex items-center gap-2.5">
      {icon}
      <div>
        <h3 id={id} className="font-semibold text-sm text-white">
          {title}
        </h3>
        {subtitle && <p className="text-[11px] text-[#8a8a8a] mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <button
      data-modal-close
      onClick={onClose}
      className="text-[#8a8a8a] hover:text-white p-1 -m-1 rounded transition"
      aria-label="Close"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);


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
    isHelpModalOpen,
    closeHelpModal,
    selectedNode,
    edges,
  } = useWorkspace();

  // Create note
  const [newTitle, setNewTitle] = useState('');
  const [folderChoice, setFolderChoice] = useState('Notes');
  const [customFolder, setCustomFolder] = useState('');


  const uniqueFolders = Array.from(new Set(nodes.map((n) => n.folder || 'Notes')));

  useEffect(() => {
    if (isCreateNoteModalOpen) {
      setNewTitle('');
      setCustomFolder('');
      // Default to the folder of the note being viewed
      setFolderChoice(selectedNode?.folder || uniqueFolders[0] || 'Notes');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateNoteModalOpen]);

  const resolvedFolder = folderChoice === NEW_FOLDER ? customFolder.trim() : folderChoice;
  const titleTaken = nodes.some((n) => n.label.toLowerCase() === newTitle.trim().toLowerCase());
  const canCreate = !!newTitle.trim() && !!resolvedFolder;

  const handleCreateNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    createNote(newTitle.trim(), resolvedFolder);
    closeCreateNoteModal();
  };

  const deleteLinkCount = noteToDelete
    ? edges.filter((e) => e.source === noteToDelete.id || e.target === noteToDelete.id).length
    : 0;

  return (
    <>
      {/* Create note */}
      {isCreateNoteModalOpen && (
        <ModalShell onClose={closeCreateNoteModal} labelledBy="create-note-title">
          <ModalHeader
            id="create-note-title"
            icon={<FileText className="w-4 h-4 text-[#b57aed]" />}
            title="New note"
            onClose={closeCreateNoteModal}
          />
          <form onSubmit={handleCreateNoteSubmit} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="new-note-title" className="text-xs text-[#a3a3a3] font-medium">
                Title
              </label>
              <input
                id="new-note-title"
                type="text"
                autoFocus
                placeholder="e.g. Transformer Attention"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className={inputClass}
              />
              {titleTaken && (
                <p className="text-[11px] text-[#ffb703]">A note with this title exists. A copy will be created.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="new-note-folder" className="text-xs text-[#a3a3a3] font-medium">
                Folder
              </label>
              <select
                id="new-note-folder"
                value={folderChoice}
                onChange={(e) => setFolderChoice(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {uniqueFolders.map((f) => (
                  <option key={f} value={f} className="bg-black text-white">
                    {f}
                  </option>
                ))}
                {!uniqueFolders.includes('Notes') && (
                  <option value="Notes" className="bg-black text-white">
                    Notes
                  </option>
                )}
                <option value={NEW_FOLDER} className="bg-black text-white">
                  + New folder…
                </option>
              </select>
              {folderChoice === NEW_FOLDER && (
                <input
                  type="text"
                  autoFocus
                  placeholder="Folder name"
                  value={customFolder}
                  onChange={(e) => setCustomFolder(e.target.value)}
                  className={inputClass}
                  aria-label="New folder name"
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button type="button" onClick={closeCreateNoteModal} className={secondaryBtn}>
                Cancel
              </button>
              <button type="submit" disabled={!canCreate} className={primaryBtn}>
                Create note
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* Delete note */}
      {noteToDelete && (
        <ModalShell onClose={closeDeleteNoteModal} widthClass="max-w-sm" labelledBy="delete-note-title">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#ff2a85]/10 border border-[#ff2a85]/20">
                <Trash2 className="w-5 h-5 text-[#ff5c9d]" />
              </div>
              <h3 id="delete-note-title" className="font-semibold text-sm text-white">
                Delete “{noteToDelete.label}”?
              </h3>
            </div>
            <p className="text-xs text-[#c4c4c4] leading-relaxed">
              The note
              {deleteLinkCount > 0 && ` and its ${deleteLinkCount} connection${deleteLinkCount === 1 ? '' : 's'}`} will be
              removed from the vault. This can't be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button type="button" onClick={closeDeleteNoteModal} className={secondaryBtn}>
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteNote}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#e0246f] hover:bg-[#c81e62] text-white transition-colors"
              >
                Delete note
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Reset vault */}
      {isResetVaultModalOpen && (
        <ModalShell onClose={closeResetVaultModal} widthClass="max-w-sm" labelledBy="reset-vault-title">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#ffb703]/10 border border-[#ffb703]/20">
                <RotateCcw className="w-5 h-5 text-[#ffb703]" />
              </div>
              <h3 id="reset-vault-title" className="font-semibold text-sm text-white">
                Reset the vault?
              </h3>
            </div>
            <p className="text-xs text-[#c4c4c4] leading-relaxed">
              This replaces your {nodes.length} notes with the original sample notes, resets graph settings and clears
              the chat. Notes you created or edited will be lost.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button type="button" onClick={closeResetVaultModal} className={secondaryBtn}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetVault();
                  closeResetVaultModal();
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#ffb703] hover:bg-[#e6a502] text-black transition-colors"
              >
                Reset vault
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Help */}
      {isHelpModalOpen && (
        <ModalShell onClose={closeHelpModal} widthClass="max-w-lg" labelledBy="help-title" className="max-h-[85vh] flex flex-col">
          <ModalHeader
            id="help-title"
            icon={<HelpCircle className="w-4 h-4 text-[#b57aed]" />}
            title="Guide & shortcuts"
            onClose={closeHelpModal}
          />
          <div className="px-6 py-5 space-y-5 text-xs text-[#c4c4c4] overflow-y-auto">
            <section className="space-y-2">
              <h4 className="font-semibold text-white">Keyboard</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {SHORTCUTS.map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-3">
                    <span className="text-[#a3a3a3]">{s.label}</span>
                    <kbd className="vault-kbd">{s.keys}</kbd>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-semibold text-white">Graph</h4>
              <ul className="list-disc pl-4 space-y-1 text-[#a3a3a3] marker:text-[#5f5f5f]">
                <li>Click a node to select it and highlight its connections. Double-click to open the note.</li>
                <li>Scroll to zoom, drag the background to pan, drag a node to move it.</li>
                <li>Use the zoom buttons (bottom right) to fit the whole graph in view.</li>
                <li>The sliders icon (top right) holds forces, display, color groups and filters.</li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-semibold text-white">Linking notes</h4>
              <p className="text-[#a3a3a3] leading-relaxed">
                Type <code className="text-[#b57aed] bg-[#121212] px-1.5 py-0.5 rounded">[[Note Title]]</code> in a note
                to link it. The connection appears in the graph as you type. Links to notes that don't exist yet are
                shown dashed; click one to create that note.
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-semibold text-white">AI assistant</h4>
              <p className="text-[#a3a3a3] leading-relaxed">
                Ask questions about your notes or use “Expand with AI”. New concepts the assistant proposes are added to
                the graph automatically under <em>AI Discoveries</em>.
              </p>
            </section>

            <p className="text-[11px] text-[#7c7c7c]">Your vault is saved in this browser. Use Reset (top bar) to restore the samples.</p>
          </div>
          <div className="flex items-center justify-end px-6 py-3 border-t border-[#1c1c1c]">
            <button
              type="button"
              onClick={closeHelpModal}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#181818] hover:bg-[#222222] text-white transition-colors"
            >
              Got it
            </button>
          </div>
        </ModalShell>
      )}
    </>
  );
};
