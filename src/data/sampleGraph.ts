import { NoteNode, NoteEdge } from '../types';

export const initialVaultNodes: NoteNode[] = [
  // Folder: Artificial Intelligence
  {
    id: 'artificial_general_intelligence',
    label: 'Artificial General Intelligence',
    folder: 'Artificial Intelligence',
    color: '#818cf8', // Indigo
    tags: ['ai', 'frontier', 'computation'],
    content: `# Artificial General Intelligence

Artificial General Intelligence (AGI) represents the hypothetical ability of an intelligent agent to understand, learn, and perform any intellectual task that a human being can accomplish.

## Key Influences & Foundations
- Relies heavily on breakthroughs in [[Deep Learning]] and [[Neural Networks]]
- Architectural inspiration often drawn from [[Cognitive Architecture]]
- Central question of machine awareness intersects with [[Consciousness]] and [[Philosophy of Mind]]

## Open Questions
- Is scaling [[Large Language Models]] sufficient to achieve general reasoning?
- How does [[Predictive Processing]] relate to autonomous goal-directed behavior?

#agi #intelligence #cognitive-computing`,
  },
  {
    id: 'neural_networks',
    label: 'Neural Networks',
    folder: 'Artificial Intelligence',
    color: '#818cf8',
    tags: ['ai', 'deep-learning', 'math'],
    content: `# Neural Networks

Computational systems inspired by the biological neural networks that constitute animal brains.

## Principles
A neural network consists of interconnected units or nodes called artificial neurons. Connections between nodes can transmit signals and adapt through weight adjustment during learning.

## Related Concepts
- Foundational pillar of [[Deep Learning]]
- Modern models utilize the [[Attention Mechanism]]
- Theoretical mapping to biological [[Neuroplasticity]]
- Modeled computationally through [[Information Theory]]

#neural-nets #machine-learning`,
  },
  {
    id: 'deep_learning',
    label: 'Deep Learning',
    folder: 'Artificial Intelligence',
    color: '#818cf8',
    tags: ['ai', 'representations'],
    content: `# Deep Learning

A subset of machine learning based on multi-layered artificial neural networks with representation learning.

## Significance
Deep learning enables machines to solve complex problems even when using a dataset that is very diverse, unstructured and inter-connected.

## Core Pillars
- Stacks layers of [[Neural Networks]]
- Powers contemporary [[Large Language Models]]
- Exhibits [[Emergence]] as parameter counts and dataset scales increase

#deep-learning #representations`,
  },
  {
    id: 'attention_mechanism',
    label: 'Attention Mechanism',
    folder: 'Artificial Intelligence',
    color: '#818cf8',
    tags: ['ai', 'transformers', 'nlp'],
    content: `# Attention Mechanism

An algorithmic technique that mimics cognitive attention, enhancing the important parts of the input data while fading out the rest.

## Impact
Introduced decisively in "Attention Is All You Need" (Vaswani et al.), replacing recurrence with self-attention.

## Connections
- Core engine of [[Large Language Models]]
- Analogous to human selective focus studied in [[Cognitive Architecture]]
- Interacts closely with [[Working Memory]] models

#attention #transformers`,
  },
  {
    id: 'large_language_models',
    label: 'Large Language Models',
    folder: 'Artificial Intelligence',
    color: '#818cf8',
    tags: ['ai', 'llm', 'nlp'],
    content: `# Large Language Models

High-capacity transformer neural models trained on broad internet-scale text datasets to predict next tokens and perform diverse semantic reasoning.

## Characteristics
- Built upon the [[Attention Mechanism]] and [[Deep Learning]]
- Displays unexpected generalized task performance and in-context learning
- Raises deep debates within [[Epistemology]] regarding semantics versus syntax

#llm #transformers #ai`,
  },
  {
    id: 'reinforcement_learning',
    label: 'Reinforcement Learning',
    folder: 'Artificial Intelligence',
    color: '#818cf8',
    tags: ['ai', 'rl', 'decision-theory'],
    content: `# Reinforcement Learning

Area of machine learning concerned with how intelligent agents ought to take actions in an environment to maximize the cumulative reward.

## Connections
- Formalized through Markov Decision Processes in [[Information Theory]]
- Bridges agent interaction in [[Complex Adaptive Systems]]
- Inspired by operant conditioning in [[Cognitive Science]]

#reinforcement-learning #agents`,
  },

  // Folder: Cognitive Science
  {
    id: 'cognitive_architecture',
    label: 'Cognitive Architecture',
    folder: 'Cognitive Science',
    color: '#34d399', // Mint/Emerald
    tags: ['cognition', 'psychology'],
    content: `# Cognitive Architecture

A blueprint for intelligent agents, proposing computational processes that act like biological cognitive systems (e.g., ACT-R, SOAR).

## Key Components
- Integrates perception, reasoning, and [[Working Memory]]
- Compares structural organization with [[Artificial General Intelligence]]
- Analyzed through the lens of [[Predictive Processing]]

#cognitive-science #memory`,
  },
  {
    id: 'working_memory',
    label: 'Working Memory',
    folder: 'Cognitive Science',
    color: '#34d399',
    tags: ['cognition', 'memory'],
    content: `# Working Memory

A cognitive system with a limited capacity that can hold information temporarily for processing and manipulation.

## Relevance
- Functionally comparable to context windows in [[Large Language Models]]
- Serves as the active workspace in [[Cognitive Architecture]]
- Constrained by channel capacities described in [[Information Theory]]

#memory #cognition`,
  },
  {
    id: 'predictive_processing',
    label: 'Predictive Processing',
    folder: 'Cognitive Science',
    color: '#34d399',
    tags: ['cognition', 'perception', 'neuroscience'],
    content: `# Predictive Processing

The theory that the brain is essentially a hierarchical prediction engine that constantly generates hypotheses about sensory input and updates them via prediction errors.

## Connections
- Closely tied to Bayesian models in [[Philosophy of Mind]]
- Parallels next-token prediction in [[Large Language Models]]
- Formulates how agents navigate [[Complex Adaptive Systems]]

#predictive-coding #perception`,
  },
  {
    id: 'neuroplasticity',
    label: 'Neuroplasticity',
    folder: 'Cognitive Science',
    color: '#34d399',
    tags: ['neuroscience', 'biology'],
    content: `# Neuroplasticity

The ability of neural networks in the brain to change through growth and reorganization.

## Dynamics
- Biological counterpart to weight optimization in [[Neural Networks]]
- Explains adaptation in dynamic environments studied in [[Cybernetics]]

#neuroscience #adaptation`,
  },

  // Folder: Philosophy of Mind
  {
    id: 'consciousness',
    label: 'Consciousness',
    folder: 'Philosophy of Mind',
    color: '#f472b6', // Pink/Coral
    tags: ['philosophy', 'mind', 'hard-problem'],
    content: `# Consciousness

The state or quality of awareness, or of being aware of an external object or something within oneself.

## The Hard Problem
David Chalmers' distinction between cognitive functions (easy problems) and subjective experience ([[Qualia]]).

## Intersections
- Core debate in [[Artificial General Intelligence]]
- Analyzed through physicalist and dualist views in [[Philosophy of Mind]]
- Often posited as an emergent property in [[Emergence]]

#consciousness #hard-problem`,
  },
  {
    id: 'philosophy_of_mind',
    label: 'Philosophy of Mind',
    folder: 'Philosophy of Mind',
    color: '#f472b6',
    tags: ['philosophy', 'ontology'],
    content: `# Philosophy of Mind

A branch of philosophy that studies the ontology, nature, and relationship of the mind and mental states to the physical body.

## Core Debates
- Functionalism vs. Identity Theory
- Computability of subjective thoughts ([[Consciousness]])
- Epistemic grounding explored in [[Epistemology]]

#philosophy #mind`,
  },
  {
    id: 'qualia',
    label: 'Qualia',
    folder: 'Philosophy of Mind',
    color: '#f472b6',
    tags: ['philosophy', 'experience'],
    content: `# Qualia

Individual instances of subjective, conscious experience (the redness of red, the taste of wine).

## Relevance
- Central point of contention regarding whether [[Large Language Models]] possess internal experience
- Distinguishes behavioral simulation from true [[Consciousness]]

#qualia #experience`,
  },
  {
    id: 'epistemology',
    label: 'Epistemology',
    folder: 'Philosophy of Mind',
    color: '#f472b6',
    tags: ['philosophy', 'knowledge'],
    content: `# Epistemology

The branch of philosophy concerned with knowledge, belief justification, and the rationality of cognition.

## Connections
- How do synthetic agents acquire genuine knowledge vs statistical mimicry in [[Artificial General Intelligence]]?
- Mathematical foundations linked to [[Information Theory]]

#epistemology #knowledge`,
  },
  {
    id: 'emergence',
    label: 'Emergence',
    folder: 'Philosophy of Mind',
    color: '#f472b6',
    tags: ['complexity', 'systems'],
    content: `# Emergence

A process whereby larger entities, patterns, and regularities arise through interactions among smaller or simpler entities that themselves do not exhibit such properties.

## Occurrences
- Macroscopic patterns arising in [[Complex Adaptive Systems]]
- Consciousness emerging from simple substrate interactions in [[Neural Networks]]
- Unexpected abilities developing in [[Deep Learning]]

#emergence #complexity`,
  },

  // Folder: Systems Theory
  {
    id: 'complex_adaptive_systems',
    label: 'Complex Adaptive Systems',
    folder: 'Systems Theory',
    color: '#38bdf8', // Sky Blue
    tags: ['systems', 'networks'],
    content: `# Complex Adaptive Systems

Special cases of complex systems that are diverse and made up of multiple interconnected elements capable of learning from experience.

## Hallmarks
- Exhibited strongly in [[Emergence]]
- Analyzed through feedback loops in [[Cybernetics]]
- Characterized mathematically using [[Network Topology]]

#systems #complexity`,
  },
  {
    id: 'cybernetics',
    label: 'Cybernetics',
    folder: 'Systems Theory',
    color: '#38bdf8',
    tags: ['systems', 'control', 'feedback'],
    content: `# Cybernetics

The science of communications and automatic control systems in both machines and living things, founded by Norbert Wiener.

## Central Tenets
- Circular causal chains and feedback regulation
- Foundational to early [[Artificial General Intelligence]]
- Deeply tied to message entropy in [[Information Theory]]

#cybernetics #feedback`,
  },
  {
    id: 'information_theory',
    label: 'Information Theory',
    folder: 'Systems Theory',
    color: '#38bdf8',
    tags: ['math', 'information'],
    content: `# Information Theory

The scientific study of the quantification, storage, and communication of digital information, formulated by Claude Shannon.

## Applications
- Entropy and cross-entropy loss functions in [[Deep Learning]]
- Limits of communication channels in [[Working Memory]]
- Mathematical language of [[Cybernetics]]

#information #shannon`,
  },
  {
    id: 'network_topology',
    label: 'Network Topology',
    folder: 'Systems Theory',
    color: '#38bdf8',
    tags: ['graph-theory', 'topology'],
    content: `# Network Topology

The arrangement of the elements (links, nodes) of a communication network or knowledge graph.

## Structural Measures
- Small-world networks and scale-free hubs in [[Complex Adaptive Systems]]
- Graph connectivity mimicking connectivity in [[Neural Networks]]

#graph-theory #networks`,
  },
];

