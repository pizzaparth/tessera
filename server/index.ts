import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    plugin: 'ai-vault-assistant',
    availableKeys: {
      anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      gemini: Boolean(process.env.GEMINI_API_KEY),
      deepseek: Boolean(process.env.DEEPSEEK_API_KEY),
      custom: Boolean(process.env.CUSTOM_AI_API_KEY),
    },
    defaultModel: process.env.DEFAULT_AI_MODEL || 'claude-sonnet-5-5',
    timestamp: new Date().toISOString(),
  });
});

const AI_VAULT_SYSTEM_PROMPT = `You are an AI knowledge partner integrated directly into an interconnected Markdown knowledge vault.
The user is exploring their knowledge base of linked notes, concepts, and relationships.

Your role:
1. Respond thoughtfully and concisely to the user's question, brainstorming, or synthesis request.
2. Actively EXPAND the knowledge graph by identifying 1-4 new meaningful concepts/notes that directly build upon the discussion.
3. Determine how these new concepts link to each other and to existing nodes in the vault.

You must end your response with a JSON block in this exact format:
\`\`\`graph_expansion
{
  "newNodes": [
    {
      "id": "snake_case_unique_id",
      "label": "Human Readable Title",
      "folder": "Folder Name (e.g. Artificial Intelligence, Cognitive Science, Philosophy of Mind, Systems Theory, etc.)",
      "color": "#818cf8",
      "content": "# Title\\n\\nSummary of concept with [[Existing Note]] wikilinks..."
    }
  ],
  "newEdges": [
    {
      "source": "new_or_existing_node_id",
      "target": "new_or_existing_node_id"
    }
  ]
}
\`\`\``;

