# TESSERA

### Turn conversations into connected knowledge

TESSERA is a personal AI-assisted knowledge-mapping app. It takes a conversation, uses AI to suggest its key concepts and connections, and presents them as an interactive, Obsidian-like graph with Markdown notes behind the nodes.

The idea is deliberately focused: **AI conversation mapping + an explorable knowledge graph + Markdown notes, with a subtle quantitative touch.** TESSERA is not a general-purpose research suite or a trading platform. It is a visual way to turn useful conversations into a connected map that can be explored, edited, and understood.

## How it works

1. **Bring in a conversation.** Paste a conversation or a selected passage into the mapper.
2. **Ask AI to map it.** AI suggests important concepts, a short summary, and possible relationships between the concepts.
3. **Review the suggestions.** Edit, accept, or reject proposed concepts and links. AI output stays a suggestion until the user approves it.
4. **Explore the graph.** Approved concepts appear as nodes in an interactive graph. Select a node, zoom into its neighborhood, follow a connection, or switch back to the full map.
5. **Open the Markdown note.** Each concept has a readable, editable Markdown note with its explanation, source passage, and related concepts.

The result is a visual memory of a conversation: the original discussion provides context, the AI helps surface structure, the graph shows how ideas connect, and Markdown notes make each idea useful on its own.

## The product

### AI conversation mapper

The mapper is the starting point for creating a graph. A user pastes text, chooses an extraction action, and receives candidate concepts and relationships. Suggestions can include a concise definition, the passage they came from, and a proposed relationship type such as *depends on*, *supports*, *contradicts*, *extends*, or *related to*.

The user reviews the result before it changes the graph. This keeps the map understandable and gives the researcher control over AI-generated structure. A sample conversation and sample extraction let visitors try the flow without an API key.

### Obsidian-like graph view

The graph is the main workspace. Concepts are nodes; links are edges. Users can pan and zoom, search for a concept, select a node, inspect its direct connections, and open its note. A local graph view focuses on a selected concept and its nearby nodes; the global view shows the full sample map.

The graph should be easy to read at a glance. Node labels remain clear, relationship types explain why ideas are connected, and selected concepts stand out without hiding the rest of the map. The interaction can feel fluid and tactile, while the underlying content remains simple concepts and links.

### Markdown notes

Selecting a node opens its Markdown note in a side panel or focused editor. A note can contain a definition, explanation, source excerpt, and links to related concepts. Users can edit the note during the current session, and see that content reflected in the graph when appropriate.

Markdown is the human-readable layer behind the visual map. TESSERA does not require a proprietary note format or a complex document workflow.

### A subtle quant touch

Quantitative influence appears in the way the graph can be inspected and visualized, rather than restricting the app to finance topics. TESSERA can show simple graph measures such as node and connection counts, clusters, highly connected concepts, bridge concepts, and paths between selected ideas. These measures describe the structure of the current map; they do not claim that an idea is true or important simply because it has many links.

The visual language can borrow from modern data products through precise charts, clear labels, elegant network visualizations, and thoughtful use of color. A quantitative-finance conversation can be used as one sample, but the same mapping experience works for any conversation a user wants to organize.

## Demo behavior

TESSERA is a hobby and portfolio project designed as a no-account demo. Visitors can explore the preloaded sample graph without signing up. There are no profiles, saved workspaces, subscriptions, or cloud libraries.

All changes made in the interactive demo—including graph edits, note edits, and the API key—exist only in the active tab's memory. They are not written to a database, browser storage, or cookies. Refreshing the page or closing the tab clears the session and restores the sample content.

For live AI actions, a visitor can enter their own compatible API key for that session. TESSERA does not save the key. Text submitted for an AI action is sent to the selected AI provider, whose handling of the request follows that provider's own policies. The built-in sample flow remains available without a key.

## Modern SaaS visual direction

TESSERA should look like a polished modern SaaS product: light, spacious, friendly, and premium. Use an off-white or very pale lavender page background, white cards and panels, deep ink text, and a distinctive indigo or violet primary accent. Add subtle sky blue, mint, or coral accents to distinguish graph categories and states. Soft gradients, delicate shadows, fine borders, and rounded corners give the interface depth without making it feel busy.

The landing page should have a confident headline, generous whitespace, clear typography, concise copy, and a large product preview. The app workspace should use familiar SaaS patterns: compact navigation, a clear main canvas, a contextual detail panel, and well-spaced controls. The graph should feel inviting and legible, with softly colored nodes, elegant connections, readable labels, and a clean canvas. Avoid terminal styling, dense trading dashboards, and technical-console visuals.

