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

    const relConfig = RELATIONSHIP_CONFIG[relType];
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface border border-surface-border rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Add Typed Relationship</h3>
            </div>
            <p className="text-xs text-slate-400">
              Connect <strong className="text-white">{selectedNode.label}</strong> with another concept.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Relationship Type
            </label>
            <select
              value={relType}
              onChange={(e) => setRelType(e.target.value as RelationshipType)}
              className="w-full p-2.5 rounded-lg bg-[#080b12] text-white text-xs border border-surface-border outline-none focus:border-cyan-500"
            >
              {Object.entries(RELATIONSHIP_CONFIG).map(([typeKey, cfg]) => (
                <option key={typeKey} value={typeKey}>
                  {cfg.label} ({cfg.lineStyle})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Target Concept
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg bg-[#080b12] text-white text-xs border border-surface-border outline-none focus:border-cyan-500"
            >
              <option value="">-- Choose destination concept --</option>
              {availableTargets.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label} ({n.domain})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!targetId}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow transition flex items-center gap-1.5"
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
