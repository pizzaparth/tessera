import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { MagneticButton } from '../components/landing/MagneticButton';
import { ArrowRight, Star, Quote, Sparkles, CheckCircle2 } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();

  const caseStudies = [
    {
      company: 'Replit Engineering',
      metric: '4x faster',
      statLabel: 'Literature & system synthesis',
      quote:
        'Brain Vault completely changed how our architects document distributed systems. The 2D canvas graph gives us an intuitive spatial intuition that static docs never provided.',
      author: 'Staff Systems Architect',
    },
    {
      company: 'Cognitive Computing Lab',
      metric: '3,200+',
      statLabel: 'Interconnected research nodes',
      quote:
        'The ability to chat with Claude 3.5 Sonnet and see new research hypotheses dynamically sprout as nodes in our graph is like having a tireless research assistant in the room.',
      author: 'Principal Investigator',
    },
    {
      company: 'Decisions & Systems Lab',
      metric: '200+ hrs',
      statLabel: 'Saved yearly in manual mapping',
      quote:
        'We migrated from traditional note tools. The zero-label wire aesthetic, instant wikilinks, and pure AMOLED workspace make it an absolute joy to use for 8 hours a day.',
      author: 'Lead Knowledge Engineer',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#100f12] font-sans selection:bg-[#ebe5ff] selection:text-[#6d55bd]">
      <LandingNavbar />

      <section className="pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#eaecf0] bg-[#faf9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebe5ff] text-[#6d55bd] text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-[#6d55bd]" />
            <span>Customer Stories & Proof</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#100f12] max-w-4xl mx-auto leading-tight">
            How ambitious teams think faster with Brain Vault.
          </h1>

          <p className="text-base sm:text-lg text-[#65646e] max-w-2xl mx-auto leading-relaxed">
            See how forward-thinking researchers, software teams, and authors use our 2D canvas graph and multi-model AI assistant to connect their best work.
          </p>

          <div className="pt-2">
            <MagneticButton
              onClick={() => navigate('/demo')}
              className="px-7 py-3.5 rounded-2xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white font-semibold text-sm shadow-md transition flex items-center gap-2 mx-auto"
            >
              <span>Try Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 md:py-28 bg-white border-b border-[#eaecf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((cs, idx) => (
              <div
                key={idx}
                className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:shadow-xl transition"
              >
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#6d55bd]">
                    {cs.company}
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-extrabold text-[#100f12]">{cs.metric}</div>
                    <div className="text-xs text-[#65646e]">{cs.statLabel}</div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed italic pt-2">
                    "{cs.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-[#eaecf0] text-xs font-semibold text-[#100f12]">
                  — {cs.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
