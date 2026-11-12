import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { MagneticButton } from '../components/landing/MagneticButton';
import { Check, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [annualBilling, setAnnualBilling] = useState(true);

  return (
    <div className="min-h-screen bg-white text-[#100f12] font-sans selection:bg-[#ebe5ff] selection:text-[#6d55bd]">
      <LandingNavbar />

      <section className="pt-16 pb-24 md:pt-24 md:pb-32 border-b border-[#eaecf0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f7f5ff] text-[#6d55bd] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simple, transparent pricing</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#100f12]">
              Choose the right brain for your workflow.
            </h1>
            <p className="text-base sm:text-lg text-[#65646e] leading-relaxed">
              Explore freely with our full-featured community tier, or unlock frontier cloud AI model synthesis and team collaboration.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <span className={`text-xs font-semibold ${!annualBilling ? 'text-[#100f12]' : 'text-[#65646e]'}`}>
                Monthly
              </span>
              <button
                onClick={() => setAnnualBilling(!annualBilling)}
                className="w-12 h-6 bg-[#6d55bd] rounded-full p-0.5 transition-colors relative cursor-pointer"
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    annualBilling ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-xs font-semibold flex items-center gap-1 ${annualBilling ? 'text-[#100f12]' : 'text-[#65646e]'}`}>
                Annual <span className="bg-[#ebe5ff] text-[#6d55bd] text-[10px] px-1.5 py-0.5 rounded font-bold">Save 20%</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-6">
            {/* Free Community Tier */}
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:shadow-lg transition">
              <div className="space-y-4">
                <div className="text-sm font-bold uppercase tracking-wider text-[#65646e]">Community</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#100f12]">$0</span>
                  <span className="text-xs text-[#65646e]">/ forever</span>
                </div>
                <p className="text-xs text-[#65646e] leading-relaxed">
                  Ideal for solo researchers, students, and thinkers exploring non-linear knowledge graphs.
                </p>

                <div className="pt-4 border-t border-[#eaecf0] space-y-2.5 text-xs text-[#100f12]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>Full 60 FPS 2D Canvas Graph</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>Unlimited Markdown & Wikilinks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>Degree-scaled node sizing & physics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>Bring Your Own API Keys</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>In-system modal dialogs</span>
                  </div>
                </div>
              </div>

              <MagneticButton
                onClick={() => navigate('/demo')}
                className="w-full py-3 rounded-xl bg-white hover:bg-[#f9fafb] text-[#100f12] font-semibold text-xs border border-[#eaecf0] shadow-xs transition"
              >
                Try Demo Now
              </MagneticButton>
            </div>

            {/* Pro Tier (Featured) */}
            <div className="bg-white border-2 border-[#6d55bd] rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#6d55bd] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>

              <div className="space-y-4">
                <div className="text-sm font-bold uppercase tracking-wider text-[#6d55bd]">Pro Thinker</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#100f12]">
                    ${annualBilling ? '10' : '12'}
                  </span>
                  <span className="text-xs text-[#65646e]">/ month</span>
                </div>
                <p className="text-xs text-[#65646e] leading-relaxed">
                  For knowledge workers, authors, and engineers who want managed frontier AI synthesis.
                </p>

                <div className="pt-4 border-t border-[#eaecf0] space-y-2.5 text-xs text-[#100f12]">
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-[#6d55bd]" />
                    <span>Everything in Community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6d55bd]" />
                    <span>Managed Claude 3.5 & GPT-4o access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6d55bd]" />
                    <span>Multi-device encrypted cloud sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6d55bd]" />
                    <span>Automated research literature synthesis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6d55bd]" />
                    <span>Priority model latency</span>
                  </div>
                </div>
              </div>

              <MagneticButton
                onClick={() => navigate('/demo')}
                className="w-full py-3 rounded-xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white font-bold text-xs shadow-md transition"
              >
                Try Demo & Upgrade
              </MagneticButton>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-3xl p-8 space-y-6 flex flex-col justify-between hover:shadow-lg transition">
              <div className="space-y-4">
                <div className="text-sm font-bold uppercase tracking-wider text-[#65646e]">Enterprise</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#100f12]">Custom</span>
                </div>
                <p className="text-xs text-[#65646e] leading-relaxed">
                  For universities, research labs, and engineering organizations with private vaults.
                </p>

                <div className="pt-4 border-t border-[#eaecf0] space-y-2.5 text-xs text-[#100f12]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>Team shared graph vaults</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>Custom private LLM endpoints & VPC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>SAML / SSO & Role-based permissions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>Dedicated support & 99.99% uptime SLA</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/demo')}
                className="w-full py-3 rounded-xl bg-white hover:bg-[#f9fafb] text-[#100f12] font-semibold text-xs border border-[#eaecf0] shadow-xs transition"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
