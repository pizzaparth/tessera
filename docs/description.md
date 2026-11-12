# TESSERA

### A quantitative research knowledge system

TESSERA is a browser-based, AI-assisted research workspace for turning conversations and research notes into a connected map of quantitative finance ideas. It brings together three familiar ways of working: chat-based exploration, an Obsidian-like interactive knowledge graph, and Markdown notes. A researcher can explore a topic, identify its important concepts, connect those concepts with meaningful relationships, and inspect the resulting structure as a navigable graph.

TESSERA is a personal portfolio project and a hands-on demonstration of product design, frontend engineering, graph visualization, and AI integration. It is designed as a polished, temporary demo rather than a hosted research service. There are no user accounts, subscriptions, cloud workspaces, or saved user libraries. Visitors can explore a ready-made sample workspace immediately, or provide their own compatible AI API key to try live concept extraction.

## Product vision

Quantitative research rarely follows a straight line. A question about a trading signal may lead to market microstructure, time-series analysis, statistical inference, optimization, risk, and implementation. These ideas often live in separate conversations and notes, making it difficult to see how the pieces fit together.

TESSERA is intended to make those connections visible. It treats research as a network of concepts, claims, questions, sources, and methods. The graph is the map; Markdown notes hold the detail; AI helps identify candidate structure from a conversation. The researcher remains in control of what is accepted and how it is interpreted.

Its quant-finance identity comes from the subject matter and analytical tools: factor research, portfolio construction, market microstructure, risk, execution, time series, and graph measures. Graph analytics describe the shape of the research map; they do not claim to validate an investment thesis, forecast returns, or provide financial advice.

## Demo-only operating model

TESSERA is intentionally stateless. All editable notes, graph changes, filters, and temporary workspace state exist only in the active browser tab's memory. Refreshing the page, closing the tab, or leaving the demo clears those changes. The application does not write user content to MongoDB, local storage, session storage, cookies, or another persistent store. There is no account system and no saved personal workspace.

The demo opens with a built-in sample research map so the product can be explored without an API key. Visitors can pan and zoom, open notes, inspect links, apply filters, and try editing the sample. Their edits are temporary and reset when the demo is reloaded.

For live AI-assisted extraction, a visitor may enter their own compatible provider API key for the current session. The key is held in memory and discarded when the tab is refreshed or closed; it is not embedded in the source code or saved by TESSERA. The key is used only when the visitor explicitly requests an AI operation. The text submitted for that operation is sent to the selected AI provider, and that provider's handling of requests is governed by its own terms and settings. Visitors should use a key suitable for experimentation and avoid submitting sensitive research or credentials.

This model keeps the project simple and transparent: no sign-up, no user database, and no expectation that a demo session will survive a reload. Sample content is repeatable, while any changes made during a visit are disposable by design.

## Core experience

### 1. AI-assisted conversation mapping

A researcher can paste a conversation, excerpt, or short research note into the conversation mapper. TESSERA can ask the AI provider to suggest:

- Candidate concepts, such as *momentum*, *volatility targeting*, *market impact*, or *survivorship bias*.
- Claims and hypotheses that appear in the text.
- Open questions, assumptions, methods, datasets, and metrics.
- Relationships between the extracted concepts.
- A concise summary and possible follow-up questions.

The output is a reviewable proposal, not an automatic write to a permanent library. The researcher can inspect each suggestion, edit its wording, choose a concept type, accept or reject it, and adjust its links. Approved items update the in-memory demo graph and can be opened as Markdown notes. Refreshing the tab returns the experience to the clean sample state.

### 2. Interactive knowledge graph

The graph is the primary research navigation surface. Concepts appear as nodes and typed relationships as connecting edges. Users can pan and zoom through the map, select a node to open its note, inspect its direct neighborhood, follow a path between ideas, and narrow the view by topic, node type, or relationship type.

Visual encoding can make different kinds of research material easier to scan: a node's shape or label can identify its type; a restrained color system can distinguish domains or unresolved questions; and edge labels can explain why concepts are connected. A local graph view focuses on the selected concept and its nearby links, while the global view shows the broader sample network.

The sample map is intentionally small enough to explore quickly, but rich enough to demonstrate clusters and bridges across quantitative finance. For example, a factor research cluster might connect to data quality through survivorship bias, to portfolio construction through weighting, and to evaluation through transaction costs.

