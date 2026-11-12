import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GitBranch,
  FileText,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CarouselSlide {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  icon: any;
  previewType: 'mapper' | 'graph' | 'note' | 'insights' | 'sample';
}

const SLIDES: CarouselSlide[] = [
  {
    id: 'conversation_mapper',
    tag: 'Product Screen 1',
    tagColor: '#6366f1',
    title: 'AI Conversation Mapper',
    subtitle: 'From unstructured dialogue to reviewable concepts',
    description:
      'Paste any discussion or select a built-in sample transcript. AI suggests key concepts, concise definitions, source passages, and proposed typed links.',
    highlights: [
      'Stateless concept extraction via OpenAI, Anthropic, or Gemini',
      'Human-in-the-loop review queue to edit, approve, or reject proposals',
      'Immediate in-memory update to the active knowledge graph',
    ],
    icon: Sparkles,
    previewType: 'mapper',
  },
  {
    id: 'knowledge_graph',
    tag: 'Product Screen 2',
    tagColor: '#059669',
    title: 'Interactive Knowledge Graph',
    subtitle: 'Obsidian-like fluid exploration canvas',
    description:
      'Navigate ideas on a responsive Cytoscape.js canvas with force-directed physics, neighborhood isolation, and shortest-path trace between distant concepts.',
    highlights: [
      '5 physics layouts including Force-Directed (Cose) and Concentric Rings',
      'Local graph view isolating a selected node and its direct 1-hop neighbors',
      'Directional typed edge semantics: depends on, extends, supports, contradicts',
    ],
    icon: GitBranch,
    previewType: 'graph',
  },
  {
    id: 'markdown_notes',
    tag: 'Product Screen 3',
    tagColor: '#7c3aed',
    title: 'Concept Markdown Notes',
    subtitle: 'Human-readable documentation behind each node',
    description:
      'Every concept in your graph has an attached Markdown note with explanations, source passages, and live preview. Edits made during your session reflect immediately.',
    highlights: [
      'Full Markdown formatting with live side-by-side or focused view',
      'Direct navigation to connected concepts referenced in the note',
      'Session-only updates that keep your research organized without a database',
    ],
    icon: FileText,
    previewType: 'note',
  },
  {
    id: 'graph_insights',
    tag: 'Product Screen 4',
    tagColor: '#d97706',
    title: 'Graph Insights & Measures',
    subtitle: 'Descriptive structural metrics with a subtle quant touch',
    description:
      'Inspect structural information about your current map: cluster volume, highly connected hubs, cross-domain bridges, and connection paths between selected ideas.',
    highlights: [
      'Degree centrality rankings and cluster distribution bar charts',
      'Bridge concepts connecting disparate research domains',
      'Honest topology measures without claiming to validate investment returns',
    ],
    icon: Activity,
    previewType: 'insights',
  },
  {
    id: 'sample_quant_map',
    tag: 'Example Map',
    tagColor: '#0284c7',
    title: 'Quantitative Finance Map',
    subtitle: 'Pre-loaded multi-disciplinary research sample',
    description:
      'Explore how factor research, market microstructure, portfolio construction, and risk management connect across peer-reviewed frameworks.',
    highlights: [
      '15+ peer-reviewed quantitative concepts ready to explore out-of-the-box',
      'Includes Fama-French, Momentum, Kyle’s Lambda, and Black-Litterman',
      'Zero setup, no login required, runs immediately in active memory',
    ],
    icon: Layers,
    previewType: 'sample',
  },
];

export const QuantCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Keyboard navigation support: Left / Right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        scrollNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrev, scrollNext]);

  return (
    <div className="w-full relative space-y-4">
      {/* Embla Viewport */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {SLIDES.map((slide) => {
            const Icon = slide.icon;
            return (
              <div
                key={slide.id}
                className="flex-[0_0_100%] min-w-0 px-2 sm:px-4"
              >
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row gap-6 sm:gap-8 items-center justify-between">
                  {/* Left Info Column */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${slide.tagColor}15`,
                          borderColor: `${slide.tagColor}40`,
                          color: slide.tagColor,
                        }}
                      >
                        {slide.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {slide.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-indigo-600 mt-0.5">
                        {slide.subtitle}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {slide.description}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {slide.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: slide.tagColor }}
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Link
                        to="/app"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition group"
                      >
                        <span>Try this screen in demo workspace</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Mock Preview Column */}
                  <div className="w-full md:w-80 lg:w-96 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200/80 shadow-subtle flex flex-col items-center justify-center text-center space-y-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${slide.tagColor}18`, color: slide.tagColor }}
                    >
                      <Icon className="w-7 h-7 stroke-[1.8]" />
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-900">{slide.title}</div>
                      <div className="text-xs text-slate-500">Live preview in active memory</div>
                    </div>

                    <div className="w-full p-3 rounded-xl bg-white border border-slate-200/70 text-left text-[11px] text-slate-600 space-y-1 shadow-2xs">
                      <div className="font-semibold text-slate-800 flex items-center justify-between">
                        <span>Demo Status</span>
                        <span className="text-emerald-600 font-bold">Ready</span>
                      </div>
                      <p className="text-slate-500 line-clamp-2">
                        Instant exploration without accounts or setup barriers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons and Indicators */}
      <div className="flex items-center justify-between pt-2 px-2">
        {/* Controls Hint */}
        <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
          Use buttons, drag, or keyboard ← → arrow keys
        </div>

        {/* Dots */}
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`h-2 rounded-full transition-all ${
                selectedIndex === idx ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition shadow-2xs"
            title="Previous slide (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition shadow-2xs"
            title="Next slide (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
