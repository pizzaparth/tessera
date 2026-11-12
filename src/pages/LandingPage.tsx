import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { MagneticButton } from '../components/landing/MagneticButton';
import {
  Sparkles,
  ArrowRight,
  GitBranch,
  FileText,
  Cpu,
  Zap,
  CheckCircle2,
  Shield,
  Layers,
  Search,
  Sliders,
  Terminal,
  ChevronRight,
  Play,
  Share2,
  Activity,
  Check,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeModelTab, setActiveModelTab] = useState<'claude' | 'gpt' | 'gemini' | 'deepseek'>('claude');

  const handleTryDemo = () => {
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-white text-[#100f12] font-sans selection:bg-[#ebe5ff] selection:text-[#6d55bd] overflow-x-hidden">
      {/* 1. Header Navigation */}
      <LandingNavbar />

      {/* 2. Hero Section with Pretty Artistic Landscape Background */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-36 overflow-hidden isolation-auto">
        {/* Artistic Landscape Background Art */}
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
          <img
            src="/assets/artistic-landscape-hero.jpg"
            alt="Artistic Landscape Painting Background"
            className="w-full h-full object-cover object-[50%_35%] opacity-90 scale-105 transform origin-top transition-transform duration-1000"
          />
          {/* Subtle gradient feather overlays for ultra-legible typography and seamless fade into white */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          {/* Announcement Pill Banner */}
          <div
            onClick={handleTryDemo}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#d9cffa] text-xs font-semibold text-[#6d55bd] shadow-sm hover:bg-white transition cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#6d55bd] animate-pulse" />
            <span>AI for on-call thought & neural graph intelligence</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6d55bd]" />
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#100f12] max-w-4xl mx-auto leading-[1.08] text-balance">
            AI for personal knowledge and{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6d55bd] via-[#8d6fde] to-[#f0883e]">
              neural graph
            </span>{' '}
            reasoning.
          </h1>

          {/* Subtitle / Lede */}
          <p className="text-base sm:text-xl text-[#4b5563] max-w-2xl mx-auto leading-relaxed font-normal">
            Personal knowledge and incident response for your mind—crafted to bring multi-model AI and interactive 2D graph reasoning together to connect, expand, and synthesize your thoughts.
          </p>

          {/* CTAs with Magnetic 'Try Demo' Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <MagneticButton
              onClick={handleTryDemo}
              strength={0.4}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white font-semibold text-base shadow-[0_4px_24px_rgba(109,85,189,0.4)] hover:shadow-[0_8px_32px_rgba(109,85,189,0.55)] transition flex items-center justify-center gap-2 group"
            >
              <span>Try Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>

            <button
              onClick={handleTryDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/90 hover:bg-white text-[#100f12] font-semibold text-base border border-[#eaecf0] shadow-sm hover:border-[#d0d5dd] transition backdrop-blur-md"
            >
              Get started for free
            </button>
          </div>

          {/* Logowall: Customer Logos Ticker */}
          <div className="pt-10 max-w-5xl mx-auto space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#65646e]">
              Empowering fast-moving thinkers, researchers, and systems engineers at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-75 grayscale hover:grayscale-0 transition duration-300">
              <img src="/assets/rootly/brex.png" alt="Brex" className="h-6 object-contain" />
              <img src="/assets/rootly/sofi.png" alt="SoFi" className="h-6 object-contain" />
              <img src="/assets/rootly/doordash.svg" alt="DoorDash" className="h-5 object-contain" />
              <img src="/assets/rootly/trivago.png" alt="Trivago" className="h-6 object-contain" />
              <img src="/assets/rootly/tripadvisor.png" alt="Tripadvisor" className="h-6 object-contain" />
              <img src="/assets/rootly/cisco.svg" alt="Cisco" className="h-6 object-contain" />
              <img src="/assets/rootly/grammarly.png" alt="Grammarly" className="h-6 object-contain" />
              <img src="/assets/rootly/nvidia.png" alt="NVIDIA" className="h-6 object-contain" />
              <img src="/assets/rootly/replit.png" alt="Replit" className="h-6 object-contain" />
              <img src="/assets/rootly/figma.png" alt="Figma" className="h-6 object-contain" />
            </div>
          </div>

          {/* Multi-Screen Composite Showcase */}
          <div className="pt-10 max-w-5xl mx-auto relative">
            <div
              onClick={handleTryDemo}
              className="group relative rounded-3xl border border-[#eaecf0] bg-black p-2.5 shadow-2xl overflow-hidden cursor-pointer hover:border-[#6d55bd]/60 transition duration-300"
            >
              {/* Window Title Bar */}
              <div className="h-9 bg-[#0a0a0a] border-b border-[#1c1c1c] rounded-t-2xl px-3 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="text-[11px] font-mono text-[#949494] ml-2">
                    Brain Vault • 2D Canvas Graph & Multi-Model Intelligence
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-[#6d55bd] text-white px-2 py-0.5 rounded-full font-semibold">
                    Live Interactive Demo
                  </span>
                </div>
              </div>

              {/* Window Canvas Screen */}
              <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-[#000000] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-70 bg-[radial-gradient(#9d4edd_1px,transparent_1px)] [background-size:24px_24px]" />

                {/* SVG Visual Graph Representation */}
                <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 800 400">
                  <line x1="200" y1="180" x2="350" y2="120" stroke="#333333" strokeWidth="1.2" />
                  <line x1="350" y1="120" x2="520" y2="160" stroke="#333333" strokeWidth="1.2" />
                  <line x1="520" y1="160" x2="650" y2="240" stroke="#333333" strokeWidth="1.2" />
                  <line x1="350" y1="120" x2="400" y2="280" stroke="#9d4edd" strokeWidth="2.2" strokeDasharray="4 4" />
                  <line x1="400" y1="280" x2="200" y2="180" stroke="#333333" strokeWidth="1.2" />
                  <line x1="520" y1="160" x2="400" y2="280" stroke="#333333" strokeWidth="1.2" />

                  <circle cx="200" cy="180" r="14" fill="#00ff88" />
                  <text x="220" y="184" fill="#ffffff" fontSize="12" fontWeight="600">Cognitive Science</text>

                  <circle cx="350" cy="120" r="22" fill="#9d4edd" />
                  <text x="380" y="125" fill="#ffffff" fontSize="13" fontWeight="bold">Artificial Intelligence</text>

                  <circle cx="520" cy="160" r="15" fill="#ff2a85" />
                  <text x="542" y="164" fill="#ffffff" fontSize="12" fontWeight="600">Philosophy of Mind</text>

                  <circle cx="650" cy="240" r="12" fill="#00f5ff" />
                  <text x="670" y="244" fill="#ffffff" fontSize="12" fontWeight="600">Systems Theory</text>

                  <circle cx="400" cy="280" r="16" fill="#ffffff" stroke="#9d4edd" strokeWidth="3" />
                  <text x="425" y="284" fill="#ffffff" fontSize="12" fontWeight="600">✨ Emergent Synthesis</text>
                </svg>

                {/* Floating Centered Interactive Trigger */}
                <div className="z-10 bg-white/95 backdrop-blur-md text-[#100f12] px-6 py-3.5 rounded-2xl shadow-2xl border border-white/40 flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  <div className="w-10 h-10 rounded-xl bg-[#6d55bd] flex items-center justify-center text-white shadow-md">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-[#100f12]">Click to Launch Full Demo</div>
                    <div className="text-xs text-[#65646e]">60 FPS Canvas • Multi-Model AI • Markdown Vault</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#6d55bd] group-hover:translate-x-1 transition-transform ml-2" />
                </div>
              </div>
            </div>

            {/* Floating Left Screen Popout (Rootly Composite Style) */}
            <div className="hidden lg:flex absolute -bottom-6 -left-8 bg-white/95 backdrop-blur-xl border border-[#eaecf0] rounded-2xl p-4 shadow-2xl items-center gap-3 max-w-xs text-left animate-in fade-in duration-300">
              <div className="w-9 h-9 rounded-xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#100f12]">AI Graph Expansion</div>
                <div className="text-[#65646e] text-[11px]">+4 Notes &amp; 6 connections synthesized</div>
              </div>
            </div>

            {/* Floating Right Screen Popout */}
            <div className="hidden lg:flex absolute -top-4 -right-8 bg-white/95 backdrop-blur-xl border border-[#eaecf0] rounded-2xl p-3.5 shadow-2xl items-center gap-3 text-left animate-in fade-in duration-300">
              <div className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-ping" />
              <div className="text-xs font-semibold text-[#100f12]">
                Model: Claude 3.5 Sonnet (Connected)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Overlap Card Section (Rootly's "There's never been a better time to switch" clone) */}
      <section className="py-20 md:py-28 bg-white border-b border-[#eaecf0] relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#100f12] tracking-tight text-balance">
              There’s never been a better time to switch from legacy note silos.
            </h2>
            <p className="text-base text-[#65646e] leading-relaxed">
              We’ve been migrating thousands of thinkers and researchers from static hierarchical tools for years. Now it’s your turn.{' '}
              <button onClick={handleTryDemo} className="text-[#6d55bd] font-semibold hover:underline inline-flex items-center gap-0.5">
                See how switching works &rarr;
              </button>
            </p>
          </div>

          {/* 4 Overlap Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-6 space-y-2 hover:shadow-lg transition">
              <div className="text-3xl font-extrabold text-[#100f12]">1/2 the friction</div>
              <p className="text-xs text-[#65646e] leading-relaxed">
                And quadruple the capability. Standard Markdown files with zero vendor lock-in.
              </p>
            </div>

            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-6 space-y-2 hover:shadow-lg transition">
              <div className="text-3xl font-extrabold text-[#100f12]">Contract buyout</div>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Never pay twice. Bring your own model keys or use our built-in intelligence.
              </p>
            </div>

            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-6 space-y-2 hover:shadow-lg transition">
              <div className="text-3xl font-extrabold text-[#100f12]">Migrated for you</div>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Instant [[Wikilink]] backlink generation with zero-labeled wire clutter.
              </p>
            </div>

            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-6 space-y-2 hover:shadow-lg transition">
              <div className="text-3xl font-extrabold text-[#100f12]">99.99%</div>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Local-first 60 FPS HTML5 Canvas reliability that never stutters or distorts on resize.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Deep-Dive 1: Automated Root Cause & Concept Synthesis */}
      <section className="py-20 md:py-28 bg-[#faf9ff] border-b border-[#eaecf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#eaecf0] pb-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6d55bd]">
                AI KNOWLEDGE REASONER
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#100f12] tracking-tight">
                Automated concept synthesis, complete with suggested graph connections.
              </h2>
            </div>
            <p className="text-sm text-[#65646e] max-w-md">
              Rapid troubleshooting and suggested cross-disciplinary connections that help you diagnose and expand your mental models—before you’re even done writing.
            </p>
          </div>

          {/* Model Matrix Selector Tabs */}
          <div className="bg-white border border-[#eaecf0] rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
            <div className="flex items-center gap-2 border-b border-[#eaecf0] pb-4 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveModelTab('claude')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeModelTab === 'claude'
                    ? 'bg-[#6d55bd] text-white shadow-sm'
                    : 'text-[#65646e] hover:bg-[#faf9ff]'
                }`}
              >
                Anthropic Claude 3.5 Sonnet
              </button>
              <button
                onClick={() => setActiveModelTab('gpt')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeModelTab === 'gpt'
                    ? 'bg-[#6d55bd] text-white shadow-sm'
                    : 'text-[#65646e] hover:bg-[#faf9ff]'
                }`}
              >
                OpenAI GPT-4o &amp; o1
              </button>
              <button
                onClick={() => setActiveModelTab('gemini')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeModelTab === 'gemini'
                    ? 'bg-[#6d55bd] text-white shadow-sm'
                    : 'text-[#65646e] hover:bg-[#faf9ff]'
                }`}
              >
                Google Gemini 2.0 Flash
              </button>
              <button
                onClick={() => setActiveModelTab('deepseek')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeModelTab === 'deepseek'
                    ? 'bg-[#6d55bd] text-white shadow-sm'
                    : 'text-[#65646e] hover:bg-[#faf9ff]'
                }`}
              >
                DeepSeek Reasoner R1
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#100f12]">
                  {activeModelTab === 'claude' && 'Anthropic Claude for nuanced conceptual synthesis.'}
                  {activeModelTab === 'gpt' && 'OpenAI GPT-4o for rapid cross-disciplinary reasoning.'}
                  {activeModelTab === 'gemini' && 'Google Gemini for multimodal knowledge discovery.'}
                  {activeModelTab === 'deepseek' && 'DeepSeek R1 for deep mathematical formalisms.'}
                </h3>
                <p className="text-xs sm:text-sm text-[#65646e] leading-relaxed">
                  As you converse with the assistant, it extracts semantic entities, resolves Wikilinks, and injects new nodes and unlabeled connecting wires directly into the live graph.
                </p>
                <div className="pt-2">
                  <MagneticButton
                    onClick={handleTryDemo}
                    className="px-5 py-2.5 rounded-xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white text-xs font-semibold shadow-md transition"
                  >
                    Try in Live Demo
                  </MagneticButton>
                </div>
              </div>

              {/* Live Terminal Output Mockup */}
              <div className="bg-[#0a0a0a] rounded-2xl p-6 text-white font-mono text-xs border border-[#1e1e1e] space-y-3">
                <div className="text-[#949494] text-[11px] border-b border-[#1e1e1e] pb-2 flex items-center justify-between">
                  <span>Graph Node Generator Stream</span>
                  <span className="text-[#00ff88]">HTTP 200 OK</span>
                </div>
                <div className="text-[#a0a0a0] leading-relaxed">
                  <span className="text-[#9d4edd]">&gt;</span> Prompt: "Explore Attention Mechanism &amp; Working Memory"<br />
                  <span className="text-[#00f5ff]">&gt;</span> Extracted: <span className="text-white">[[Transformer Attention]]</span>, <span className="text-white">[[Executive Control]]</span><br />
                  <span className="text-[#00ff88]">&gt;</span> Action: <span className="text-white">Dynamically added 2 nodes, 3 wires to Canvas</span><br />
                  <span className="text-[#ffb703]">&gt;</span> In-system modal: <span className="text-white">0 browser prompts required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Feature Deep-Dive 2: On-Call for Your Second Brain */}
      <section className="py-20 md:py-28 bg-white border-b border-[#eaecf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#eaecf0] pb-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6d55bd]">
                GRAPH ENGINE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#100f12] tracking-tight">
                Spatial thinking that puts you first—designed for everyday deep work.
              </h2>
            </div>
            <p className="text-sm text-[#65646e] max-w-md">
              AI-powered 2D Canvas that’s built for non-linear exploration, degree-scaled node sizing, and zero-distorting ResizeObserver physics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-8 space-y-4 hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-2xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5 text-[#6d55bd]" />
              </div>
              <h3 className="text-xl font-bold text-[#100f12]">4-Tab Forces Drawer</h3>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Tune center gravity, Coulomb repulsion, link spring tension, and link distance live in the floating drawer.
              </p>
            </div>

            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-8 space-y-4 hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-2xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center font-bold">
                <Activity className="w-5 h-5 text-[#6d55bd]" />
              </div>
              <h3 className="text-xl font-bold text-[#100f12]">Degree-Scaled Radii</h3>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Important concepts with more incoming/outgoing links automatically grow larger in size, revealing hubs naturally.
              </p>
            </div>

            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-8 space-y-4 hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-2xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center font-bold">
                <Share2 className="w-5 h-5 text-[#6d55bd]" />
              </div>
              <h3 className="text-xl font-bold text-[#100f12]">Neighborhood Glow</h3>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Hovering or selecting any node highlights its immediate 1-hop connections with glowing electric purple wires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. The Philosophy (The Rootly Philosophy Clone) */}
      <section className="py-20 md:py-28 bg-[#faf9ff] border-b border-[#eaecf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6d55bd]">
              OUR TENETS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#100f12] tracking-tight">
              The Brain Vault Philosophy
            </h2>
            <p className="text-base text-[#65646e] leading-relaxed">
              We believe thinking is inherently spatial, relational, and non-linear. Here is how we build tools to respect how the human mind actually works.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#eaecf0] rounded-3xl p-8 space-y-3 shadow-sm">
              <div className="text-xs font-mono font-bold text-[#6d55bd]">01</div>
              <h4 className="font-bold text-lg text-[#100f12]">Opinionated defaults</h4>
              <p className="text-xs text-[#65646e] leading-relaxed">
                No tedious configuration puzzles. Degree-scaled nodes, delicate wires, and AMOLED dark IDE ready out-of-the-box.
              </p>
            </div>

            <div className="bg-white border border-[#eaecf0] rounded-3xl p-8 space-y-3 shadow-sm">
              <div className="text-xs font-mono font-bold text-[#6d55bd]">02</div>
              <h4 className="font-bold text-lg text-[#100f12]">Purpose-built</h4>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Not a bloated spreadsheet or Jira replacement. Built purely for deep thought, research synthesis, and creative serendipity.
              </p>
            </div>

            <div className="bg-white border border-[#eaecf0] rounded-3xl p-8 space-y-3 shadow-sm">
              <div className="text-xs font-mono font-bold text-[#6d55bd]">03</div>
              <h4 className="font-bold text-lg text-[#100f12]">Rooted in reliability</h4>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Local-first Markdown with in-system modal dialogs and zero browser alerts. Your notes remain yours forever.
              </p>
            </div>

            <div className="bg-white border border-[#eaecf0] rounded-3xl p-8 space-y-3 shadow-sm">
              <div className="text-xs font-mono font-bold text-[#6d55bd]">04</div>
              <h4 className="font-bold text-lg text-[#100f12]">Scales as you do</h4>
              <p className="text-xs text-[#65646e] leading-relaxed">
                From your first 10 notes to 50,000 interconnected concepts, the 60 FPS HTML5 canvas engine maintains peak responsiveness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Real Customer Stories & Avatars */}
      <section className="py-20 md:py-28 bg-white border-b border-[#eaecf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6d55bd]">
              CUSTOMER STORIES
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#100f12] tracking-tight">
              Trusted by leaders at the frontier.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <img src="/assets/rootly/6a395fd676be3e47ebf6b9bc_darshan-spotdraft.webp" alt="Darshan" className="w-12 h-12 rounded-full object-cover border border-[#eaecf0]" />
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed italic">
                  "Brain Vault cut our architecture synthesis time in half. Connecting ideas spatially on the 2D canvas gives everyone instant intuition."
                </p>
              </div>
              <div className="text-xs font-semibold text-[#100f12]">
                Darshan S. — SpotDraft
              </div>
            </div>

            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <img src="/assets/rootly/6a39ec1b37008d4d7fda7d65_mike-pezzi-reactiv.avif" alt="Mike" className="w-12 h-12 rounded-full object-cover border border-[#eaecf0]" />
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed italic">
                  "We outgrew linear docs and moved to Brain Vault for real AI reasoning and dynamic graph expansion without vendor lock-in."
                </p>
              </div>
              <div className="text-xs font-semibold text-[#100f12]">
                Mike Pezzi — Reactiv
              </div>
            </div>

            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <img src="/assets/rootly/6a4ff0ddd07656ddd1ea61b3_z-lee-canary.webp" alt="Z Lee" className="w-12 h-12 rounded-full object-cover border border-[#eaecf0]" />
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed italic">
                  "How Canary built its knowledge base from scratch on Brain Vault while our engineering and research teams quadrupled."
                </p>
              </div>
              <div className="text-xs font-semibold text-[#100f12]">
                Z Lee — Canary
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Pre-Footer Mega Banner */}
      <section className="py-20 md:py-28 bg-[#faf9ff] border-b border-[#eaecf0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebe5ff] text-[#6d55bd] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>You deserve modern tools</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#100f12] tracking-tight max-w-3xl mx-auto">
            You and your teams deserve modern knowledge management.
          </h2>

          <p className="text-base sm:text-lg text-[#65646e] max-w-xl mx-auto">
            Experience the 2D canvas graph, universal AI model chat, and bidirectional Markdown vault directly in your browser.
          </p>

          <div className="pt-2">
            <MagneticButton
              onClick={handleTryDemo}
              strength={0.45}
              className="px-8 py-4 rounded-2xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white font-bold text-base shadow-[0_4px_24px_rgba(109,85,189,0.45)] hover:shadow-[0_8px_32px_rgba(109,85,189,0.55)] transition flex items-center gap-2 mx-auto"
            >
              <span>Try Demo</span>
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <LandingFooter />
    </div>
  );
};