### 3. Markdown-first concept notes

Each graph concept can open a Markdown note with a definition, plain-language explanation, equations, assumptions, examples, related concepts, and source references. Notes are editable during the current session and remain useful independently of the graph. A researcher can move from a node to its detail, revise an explanation, then return to the map and continue exploring.

The editor is intended to support readable Markdown rather than hide the underlying text behind a proprietary document format. Because this is a temporary demo, note edits stay in memory. The project does not claim to provide durable note storage, file synchronization, backups, or cross-device access.

### 4. Concept types and typed relationships

Concepts can be categorized as a method, model, dataset, instrument, metric, hypothesis, source, or research question. Links carry explicit meanings rather than being generic lines. Example relationship types include:

- **depends on** — a method relies on a prior concept or assumption.
- **extends** — one method develops or generalizes another.
- **measures** — a metric evaluates a model, portfolio, or process.
- **uses data from** — a method or claim relies on a dataset or source.
- **supports** / **challenges** — evidence bears on a claim or hypothesis.
- **contradicts** — two claims or assumptions appear to conflict.
- **related to** — a useful association that does not imply a stronger claim.

AI can suggest node types and relationships, but the researcher can revise them before accepting them into the temporary graph. The explicit edge labels make the map easier to interpret and more useful for research than a collection of unlabeled backlinks.

### 5. Graph analytics

An analytics view can summarize the sample graph and the current in-session edits. It may show node and relationship counts, node-type distribution, domain clusters, highly connected concepts, bridge concepts, isolated nodes, and short paths between selected ideas. A small set of visual charts can show how the demo graph is organized and help users notice areas that may deserve further exploration.

These statistics are descriptive. High centrality means a concept has many or strategically placed connections in the current graph; it does not mean the concept is true, valuable, or predictive. Any dashboard figures shown in marketing or demo screens should be clearly identified as sample data.

### 6. Research workflows and provenance

The demo can illustrate a lightweight research cycle:

1. Start with a research question or conversation.
2. Extract candidate concepts, claims, and unknowns.
3. Review the suggestions and create typed links.
4. Explore clusters, bridges, and nearby notes in the graph.
5. Draft a synthesis note with assumptions and next questions.

Each concept or claim can show provenance metadata inside the current session: where it came from, the relevant excerpt, whether it was suggested by AI or written by the researcher, and when it was added to the demo. This illustrates how an auditable research tool could distinguish source material from interpretation. It is not a durable evidence archive: all provenance annotations created by the visitor disappear with the rest of the session state.

Version history can be demonstrated as a temporary change timeline for a note or graph item during one visit. It helps show how an idea changes as a researcher edits it, but it is cleared on reload and is not a persistent audit log.

## Landing page and visual direction

The visual identity is **modern SaaS**, with a polished, welcoming product feel. TESSERA should look like a premium web application a researcher would enjoy spending time in: spacious, clear, softly dimensional, and confident. It should not resemble a command-line tool, trading terminal, or dense institutional dashboard.

Use a warm off-white or very pale lavender canvas for the landing page, crisp white content surfaces, deep ink or navy text, and a distinctive indigo-to-violet primary accent. Add small touches of sky blue, mint, and soft coral to distinguish graph domains and states. Gradients can add depth to the hero, graph illustrations, and calls to action, while shadows, fine borders, and translucent layers should remain soft and controlled. Reserve amber or coral for attention states instead of using a traffic-light palette throughout.

Give the layout generous whitespace, clear headline hierarchy, comfortable line lengths, and a consistent spacing rhythm. Use contemporary sans-serif typography, large confident headings, readable body copy, generous rounded corners, and carefully aligned cards. Product screenshots should appear inside polished browser-like frames with clean navigation, a compact sidebar, clear panels, and purposeful empty space. Use consistent iconography and simple illustrations that feel native to the product rather than decorative stock art.

The graph should feel like a beautiful, interactive product visualization rather than a technical network diagram. Use clear node labels, soft colored node fills, elegant curved connections, readable relationship chips, subtle depth, and animated highlighting to make clusters inviting to explore. The workspace can use a light, card-based SaaS layout with a strong content canvas, a compact left navigation, contextual right-side detail panels, and concise toolbars. Dense research information should remain organized into readable modules rather than packed into a single screen.

