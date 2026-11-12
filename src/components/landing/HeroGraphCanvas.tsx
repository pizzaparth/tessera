import React, { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  category: 'ai' | 'graph' | 'markdown' | 'physics' | 'amoled';
  degree: number;
}

interface Edge {
  source: string;
  target: string;
  strength: number;
}

interface Particle {
  sourceNodeId: string;
  targetNodeId: string;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

export const HeroGraphCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeTelemetry, setActiveTelemetry] = useState({
    fps: 60,
    nodeCount: 28,
    edgeCount: 46,
    coulombForce: '1240 N',
    activeModel: 'Claude 3.7 Sonnet',
  });

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pulseAnnouncement, setPulseAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 540);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initial Node Cluster
    const initialNodes: Node[] = [
      { id: '1', label: 'Universal AI Engine', x: width * 0.5, y: height * 0.45, vx: 0, vy: 0, radius: 14, color: '#9d4edd', glowColor: 'rgba(157, 78, 221, 0.7)', category: 'ai', degree: 8 },
      { id: '2', label: 'Claude 3.7 Sonnet', x: width * 0.38, y: height * 0.32, vx: 0, vy: 0, radius: 10, color: '#00f5ff', glowColor: 'rgba(0, 245, 255, 0.6)', category: 'ai', degree: 4 },
      { id: '3', label: 'GPT-4o Reasoning', x: width * 0.62, y: height * 0.34, vx: 0, vy: 0, radius: 9, color: '#00ff88', glowColor: 'rgba(0, 255, 136, 0.6)', category: 'ai', degree: 4 },
      { id: '4', label: 'DeepSeek R1', x: width * 0.48, y: height * 0.25, vx: 0, vy: 0, radius: 9, color: '#00f5ff', glowColor: 'rgba(0, 245, 255, 0.6)', category: 'ai', degree: 3 },
      { id: '5', label: 'Gemini 2.0 Flash', x: width * 0.32, y: height * 0.48, vx: 0, vy: 0, radius: 8, color: '#ffb703', glowColor: 'rgba(255, 183, 3, 0.6)', category: 'ai', degree: 3 },
      { id: '6', label: 'AMOLED Pure Black', x: width * 0.52, y: height * 0.65, vx: 0, vy: 0, radius: 12, color: '#ff2a85', glowColor: 'rgba(255, 42, 133, 0.7)', category: 'amoled', degree: 6 },
      { id: '7', label: '60 FPS Physics', x: width * 0.68, y: height * 0.55, vx: 0, vy: 0, radius: 9, color: '#00ff88', glowColor: 'rgba(0, 255, 136, 0.6)', category: 'physics', degree: 5 },
      { id: '8', label: 'Coulomb Repulsion', x: width * 0.78, y: height * 0.45, vx: 0, vy: 0, radius: 7, color: '#00ff88', glowColor: 'rgba(0, 255, 136, 0.5)', category: 'physics', degree: 3 },
      { id: '9', label: 'Hooke Spring Wire', x: width * 0.74, y: height * 0.68, vx: 0, vy: 0, radius: 7, color: '#00f5ff', glowColor: 'rgba(0, 245, 255, 0.5)', category: 'physics', degree: 3 },
      { id: '10', label: 'Wikilink [[Synapse]]', x: width * 0.35, y: height * 0.68, vx: 0, vy: 0, radius: 10, color: '#9d4edd', glowColor: 'rgba(157, 78, 221, 0.6)', category: 'markdown', degree: 5 },
      { id: '11', label: 'Bidirectional Backlinks', x: width * 0.22, y: height * 0.62, vx: 0, vy: 0, radius: 8, color: '#9d4edd', glowColor: 'rgba(157, 78, 221, 0.5)', category: 'markdown', degree: 3 },
      { id: '12', label: 'Markdown GFM', x: width * 0.24, y: height * 0.78, vx: 0, vy: 0, radius: 7, color: '#ffb703', glowColor: 'rgba(255, 183, 3, 0.5)', category: 'markdown', degree: 3 },
      { id: '13', label: 'Retina 2D Canvas', x: width * 0.60, y: height * 0.78, vx: 0, vy: 0, radius: 8, color: '#ff2a85', glowColor: 'rgba(255, 42, 133, 0.6)', category: 'graph', degree: 4 },
      { id: '14', label: 'Neural Plasticity', x: width * 0.44, y: height * 0.54, vx: 0, vy: 0, radius: 9, color: '#00f5ff', glowColor: 'rgba(0, 245, 255, 0.6)', category: 'ai', degree: 4 },
      { id: '15', label: 'Zero Wires Clutter', x: width * 0.85, y: height * 0.58, vx: 0, vy: 0, radius: 6, color: '#9d4edd', glowColor: 'rgba(157, 78, 221, 0.5)', category: 'graph', degree: 2 },
      { id: '16', label: 'Local-First Vault', x: width * 0.15, y: height * 0.45, vx: 0, vy: 0, radius: 8, color: '#00ff88', glowColor: 'rgba(0, 255, 136, 0.6)', category: 'markdown', degree: 3 },
      { id: '17', label: 'Parth Pancholi Lab', x: width * 0.50, y: height * 0.14, vx: 0, vy: 0, radius: 10, color: '#ff2a85', glowColor: 'rgba(255, 42, 133, 0.7)', category: 'ai', degree: 4 },
      { id: '18', label: 'Dynamic Ingestion', x: width * 0.42, y: height * 0.22, vx: 0, vy: 0, radius: 7, color: '#00ff88', glowColor: 'rgba(0, 255, 136, 0.5)', category: 'ai', degree: 3 },
      { id: '19', label: 'Graph Topology', x: width * 0.64, y: height * 0.22, vx: 0, vy: 0, radius: 7, color: '#9d4edd', glowColor: 'rgba(157, 78, 221, 0.5)', category: 'graph', degree: 3 },
      { id: '20', label: 'KaTeX Formulas', x: width * 0.18, y: height * 0.72, vx: 0, vy: 0, radius: 6, color: '#ffb703', glowColor: 'rgba(255, 183, 3, 0.5)', category: 'markdown', degree: 2 },
    ];

    const initialEdges: Edge[] = [
      { source: '1', target: '2', strength: 0.8 },
      { source: '1', target: '3', strength: 0.8 },
      { source: '1', target: '4', strength: 0.7 },
      { source: '1', target: '5', strength: 0.7 },
      { source: '1', target: '6', strength: 0.9 },
      { source: '1', target: '14', strength: 0.85 },
      { source: '1', target: '10', strength: 0.75 },
      { source: '1', target: '17', strength: 0.9 },
      { source: '6', target: '7', strength: 0.8 },
      { source: '6', target: '13', strength: 0.85 },
      { source: '7', target: '8', strength: 0.7 },
      { source: '7', target: '9', strength: 0.7 },
      { source: '7', target: '15', strength: 0.6 },
      { source: '10', target: '11', strength: 0.8 },
      { source: '10', target: '12', strength: 0.75 },
      { source: '11', target: '16', strength: 0.7 },
      { source: '12', target: '20', strength: 0.6 },
      { source: '13', target: '9', strength: 0.7 },
      { source: '2', target: '18', strength: 0.7 },
      { source: '3', target: '19', strength: 0.7 },
      { source: '4', target: '17', strength: 0.65 },
      { source: '14', target: '10', strength: 0.6 },
      { source: '14', target: '6', strength: 0.7 },
      { source: '17', target: '2', strength: 0.6 },
      { source: '17', target: '3', strength: 0.6 },
      { source: '8', target: '15', strength: 0.5 },
    ];

    const nodes = initialNodes;
    const edges = initialEdges;

    // Continuous traveling energy particles
    const particles: Particle[] = [];
    for (let i = 0; i < 24; i++) {
      const edge = edges[Math.floor(Math.random() * edges.length)];
      particles.push({
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
        color: ['#00f5ff', '#9d4edd', '#00ff88', '#ff2a85'][Math.floor(Math.random() * 4)],
        size: 2.2 + Math.random() * 1.8,
      });
    }

    // Dynamic AI Pulse Waves
    interface PulseWave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      color: string;
    }
    const pulseWaves: PulseWave[] = [];

    // Autonomous AI Model Switcher Cycle
    const models = ['Claude 3.7 Sonnet', 'GPT-4o Reasoning', 'DeepSeek R1', 'Gemini 2.0 Flash'];
    let modelIndex = 0;
    const pulsePhrases = [
      'Claude 3.7 synthesized [[Quantum Superposition]]',
      'GPT-4o injected 3 semantic synapses into vault',
      'DeepSeek R1 resolved topological manifold',
      'Gemini 2.0 dynamic backlink propagated',
    ];

    const pulseInterval = setInterval(() => {
      modelIndex = (modelIndex + 1) % models.length;
      const activeModelName = models[modelIndex];
      setActiveTelemetry((prev) => ({
        ...prev,
        activeModel: activeModelName,
        edgeCount: 46 + (modelIndex % 4) * 2,
        nodeCount: 20 + (modelIndex % 3),
      }));

      // Trigger wave from center node
      const centerNode = nodes.find((n) => n.id === '1') || nodes[0];
      pulseWaves.push({
        x: centerNode.x,
        y: centerNode.y,
        radius: 10,
        maxRadius: Math.min(width, height) * 0.45,
        alpha: 0.9,
        color: ['#9d4edd', '#00f5ff', '#00ff88', '#ff2a85'][modelIndex],
      });

      setPulseAnnouncement(pulsePhrases[modelIndex]);
      setTimeout(() => setPulseAnnouncement(null), 2400);
    }, 4200);

    // Mouse Interaction
    let mouseX = -1000;
    let mouseY = -1000;
    let isMouseDown = false;
    let draggedNode: Node | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      let foundHover: string | null = null;
      for (const node of nodes) {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        if (Math.hypot(dx, dy) < node.radius + 6) {
          foundHover = node.id;
          break;
        }
      }
      setHoveredNode(foundHover);

      if (isMouseDown && draggedNode) {
        draggedNode.x = mouseX;
        draggedNode.y = mouseY;
        draggedNode.vx = 0;
        draggedNode.vy = 0;
      }
    };

    const handleMouseDown = () => {
      isMouseDown = true;
      for (const node of nodes) {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        if (Math.hypot(dx, dy) < node.radius + 8) {
          draggedNode = node;
          break;
        }
      }
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      draggedNode = null;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      isMouseDown = false;
      draggedNode = null;
      setHoveredNode(null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // 60 FPS Physics Simulation Loop
    let time = 0;
    const nodeMap = new Map<string, Node>();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const render = () => {
      time += 0.015;

      // AMOLED Pitch Black Base
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Delicate Ambient Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Physics Calculation
      const kCoulomb = 950;
      const kSpring = 0.018;
      const damping = 0.88;
      const centerPull = 0.0006;
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Coulomb Repulsion between every pair
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 320) {
            const force = (kCoulomb / (dist * dist)) * (a.radius + b.radius) * 0.1;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            a.vx -= fx;
            a.vy -= fy;
            b.vx += fx;
            b.vy += fy;
          }
        }
      }

      // 2. Hooke's Law Spring Attraction along Edges
      for (const edge of edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) continue;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.hypot(dx, dy) || 1;
        const idealDist = 110;
        const displacement = dist - idealDist;
        const force = displacement * kSpring * edge.strength;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
      }

      // 3. Center Gravity & Gentle Autonomous Oscillation
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node === draggedNode) continue;

        // Weak center pull
        node.vx += (centerX - node.x) * centerPull;
        node.vy += (centerY - node.y) * centerPull;

        // Gentle floating harmonic breath
        node.vx += Math.sin(time + i * 0.7) * 0.12;
        node.vy += Math.cos(time + i * 0.9) * 0.12;

        // Cursor Repulsion if close
        const mdx = node.x - mouseX;
        const mdy = node.y - mouseY;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 120 && mdist > 0) {
          const mForce = ((120 - mdist) / 120) * 1.5;
          node.vx += (mdx / mdist) * mForce;
          node.vy += (mdy / mdist) * mForce;
        }

        // Apply Velocity & Damping
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;

        // Keep inside bounds with elastic bounce
        const pad = node.radius + 15;
        if (node.x < pad) {
          node.x = pad;
          node.vx *= -0.5;
        }
        if (node.x > width - pad) {
          node.x = width - pad;
          node.vx *= -0.5;
        }
        if (node.y < pad) {
          node.y = pad;
          node.vy *= -0.5;
        }
        if (node.y > height - pad) {
          node.y = height - pad;
          node.vy *= -0.5;
        }
      }

      // Render Expanding Pulse Waves
      for (let i = pulseWaves.length - 1; i >= 0; i--) {
        const wave = pulseWaves[i];
        wave.radius += 3.2;
        wave.alpha *= 0.965;

        ctx.save();
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = Math.max(0, wave.alpha);
        ctx.lineWidth = 1.8;
        ctx.shadowColor = wave.color;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();

        if (wave.alpha < 0.02 || wave.radius > wave.maxRadius) {
          pulseWaves.splice(i, 1);
        }
      }

      // Render Edges (Zero-Clutter delicate connecting wires with neon glow)
      for (const edge of edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) continue;

        const isHighlight =
          hoveredNode === source.id || hoveredNode === target.id;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (isHighlight) {
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 2.2;
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 12;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
          ctx.lineWidth = 1.0;
        }
        ctx.stroke();
        ctx.restore();
      }

      // Render Continuous Traveling Light Particles
      for (const p of particles) {
        const s = nodeMap.get(p.sourceNodeId);
        const t = nodeMap.get(p.targetNodeId);
        if (!s || !t) continue;

        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          // Reverse direction or switch edge randomly
          const newEdge = edges[Math.floor(Math.random() * edges.length)];
          p.sourceNodeId = newEdge.source;
          p.targetNodeId = newEdge.target;
        }

        const px = s.x + (t.x - s.x) * p.progress;
        const py = s.y + (t.y - s.y) * p.progress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }

      // Render Nodes & Labels
      for (const node of nodes) {
        const isHover = hoveredNode === node.id;
        const pulse = Math.sin(time * 3 + node.radius) * 1.5;
        const r = isHover ? node.radius + 4 : node.radius + pulse * 0.3;

        // Outer Glow Aura
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = node.glowColor;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isHover ? 24 : 14;
        ctx.fill();
        ctx.restore();

        // Node Solid Core
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#050505';
        ctx.fill();
        ctx.lineWidth = isHover ? 2.5 : 1.8;
        ctx.strokeStyle = node.color;
        ctx.stroke();
        ctx.restore();

        // High-contrast clean AMOLED typography label
        ctx.save();
        ctx.font = isHover
          ? '600 12px Inter, sans-serif'
          : '500 11px Inter, sans-serif';
        ctx.fillStyle = isHover ? '#ffffff' : 'rgba(255, 255, 255, 0.88)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
        ctx.fillText(node.label, node.x, node.y + r + 5);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(pulseInterval);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[540px] lg:h-[600px] bg-black rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] select-none group"
    >
      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Top macOS AMOLED Window Bar */}
      <div className="absolute top-0 inset-x-0 h-10 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 flex items-center justify-between text-xs text-white/70 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-white/50 tracking-wider">
            brain-vault-engine.canvas2d
          </span>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-[#00ff88]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
            60.0 FPS
          </span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="hidden sm:inline text-white/80">
            {activeTelemetry.nodeCount} Nodes
          </span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="text-[#00f5ff] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff]" />
            {activeTelemetry.activeModel}
          </span>
        </div>
      </div>

      {/* Autonomous Synthesis Toast Pill */}
      {pulseAnnouncement && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-300">
          <div className="px-3 py-1.5 rounded-full bg-black/90 border border-[#9d4edd]/60 text-white text-xs font-medium shadow-[0_0_20px_rgba(157,78,221,0.5)] flex items-center gap-2 backdrop-blur-md animate-bounce">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
            <span className="text-[#c084fc] font-mono text-[11px]">Dynamic AI Expansion:</span>
            <span>{pulseAnnouncement}</span>
          </div>
        </div>
      )}

      {/* Bottom Floating Telemetry HUD */}
      <div className="absolute bottom-3 inset-x-3 pointer-events-none flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/70">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white/90">
            <span className="w-2 h-2 rounded-full bg-[#9d4edd] animate-pulse" />
            <span>AMOLED `#000000` True Contrast</span>
          </span>
          <span className="text-white/30">|</span>
          <span className="hidden md:inline text-white/60">
            Coulomb Repulsion: {activeTelemetry.coulombForce}
          </span>
        </div>

        <div className="flex items-center gap-3 text-white/50 text-[10px]">
          <span className="text-white/70">⚡ Drag or hover nodes to interact</span>
          <span className="hidden sm:inline text-emerald-400 font-semibold">
            ● 100% Client-Side Physics
          </span>
        </div>
      </div>
    </div>
  );
};
