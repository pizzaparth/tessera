export interface NoteNode {
  id: string;
  label: string;
  folder: string;
  content: string;
  tags?: string[];
  color?: string;
  createdAt?: string;
  updatedAt?: string;
  x?: number;
  y?: number;
}

export interface NoteEdge {
  id: string;
  source: string;
  target: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  expandedNodes?: {
    id: string;
    label: string;
    folder: string;
  }[];
}

export interface VaultFile {
  id: string;
  title: string;
  folder: string;
  path: string;
}

export interface GraphPhysicsSettings {
  nodeSize: number;
  linkDistance: number;
  repelForce: number;
  showOrphans: boolean;
  filterFolder: string | 'all';
}
