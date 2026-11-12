import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    mode: 'stateless-proxy',
    persistedData: false,
    timestamp: new Date().toISOString(),
  });
});

const SYSTEM_PROMPT = `You are TESSERA's quantitative research concept extractor.
Analyze the provided text excerpt from a quantitative research paper, discussion, or strategy memo.
Extract concepts, claims, open questions, assumptions, and typed relationships.

Output strict JSON with this schema:
{
  "summary": "Concise summary of the excerpt",
  "claims": ["List of core claims or hypotheses made"],
  "openQuestions": ["Unresolved questions or research gaps"],
  "assumptions": ["Key underlying assumptions"],
  "concepts": [
    {
      "id": "snake_case_unique_id",
      "label": "Human readable title",
      "type": "method" | "model" | "dataset" | "instrument" | "metric" | "hypothesis" | "source" | "research_question",
      "domain": "Factor Research" | "Market Microstructure" | "Portfolio Construction" | "Time Series & Econometrics" | "Risk Management" | "Execution & Trading",
      "summary": "1-2 sentence description",
      "confidence": 0.95,
      "excerpt": "Verbatim supporting quote from the text",
      "suggestedEdges": [
        {
          "targetId": "existing_or_extracted_node_id",
          "type": "depends_on" | "extends" | "measures" | "uses_data_from" | "supports" | "challenges" | "contradicts" | "related_to",
          "label": "depends on"
        }
      ]
    }
  ]
}`;

// AI extraction proxy endpoint
app.post('/api/extract', async (req: Request, res: Response) => {
  const { text, provider, apiKey, existingNodeIds = [] } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text input is required' });
  }

  if (!apiKey) {
    return res.status(400).json({
      error: 'API key is required for live AI extraction. Please provide an API key in the API key panel, or use the built-in sample conversations in guided demo mode.',
    });
  }

  const selectedProvider = provider || 'openai';

  try {
    const userPrompt = `Existing knowledge graph node IDs you can link to: [${existingNodeIds.slice(0, 25).join(', ')}]\n\nAnalyze this research text:\n"""\n${text}\n"""`;

    let rawJsonString = '';

    if (selectedProvider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: `OpenAI API returned error: ${response.status}`,
          details: errorText,
        });
      }

      const data = await response.json();
      rawJsonString = data.choices[0]?.message?.content || '{}';
    } else if (selectedProvider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: `Anthropic API returned error: ${response.status}`,
          details: errorText,
        });
      }

      const data = await response.json();
      rawJsonString = data.content?.[0]?.text || '{}';
    } else if (selectedProvider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: { response_mime_type: 'application/json' },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: `Gemini API returned error: ${response.status}`,
          details: errorText,
        });
      }

      const data = await response.json();
      rawJsonString = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    } else {
      return res.status(400).json({ error: `Unsupported provider: ${selectedProvider}` });
    }

    // Parse result cleanly
    let parsed;
    try {
      parsed = JSON.parse(rawJsonString);
    } catch {
      const jsonMatch = rawJsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI JSON response');
      }
    }

    // Add status: 'pending' to concepts
    if (parsed.concepts && Array.isArray(parsed.concepts)) {
      parsed.concepts = parsed.concepts.map((c: any) => ({
        ...c,
        status: 'pending',
      }));
    }

    return res.json(parsed);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Failed to process AI extraction',
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`TESSERA stateless API proxy running on http://localhost:${PORT}`);
});
