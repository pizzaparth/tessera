import React, { useEffect, useRef } from 'react';

interface ModalShellProps {
  onClose: () => void;
  children: React.ReactNode;
  /** Tailwind max-width class for the dialog panel */
  widthClass?: string;
  /** Vertical placement: centered (default) or near the top like a command palette */
  align?: 'center' | 'top';
  labelledBy?: string;
  className?: string;
}

/**
 * Shared dialog wrapper: dims the workspace, closes on Escape or backdrop
 * click, and returns focus to the previously focused element on close.
 */
export const ModalShell: React.FC<ModalShellProps> = ({
  onClose,
  children,
  widthClass = 'max-w-md',
  align = 'center',
  labelledBy,
  className = '',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Focus the first focusable control unless something inside already took focus (autoFocus)
    const panel = panelRef.current;
    if (panel && !panel.contains(document.activeElement)) {
      const first = panel.querySelector<HTMLElement>(
        'input, textarea, select, button:not([data-modal-close]), [tabindex]:not([tabindex="-1"])'
      );
      (first ?? panel).focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center p-4 bg-black/75 backdrop-blur-sm vault-fade-in select-none ${
        align === 'top' ? 'items-start pt-[12vh]' : 'items-center'
      }`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`w-full ${widthClass} bg-[#0a0a0a] border border-[#262626] rounded-2xl shadow-[0_24px_80px_-12px_rgba(0,0,0,0.9)] text-white outline-none vault-pop-in ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
