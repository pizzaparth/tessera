import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Layers,
  FileText,
  Activity,
  ShieldCheck,
  ArrowRight,
  GitBranch,
  Terminal,
  Database,
  Lock,
  Cpu,
  Compass,
  CheckCircle,
  Quote,
  ExternalLink,
  Code,
  Globe,
  Share2,
} from 'lucide-react';
import { GuidedDemoWalkthrough } from '../components/landing/GuidedDemoWalkthrough';
import { QuantCarousel } from '../components/landing/QuantCarousel';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-[#07090e]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#07090e] rounded-[6px] flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-base font-bold tracking-wider text-white">
                TESSERA
              </span>
              <span className="text-[10px] text-slate-500 font-mono -mt-1 tracking-widest uppercase">
                Quant Knowledge System
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#demo" className="hover:text-white transition">
              Interactive Demo
            </a>
            <a href="#features" className="hover:text-white transition">
              Capabilities
            </a>
            <a href="#workflow" className="hover:text-white transition">
              Research Cycle
            </a>
            <a href="#showcase" className="hover:text-white transition">
              Analytics
            </a>
            <a href="#creators-note" className="hover:text-white transition">
              Creator's Note
            </a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Explore the Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-surface-border">
        {/* Subtle grid and ambient glow */}
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Stateless In-Memory Quantitative Research Graph</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-sans"
            >
              Turn Quantitative Conversations into{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
                Connected Knowledge Maps
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto"
            >
              A browser-based research workspace unifying chat-driven concept extraction, an Obsidian-like interactive knowledge graph, and Markdown notes with LaTeX equations.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <Link
                to="/app"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <span>Launch Demo Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#demo"
                className="bg-surface-card hover:bg-surface border border-surface-border text-slate-300 hover:text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
              >
                Watch Guided Walkthrough
              </a>
            </motion.div>

            {/* No-account trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-500 font-mono"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>No sign-up required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ready-made sample library</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>Zero persistence / In-memory state</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Guided Product Demonstration Walkthrough */}
      <section id="demo" className="py-20 border-b border-surface-border bg-[#080b12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest">
              Section 2 • Scripted Demonstration
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Cinematic Product Walkthrough
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Observe how a research conversation is parsed into candidate concepts, reviewed by the researcher, connected with typed links, and visualized in graph analytics.
            </p>
          </div>

          <GuidedDemoWalkthrough />
        </div>
      </section>

      {/* 3. Feature Cards Section */}
      <section id="features" className="py-20 border-b border-surface-border bg-[#07090e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
              Section 3 • Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Engineered for Quantitative Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built on five pillars designed to bridge conversations, rigorous mathematical formulas, and topological graph measures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-surface-border hover:border-emerald-500/40 transition group space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">AI-Assisted Conversation Mapping</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste transcripts, trading discussions, or paper excerpts. AI proposes candidate concepts, claims, questions, and relationships for review before adding them to your session graph.
              </p>
              <div className="text-[11px] font-mono text-emerald-400/80 pt-2">
                OpenAI • Anthropic • Gemini compatible
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-surface-border hover:border-cyan-500/40 transition group space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Obsidian-Like Knowledge Graph</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore an interactive Cytoscape.js canvas with force-directed physics, concentric rings, neighborhood zoom, and shortest-path calculation between distant quantitative ideas.
              </p>
              <div className="text-[11px] font-mono text-cyan-400/80 pt-2">
                Cytoscape.js • 5 Physics Layouts
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-surface-border hover:border-purple-500/40 transition group space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Markdown Notes & LaTeX Formulas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every concept node links to a dedicated Markdown note. Includes math rendering for CAPM, Kyle's lambda, and GARCH formulations, plus an in-memory session timeline.
              </p>
              <div className="text-[11px] font-mono text-purple-400/80 pt-2">
                KaTeX • Remark-Math • Split View
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-surface-border hover:border-amber-500/40 transition group space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Descriptive Graph Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time topological insights: degree centrality, cross-domain bridge concepts, and domain volume charts without confusing structural metrics with financial advice.
              </p>
              <div className="text-[11px] font-mono text-amber-400/80 pt-2">
                Recharts • Centrality • Density
              </div>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-surface-border hover:border-rose-500/40 transition group space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Explicit Typed Relationships</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connections carry structural meaning: <em>depends on</em>, <em>extends</em>, <em>measures</em>, <em>uses data from</em>, <em>supports</em>, and <em>challenges</em>.
              </p>
              <div className="text-[11px] font-mono text-rose-400/80 pt-2">
                8 Explicit Relational Semantics
              </div>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-surface-border hover:border-teal-500/40 transition group space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Audit Trail & Provenance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every extracted claim preserves its verbatim source quote, confidence score, and origin badge (AI suggested vs researcher authored), keeping facts auditable.
              </p>
              <div className="text-[11px] font-mono text-teal-400/80 pt-2">
                Source Verbatim • Confidence Badges
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Research Workflow Section */}
      <section id="workflow" className="py-20 border-b border-surface-border bg-[#080b12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest">
              Section 4 • Research Cycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              From Conversation to Synthesized Brief
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A 5-step loop putting the quantitative researcher firmly in control of the model.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Start with Discussion',
                desc: 'Paste a research transcript, meeting note, or trading anomaly observation.',
              },
              {
                step: '02',
                title: 'Extract Structure',
                desc: 'AI proposes candidate models, datasets, and open questions with source citations.',
              },
              {
                step: '03',
                title: 'Review & Link',
                desc: 'Inspect suggestions, refine terminology, and approve typed relational edges.',
              },
              {
                step: '04',
                title: 'Explore Topology',
                desc: 'Inspect clusters, path connections, and bridge nodes in the knowledge graph.',
              },
              {
                step: '05',
                title: 'Draft Synthesis',
                desc: 'Compile references into an empirical research brief with next experiments.',
              },
            ].map((st, i) => (
              <div
                key={st.step}
                className="p-5 rounded-xl bg-surface border border-surface-border relative space-y-2 flex flex-col justify-between"
              >
                <div className="font-mono text-2xl font-bold text-emerald-400/40">{st.step}</div>
                <div>
                  <h4 className="text-sm font-bold text-white">{st.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Graph and Analytics Showcase */}
      <section id="showcase" className="py-20 border-b border-surface-border bg-[#07090e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
                Section 5 • Network Showcase
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Quantitative Finance Concept Graph
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Explore how factor research, market microstructure, portfolio construction, and risk management intertwine.
              </p>
            </div>

            <Link
              to="/app"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition"
            >
              <span>Open Global Graph in Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-surface-card border border-surface-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-[#080b12] border border-surface-border space-y-1">
              <div className="text-2xl font-bold font-mono text-emerald-400">15+</div>
              <div className="text-xs text-slate-300">Quant Concepts</div>
              <div className="text-[10px] text-slate-500">Peer-reviewed models</div>
            </div>
            <div className="p-4 rounded-xl bg-[#080b12] border border-surface-border space-y-1">
              <div className="text-2xl font-bold font-mono text-cyan-400">12+</div>
              <div className="text-xs text-slate-300">Typed Edges</div>
              <div className="text-[10px] text-slate-500">Extends, measures, depends on</div>
            </div>
            <div className="p-4 rounded-xl bg-[#080b12] border border-surface-border space-y-1">
              <div className="text-2xl font-bold font-mono text-purple-400">6</div>
              <div className="text-xs text-slate-300">Core Domains</div>
              <div className="text-[10px] text-slate-500">Factors, Execution, Risk</div>
            </div>
            <div className="p-4 rounded-xl bg-[#080b12] border border-surface-border space-y-1">
              <div className="text-2xl font-bold font-mono text-amber-400">0 KB</div>
              <div className="text-xs text-slate-300">Persisted Disk Data</div>
              <div className="text-[10px] text-slate-500">100% in-memory demo</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Carousel Section */}
      <section className="py-20 border-b border-surface-border bg-[#080b12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest">
              Section 6 • Research Case Studies
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Quantitative Domains & Anomaly Studies
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Browse through built-in research problems spanning factor construction, limit order book depth, and risk management.
            </p>
          </div>

          <QuantCarousel />
        </div>
      </section>

      {/* 7. Creator's Note Section */}
      <section id="creators-note" className="py-20 border-b border-surface-border bg-[#07090e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-surface-card to-[#0d121c] border border-slate-700/80 shadow-2xl relative overflow-hidden space-y-6"
          >
            {/* Top quote icon */}
            <Quote className="w-12 h-12 text-emerald-500/20 absolute -top-2 -left-2 rotate-180" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
                <span>Creator's Note</span>
              </div>

              <blockquote className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed italic">
                “I built TESSERA to explore how AI, graph theory, and quantitative research can come together in one focused workspace. The project is a chance to make research connections visible and to learn by building the tools I would want to use.”
              </blockquote>

              <div className="pt-4 flex items-center justify-between border-t border-surface-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5">
                    <div className="w-full h-full bg-[#07090e] rounded-full flex items-center justify-center font-bold text-white text-xs font-mono">
                      P
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">— Parth</div>
                    <div className="text-xs text-slate-400 font-mono">Creator of TESSERA</div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-mono hidden sm:block">
                  Personal Portfolio Project
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Final CTA & Footer */}
      <section className="py-20 bg-gradient-to-b from-[#07090e] to-[#040609]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to explore the quantitative graph?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Experience TESSERA directly in your browser. No account required, immediate access to sample models, notes, and graph analytics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/app"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <span>Launch Demo Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-[#05070c] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-300 font-bold">TESSERA</span>
            <span>•</span>
            <span>A quantitative research knowledge system</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>React</span>
            <span>•</span>
            <span>Cytoscape.js</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Motion</span>
          </div>

          <div className="text-slate-600 text-[11px]">
            Stateless Demo • Clears on reload
          </div>
        </div>
      </footer>
    </div>
  );
};