Motion is a defining part of the experience: the page and workspace should feel alive and react to the visitor's actions, content, and navigation. Use motion generously across the product, while keeping it smooth, legible, responsive, and respectful of reduced-motion preferences.

### Motion-first interaction direction

TESSERA should use motion throughout the product rather than limiting animation to the hero section. Animation should respond to what the visitor does and to how the visible data changes. The goal is a highly reactive, tactile interface where clicks, selections, filters, scrolling, graph navigation, and screen changes all receive clear animated feedback.

- **Scroll-reactive storytelling:** Landing-page sections can enter with staggered reveals, pinned product demonstrations, moving graph paths, and transitions that progress as the visitor scrolls. The animation should pause when offscreen and remain smooth on smaller devices.
- **A cinematic product walkthrough:** The demo animation should show a visible cursor, realistic click and selection states, a graph canvas zooming into a concept neighborhood and back out, a note drawer opening, an extraction screen appearing, suggestions being accepted, and analytics charts drawing into view. Screen changes should use coordinated transitions so the walkthrough feels like one continuous session rather than disconnected screenshots.
- **Living graph behavior:** Nodes can ease into their layout, gently respond to hover and focus, enlarge or brighten when selected, and reveal labels as the viewport approaches. Selecting a concept can animate its neighborhood into focus, dim unrelated nodes, trace a path between concepts, and smoothly move the graph camera. Filter changes can animate nodes and edges in or out rather than replacing the entire graph abruptly.
- **Reactive details and panels:** Concept cards, note drawers, tooltips, command menus, filters, and dialogs can use shared layout transitions, spring-based entrances, and clear exit motion. Expanding a note from a graph node can visually connect the selected node to its detail panel.
- **Animated cards and calls to action:** Feature cards can respond to pointer movement with restrained tilt or depth, animate their graph motifs, and transition into fuller details on selection. Buttons should have responsive hover, press, focus, and loading states, with feedback for successful or unavailable actions.
- **Data-driven chart motion:** Analytics charts can draw lines, grow bars, and reveal labels when they enter view or when a filter changes. Graph metrics should count up from zero on first reveal and update smoothly when the temporary graph changes, without implying financial performance.
- **Carousel motion:** Landing-page carousels should support drag, touch, keyboard, and button navigation, with smooth slide transitions and animated progress indicators. The active item can expand or sharpen while neighboring items remain partially visible.
- **Ambient interface motion:** A restrained animated grid, slowly shifting graph connections, subtle cursor-following highlights, and low-amplitude background movement can reinforce the quantitative research identity. These ambient effects should never compete with text or controls.
- **Reactive state transitions:** Loading an AI response, reviewing suggestions, accepting a link, switching graph filters, clearing a session, and returning to the sample should each have distinct, immediate feedback. Skeletons, progress indicators, success states, and reset transitions should explain what the interface is doing.
- **Performance and accessibility:** Prefer transforms and opacity for frequent animations, avoid animating large layout changes unnecessarily, and pause decorative effects when they are offscreen or the tab is inactive. Respect `prefers-reduced-motion` with a reduced-motion mode that removes parallax, autoplay, and large camera movements while preserving clear state feedback. Do not make essential information available only through movement.

Motion for React is the primary tool for page transitions, scroll-linked effects, gestures, and animated React components. Cytoscape.js handles graph viewport and element animation. CSS transitions cover small state changes such as color, borders, and focus rings. These tools should work together through shared timing and easing conventions so graph movement, panels, cards, and screen transitions feel like parts of the same product.

### Landing page sections

