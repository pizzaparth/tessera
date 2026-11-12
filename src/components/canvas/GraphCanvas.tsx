import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { NoteNode, NoteEdge, ColorGroup } from '../../types';
import { Sliders, X, Search, FileText, Sparkles } from 'lucide-react';

interface SimNode extends NoteNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  degree: number;
  isDragging?: boolean;
}

const MIN_SCALE = 0.15;
const MAX_SCALE = 6;

export const GraphCanvas: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    nodes,
    edges,
    selectedNodeId,
    selectNode,
    openNote,
    graphSettings,
    setGraphSettings,
    sendMessageToAI,
    isChatLoading,
  } = useWorkspace();

  const settingsRef = useRef<HTMLDivElement | null>(null);

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
    // Animated camera target (smooth zoom / fit / focus)
    target: null as null | { x: number; y: number; scale: number },
  });
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);
  const selectionFromCanvasRef = useRef(false);
  const hasAutoFitRef = useRef(false);
  const userMovedCameraRef = useRef(false);

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

      // Arrange new nodes in an organic golden-ratio cluster around center
      const phi = 1.618033988749895;
      const angle = i * phi * Math.PI * 2;
      const dist = 30 + Math.sqrt(i) * 30;
      return {
        ...n,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
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

      // Guarantee canvas dimensions strictly match rendered container in every frame
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      const targetWidth = Math.round(rect.width * pixelRatio);
      const targetHeight = Math.round(rect.height * pixelRatio);

      if (targetWidth > 0 && targetHeight > 0 && (canvas.width !== targetWidth || canvas.height !== targetHeight)) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      const width = canvas.width;
      const height = canvas.height;

      // 0. Ease camera toward its animation target
      if (camera.target) {
        const t = camera.target;
        camera.x += (t.x - camera.x) * 0.18;
        camera.y += (t.y - camera.y) * 0.18;
        camera.scale += (t.scale - camera.scale) * 0.18;
        if (Math.abs(t.x - camera.x) < 0.5 && Math.abs(t.y - camera.y) < 0.5 && Math.abs(t.scale - camera.scale) < 0.002) {
          camera.x = t.x;
          camera.y = t.y;
          camera.scale = t.scale;
          camera.target = null;
        }
      }

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

        // Center gravity pull (keeps network well-balanced in viewport)
        if (!n1.isDragging) {
          n1.vx += (0 - n1.x) * (0.0045 * centerForce);
          n1.vy += (0 - n1.y) * (0.0045 * centerForce);

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
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      ctx.translate(centerX + camera.x, centerY + camera.y);
      ctx.scale(camera.scale, camera.scale);

      // Build active neighborhood set for focus highlighting
      // Hover previews a neighbourhood; otherwise highlight the selected note's
      const activeId = hovered ? hovered.id : selectedNodeId;
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
          ctx.strokeStyle = '#8b74e0';
          ctx.lineWidth = baseEdgeWidth * 1.6;
          ctx.globalAlpha = 1;
          ctx.shadowColor = '#6d55bd';
          ctx.shadowBlur = 6;
        } else if (activeId) {
          // Dim unconnected wires
          ctx.strokeStyle = '#2a2a30';
          ctx.lineWidth = baseEdgeWidth * 0.8;
          ctx.globalAlpha = 0.55;
          ctx.shadowBlur = 0;
        } else {
          // Default sleek thin wires
          ctx.strokeStyle = '#34343b';
          ctx.lineWidth = baseEdgeWidth;
          ctx.globalAlpha = 1;
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

        const isFocused = !!activeId && isConnectedNeighbor;
        const nodeAlpha = activeId ? (isConnectedNeighbor ? 1 : 0.35) : 1;
        const isAIDiscovery = node.folder === 'AI Discoveries';

        // Soft lavender focus glow, as in the landing page graph
        if (isSelected || isHovered) {
          const glowR = node.radius + 14;
          const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR);
          g.addColorStop(0, 'rgba(167, 139, 250, 0.55)');
          g.addColorStop(1, 'rgba(167, 139, 250, 0)');
          ctx.globalAlpha = 1;
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node dot: zinc by default, group colour when focused, lavender when selected
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected
          ? '#c4b5fd'
          : isAIDiscovery
          ? '#67e8f9'
          : activeId && !isFocused
          ? '#52525b'
          : nodeColor;
        ctx.globalAlpha = nodeAlpha;
        ctx.fill();
        if (isSelected) {
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#f4f4f5';
          ctx.stroke();
        }

        // Monospace labels under each node
        const textThreshold = graphSettings.textFadeThreshold;
        const shouldShowLabel =
          isSelected || isHovered || currentScale >= textThreshold || (activeId && isConnectedNeighbor);

        if (shouldShowLabel && nodeAlpha > 0.3) {
          ctx.font = `${isSelected || isHovered ? 600 : 500} ${isSelected ? 11 : 10}px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`;
          ctx.textAlign = 'center';
          ctx.fillStyle = isSelected || isHovered || isFocused ? '#f4f4f5' : isAIDiscovery ? '#cffafe' : '#8a8a93';
          ctx.globalAlpha = isSelected || isHovered ? 1 : Math.min(1, (currentScale - textThreshold + 0.3) * 1.5);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          const ly = node.y + node.radius + 12;
          ctx.strokeText(node.label, node.x, ly);
          ctx.fillText(node.label, node.x, ly);
          ctx.textAlign = 'start';
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

  // Handle Canvas Resizing with Retina DevicePixelRatio & ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      const targetWidth = Math.round(rect.width * pixelRatio);
      const targetHeight = Math.round(rect.height * pixelRatio);
      if (targetWidth > 0 && targetHeight > 0) {
        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
        }
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(container);

    window.addEventListener('resize', updateDimensions);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
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

  // ---- Camera helpers -------------------------------------------------
  const getViewSize = () => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return { w: rect?.width || 1, h: rect?.height || 1 };
  };

  const animateCamera = (x: number, y: number, scale: number) => {
    cameraRef.current.target = { x, y, scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale)) };
  };

  /** Frame every visible node in the viewport. */
  const fitView = useCallback(() => {
    const simNodes = simNodesRef.current;
    if (!simNodes.length) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of simNodes) {
      minX = Math.min(minX, n.x - n.radius);
      maxX = Math.max(maxX, n.x + n.radius + 90); // leave room for labels
      minY = Math.min(minY, n.y - n.radius);
      maxY = Math.max(maxY, n.y + n.radius);
    }
    const { w, h } = getViewSize();
    const pad = 60;
    const scale = Math.min((w - pad * 2) / Math.max(1, maxX - minX), (h - pad * 2) / Math.max(1, maxY - minY), 1.6);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    animateCamera(-cx * scale, -cy * scale, scale);
  }, []);

  // Keep the graph framed while the physics settles, until the user takes over
  useEffect(() => {
    const timers = [300, 800, 1500, 2400].map((ms) =>
      window.setTimeout(() => {
        if (!userMovedCameraRef.current) fitView();
      }, ms)
    );
    const done = window.setTimeout(() => (hasAutoFitRef.current = true), 2500);
    return () => [...timers, done].forEach((t) => window.clearTimeout(t));
  }, [fitView]);

  // When a note is selected elsewhere (file tree, search), bring it into view
  useEffect(() => {
    if (!selectedNodeId || !hasAutoFitRef.current) return;
    if (selectionFromCanvasRef.current) {
      selectionFromCanvasRef.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      const node = simNodesRef.current.find((n) => n.id === selectedNodeId);
      if (!node) return;
      const cam = cameraRef.current;
      const { w, h } = getViewSize();
      const sx = node.x * cam.scale + cam.x;
      const sy = node.y * cam.scale + cam.y;
      const margin = 80;
      if (Math.abs(sx) > w / 2 - margin || Math.abs(sy) > h / 2 - margin) {
        animateCamera(-node.x * cam.scale, -node.y * cam.scale, cam.scale);
      }
    }, 50);
    return () => window.clearTimeout(t);
  }, [selectedNodeId]);

  // ---- Pointer interaction: pan, drag, hover, click ---------------------
  const endPointerInteraction = useCallback(() => {
    if (draggedNodeRef.current) {
      draggedNodeRef.current.isDragging = false;
      draggedNodeRef.current = null;
    }
    cameraRef.current.isPanning = false;
    if (canvasRef.current) canvasRef.current.style.cursor = 'default';
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    userMovedCameraRef.current = true;
    cameraRef.current.target = null;
    pointerDownRef.current = { x: e.clientX, y: e.clientY };
    const world = screenToWorld(e.clientX, e.clientY);
    const hitNode = findNodeAtPos(world.x, world.y);

    if (hitNode) {
      draggedNodeRef.current = hitNode;
      hitNode.isDragging = true;
    } else {
      cameraRef.current.isPanning = true;
      cameraRef.current.panStartX = e.clientX;
      cameraRef.current.panStartY = e.clientY;
      cameraRef.current.camStartX = cameraRef.current.x;
      cameraRef.current.camStartY = cameraRef.current.y;
      if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const world = screenToWorld(e.clientX, e.clientY);

    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = world.x;
      draggedNodeRef.current.y = world.y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
      if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
      return;
    }

    if (cameraRef.current.isPanning) {
      cameraRef.current.x = cameraRef.current.camStartX + (e.clientX - cameraRef.current.panStartX);
      cameraRef.current.y = cameraRef.current.camStartY + (e.clientY - cameraRef.current.panStartY);
      return;
    }

    const hitNode = findNodeAtPos(world.x, world.y);
    hoveredNodeRef.current = hitNode;
    if (canvasRef.current) canvasRef.current.style.cursor = hitNode ? 'pointer' : 'grab';
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const down = pointerDownRef.current;
    const moved = down ? Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4 : false;
    pointerDownRef.current = null;

    if (draggedNodeRef.current) {
      const dragged = draggedNodeRef.current;
      if (!moved) {
        selectionFromCanvasRef.current = true;
        selectNode(dragged.id);
      }
    } else if (cameraRef.current.isPanning && !moved) {
      selectNode(null);
    }
    endPointerInteraction();
  };

  // Releasing the mouse outside the canvas must not leave a drag/pan stuck
  useEffect(() => {
    window.addEventListener('mouseup', endPointerInteraction);
    return () => window.removeEventListener('mouseup', endPointerInteraction);
  }, [endPointerInteraction]);

  const handleMouseLeave = () => {
    hoveredNodeRef.current = null;
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const world = screenToWorld(e.clientX, e.clientY);
    const hitNode = findNodeAtPos(world.x, world.y);
    if (hitNode) {
      selectionFromCanvasRef.current = true;
      openNote(hitNode.id);
    }
  };

  // Cursor-centered wheel zoom. Registered natively because React's wheel
  // listener is passive and cannot prevent page scroll / pinch zoom.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
        userMovedCameraRef.current = true;
      const camera = cameraRef.current;
      camera.target = null;
      // Trackpads send small deltas; scale the zoom with the delta for smoothness
      const zoomFactor = Math.exp(-Math.max(-60, Math.min(60, e.deltaY)) * 0.004);
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, camera.scale * zoomFactor));
      const k = newScale / camera.scale;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;
      camera.x = mouseX - (mouseX - camera.x) * k;
      camera.y = mouseY - (mouseY - camera.y) * k;
      camera.scale = newScale;
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, []);

  // Close the graph settings popover on Escape or outside click
  useEffect(() => {
    if (!isSettingsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsSettingsOpen(false);
    const onDown = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setIsSettingsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
  }, [isSettingsOpen]);

  // ---- Selected note summary -------------------------------------------
  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
  const selectedLinks = useMemo(() => {
    if (!selectedNodeId) return [];
    const ids = new Set<string>();
    edges.forEach((e) => {
      if (e.source === selectedNodeId) ids.add(e.target);
      if (e.target === selectedNodeId) ids.add(e.source);
    });
    return nodes.filter((n) => ids.has(n.id));
  }, [selectedNodeId, nodes, edges]);

  const visibleCount = visibleNodesAndEdges.filteredNodes.length;
  const isFiltered = visibleCount !== nodes.length;

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#000000] overflow-hidden select-none">
      {/* Floating Graph Settings Drawer Toggle (Top Right) */}
      <div ref={settingsRef} className="absolute top-3 right-3 z-20">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          aria-label="Graph settings"
          aria-expanded={isSettingsOpen}
          className={`vault-graph-surface p-2 rounded-full transition-colors ${
            isSettingsOpen ? '!bg-white text-black' : 'text-white/60 hover:text-white'
          }`}
          title="Graph Settings (Filters, Groups, Display, Forces)"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Complete Graph Settings Drawer (Filters, Groups, Display, Forces) */}
        {isSettingsOpen && (
          <div className="vault-graph-surface absolute right-0 top-11 w-72 sm:w-80 rounded-2xl p-4 text-[12px] space-y-4 vault-pop-in text-white z-50">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[14px] tracking-[-0.01em] text-white">
                Graph Settings
              </span>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Category Tab Bar (Filters, Groups, Display, Forces) */}
            <div className="flex items-center bg-white/[0.06] rounded-full p-0.5 text-[12px] font-medium">
              {(['forces', 'display', 'groups', 'filters'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTabSetting(tab)}
                  className={`flex-1 py-1 rounded-full capitalize transition text-center ${
                    activeTabSetting === tab
                      ? 'bg-white text-black'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB 1: FORCES (Physics Engine) */}
            {activeTabSetting === 'forces' && (
              <div className="space-y-3.5 ">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Center force</span>
                    <span className="font-mono text-[#c4b5fd]">{graphSettings.centerForce.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="1.5"
                    step="0.05"
                    value={graphSettings.centerForce}
                    onChange={(e) => setGraphSettings({ centerForce: parseFloat(e.target.value) })}
                    className="w-full accent-[#c4b5fd] h-1 bg-white/10 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Repel force</span>
                    <span className="font-mono text-[#c4b5fd]">{graphSettings.repelForce}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1200"
                    step="50"
                    value={graphSettings.repelForce}
                    onChange={(e) => setGraphSettings({ repelForce: parseInt(e.target.value) })}
                    className="w-full accent-[#c4b5fd] h-1 bg-white/10 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Link force</span>
                    <span className="font-mono text-[#c4b5fd]">{graphSettings.linkForce.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={graphSettings.linkForce}
                    onChange={(e) => setGraphSettings({ linkForce: parseFloat(e.target.value) })}
                    className="w-full accent-[#c4b5fd] h-1 bg-white/10 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Link distance</span>
                    <span className="font-mono text-[#c4b5fd]">{graphSettings.linkDistance}px</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="260"
                    step="10"
                    value={graphSettings.linkDistance}
                    onChange={(e) => setGraphSettings({ linkDistance: parseInt(e.target.value) })}
                    className="w-full accent-[#c4b5fd] h-1 bg-white/10 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: DISPLAY */}
            {activeTabSetting === 'display' && (
              <div className="space-y-3.5 ">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Node size</span>
                    <span className="font-mono text-[#c4b5fd]">{graphSettings.nodeSizeMultiplier.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={graphSettings.nodeSizeMultiplier}
                    onChange={(e) => setGraphSettings({ nodeSizeMultiplier: parseFloat(e.target.value) })}
                    className="w-full accent-[#c4b5fd] h-1 bg-white/10 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Link thickness</span>
                    <span className="font-mono text-[#c4b5fd]">{graphSettings.linkThickness.toFixed(1)}px</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.2"
                    value={graphSettings.linkThickness}
                    onChange={(e) => setGraphSettings({ linkThickness: parseFloat(e.target.value) })}
                    className="w-full accent-[#c4b5fd] h-1 bg-white/10 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Label fade</span>
                    <span className="font-mono text-[#c4b5fd]">{graphSettings.textFadeThreshold.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.5"
                    step="0.05"
                    value={graphSettings.textFadeThreshold}
                    onChange={(e) => setGraphSettings({ textFadeThreshold: parseFloat(e.target.value) })}
                    className="w-full accent-[#c4b5fd] h-1 bg-white/10 rounded cursor-pointer"
                  />
                </div>

              </div>
            )}

            {/* TAB 3: GROUPS */}
            {activeTabSetting === 'groups' && (
              <div className="space-y-2.5 ">
                <div className="text-[11px] text-white/60 mb-1">
                  Colors by folder or tag
                </div>
                {graphSettings.groups.map((grp) => (
                  <div
                    key={grp.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.05] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: grp.color }} />
                      <span className="font-medium text-white">{grp.query}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40">{grp.color}</span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: FILTERS */}
            {activeTabSetting === 'filters' && (
              <div className="space-y-3 ">
                <div className="space-y-1">
                  <label className="text-[12px] text-white/60">
                    Filter notes
                  </label>
                  <div className="flex items-center gap-1.5 bg-white/[0.06] rounded-xl px-2.5 py-1.5">
                    <Search className="w-3.5 h-3.5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Filter title or folder..."
                      value={graphSettings.searchQuery}
                      onChange={(e) => setGraphSettings({ searchQuery: e.target.value })}
                      className="bg-transparent text-white placeholder-white/35 outline-none w-full text-xs"
                    />
                  </div>
                </div>

                <label className="flex items-center justify-between p-2 rounded-xl bg-white/[0.05] cursor-pointer hover:bg-white/10 transition">
                  <span className="text-xs text-white/80">Show unlinked notes</span>
                  <input
                    type="checkbox"
                    checked={graphSettings.showOrphans}
                    onChange={(e) => setGraphSettings({ showOrphans: e.target.checked })}
                    className="accent-[#c4b5fd] rounded cursor-pointer"
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
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDoubleClick}
        className="w-full h-full block cursor-grab"
        role="img"
        aria-label={`Knowledge graph with ${visibleCount} notes. Use the file list or search to open notes.`}
      />

      {/* Top-left: label and active filter */}
      <div className="absolute top-3.5 left-4 z-10 flex flex-col gap-2.5 pointer-events-none">
        <div className="text-[11px] font-mono text-white/40 tracking-wide">
          graph · {visibleCount} notes
        </div>
        {isFiltered && (
          <div className="vault-graph-surface pointer-events-auto flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] text-white/75">
            <Search className="w-3 h-3 text-white/45" />
            Showing {visibleCount} of {nodes.length} notes
            <button
              onClick={() => setGraphSettings({ searchQuery: '', showOrphans: true })}
              className="text-[#c4b5fd] font-medium hover:text-white"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Bottom-left: selected note card */}
      {selectedNode ? (
        <div
          key={selectedNode.id}
          className="vault-graph-surface absolute bottom-4 left-4 z-10 w-[min(300px,calc(100%-80px))] rounded-2xl p-4 vault-pop-in"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[11px] font-mono text-white/40 truncate">{selectedNode.folder}</div>
              <div className="text-[16px] font-semibold tracking-[-0.01em] text-white truncate">{selectedNode.label}</div>
            </div>
            <button
              onClick={() => selectNode(null)}
              className="p-1 -m-1 rounded-full text-white/40 hover:text-white"
              aria-label="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-1 text-[12px] text-white/50">
            {selectedLinks.length === 0
              ? 'No connections yet'
              : `${selectedLinks.length} connection${selectedLinks.length === 1 ? '' : 's'}`}
          </div>
          {selectedLinks.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {selectedLinks.slice(0, 4).map((n) => (
                <button
                  key={n.id}
                  onClick={() => selectNode(n.id)}
                  className="max-w-[130px] truncate rounded-md bg-white/[0.07] px-2 py-0.5 text-[11px] font-mono text-white/70 hover:bg-white/15 hover:text-white transition-colors"
                >
                  {n.label}
                </button>
              ))}
              {selectedLinks.length > 4 && (
                <span className="px-1 py-0.5 text-[11px] text-white/40">+{selectedLinks.length - 4}</span>
              )}
            </div>
          )}
          <div className="mt-4 flex gap-2">
            {!compact && (
              <button
                onClick={() => openNote(selectedNode.id)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-white hover:bg-white/90 px-3 py-1.5 text-[13px] font-medium text-black transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Open note
              </button>
            )}
            <button
              onClick={() =>
                sendMessageToAI(
                  `Explore and expand on [[${selectedNode.label}]]. What new concepts or cross-disciplinary connections should be linked in the vault?`
                )
              }
              disabled={isChatLoading}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-white/10 hover:bg-white/15 px-3 py-1.5 text-[13px] font-medium text-white disabled:opacity-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Expand
            </button>
          </div>
        </div>
      ) : null}

      {/* Empty state */}
      {visibleCount === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white/45 text-[13px] font-mono">
            {nodes.length === 0 ? 'No notes yet. Create one to start your graph.' : 'No notes match the current filter.'}
          </div>
        </div>
      )}
    </div>
  );
};