// Helper: Intelligent deterministic fallback when no API key is configured
function generateFallbackExpansion(prompt: string, activeNode: any, existingNodes: any[], modelName = 'Claude Sonnet 5.5') {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('transformer') || lower.includes('attention') || lower.includes('language') || lower.includes('llm')) {
    return {
      text: `The **Transformer Architecture** fundamentally restructured how computational attention operates across discrete token sequences. By replacing recurrent sequential bottlenecks with multi-head self-attention, transformers enable representations to be learned in parallel.\n\nIn relation to your vault:\n- Bridges directly into [[Attention Mechanism]]\n- Serves as the substrate for modern [[Large Language Models]]\n- Parallels associative retrieval in [[Working Memory]]\n\nI have generated 3 new connected notes and added them directly into your knowledge graph.`,
      newNodes: [
        {
          id: 'transformer_architecture',
          label: 'Transformer Architecture',
          folder: 'Artificial Intelligence',
          color: '#818cf8',
          content: `# Transformer Architecture\n\nDeep learning architecture introduced by Vaswani et al. based entirely on self-attention mechanisms without recurrent or convolutional layers.\n\n## Core Components\n- Multi-Head [[Attention Mechanism]]\n- Positional Encodings\n- Feeds directly into [[Large Language Models]]\n\n#transformers #deep-learning`,
        },
        {
          id: 'multi_head_attention',
          label: 'Multi-Head Attention',
          folder: 'Artificial Intelligence',
          color: '#818cf8',
          content: `# Multi-Head Attention\n\nMechanism that linearly projects queries, keys, and values $h$ times with different learned projections to attend to information from different representation subspaces.\n\n## Links\n- Sub-component of [[Transformer Architecture]]\n- Direct extension of [[Attention Mechanism]]`,
        },
        {
          id: 'associative_memory',
          label: 'Associative Memory',
          folder: 'Cognitive Science',
          color: '#34d399',
          content: `# Associative Memory\n\nThe ability to learn and remember the relationship between unrelated items (e.g. names and faces).\n\n## Computational Counterparts\n- Paralleled by key-value retrieval in [[Transformer Architecture]]\n- Integral component of [[Working Memory]]`,
        },
      ],
      newEdges: [
        { source: 'transformer_architecture', target: 'attention_mechanism' },
        { source: 'transformer_architecture', target: 'large_language_models' },
        { source: 'multi_head_attention', target: 'transformer_architecture' },
        { source: 'associative_memory', target: 'working_memory' },
        { source: 'transformer_architecture', target: 'associative_memory' },
      ],
    };
  }

  if (lower.includes('mind') || lower.includes('conscious') || lower.includes('experience') || lower.includes('qualia') || lower.includes('philosophy')) {
    return {
      text: `When exploring **Consciousness** and the **Philosophy of Mind**, two major contemporary paradigms stand out: **Integrated Information Theory (IIT)** and **Global Workspace Theory (GWT)**. These frameworks propose mathematical and cognitive explanations for how unified subjective experience arises.\n\nI've integrated these frameworks into your vault and wired them into [[Emergence]] and [[Information Theory]].`,
      newNodes: [
        {
          id: 'integrated_information_theory',
          label: 'Integrated Information Theory (IIT)',
          folder: 'Philosophy of Mind',
          color: '#f472b6',
          content: `# Integrated Information Theory (IIT)\n\nProposed by Giulio Tononi, IIT posits that consciousness is a fundamental property of any physical system that has a high degree of integrated information ($\Phi$).\n\n## Core Connections\n- Directly addresses the hard problem of [[Consciousness]]\n- Grounded in the mathematical formalism of [[Information Theory]]\n- Explains macro-level [[Emergence]] from micro-state interactions`,
        },
        {
          id: 'global_workspace_theory',
          label: 'Global Workspace Theory (GWT)',
          folder: 'Cognitive Science',
          color: '#34d399',
          content: `# Global Workspace Theory (GWT)\n\nA cognitive architecture theory modeling consciousness as an informational theater where content is broadcast globally across brain networks.\n\n## Connections\n- Forms a bridge between [[Cognitive Architecture]] and [[Consciousness]]\n- Mirrors broadcast routing in [[Complex Adaptive Systems]]`,
        },
      ],
      newEdges: [
        { source: 'integrated_information_theory', target: 'consciousness' },
        { source: 'integrated_information_theory', target: 'information_theory' },
        { source: 'global_workspace_theory', target: 'cognitive_architecture' },
        { source: 'global_workspace_theory', target: 'consciousness' },
        { source: 'integrated_information_theory', target: 'emergence' },
      ],
    };
  }

  // Generic dynamic expansion based on active node or user prompt
  const topicTitle = activeNode ? activeNode.label : prompt.slice(0, 24).trim();
  const slug = topicTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  return {
    text: `Based on your exploration of **${topicTitle}**, I analyzed the relational topology across your vault.\n\nI've synthesized these conceptual bridges and dynamically added new nodes and links into your knowledge graph.`,
    newNodes: [
      {
        id: `${slug}_dynamics`,
        label: `${topicTitle} Dynamics`,
        folder: activeNode ? activeNode.folder : 'Systems Theory',
        color: '#818cf8',
        content: `# ${topicTitle} Dynamics\n\nExploration of systemic patterns and relational interactions related to [[${topicTitle}]].\n\n## Vault Connections\n- Linked to [[${activeNode ? activeNode.label : 'Complex Adaptive Systems'}]]\n- Generates feedback loops examined in [[Cybernetics]]`,
      },
      {
        id: `${slug}_substrate`,
        label: `Substrate Independence`,
        folder: 'Philosophy of Mind',
        color: '#f472b6',
        content: `# Substrate Independence\n\nThe philosophical thesis that mental states and cognitive processes can be realized in multiple physical materials, not just biological brains.\n\n## Connections\n- Foundation for [[Artificial General Intelligence]]\n- Central claim in [[Philosophy of Mind]]`,
      },
    ],
    newEdges: [
      { source: `${slug}_dynamics`, target: activeNode ? activeNode.id : 'complex_adaptive_systems' },
      { source: `${slug}_substrate`, target: 'artificial_general_intelligence' },
      { source: `${slug}_substrate`, target: 'philosophy_of_mind' },
      ...(activeNode ? [{ source: `${slug}_dynamics`, target: `${slug}_substrate` }] : []),
    ],
  };
}