## Motion and landing page

Motion is a major part of the experience. The interface should react to scrolling, clicking, selecting, filtering, editing, and navigating, so the product feels responsive and alive.

The landing page should include:

- A hero with a softly animated graph illustration and a clear “Try the demo” action.
- A scripted product walkthrough that simulates a cursor selecting a node, zooming into a cluster, opening a Markdown note, mapping a conversation, approving a relationship, and returning to the graph. The walkthrough uses repeatable sample data and can be paused or replayed.
- Animated feature cards for AI mapping, graph exploration, and Markdown notes.
- A graph and analytics showcase with animated sample charts.
- A carousel for product screens or example maps, with touch, keyboard, and button controls.
- A creator's note, signed by Parth, presented clearly as the project owner's own review rather than a customer testimonial.
- A final action that opens the demo directly, without a sign-up flow.

Within the app, node selection can smoothly focus the graph on a neighborhood; filters can animate nodes and links in or out; drawers and note panels can transition into view; charts can animate when their data changes; and buttons should give immediate hover, press, focus, loading, and completion feedback. Use motion across the product, with smooth transitions and a consistent timing style. Respect reduced-motion preferences and keep essential information understandable without animation.

## Screens

### 1. Landing page

Introduces TESSERA, explains the AI-to-graph workflow, shows the scripted product walkthrough, and links directly to the demo. It has no login or sign-up screen.

### 2. Demo workspace

Opens on a sample conversation map. The screen centers on the interactive graph, with navigation to the mapper and analytics and a contextual panel for the selected concept. The sample is ready to explore without an API key.

### 3. Conversation mapper

Lets the visitor paste a conversation, request AI concept extraction, and review a short summary plus suggested concepts and links. A sample input and simulated result explain the flow when no API key is entered.

### 4. Concept and Markdown note

Shows a selected graph node's definition, source passage, typed relationships, and editable Markdown note. Users can move between the note and its graph neighborhood without losing in-session changes.

### 5. Graph insights

Shows lightweight structural information about the current map: counts, clusters, connected concepts, bridges, and paths. It supports the quant-inspired feel without turning the product into a finance terminal or a broad analytics suite.

### 6. Session and API key panel

Explains that the demo is temporary, lets the visitor enter or clear an API key for the active tab, and provides a “Reset demo” action that restores the sample graph immediately.

## Open-source libraries and tools

| Library or tool | Use in TESSERA |
|---|---|
| [React](https://react.dev/) | Build the interactive app and its screens. |
| [Vite](https://vite.dev/) | Frontend development server and production build. |
| [TypeScript](https://www.typescriptlang.org/) | Define and check graph, note, and AI response data structures. |
| [Tailwind CSS](https://tailwindcss.com/) | Create the responsive modern SaaS design system and component styling. |
| [React Router](https://reactrouter.com/) | Navigate between the landing page, mapper, graph, notes, and insights. |
| [Cytoscape.js](https://js.cytoscape.org/) | Render and animate the interactive graph, and calculate basic graph measures. |
| [Milkdown](https://milkdown.dev/) | Edit Markdown notes. |
| [Motion for React](https://motion.dev/) | Build landing-page animation, scroll effects, responsive cards, transitions, and interaction feedback. |
| [Recharts](https://recharts.github.io/) | Display small, illustrative graph insight charts. |
| [Embla Carousel](https://www.embla-carousel.com/) | Power the landing-page carousel. |
| [Lucide React](https://lucide.dev/) | Provide consistent interface icons. |
| [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/) | Optional stateless server/API proxy for AI requests. If used, it must not save prompts, keys, notes, or graph changes. |
| [Git](https://git-scm.com/) and [GitHub](https://github.com/) | Version control and portfolio source-code hosting. |

### Data and stack decision

The earlier MERN idea included MongoDB, but this demo intentionally has no database because user changes must not persist. The app can use React for the client and Node.js with Express as a stateless AI request proxy, but without MongoDB it is not a full MERN application. The graph, notes, and API key stay in memory for the current tab only.

## Summary

**TESSERA** turns AI conversations into an editable Obsidian-like knowledge graph, with Markdown notes attached to concepts and a subtle quant touch through graph measures and data visualization. It is a focused, no-account demo with a polished modern SaaS design, highly reactive motion, and session-only state that disappears when the visitor refreshes or closes the tab.
