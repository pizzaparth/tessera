import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  ConceptNode,
  ConceptEdge,
  ConceptType,
  ConceptDomain,
  RelationshipType,
  ExtractionResult,
  ExtractionSuggestion,
  AIProvider,
  FilterState,
  GraphAnalytics,
} from '../types';
import { initialNodes, initialEdges } from '../data/sampleGraph';

export type WorkspaceTab =
  | 'overview'
  | 'graph'
  | 'mapper'
  | 'review'
  | 'notes'
  | 'analytics'
  | 'synthesis';

interface HistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
}

interface WorkspaceContextType {
  nodes: ConceptNode[];
  edges: ConceptEdge[];
  selectedNode: ConceptNode | null;
  selectedNodeId: string | null;
  filters: FilterState;
  activeTab: WorkspaceTab;
  apiKey: string | null;
  aiProvider: AIProvider;
  extractionResult: ExtractionResult | null;
  reviewQueue: ExtractionSuggestion[];
  historyLog: HistoryEntry[];
  analytics: GraphAnalytics;
  
  // Actions
  setActiveTab: (tab: WorkspaceTab) => void;
  selectNode: (id: string | null) => void;
  addNode: (node: ConceptNode) => void;
  updateNode: (id: string, updates: Partial<ConceptNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: ConceptEdge) => void;
  deleteEdge: (id: string) => void;
  setFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
  setApiKey: (key: string | null) => void;
  setAiProvider: (provider: AIProvider) => void;
  setExtractionResult: (result: ExtractionResult | null) => void;
  acceptSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
  acceptAllSuggestions: () => void;
  updateSuggestion: (id: string, updates: Partial<ExtractionSuggestion>) => void;
  resetWorkspace: () => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  selectedDomains: [],
  selectedTypes: [],
  selectedRelationships: [],
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<ConceptNode[]>(initialNodes);
  const [edges, setEdges] = useState<ConceptEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('momentum_factor');
  const [filters, setFiltersState] = useState<FilterState>(initialFilters);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [aiProvider, setAiProvider] = useState<AIProvider>('openai');
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [reviewQueue, setReviewQueue] = useState<ExtractionSuggestion[]>([]);
  const [historyLog, setHistoryLog] = useState<HistoryEntry[]>([
    {
      id: 'init',
      timestamp: new Date().toLocaleTimeString(),
      action: 'Session initialized with sample quantitative knowledge map',
    },
  ]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const setFilters = (updates: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFiltersState(initialFilters);
  };

  const addHistory = (action: string, details?: string) => {
    const entry: HistoryEntry = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      action,
      details,
    };
    setHistoryLog((prev) => [entry, ...prev.slice(0, 49)]);
  };

  const selectNode = (id: string | null) => {
    setSelectedNodeId(id);
    if (id) {
      const node = nodes.find((n) => n.id === id);
      if (node) {
        addHistory(`Selected concept: ${node.label}`);
      }
    }
  };

  const addNode = (node: ConceptNode) => {
    setNodes((prev) => {
      const exists = prev.some((n) => n.id === node.id);
      if (exists) return prev;
      return [...prev, node];
    });
    addHistory(`Added concept: ${node.label}`, `Type: ${node.type}, Domain: ${node.domain}`);
  };

