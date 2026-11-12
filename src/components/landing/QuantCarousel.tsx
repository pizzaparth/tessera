import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CarouselSlide {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  summary: string;
  bullets: string[];
  equation?: string;
  citation: string;
}

const SLIDES: CarouselSlide[] = [
  {
    id: 'factor_momentum',
    tag: 'Factor Research',
    tagColor: '#38bdf8',
    title: 'Cross-Sectional Factor Momentum vs Short-Term Reversal',
    summary:
      'Disentangling 12-2 momentum trend persistence from 1-month microstructure bounce, controlling for survivorship bias and execution friction.',
    bullets: [
      'Lagged formation window (12-2) bypasses dealer inventory mean reversion',
      'Point-in-time delisting return modeling prevents lookahead distortion',
      'Volatility targeting overlay reduces momentum crash drawdown depth',
    ],
    equation: '\\text{Signal}_{i,t} = \\prod_{k=2}^{12} (1 + R_{i,t-k}) - 1',
    citation: 'Jegadeesh & Titman (1993) • Carhart (1997)',
  },
  {
    id: 'market_microstructure',
    tag: 'Market Microstructure',
    tagColor: '#00f5a0',
    title: 'High-Frequency Order Flow & Optimal Execution Trajectories',
    summary:
      'Balancing Kyle’s lambda price impact against timing risk using Almgren-Chriss closed-form trajectories and limit order book imbalance signals.',
    bullets: [
      'Order Flow Imbalance (OFI) forecasts near-term quote midpoint drift',
      'Non-linear adverse selection penalizes aggressive market orders',
      'Dynamic TWAP/VWAP scheduling conditions on transient depth',
    ],
    equation: '\\Delta P_t = \\lambda Q_t + \\eta_t, \\quad U(x) = E[x] + \\lambda_{\\text{risk}} V[x]',
    citation: 'Kyle (1985) • Almgren & Chriss (2000) • Cont et al. (2014)',
  },
  {
    id: 'portfolio_construction',
    tag: 'Portfolio Construction',
    tagColor: '#818cf8',
    title: 'Bayesian Black-Litterman Portfolio Optimization',
    summary:
      'Overcoming classical Markowitz error-maximization by blending market capitalization equilibrium priors with tactical alpha forecasts.',
    bullets: [
      'Reverse optimization isolates implied equilibrium returns (\\Pi = \\lambda \\Sigma w)',
      'Confidence matrix \\Omega scales uncertainty per subjective view',
      'Generates stable, intuitive asset weightings without extreme corner solutions',
    ],
    equation: 'E[R] = [(\\tau \\Sigma)^{-1} + P^T \\Omega^{-1} P]^{-1} [(\\tau \\Sigma)^{-1} \\Pi + P^T \\Omega^{-1} Q]',
    citation: 'Black & Litterman (1992) • Markowitz (1952)',
  },
  {
    id: 'risk_management',
    tag: 'Risk Management',
    tagColor: '#fbbf24',
    title: 'Dynamic Volatility Targeting & GARCH(1,1) Regimes',
    summary:
      'Exploiting volatility clustering to stabilize downside tail risk, smooth sequence-of-returns, and mitigate leveraged factor deleveraging spirals.',
    bullets: [
      'Conditional heteroskedasticity forecasts predict calm vs volatile regimes',
      'Inverse volatility scaling truncates catastrophic market drawdown peaks',
      'Preserves risk parity across multi-asset factor portfolios',
    ],
    equation: '\\sigma_t^2 = \\omega + \\alpha \\epsilon_{t-1}^2 + \\beta \\sigma_{t-1}^2, \\quad w_t = w_0 \\cdot \\frac{\\sigma^*}{\\hat{\\sigma}_t}',
    citation: 'Bollerslev (1986) • Harvey et al. (2018)',
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

  return (
    <div className="w-full relative">
      {/* Embla Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {SLIDES.map((slide, idx) => {
            const isActive = selectedIndex === idx;

            return (
              <div
                key={slide.id}
                className="flex-[0_0_100%] md:flex-[0_0_80%] lg:flex-[0_0_65%] min-w-0 pl-4 transition-all duration-300"
              >
                <div
                  className={`h-full p-6 sm:p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    isActive
                      ? 'bg-surface-card border-slate-600 shadow-2xl scale-[1.01]'
                      : 'bg-[#080b12] border-surface-border opacity-60 scale-[0.98]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded border"
                        style={{
                          color: slide.tagColor,
                          backgroundColor: `${slide.tagColor}15`,
                          borderColor: `${slide.tagColor}40`,
                        }}
                      >
                        {slide.tag}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {slide.citation}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                      {slide.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {slide.summary}
                    </p>

                    <div className="space-y-2 pt-1">
                      {slide.bullets.map((b, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="text-emerald-400 mt-0.5 font-bold">•</span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    {slide.equation && (
                      <div className="p-3 rounded-lg bg-[#05070c] border border-cyan-500/20 text-cyan-300 font-mono text-xs overflow-x-auto">
                        $${slide.equation}$$
                      </div>
                    )}
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-surface-border mt-6">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Case Study {idx + 1} of {SLIDES.length}
                    </span>

                    <Link
                      to="/app"
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition"
                    >
                      <span>Explore in Demo Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls Row */}
      <div className="flex items-center justify-between mt-6 px-2">
        {/* Dot Indicators */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-2 rounded-full transition-all ${
                selectedIndex === i ? 'w-8 bg-emerald-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            className="p-2 rounded-lg bg-surface-card hover:bg-surface border border-surface-border text-slate-400 hover:text-white transition"
            title="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="p-2 rounded-lg bg-surface-card hover:bg-surface border border-surface-border text-slate-400 hover:text-white transition"
            title="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