export const initialVaultEdges: NoteEdge[] = [
  // AI Connections
  { id: 'e1', source: 'artificial_general_intelligence', target: 'deep_learning' },
  { id: 'e2', source: 'artificial_general_intelligence', target: 'neural_networks' },
  { id: 'e3', source: 'artificial_general_intelligence', target: 'cognitive_architecture' },
  { id: 'e4', source: 'artificial_general_intelligence', target: 'consciousness' },
  { id: 'e5', source: 'deep_learning', target: 'neural_networks' },
  { id: 'e6', source: 'deep_learning', target: 'large_language_models' },
  { id: 'e7', source: 'attention_mechanism', target: 'large_language_models' },
  { id: 'e8', source: 'attention_mechanism', target: 'neural_networks' },
  { id: 'e9', source: 'reinforcement_learning', target: 'artificial_general_intelligence' },
  { id: 'e10', source: 'reinforcement_learning', target: 'complex_adaptive_systems' },

  // Cognitive Science Connections
  { id: 'e11', source: 'cognitive_architecture', target: 'working_memory' },
  { id: 'e12', source: 'cognitive_architecture', target: 'predictive_processing' },
  { id: 'e13', source: 'working_memory', target: 'attention_mechanism' },
  { id: 'e14', source: 'predictive_processing', target: 'large_language_models' },
  { id: 'e15', source: 'neuroplasticity', target: 'neural_networks' },

  // Philosophy Connections
  { id: 'e16', source: 'consciousness', target: 'philosophy_of_mind' },
  { id: 'e17', source: 'consciousness', target: 'qualia' },
  { id: 'e18', source: 'consciousness', target: 'emergence' },
  { id: 'e19', source: 'philosophy_of_mind', target: 'epistemology' },
  { id: 'e20', source: 'large_language_models', target: 'epistemology' },
  { id: 'e21', source: 'qualia', target: 'large_language_models' },
  { id: 'e22', source: 'emergence', target: 'complex_adaptive_systems' },
  { id: 'e23', source: 'emergence', target: 'neural_networks' },

  // Systems Connections
  { id: 'e24', source: 'complex_adaptive_systems', target: 'cybernetics' },
  { id: 'e25', source: 'complex_adaptive_systems', target: 'network_topology' },
  { id: 'e26', source: 'cybernetics', target: 'information_theory' },
  { id: 'e27', source: 'information_theory', target: 'neural_networks' },
  { id: 'e28', source: 'network_topology', target: 'neural_networks' },
];
