import React, { createContext, useContext, useState, useMemo, useEffect, useRef, ReactNode } from 'react';
import { NoteNode, NoteEdge, ChatMessage, GraphEngineSettings, AIProvider } from '../types';
import { initialVaultNodes, initialVaultEdges } from '../data/sampleGraph';

interface WorkspaceContextType {
  nodes: NoteNode[];
  edges: NoteEdge[];
  selectedNodeId: string | null;
  selectedNode: NoteNode | null;
  activeView: 'graph' | 'note' | 'split';
  isAIOpen: boolean;
  isSidebarOpen: boolean;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  graphSettings: GraphEngineSettings;
  activeProvider: AIProvider;
  activeModel: string;
  statusNotification: string | null;

  // In-System Modal States
  isCreateNoteModalOpen: boolean;
  noteToDelete: { id: string; label: string } | null;
  isResetVaultModalOpen: boolean;
  isHelpModalOpen: boolean;
  isQuickSwitcherOpen: boolean;

  // Actions
  selectNode: (id: string | null) => void;
  openNote: (id: string) => void;
  openQuickSwitcher: () => void;
  closeQuickSwitcher: () => void;
  showNotification: (msg: string) => void;
  setActiveView: (view: 'graph' | 'note' | 'split') => void;
  toggleAI: () => void;
  toggleSidebar: () => void;
  sendMessageToAI: (text: string) => Promise<void>;
  updateNodeContent: (id: string, content: string) => void;
  createNote: (title: string, folder?: string) => string;
  deleteNote: (id: string) => void;
  openCreateNoteModal: () => void;
  closeCreateNoteModal: () => void;
  openDeleteNoteModal: (id: string, label: string) => void;
  closeDeleteNoteModal: () => void;
  confirmDeleteNote: () => void;
  openResetVaultModal: () => void;
  closeResetVaultModal: () => void;
  openHelpModal: () => void;
  closeHelpModal: () => void;
  setGraphSettings: (updates: Partial<GraphEngineSettings>) => void;
  setActiveModel: (model: string, provider: AIProvider) => void;
  resetVault: () => void;
}

const defaultGraphSettings: GraphEngineSettings = {
  // 1. Filters
  searchQuery: '',
  showOrphans: true,
  showTags: true,

  // 2. Groups
  groups: [
    { id: 'g1', query: 'Artificial Intelligence', color: '#9d4edd' }, // Electric Purple
    { id: 'g2', query: 'Cognitive Science', color: '#00ff88' },       // Neon Mint
    { id: 'g3', query: 'Philosophy of Mind', color: '#ff2a85' },      // Neon Rose
    { id: 'g4', query: 'Systems Theory', color: '#00f5ff' },          // Electric Cyan
  ],

  // 3. Display
  nodeSizeMultiplier: 1.2,
  linkThickness: 1.0,
  textFadeThreshold: 0.5,
  showArrows: false,

  // 4. Forces (Physics)
  centerForce: 0.4,
  repelForce: 450,
  linkForce: 0.8,
  linkDistance: 110,
};

const STORAGE_KEY = 'brain-vault:v1';

interface PersistedVault {
  nodes: NoteNode[];
  edges: NoteEdge[];
  graphSettings: GraphEngineSettings;
  selectedNodeId: string | null;
}

const loadPersisted = (): Partial<PersistedVault> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<PersistedVault>) : {};
  } catch {
    return {};
  }
};

const isWide = (minWidth: number) =>
  typeof window === 'undefined' ? true : window.innerWidth >= minWidth;

const timeNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** Extract the unique [[Wikilink]] targets (lower-cased) from markdown. */
export const extractWikilinks = (markdown: string): string[] => {
  const found = new Set<string>();
  const re = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown))) found.add(m[1].trim().toLowerCase());
  return [...found];
};

export const findNodeByTitle = (nodes: NoteNode[], title: string) => {
  const t = title.trim().toLowerCase();
  return nodes.find((n) => n.label.toLowerCase() === t || n.id === t.replace(/[^a-z0-9]/g, '_'));
};

