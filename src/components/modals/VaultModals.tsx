import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, FileText, Trash2, RotateCcw, HelpCircle } from 'lucide-react';
import { ModalShell } from './ModalShell';
import { SHORTCUTS } from '../vault/shortcuts';

const NEW_FOLDER = '__new_folder__';

const inputClass = 'vault-input';
const secondaryBtn = 'vault-pill-ghost';
const primaryBtn = 'atlas-pill atlas-pill-sm !px-4 disabled:opacity-40 disabled:cursor-not-allowed';

const ModalHeader: React.FC<{ id: string; icon: React.ReactNode; title: string; subtitle?: string; onClose: () => void }> = ({
  id,
  icon,
  title,
  subtitle,
  onClose,
}) => (
  <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-1">
    <div className="flex items-center gap-2.5">
      {icon}
      <div>
        <h3 id={id} className="atlas-display text-[22px] leading-tight text-black">
          {title}
        </h3>
        {subtitle && <p className="text-[14px] text-black/55 mt-1">{subtitle}</p>}
      </div>
    </div>
    <button
      data-modal-close
      onClick={onClose}
      className="text-black/40 hover:text-black p-1.5 -m-1 rounded-full hover:bg-black/5 transition"
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
            icon={null}
            title="New note"
            onClose={closeCreateNoteModal}
          />
          <form onSubmit={handleCreateNoteSubmit} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="new-note-title" className="text-[13px] text-black/60 font-medium">
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
                <p className="text-[12px] text-[#b45309]">A note with this title exists. A copy will be created.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="new-note-folder" className="text-[13px] text-black/60 font-medium">
                Folder
              </label>
              <select
                id="new-note-folder"
                value={folderChoice}
                onChange={(e) => setFolderChoice(e.target.value)}
                className={`${inputClass} cursor-pointer appearance-none`}
              >
                {uniqueFolders.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
                {!uniqueFolders.includes('Notes') && (
                  <option value="Notes">
                    Notes
                  </option>
                )}
                <option value={NEW_FOLDER}>
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
              <div className="p-2.5 rounded-xl bg-[#fff1f6]">
                <Trash2 className="w-5 h-5 text-[#e21e86]" />
              </div>
              <h3 id="delete-note-title" className="atlas-display text-[22px] leading-tight text-black">
                Delete “{noteToDelete.label}”?
              </h3>
            </div>
            <p className="text-[14px] text-black/65 leading-[1.55]">
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
                className="atlas-pill atlas-pill-sm !px-4 !bg-[#e21e86] hover:!bg-[#c81a74]"
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
              <div className="p-2.5 rounded-xl bg-[#fff6e8]">
                <RotateCcw className="w-5 h-5 text-[#d97706]" />
              </div>
              <h3 id="reset-vault-title" className="atlas-display text-[22px] leading-tight text-black">
                Reset the vault?
              </h3>
            </div>
            <p className="text-[14px] text-black/65 leading-[1.55]">
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
                className="atlas-pill atlas-pill-sm !px-4"
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
            icon={null}
            title="Guide & shortcuts"
            onClose={closeHelpModal}
          />
          <div className="px-6 py-5 space-y-6 text-[14px] text-black/70 overflow-y-auto">
            <section className="space-y-2">
              <h4 className="font-semibold text-black mb-1">Keyboard</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {SHORTCUTS.map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-3">
                    <span className="text-black/65">{s.label}</span>
                    <kbd className="vault-kbd">{s.keys}</kbd>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-semibold text-black mb-1">Graph</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-black/65 marker:text-black/30">
                <li>Click a node to select it and highlight its connections. Double-click to open the note.</li>
                <li>Scroll to zoom, drag the background to pan, drag a node to move it.</li>
                <li>The sliders icon (top right) holds forces, display, color groups and filters.</li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-semibold text-black mb-1">Linking notes</h4>
              <p className="text-black/65 leading-[1.55]">
                Type <code className="text-[#6d55bd] bg-[#f7f5ff] px-1.5 py-0.5 rounded font-mono text-[13px]">[[Note Title]]</code> in a note
                to link it. The connection appears in the graph as you type. Links to notes that don't exist yet are
                shown dashed; click one to create that note.
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-semibold text-black mb-1">AI assistant</h4>
              <p className="text-black/65 leading-[1.55]">
                Ask questions about your notes or use “Expand with AI”. New concepts the assistant proposes are added to
                the graph automatically under <em>AI Discoveries</em>.
              </p>
            </section>

            <p className="text-[13px] text-black/45">Your vault is saved in this browser. Use Reset (top bar) to restore the samples.</p>
          </div>
          <div className="flex items-center justify-end px-6 py-4 border-t border-black/5">
            <button
              type="button"
              onClick={closeHelpModal}
              className="atlas-pill atlas-pill-sm !px-5"
            >
              Got it
            </button>
          </div>
        </ModalShell>
      )}
    </>
  );
};