// Universal AI chat endpoint supporting any AI model (Anthropic, OpenAI, Gemini, DeepSeek, or custom endpoint)
app.post('/api/chat', async (req: Request, res: Response) => {
  const {
    messages,
    activeNode,
    existingNodes = [],
    model = 'claude-sonnet-5-5',
    provider = 'anthropic',
  } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const latestUserMessage = messages[messages.length - 1]?.content || '';

  // Determine provider API Key from client or server environment
  let apiKey: string | undefined;
  let selectedProvider = provider;

  if (model.startsWith('claude')) {
    selectedProvider = 'anthropic';
    apiKey = apiKey || process.env.ANTHROPIC_API_KEY;
  } else if (model.startsWith('gpt') || model.startsWith('o1') || model.startsWith('o3')) {
    selectedProvider = 'openai';
    apiKey = apiKey || process.env.OPENAI_API_KEY;
  } else if (model.startsWith('gemini')) {
    selectedProvider = 'gemini';
    apiKey = apiKey || process.env.GEMINI_API_KEY;
  } else if (model.startsWith('deepseek')) {
    selectedProvider = 'deepseek';
    apiKey = apiKey || process.env.DEEPSEEK_API_KEY;
  } else {
    selectedProvider = 'custom';
    apiKey = apiKey || process.env.CUSTOM_AI_API_KEY;
  }

  // If no API key is configured, provide zero-friction fallback with graph expansion
  if (!apiKey) {
    const fallback = generateFallbackExpansion(latestUserMessage, activeNode, existingNodes, model);
    return res.json({
      role: 'assistant',
      content: fallback.text,
      expandedNodes: fallback.newNodes,
      newEdges: fallback.newEdges,
      model,
      provider: selectedProvider,
      isSimulated: true,
    });
  }

  try {
    const existingNodeContext = existingNodes.slice(0, 35).map((n: any) => `- ${n.label} (id: ${n.id}, folder: ${n.folder})`).join('\n');
    const activeContext = activeNode ? `Currently focused note: "${activeNode.label}" (id: ${activeNode.id})` : 'No note currently selected.';
    const systemPromptWithContext = `${AI_VAULT_SYSTEM_PROMPT}\n\nExisting Vault Notes:\n${existingNodeContext}\n\n${activeContext}`;

    let fullText = '';

    if (selectedProvider === 'anthropic') {
      const anthropicMessages = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

      const anthropicModelId = typeof model === 'string' && model.startsWith('claude-')
        ? model
        : 'claude-sonnet-5-5';

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: anthropicModelId,
          max_tokens: 1800,
          system: systemPromptWithContext,
          messages: anthropicMessages,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: `Anthropic API error: ${response.status}`, details: errText });
      }

      const data = await response.json();
      fullText = data.content?.[0]?.text || '';
    } else if (selectedProvider === 'openai' || selectedProvider === 'deepseek' || selectedProvider === 'custom') {
      const baseUrl = selectedProvider === 'deepseek'
        ? 'https://api.deepseek.com/v1/chat/completions'
        : process.env.CUSTOM_AI_BASE_URL || 'https://api.openai.com/v1/chat/completions';

      const openAiMessages = [
        { role: 'system', content: systemPromptWithContext },
        ...messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      ];

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || 'gpt-4o',
          messages: openAiMessages,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: `${selectedProvider} API error: ${response.status}`, details: errText });
      }

      const data = await response.json();
      fullText = data.choices?.[0]?.message?.content || '';
    } else if (selectedProvider === 'gemini') {
      const geminiModel = model.includes('pro') ? 'gemini-1.5-pro' : 'gemini-2.0-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPromptWithContext }] },
          contents: contents,
          generationConfig: { temperature: 0.3 },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: `Gemini API error: ${response.status}`, details: errText });
      }

      const data = await response.json();
      fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    // Extract graph_expansion JSON block if present
    let cleanText = fullText;
    let newNodes: any[] = [];
    let newEdges: any[] = [];

    const jsonMatch = fullText.match(/```(?:graph_expansion|json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        newNodes = parsed.newNodes || [];
        newEdges = parsed.newEdges || [];
        cleanText = fullText.replace(jsonMatch[0], '').trim();
      } catch {
        // preserve text if JSON parse fails
      }
    }

    return res.json({
      role: 'assistant',
      content: cleanText,
      expandedNodes: newNodes,
      newEdges: newEdges,
      model,
      provider: selectedProvider,
      isSimulated: false,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Failed to communicate with AI model',
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Universal AI Knowledge Vault backend running on http://localhost:${PORT}`);
});
