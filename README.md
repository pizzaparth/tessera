# TESSERA

### Turn conversations into connected knowledge

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?style=flat-square&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Cytoscape.js](https://img.shields.io/badge/Cytoscape.js-3.30-orange.svg?style=flat-square)](https://js.cytoscape.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](LICENSE)

**TESSERA** is a personal AI-assisted knowledge-mapping app. It takes a conversation, uses AI to suggest its key concepts and connections, and presents them as an interactive, Obsidian-like graph with Markdown notes behind the nodes.

The idea is deliberately focused: **AI conversation mapping + an explorable knowledge graph + Markdown notes, with a subtle quantitative touch.** TESSERA is not a general-purpose research suite or a trading platform. It is a visual way to turn useful conversations into a connected map that can be explored, edited, and understood.

---

## How It Works

1. **Bring in a conversation.** Paste a conversation or a selected passage into the mapper.
2. **Ask AI to map it.** AI suggests important concepts, a short summary, and possible relationships between the concepts.
3. **Review the suggestions.** Edit, accept, or reject proposed concepts and links. AI output stays a suggestion until the user approves it.
4. **Explore the graph.** Approved concepts appear as nodes in an interactive graph. Select a node, zoom into its neighborhood, follow a connection, or switch back to the full map.
5. **Open the Markdown note.** Each concept has a readable, editable Markdown note with its explanation, source passage, and related concepts.

The result is a visual memory of a conversation: the original discussion provides context, the AI helps surface structure, the graph shows how ideas connect, and Markdown notes make each idea useful on its own.

---

## The Product

### AI Conversation Mapper
The mapper is the starting point for creating a graph. A user pastes text, chooses an extraction action, and receives candidate concepts and relationships. Suggestions include concise definitions, the source passage they came from, and proposed relationship types such as *depends on*, *supports*, *contradicts*, *extends*, or *related to*.

The user reviews the result before it changes the graph. This keeps the map understandable and gives the user control over AI-generated structure. A sample conversation and sample extraction let visitors try the flow without an API key.

### Obsidian-Like Graph View
The graph is the main workspace. Concepts are nodes; links are edges. Users can pan and zoom, search for a concept, select a node, inspect its direct connections, and open its note. A local graph view focuses on a selected concept and its nearby nodes; the global view shows the full sample map.

Node labels remain clear, relationship types explain why ideas are connected, and selected concepts stand out without hiding the rest of the map. The interaction feels fluid and tactile, while the underlying content remains simple concepts and links.

### Markdown Notes
Selecting a node opens its Markdown note in a side panel or focused editor. A note can contain a definition, explanation, source excerpt, and links to related concepts. Users can edit the note during the current session, and see that content reflected in the graph when appropriate.

### A Subtle Quant Touch
Quantitative influence appears in the way the graph can be inspected and visualized, rather than restricting the app to finance topics. TESSERA shows simple graph measures such as node and connection counts, clusters, highly connected concepts, bridge concepts, and paths between selected ideas. These measures describe the structure of the current map; they do not claim that an idea is true or important simply because it has many links.

---

## Demo Behavior & Stateless Operating Model

TESSERA is a hobby and portfolio project designed as a no-account demo. Visitors can explore the preloaded sample graph without signing up. There are no profiles, saved workspaces, subscriptions, or cloud libraries.

All changes made in the interactive demo—including graph edits, note edits, and the API key—exist only in the active tab's memory. They are not written to a database, browser storage, or cookies. Refreshing the page or closing the tab clears the session and restores the sample content.

For live AI actions, a visitor can enter their own compatible API key for that session. TESSERA does not save the key. The built-in sample flow remains available without a key.

---

## Modern SaaS Visual Direction

TESSERA is styled as a polished modern SaaS product: light, spacious, friendly, and premium.
- **Palette**: Off-white/pale lavender background (`#faf9fc`), crisp white cards and panels, deep ink text (`#0f172a`), distinctive indigo/violet primary accent (`#6366f1` / `#7c3aed`), and subtle sky blue, mint, or coral accents.
- **Layout**: Familiar SaaS patterns with compact navigation, clear main canvas, contextual detail panel, and generous whitespace.
- **Motion**: Fluid animations reacting to scrolling, selecting, filtering, and navigating, with reduced-motion support.

---

## Screens

1. **Landing Page**: Introduces TESSERA, explains the AI-to-graph workflow, shows the scripted product walkthrough, and links directly to the demo without a sign-up flow.
2. **Demo Workspace**: Opens on a sample conversation map, centering on the interactive graph with navigation to the mapper and insights, plus a contextual detail panel for the selected concept.
3. **Conversation Mapper**: Lets the visitor paste a conversation, request AI concept extraction, and review a short summary plus suggested concepts and links before adding them to the graph.
4. **Concept and Markdown Note**: Shows a selected graph node's definition, source passage, typed relationships, and editable Markdown note.
5. **Graph Insights**: Shows lightweight structural information about the current map: counts, clusters, connected concepts, bridges, and connection paths.
6. **Session and API Key Panel**: Explains the stateless demo model, lets the visitor enter or clear an API key for the active tab, and provides a “Reset demo” action that restores the sample graph immediately.

---

## Open-Source Libraries & Tools

| Library / Tool | Purpose in TESSERA |
|---|---|
| **React 18** | Interactive application UI and component architecture |
| **Vite 6** | Local development server and production bundler |
| **TypeScript 5.7** | Type safety across graph nodes, edges, and session state |
| **Tailwind CSS 3.4** | Modern light SaaS design system and responsive styling |
| **React Router 7** | Client-side routing between landing page and workspace screens |
| **Cytoscape.js 3.30** | Interactive knowledge graph rendering, force-directed layouts, and path finding |
| **React Markdown / Remark / KaTeX** | Human-readable Markdown note editing, syntax formatting, and formula rendering |
| **Motion for React** | Landing page reveals, scripted cursor walkthrough, and smooth transitions |
| **Recharts 2.15** | Lightweight structural insight charts and cluster distributions |
| **Embla Carousel 8** | Interactive screen carousel with touch, keyboard, and button controls |
| **Lucide React** | Consistent, modern UI icons |
| **Node.js & Express** | Stateless AI proxy for OpenAI, Anthropic, and Gemini requests |

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher

### Installation

```bash
git clone git@github.com:pizzaparth/tessera.git
cd tessera
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

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Creator's Note

> “I built TESSERA to explore how AI, graph theory, and quantitative research can come together in one focused workspace. The project is a chance to make research connections visible and to learn by building the tools I would want to use.”
> 
> — **Parth**, creator of TESSERA

---

## License

This project is licensed under the [MIT License](LICENSE).