const WELCOME_MESSAGE = `Hi! I'm connected to your vault graph. Ask me to explore a note, connect ideas, or propose new concepts. New notes I suggest are **added to your graph automatically**.

Try:
- *"How does Attention Mechanism relate to Working Memory?"*
- *"What links Emergence and Consciousness?"*
- *"Suggest sub-concepts for Complex Adaptive Systems"*`;

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [persisted] = useState(loadPersisted);
  const [nodes, setNodes] = useState<NoteNode[]>(persisted.nodes ?? initialVaultNodes);
  const [edges, setEdges] = useState<NoteEdge[]>(persisted.edges ?? initialVaultEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    persisted.selectedNodeId !== undefined ? persisted.selectedNodeId : 'neural_networks'
  );
  const [activeView, setActiveView] = useState<'graph' | 'note' | 'split'>('graph');
  const [isAIOpen, setIsAIOpen] = useState(() => isWide(1280));
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => isWide(900));
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [graphSettings, setGraphSettingsState] = useState<GraphEngineSettings>({
    ...defaultGraphSettings,
    ...persisted.graphSettings,
    searchQuery: '',
  });
  const [activeProvider, setActiveProvider] = useState<AIProvider>('anthropic');
  const [activeModel, setActiveModelName] = useState<string>('claude-sonnet-5-5');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // In-system dialog/modal states
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<{ id: string; label: string } | null>(null);
  const [isResetVaultModalOpen, setIsResetVaultModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isQuickSwitcherOpen, setIsQuickSwitcherOpen] = useState(false);

  // Persist the vault locally so edits survive a page reload
  useEffect(() => {
    const handle = window.setTimeout(() => {
      try {
        const data: PersistedVault = { nodes, edges, graphSettings, selectedNodeId };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        /* storage unavailable: keep working in memory */
      }
    }, 400);
    return () => window.clearTimeout(handle);
  }, [nodes, edges, graphSettings, selectedNodeId]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init_msg',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: timeNow(),
      model: 'Claude Sonnet 5.5',
      provider: 'anthropic',
    },
  ]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => {
      setStatusNotification((current) => (current === msg ? null : current));
    }, 4500);
  };

  const selectNode = (id: string | null) => {
    setSelectedNodeId(id);
  };

  // Select a note and make sure it is visible (keeps split view if active)
  const openNote = (id: string) => {
    setSelectedNodeId(id);
    setActiveView((view) => (view === 'graph' ? 'note' : view));
  };

  const openQuickSwitcher = () => setIsQuickSwitcherOpen(true);
  const closeQuickSwitcher = () => setIsQuickSwitcherOpen(false);

  const toggleAI = () => setIsAIOpen((prev) => !prev);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const setGraphSettings = (updates: Partial<GraphEngineSettings>) => {
    setGraphSettingsState((prev) => ({ ...prev, ...updates }));
  };

  const setActiveModel = (model: string, provider: AIProvider) => {
    setActiveModelName(model);
    setActiveProvider(provider);
    showNotification(`Switched active AI to ${model} (${provider})`);
  };

  // Keep graph edges in sync with the [[wikilinks]] written in a note.
  // Only links that were added or removed in this edit are touched, so
  // connections created elsewhere (seed data, AI expansion) stay intact.
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  const updateNodeContent = (id: string, content: string) => {
    const current = nodesRef.current;
    const prevNode = current.find((n) => n.id === id);
    if (!prevNode) return;

    const resolve = (titles: string[]) =>
      new Set(
        titles
          .map((t) => findNodeByTitle(current, t)?.id)
          .filter((x): x is string => !!x && x !== id)
      );
    const before = resolve(extractWikilinks(prevNode.content));
    const after = resolve(extractWikilinks(content));
    const added = [...after].filter((t) => !before.has(t));
    const removed = [...before].filter((t) => !after.has(t));

    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, content, updatedAt: new Date().toISOString() } : node))
    );

    if (added.length || removed.length) {
      setEdges((prev) => {
        let next = prev.filter((e) => !(e.source === id && removed.includes(e.target)));
        const linked = (t: string) =>
          next.some((e) => (e.source === id && e.target === t) || (e.source === t && e.target === id));
        for (const target of added) {
          if (!linked(target)) {
            next = [...next, { id: `edge_${Date.now()}_${target}`, source: id, target }];
          }
        }
        return next;
      });
    }
  };

  const createNote = (title: string, folder = 'Notes') => {
    const base = title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'untitled';
    const taken = new Set(nodesRef.current.map((n) => n.id));
    let slug = base;
    for (let i = 2; taken.has(slug); i++) slug = `${base}_${i}`;
    const newNode: NoteNode = {
      id: slug,
      label: title,
      folder,
      color: '#9d4edd',
      content: `# ${title}\n\n`,
      tags: ['new'],
      createdAt: new Date().toISOString(),
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setActiveView((view) => (view === 'split' ? 'split' : 'note'));
    showNotification(`Created note: ${title}`);
    return newNode.id;
  };

  const deleteNote = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const openCreateNoteModal = () => setIsCreateNoteModalOpen(true);
  const closeCreateNoteModal = () => setIsCreateNoteModalOpen(false);

  const openDeleteNoteModal = (id: string, label: string) => setNoteToDelete({ id, label });
  const closeDeleteNoteModal = () => setNoteToDelete(null);
  const confirmDeleteNote = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      showNotification(`Deleted note: ${noteToDelete.label}`);
      setNoteToDelete(null);
    }
  };

  const openResetVaultModal = () => setIsResetVaultModalOpen(true);
  const closeResetVaultModal = () => setIsResetVaultModalOpen(false);


  const openHelpModal = () => setIsHelpModalOpen(true);
  const closeHelpModal = () => setIsHelpModalOpen(false);

  const sendMessageToAI = async (text: string) => {
    if (!text.trim() || isChatLoading) return;
    setIsAIOpen(true);

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: timeNow(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          activeNode: selectedNode,
          existingNodes: nodes,
          model: activeModel,
          provider: activeProvider,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: timeNow(),
        expandedNodes: data.expandedNodes,
        model: activeModel,
        provider: activeProvider,
        isSimulated: !!data.isSimulated,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);

      // If AI expanded nodes, add them directly to the graph!
      if (data.expandedNodes && Array.isArray(data.expandedNodes) && data.expandedNodes.length > 0) {
        setNodes((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const additions: NoteNode[] = [];
          for (const rawNode of data.expandedNodes) {
            if (!existingIds.has(rawNode.id)) {
              additions.push({
                id: rawNode.id,
                label: rawNode.label,
                folder: rawNode.folder || 'AI Discoveries',
                color: rawNode.color || '#00f5ff',
                content: rawNode.content || `# ${rawNode.label}\n\nGenerated by AI knowledge expansion.`,
                createdAt: new Date().toISOString(),
              });
              existingIds.add(rawNode.id);
            }
          }
          return [...prev, ...additions];
        });

        // Add new edges
        if (data.newEdges && Array.isArray(data.newEdges) && data.newEdges.length > 0) {
          setEdges((prev) => {
            const edgeKeys = new Set(prev.map((e) => `${e.source}_${e.target}`));
            const additions: NoteEdge[] = [];
            for (const rawEdge of data.newEdges) {
              const key1 = `${rawEdge.source}_${rawEdge.target}`;
              const key2 = `${rawEdge.target}_${rawEdge.source}`;
              if (!edgeKeys.has(key1) && !edgeKeys.has(key2)) {
                additions.push({
                  id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                  source: rawEdge.source,
                  target: rawEdge.target,
                });
                edgeKeys.add(key1);
              }
            }
            return [...prev, ...additions];
          });
        }

        showNotification(`✨ Graph Expanded: +${data.expandedNodes.length} notes, +${data.newEdges?.length || 0} connections`);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        isError: true,
        content: `**Couldn't reach ${activeModel}.** ${err.message}\n\nCheck that the dev server is running and try again.`,
        timestamp: timeNow(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const resetVault = () => {
    setNodes(initialVaultNodes);
    setEdges(initialVaultEdges);
    setSelectedNodeId('neural_networks');
    setActiveView('graph');
    setGraphSettingsState(defaultGraphSettings);
    setChatMessages([
      {
        id: `reset_${Date.now()}`,
        role: 'assistant',
        content: 'Vault restored to its default notes and settings.',
        timestamp: timeNow(),
      },
    ]);
    showNotification('Restored default vault knowledge graph');
  };

  return (
    <WorkspaceContext.Provider
      value={{
        nodes,
        edges,
        selectedNodeId,
        selectedNode,
        activeView,
        isAIOpen,
        isSidebarOpen,
        chatMessages,
        isChatLoading,
        graphSettings,
        activeProvider,
        activeModel,
        statusNotification,
        isCreateNoteModalOpen,
        noteToDelete,
        isResetVaultModalOpen,
        isHelpModalOpen,
        isQuickSwitcherOpen,
        selectNode,
        openNote,
        openQuickSwitcher,
        closeQuickSwitcher,
        showNotification,
        setActiveView,
        toggleAI,
        toggleSidebar,
        sendMessageToAI,
        updateNodeContent,
        createNote,
        deleteNote,
        openCreateNoteModal,
        closeCreateNoteModal,
        openDeleteNoteModal,
        closeDeleteNoteModal,
        confirmDeleteNote,
        openResetVaultModal,
        closeResetVaultModal,
        openHelpModal,
        closeHelpModal,
        setGraphSettings,
        setActiveModel,
        resetVault,
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
