import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Layers,
  FileText,
  Activity,
  ArrowRight,
  GitBranch,
  CheckCircle,
  Quote,
  Eye,
  Route,
  Zap,
} from 'lucide-react';
import { GuidedDemoWalkthrough } from '../components/landing/GuidedDemoWalkthrough';
import { QuantCarousel } from '../components/landing/QuantCarousel';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#faf9fc] text-slate-900 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900 font-sans">
      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
              <GitBranch className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900">
                TESSERA
              </span>
              <span className="text-[10px] text-slate-500 -mt-0.5 tracking-wide uppercase font-semibold">
                Connected Knowledge Map
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-600 font-medium">
            <a href="#walkthrough" className="hover:text-indigo-600 transition">
              Walkthrough
            </a>
            <a href="#features" className="hover:text-indigo-600 transition">
              Capabilities
            </a>
            <a href="#showcase" className="hover:text-indigo-600 transition">
              Graph Showcase
            </a>
            <a href="#carousel" className="hover:text-indigo-600 transition">
              Screens
            </a>
            <a href="#creators-note" className="hover:text-indigo-600 transition">
              Creator's Note
            </a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all hover:scale-[1.02]"
            >
              <span>Try the Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 sm:pt-20 pb-16 overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-white via-[#faf9fc] to-[#f4f2fa]">
        {/* Soft background ambient gradient and dots */}
        <div className="absolute inset-0 bg-canvas-dots opacity-40 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Personal AI-Assisted Knowledge Mapping</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]"
            >
              Turn conversations into{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
                connected knowledge
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
            >
              TESSERA takes a conversation, uses AI to suggest its key concepts and connections, and presents them as an interactive, Obsidian-like graph with Markdown notes behind the nodes.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
            >
              <Link
                to="/app"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <span>Try the Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#walkthrough"
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 px-5 py-3 rounded-xl text-sm font-semibold transition shadow-2xs"
              >
                Watch Product Walkthrough
              </a>
            </motion.div>

            {/* No-account trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-slate-500 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>No sign-up or account required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Preloaded sample knowledge graph</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-violet-600" />
                <span>Session-only state in memory</span>
              </div>
            </motion.div>
          </div>

          {/* Softly Animated Graph Illustration Preview */}
          <div className="mt-12 max-w-4xl mx-auto relative">
            <div className="p-3 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-elevated">
              <div className="rounded-xl bg-gradient-to-tr from-indigo-50/60 via-white to-violet-50/60 border border-slate-100 p-6 sm:p-8 flex items-center justify-center relative overflow-hidden">
                {/* Visual nodes mockup */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 py-4">
                  <div className="px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-900 font-bold text-xs shadow-sm flex items-center gap-2 animate-bounce">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span>Cross-Sectional Momentum</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-indigo-500 font-semibold">
                    <span>─────</span>
                    <span className="px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-100">challenges</span>
                    <span>─────►</span>
                  </div>

                  <div className="px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-rose-900 font-bold text-xs shadow-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Short-Term Reversal</span>
                  </div>

                  <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-semibold">
                    <span>─────</span>
                    <span className="px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">measures</span>
                    <span>─────►</span>
                  </div>

                  <div className="px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-900 font-bold text-xs shadow-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Kyle's Lambda</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Scripted Product Walkthrough Section */}
      <section id="walkthrough" className="py-20 border-b border-slate-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Guided Demonstration
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Scripted Product Walkthrough
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Watch how a conversation is parsed into candidate concepts, reviewed, connected with typed links, and navigated in the interactive graph.
            </p>
          </div>

          <GuidedDemoWalkthrough />
        </div>
      </section>

      {/* 4. Animated Feature Cards Section */}
      <section id="features" className="py-20 border-b border-slate-200/70 bg-[#faf9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Three Focused Pillars
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              AI conversation mapping + an explorable knowledge graph + Markdown notes, with a subtle quantitative touch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: AI Conversation Mapper */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-indigo-300 transition space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Conversation Mapper</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste any text passage or discussion. AI extracts candidate concepts, concise definitions, source excerpts, and typed relationship suggestions.
              </p>
              <div className="text-[11px] font-semibold text-indigo-600 pt-2">
                Human-in-the-loop review queue
              </div>
            </motion.div>

            {/* Feature 2: Obsidian-like Knowledge Graph */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-emerald-300 transition space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Obsidian-Like Graph View</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore an interactive Cytoscape.js canvas with organic force-directed physics, neighborhood ego zooms, and directional typed relationships.
              </p>
              <div className="text-[11px] font-semibold text-emerald-700 pt-2">
                Global & local neighborhood modes
              </div>
            </motion.div>

            {/* Feature 3: Attached Markdown Notes */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:border-violet-300 transition space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Markdown Notes Behind Nodes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every concept node opens an editable Markdown note with definitions, source excerpts, and bidirectional links to related concepts.
              </p>
              <div className="text-[11px] font-semibold text-violet-700 pt-2">
                Live editor with in-session auto-save
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Graph and Analytics Showcase */}
      <section id="showcase" className="py-20 border-b border-slate-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                Network Showcase
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Graph Insights with a Subtle Quant Touch
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                Descriptive topological measures: counts, clusters, highly connected concepts, bridge concepts, and shortest paths.
              </p>
            </div>

            <Link
              to="/app"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5 transition"
            >
              <span>Explore Graph in Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
              <div className="text-2xl font-bold font-mono text-indigo-600">15+</div>
              <div className="text-xs font-semibold text-slate-800">Key Concepts</div>
              <div className="text-[10px] text-slate-500">Sample quant graph</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
              <div className="text-2xl font-bold font-mono text-emerald-600">18+</div>
              <div className="text-xs font-semibold text-slate-800">Typed Links</div>
              <div className="text-[10px] text-slate-500">Depends on, extends, measures</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
              <div className="text-2xl font-bold font-mono text-violet-600">6</div>
              <div className="text-xs font-semibold text-slate-800">Domain Clusters</div>
              <div className="text-[10px] text-slate-500">Factors, Execution, Risk</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
              <div className="text-2xl font-bold font-mono text-amber-600">0 KB</div>
              <div className="text-xs font-semibold text-slate-800">Persisted Disk Data</div>
              <div className="text-[10px] text-slate-500">100% in-memory demo</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Carousel Section */}
      <section id="carousel" className="py-20 border-b border-slate-200/70 bg-[#faf9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Screen Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Product Screens & Example Maps
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore the five screens and example research maps with touch, keyboard, or button controls.
            </p>
          </div>

          <QuantCarousel />
        </div>
      </section>

      {/* 7. Creator's Note Section */}
      <section id="creators-note" className="py-20 border-b border-slate-200/70 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/40 border border-indigo-100 shadow-card relative overflow-hidden space-y-6"
          >
            {/* Top quote icon */}
            <Quote className="w-12 h-12 text-indigo-100 absolute -top-2 -left-2 rotate-180" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                <span>Creator's Note</span>
              </div>

              <blockquote className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed italic">
                “I built TESSERA to explore how AI, graph theory, and quantitative research can come together in one focused workspace. The project is a chance to make research connections visible and to learn by building the tools I would want to use.”
              </blockquote>

              <div className="pt-4 flex items-center justify-between border-t border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-2xs">
                    P
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">— Parth</div>
                    <div className="text-xs text-slate-500 font-medium">Creator of TESSERA</div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-medium hidden sm:block">
                  Personal Portfolio Project
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#faf9fc] to-[#f4f2fa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready to explore connected knowledge?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Experience TESSERA directly in your browser. No sign-up required, immediate access to the sample graph, conversation mapper, and Markdown notes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/app"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <span>Launch Demo Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-slate-900 font-bold">TESSERA</span>
            <span>•</span>
            <span>Turn conversations into connected knowledge</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
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

          <div className="text-slate-400 text-[11px]">
            Stateless Demo • In-Memory Only
          </div>
        </div>
      </footer>
    </div>
  );
};
