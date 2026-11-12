import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { RelationshipType } from '../../types';
import { RELATIONSHIP_CONFIG } from '../../utils/visualEncoding';
import { Link as LinkIcon, X, Plus } from 'lucide-react';

interface AddConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddConnectionModal: React.FC<AddConnectionModalProps> = ({ isOpen, onClose }) => {
  const { selectedNode, nodes, addEdge } = useWorkspace();
  const [targetId, setTargetId] = useState<string>('');
  const [relType, setRelType] = useState<RelationshipType>('depends_on');

  if (!isOpen || !selectedNode) return null;

  const availableTargets = nodes.filter((n) => n.id !== selectedNode.id);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;

    const relConfig = RELATIONSHIP_CONFIG[relType] || { label: relType };
    addEdge({
      id: `edge_${selectedNode.id}_${targetId}_${Date.now()}`,
      source: selectedNode.id,
      target: targetId,
      type: relType,
      label: relConfig.label,
      description: `Manual connection created by researcher`,
      provenance: {
        source: 'Researcher manual connection',
        origin: 'researcher_authored',
        createdAt: new Date().toISOString(),
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <LinkIcon className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Add Typed Relationship</h3>
            </div>
            <p className="text-xs text-slate-500">
              Connect <span className="font-semibold text-slate-800">{selectedNode.label}</span> to another concept.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          {/* Target Concept */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Target Concept</label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            >
              <option value="">Select target node...</option>
              {availableTargets.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label} ({n.domain})
                </option>
              ))}
            </select>
          </div>

          {/* Relationship Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Relationship Semantics</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {(Object.keys(RELATIONSHIP_CONFIG) as RelationshipType[]).map((typeKey) => {
                const cfg = RELATIONSHIP_CONFIG[typeKey];
                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => setRelType(typeKey)}
                    className={`p-2 rounded-xl border text-left text-xs transition ${
                      relType === typeKey
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="font-semibold capitalize" style={{ color: cfg.color }}>
                      {cfg.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!targetId}
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Link</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
