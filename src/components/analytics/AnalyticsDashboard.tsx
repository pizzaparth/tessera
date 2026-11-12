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
  Route,
  ArrowRight,
  Info,
  GitBranch,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { analytics, nodes, edges, selectNode, setActiveTab } = useWorkspace();

  const [pathSource, setPathSource] = useState<string>(nodes[0]?.id || '');
  const [pathTarget, setPathTarget] = useState<string>(nodes[nodes.length - 1]?.id || '');

  // Prepare data for domain distribution chart
  const domainChartData = Object.entries(analytics.domainDistribution).map(([domain, count]) => ({
    domain,
    count,
    color: DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS] || '#6366f1',
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
    <div className="h-full flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-subtle">
      {/* Top Banner */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Graph Insights & Structural Measures
            </h2>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Subtle Quant Touch
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structural topology of the current map: counts, clusters, connected concepts, bridge concepts, and paths.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl max-w-md">
          <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <span className="text-[11px] leading-snug">
            These measures describe the structure of the current map; they do not claim that an idea is true simply because it has many links.
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="text-2xl font-bold text-indigo-600 font-mono">
              {analytics.nodeCount}
            </div>
            <div className="text-xs font-semibold text-slate-800">Concepts</div>
            <div className="text-[11px] text-slate-500">Active nodes in memory</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="text-2xl font-bold text-emerald-600 font-mono">
              {analytics.edgeCount}
            </div>
            <div className="text-xs font-semibold text-slate-800">Connections</div>
            <div className="text-[11px] text-slate-500">Explicit typed links</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="text-2xl font-bold text-violet-600 font-mono">
              {Object.keys(analytics.domainDistribution).length}
            </div>
            <div className="text-xs font-semibold text-slate-800">Clusters</div>
            <div className="text-[11px] text-slate-500">Domain categories</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="text-2xl font-bold text-amber-600 font-mono">
              {(analytics.density * 100).toFixed(1)}%
            </div>
            <div className="text-xs font-semibold text-slate-800">Graph Density</div>
            <div className="text-[11px] text-slate-500">Actual vs max edges</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cluster Distribution */}
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cluster Distribution</h3>
                <p className="text-xs text-slate-500">Number of concepts per domain cluster</p>
              </div>
              <Layers className="w-4 h-4 text-indigo-500" />
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={domainChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="domain"
                    stroke="#64748b"
                    fontSize={10}
                    width={110}
                    tickFormatter={(val) => val.split(' ')[0]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      color: '#0f172a',
                      fontSize: '11px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {domainChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Concept Typology */}
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Concept Typology</h3>
                <p className="text-xs text-slate-500">Models, methods, hypotheses, metrics</p>
              </div>
              <Network className="w-4 h-4 text-indigo-500" />
            </div>

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
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      color: '#0f172a',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Central Hubs & Bridge Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Central Hubs */}
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Highly Connected Concepts</h3>
                <p className="text-xs text-slate-500">Nodes with the highest degree of connections</p>
              </div>
              <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-semibold">
                Degree Centrality
              </span>
            </div>

            <div className="space-y-2">
              {analytics.topCentralNodes.map((node, i) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-600">
                      {i + 1}
                    </span>
                    <button
                      onClick={() => {
                        selectNode(node.id);
                        setActiveTab('graph');
                      }}
                      className="font-medium text-slate-800 hover:text-indigo-600 truncate text-left"
                    >
                      {node.label}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-slate-500">{node.domain}</span>
                    <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                      {node.degree} links
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bridge Concepts */}
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Bridge Concepts</h3>
                <p className="text-xs text-slate-500">Nodes bridging distinct domain clusters</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                Cross-Cluster
              </span>
            </div>

            <div className="space-y-2">
              {analytics.bridgeNodes.map((node, i) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-600">
                      {i + 1}
                    </span>
                    <button
                      onClick={() => {
                        selectNode(node.id);
                        setActiveTab('graph');
                      }}
                      className="font-medium text-slate-800 hover:text-emerald-700 truncate text-left"
                    >
                      {node.label}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-slate-500">{node.domain}</span>
                    <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {node.betweenness} bridges
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Path Explorer Between Ideas */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Connection Path Finder</h3>
              <p className="text-xs text-slate-500">
                Trace the chain of relationships connecting any two concepts
              </p>
            </div>
            <Route className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Start Concept</label>
              <select
                value={pathSource}
                onChange={(e) => setPathSource(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.domain})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Target Concept</label>
              <select
                value={pathTarget}
                onChange={(e) => setPathTarget(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.domain})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activePath.length > 0 ? (
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-indigo-900 flex items-center justify-between">
                <span>Shortest Path: {activePath.length - 1} hops ({activePath.length} concepts)</span>
                <button
                  onClick={() => {
                    selectNode(pathSource);
                    setActiveTab('graph');
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>View in Graph</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {activePath.map((nodeId, idx) => {
                  const node = nodes.find((n) => n.id === nodeId);
                  return (
                    <React.Fragment key={nodeId}>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs">
                        {node?.label || nodeId}
                      </span>
                      {idx < activePath.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-indigo-400" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 text-center">
              No direct or indirect connection found between the selected concepts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
