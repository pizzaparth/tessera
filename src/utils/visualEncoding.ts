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
    color: '#00f5a0',
    bgColor: 'rgba(0, 245, 160, 0.1)',
    borderColor: 'rgba(0, 245, 160, 0.4)',
    textColor: '#00f5a0',
    iconName: 'Wrench',
  },
  model: {
    label: 'Model',
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    textColor: '#38bdf8',
    iconName: 'Layers',
  },
  dataset: {
    label: 'Dataset',
    color: '#818cf8',
    bgColor: 'rgba(129, 140, 248, 0.1)',
    borderColor: 'rgba(129, 140, 248, 0.4)',
    textColor: '#818cf8',
    iconName: 'Database',
  },
  instrument: {
    label: 'Instrument',
    color: '#2dd4bf',
    bgColor: 'rgba(45, 212, 191, 0.1)',
    borderColor: 'rgba(45, 212, 191, 0.4)',
    textColor: '#2dd4bf',
    iconName: 'Coins',
  },
  metric: {
    label: 'Metric',
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.4)',
    textColor: '#fbbf24',
    iconName: 'Activity',
  },
  hypothesis: {
    label: 'Hypothesis',
    color: '#f43f5e',
    bgColor: 'rgba(244, 63, 94, 0.1)',
    borderColor: 'rgba(244, 63, 94, 0.4)',
    textColor: '#f43f5e',
    iconName: 'Sparkles',
  },
  source: {
    label: 'Source',
    color: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.1)',
    borderColor: 'rgba(148, 163, 184, 0.4)',
    textColor: '#94a3b8',
    iconName: 'BookOpen',
  },
  research_question: {
    label: 'Question',
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.1)',
    borderColor: 'rgba(234, 179, 8, 0.4)',
    textColor: '#eab308',
    iconName: 'HelpCircle',
  },
};

export const RELATIONSHIP_CONFIG: Record<
  RelationshipType,
  { label: string; lineStyle: 'solid' | 'dashed' | 'dotted'; color: string }
> = {
  depends_on: { label: 'depends on', lineStyle: 'solid', color: '#38bdf8' },
  extends: { label: 'extends', lineStyle: 'solid', color: '#00f5a0' },
  measures: { label: 'measures', lineStyle: 'solid', color: '#fbbf24' },
  uses_data_from: { label: 'uses data from', lineStyle: 'solid', color: '#818cf8' },
  supports: { label: 'supports', lineStyle: 'solid', color: '#10b981' },
  challenges: { label: 'challenges', lineStyle: 'dashed', color: '#f97316' },
  contradicts: { label: 'contradicts', lineStyle: 'dashed', color: '#ef4444' },
  related_to: { label: 'related to', lineStyle: 'dotted', color: '#64748b' },
};

export const DOMAIN_COLORS: Record<ConceptDomain, string> = {
  'Factor Research': '#38bdf8',
  'Market Microstructure': '#00f5a0',
  'Portfolio Construction': '#818cf8',
  'Time Series & Econometrics': '#fbbf24',
  'Risk Management': '#f43f5e',
  'Execution & Trading': '#2dd4bf',
};
