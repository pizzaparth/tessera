import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
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
  apiKeys: Record<string, string>;
  statusNotification: string | null;

  // Actions
  selectNode: (id: string | null) => void;
  setActiveView: (view: 'graph' | 'note' | 'split') => void;
  toggleAI: () => void;
  toggleSidebar: () => void;
  sendMessageToAI: (text: string) => Promise<void>;
  updateNodeContent: (id: string, content: string) => void;
  createNote: (title: string, folder?: string) => void;
  deleteNote: (id: string) => void;
  setGraphSettings: (updates: Partial<GraphEngineSettings>) => void;
  setActiveModel: (model: string, provider: AIProvider) => void;
  setProviderApiKey: (provider: AIProvider, key: string) => void;
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

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<NoteNode[]>(initialVaultNodes);
  const [edges, setEdges] = useState<NoteEdge[]>(initialVaultEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('neural_networks');
  const [activeView, setActiveView] = useState<'graph' | 'note' | 'split'>('graph');
  const [isAIOpen, setIsAIOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [graphSettings, setGraphSettingsState] = useState<GraphEngineSettings>(defaultGraphSettings);
  const [activeProvider, setActiveProvider] = useState<AIProvider>('anthropic');
  const [activeModel, setActiveModelName] = useState<string>('claude-3-5-sonnet');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init_msg',
      role: 'assistant',
      content: `Hello! I am your AI knowledge partner connected directly to your vault graph.

I can reason with frontier models across **Anthropic (Claude)**, **OpenAI (GPT-4o)**, **Google (Gemini)**, and **DeepSeek**.

Ask me to explore or expand any thought:
- *"Expand on how Attention Mechanism connects to Working Memory"*
- *"What links Emergence, Consciousness, and Neural Networks?"*
- *"Generate sub-concepts for Complex Adaptive Systems"*

Whenever I identify new concepts and relationships, I'll **dynamically expand your graph in real time**!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'Claude 3.5 Sonnet',
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

  const setProviderApiKey = (provider: AIProvider, key: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: key }));
    showNotification(`API Key saved for ${provider}`);
  };

  const updateNodeContent = (id: string, content: string) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, content, updatedAt: new Date().toISOString() } : node))
    );
  };

  const createNote = (title: string, folder = 'Notes') => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newNode: NoteNode = {
      id: slug,
      label: title,
      folder,
      color: '#9d4edd',
      content: `# ${title}\n\nStart writing here or ask the AI to expand this thought with [[Wikilinks]]...\n`,
      tags: ['new'],
      createdAt: new Date().toISOString(),
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setActiveView('note');
    showNotification(`Created note: ${title}`);
  };

  const deleteNote = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const sendMessageToAI = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
          apiKey: apiKeys[activeProvider],
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expandedNodes: data.expandedNodes,
        model: activeModel,
        provider: activeProvider,
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
        content: `Error connecting to ${activeModel} (${activeProvider}): ${err.message}. You can configure your API key in \`.env\` or in the top settings gear.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        content: 'Vault restored to initial default state.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        apiKeys,
        statusNotification,
        selectNode,
        setActiveView,
        toggleAI,
        toggleSidebar,
        sendMessageToAI,
        updateNodeContent,
        createNote,
        deleteNote,
        setGraphSettings,
        setActiveModel,
        setProviderApiKey,
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
