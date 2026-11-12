import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AIProvider } from '../../types';
import { Key, ShieldAlert, Check, X, Trash2, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, aiProvider, setApiKey, setAiProvider } = useWorkspace();
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(aiProvider);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(tempKey.trim() ? tempKey.trim() : null);
    setAiProvider(selectedProvider);
    onClose();
  };

  const handleClear = () => {
    setTempKey('');
    setApiKey(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface border border-surface-border rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Temporary AI Provider Key</h3>
            </div>
            <p className="text-xs text-slate-400">
              Enable live AI concept extraction directly from your own provider.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Alert Note */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1 text-xs text-amber-200">
          <div className="flex items-center gap-1.5 font-semibold text-amber-400">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Strictly In-Memory & Session-Only</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-300/80">
            Your key stays in this active browser tab’s memory. It is never saved to localStorage, cookies, or a database. Reloading or closing the tab permanently erases it.
          </p>
        </div>

        {/* Provider Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select Model Provider
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['openai', 'anthropic', 'gemini'] as const).map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvider(prov)}
                className={`py-2 px-3 rounded-lg border text-xs capitalize font-medium transition ${
                  selectedProvider === prov
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow'
                    : 'bg-surface-card border-surface-border text-slate-400 hover:bg-white/5'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>

        {/* Input key */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{selectedProvider.toUpperCase()} API Key</span>
            <span className="text-[10px] text-slate-500">Starts with {selectedProvider === 'openai' ? 'sk-...' : selectedProvider === 'anthropic' ? 'sk-ant-...' : 'AIza...'}</span>
          </label>
          <input
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="Paste your API key here..."
            className="w-full p-2.5 rounded-lg bg-[#080b12] text-white text-xs font-mono border border-surface-border focus:border-cyan-500 outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          {apiKey ? (
            <button
              onClick={handleClear}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 p-2 rounded hover:bg-rose-500/10 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Key</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow transition"
            >
              Save in Memory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
