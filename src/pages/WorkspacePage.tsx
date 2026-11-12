import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace, WorkspaceTab } from '../context/WorkspaceContext';
import { CytoscapeGraph } from '../components/graph/CytoscapeGraph';
import { ConceptDetailPanel } from '../components/graph/ConceptDetailPanel';
import { MarkdownEditor } from '../components/notes/MarkdownEditor';
import { ConversationMapper } from '../components/mapper/ConversationMapper';
import { ExtractionReview } from '../components/review/ExtractionReview';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { ResearchSynthesis } from '../components/synthesis/ResearchSynthesis';
import { ApiKeyModal } from '../components/modals/ApiKeyModal';
import { AddConnectionModal } from '../components/modals/AddConnectionModal';
import { SessionInfoModal } from '../components/modals/SessionInfoModal';
import { CONCEPT_TYPE_CONFIG, DOMAIN_COLORS } from '../utils/visualEncoding';
import { ConceptDomain, ConceptType } from '../types';
import {
  GitBranch,
  Layers,
  Sparkles,
  FileText,
  Activity,
  Key,
  ShieldAlert,
  RotateCcw,
  Search,
  Filter,
  ArrowRight,
  Plus,
  Home,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  BookOpen,
} from 'lucide-react';

export const WorkspacePage: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    nodes,
    edges,
    selectedNode,
    selectNode,
    filters,
    setFilters,
    resetFilters,
    apiKey,
    aiProvider,
    reviewQueue,
    resetWorkspace,
  } = useWorkspace();

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAddConnModalOpen, setIsAddConnModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isLocalGraphView, setIsLocalGraphView] = useState(false);

  const pendingCount = reviewQueue.filter((s) => s.status === 'pending').length;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      {/* 1. Global Navigation Bar */}
      <header className="h-14 border-b border-surface-border bg-surface-elevated px-4 flex items-center justify-between gap-4 flex-shrink-0 z-30">
        {/* Left: Logo & Home Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
            title="Return to Landing Page"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#07090e] rounded-[5px] flex items-center justify-center">
                <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            <span className="font-mono text-sm font-bold tracking-wider text-white hidden sm:inline">
              TESSERA
            </span>
          </Link>

          <span className="text-slate-600 text-xs hidden sm:inline">/</span>

          {/* Navigation View Switcher Tabs */}
          <nav className="flex items-center bg-[#07090e] border border-surface-border rounded-lg p-0.5 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'graph'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('mapper')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'mapper'
                  ? 'bg-purple-500/20 text-purple-300 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mapper</span>
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition whitespace-nowrap relative ${
                activeTab === 'review'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Review</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center font-mono">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'notes'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-blue-500/20 text-blue-300 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('synthesis')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'synthesis'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Synthesis</span>
            </button>
          </nav>
        </div>

        {/* Right: Actions, API Key, Session Info & Reset */}
        <div className="flex items-center gap-2">
          {/* API Key Status Pill */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition font-mono ${
              apiKey
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
            }`}
            title="Configure session API key"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {apiKey ? `${aiProvider.toUpperCase()}: Live` : 'Guided Mode'}
            </span>
          </button>

          {/* Stateless Session Badge */}
          <button
            onClick={() => setIsSessionModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-surface-card hover:bg-surface border border-surface-border text-xs text-amber-300/90 flex items-center gap-1.5 transition font-mono hidden md:flex"
            title="Session status and stateless architecture explanation"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Stateless Memory</span>
          </button>

          {/* Quick Reset Button */}
          <button
            onClick={() => {
              if (confirm('Discard all temporary edits and restore the clean sample research graph?')) {
                resetWorkspace();
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-surface-border transition"
            title="Reset workspace to clean sample state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Dynamic View Body */}
      <main className="flex-1 overflow-hidden p-3 bg-[#05070c]">
        {/* Tab 1: Overview Screen */}
        {activeTab === 'overview' && (
          <div className="h-full flex flex-col bg-surface border border-surface-border rounded-xl overflow-y-auto p-6 space-y-6">
            {/* Top Prompt Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-surface-card via-surface to-[#0e131f] border border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Active Quantitative Research Session</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Volatile Browser Memory
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Investigating Factor Premia, Market Microstructure & Execution Drag
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
                Explore how cross-sectional momentum, Kyle’s lambda price impact, survivorship bias, and Almgren-Chriss liquidation schedules interconnect. Extract new ideas or inspect existing formulas.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                onClick={() => setActiveTab('graph')}
                className="p-4 rounded-xl bg-surface-card border border-surface-border hover:border-emerald-500/40 cursor-pointer transition space-y-1"
              >
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Active Concepts
                </span>
                <div className="text-2xl font-bold font-mono text-white">{nodes.length}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span>Explore Graph</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab('graph')}
                className="p-4 rounded-xl bg-surface-card border border-surface-border hover:border-cyan-500/40 cursor-pointer transition space-y-1"
              >
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Typed Relationships
                </span>
                <div className="text-2xl font-bold font-mono text-cyan-300">{edges.length}</div>
                <div className="text-[11px] text-cyan-400 flex items-center gap-1">
                  <span>Inspect Links</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab('mapper')}
                className="p-4 rounded-xl bg-surface-card border border-surface-border hover:border-purple-500/40 cursor-pointer transition space-y-1"
              >
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Conversation Mapper
                </span>
                <div className="text-2xl font-bold font-mono text-purple-300">
                  {pendingCount} Pending
                </div>
                <div className="text-[11px] text-purple-400 flex items-center gap-1">
                  <span>Map Text</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab('analytics')}
                className="p-4 rounded-xl bg-surface-card border border-surface-border hover:border-amber-500/40 cursor-pointer transition space-y-1"
              >
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Graph Analytics
                </span>
                <div className="text-2xl font-bold font-mono text-amber-300">
                  {Object.keys(DOMAIN_COLORS).length} Domains
                </div>
                <div className="text-[11px] text-amber-400 flex items-center gap-1">
                  <span>View Metrics</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Recently Explored Concepts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Quantitative Concepts in Memory</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Click any concept to open note or view neighborhood
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {nodes.map((node) => {
                  const typeCfg = CONCEPT_TYPE_CONFIG[node.type];
                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        selectNode(node.id);
                        setActiveTab('graph');
                      }}
                      className="p-3.5 rounded-xl bg-surface-card hover:bg-surface border border-surface-border hover:border-slate-500 cursor-pointer transition space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold border"
                          style={{
                            backgroundColor: typeCfg.bgColor,
                            borderColor: typeCfg.borderColor,
                            color: typeCfg.color,
                          }}
                        >
                          {typeCfg.label}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {node.domain}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{node.label}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {node.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Global Graph Explorer & Local Detail Panel */}
        {activeTab === 'graph' && (
          <div className="h-full flex flex-col space-y-2">
            {/* Search & Filter Bar */}
            <div className="p-2.5 bg-surface-elevated border border-surface-border rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
                {/* Search query input */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ searchQuery: e.target.value })}
                    placeholder="Search concepts, models, formulas..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#080b12] text-slate-200 border border-surface-border focus:border-cyan-500 outline-none text-xs"
                  />
                </div>

                {/* Domain filter dropdown */}
                <select
                  value={filters.selectedDomains[0] || ''}
                  onChange={(e) =>
                    setFilters({
                      selectedDomains: e.target.value ? [e.target.value as ConceptDomain] : [],
                    })
                  }
                  className="p-1.5 rounded-lg bg-[#080b12] text-slate-300 border border-surface-border outline-none"
                >
                  <option value="">All Domains</option>
                  {Object.keys(DOMAIN_COLORS).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                {/* Type filter dropdown */}
                <select
                  value={filters.selectedTypes[0] || ''}
                  onChange={(e) =>
                    setFilters({
                      selectedTypes: e.target.value ? [e.target.value as ConceptType] : [],
                    })
                  }
                  className="p-1.5 rounded-lg bg-[#080b12] text-slate-300 border border-surface-border outline-none"
                >
                  <option value="">All Types</option>
                  {Object.entries(CONCEPT_TYPE_CONFIG).map(([tKey, cfg]) => (
                    <option key={tKey} value={tKey}>
                      {cfg.label}
                    </option>
                  ))}
                </select>

                {(filters.searchQuery || filters.selectedDomains.length > 0 || filters.selectedTypes.length > 0) && (
                  <button
                    onClick={resetFilters}
                    className="text-slate-400 hover:text-white underline text-[11px]"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {/* Local vs Global toggle & Add Link */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLocalGraphView(!isLocalGraphView)}
                  className={`px-2.5 py-1 rounded-lg border transition ${
                    isLocalGraphView
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                      : 'bg-surface-card border-surface-border text-slate-400 hover:text-slate-200'
                  }`}
                  title="Toggle Local Ego Network vs Global Graph"
                >
                  {isLocalGraphView ? 'Local View' : 'Global View'}
                </button>

                <button
                  onClick={() => setIsAddConnModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>
            </div>

            {/* Split Graph & Detail Drawer */}
            <div className="flex-1 flex flex-col lg:flex-row gap-3 overflow-hidden">
              <div className="flex-1 h-full min-h-[350px]">
                <CytoscapeGraph
                  isLocalView={isLocalGraphView}
                  onOpenNote={() => setActiveTab('notes')}
                />
              </div>

              {selectedNode && (
                <div className="w-full lg:w-96 h-80 lg:h-full flex-shrink-0">
                  <ConceptDetailPanel
                    onOpenNote={() => setActiveTab('notes')}
                    onAddConnection={() => setIsAddConnModalOpen(true)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Conversation Mapper */}
        {activeTab === 'mapper' && (
          <ConversationMapper
            onOpenReview={() => setActiveTab('review')}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        )}

        {/* Tab 4: Extraction Review Queue */}
        {activeTab === 'review' && (
          <ExtractionReview onBackToGraph={() => setActiveTab('graph')} />
        )}

        {/* Tab 5: Markdown Notes Editor */}
        {activeTab === 'notes' && (
          <MarkdownEditor onBackToGraph={() => setActiveTab('graph')} />
        )}

        {/* Tab 6: Graph Analytics */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {/* Tab 7: Research Synthesis Composer */}
        {activeTab === 'synthesis' && <ResearchSynthesis />}
      </main>

      {/* Global Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <AddConnectionModal
        isOpen={isAddConnModalOpen}
        onClose={() => setIsAddConnModalOpen(false)}
      />

      <SessionInfoModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
      />
    </div>
  );
};
