import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ShieldCheck, RotateCcw, X, Database, Lock, EyeOff, Activity } from 'lucide-react';

interface SessionInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionInfoModal: React.FC<SessionInfoModalProps> = ({ isOpen, onClose }) => {
  const { resetWorkspace, nodes, edges, historyLog } = useWorkspace();

  if (!isOpen) return null;

  const handleReset = () => {
    if (confirm('Are you sure you want to discard all temporary in-memory changes and restore the clean sample graph?')) {
      resetWorkspace();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface border border-surface-border rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Stateless Operating Model</h3>
            </div>
            <p className="text-xs text-slate-400">
              Session-only memory architecture for quantitative research exploration.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Principles Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-surface-card border border-surface-border space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Zero Persisted Data</span>
            </div>
            <p className="text-[11px] text-slate-400">
              No database, cookies, or localStorage. Refreshing immediately resets workspace.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-card border border-surface-border space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>In-Memory Key</span>
            </div>
            <p className="text-[11px] text-slate-400">
              API keys are held in active browser tab memory and never logged or stored.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-card border border-surface-border space-y-1">
            <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span>Sample Network</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Starts with {nodes.length} peer-reviewed quant finance concepts and {edges.length} typed links.
            </p>
          </div>
        </div>

        {/* In-Memory Event Log */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 uppercase tracking-wider">
              Recent Session Events ({historyLog.length})
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Volatile Memory</span>
          </div>
          <div className="max-h-36 overflow-y-auto space-y-1 bg-[#080b12] p-2.5 rounded-xl border border-surface-border text-xs">
            {historyLog.slice(0, 8).map((evt) => (
              <div key={evt.id} className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate pr-2">{evt.action}</span>
                <span className="font-mono text-slate-600 flex-shrink-0">{evt.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Action */}
        <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-between gap-3">
          <div className="text-xs">
            <div className="font-semibold text-rose-300">Reset Session Memory</div>
            <div className="text-[11px] text-slate-400">
              Discard all edits and restore initial quant graph state.
            </div>
          </div>
          <button
            onClick={handleReset}
            className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
