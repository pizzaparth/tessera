import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Zap,
  Activity,
  GitBranch,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Maximize2,
  Lock,
  Code2,
} from 'lucide-react';

export const ContinuousBentoGrid: React.FC = () => {
  // Mini Physics Canvas Ref for Card 4
  const miniCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const w = (canvas.width = canvas.parentElement?.clientWidth || 320);
    const h = (canvas.height = 180);

    const nodes = [
      { x: w * 0.25, y: h * 0.35, vx: 0.8, vy: 0.6, r: 8, color: '#00f5ff' },
      { x: w * 0.75, y: h * 0.35, vx: -0.6, vy: 0.7, r: 10, color: '#9d4edd' },
      { x: w * 0.5, y: h * 0.75, vx: 0.5, vy: -0.8, r: 9, color: '#00ff88' },
      { x: w * 0.5, y: h * 0.25, vx: -0.4, vy: -0.5, r: 7, color: '#ff2a85' },
    ];

    let t = 0;
    const loop = () => {
      t += 0.02;
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      // Spring physics
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 1;
          const targetDist = 80;
          const force = (dist - targetDist) * 0.003;
          a.vx += (dx / dist) * force;
          a.vy += (dy / dist) * force;
          b.vx -= (dx / dist) * force;
          b.vy -= (dy / dist) * force;

          // Draw spring wire
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Traveling photon
          const progress = (Math.sin(t * 2 + i * 2) + 1) / 2;
          const px = a.x + dx * progress;
          const py = a.y + dy * progress;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = a.color;
          ctx.shadowColor = a.color;
          ctx.shadowBlur = 8;
          ctx.fill();
        }
      }

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < n.r + 5 || n.x > w - n.r - 5) n.vx *= -1;
        if (n.y < n.r + 5 || n.y > h - n.r - 5) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 12;
        ctx.fill();
      }

      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section id="features" className="py-24 bg-[#fafafa] relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f3ff] text-[#6d55bd] text-xs font-semibold border border-[#ddd6fe]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built Without Compromise</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#100f12]">
            Engineered for pure cognitive flow.
          </h2>
          <p className="text-base text-[#65646e] leading-relaxed">
            Every layer of Brain Vault was designed from scratch to deliver an unforgettable thinking experience with continuous physical simulation.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AMOLED True Black Laser Scan (Large, 2 cols on lg) */}
          <div className="lg:col-span-2 rounded-3xl bg-black border border-white/15 p-8 relative overflow-hidden text-white flex flex-col justify-between shadow-xl">
            {/* Background Laser Sweep Beam */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00f5ff] to-transparent shadow-[0_0_15px_#00f5ff] animate-laser-sweep z-10 pointer-events-none" />

            <div className="relative z-20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/10 text-[#00f5ff] text-xs font-mono border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-ping" />
                  AMOLED Pure Black `#000000`
                </span>
                <span className="font-mono text-xs text-white/50">
                  ∞:1 Dynamic Contrast Ratio
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                OLED Pixel Shutoff. Neon Synaptic Brilliance.
              </h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-xl leading-relaxed">
                Unlike ordinary dark modes that settle for murky gray `#1e1e1e`, Brain Vault turns off individual display diodes on OLED and mini-LED screens. Neon nodes in cyan, purple, and mint radiate with zero background light pollution.
              </p>
            </div>

            {/* Split Comparison Visual */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 bg-black/60 relative h-36 flex items-center justify-between p-6">
              <div className="w-1/2 pr-4 border-r border-white/10 opacity-40">
                <div className="text-[10px] font-mono uppercase text-gray-400 mb-2">
                  Legacy Gray Canvas (#1a1a1a)
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-3/4 bg-gray-600 rounded" />
                  <div className="h-3 w-1/2 bg-gray-600 rounded" />
                </div>
              </div>

              <div className="w-1/2 pl-6">
                <div className="text-[10px] font-mono uppercase text-[#00ff88] mb-2 font-bold flex items-center gap-1">
                  <span>● Pure OLED #000000</span>
                  <span className="text-xs text-[#00f5ff]">★ Active</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00f5ff] shadow-[0_0_12px_#00f5ff]" />
                    <div className="h-1.5 w-24 bg-[#9d4edd] rounded-full shadow-[0_0_8px_#9d4edd]" />
                    <div className="w-3 h-3 rounded-full bg-[#ff2a85] shadow-[0_0_12px_#ff2a85]" />
                  </div>
                  <div className="text-[11px] font-mono text-[#00ff88]">
                    100% Zero-Current Diodes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Universal Multi-Model Matrix */}
          <div className="rounded-3xl bg-white border border-[#eaecf0] p-7 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#6d55bd] transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#f5f3ff] text-[#6d55bd] flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-[#100f12]">
                Universal Frontier AI Router
              </h3>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Connect your own API key or use the built-in offline concept expander. Zero vendor lock-in across all major providers.
              </p>

              {/* Live Provider Ticker */}
              <div className="space-y-2 pt-2">
                {[
                  { name: 'Claude 3.7 Sonnet', org: 'Anthropic', color: '#d97706' },
                  { name: 'GPT-4o & o1 Reasoning', org: 'OpenAI', color: '#10b981' },
                  { name: 'DeepSeek R1 / V3', org: 'DeepSeek', color: '#06b6d4' },
                  { name: 'Gemini 2.0 Flash', org: 'Google', color: '#8b5cf6' },
                ].map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#fafafa] border border-[#eaecf0] text-xs font-mono"
                  >
                    <span className="font-medium text-[#100f12] flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full animate-ping"
                        style={{ backgroundColor: m.color }}
                      />
                      {m.name}
                    </span>
                    <span className="text-[10px] text-[#9ca3af]">{m.org}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#eaecf0] flex items-center justify-between text-[11px] text-[#6d55bd] font-semibold">
              <span>Dynamic Node Ingestion</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: 60 FPS HTML5 Physics Playground */}
          <div className="rounded-3xl bg-[#0a0a0a] border border-white/15 p-7 flex flex-col justify-between shadow-xl text-white relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#00ff88] flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 animate-spin-slow" />
                  Hooke & Coulomb Physics
                </span>
                <span className="text-[10px] font-mono text-white/50">60 FPS Loop</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Spring-Electrical Simulation
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Nodes naturally repel like charged particles while synaptic wires pull them together like elastic rubber bands.
              </p>
            </div>

            {/* Live Interactive Physics Canvas */}
            <div className="my-4 rounded-xl overflow-hidden border border-white/10 bg-black">
              <canvas ref={miniCanvasRef} className="w-full h-[140px] block" />
            </div>

            <div className="text-[10px] font-mono text-white/50 flex items-center justify-between">
              <span>Electrostatic Repulsion</span>
              <span className="text-[#00f5ff]">Zero Lag • Pure Math</span>
            </div>
          </div>

          {/* Card 4: Bidirectional Wikilink Synapses */}
          <div className="rounded-3xl bg-white border border-[#eaecf0] p-7 flex flex-col justify-between shadow-lg hover:border-[#6d55bd] transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center font-bold">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#100f12]">
                Bidirectional [[Wikilinks]]
              </h3>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Type standard wikilinks anywhere in your markdown notes. Tessera computes reverse backlinks and dynamic graph edges instantaneously.
              </p>

              {/* Code Snippet Demonstration */}
              <div className="p-3 rounded-xl bg-[#100f12] text-white font-mono text-[11px] space-y-1.5 border border-white/10">
                <div className="text-white/40 text-[9px]">// Note: Neurogenesis.md</div>
                <div className="text-[#00ff88]">
                  Research shows that <span className="text-[#c084fc] underline">[[Brain Plasticity]]</span> activates when reasoning through complex graphs.
                </div>
                <div className="text-[10px] text-amber-400 pt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  +1 Backlink Indexed in 0.1ms
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#eaecf0] flex items-center justify-between text-[11px] text-[#65646e]">
              <span>Obsidian Compatible</span>
              <span className="text-[#6d55bd] font-semibold">100% Markdown</span>
            </div>
          </div>

          {/* Card 5: Free Hobby Project by Parth Pancholi */}
          <div className="rounded-3xl bg-gradient-to-br from-[#6d55bd] to-[#4c369e] text-white p-7 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[50px] rounded-full pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Free & Open Source</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Handcrafted by Parth Pancholi
              </h3>
              <p className="text-xs text-white/90 leading-relaxed">
                Built as a passionate personal hobby project. No venture capital, no subscriptions, no paywalls. Clone it, run it locally, and own your knowledge forever.
              </p>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between">
              <div className="font-mono text-xs">
                <div className="text-white/70 text-[10px]">Creator</div>
                <div className="font-bold text-white">Parth Pancholi</div>
              </div>
              <a
                href="https://github.com/pizzaparth/tessera"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white text-[#6d55bd] font-bold text-xs hover:bg-white/95 transition shadow-md flex items-center gap-1.5"
              >
                <span>GitHub Repo</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
