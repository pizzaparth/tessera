# TESSERA

### A Quantitative Research Knowledge System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?style=flat-square&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Cytoscape.js](https://img.shields.io/badge/Cytoscape.js-3.30-orange.svg?style=flat-square)](https://js.cytoscape.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](LICENSE)

**TESSERA** is a browser-based, AI-assisted research workspace for transforming quantitative finance conversations, strategy memos, and transcripts into an interactive, connected knowledge graph and editable Markdown notes with mathematical formulas.

It brings together three familiar ways of working into one unified interface:
1. **Chat & Conversation Mapping**: Paste research discussions and extract candidate concepts, models, claims, and open questions.
2. **Obsidian-Style Interactive Knowledge Graph**: Navigate ideas through force-directed layouts, neighborhood zooms, and shortest-path connection chains.
3. **Markdown-First Concept Notes**: Dive into mathematical equations ($\LaTeX$), empirical assumptions, and literature citations.

---

## Product Vision & Principles

Quantitative research rarely follows a linear trajectory. An inquiry into momentum signals inevitably touches market microstructure, order execution drag, volatility forecasting, portfolio weighting, and statistical inference. These ideas often become siloed in disconnected scratchpads and chat logs.

TESSERA makes these multi-disciplinary connections visible and navigable:
- **No Account Barrier**: Instant access to an out-of-the-box quantitative finance graph with no sign-up or login required.
- **Stateless Operating Model**: All edits, new nodes, and API keys exist strictly in the active browser tab's volatile memory. Refreshing or closing the tab clears all changes.
- **Researcher in Control**: AI proposes candidate structures; the researcher reviews, edits definitions, chooses relationship types, and approves additions.
- **Traceable Provenance**: Every concept and claim preserves its verbatim source quote, confidence score, and origin badge (`sample_dataset`, `ai_suggested`, or `researcher_authored`).
- **Descriptive Analytics**: Graph metrics describe network topology (hubs, bridges, density); they do not predict asset returns or provide financial advice.

---

## Core Capabilities & Architecture

```
                  ┌────────────────────────────────────────┐
                  │          Research Input / Chat         │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │    Stateless Concept Extraction        │
                  │  (Guided Demo OR OpenAI/Claude/Gemini) │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │        Extraction Review Queue         │
                  │   (Inspect, Edit, Approve/Reject)      │
                  └───────────────────┬────────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
┌──────────────────────────┐                    ┌──────────────────────────┐
│  Cytoscape Knowledge     │◄──────────────────►│  Markdown Notes & LaTeX  │
│  Graph & Topology        │                    │  Editor with Math        │
└─────────────┬────────────┘                    └─────────────┬────────────┘
              │                                               │
              └───────────────────────┬───────────────────────┘
                                      ▼
                  ┌────────────────────────────────────────┐
                  │   Graph Analytics & Research Synthesis │
                  │  (Degree Hubs, Bridges, Brief Export)  │
                  └────────────────────────────────────────┘
```

### 1. AI-Assisted Conversation Mapping
- Paste transcripts, strategy brainstorming, or paper excerpts.
- Choose between **Guided Demo Mode** (pre-loaded quant discussions running deterministically with zero quota consumption) or **Live AI Extraction** (OpenAI `gpt-4o-mini`, Anthropic `claude-3-5-sonnet`, or Google `gemini-1.5-flash`).
- Extracts candidate concepts, empirical claims, open research questions, and typed connections.

### 2. Interactive Knowledge Graph (Cytoscape.js)
- Dark-themed network canvas with customizable physics layouts:
  - **Force-Directed (Cose)**: Organic clustering of related quant domains.
  - **Concentric**: Concentric rings based on node degree centrality.
  - **Circular / Tree / Grid**: Structural geometric arrangements.
- **Local Ego-View Mode**: Isolate any selected concept and its 1-hop direct neighbors.
- **Shortest Path Finder**: Select source and destination concepts to trace and animate connection paths across the network.
- Visual encoding: Color-coded node types, domain indicators, directional arrows, and toggleable typed edge labels.

