import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { DOMAIN_COLORS, CONCEPT_TYPE_CONFIG } from '../../utils/visualEncoding';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Activity,
  Layers,
  Network,
  Share2,
  Route,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Compass,
  Zap,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { analytics, nodes, edges, selectNode, setActiveTab } = useWorkspace();

  const [pathSource, setPathSource] = useState<string>(nodes[0]?.id || '');
  const [pathTarget, setPathTarget] = useState<string>(nodes[nodes.length - 1]?.id || '');

  // Prepare data for domain distribution chart
  const domainChartData = Object.entries(analytics.domainDistribution).map(([domain, count]) => ({
    domain,
    count,
    color: DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS] || '#38bdf8',
  }));

  // Prepare data for concept type distribution chart
  const typeChartData = Object.entries(analytics.typeDistribution).map(([type, count]) => ({
    name: CONCEPT_TYPE_CONFIG[type as keyof typeof CONCEPT_TYPE_CONFIG]?.label || type,
    value: count,
    color: CONCEPT_TYPE_CONFIG[type as keyof typeof CONCEPT_TYPE_CONFIG]?.color || '#64748b',
  }));

  // Calculate shortest path between pathSource and pathTarget (BFS)
  const calculateShortestPath = (startId: string, endId: string) => {
    if (!startId || !endId || startId === endId) return [];

    const queue: string[][] = [[startId]];
    const visited = new Set<string>([startId]);

    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1];

      if (current === endId) {
        return path;
      }

      // Find neighbors
      const neighbors: string[] = [];
      edges.forEach((e) => {
        if (e.source === current && !visited.has(e.target)) neighbors.push(e.target);
        if (e.target === current && !visited.has(e.source)) neighbors.push(e.source);
      });

      for (const n of neighbors) {
        visited.add(n);
        queue.push([...path, n]);
      }
    }

    return [];
  };

  const activePath = calculateShortestPath(pathSource, pathTarget);

  return (
    <div className="h-full flex flex-col bg-surface border border-surface-border rounded-xl overflow-hidden shadow-2xl">
      {/* Top Banner */}
      <div className="p-4 border-b border-surface-border bg-surface-elevated flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Quantitative Knowledge Graph Analytics</span>
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Descriptive Measures
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Topology summary, domain clusters, degree centrality, and bridge concepts across your active session.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg max-w-md">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-[11px]">
            Descriptive topology only. High centrality reflects graph structure, not investment performance or alpha predictability.
          </span>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Concepts</span>
            </span>
            <div className="text-2xl font-bold font-mono text-white">
              {analytics.nodeCount}
            </div>
            <div className="text-[11px] text-slate-500">In-memory active nodes</div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Typed Links</span>
            </span>
            <div className="text-2xl font-bold font-mono text-cyan-300">
              {analytics.edgeCount}
            </div>
            <div className="text-[11px] text-slate-500">Explicit typed relationships</div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-purple-400" />
              <span>Network Density</span>
            </span>
            <div className="text-2xl font-bold font-mono text-purple-300">
              {analytics.density}
            </div>
            <div className="text-[11px] text-slate-500">Edge-to-potential ratio</div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Bridge Nodes</span>
            </span>
            <div className="text-2xl font-bold font-mono text-amber-300">
              {analytics.bridgeNodes.length}
            </div>
            <div className="text-[11px] text-slate-500">Cross-domain connectors</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Domain Distribution Bar Chart */}
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Domain Cluster Breakdown</span>
              <span className="text-[10px] text-slate-500 font-mono">Count by Sub-field</span>
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainChartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <XAxis type="number" stroke="#475569" fontSize={11} />
                  <YAxis type="category" dataKey="domain" stroke="#94a3b8" fontSize={10} width={130} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c101a',
                      borderColor: '#1f2738',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]}>
                    {domainChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Concept Type Distribution Donut Chart */}
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Concept Type Distribution</span>
              <span className="text-[10px] text-slate-500 font-mono">Typological Ratio</span>
            </h3>
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c101a',
                      borderColor: '#1f2738',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center text-[11px]">
              {typeChartData.map((t) => (
                <div key={t.name} className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-slate-300">{t.name}:</span>
                  <span className="font-mono text-white font-semibold">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Structural Rankings Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Central Hubs */}
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2.5">
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
              <span>Central Concept Hubs (Degree)</span>
              <span className="text-[10px] text-slate-500">Direct connections</span>
            </h3>
            <div className="space-y-1.5">
              {analytics.topCentralNodes.map((node, i) => (
                <div
                  key={node.id}
                  onClick={() => {
                    selectNode(node.id);
                    setActiveTab('graph');
                  }}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface hover:bg-surface-elevated border border-surface-border cursor-pointer transition text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-cyan-400 text-[11px] font-bold w-4">#{i + 1}</span>
                    <span className="text-slate-200 font-medium truncate">{node.label}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-slate-500">{node.domain}</span>
                    <span className="font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
                      {node.degree} links
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Domain Bridge Concepts */}
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2.5">
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>Domain Bridge Concepts</span>
              <span className="text-[10px] text-slate-500">Cross-field links</span>
            </h3>
            <div className="space-y-1.5">
              {analytics.bridgeNodes.length > 0 ? (
                analytics.bridgeNodes.map((node, i) => (
                  <div
                    key={node.id}
                    onClick={() => {
                      selectNode(node.id);
                      setActiveTab('graph');
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface hover:bg-surface-elevated border border-surface-border cursor-pointer transition text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-amber-400 text-[11px] font-bold w-4">#{i + 1}</span>
                      <span className="text-slate-200 font-medium truncate">{node.label}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-slate-500">{node.domain}</span>
                      <span className="font-mono text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded text-[11px]">
                        {node.betweenness} bridges
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic p-3">No cross-domain bridges detected.</p>
              )}
            </div>
          </div>
        </div>

        {/* Shortest Path Explorer */}
        <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Route className="w-4 h-4 text-cyan-400" />
              <span>Quantitative Path Explorer</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              Calculate shortest connection chain between any two concepts
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs">
            <select
              value={pathSource}
              onChange={(e) => setPathSource(e.target.value)}
              className="w-full sm:w-1/2 p-2 rounded bg-surface border border-surface-border text-slate-200 outline-none"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  From: {n.label}
                </option>
              ))}
            </select>

            <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0 hidden sm:block" />

            <select
              value={pathTarget}
              onChange={(e) => setPathTarget(e.target.value)}
              className="w-full sm:w-1/2 p-2 rounded bg-surface border border-surface-border text-slate-200 outline-none"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  To: {n.label}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-[#080b12] border border-surface-border rounded-lg text-xs">
            {activePath.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-emerald-400 font-semibold font-mono text-[11px]">
                  Path ({activePath.length} steps):
                </span>
                {activePath.map((nodeId, idx) => {
                  const node = nodes.find((n) => n.id === nodeId);
                  return (
                    <React.Fragment key={nodeId}>
                      <button
                        onClick={() => {
                          selectNode(nodeId);
                          setActiveTab('graph');
                        }}
                        className="font-medium text-slate-200 hover:text-cyan-300 underline decoration-dotted"
                      >
                        {node?.label || nodeId}
                      </button>
                      {idx < activePath.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              <span className="text-slate-500 italic">
                No direct path found between the selected concepts in the current graph.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
