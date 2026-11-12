import React from 'react';
import {
  Heart,
  Github,
  Code2,
  Terminal,
  Sparkles,
  ExternalLink,
  Layers,
  Cpu,
  Compass,
} from 'lucide-react';

export const CreatorShowcase: React.FC = () => {
  return (
    <section id="creator" className="py-24 bg-[#fafafa] border-t border-[#eaecf0] select-none relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#6d55bd]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-white border border-[#eaecf0] shadow-xl p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column (7 cols): Story & Philosophy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fdf2f8] text-[#db2777] text-xs font-semibold border border-[#fbcfe8]">
                <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span>Personal Hobby Project</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#100f12] tracking-tight leading-tight">
                Crafted with love by <span className="bg-gradient-to-r from-[#6d55bd] to-[#db2777] bg-clip-text text-transparent">Parth Pancholi</span>.
              </h2>

              <p className="text-sm sm:text-base text-[#65646e] leading-relaxed">
                Brain Vault wasn&apos;t born in a corporate boardroom or backed by venture capital. It was built out of a pure obsession with two things: <strong>high-performance browser-based physics</strong> and the conviction that <strong>frontier AI should physically amplify human thought</strong> rather than trap it in closed chat silos.
              </p>

              <p className="text-sm text-[#65646e] leading-relaxed">
                As personal knowledge graphs grow, conventional UI frameworks choke. By writing a custom 60 FPS HTML5 Canvas engine with Coulomb electrostatic repulsion and Hooke spring elasticity, Brain Vault breathes life into thousands of nodes without stuttering.
              </p>

              {/* Core Tenets Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { title: '100% Free Forever', desc: 'No tiered paywalls or subscriptions' },
                  { title: 'Local-First Privacy', desc: 'Your notes never leave your machine' },
                  { title: 'Universal AI Freedom', desc: 'Use any model via standard API keys' },
                  { title: 'Open Source Code', desc: 'Fork, modify, and improve on GitHub' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#fafafa] border border-[#eaecf0] space-y-1"
                  >
                    <div className="font-bold text-xs text-[#100f12] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#6d55bd]" />
                      <span>{item.title}</span>
                    </div>
                    <div className="text-[11px] text-[#65646e]">{item.desc}</div>
                  </div>
                ))}
              </div>

              {/* GitHub Link & Demo Action */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="https://github.com/pizzaparth/tessera"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#100f12] text-white hover:bg-[#252528] text-xs font-semibold shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                  <span>Star on GitHub</span>
                  <ExternalLink className="w-3 h-3 text-white/60" />
                </a>

                <a
                  href="/demo"
                  className="px-5 py-2.5 rounded-xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white text-xs font-semibold shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Experience Live App</span>
                </a>
              </div>
            </div>

            {/* Right Column (5 cols): Creator Profile & Live Stats Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#09090b] text-white p-7 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6d55bd] to-[#00f5ff] p-0.5 flex items-center justify-center shadow-lg">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-base text-white">
                        PP
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Parth Pancholi</h4>
                      <p className="text-xs text-white/60 font-mono">
                        Creator & Systems Craftsman
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-emerald-400 font-mono text-[10px] border border-white/10 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Active Lab
                  </span>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-white/40 text-[10px]">Project License</div>
                    <div className="text-[#00ff88] font-bold">MIT Open Source</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-white/40 text-[10px]">Simulation Rate</div>
                    <div className="text-[#00f5ff] font-bold">60 FPS Canvas</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-white/40 text-[10px]">Models Supported</div>
                    <div className="text-[#ffb703] font-bold">All Frontier APIs</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-white/40 text-[10px]">Monthly Subscriptions</div>
                    <div className="text-[#ff2a85] font-bold">$0.00 / forever</div>
                  </div>
                </div>

                {/* Personal Note Quote */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs text-white/80 italic leading-relaxed">
                  &ldquo;I wanted a tool where thinking feels like interacting with a physical organism — where every note you type pulls on adjacent thoughts and where AI sparks ideas right onto the canvas.&rdquo;
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/10">
                  <span>Repository: pizzaparth/tessera</span>
                  <span className="text-[#c084fc]">v1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
