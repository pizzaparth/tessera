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
      const domainColor = DOMAIN_COLORS[node.domain] || '#6366f1';
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
            'background-color': '#ffffff',
            'border-width': 2.5,
            'border-color': 'data(nodeColor)',
            'border-opacity': 1,
            label: 'data(label)',
            color: '#1e293b',
            'font-family': 'Geist, Inter, sans-serif',
            'font-size': '11px',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-max-width': '120px',
            'text-wrap': 'ellipsis',
            width: 36,
            height: 36,
            'underlay-color': 'data(nodeColor)',
            'underlay-padding': '4px',
            'underlay-opacity': 0.12,
            'transition-property': 'background-color, border-color, border-width, opacity, width, height',
            'transition-duration': 0.2,
          },
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': 'data(nodeColor)',
            'border-width': 3,
            'border-color': '#4338ca',
            'border-opacity': 1,
            color: '#0f172a',
            'font-weight': 700,
            'font-size': '12px',
            width: 44,
            height: 44,
            'underlay-color': '#6366f1',
            'underlay-padding': '8px',
            'underlay-opacity': 0.28,
          },
        },
        {
          selector: 'node.highlighted',
          style: {
            'border-width': 3,
            'border-color': '#6366f1',
            opacity: 1,
            'underlay-color': '#6366f1',
            'underlay-padding': '6px',
            'underlay-opacity': 0.2,
          },
        },
        {
          selector: 'node.dimmed',
          style: {
            opacity: 0.18,
            'border-opacity': 0.3,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1.8,
            'line-color': 'data(edgeColor)',
            'line-opacity': 0.6,
            'line-style': 'data(lineStyle)' as any,
            'target-arrow-color': 'data(edgeColor)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.85,
            label: showEdgeLabels ? 'data(label)' : '',
            color: '#475569',
            'font-family': 'Geist, sans-serif',
            'font-size': '9px',
            'font-weight': 500,
            'text-rotation': 'autorotate',
            'text-background-color': '#ffffff',
            'text-background-opacity': 0.95,
            'text-background-padding': '2.5px',
            'text-background-shape': 'roundrectangle',
            'text-border-color': '#e2e8f0',
            'text-border-width': 0.8,
            'text-border-opacity': 0.7,
            'transition-property': 'line-color, width, opacity',
            'transition-duration': 0.2,
          },
        },
        {
          selector: 'edge.highlighted',
          style: {
            width: 3,
            'line-color': '#6366f1',
            'target-arrow-color': '#6366f1',
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
            'line-color': '#f59e0b',
            'target-arrow-color': '#f59e0b',
            'line-opacity': 1,
            'z-index': 100,
          },
        },
        {
          selector: 'node.path-highlight',
          style: {
            'border-width': 4,
            'border-color': '#f59e0b',
            'underlay-color': '#f59e0b',
            'underlay-padding': '8px',
            'underlay-opacity': 0.35,
            opacity: 1,
          },
        },
      ] as any,
      layout: {
        name: layoutName,
        animate: true,
        animationDuration: 500,
        padding: 40,
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
        if (!pathFindingMode) {
          selectNode(null);
        }
      }
    });

    // Node hover effects
    cy.on('mouseover', 'node', (evt: EventObject) => {
      const node = evt.target;
      if (!selectedNodeId && !pathFindingMode) {
        const neighborhood = node.neighborhood().add(node);
        cy.elements().not(neighborhood).addClass('dimmed');
        neighborhood.addClass('highlighted');
      }
    });

    cy.on('mouseout', 'node', () => {
      if (!selectedNodeId && !pathFindingMode) {
        cy.elements().removeClass('dimmed highlighted');
      }
    });

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, []);

  // Sync elements when nodes/edges or filters change
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.batch(() => {
      cy.elements().remove();
      cy.add(filteredElements);
    });

    // Re-run layout
    cy.layout({
      name: layoutName,
      animate: true,
      animationDuration: 500,
      padding: 40,
    } as any).run();
  }, [filteredElements, layoutName]);

  // Sync selection state and highlight neighborhood
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().removeClass('dimmed highlighted');
    cy.nodes().unselect();

    if (selectedNodeId) {
      const selectedCyNode = cy.getElementById(selectedNodeId);
      if (selectedCyNode.length > 0) {
        selectedCyNode.select();
        const neighborhood = selectedCyNode.neighborhood().add(selectedCyNode);
        cy.elements().not(neighborhood).addClass('dimmed');
        neighborhood.addClass('highlighted');

        // Smoothly center camera on selected neighborhood
        cy.animate({
          center: { eles: neighborhood },
          zoom: Math.min(cy.zoom(), 1.4),
          duration: 400,
        });
      }
    }
  }, [selectedNodeId]);

  // Handle path finding calculation (BFS)
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !pathFindingMode || !selectedNodeId || !pathTargetId) return;

    cy.elements().removeClass('path-highlight');

    // Dijkstra / BFS path
    const startNode = cy.getElementById(selectedNodeId);
    const endNode = cy.getElementById(pathTargetId);

    if (startNode.length > 0 && endNode.length > 0) {
      const dijkstra = cy.elements().dijkstra({
        root: startNode,
        directed: false,
      });

      const pathToTarget = dijkstra.pathTo(endNode);
      if (pathToTarget.length > 0) {
        pathToTarget.addClass('path-highlight');
        setActivePathLength(pathToTarget.nodes().length);
        cy.animate({
          fit: { eles: pathToTarget, padding: 60 },
          duration: 500,
        });
      } else {
        setActivePathLength(0);
      }
    }
  }, [selectedNodeId, pathTargetId, pathFindingMode]);

  // Controls handlers
  const handleZoomIn = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.animate({ zoom: cy.zoom() * 1.25, duration: 250 });
  };

  const handleZoomOut = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.animate({ zoom: cy.zoom() * 0.8, duration: 250 });
  };

  const handleFit = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.animate({ fit: { eles: cy.elements(), padding: 40 }, duration: 400 });
  };

  const handleReset = () => {
    const cy = cyRef.current;
    if (!cy) return;
    setPathFindingMode(false);
    setPathTargetId('');
    setActivePathLength(null);
    cy.elements().removeClass('dimmed highlighted path-highlight');
    cy.layout({ name: layoutName, animate: true, padding: 40 } as any).run();
  };

  return (
    <div className="relative w-full h-full min-h-[480px] flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-subtle">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Stats & Mode Indicator */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 pointer-events-auto shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900">{filteredElements.filter(e => e.group === 'nodes').length}</span>
            <span className="text-slate-500">nodes</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-900">{filteredElements.filter(e => e.group === 'edges').length}</span>
            <span className="text-slate-500">links</span>
          </div>

          <div className="h-3.5 w-px bg-slate-200 mx-1" />

          <button
            onClick={() => setShowEdgeLabels(!showEdgeLabels)}
            className={`text-xs px-2 py-0.5 rounded-md font-medium transition ${
              showEdgeLabels
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="Toggle typed edge labels"
          >
            Labels
          </button>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 pointer-events-auto shadow-sm">
          {/* Layout Selector */}
          <select
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value as any)}
            className="bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1 outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
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
            className={`p-1.5 rounded-lg transition ${
              pathFindingMode
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={pathFindingMode ? 'Exit path finder' : 'Find shortest path between concepts'}
          >
            <Route className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Zoom controls */}
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFit}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="Fit to screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="Reset layout and filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Path Finding Guide Banner */}
      {pathFindingMode && (
        <div className="absolute top-16 left-3 z-10 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md shadow-md">
          <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span className="font-medium">
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
              className="ml-2 text-amber-700 hover:text-amber-900 font-semibold underline text-[11px]"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Main Cytoscape Canvas Container */}
      <div ref={containerRef} className="cytoscape-container w-full h-full flex-1" />

      {/* Bottom Concept Types Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 text-[11px] pointer-events-auto shadow-sm">
        <span className="text-slate-500 font-medium mr-1">Types:</span>
        {Object.entries(CONCEPT_TYPE_CONFIG).slice(0, 6).map(([typeKey, cfg]) => (
          <div key={typeKey} className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
            <span className="text-slate-700 font-medium capitalize">{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
