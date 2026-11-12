import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { MagneticButton } from '../components/landing/MagneticButton';
import { Layers, ArrowRight, Heart, Sparkles, Shield, Cpu } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#100f12] font-sans selection:bg-[#ebe5ff] selection:text-[#6d55bd]">
      <LandingNavbar />

      <section className="pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#eaecf0] bg-[#faf9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebe5ff] text-[#6d55bd] text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-[#6d55bd]" />
            <span>Our Mission & Team</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#100f12] max-w-4xl mx-auto leading-tight">
            Building software that honors how the mind works.
          </h1>

          <p className="text-base sm:text-lg text-[#65646e] max-w-2xl mx-auto leading-relaxed">
            Brain Vault was created with a clear conviction: human knowledge isn’t linear rows or isolated silos—it is an organic, evolving neural network.
          </p>

          <div className="pt-2">
            <MagneticButton
              onClick={() => navigate('/demo')}
              className="px-7 py-3.5 rounded-2xl bg-[#6d55bd] hover:bg-[#5b45a3] text-white font-semibold text-sm shadow-md transition flex items-center gap-2 mx-auto"
            >
              <span>Explore Brain Vault Demo</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Story & Values */}
      <section className="py-20 md:py-28 bg-white border-b border-[#eaecf0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-6 text-sm sm:text-base text-[#4b5563] leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#100f12]">
              Why We Built Brain Vault
            </h2>
            <p>
              For decades, note-taking software forced human intelligence into hierarchical filing cabinets. But when we think, read, and create, our thoughts jump across domains: a memory from cognitive neuroscience connects to a theorem in distributed systems, which sparks an intuition in philosophy of mind.
            </p>
            <p>
              We wanted a tool that didn’t just store text, but actively participated in connecting thoughts. By pairing a 60 FPS HTML5 Canvas graph engine with multi-model AI routing, Brain Vault makes cognitive synthesis effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-2xl p-6 space-y-2">
              <h4 className="font-bold text-base text-[#100f12]">Local-First Freedom</h4>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Standard Markdown files, zero lock-in, zero telemetry snooping. Your notes are yours forever.
              </p>
            </div>
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-2xl p-6 space-y-2">
              <h4 className="font-bold text-base text-[#100f12]">Universal Frontier AI</h4>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Never constrained to one model provider. Switch between Claude, GPT-4o, Gemini, and DeepSeek on demand.
              </p>
            </div>
            <div className="bg-[#faf9ff] border border-[#eaecf0] rounded-2xl p-6 space-y-2">
              <h4 className="font-bold text-base text-[#100f12]">Spatial Aesthetics</h4>
              <p className="text-xs text-[#65646e] leading-relaxed">
                Clean unlabeled connecting wires, degree-scaled radii, and true AMOLED dark IDE for hours of focused flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
