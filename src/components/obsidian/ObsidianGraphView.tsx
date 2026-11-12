import React, { useEffect, useRef, useState, useMemo } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Sliders,
  X,
  Search,
  Filter,
} from 'lucide-react';

export const ObsidianGraphView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const {
    nodes,
    edges,
    selectedNodeId,
    selectNode,
    graphPhysics,
    setGraphPhysics,
    setActiveView,
  } = useWorkspace();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');

  // Prepare Cytoscape elements with NO edge labels
  const elements = useMemo(() => {
    let filteredNodes = nodes;
    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase();
      filteredNodes = filteredNodes.filter(
        (n) => n.label.toLowerCase().includes(q) || n.folder.toLowerCase().includes(q)
      );
    }

    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const validEdges = edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));

    const cyElements: cytoscape.ElementDefinition[] = [];

    // Nodes (Obsidian circular glowing dots)
    filteredNodes.forEach((node) => {
      cyElements.push({
        group: 'nodes',
        data: {
          id: node.id,
          label: node.label,
          folder: node.folder,
          nodeColor: node.color || '#818cf8',
        },
      });
    });

    // Edges (Clean connecting wires with NO LABELS)
    validEdges.forEach((edge) => {
      cyElements.push({
        group: 'edges',
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
        },
      });
    });

    return cyElements;
  }, [nodes, edges, filterSearch]);

  // Initialize Cytoscape core
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      boxSelectionEnabled: false,
      autounselectify: false,
      elements: elements,
      style: [
        // Node styling - Obsidian dots
        {
          selector: 'node',
          style: {
            'background-color': 'data(nodeColor)',
            width: graphPhysics.nodeSize,
            height: graphPhysics.nodeSize,
            label: 'data(label)',
            color: '#c5c5c5',
            'font-family': 'Inter, sans-serif',
            'font-size': '10px',
            'font-weight': 400,
            'text-valign': 'bottom',
            'text-margin-y': 4,
            'text-max-width': '100px',
            'text-wrap': 'ellipsis',
            'border-width': 0,
            opacity: 0.9,
            'transition-property': 'background-color, opacity, width, height, underlay-opacity',
            'transition-duration': 0.2,
          },
        },
        // Selected node - glowing halo
        {
          selector: 'node:selected',
          style: {
            'background-color': '#ffffff',
            width: graphPhysics.nodeSize + 6,
            height: graphPhysics.nodeSize + 6,
            color: '#ffffff',
            'font-weight': 600,
            'font-size': '12px',
            'underlay-color': 'data(nodeColor)',
            'underlay-padding': '12px',
            'underlay-opacity': 0.5,
            opacity: 1,
            'z-index': 999,
          },
        },
        // Highlighted neighbor
        {
          selector: 'node.highlighted',
          style: {
            opacity: 1,
            'underlay-color': 'data(nodeColor)',
            'underlay-padding': '6px',
            'underlay-opacity': 0.3,
          },
        },
        // Dimmed distant nodes
        {
          selector: 'node.dimmed',
          style: {
            opacity: 0.15,
            color: '#555555',
          },
        },
        // Edges - completely clean connecting wires with NO LABELS
        {
          selector: 'edge',
          style: {
            width: 1.2,
            'line-color': '#3e3e3e',
            'line-opacity': 0.6,
            'curve-style': 'straight',
            // Explicitly NO labels on connecting wires
            label: '',
            'target-arrow-shape': 'none',
            'transition-property': 'line-color, width, line-opacity',
            'transition-duration': 0.2,
          },
        },
        // Highlighted edge connecting active neighborhood
        {
          selector: 'edge.highlighted',
          style: {
            width: 2.2,
            'line-color': '#7b68ee',
            'line-opacity': 0.9,
            'z-index': 900,
          },
        },
        // Dimmed edge
        {
          selector: 'edge.dimmed',
          style: {
            'line-opacity': 0.08,
          },
        },
      ] as any,
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 600,
        nodeRepulsion: () => graphPhysics.repelForce * 1000,
        idealEdgeLength: () => graphPhysics.linkDistance,
        padding: 60,
      } as any,
    });

    cyRef.current = cy;

    // Node click
    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      selectNode(node.id());
    });

    // Double click to open note editor
    cy.on('dbltap', 'node', (evt: EventObject) => {
      const node = evt.target;
      selectNode(node.id());
      setActiveView('note');
    });

    // Background click
    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        selectNode(null);
      }
    });

    // Hover effect
    cy.on('mouseover', 'node', (evt: EventObject) => {
      const node = evt.target;
      if (!selectedNodeId) {
        const neighborhood = node.neighborhood().add(node);
        cy.elements().not(neighborhood).addClass('dimmed');
        neighborhood.addClass('highlighted');
      }
    });

    cy.on('mouseout', 'node', () => {
      if (!selectedNodeId) {
        cy.elements().removeClass('dimmed highlighted');
      }
    });

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, []);

  // Update elements on change
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.batch(() => {
      cy.elements().remove();
      cy.add(elements);
    });

    cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 500,
      nodeRepulsion: () => graphPhysics.repelForce * 1000,
      idealEdgeLength: () => graphPhysics.linkDistance,
      padding: 60,
    } as any).run();
  }, [elements]);

  // Sync selected node highlighting & zoom
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().removeClass('dimmed highlighted');
    cy.nodes().unselect();

    if (selectedNodeId) {
      const targetNode = cy.getElementById(selectedNodeId);
      if (targetNode.length > 0) {
        targetNode.select();
        const neighborhood = targetNode.neighborhood().add(targetNode);
        cy.elements().not(neighborhood).addClass('dimmed');
        neighborhood.addClass('highlighted');

        cy.animate({
          center: { eles: targetNode },
          zoom: Math.min(cy.zoom(), 1.6),
          duration: 350,
        });
      }
    }
  }, [selectedNodeId]);

  // Controls
  const handleZoomIn = () => cyRef.current?.animate({ zoom: (cyRef.current?.zoom() || 1) * 1.3, duration: 200 });
  const handleZoomOut = () => cyRef.current?.animate({ zoom: (cyRef.current?.zoom() || 1) * 0.7, duration: 200 });
  const handleFit = () => cyRef.current?.animate({ fit: { eles: cyRef.current?.elements(), padding: 50 }, duration: 300 });
  const handleResetLayout = () => {
    cyRef.current?.layout({
      name: 'cose',
      animate: true,
      animationDuration: 500,
      padding: 50,
    } as any).run();
  };

  return (
    <div className="relative w-full h-full bg-[#161616] overflow-hidden select-none">
      {/* Floating Obsidian Graph Controls Bar (Top Left) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-obsidian-surface/85 backdrop-blur-md p-1 rounded-lg border border-obsidian-border text-obsidian-textMuted shadow-lg">
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:text-obsidian-text hover:bg-obsidian-hover rounded transition"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:text-obsidian-text hover:bg-obsidian-hover rounded transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleFit}
          className="p-1.5 hover:text-obsidian-text hover:bg-obsidian-hover rounded transition"
          title="Fit view"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleResetLayout}
          className="p-1.5 hover:text-obsidian-text hover:bg-obsidian-hover rounded transition"
          title="Rerun layout forces"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Obsidian Graph Settings Gear Toggle (Top Right) */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`p-2 rounded-lg border backdrop-blur-md transition shadow-lg ${
            isSettingsOpen
              ? 'bg-obsidian-purple/20 text-obsidian-purple border-obsidian-purple/40'
              : 'bg-obsidian-surface/85 text-obsidian-textMuted border-obsidian-border hover:text-obsidian-text'
          }`}
          title="Graph Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Collapsible Obsidian Graph Settings Drawer */}
        {isSettingsOpen && (
          <div className="absolute right-0 top-11 w-64 bg-obsidian-sidebar/95 backdrop-blur-md border border-obsidian-border rounded-xl p-3 shadow-2xl text-xs space-y-3 animate-in fade-in duration-150 text-obsidian-text">
            <div className="flex items-center justify-between border-b border-obsidian-border pb-1.5">
              <span className="font-semibold text-[11px] text-obsidian-text">Graph Settings</span>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-obsidian-textMuted hover:text-obsidian-text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filter Search */}
            <div className="space-y-1">
              <label className="text-[10px] text-obsidian-textMuted font-medium uppercase">
                Filter Nodes
              </label>
              <div className="flex items-center gap-1.5 bg-obsidian-surface border border-obsidian-border rounded px-2 py-1">
                <Search className="w-3 h-3 text-obsidian-textMuted" />
                <input
                  type="text"
                  placeholder="Search file name..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="bg-transparent text-obsidian-text placeholder-obsidian-textFaint outline-none w-full text-xs"
                />
              </div>
            </div>

            {/* Node Size Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-obsidian-textMuted">Node Size</span>
                <span className="text-obsidian-text font-mono">{graphPhysics.nodeSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="36"
                value={graphPhysics.nodeSize}
                onChange={(e) => setGraphPhysics({ nodeSize: Number(e.target.value) })}
                className="w-full accent-obsidian-purple h-1 bg-obsidian-surface rounded cursor-pointer"
              />
            </div>

            {/* Link Distance Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-obsidian-textMuted">Link Distance</span>
                <span className="text-obsidian-text font-mono">{graphPhysics.linkDistance}</span>
              </div>
              <input
                type="range"
                min="60"
                max="240"
                value={graphPhysics.linkDistance}
                onChange={(e) => setGraphPhysics({ linkDistance: Number(e.target.value) })}
                className="w-full accent-obsidian-purple h-1 bg-obsidian-surface rounded cursor-pointer"
              />
            </div>

            {/* Repel Force */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-obsidian-textMuted">Repel Force</span>
                <span className="text-obsidian-text font-mono">{graphPhysics.repelForce}</span>
              </div>
              <input
                type="range"
                min="200"
                max="1200"
                value={graphPhysics.repelForce}
                onChange={(e) => setGraphPhysics({ repelForce: Number(e.target.value) })}
                className="w-full accent-obsidian-purple h-1 bg-obsidian-surface rounded cursor-pointer"
              />
            </div>

            <div className="pt-1 text-[10px] text-obsidian-textMuted italic text-center border-t border-obsidian-border">
              Clean connecting wires • Obsidian graph view
            </div>
          </div>
        )}
      </div>

      {/* Main Cytoscape Canvas Container */}
      <div ref={containerRef} className="obsidian-graph-canvas w-full h-full" />
    </div>
  );
};