1. **Navigation and hero:** TESSERA wordmark, links to Features, Workflow, and About, plus a prominent “Explore the demo” action. The hero states the product promise and places an animated graph motif beside the headline.
2. **Guided product demonstration:** A scripted, repeatable animation walks through a sample workspace. It simulates selecting a concept, zooming into its neighborhood, opening a note, mapping a conversation, approving a suggested link, switching to analytics, and zooming back out to the full network. Cursor movement, clicks, animated content updates, viewport changes, and screen transitions make the workflow understandable without an API key. Visitors can pause, replay, or skip the walkthrough.
3. **Feature cards:** Animated cards introduce conversation mapping, typed relationships, Markdown notes, graph analytics, and source provenance. Cards can reveal content on scroll, respond to hover and pointer movement, and animate their miniature graphs or charts when selected, with reduced-motion behavior for accessibility.
4. **Research workflow:** A clear step-by-step section shows how a conversation becomes a reviewed graph and a synthesis note.
5. **Graph and analytics showcase:** Sample network and chart visuals reveal clusters, bridges, paths, and node counts. All values are labeled as illustrative demo content.
6. **Carousel:** A responsive carousel presents selected screens or research use cases, with keyboard and touch controls and clear position indicators.
7. **Creator's note:** An animated quote card presents the creator's personal review: “I built TESSERA to explore how AI, graph theory, and quantitative research can come together in one focused workspace. The project is a chance to make research connections visible and to learn by building the tools I would want to use.” It is signed “— Parth, creator of TESSERA.” The card can enter with a quote-mark reveal and gentle emphasis on the signature. This is explicitly an owner-authored note, not a customer testimonial.
8. **Final call to action and footer:** A direct path into the no-account demo, followed by project, source-code, and technology links as available.

The guided landing-page demonstration should use scripted sample data and deterministic transitions so the same story can be shown on every visit. It is separate from the live demo workspace: marketing animation remains watchable without an API key, while “Explore the demo” opens the interactive, editable sample workspace. The walkthrough should feel like a miniature live product session, with animated cursor movement, click feedback, graph camera movement, responsive panels, and transitions synchronized with the story. It should not depend on actual AI latency or require the visitor to wait for a network response.

## Screens and navigation

### Public landing page

The product introduction and animated showcase. It explains the problem, presents the guided demo, describes the main capabilities, and links directly into the workspace. There is no sign-up or login screen.

### Demo launch and API key panel

The entry point to the interactive application. Visitors can continue with the built-in sample map or open an optional panel to enter a compatible API key for live AI actions. The panel explains that the key stays in memory for this tab only and that the provider receives prompts submitted for AI processing. The visitor can clear the key at any time. No key is required to explore the sample graph and notes.

### Research workspace overview

A compact home screen for the active sample workspace. It can show a research prompt, recently explored sample concepts, graph summary counts, and quick actions for “Open graph,” “Map a conversation,” and “View analytics.” These are all views of temporary sample data, not saved projects.

### Conversation mapper

A focused screen for pasting or editing a conversation excerpt, choosing an extraction action, and reviewing the resulting summary, concepts, claims, and questions. The user can ask for concept suggestions, then move the results into the review queue. If no API key is present, the screen can offer a short guided example using the built-in sample conversation.

### Extraction review

A review screen or side panel that lists proposed nodes and relationships. Each suggestion shows its type, short explanation, confidence or review status where available, and source excerpt. Users can edit, accept, reject, or change links before updating the in-memory graph. Accepted changes remain temporary.

### Global graph explorer

The full interactive network view. It includes search, zoom controls, graph layout selection, topic and relationship filters, a local/global view toggle, and a details panel for the selected concept. The graph is the main destination for discovering how research topics connect.

### Local graph and concept detail

A focused view of one concept and its immediate connections. The details panel can include the concept definition, type, relationships, related claims, provenance, and actions to open its note or add a temporary connection. The user can return to the global graph without losing current in-tab edits.

### Markdown note editor

A split or tabbed note view with readable Markdown content, editing controls, related concept links, provenance details, and a temporary revision timeline. Changes update the active in-memory workspace only. A visible session-only indicator should make the temporary nature clear.

### Graph analytics dashboard

A visual summary of the current graph, including counts, node types, clusters, central concepts, bridges, isolated nodes, and paths. Charts and metrics use the current sample or session state and carry explanatory labels so users do not confuse structural graph measures with financial performance.

### Research synthesis view

A focused writing screen for combining notes into a short research brief: question, context, evidence, assumptions, competing explanations, and next steps. It can reference graph concepts and sources, while any generated draft remains editable and temporary.

### Session and demo information panel

A small, unobtrusive panel explains the demo reset behavior, API-key handling, sample-data scope, and session status. It can include “Clear session and restart” to discard all in-memory edits immediately and restore the sample workspace.

## Open-source libraries and tools

The following choices form the planned implementation set. They are selected to cover the graph, editor, motion, charts, and carousel without relying on a paid component library. Motion is a first-class part of the design: Motion for React handles page and component animation, Cytoscape.js animates the graph itself, and CSS handles fine-grained interface feedback.

