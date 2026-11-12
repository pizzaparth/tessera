export type ConceptType =
  | 'method'
  | 'model'
  | 'dataset'
  | 'instrument'
  | 'metric'
  | 'hypothesis'
  | 'source'
  | 'research_question';

export type RelationshipType =
  | 'depends_on'
  | 'extends'
  | 'measures'
  | 'uses_data_from'
  | 'supports'
  | 'challenges'
  | 'contradicts'
  | 'related_to';

export type ConceptDomain =
  | 'Factor Research'
  | 'Market Microstructure'
  | 'Portfolio Construction'
  | 'Time Series & Econometrics'
  | 'Risk Management'
  | 'Execution & Trading';

export interface Provenance {
  source: string;
  excerpt?: string;
  origin: 'ai_suggested' | 'researcher_authored' | 'sample_dataset';
  confidence?: number;
  createdAt: string;
}

export interface NodeVersion {
  id: string;
  timestamp: string;
  change: string;
  author: string;
  contentSnapshot?: string;
}

export interface ConceptNode {
  id: string;
  label: string;
  type: ConceptType;
  domain: ConceptDomain;
  summary: string;
  definition: string;
  equations?: string[];
  assumptions?: string[];
  markdownContent: string;
  provenance: Provenance;
  versions?: NodeVersion[];
  x?: number;
  y?: number;
}

export interface ConceptEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  label: string;
  description?: string;
  provenance: Provenance;
}

export interface ExtractionSuggestion {
  id: string;
  label: string;
  type: ConceptType;
  domain: ConceptDomain;
  summary: string;
  confidence: number;
  excerpt: string;
  suggestedEdges: {
    targetId: string;
    type: RelationshipType;
    label: string;
  }[];
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ExtractionResult {
  summary: string;
  concepts: ExtractionSuggestion[];
  claims: string[];
  openQuestions: string[];
  assumptions: string[];
}

export type AIProvider = 'openai' | 'anthropic' | 'gemini';

export interface FilterState {
  searchQuery: string;
  selectedDomains: ConceptDomain[];
  selectedTypes: ConceptType[];
  selectedRelationships: RelationshipType[];
}

export interface GraphAnalytics {
  nodeCount: number;
  edgeCount: number;
  typeDistribution: Record<ConceptType, number>;
  domainDistribution: Record<ConceptDomain, number>;
  topCentralNodes: { id: string; label: string; degree: number; domain: ConceptDomain }[];
  bridgeNodes: { id: string; label: string; betweenness: number; domain: ConceptDomain }[];
  isolatedNodes: { id: string; label: string; domain: ConceptDomain }[];
  density: number;
}