  const updateNode = (id: string, updates: Partial<ConceptNode>) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === id) {
          const updated = { ...node, ...updates };
          const changeLog = {
            id: `ver_${Date.now()}`,
            timestamp: new Date().toISOString(),
            change: 'Content revised by researcher in session',
            author: 'Current Researcher',
            contentSnapshot: updates.markdownContent,
          };
          updated.versions = [changeLog, ...(node.versions || [])];
          return updated;
        }
        return node;
      })
    );
    addHistory(`Updated concept details: ${id}`);
  };

  const deleteNode = (id: string) => {
    const target = nodes.find((n) => n.id === id);
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
    addHistory(`Deleted concept: ${target?.label || id}`);
  };

  const addEdge = (edge: ConceptEdge) => {
    setEdges((prev) => {
      const exists = prev.some(
        (e) => e.source === edge.source && e.target === edge.target && e.type === edge.type
      );
      if (exists) return prev;
      return [...prev, edge];
    });
    addHistory(`Created link: ${edge.source} -> ${edge.type} -> ${edge.target}`);
  };

  const deleteEdge = (id: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
    addHistory(`Deleted link: ${id}`);
  };

  const handleSetExtractionResult = (result: ExtractionResult | null) => {
    setExtractionResult(result);
    if (result && result.concepts) {
      setReviewQueue(result.concepts);
      addHistory(`Received extraction proposal with ${result.concepts.length} candidate concepts`);
    }
  };

  const acceptSuggestion = (id: string) => {
    const suggestion = reviewQueue.find((s) => s.id === id);
    if (!suggestion) return;

    // Convert suggestion to ConceptNode
    const newNode: ConceptNode = {
      id: suggestion.id,
      label: suggestion.label,
      type: suggestion.type,
      domain: suggestion.domain,
      summary: suggestion.summary,
      definition: suggestion.summary,
      markdownContent: `# ${suggestion.label}\n\n## Summary\n${suggestion.summary}\n\n## Source Excerpt\n> "${suggestion.excerpt}"\n\n*Extracted via AI assistance with ${(suggestion.confidence * 100).toFixed(0)}% confidence.*`,
      provenance: {
        source: 'AI-assisted conversation extraction',
        excerpt: suggestion.excerpt,
        origin: 'ai_suggested',
        confidence: suggestion.confidence,
        createdAt: new Date().toISOString(),
      },
    };

    addNode(newNode);

    // Add suggested edges if targets exist
    suggestion.suggestedEdges.forEach((e) => {
      const targetExists = nodes.some((n) => n.id === e.targetId) || e.targetId === newNode.id;
      if (targetExists) {
        addEdge({
          id: `edge_${newNode.id}_${e.targetId}_${Date.now()}`,
          source: newNode.id,
          target: e.targetId,
          type: e.type,
          label: e.label,
          provenance: {
            source: 'AI-suggested relationship',
            origin: 'ai_suggested',
            createdAt: new Date().toISOString(),
          },
        });
      }
    });

    setReviewQueue((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'accepted' } : s))
    );
    addHistory(`Accepted proposal: ${suggestion.label}`);
  };

  const rejectSuggestion = (id: string) => {
    setReviewQueue((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s))
    );
    addHistory(`Rejected proposal: ${id}`);
  };

  const acceptAllSuggestions = () => {
    reviewQueue.forEach((s) => {
      if (s.status === 'pending') {
        acceptSuggestion(s.id);
      }
    });
    addHistory('Batch accepted all proposed concepts and links');
  };

  const updateSuggestion = (id: string, updates: Partial<ExtractionSuggestion>) => {
    setReviewQueue((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const resetWorkspace = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNodeId('momentum_factor');
    setFiltersState(initialFilters);
    setExtractionResult(null);
    setReviewQueue([]);
    setHistoryLog([
      {
        id: `reset_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: 'Workspace reset to clean sample state (all temporary in-memory edits cleared)',
      },
    ]);
  };

  // Compute graph analytics
  const analytics: GraphAnalytics = useMemo(() => {
    const nodeCount = nodes.length;
    const edgeCount = edges.length;

    // Type distribution
    const typeDistribution = nodes.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as Record<ConceptType, number>);

    // Domain distribution
    const domainDistribution = nodes.reduce((acc, n) => {
      acc[n.domain] = (acc[n.domain] || 0) + 1;
      return acc;
    }, {} as Record<ConceptDomain, number>);

    // Degree calculation
    const degrees: Record<string, number> = {};
    nodes.forEach((n) => (degrees[n.id] = 0));
    edges.forEach((e) => {
      if (degrees[e.source] !== undefined) degrees[e.source]++;
      if (degrees[e.target] !== undefined) degrees[e.target]++;
    });

    const topCentralNodes = Object.entries(degrees)
      .map(([id, degree]) => {
        const node = nodes.find((n) => n.id === id);
        return {
          id,
          label: node?.label || id,
          domain: node?.domain || 'Factor Research',
          degree,
        };
      })
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 6);

    // Approximate bridge nodes (nodes connecting different domains)
    const domainBridges: Record<string, number> = {};
    edges.forEach((e) => {
      const srcNode = nodes.find((n) => n.id === e.source);
      const tgtNode = nodes.find((n) => n.id === e.target);
      if (srcNode && tgtNode && srcNode.domain !== tgtNode.domain) {
        domainBridges[e.source] = (domainBridges[e.source] || 0) + 1;
        domainBridges[e.target] = (domainBridges[e.target] || 0) + 1;
      }
    });

    const bridgeNodes = Object.entries(domainBridges)
      .map(([id, betweenness]) => {
        const node = nodes.find((n) => n.id === id);
        return {
          id,
          label: node?.label || id,
          domain: node?.domain || 'Factor Research',
          betweenness,
        };
      })
      .sort((a, b) => b.betweenness - a.betweenness)
      .slice(0, 5);

    const isolatedNodes = nodes
      .filter((n) => (degrees[n.id] || 0) === 0)
      .map((n) => ({ id: n.id, label: n.label, domain: n.domain }));

    const density =
      nodeCount > 1 ? Number(((2 * edgeCount) / (nodeCount * (nodeCount - 1))).toFixed(3)) : 0;

    return {
      nodeCount,
      edgeCount,
      typeDistribution,
      domainDistribution,
      topCentralNodes,
      bridgeNodes,
      isolatedNodes,
      density,
    };
  }, [nodes, edges]);

  return (
    <WorkspaceContext.Provider
      value={{
        nodes,
        edges,
        selectedNode,
        selectedNodeId,
        filters,
        activeTab,
        apiKey,
        aiProvider,
        extractionResult,
        reviewQueue,
        historyLog,
        analytics,
        setActiveTab,
        selectNode,
        addNode,
        updateNode,
        deleteNode,
        addEdge,
        deleteEdge,
        setFilters,
        resetFilters,
        setApiKey,
        setAiProvider,
        setExtractionResult: handleSetExtractionResult,
        acceptSuggestion,
        rejectSuggestion,
        acceptAllSuggestions,
        updateSuggestion,
        resetWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
