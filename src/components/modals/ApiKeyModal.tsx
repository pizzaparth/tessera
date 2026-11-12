import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AIProvider } from '../../types';
import { Key, ShieldAlert, Check, X, Trash2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Key className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Session API Key</h3>
            </div>
            <p className="text-xs text-slate-500">
              Provide an API key for live AI concept extraction during this session.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Alert Note */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-semibold text-amber-800">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Stateless & Memory-Only</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-700">
            Your key exists only in this active browser tab’s memory. It is never saved to a database, cookies, or local storage. Refreshing the tab clears it immediately.
          </p>
        </div>

        {/* Provider Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">AI Provider</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'openai', label: 'OpenAI', model: 'gpt-4o-mini' },
              { id: 'anthropic', label: 'Anthropic', model: 'claude-3-5-sonnet' },
              { id: 'gemini', label: 'Gemini', model: 'gemini-1.5-flash' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProvider(p.id as AIProvider)}
                className={`p-2.5 rounded-xl border text-center transition ${
                  selectedProvider === p.id
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold shadow-2xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="text-xs">{p.label}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{p.model}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Key Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">API Key String</label>
          <input
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder={`Enter your ${selectedProvider} API key...`}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          {apiKey ? (
            <button
              onClick={handleClear}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium hover:underline"
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
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition"
            >
              Save for Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