### 3. Concept Types & Explicit Relational Semantics
Concepts are classified into distinct structural archetypes:
- `method`: Algorithmic routines (e.g. Mean-Variance Optimization, Volatility Targeting)
- `model`: Mathematical frameworks (e.g. Fama-French 3-Factor, Black-Litterman, Almgren-Chriss, GARCH)
- `dataset`: Underlying data sources (e.g. CRSP / Compustat Merged, TAQ Tick Data)
- `instrument`: Traded contracts and assets (e.g. Equities, Futures, Options)
- `metric`: Quantitative measures (e.g. Sharpe Ratio, Kyle's Lambda, Order Flow Imbalance, VaR)
- `hypothesis`: Empirical anomalies (e.g. Cross-Sectional Momentum, Short-Term Reversal, Survivorship Bias)
- `source`: Academic literature and papers
- `research_question`: Open research inquiries (e.g. Factor Crowding Spirals)

Connections carry explicit relational semantics:
- `depends_on`: Model relies on a prior concept or assumption.
- `extends`: Generalizes or improves upon an earlier framework.
- `measures`: Metric quantifies or evaluates a model/process.
- `uses_data_from`: Method or claim draws upon a dataset.
- `supports` / `challenges`: Empirical evidence bears on a hypothesis.
- `contradicts`: Theoretical or empirical tension between two claims.
- `related_to`: Associative link.

### 4. Markdown-First Notes with Math Equations ($\LaTeX$)
- Dedicated Markdown editor with live KaTeX formula rendering.
- Edit definitions, assumptions, and proofs in split view or full view.
- In-memory version timeline tracking edits made during the active browser session.

### 5. Descriptive Graph Analytics Dashboard (Recharts)
- Real-time network statistics: node count, edge count, density, average degree.
- Domain cluster distribution (horizontal bar chart).
- Concept typology ratio (donut chart).
- Central hub concepts and cross-domain bridge concepts ranking.

### 6. Research Synthesis Brief Composer
- Combines notes, references, and mathematical equations into an exportable research brief:
  - 1. Core Research Question
  - 2. Theoretical Context & Background
  - 3. Referenced Graph Concepts
  - 4. Empirical Assumptions
  - 5. Experimental Next Steps
- One-click copy to formatted Markdown or export.

---

## Pre-Loaded Quantitative Research Library

TESSERA ships with a rich, interconnected quantitative finance knowledge graph:
- **Factor Research**: Fama-French 3-Factor, Cross-Sectional Momentum (Jegadeesh & Titman 1993), Carhart 4-Factor, Survivorship Bias, CRSP / Compustat Merged.
- **Portfolio Construction**: Markowitz Mean-Variance Optimization (1952), Black-Litterman Bayesian Model (1992).
- **Market Microstructure**: Kyle's Lambda (1985), Limit Order Book Imbalance (Cont et al. 2014).
- **Execution & Trading**: Almgren-Chriss Optimal Execution Framework (2000).
- **Risk Management**: Volatility Targeting (Harvey et al. 2018), Sharpe Ratio (1994), Value at Risk (VaR).
- **Time Series & Econometrics**: GARCH(1,1) Conditional Heteroskedasticity (Bollerslev 1986).

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | [React 18](https://react.dev/) | Interactive single-page UI |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) | Strict type definitions across graph nodes, edges, and session state |
| **Build Tool** | [Vite 6](https://vite.dev/) | High-speed local dev server and optimized production bundler |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Dark quant-terminal design system (`#07090e`, grid lines, accents) |
| **Routing** | [React Router 7](https://reactrouter.com/) | Client-side routing (`/` landing page, `/app` workspace) |
| **Graph Visualization** | [Cytoscape.js 3.30](https://js.cytoscape.org/) | Graph canvas, force-directed layouts, neighborhood focus, Dijkstra pathing |
| **Animations & Motion** | [Motion for React](https://motion.dev/) | Landing page reveals, guided demo cursor walkthrough, transitions |
| **Charts & Analytics** | [Recharts 2.15](https://recharts.github.io/) | Responsive domain distribution and typological charts |
| **Carousel** | [Embla Carousel 8](https://www.embla-carousel.com/) | Touch, keyboard, and drag-enabled case study carousel |
| **Math Rendering** | [KaTeX](https://katex.org/) + `remark-math` | Mathematical formula formatting ($LaTeX$) in Markdown |
| **Icons** | [Lucide React](https://lucide.dev/) | Crisp, modern UI icons |
| **Backend Proxy** | [Express 4](https://expressjs.com/) | Stateless proxy for OpenAI, Anthropic, and Gemini requests |

---

## Project Structure

```
tessera/
├── docs/
│   └── description.md          # Original product specification and design goals
├── server/
│   └── index.ts                # Stateless Express AI extraction proxy
├── src/
│   ├── components/
│   │   ├── analytics/          # Graph analytics dashboard & Recharts components
│   │   │   └── AnalyticsDashboard.tsx
│   │   ├── graph/              # Cytoscape interactive graph & concept detail panel
│   │   │   ├── ConceptDetailPanel.tsx
│   │   │   └── CytoscapeGraph.tsx
│   │   ├── landing/            # Landing page sections: Walkthrough, Carousel
│   │   │   ├── GuidedDemoWalkthrough.tsx
│   │   │   └── QuantCarousel.tsx
│   │   ├── mapper/             # Conversation & text extraction screen
│   │   │   └── ConversationMapper.tsx
│   │   ├── modals/             # API key, Add Connection, and Session info modals
│   │   │   ├── AddConnectionModal.tsx
│   │   │   ├── ApiKeyModal.tsx
│   │   │   └── SessionInfoModal.tsx
│   │   ├── notes/              # Markdown editor with LaTeX equations & timeline
│   │   │   └── MarkdownEditor.tsx
│   │   ├── review/             # Proposal review queue (accept/reject/edit)
│   │   │   └── ExtractionReview.tsx
│   │   └── synthesis/          # Research brief composer & Markdown exporter
│   │       └── ResearchSynthesis.tsx
│   ├── context/
│   │   └── WorkspaceContext.tsx # Central in-memory state management & graph logic
│   ├── data/
│   │   ├── sampleConversations.ts # Ready-to-map quantitative research transcripts
│   │   └── sampleGraph.ts       # Peer-reviewed quantitative concepts & typed edges
│   ├── pages/
│   │   ├── LandingPage.tsx     # Modern SaaS landing page with animated walkthrough
│   │   └── WorkspacePage.tsx   # Main interactive research workspace
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces for nodes, edges, and provenance
│   ├── utils/
│   │   └── visualEncoding.ts   # Typological colors, icons, and relationship styling
│   ├── App.tsx                 # React Router configuration
│   ├── index.css               # Tailwind CSS base and grid utilities
│   └── main.tsx                # React DOM entry point
├── index.html                  # HTML entry point with Geist & KaTeX fonts
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:pizzaparth/tessera.git
   cd tessera
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

### Running Locally

To run both the Vite frontend client and the Express stateless API proxy concurrently:
```bash
npm run dev
```

Or run them individually:
```bash
# Start frontend client on http://localhost:5173
npm run dev:client

# Start stateless backend proxy on http://localhost:3001
npm run dev:server
```

Open [http://localhost:5173](http://localhost:5173) in your browser to launch the application.

### Production Build

To verify TypeScript types and generate the production bundle:
```bash
npm run build
```

To preview the built production bundle locally:
```bash
npm run preview
```

---

## Operating Without an API Key

TESSERA is fully functional without entering an API key:
- **Sample Knowledge Graph**: Explore 15+ peer-reviewed models, equations, and notes immediately.
- **Guided Demo Mode**: Select any of the built-in research conversations in the Conversation Mapper (e.g. *Cross-Sectional Momentum vs Short-Term Reversal* or *High-Frequency Order Flow & Execution*), and click **Extract Concepts**. TESSERA generates simulated extraction proposals deterministically without consuming API quota.
- **Optional Live AI Extraction**: If you wish to analyze custom text, click the **Use API Key** button to provide a session-only key for OpenAI, Anthropic, or Google Gemini. The key is held only in RAM and discarded when the tab is closed.

---

## Creator's Note

> “I built TESSERA to explore how AI, graph theory, and quantitative research can come together in one focused workspace. The project is a chance to make research connections visible and to learn by building the tools I would want to use.”
> 
> — **Parth**, creator of TESSERA

---

## License

This project is licensed under the [MIT License](LICENSE).
