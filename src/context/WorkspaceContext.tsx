import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { NoteNode, NoteEdge, ChatMessage, GraphPhysicsSettings } from '../types';
import { initialVaultNodes, initialVaultEdges } from '../data/sampleGraph';

interface WorkspaceContextType {
  nodes: NoteNode[];
  edges: NoteEdge[];
  selectedNodeId: string | null;
  selectedNode: NoteNode | null;
  activeView: 'graph' | 'note' | 'split';
  isClaudeOpen: boolean;
  isSidebarOpen: boolean;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  graphPhysics: GraphPhysicsSettings;
  apiKey: string | null;
  statusNotification: string | null;

  // Actions
  selectNode: (id: string | null) => void;
  setActiveView: (view: 'graph' | 'note' | 'split') => void;
  toggleClaude: () => void;
  toggleSidebar: () => void;
  sendMessageToClaude: (text: string) => Promise<void>;
  updateNodeContent: (id: string, content: string) => void;
  createNote: (title: string, folder?: string) => void;
  deleteNote: (id: string) => void;
  setGraphPhysics: (updates: Partial<GraphPhysicsSettings>) => void;
  setApiKey: (key: string | null) => void;
  resetVault: () => void;
}

const initialPhysics: GraphPhysicsSettings = {
  nodeSize: 22,
  linkDistance: 130,
  repelForce: 600,
  showOrphans: true,
  filterFolder: 'all',
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<NoteNode[]>(initialVaultNodes);
  const [edges, setEdges] = useState<NoteEdge[]>(initialVaultEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('neural_networks');
  const [activeView, setActiveView] = useState<'graph' | 'note' | 'split'>('graph');
  const [isClaudeOpen, setIsClaudeOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [graphPhysics, setGraphPhysicsState] = useState<GraphPhysicsSettings>(initialPhysics);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init_msg',
      role: 'assistant',
      content: `Hello! I'm your Claude AI knowledge partner inside Obsidian. 

You can ask me to:
- **Expand on any topic**: I will generate new notes and automatically link them into your graph.
- **Find connections**: I'll trace how ideas connect across your vault.
- **Synthesize thoughts**: Select any note and ask me to deepen or challenge it.

Try asking: *"Expand on how Attention Mechanism connects to Working Memory"* or *"Explore connections between Emergence and Neural Networks"*!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => {
      setStatusNotification((current) => (current === msg ? null : current));
    }, 4000);
  };

  const selectNode = (id: string | null) => {
    setSelectedNodeId(id);
  };

  const toggleClaude = () => setIsClaudeOpen((prev) => !prev);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const setGraphPhysics = (updates: Partial<GraphPhysicsSettings>) => {
    setGraphPhysicsState((prev) => ({ ...prev, ...updates }));
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
      color: '#818cf8',
      content: `# ${title}\n\nStart writing here or ask Claude to expand on this thought...\n`,
      tags: ['new'],
      createdAt: new Date().toISOString(),
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setActiveView('note');
    showNotification(`Created new note: ${title}`);
  };

  const deleteNote = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const sendMessageToClaude = async (text: string) => {
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
          apiKey,
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
      };

      setChatMessages((prev) => [...prev, assistantMsg]);

      // If Claude suggested new nodes, expand the graph dynamically!
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
                color: rawNode.color || '#a78bfa',
                content: rawNode.content || `# ${rawNode.label}\n\nGenerated by Claude knowledge assistant.`,
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

        showNotification(`✨ Claude expanded your graph (+${data.expandedNodes.length} notes, +${data.newEdges?.length || 0} links)`);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `Error contacting Claude: ${err.message}. If you have an Anthropic API key, you can enter it in the top settings bar or in \`.env\`.`,
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
    setChatMessages([
      {
        id: `reset_${Date.now()}`,
        role: 'assistant',
        content: 'Vault restored to initial default state.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    showNotification('Restored default Obsidian vault');
  };

  return (
    <WorkspaceContext.Provider
      value={{
        nodes,
        edges,
        selectedNodeId,
        selectedNode,
        activeView,
        isClaudeOpen,
        isSidebarOpen,
        chatMessages,
        isChatLoading,
        graphPhysics,
        apiKey,
        statusNotification,
        selectNode,
        setActiveView,
        toggleClaude,
        toggleSidebar,
        sendMessageToClaude,
        updateNodeContent,
        createNote,
        deleteNote,
        setGraphPhysics,
        setApiKey,
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