| Library or tool | Role in TESSERA | Notes |
|---|---|---|
| [React](https://react.dev/) | User interface and screen components | Builds the interactive single-page experience. |
| [Vite](https://vite.dev/) | Local development and production build | Runs the frontend development workflow and bundles the app. |
| [TypeScript](https://www.typescriptlang.org/) | Application language and type checking | Helps define graph nodes, edges, extraction results, and temporary session state. |
| [Tailwind CSS](https://tailwindcss.com/) | Styling system | Supports the responsive, spacious SaaS visual system, reusable design tokens, and polished component states. |
| [React Router](https://reactrouter.com/) | In-app screen navigation | Connects the workspace, graph, mapper, notes, and analytics views without account routes. |
| [Cytoscape.js](https://js.cytoscape.org/) | Knowledge graph rendering and graph analysis | Provides interactive nodes and edges, viewport controls, layouts, and graph algorithms. The core library is MIT-licensed. |
| [Milkdown](https://milkdown.dev/) | Markdown note editing | Provides an extensible Markdown editor that can be styled to match the product. |
| [Motion for React](https://motion.dev/) | Landing-page and interface animation | Powers scroll-linked storytelling, animated cards, layout and screen transitions, gestures, carousels, and responsive feedback. Motion is open source and MIT-licensed. |
| [Recharts](https://recharts.github.io/) | Analytics charts | Renders responsive charts for graph counts, types, and illustrative research activity. |
| [Embla Carousel](https://www.embla-carousel.com/) | Landing-page carousel | Provides lightweight touch and keyboard-friendly carousel behavior. |
| [Lucide React](https://lucide.dev/) | Interface icons | Supplies a consistent open-source icon set. |
| [Node.js](https://nodejs.org/) | JavaScript runtime for development and optional server | Runs local tooling and, if the app uses a proxy, the small Express service. |
| [Express](https://expressjs.com/) | Optional stateless API proxy | Can forward AI requests without accounts or data storage; request bodies, keys, and prompts must not be written to logs or persistent storage. |
| [Git](https://git-scm.com/) and [GitHub](https://github.com/) | Version control and public portfolio hosting | Track source changes and publish the project repository. |

### Architecture choice for a stateless demo

The earlier MERN direction needs one deliberate adjustment: **MongoDB is not part of this version**. A database would conflict with the requirement that no user changes are stored. The implemented product is therefore a React application with optional Node.js and Express support, but it is not a full MERN application while MongoDB is excluded.

The client owns the temporary workspace in memory and restores a bundled sample dataset when the demo starts. If an Express proxy is used for AI calls, it handles each request transiently and discards it after returning the provider response. It does not create accounts, save prompts, store API keys, or persist notes. The AI provider receives a request only when the visitor triggers an AI action. The project should make that external data flow clear in the interface.

This is a conscious trade-off for a resume-focused hobby project: the demo can showcase React, graph interaction, editing, analytics, animation, and AI integration without building account management or a permanent data service. The API provider may have its own usage limits and data policies; TESSERA does not control those provider-side terms.

## Guiding principles

- **No account barrier:** Visitors can use the sample demo immediately.
- **Session-only changes:** User edits and API keys live in memory and disappear when the tab is refreshed or closed.
- **Researcher in control:** AI proposes structure; users review and choose what to accept.
- **Traceable ideas:** Concepts and claims show their source and whether they were AI-suggested or user-written during the current session.
- **Readable notes:** Markdown remains a first-class format behind the graph.
- **Meaningful links:** Typed relationships explain why concepts are connected.
- **Honest analytics:** Graph measures describe connections, not financial truth or expected returns.
- **Motion-rich and reactive:** Animate generously across the landing page and workspace in response to scrolling, selections, graph changes, and navigation, while keeping interactions clear and respecting reduced-motion preferences.

## Project summary

**TESSERA** is a no-account, session-only AI research mapping demo for quantitative finance. It transforms conversations into reviewable concepts and typed relationships, presents them in an Obsidian-like graph, and connects every idea to an editable Markdown note. A modern SaaS-style landing page demonstrates the workflow through scripted zooms, clicks, screen transitions, animated cards, charts, a carousel, and a creator's note signed by Parth. The interactive workspace runs on sample data without a key, with optional live AI actions powered by a visitor-supplied API key. Nothing created in a demo session is saved by the application.
