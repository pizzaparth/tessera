import { ConceptType, RelationshipType, ConceptDomain } from '../types';

export interface VisualTypeConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconName: string;
}

export const CONCEPT_TYPE_CONFIG: Record<ConceptType, VisualTypeConfig> = {
  method: {
    label: 'Method',
    color: '#059669', // mint / emerald
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    textColor: '#047857',
    iconName: 'Wrench',
  },
  model: {
    label: 'Model',
    color: '#6366f1', // distinctive indigo
    bgColor: '#eef2ff',
    borderColor: '#c7d2fe',
    textColor: '#4338ca',
    iconName: 'Layers',
  },
  dataset: {
    label: 'Dataset',
    color: '#0284c7', // sky blue
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
    textColor: '#0369a1',
    iconName: 'Database',
  },
  instrument: {
    label: 'Instrument',
    color: '#0d9488', // teal
    bgColor: '#f0fdfa',
    borderColor: '#99f6e4',
    textColor: '#0f766e',
    iconName: 'Coins',
  },
  metric: {
    label: 'Metric',
    color: '#d97706', // amber
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    textColor: '#b45309',
    iconName: 'Activity',
  },
  hypothesis: {
    label: 'Hypothesis',
    color: '#e11d48', // coral / rose
    bgColor: '#fff1f2',
    borderColor: '#fecdd3',
    textColor: '#be123c',
    iconName: 'Sparkles',
  },
  source: {
    label: 'Source',
    color: '#475569', // slate
    bgColor: '#f8fafc',
    borderColor: '#cbd5e1',
    textColor: '#334155',
    iconName: 'BookOpen',
  },
  research_question: {
    label: 'Question',
    color: '#7c3aed', // violet
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    textColor: '#6d28d9',
    iconName: 'HelpCircle',
  },
};

export const RELATIONSHIP_CONFIG: Record<
  RelationshipType,
  { label: string; lineStyle: 'solid' | 'dashed' | 'dotted'; color: string }
> = {
  depends_on: { label: 'depends on', lineStyle: 'solid', color: '#6366f1' },
  extends: { label: 'extends', lineStyle: 'solid', color: '#059669' },
  measures: { label: 'measures', lineStyle: 'solid', color: '#d97706' },
  uses_data_from: { label: 'uses data from', lineStyle: 'solid', color: '#0284c7' },
  supports: { label: 'supports', lineStyle: 'solid', color: '#10b981' },
  challenges: { label: 'challenges', lineStyle: 'dashed', color: '#f97316' },
  contradicts: { label: 'contradicts', lineStyle: 'dashed', color: '#e11d48' },
  related_to: { label: 'related to', lineStyle: 'dotted', color: '#64748b' },
};

export const DOMAIN_COLORS: Record<ConceptDomain, string> = {
  'Factor Research': '#6366f1',
  'Market Microstructure': '#059669',
  'Portfolio Construction': '#7c3aed',
  'Time Series & Econometrics': '#d97706',
  'Risk Management': '#e11d48',
  'Execution & Trading': '#0284c7',
};
