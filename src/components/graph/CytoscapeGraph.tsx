import React, { useEffect, useRef, useState, useMemo } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { useWorkspace } from '../../context/WorkspaceContext';
import { CONCEPT_TYPE_CONFIG, RELATIONSHIP_CONFIG, DOMAIN_COLORS } from '../../utils/visualEncoding';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Layers,
  Compass,
  Filter,
  Eye,
  Route,
  Info,
} from 'lucide-react';

interface CytoscapeGraphProps {
  isLocalView?: boolean;
  onOpenNote?: () => void;
}

export const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({
  isLocalView = false,
  onOpenNote,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const { nodes, edges, selectedNodeId, selectNode, filters } = useWorkspace();

  const [layoutName, setLayoutName] = useState<'cose' | 'concentric' | 'circle' | 'breadthfirst' | 'grid'>('cose');
  const [showEdgeLabels, setShowEdgeLabels] = useState(true);
  const [pathTargetId, setPathTargetId] = useState<string>('');
  const [pathFindingMode, setPathFindingMode] = useState(false);
  const [activePathLength, setActivePathLength] = useState<number | null>(null);

  // Filter nodes & edges based on search, domains, types, relationships, and local view mode
  const filteredElements = useMemo(() => {
    let visibleNodes = nodes;

    // Search query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      visibleNodes = visibleNodes.filter(
        (n) =>
          n.label.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.domain.toLowerCase().includes(q)
      );
    }

    // Domain filter
    if (filters.selectedDomains.length > 0) {
      visibleNodes = visibleNodes.filter((n) => filters.selectedDomains.includes(n.domain));
    }

    // Type filter
    if (filters.selectedTypes.length > 0) {
      visibleNodes = visibleNodes.filter((n) => filters.selectedTypes.includes(n.type));
    }

    // Local ego view mode: only selected node and its direct neighbors
    if (isLocalView && selectedNodeId) {
      const connectedNodeIds = new Set<string>([selectedNodeId]);
      edges.forEach((e) => {
        if (e.source === selectedNodeId) connectedNodeIds.add(e.target);
        if (e.target === selectedNodeId) connectedNodeIds.add(e.source);
      });
      visibleNodes = visibleNodes.filter((n) => connectedNodeIds.has(n.id));
    }

    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));

    // Visible edges
    let visibleEdges = edges.filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );

    if (filters.selectedRelationships.length > 0) {
      visibleEdges = visibleEdges.filter((e) =>
        filters.selectedRelationships.includes(e.type)
      );
    }

    const elements: cytoscape.ElementDefinition[] = [];

    visibleNodes.forEach((node) => {
      const typeCfg = CONCEPT_TYPE_CONFIG[node.type];
      const domainColor = DOMAIN_COLORS[node.domain] || '#38bdf8';
      elements.push({
        group: 'nodes',
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
          domain: node.domain,
          summary: node.summary,
          nodeColor: typeCfg.color,
          domainColor: domainColor,
        },
      });
    });

    visibleEdges.forEach((edge) => {
      const relCfg = RELATIONSHIP_CONFIG[edge.type] || {
        label: edge.type,
        lineStyle: 'solid',
        color: '#64748b',
      };
      elements.push({
        group: 'edges',
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: relCfg.label,
          type: edge.type,
          lineStyle: relCfg.lineStyle,
          edgeColor: relCfg.color,
        },
      });
    });

    return elements;
  }, [nodes, edges, filters, isLocalView, selectedNodeId]);

  // Initialize Cytoscape core instance
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      boxSelectionEnabled: false,
      autounselectify: false,
      elements: filteredElements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#0d1322',
            'border-width': 2,
            'border-color': 'data(nodeColor)',
            'border-opacity': 0.85,
            label: 'data(label)',
            color: '#e2e8f0',
            'font-family': 'Geist, sans-serif',
            'font-size': '11px',
            'font-weight': 500,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-max-width': '120px',
            'text-wrap': 'ellipsis',
            width: 38,
            height: 38,
            'transition-property': 'background-color, border-color, border-width, opacity, width, height',
            'transition-duration': 0.25,
          },
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': 'data(nodeColor)',
            'border-width': 4,
            'border-color': '#ffffff',
            'border-opacity': 1,
            color: '#ffffff',
            'font-weight': 700,
            'font-size': '13px',
            width: 48,
            height: 48,
            'underlay-color': 'data(nodeColor)',
            'underlay-padding': '8px',
            'underlay-opacity': 0.4,
          },
        },
        {
          selector: 'node.highlighted',
          style: {
            'border-width': 3,
            'border-color': '#00f5a0',
            opacity: 1,
            'underlay-color': '#00f5a0',
            'underlay-padding': '6px',
            'underlay-opacity': 0.3,
          },
        },
        {
          selector: 'node.dimmed',
          style: {
            opacity: 0.15,
            'border-opacity': 0.2,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1.5,
            'line-color': 'data(edgeColor)',
            'line-opacity': 0.6,
            'line-style': 'data(lineStyle)' as any,
            'target-arrow-color': 'data(edgeColor)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.85,
            label: showEdgeLabels ? 'data(label)' : '',
            color: '#94a3b8',
            'font-family': 'JetBrains Mono, monospace',
            'font-size': '9px',
            'text-rotation': 'autorotate',
            'text-background-color': '#07090e',
            'text-background-opacity': 0.85,
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle',
            'transition-property': 'line-color, width, opacity',
            'transition-duration': 0.25,
          },
        },
        {
          selector: 'edge.highlighted',
          style: {
            width: 3,
            'line-color': '#00f5a0',
            'target-arrow-color': '#00f5a0',
            'line-opacity': 1,
            'z-index': 99,
          },
        },
        {
          selector: 'edge.dimmed',
          style: {
            opacity: 0.1,
          },
        },
        {
          selector: 'edge.path-highlight',
          style: {
            width: 3.5,
            'line-color': '#fbbf24',
            'target-arrow-color': '#fbbf24',
            'line-opacity': 1,
            'z-index': 100,
          },
        },
        {
          selector: 'node.path-highlight',
          style: {
            'border-width': 4,
            'border-color': '#fbbf24',
            'underlay-color': '#fbbf24',
            'underlay-padding': '8px',
            'underlay-opacity': 0.4,
            opacity: 1,
          },
        },
      ] as any,
      layout: {
        name: layoutName,
        animate: true,
        animationDuration: 600,
        padding: 50,
      } as any,
    });

    cyRef.current = cy;

    // Node click handler
    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const clickedId = node.id();

      if (pathFindingMode && selectedNodeId && clickedId !== selectedNodeId) {
        setPathTargetId(clickedId);
        return;
      }

      selectNode(clickedId);
    });

    // Background click handler
    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        // clicked canvas background
        cy.elements().removeClass('dimmed highlighted path-highlight');
      }
    });

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, []);

  // Sync elements when data or filters change
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().remove();
    cy.add(filteredElements);

    const layout = cy.layout({
      name: layoutName,
      animate: true,
      animationDuration: 500,
      padding: 50,
    } as any);
    layout.run();
  }, [filteredElements, layoutName]);

  // Sync selected node and highlight neighborhood
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().removeClass('dimmed highlighted path-highlight');

    if (selectedNodeId) {
      const targetNode = cy.getElementById(selectedNodeId);
      if (targetNode.length > 0) {
        targetNode.select();

        // Highlight neighborhood
        const neighborhood = targetNode.neighborhood();
        cy.elements().addClass('dimmed');
        targetNode.removeClass('dimmed').addClass('highlighted');
        neighborhood.removeClass('dimmed').addClass('highlighted');

        // Smooth camera center
        cy.animate({
          center: { eles: targetNode },
          zoom: Math.max(cy.zoom(), 1.1),
          duration: 400,
        });
      }
    }
  }, [selectedNodeId]);

  // Path finding logic between selectedNodeId and pathTargetId
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    if (selectedNodeId && pathTargetId && selectedNodeId !== pathTargetId) {
      const sourceEles = cy.getElementById(selectedNodeId);
      const targetEles = cy.getElementById(pathTargetId);

      if (sourceEles.length > 0 && targetEles.length > 0) {
        // Use Cytoscape A* or Dijkstra shortest path algorithm
        const dijkstra = cy.elements().dijkstra({
          root: sourceEles,
          directed: false,
        });

        const pathToTarget = dijkstra.pathTo(targetEles);
        setActivePathLength(pathToTarget.nodes().length);

        cy.elements().addClass('dimmed');
        pathToTarget.removeClass('dimmed').addClass('path-highlight');

        cy.animate({
          fit: { eles: pathToTarget, padding: 80 },
          duration: 500,
        });
      }
    } else {
      setActivePathLength(null);
    }
  }, [selectedNodeId, pathTargetId]);

  // Toolbar action helpers
  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 40);
  const handleReset = () => {
    const cy = cyRef.current;
    if (!cy) return;
    setPathTargetId('');
    setPathFindingMode(false);
    setActivePathLength(null);
    cy.elements().removeClass('dimmed highlighted path-highlight');
    cy.layout({ name: layoutName, animate: true, padding: 50 } as any).run();
  };

  return (
    <div className="relative w-full h-full min-h-[480px] flex flex-col bg-[#07090e] border border-surface-border rounded-xl overflow-hidden shadow-2xl">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Stats & Mode Indicator */}
        <div className="flex items-center gap-2 bg-[#0c101a]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-surface-border pointer-events-auto shadow-md">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-400 font-semibold">{filteredElements.filter(e => e.group === 'nodes').length}</span>
            <span className="text-slate-500">nodes</span>
            <span className="text-slate-600">/</span>
            <span className="font-mono text-cyan-400 font-semibold">{filteredElements.filter(e => e.group === 'edges').length}</span>
            <span className="text-slate-500">links</span>
          </div>

          <div className="h-3.5 w-px bg-slate-700 mx-1" />

          <button
            onClick={() => setShowEdgeLabels(!showEdgeLabels)}
            className={`text-xs px-2 py-0.5 rounded transition ${
              showEdgeLabels
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle typed edge labels"
          >
            Labels
          </button>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-1.5 bg-[#0c101a]/90 backdrop-blur-md p-1 rounded-lg border border-surface-border pointer-events-auto shadow-md">
          {/* Layout Selector */}
          <select
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value as any)}
            className="bg-[#141a29] text-xs text-slate-200 border border-surface-border rounded px-2 py-1 outline-none focus:border-cyan-500"
            title="Choose graph layout algorithm"
          >
            <option value="cose">Force-Directed (Cose)</option>
            <option value="concentric">Concentric Rings</option>
            <option value="circle">Circular</option>
            <option value="breadthfirst">Hierarchical (Tree)</option>
            <option value="grid">Orthogonal Grid</option>
          </select>

          {/* Path Finding Mode Toggle */}
          <button
            onClick={() => {
              setPathFindingMode(!pathFindingMode);
              if (pathFindingMode) {
                setPathTargetId('');
                setActivePathLength(null);
                cyRef.current?.elements().removeClass('path-highlight');
              }
            }}
            className={`p-1.5 rounded transition ${
              pathFindingMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            title={pathFindingMode ? 'Exit path finder' : 'Find shortest path between concepts'}
          >
            <Route className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-0.5" />

          {/* Zoom controls */}
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFit}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded transition"
            title="Fit to screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded transition"
            title="Reset layout and filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Path Finding Guide Banner */}
      {pathFindingMode && (
        <div className="absolute top-16 left-3 z-10 bg-amber-950/80 border border-amber-600/40 text-amber-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-md shadow-lg">
          <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>
            {pathTargetId
              ? `Shortest path: ${activePathLength} concepts connected`
              : 'Click any destination node to trace path from selected concept'}
          </span>
          {pathTargetId && (
            <button
              onClick={() => {
                setPathTargetId('');
                setActivePathLength(null);
                cyRef.current?.elements().removeClass('path-highlight');
              }}
              className="ml-2 text-amber-400 hover:text-white underline text-[11px]"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Main Cytoscape Canvas Container */}
      <div ref={containerRef} className="cytoscape-container w-full h-full flex-1" />

      {/* Bottom Concept Types Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-1.5 bg-[#090d16]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-surface-border text-[11px] pointer-events-auto">
        <span className="text-slate-400 font-medium mr-1">Types:</span>
        {Object.entries(CONCEPT_TYPE_CONFIG).slice(0, 6).map(([typeKey, cfg]) => (
          <div key={typeKey} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
            <span className="text-slate-300 capitalize">{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
