# Brain Vault • AMOLED Neural Graph & Multi-Model AI Assistant

A high-performance personal knowledge vault and interactive 2D neural graph engine equipped with an embedded **Universal AI Assistant Plugin**. Connect any frontier AI model (Anthropic Claude, OpenAI GPT-4o, Google Gemini, DeepSeek, or custom endpoints) directly into your vault to brainstorm, reason, and watch the AI dynamically expand your knowledge graph in real time with zero-labeled connecting wires.

---

## ✨ Core Features

### 1. AMOLED Pure Black Desktop Interface
- **Pure Black Theme (`#000000`)**: Deep OLED pitch-black contrast paired with solid white text (`#ffffff`) and vibrant neon accents (electric purple, neon cyan, mint, rose, amber).
- **Desktop Window Titlebar**: macOS traffic light controls, vault switcher, tab management, split-view toggle (graph + note editor side-by-side), and quick vault reset.
- **Left Activity Ribbon**: Sleek icon strip for switching between graph view, files explorer, note editor, AI assistant, and settings.
- **Hierarchical File Tree**: Collapsible folders, instant search filtering, note counts, and quick note creation.
- **Bottom Status Bar**: Live note and link counters, word and character counters, and active AI model indicator.

### 2. High-Performance 2D Canvas Graph View
Replicates desktop graph view properties in great detail using high-DPI HTML5 Canvas (60 FPS spring-electrical physics simulation):
- **Clean Unlabeled Connecting Wires**: Edges render as delicate connecting wires with zero label clutter.
- **Degree-Scaled Node Radii**: Nodes dynamically scale in size according to their connectivity degree (in-degree + out-degree).
- **Neighborhood Focus Highlighting**: Hovering or selecting any node highlights its immediate neighbors and connecting wires with electric violet glow while smoothly dimming background nodes.
- **Interactive Camera Controls**: Smooth cursor-centered wheel zooming, drag-to-pan, and individual node dragging with automatic physics repositioning.
- **Floating 4-Tab Settings Drawer**:
  - **Filters**: Instant node search filtering and orphans toggle.
  - **Groups**: Color grouping rules matching queries with custom neon hues.
  - **Display**: Node size multiplier, link thickness, text fade threshold, and directional arrows.
  - **Forces**: Center gravity pull, Coulomb many-body repulsion, link spring tension, and link distance.

### 3. Universal AI Assistant Plugin
- **Any AI Model**: Seamlessly switch between frontier models across:
  - **Anthropic**: Claude 3.5 Sonnet, Claude 3.7 Sonnet, Claude 3.5 Haiku
  - **OpenAI**: GPT-4o, GPT-4o Mini, o1 Reasoning
  - **Google Gemini**: Gemini 2.0 Flash, Gemini 1.5 Pro
  - **DeepSeek**: DeepSeek Chat (V3), DeepSeek Reasoner (R1)
  - **Custom / OpenRouter**: Any OpenAI-compatible endpoint
- **Real-Time Dynamic Graph Expansion**: When chatting with the AI, concepts and relationships proposed by the model are automatically synthesized and injected directly into the live graph as new nodes and connecting wires!
- **Interactive Concept Pills**: Newly generated concepts appear as interactive buttons in chat that immediately pan to and focus the node in the graph view.
- **API Key Management**: Configure API keys in `.env` or enter them directly inside the plugin UI per provider.
- **Intelligent Fallback Engine**: If no API key is supplied, a built-in semantic concept expander generates rich contextual nodes and relationships so you can explore immediately without friction.

### 4. Markdown Note Vault & Backlinks
- **Markdown Editor**: Dual edit and live preview modes, or side-by-side split view.
- **Bidirectional Wikilinks**: Type `[[Note Name]]` anywhere in your notes to automatically link notes together. Click any wikilink in preview mode to jump to that note.
- **Linked References Panel**: Automatically detects and lists incoming backlinks and outgoing forward links at the bottom of every note.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation
```bash
git clone git@github.com:pizzaparth/tessera.git
cd tessera
npm install
```

### Environment Configuration
Copy `.env.example` to `.env` and fill in any API keys you wish to use:
```bash
cp .env.example .env
```

```env
# Port for local backend server
PORT=3001

# Anthropic Claude API Key
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# DeepSeek API Key
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

*(Note: You can also leave them blank and use the built-in intelligent fallback generator, or enter API keys inside the web interface)*

### Run Development Server
```bash
npm run dev
```
- Client runs on `http://localhost:5173`
- Backend API server runs on `http://localhost:3001`

### Build for Production
```bash
npm run build
```

---

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, React Markdown, Remark GFM
- **Graph Simulation**: Pure HTML5 Canvas 2D with Spring-Electrical Force Simulation and High-DPI Retina Scaling
- **Backend**: Express, TypeScript (tsx), Universal AI Model Proxy (Anthropic, OpenAI, Gemini, DeepSeek)
