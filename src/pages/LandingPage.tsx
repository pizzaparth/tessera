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
  ExternalLink,
  ChevronRight,
  Play,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ai' | 'graph' | 'wikilinks' | 'physics'>('ai');

  const handleTryDemo = () => {
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-white text-[#100f12] font-sans selection:bg-[#ebe5ff] selection:text-[#6d55bd]">
      {/* 1. Header Navigation */}
      <LandingNavbar />

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-[#eaecf0]">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#ebe5ff] to-[#fbfaff] rounded-full blur-3xl opacity-70 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f7f5ff] border border-[#d9cffa] text-xs font-semibold text-[#6d55bd] shadow-xs hover:bg-[#ebe5ff] transition cursor-pointer" onClick={handleTryDemo}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI for non-linear thought & knowledge graph synthesis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#100f12] max-w-4xl mx-auto leading-[1.08]">
            AI for personal knowledge &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6d55bd] via-[#8d6fde] to-[#f0883e]">
              neural graph
            </span>{' '}
            intelligence.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#65646e] max-w-2xl mx-auto leading-relaxed font-normal">
            A high-performance knowledge platform crafted to bring multi-model AI and interactive 2D graph reasoning together to connect, expand, and synthesize your thoughts.
          </p>

          {/* Magnetic CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <MagneticButton
              onClick={handleTryDemo}
              strength={0.4}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white font-semibold text-base shadow-[0_4px_20px_rgba(109,85,189,0.35)] hover:shadow-[0_6px_28px_rgba(109,85,189,0.5)] transition flex items-center justify-center gap-2 group"
            >
              <span>Try Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>

            <button
              onClick={() => {
                const sec = document.getElementById('features-section');
                sec?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#f9fafb] text-[#100f12] font-semibold text-base border border-[#eaecf0] shadow-xs hover:border-[#d0d5dd] transition flex items-center justify-center gap-2"
            >
              <span>Explore Features</span>
            </button>
          </div>

          {/* Micro social proof */}
          <div className="flex items-center justify-center gap-6 text-xs text-[#65646e] pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              No signup required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              Universal AI models
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              Local-first 60 FPS canvas
            </span>
          </div>

          {/* Hero Visual Mockup Preview */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div
              onClick={handleTryDemo}
              className="group relative rounded-2xl border border-[#eaecf0] bg-[#000000] p-2 shadow-2xl overflow-hidden cursor-pointer hover:border-[#6d55bd]/60 transition duration-300"
            >
              {/* Window Header */}
              <div className="h-9 bg-[#0a0a0a] border-b border-[#1c1c1c] rounded-t-xl px-3 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="text-[11px] font-mono text-[#949494] ml-2">Brain Vault • 2D Neural Graph & AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-[#6d55bd] text-white px-2 py-0.5 rounded-full font-semibold">
                    Interactive Sandbox
                  </span>
                </div>
              </div>

              {/* Mockup Body Preview */}
              <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-[#000000] overflow-hidden flex items-center justify-center">
                {/* Visual node network graphic */}
                <div className="absolute inset-0 opacity-80 bg-[radial-gradient(#9d4edd_1px,transparent_1px)] [background-size:24px_24px]" />

                {/* SVG mock network */}
                <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 800 400">
                  <line x1="200" y1="180" x2="350" y2="120" stroke="#333333" strokeWidth="1.2" />
                  <line x1="350" y1="120" x2="520" y2="160" stroke="#333333" strokeWidth="1.2" />
                  <line x1="520" y1="160" x2="650" y2="240" stroke="#333333" strokeWidth="1.2" />
                  <line x1="350" y1="120" x2="400" y2="280" stroke="#9d4edd" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="400" y1="280" x2="200" y2="180" stroke="#333333" strokeWidth="1.2" />

                  {/* Nodes */}
                  <circle cx="200" cy="180" r="14" fill="#00ff88" />
                  <text x="220" y="184" fill="#ffffff" fontSize="12" fontWeight="600" fontFamily="sans-serif">Cognitive Science</text>

                  <circle cx="350" cy="120" r="20" fill="#9d4edd" />
                  <text x="375" y="124" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Artificial Intelligence</text>

                  <circle cx="520" cy="160" r="15" fill="#ff2a85" />
                  <text x="542" y="164" fill="#ffffff" fontSize="12" fontWeight="600" fontFamily="sans-serif">Philosophy of Mind</text>

                  <circle cx="650" cy="240" r="12" fill="#00f5ff" />
                  <text x="670" y="244" fill="#ffffff" fontSize="12" fontWeight="600" fontFamily="sans-serif">Systems Theory</text>

                  <circle cx="400" cy="280" r="16" fill="#ffffff" stroke="#9d4edd" strokeWidth="3" />
                  <text x="425" y="284" fill="#ffffff" fontSize="12" fontWeight="600" fontFamily="sans-serif">✨ Emergent Synthesis</text>
                </svg>

                {/* Floating Centered Hover Trigger Badge */}
                <div className="z-10 bg-white/95 backdrop-blur-md text-[#100f12] px-6 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  <div className="w-9 h-9 rounded-xl bg-[#6d55bd] flex items-center justify-center text-white shadow-md">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-[#100f12]">Click to Launch Full Demo</div>
                    <div className="text-xs text-[#65646e]">2D Canvas Graph • AI Chat Assistant • Note Editor</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#6d55bd] group-hover:translate-x-1 transition-transform ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Customer Logo Ticker */}
      <section className="py-12 bg-[#faf9ff] border-b border-[#eaecf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#65646e]">
            Empowering researchers, systems thinkers, and engineering teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-60 grayscale hover:grayscale-0 transition duration-300">
            <span className="font-extrabold text-xl text-[#100f12] tracking-tighter">REPLIT</span>
            <span className="font-extrabold text-xl text-[#100f12] tracking-tight">VERCEL</span>
            <span className="font-extrabold text-xl text-[#100f12] tracking-tighter">FIGMA</span>
            <span className="font-extrabold text-xl text-[#100f12] tracking-normal">LINEAR</span>
            <span className="font-extrabold text-xl text-[#100f12] tracking-tight">SUPABASE</span>
            <span className="font-extrabold text-xl text-[#100f12] tracking-tight">ANTHROPIC</span>
          </div>
        </div>
      </section>

      {/* 4. Comparison Section (Rootly's "There's never been a better time to switch" clone) */}
      <section className="py-20 md:py-28 bg-white border-b border-[#eaecf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#6d55bd]">
              Why Switch to Brain Vault
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#100f12] tracking-tight">
              There’s never been a better time to switch from legacy note silos.
            </h2>
            <p className="text-base text-[#65646e] leading-relaxed">
              Traditional note tools lock you into proprietary formats, sluggish web views, and single-model vendors. Brain Vault gives you complete cognitive freedom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {/* Card 1 */}
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-2xl p-8 space-y-4 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center font-bold text-lg">
                1/2
              </div>
              <h3 className="text-xl font-bold text-[#100f12]">Zero Friction</h3>
              <p className="text-sm text-[#65646e] leading-relaxed">
                Standard Markdown notes with instantaneous bidirectional Wikilinks (<code className="text-[#6d55bd] font-mono text-xs font-semibold">[[Concept]]</code>). Zero lock-in, zero waiting.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-2xl p-8 space-y-4 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-[#6d55bd]" />
              </div>
              <h3 className="text-xl font-bold text-[#100f12]">Universal AI Engine</h3>
              <p className="text-sm text-[#65646e] leading-relaxed">
                Connect any frontier model: Anthropic Claude 3.5/3.7, OpenAI GPT-4o, Google Gemini 2.0, or DeepSeek R1. The AI reasons and directly expands your graph.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-2xl p-8 space-y-4 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-2xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center font-bold text-sm">
                60 FPS
              </div>
              <h3 className="text-xl font-bold text-[#100f12]">Retina Canvas Physics</h3>
              <p className="text-sm text-[#65646e] leading-relaxed">
                Clean, delicate unlabeled wires, degree-scaled node radii, and full Hooke’s Law spring simulation that never stutters or distorts on resize.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Deep-Dive Feature Bento Grid */}
      <section id="features-section" className="py-20 md:py-28 bg-[#faf9ff] border-b border-[#eaecf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#6d55bd]">
              Intelligent Synthesis
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#100f12] tracking-tight">
              Automated knowledge expansion, complete with suggested connections.
            </h2>
            <p className="text-base text-[#65646e] leading-relaxed">
              When ideas talk to each other, breakthroughs happen. Brain Vault watches your conversations with AI and automatically generates connecting nodes and wires in real time.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex items-center justify-center gap-2 border-b border-[#eaecf0] pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === 'ai'
                  ? 'bg-[#6d55bd] text-white shadow-sm'
                  : 'text-[#65646e] hover:text-[#100f12] hover:bg-white'
              }`}
            >
              Universal AI Plugin
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === 'graph'
                  ? 'bg-[#6d55bd] text-white shadow-sm'
                  : 'text-[#65646e] hover:text-[#100f12] hover:bg-white'
              }`}
            >
              2D Canvas Physics
            </button>
            <button
              onClick={() => setActiveTab('wikilinks')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === 'wikilinks'
                  ? 'bg-[#6d55bd] text-white shadow-sm'
                  : 'text-[#65646e] hover:text-[#100f12] hover:bg-white'
              }`}
            >
              Bidirectional Wikilinks
            </button>
            <button
              onClick={() => setActiveTab('physics')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === 'physics'
                  ? 'bg-[#6d55bd] text-white shadow-sm'
                  : 'text-[#65646e] hover:text-[#100f12] hover:bg-white'
              }`}
            >
              Force Tuning
            </button>
          </div>

          {/* Tab Content Display Card */}
          <div className="bg-white border border-[#eaecf0] rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f7f5ff] text-[#6d55bd] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                {activeTab === 'ai' && 'Frontier Reasoning Engine'}
                {activeTab === 'graph' && 'High-DPI Canvas Simulation'}
                {activeTab === 'wikilinks' && 'Hypertext Interconnectivity'}
                {activeTab === 'physics' && 'Four-Tier Physics Controls'}
              </span>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#100f12] tracking-tight">
                {activeTab === 'ai' && 'Chat with any model. Watch your graph expand.'}
                {activeTab === 'graph' && 'Delicate wires, zero clutter, degree-scaled nodes.'}
                {activeTab === 'wikilinks' && 'Type [[Concept]] anywhere to link instantaneously.'}
                {activeTab === 'physics' && 'Customize Coulomb repulsion, gravity, and distance.'}
              </h3>

              <p className="text-sm sm:text-base text-[#65646e] leading-relaxed">
                {activeTab === 'ai' &&
                  'Bring your own API key for Anthropic Claude, OpenAI, Google Gemini, or DeepSeek—or use our built-in semantic concept expander. Ideas generated by the assistant immediately become nodes in your graph.'}
                {activeTab === 'graph' &&
                  'Unlike clumsy DOM graph views, our HTML5 canvas implementation renders at a silky 60 FPS. Nodes with more connections naturally grow larger, and hovering any node highlights its entire direct neighborhood.'}
                {activeTab === 'wikilinks' &&
                  'Bidirectional linking gives your notes compound interest. Navigate effortlessly through linked references, view incoming backlinks, and jump across disciplines.'}
                {activeTab === 'physics' &&
                  'Fine-tune forces through our floating 4-tab settings panel. Set center gravity pull, Coulomb many-body repulsion, link spring tension, and text fade threshold to fit your exact mental model.'}
              </p>

              <div className="pt-2">
                <MagneticButton
                  onClick={handleTryDemo}
                  className="px-6 py-3 rounded-xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white text-sm font-semibold shadow-md transition flex items-center gap-2"
                >
                  <span>Try Demo Now</span>
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </div>
            </div>

            {/* Visual preview box */}
            <div className="bg-[#000000] border border-[#1c1c1c] rounded-2xl p-6 text-white font-mono text-xs space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-[#949494] border-b border-[#222222] pb-2">
                <span className="flex items-center gap-1.5 text-white font-semibold">
                  <Terminal className="w-4 h-4 text-[#9d4edd]" />
                  Brain Vault Engine v2.4
                </span>
                <span className="text-[10px] text-[#00ff88]">● Live System</span>
              </div>
              <div className="text-[#a0a0a0] leading-relaxed">
                <span className="text-[#9d4edd]">&gt;</span> Connected active model: <span className="text-white">claude-3-5-sonnet (anthropic)</span><br />
                <span className="text-[#9d4edd]">&gt;</span> Graph Physics: <span className="text-[#00f5ff]">Spring-Electrical (Coulomb + Hooke)</span><br />
                <span className="text-[#9d4edd]">&gt;</span> Degree Scaling: <span className="text-[#00ff88]">radius = base + sqrt(degree) * 2.8</span><br />
                <span className="text-[#9d4edd]">&gt;</span> Connecting wires: <span className="text-white">unlabeled, anti-aliased 1:1</span><br />
                <span className="text-[#9d4edd]">&gt;</span> In-system dialogs: <span className="text-[#00ff88]">active (0 browser prompts)</span>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1e1e1e] flex items-center justify-between text-[11px]">
                <span className="text-[#606060]">Ready for exploration</span>
                <button
                  onClick={handleTryDemo}
                  className="text-[#9d4edd] hover:text-white transition font-sans font-semibold underline"
                >
                  Launch full demo &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. The Brain Vault Philosophy (Rootly Philosophy Clone) */}
      <section className="py-20 md:py-28 bg-white border-b border-[#eaecf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#6d55bd]">
              Our Tenets
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#100f12] tracking-tight">
              The Brain Vault Philosophy
            </h2>
            <p className="text-base text-[#65646e] leading-relaxed">
              We believe thinking is inherently spatial, relational, and non-linear. Here is how we build tools to respect how the human mind actually works.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center font-bold">
                01
              </div>
              <h4 className="font-bold text-base text-[#100f12]">Opinionated Defaults</h4>
              <p className="text-xs text-[#65646e] leading-relaxed">
                No endless configuration puzzles. Perfect degree-scaled circles, clean wires, and AMOLED pitch black workspace ready right out of the box.
              </p>
            </div>

            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center font-bold">
                02
              </div>
              <h4 className="font-bold text-base text-[#100f12]">Purpose-Built</h4>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Not a bloated project management tool. Engineered strictly for non-linear knowledge synthesis, research mapping, and creative serendipity.
              </p>
            </div>

            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center font-bold">
                03
              </div>
              <h4 className="font-bold text-base text-[#100f12]">Rooted in Reliability</h4>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Fast local-first Markdown with in-system modal dialogs and zero browser prompt interruptions. Your data stays yours forever.
              </p>
            </div>

            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#ebe5ff] text-[#6d55bd] flex items-center justify-center font-bold">
                04
              </div>
              <h4 className="font-bold text-base text-[#100f12]">Extensible by Design</h4>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Switch providers from Claude to GPT-4o, Gemini, or DeepSeek without switching apps. Bring your own endpoints and models freely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pre-Footer Mega CTA Banner */}
      <section className="py-20 md:py-28 bg-[#faf9ff] border-b border-[#eaecf0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebe5ff] text-[#6d55bd] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to explore?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#100f12] tracking-tight max-w-3xl mx-auto">
            You and your mind deserve modern knowledge management.
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
              <span>Try Demo Now</span>
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <LandingFooter />
    </div>
  );
};
