# Obsidian + Claude AI Knowledge Graph

A desktop-grade recreation of **Obsidian** equipped with an embedded **Claude AI Assistant Plugin**. Chat with Claude directly inside your vault to brainstorm, synthesize thoughts, and watch Claude dynamically expand your knowledge graph in real time.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?style=flat-square&logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Cytoscape.js](https://img.shields.io/badge/Cytoscape.js-3.30-orange.svg?style=flat-square)](https://js.cytoscape.org/)
[![Anthropic Claude](https://img.shields.io/badge/Claude-3.5_Sonnet-d97757.svg?style=flat-square)](https://anthropic.com/)

---

## Features

### 1. Obsidian Native Interface
- **Dark Theme (`#1e1e1e`)**: Obsidian's signature aesthetic with sidebars, window controls, ribbon, and status bar.
- **Activity Ribbon**: Collapsible file explorer, graph toggle, note editor, and Claude plugin shortcut.
- **Vault File Explorer**: Hierarchical folders (`Artificial Intelligence`, `Cognitive Science`, `Philosophy of Mind`, `Systems Theory`) with instant file filtering.
- **Obsidian Tab Bar**: Multi-tab management, quick note creation (`+`), and split view mode (graph and note side-by-side).

### 2. Obsidian Graph View (Unlabeled Connecting Wires)
- **Native Graph Visuals**: Nodes as glowing circular dots, with clean, delicate connecting wires without distracting wire labels.
- **Graph Physics Controls**: Sliders for node size, link distance, and repel forces.
- **Neighborhood Focus**: Selecting or hovering over any note highlights its direct links and dims distant ideas.

### 3. Claude for Obsidian (AI Agent Plugin)
- **AI Agent Chat**: Embedded right-hand sidebar replicating an Obsidian community plugin for Anthropic's Claude.
- **Dynamic Node Expansion**: When chatting with Claude, the AI assistant creates new notes in your vault and automatically links them into the interactive graph.
- **Clickable Expansion Chips**: Easily jump from Claude's response directly to newly generated nodes on the canvas.

### 4. Markdown Note Editor with Wikilinks
- Edit notes in Reading, Source, or Split view.
- Supports Obsidian wikilinks: `[[Concept Name]]` are clickable and immediately navigate across notes.
- Linked mentions and backlink tracking at the bottom of every note.

---

## Getting Started

### 1. Configure Your API Key

In `.env`, place your Anthropic Claude API key:

```env
# Anthropic API Key for Claude (leave your key here)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

PORT=3001
```

*(Note: If no API key is provided, the application runs in simulated mode with built-in intelligent graph expansion so you can test the full experience out of the box).*

### 2. Installation & Running

```bash
# Install dependencies
npm install

# Start both client and backend proxy concurrently
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build

```bash
npm run build
npm run preview
```

---

## License

MIT License.
