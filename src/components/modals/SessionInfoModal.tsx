import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ShieldCheck, RotateCcw, X, EyeOff, Layers, Key } from 'lucide-react';

interface SessionInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApiKey?: () => void;
}

export const SessionInfoModal: React.FC<SessionInfoModalProps> = ({
  isOpen,
  onClose,
  onOpenApiKey,
}) => {
  const { resetWorkspace, nodes, edges, apiKey, aiProvider } = useWorkspace();

  if (!isOpen) return null;

  const handleReset = () => {
    if (confirm('Restore the original sample graph? All in-memory edits for this tab will be cleared.')) {
      resetWorkspace();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Session & Demo Status</h3>
            </div>
            <p className="text-xs text-slate-500">
              TESSERA is an in-memory, no-account demo. Your changes disappear when you reload or close the tab.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <EyeOff className="w-3.5 h-3.5" />
              <span>In-Memory Only</span>
            </div>
            <p className="text-[11px] text-slate-500">
              No database, cookies, or browser storage. All edits live in RAM.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-700 font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Sample Graph</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {nodes.length} concepts and {edges.length} connections currently in session.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-violet-700 font-semibold">
              <Key className="w-3.5 h-3.5" />
              <span>API Key</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {apiKey ? `${aiProvider.toUpperCase()} active in session` : 'Guided sample mode'}
            </p>
          </div>
        </div>

        {/* Reset Demo Section */}
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-rose-950">Reset Demo Workspace</div>
            <div className="text-[11px] text-rose-700">
              Discard all edits and restore the default sample map immediately.
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
          {onOpenApiKey && (
            <button
              onClick={() => {
                onClose();
                onOpenApiKey();
              }}
              className="px-3 py-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition"
            >
              Configure API Key
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
