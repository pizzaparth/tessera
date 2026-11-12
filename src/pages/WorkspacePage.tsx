import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { CytoscapeGraph } from '../components/graph/CytoscapeGraph';
import { ConceptDetailPanel } from '../components/graph/ConceptDetailPanel';
import { MarkdownEditor } from '../components/notes/MarkdownEditor';
import { ConversationMapper } from '../components/mapper/ConversationMapper';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { ApiKeyModal } from '../components/modals/ApiKeyModal';
import { AddConnectionModal } from '../components/modals/AddConnectionModal';
import { SessionInfoModal } from '../components/modals/SessionInfoModal';
import { CONCEPT_TYPE_CONFIG, DOMAIN_COLORS } from '../utils/visualEncoding';
import { ConceptDomain, ConceptType } from '../types';
import {
  GitBranch,
  Sparkles,
  FileText,
  Activity,
  Key,
  ShieldCheck,
  RotateCcw,
  Search,
  Filter,
  Eye,
  CheckCircle,
  HelpCircle,
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showNoteInSplit, setShowNoteInSplit] = useState(false);

  const pendingCount = reviewQueue.filter((s) => s.status === 'pending').length;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#faf9fc] text-slate-900 overflow-hidden font-sans">
      {/* 1. Global Navigation Bar */}
      <header className="h-14 border-b border-slate-200/90 bg-white px-4 sm:px-6 flex items-center justify-between gap-4 flex-shrink-0 z-30 shadow-xs">
        {/* Left: Logo & Nav Tabs */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-600 hover:text-slate-900 transition group"
            title="Return to Landing Page"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
              <GitBranch className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900">
                TESSERA
              </span>
              <span className="text-[10px] text-slate-400 -mt-0.5 font-medium hidden sm:inline">
                Knowledge Map
              </span>
            </div>
          </Link>

          <span className="text-slate-200 text-sm hidden sm:inline">|</span>

          {/* Navigation View Switcher Tabs */}
          <nav className="flex items-center bg-slate-100/90 border border-slate-200/80 rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                setActiveTab('graph');
                setShowNoteInSplit(false);
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium whitespace-nowrap ${
                activeTab === 'graph' && !showNoteInSplit
                  ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Graph View</span>
            </button>

            <button
              onClick={() => setActiveTab('mapper')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium whitespace-nowrap relative ${
                activeTab === 'mapper'
                  ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Mapper</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('notes');
                setShowNoteInSplit(false);
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium whitespace-nowrap ${
                activeTab === 'notes' || showNoteInSplit
                  ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Markdown Note</span>
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium whitespace-nowrap ${
                activeTab === 'insights' || activeTab === 'analytics'
                  ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              <span>Graph Insights</span>
            </button>
          </nav>
        </div>

        {/* Right: API Key, Session Info & Reset */}
        <div className="flex items-center gap-2">
          {/* API Key Status Pill */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition font-medium ${
              apiKey
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Configure session API key"
          >
            <Key className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">
              {apiKey ? `${aiProvider.toUpperCase()}: Live` : 'Guided Demo'}
            </span>
          </button>

          {/* Stateless Session Badge */}
          <button
            onClick={() => setIsSessionModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-1.5 transition font-medium hidden md:flex shadow-2xs"
            title="Session status and stateless architecture explanation"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>In-Memory</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={() => {
              if (confirm('Restore the default sample graph? All in-session edits will be reset.')) {
                resetWorkspace();
              }
            }}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            title="Reset to default sample graph"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Main Content Canvas */}
      <main className="flex-1 flex overflow-hidden p-3 gap-3">
        {/* GRAPH TAB */}
        {activeTab === 'graph' && !showNoteInSplit && (
          <div className="flex-1 flex flex-col min-w-0 h-full gap-3">
            {/* Top Filter and Search Bar */}
            <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-subtle flex-shrink-0">
              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 flex-1 max-w-sm text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search concepts by name, domain, or summary..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ searchQuery: e.target.value })}
                  className="bg-transparent text-slate-800 placeholder-slate-400 outline-none w-full text-xs"
                />
                {filters.searchQuery && (
                  <button
                    onClick={() => setFilters({ searchQuery: '' })}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* View & Filter Toggles */}
              <div className="flex items-center gap-2">
                {/* Local Graph View Toggle */}
                <button
                  onClick={() => setIsLocalGraphView(!isLocalGraphView)}
                  className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition ${
                    isLocalGraphView
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Toggle 1-hop neighborhood local graph view"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isLocalGraphView ? 'Local View' : 'Global Map'}</span>
                </button>

                {/* Filter Drawer Toggle */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition ${
                    isFilterOpen || filters.selectedDomains.length > 0 || filters.selectedTypes.length > 0
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                  {(filters.selectedDomains.length > 0 || filters.selectedTypes.length > 0) && (
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                      {filters.selectedDomains.length + filters.selectedTypes.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter Drawer (if open) */}
            {isFilterOpen && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-subtle flex flex-col gap-3 flex-shrink-0 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Filter Graph Elements</span>
                  <button
                    onClick={resetFilters}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Domains */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase text-slate-500">
                      Domains
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(Object.keys(DOMAIN_COLORS) as ConceptDomain[]).map((dom) => {
                        const isSelected = filters.selectedDomains.includes(dom);
                        return (
                          <button
                            key={dom}
                            onClick={() => {
                              const updated = isSelected
                                ? filters.selectedDomains.filter((d) => d !== dom)
                                : [...filters.selectedDomains, dom];
                              setFilters({ selectedDomains: updated });
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {dom}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Types */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase text-slate-500">
                      Concept Types
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(Object.keys(CONCEPT_TYPE_CONFIG) as ConceptType[]).slice(0, 6).map((tp) => {
                        const isSelected = filters.selectedTypes.includes(tp);
                        const cfg = CONCEPT_TYPE_CONFIG[tp];
                        return (
                          <button
                            key={tp}
                            onClick={() => {
                              const updated = isSelected
                                ? filters.selectedTypes.filter((t) => t !== tp)
                                : [...filters.selectedTypes, tp];
                              setFilters({ selectedTypes: updated });
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                            <span>{cfg.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Graph Canvas */}
            <div className="flex-1 min-h-0 relative">
              <CytoscapeGraph
                isLocalView={isLocalGraphView}
                onOpenNote={() => setShowNoteInSplit(true)}
              />
            </div>
          </div>
        )}

        {/* SPLIT GRAPH + NOTE VIEW */}
        {activeTab === 'graph' && showNoteInSplit && (
          <div className="flex-1 flex min-w-0 h-full gap-3">
            <div className="w-1/2 h-full">
              <CytoscapeGraph isLocalView={isLocalGraphView} />
            </div>
            <div className="w-1/2 h-full">
              <MarkdownEditor onBackToGraph={() => setShowNoteInSplit(false)} />
            </div>
          </div>
        )}

        {/* CONVERSATION MAPPER TAB */}
        {activeTab === 'mapper' && (
          <div className="flex-1 h-full min-w-0">
            <ConversationMapper
              onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              onNavigateToGraph={() => setActiveTab('graph')}
            />
          </div>
        )}

        {/* DEDICATED MARKDOWN NOTE TAB */}
        {activeTab === 'notes' && (
          <div className="flex-1 h-full min-w-0">
            <MarkdownEditor onBackToGraph={() => setActiveTab('graph')} />
          </div>
        )}

        {/* GRAPH INSIGHTS TAB */}
        {(activeTab === 'insights' || activeTab === 'analytics') && (
          <div className="flex-1 h-full min-w-0">
            <AnalyticsDashboard />
          </div>
        )}

        {/* RIGHT DETAIL PANEL (when in graph view and split note isn't open) */}
        {activeTab === 'graph' && !showNoteInSplit && (
          <aside className="w-80 lg:w-96 flex-shrink-0 h-full hidden md:block">
            <ConceptDetailPanel
              onOpenNote={() => setShowNoteInSplit(true)}
              onAddConnection={() => setIsAddConnModalOpen(true)}
            />
          </aside>
        )}
      </main>

      {/* Modals */}
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
        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
      />
    </div>
  );
};
