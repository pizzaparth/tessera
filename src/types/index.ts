export type AIProvider = 'anthropic' | 'openai' | 'gemini' | 'deepseek' | 'custom';

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
  vx?: number;
  vy?: number;
}

export interface NoteEdge {
  id: string;
  source: string;
  target: string;
}

export interface ColorGroup {
  id: string;
  query: string;
  color: string;
}

export interface GraphEngineSettings {
  // 1. Filters
  searchQuery: string;
  showOrphans: boolean;
  showTags: boolean;

  // 2. Color Groups
  groups: ColorGroup[];

  // 3. Display
  nodeSizeMultiplier: number;
  linkThickness: number;
  textFadeThreshold: number;
  showArrows: boolean;

  // 4. Forces (Physics)
  centerForce: number;
  repelForce: number;
  linkForce: number;
  linkDistance: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  provider?: AIProvider;
  /** True when the server answered with its built-in demo generator */
  isSimulated?: boolean;
  isError?: boolean;
  expandedNodes?: {
    id: string;
    label: string;
    folder: string;
    color?: string;
    content?: string;
  }[];
}
