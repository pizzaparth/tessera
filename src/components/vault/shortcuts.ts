import { useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** Display label for the platform modifier key. */
export const MOD = isMac ? '⌘' : 'Ctrl';

export const SHORTCUTS: { keys: string; label: string }[] = [
  { keys: `${MOD} K`, label: 'Search and open notes' },
  { keys: `${MOD} Shift N`, label: 'New note' },
  { keys: `${MOD} G`, label: 'Graph view' },
  { keys: `${MOD} Shift S`, label: 'Toggle split view' },
  { keys: `${MOD} E`, label: 'Toggle edit / reading mode' },
  { keys: `${MOD} B`, label: 'Toggle file sidebar' },
  { keys: `${MOD} J`, label: 'Toggle AI assistant' },
  { keys: '?', label: 'Show this guide' },
  { keys: 'Esc', label: 'Close dialog or panel' },
];

/** Custom event the note editor listens for to toggle edit / reading mode. */
export const TOGGLE_EDIT_EVENT = 'vault:toggle-edit-mode';

const isTyping = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable;
};

/** Global keyboard shortcuts for the workspace. */
export const useWorkspaceShortcuts = () => {
  const ws = useWorkspace();

  useEffect(() => {
    const anyModalOpen =
      ws.isCreateNoteModalOpen ||
      !!ws.noteToDelete ||
      ws.isResetVaultModalOpen ||
      ws.isHelpModalOpen ||
      ws.isQuickSwitcherOpen;

    const onKeyDown = (e: KeyboardEvent) => {
      const mod = isMac ? e.metaKey : e.ctrlKey;
      const key = e.key.toLowerCase();

      if (mod && key === 'k') {
        e.preventDefault();
        if (ws.isQuickSwitcherOpen) ws.closeQuickSwitcher();
        else if (!anyModalOpen) ws.openQuickSwitcher();
        return;
      }

      // Modals handle their own keys (Esc, Enter)
      if (anyModalOpen) return;

      if (mod && e.shiftKey && key === 'n') {
        e.preventDefault();
        ws.openCreateNoteModal();
      } else if (mod && !e.shiftKey && key === 'g') {
        e.preventDefault();
        ws.setActiveView('graph');
      } else if (mod && e.shiftKey && key === 's') {
        e.preventDefault();
        ws.setActiveView(ws.activeView === 'split' ? 'graph' : 'split');
      } else if (mod && !e.shiftKey && key === 'e') {
        e.preventDefault();
        if (ws.activeView === 'graph') ws.setActiveView('note');
        window.dispatchEvent(new Event(TOGGLE_EDIT_EVENT));
      } else if (mod && !e.shiftKey && key === 'b') {
        e.preventDefault();
        ws.toggleSidebar();
      } else if (mod && !e.shiftKey && key === 'j') {
        e.preventDefault();
        ws.toggleAI();
      } else if (!mod && e.key === '?' && !isTyping(e.target)) {
        e.preventDefault();
        ws.openHelpModal();
      } else if (e.key === 'Escape' && !isTyping(e.target) && ws.isAIOpen && window.innerWidth < 1280) {
        ws.toggleAI();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [ws]);
};
