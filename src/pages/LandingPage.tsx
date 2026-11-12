import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animate, motion, useMotionValue } from 'framer-motion';
import { Github, MessagesSquare, Network, Sparkles, Zap } from 'lucide-react';
import { Robot } from '../components/landing/atlas/Robot';
import { VaultPreview } from '../components/landing/atlas/VaultPreview';
import {
  FaqSection,
  GroundedSection,
  ModelsSection,
  OpenSourceSection,
  RobotFooter,
  StepsSection,
  TeamSection,
  ThreadsSection,
} from '../components/landing/atlas/Sections';
import '../components/landing/atlas/atlas.css';

const GITHUB_URL = 'https://github.com/pizzaparth/tessera';

// Intro timeline (ms)
const WAKE_AT = 700;
const SETTLE_AT = 1500;
const SETTLE_DURATION = 1.15;
const EASE: [number, number, number, number] = [0.7, 0, 0.2, 1];

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    <circle cx="18" cy="5" r="3" fill="currentColor" />
    <circle cx="6" cy="12" r="3" fill="currentColor" />
    <circle cx="18" cy="19" r="3" fill="currentColor" />
  </svg>
);

const FEATURES = [
  {
    icon: Network,
    title: 'Your notes, as a living graph',
    body: 'Every [[wikilink]] becomes an edge. Ideas settle into clusters you can see and explore.',
  },
  {
    icon: MessagesSquare,
    title: 'Talk it through',
    body: 'Ask about any note, add context, dig deeper. The AI reads your vault before it answers.',
  },
  {
    icon: Zap,
    title: 'Turn questions into notes',
    body: 'Expand a topic and the AI drafts linked notes straight into your graph.',
  },
];


export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const robotSlotRef = useRef<HTMLDivElement>(null);
  const robotY = useMotionValue(0);
  const robotScale = useMotionValue(1);
  const robotOpacity = useMotionValue(0);

  const [awake, setAwake] = useState(false);
  const [revealed, setRevealed] = useState(false);
  // While the intro runs, the robot is laid out at its full intro size (so the
  // SVG rasterizes sharp) and scaled down into the slot. Null = normal layout.
  const [introBox, setIntroBox] = useState<{ w: number; h: number; left: number; top: number } | null>(null);

  // Intro: robot starts large and asleep in the middle of the screen,
  // wakes up, then settles into its place in the hero as the page fades in.
  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || window.scrollY > 40) {
      robotOpacity.set(1);
      setAwake(true);
      setRevealed(true);
      return;
    }

    const slot = robotSlotRef.current;
    if (!slot) return;
    const r = slot.getBoundingClientRect();
    const ORIGIN_Y = 0.38; // face centre, matches transform origin below
    const faceY = r.top + r.height * ORIGIN_Y;
    const headHeight = r.height * 0.62;
    const scale = Math.max(1, Math.min((window.innerHeight * 0.92) / headHeight, (window.innerWidth * 0.92) / r.width, 2.6));

    // Big box whose origin point sits on the slot's origin point.
    const w = r.width * scale;
    const h = r.height * scale;
    setIntroBox({ w, h, left: (r.width - w) / 2, top: ORIGIN_Y * (r.height - h) });

    robotY.set(window.innerHeight / 2 - faceY);
    robotScale.set(1);
    robotOpacity.set(1);

    // Block scrolling without touching overflow, so the scrollbar never
    // disappears and the page width never changes.
    const SCROLL_KEYS = new Set([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End']);
    const block = (e: Event) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };
    window.addEventListener('wheel', block, { passive: false });
    window.addEventListener('touchmove', block, { passive: false });
    window.addEventListener('keydown', blockKeys);
    const unlock = () => {
      window.removeEventListener('wheel', block);
      window.removeEventListener('touchmove', block);
      window.removeEventListener('keydown', blockKeys);
    };

    const timers = [
      window.setTimeout(() => setAwake(true), WAKE_AT),
      window.setTimeout(() => {
        setRevealed(true);
        animate(robotY, 0, { duration: SETTLE_DURATION, ease: EASE });
        animate(robotScale, 1 / scale, { duration: SETTLE_DURATION, ease: EASE });
      }, SETTLE_AT),
      window.setTimeout(() => {
        // Swap to the normal layout; same box on screen, so no visible change.
        robotScale.set(1);
        setIntroBox(null);
        unlock();
      }, SETTLE_AT + SETTLE_DURATION * 1000 + 50),
    ];

    return () => {
      timers.forEach(clearTimeout);
      unlock();
    };
  }, [robotY, robotScale, robotOpacity]);

  // Press D to open the demo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'd' || e.key === 'D') navigate('/demo');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 14, filter: 'blur(12px)' },
    animate: revealed ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
    transition: { duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] as [number, number, number, number] },
  });

  const openDemo = () => navigate('/demo');

  return (
    <div className="atlas-page min-h-screen overflow-x-hidden">
      {/* Nav */}
      <motion.header {...reveal(0.35)} className="relative z-40">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 sm:px-6 h-[72px]">
          <a href="/" className="flex items-center gap-2 text-black">
            <Logo className="w-5 h-5" />
            <span className="text-[17px] font-semibold tracking-[-0.02em]">Brain Vault</span>
          </a>
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-[14px] font-medium text-black/70 hover:text-black transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <button onClick={openDemo} className="atlas-pill atlas-pill-sm">
              <Sparkles className="w-4 h-4" /> Open the demo
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center">
          <motion.h1 {...reveal(0.05)} className="atlas-display atlas-h1 mt-6 sm:mt-10">
            Meet your vault,
            <br />
            your AI second brain.
          </motion.h1>
          <motion.p {...reveal(0.18)} className="atlas-lede mt-5 max-w-[540px]">
            Brain Vault turns your notes into a living knowledge graph, and an AI that reads it with you to link,
            expand and recall ideas.
          </motion.p>

          {/* Robot */}
          <div ref={robotSlotRef} className="atlas-robot relative z-20 mt-8 sm:mt-10 aspect-[400/560]">
            <motion.div
              className={introBox ? 'absolute' : 'absolute inset-0'}
              style={{
                ...(introBox && { width: introBox.w, height: introBox.h, left: introBox.left, top: introBox.top }),
                y: robotY,
                scale: robotScale,
                opacity: robotOpacity,
                originX: 0.5,
                originY: 0.38,
              }}
            >
              <Robot awake={awake} className="w-full h-full" />
            </motion.div>
          </div>
        </div>

        {/* Product preview overlaps the robot's torso */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative z-30 max-w-[1080px] mx-auto"
          style={{ marginTop: 'calc(var(--rw) * -0.18)' }}
        >
          <VaultPreview visible={revealed} />
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 pt-20 sm:pt-24 pb-24 sm:pb-32">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="text-[16px] text-black/55 mb-8 sm:mb-10">How it works</h2>
          <div className="grid gap-10 md:gap-14 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <Icon className="w-5 h-5 mb-4" strokeWidth={2.2} />
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] mb-1.5">{title}</h3>
                <p className="text-[16px] leading-[1.45] text-black/65">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ModelsSection />
      <ThreadsSection />
      <GroundedSection />
      <TeamSection />
      <OpenSourceSection />
      <StepsSection onOpen={openDemo} />
      <FaqSection />
      <RobotFooter onOpen={openDemo} githubUrl={GITHUB_URL} />
    </div>
  );
};

export default LandingPage;
