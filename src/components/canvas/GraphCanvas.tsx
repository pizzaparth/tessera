import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { NoteNode, NoteEdge, ColorGroup } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Sliders,
  X,
  Search,
  Filter,
  Layers,
  Eye,
  Plus,
  Play,
  Pause,
} from 'lucide-react';

interface SimNode extends NoteNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  degree: number;
  isDragging?: boolean;
}

export const GraphCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    nodes,
    edges,
    selectedNodeId,
    selectNode,
    setActiveView,
    graphSettings,
    setGraphSettings,
  } = useWorkspace();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTabSetting, setActiveTabSetting] = useState<'filters' | 'groups' | 'display' | 'forces'>('forces');

  // Viewport camera transform state
  const cameraRef = useRef({
    x: 0,
    y: 0,
    scale: 1,
    isPanning: false,
    panStartX: 0,
    panStartY: 0,
    camStartX: 0,
    camStartY: 0,
  });

  // Physics simulation state
  const simNodesRef = useRef<SimNode[]>([]);
  const simEdgesRef = useRef<{ source: SimNode; target: SimNode }[]>([]);
  const hoveredNodeRef = useRef<SimNode | null>(null);
  const draggedNodeRef = useRef<SimNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Compute node degrees & map color groups
  const nodeDegrees = useMemo(() => {
    const deg: Record<string, number> = {};
    nodes.forEach((n) => (deg[n.id] = 0));
    edges.forEach((e) => {
      if (deg[e.source] !== undefined) deg[e.source]++;
      if (deg[e.target] !== undefined) deg[e.target]++;
    });
    return deg;
  }, [nodes, edges]);

  // Determine node color from Color Groups
  const getNodeColor = useCallback(
    (node: NoteNode): string => {
      for (const group of graphSettings.groups) {
        const query = group.query.toLowerCase();
        if (
          node.folder.toLowerCase().includes(query) ||
          node.label.toLowerCase().includes(query) ||
          (node.tags && node.tags.some((t) => t.toLowerCase().includes(query)))
        ) {
          return group.color;
        }
      }
      return node.color || '#9d4edd';
    },
    [graphSettings.groups]
  );

  // Filter visible nodes & edges based on search & orphans toggle
  const visibleNodesAndEdges = useMemo(() => {
    let filtered = nodes;

    if (graphSettings.searchQuery.trim()) {
      const q = graphSettings.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) => n.label.toLowerCase().includes(q) || n.folder.toLowerCase().includes(q)
      );
    }

    if (!graphSettings.showOrphans) {
      filtered = filtered.filter((n) => (nodeDegrees[n.id] || 0) > 0);
    }

    const filteredIds = new Set(filtered.map((n) => n.id));
    const validEdges = edges.filter(
      (e) => filteredIds.has(e.source) && filteredIds.has(e.target)
    );

    return { filteredNodes: filtered, validEdges };
  }, [nodes, edges, graphSettings.searchQuery, graphSettings.showOrphans, nodeDegrees]);

  // Initialize or update simulation nodes & edges preserving positions
  useEffect(() => {
    const { filteredNodes, validEdges } = visibleNodesAndEdges;

    const existingMap = new Map<string, SimNode>();
    simNodesRef.current.forEach((n) => existingMap.set(n.id, n));

    const radiusBase = 5 * graphSettings.nodeSizeMultiplier;

    const newSimNodes: SimNode[] = filteredNodes.map((n, i) => {
      const existing = existingMap.get(n.id);
      const deg = nodeDegrees[n.id] || 0;
      // Degree-scaled radius matching native graph
      const calculatedRadius = Math.max(radiusBase, radiusBase + Math.sqrt(deg) * 2.8);

      if (existing) {
        return {
          ...n,
          x: existing.x,
          y: existing.y,
          vx: existing.vx,
          vy: existing.vy,
          radius: calculatedRadius,
          degree: deg,
        };
      }

      // Arrange new nodes in an organic spiral around center
      const angle = i * 0.45;
      const dist = 50 + i * 22;
      return {
        ...n,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: calculatedRadius,
        degree: deg,
      };
    });

    const simNodeMap = new Map<string, SimNode>();
    newSimNodes.forEach((n) => simNodeMap.set(n.id, n));

    const newSimEdges: { source: SimNode; target: SimNode }[] = [];
    validEdges.forEach((e) => {
      const src = simNodeMap.get(e.source);
      const tgt = simNodeMap.get(e.target);
      if (src && tgt) {
        newSimEdges.push({ source: src, target: tgt });
      }
    });

    simNodesRef.current = newSimNodes;
    simEdgesRef.current = newSimEdges;
  }, [visibleNodesAndEdges, nodeDegrees, graphSettings.nodeSizeMultiplier]);

  // Main 60FPS High-DPI Canvas Rendering & Physics Engine Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const renderLoop = () => {
      if (!isRunning) return;

      const simNodes = simNodesRef.current;
      const simEdges = simEdgesRef.current;
      const camera = cameraRef.current;
      const hovered = hoveredNodeRef.current;

      const width = canvas.width;
      const height = canvas.height;
      const pixelRatio = window.devicePixelRatio || 1;

      // 1. Physics Step (Spring-Electrical Model)
      const { centerForce, repelForce, linkForce, linkDistance } = graphSettings;
      const dt = 0.85; // Time step

      // Spring attraction between connected pairs (Hooke's Law)
      for (let i = 0; i < simEdges.length; i++) {
        const edge = simEdges[i];
        const dx = edge.target.x - edge.source.x;
        const dy = edge.target.y - edge.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const displacement = dist - linkDistance;
        const force = displacement * (0.04 * linkForce);

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (!edge.source.isDragging) {
          edge.source.vx += fx;
          edge.source.vy += fy;
        }
        if (!edge.target.isDragging) {
          edge.target.vx -= fx;
          edge.target.vy -= fy;
        }
      }

      // Many-body repulsion between all pairs (Coulomb Repulsion)
      const nodeCount = simNodes.length;
      for (let i = 0; i < nodeCount; i++) {
        const n1 = simNodes[i];
        for (let j = i + 1; j < nodeCount; j++) {
          const n2 = simNodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy + 100;
          const dist = Math.sqrt(distSq);

          // Repulsive force inversely proportional to distance
          const repForce = (repelForce * 18) / distSq;
          const rfx = (dx / dist) * repForce;
          const rfy = (dy / dist) * repForce;

          if (!n1.isDragging) {
            n1.vx -= rfx;
            n1.vy -= rfy;
          }
          if (!n2.isDragging) {
            n2.vx += rfx;
            n2.vy += rfy;
          }

          // Hard collision circle separation
          const minDist = n1.radius + n2.radius + 6;
          if (dist < minDist) {
            const overlap = (minDist - dist) * 0.5;
            const ox = (dx / dist) * overlap;
            const oy = (dy / dist) * overlap;
            if (!n1.isDragging) {
              n1.x -= ox;
              n1.y -= oy;
            }
            if (!n2.isDragging) {
              n2.x += ox;
              n2.y += oy;
            }
          }
        }

        // Center gravity pull
        if (!n1.isDragging) {
          n1.vx += (0 - n1.x) * (0.003 * centerForce);
          n1.vy += (0 - n1.y) * (0.003 * centerForce);

          // Velocity damping & position update
          n1.vx *= 0.88;
          n1.vy *= 0.88;
          n1.x += n1.vx * dt;
          n1.y += n1.vy * dt;
        }
      }

      // 2. Canvas Drawing Step (AMOLED PURE BLACK)
      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Fill pure AMOLED pitch black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Apply retina devicePixelRatio & camera zoom/pan transformations
      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);
      ctx.translate(canvas.clientWidth / 2 + camera.x, canvas.clientHeight / 2 + camera.y);
      ctx.scale(camera.scale, camera.scale);

      // Build active neighborhood set for focus highlighting
      const activeId = selectedNodeId || (hovered ? hovered.id : null);
      const neighborIds = new Set<string>();
      if (activeId) {
        neighborIds.add(activeId);
        simEdges.forEach((e) => {
          if (e.source.id === activeId) neighborIds.add(e.target.id);
          if (e.target.id === activeId) neighborIds.add(e.source.id);
        });
      }

      // Draw Edges (Connecting wires - NO LABELS!)
      const baseEdgeWidth = Math.max(0.7, graphSettings.linkThickness);

      for (let i = 0; i < simEdges.length; i++) {
        const edge = simEdges[i];
        const isNeighborEdge =
          activeId && (edge.source.id === activeId || edge.target.id === activeId);

        ctx.beginPath();
        ctx.moveTo(edge.source.x, edge.source.y);
        ctx.lineTo(edge.target.x, edge.target.y);

        if (isNeighborEdge) {
          // Highlight active wires with glowing electric violet
          ctx.strokeStyle = '#9d4edd';
          ctx.lineWidth = baseEdgeWidth * 2.2;
          ctx.globalAlpha = 0.95;
          ctx.shadowColor = '#9d4edd';
          ctx.shadowBlur = 8;
        } else if (activeId) {
          // Dim unconnected wires
          ctx.strokeStyle = '#222222';
          ctx.lineWidth = baseEdgeWidth * 0.7;
          ctx.globalAlpha = 0.08;
          ctx.shadowBlur = 0;
        } else {
          // Default sleek thin wires
          ctx.strokeStyle = '#333333';
          ctx.lineWidth = baseEdgeWidth;
          ctx.globalAlpha = 0.55;
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
      }

      ctx.shadowBlur = 0; // Reset shadow

      // Draw Nodes (Glowing AMOLED particles & Solid White Typography)
      const currentScale = camera.scale;

      for (let i = 0; i < simNodes.length; i++) {
        const node = simNodes[i];
        const isSelected = node.id === selectedNodeId;
        const isHovered = hovered && hovered.id === node.id;
        const isConnectedNeighbor = neighborIds.has(node.id);
        const nodeColor = getNodeColor(node);

        const nodeAlpha = activeId ? (isConnectedNeighbor ? 1 : 0.12) : 0.92;
        ctx.globalAlpha = nodeAlpha;

        // Selection / Hover pulsing halo ring
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = nodeColor;
          ctx.globalAlpha = isSelected ? 0.35 : 0.2;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.8;
          ctx.globalAlpha = 0.9;
          ctx.stroke();
        }

        // Main Node Circle Dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#ffffff' : nodeColor;
        ctx.globalAlpha = nodeAlpha;
        ctx.shadowColor = nodeColor;
        ctx.shadowBlur = isSelected || isHovered ? 14 : 5;
        ctx.fill();

        ctx.shadowBlur = 0; // Clear shadow

        // Solid White Text Labels
        // Text fade threshold: labels appear when zoomed in or when hovered/selected
        const textThreshold = graphSettings.textFadeThreshold;
        const shouldShowLabel =
          isSelected || isHovered || currentScale >= textThreshold || (activeId && isConnectedNeighbor);

        if (shouldShowLabel && nodeAlpha > 0.15) {
          ctx.font = isSelected
            ? '600 12px Inter, sans-serif'
            : isHovered
            ? '600 11px Inter, sans-serif'
            : '400 10px Inter, sans-serif';

          ctx.fillStyle = isSelected || isHovered ? '#ffffff' : '#e0e0e0';
          ctx.globalAlpha = isSelected || isHovered ? 1 : Math.min(1, (currentScale - textThreshold + 0.3) * 1.5);

          // Add subtle dark text stroke for legibility over crossed wires
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          ctx.strokeText(node.label, node.x + node.radius + 5, node.y + 3.5);
          ctx.fillText(node.label, node.x + node.radius + 5, node.y + 3.5);
        }
      }

      ctx.restore();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [graphSettings, getNodeColor, selectedNodeId]);

  // Handle Canvas Resizing with Retina DevicePixelRatio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = rect.width * pixelRatio;
      canvas.height = rect.height * pixelRatio;
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Helper: Convert canvas mouse coordinate to world space
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const camera = cameraRef.current;

    const screenX = clientX - rect.left - rect.width / 2;
    const screenY = clientY - rect.top - rect.height / 2;

    const worldX = (screenX - camera.x) / camera.scale;
    const worldY = (screenY - camera.y) / camera.scale;
    return { x: worldX, y: worldY };
  }, []);

  // Find node under mouse position
  const findNodeAtPos = useCallback((worldX: number, worldY: number) => {
    const simNodes = simNodesRef.current;
    for (let i = simNodes.length - 1; i >= 0; i--) {
      const n = simNodes[i];
      const dx = n.x - worldX;
      const dy = n.y - worldY;
      const hitRadius = n.radius + 6;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return n;
      }
    }
    return null;
  }, []);

  // Mouse Interaction Handlers: Pan, Zoom, Drag, Hover, Click
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return; // Left click only
    const world = screenToWorld(e.clientX, e.clientY);
    const hitNode = findNodeAtPos(world.x, world.y);

    if (hitNode) {
      draggedNodeRef.current = hitNode;
      hitNode.isDragging = true;
      hitNode.x = world.x;
      hitNode.y = world.y;
    } else {
      cameraRef.current.isPanning = true;
      cameraRef.current.panStartX = e.clientX;
      cameraRef.current.panStartY = e.clientY;
      cameraRef.current.camStartX = cameraRef.current.x;
      cameraRef.current.camStartY = cameraRef.current.y;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const world = screenToWorld(e.clientX, e.clientY);

    // Node dragging
    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = world.x;
      draggedNodeRef.current.y = world.y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
      return;
    }

    // Camera panning
    if (cameraRef.current.isPanning) {
      const dx = e.clientX - cameraRef.current.panStartX;
      const dy = e.clientY - cameraRef.current.panStartY;
      cameraRef.current.x = cameraRef.current.camStartX + dx;
      cameraRef.current.y = cameraRef.current.camStartY + dy;
      return;
    }

    // Hover detection
    const hitNode = findNodeAtPos(world.x, world.y);
    hoveredNodeRef.current = hitNode;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = hitNode ? 'pointer' : 'default';
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedNodeRef.current) {
      const dragged = draggedNodeRef.current;
      dragged.isDragging = false;
      draggedNodeRef.current = null;
      // If mouse barely moved, treat as node select click
      selectNode(dragged.id);
    } else if (cameraRef.current.isPanning) {
      const dx = Math.abs(e.clientX - cameraRef.current.panStartX);
      const dy = Math.abs(e.clientY - cameraRef.current.panStartY);
      cameraRef.current.isPanning = false;
      if (dx < 4 && dy < 4) {
        selectNode(null);
      }
    }
  };

  // Double click node to open note view directly
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const world = screenToWorld(e.clientX, e.clientY);
    const hitNode = findNodeAtPos(world.x, world.y);
    if (hitNode) {
      selectNode(hitNode.id);
      setActiveView('note');
    }
  };

  // Cursor-centered smooth mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const camera = cameraRef.current;
    const newScale = Math.max(0.15, Math.min(6.0, camera.scale * zoomFactor));

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // Zoom centered on cursor position
    camera.x -= (mouseX - camera.x) * (zoomFactor - 1);
    camera.y -= (mouseY - camera.y) * (zoomFactor - 1);
    camera.scale = newScale;
  };

  // Camera toolbar helpers
  const handleZoomIn = () => {
    cameraRef.current.scale = Math.min(6.0, cameraRef.current.scale * 1.25);
  };
  const handleZoomOut = () => {
    cameraRef.current.scale = Math.max(0.15, cameraRef.current.scale * 0.8);
  };
  const handleFit = () => {
    cameraRef.current.x = 0;
    cameraRef.current.y = 0;
    cameraRef.current.scale = 1.0;
  };
  const handleResetForces = () => {
    simNodesRef.current.forEach((n, i) => {
      const angle = i * 0.45;
      const dist = 50 + i * 20;
      n.x = Math.cos(angle) * dist;
      n.y = Math.sin(angle) * dist;
      n.vx = (Math.random() - 0.5) * 4;
      n.vy = (Math.random() - 0.5) * 4;
    });
  };

  return (
    <div className="relative w-full h-full bg-[#000000] overflow-hidden select-none">
      {/* Floating Canvas Controls (Top Left) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#0a0a0a]/90 backdrop-blur-md p-1 rounded-xl border border-[#1e1e1e] text-[#a0a0a0] shadow-2xl">
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleFit}
          className="p-1.5 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition"
          title="Center Canvas"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleResetForces}
          className="p-1.5 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition"
          title="Re-run physics simulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Graph Settings Drawer Toggle (Top Right) */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`p-2 rounded-xl border backdrop-blur-md transition shadow-2xl ${
            isSettingsOpen
              ? 'bg-[#9d4edd]/25 text-[#9d4edd] border-[#9d4edd]/50'
              : 'bg-[#0a0a0a]/90 text-[#a0a0a0] border-[#1e1e1e] hover:text-white hover:border-[#333333]'
          }`}
          title="Graph Settings (Filters, Groups, Display, Forces)"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Complete Graph Settings Drawer (Filters, Groups, Display, Forces) */}
        {isSettingsOpen && (
          <div className="absolute right-0 top-11 w-72 sm:w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#222222] rounded-2xl p-4 shadow-2xl text-xs space-y-4 animate-in fade-in duration-150 text-white z-50">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-white">
                Graph Settings
              </span>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-[#666666] hover:text-white p-1 rounded transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Category Tab Bar (Filters, Groups, Display, Forces) */}
            <div className="flex items-center bg-[#121212] border border-[#1e1e1e] rounded-xl p-0.5 text-[11px] font-medium">
              {(['forces', 'display', 'groups', 'filters'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTabSetting(tab)}
                  className={`flex-1 py-1 rounded-lg capitalize transition text-center ${
                    activeTabSetting === tab
                      ? 'bg-[#1e1e1e] text-[#00f5ff] font-semibold shadow-xs'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB 1: FORCES (Physics Engine) */}
            {activeTabSetting === 'forces' && (
              <div className="space-y-3.5 animate-in fade-in duration-100">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#a0a0a0]">Center Force</span>
                    <span className="font-mono text-[#00f5ff]">{graphSettings.centerForce.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="1.5"
                    step="0.05"
                    value={graphSettings.centerForce}
                    onChange={(e) => setGraphSettings({ centerForce: parseFloat(e.target.value) })}
                    className="w-full accent-[#00f5ff] h-1 bg-[#1a1a1a] rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#a0a0a0]">Repel Force</span>
                    <span className="font-mono text-[#00f5ff]">{graphSettings.repelForce}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1200"
                    step="50"
                    value={graphSettings.repelForce}
                    onChange={(e) => setGraphSettings({ repelForce: parseInt(e.target.value) })}
                    className="w-full accent-[#00f5ff] h-1 bg-[#1a1a1a] rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#a0a0a0]">Link Force</span>
                    <span className="font-mono text-[#00f5ff]">{graphSettings.linkForce.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={graphSettings.linkForce}
                    onChange={(e) => setGraphSettings({ linkForce: parseFloat(e.target.value) })}
                    className="w-full accent-[#00f5ff] h-1 bg-[#1a1a1a] rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#a0a0a0]">Link Distance</span>
                    <span className="font-mono text-[#00f5ff]">{graphSettings.linkDistance}px</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="260"
                    step="10"
                    value={graphSettings.linkDistance}
                    onChange={(e) => setGraphSettings({ linkDistance: parseInt(e.target.value) })}
                    className="w-full accent-[#00f5ff] h-1 bg-[#1a1a1a] rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: DISPLAY */}
            {activeTabSetting === 'display' && (
              <div className="space-y-3.5 animate-in fade-in duration-100">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#a0a0a0]">Node Size Multiplier</span>
                    <span className="font-mono text-[#9d4edd]">{graphSettings.nodeSizeMultiplier.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={graphSettings.nodeSizeMultiplier}
                    onChange={(e) => setGraphSettings({ nodeSizeMultiplier: parseFloat(e.target.value) })}
                    className="w-full accent-[#9d4edd] h-1 bg-[#1a1a1a] rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#a0a0a0]">Link Wire Thickness</span>
                    <span className="font-mono text-[#9d4edd]">{graphSettings.linkThickness.toFixed(1)}px</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.2"
                    value={graphSettings.linkThickness}
                    onChange={(e) => setGraphSettings({ linkThickness: parseFloat(e.target.value) })}
                    className="w-full accent-[#9d4edd] h-1 bg-[#1a1a1a] rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#a0a0a0]">Text Fade Threshold</span>
                    <span className="font-mono text-[#9d4edd]">{graphSettings.textFadeThreshold.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.5"
                    step="0.05"
                    value={graphSettings.textFadeThreshold}
                    onChange={(e) => setGraphSettings({ textFadeThreshold: parseFloat(e.target.value) })}
                    className="w-full accent-[#9d4edd] h-1 bg-[#1a1a1a] rounded cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-[#1e1e1e] text-[10px] text-[#666666] italic">
                  Note: Connecting wires are clean and unlabeled.
                </div>
              </div>
            )}

            {/* TAB 3: GROUPS */}
            {activeTabSetting === 'groups' && (
              <div className="space-y-2.5 animate-in fade-in duration-100">
                <div className="text-[11px] text-[#a0a0a0] mb-1">
                  Color groups by folder or tag query:
                </div>
                {graphSettings.groups.map((grp) => (
                  <div
                    key={grp.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#121212] border border-[#1e1e1e] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: grp.color }} />
                      <span className="font-medium text-white">{grp.query}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#666666]">{grp.color}</span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: FILTERS */}
            {activeTabSetting === 'filters' && (
              <div className="space-y-3 animate-in fade-in duration-100">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#a0a0a0] uppercase font-semibold">
                    Search Vault Nodes
                  </label>
                  <div className="flex items-center gap-1.5 bg-[#121212] border border-[#1e1e1e] rounded-xl px-2.5 py-1.5">
                    <Search className="w-3.5 h-3.5 text-[#666666]" />
                    <input
                      type="text"
                      placeholder="Filter title or folder..."
                      value={graphSettings.searchQuery}
                      onChange={(e) => setGraphSettings({ searchQuery: e.target.value })}
                      className="bg-transparent text-white placeholder-[#555555] outline-none w-full text-xs"
                    />
                  </div>
                </div>

                <label className="flex items-center justify-between p-2 rounded-xl bg-[#121212] border border-[#1e1e1e] cursor-pointer hover:bg-[#181818] transition">
                  <span className="text-xs text-[#d0d0d0]">Show Orphan Notes</span>
                  <input
                    type="checkbox"
                    checked={graphSettings.showOrphans}
                    onChange={(e) => setGraphSettings({ showOrphans: e.target.checked })}
                    className="accent-[#00f5ff] rounded cursor-pointer"
                  />
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        className="w-full h-full block cursor-default"
      />
    </div>
  );
};
