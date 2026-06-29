/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, ClipboardList, Zap, Sparkles, CheckCircle } from 'lucide-react';

export default function Methodology() {
  const steps = [
    {
      icon: <Home className="w-5 h-5 text-brand-500" />,
      title: 'Punctual Arrival & Setup',
      desc: 'We respect your schedule. Hanoch arrives at your doorstep fully prepared and exactly on time, eliminating commute times and gym crowd stress.',
      time: '0 min'
    },
    {
      icon: <ClipboardList className="w-5 h-5 text-brand-500" />,
      title: 'Minimal Space Required',
      desc: 'All exercises are optimized to fit in a standard 6x6 ft area. Any living room, home office, or patio works perfectly, with no clean-up or prep needed.',
      time: '2 min'
    },
    {
      icon: <Zap className="w-5 h-5 text-brand-500" />,
      title: 'Tailored Active Session',
      desc: 'A highly personalized blend of functional strength exercises, stability training, and balance work adapted in real-time to how you feel.',
      time: '38 min'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-brand-500" />,
      title: 'Stretch & Recovery',
      desc: 'A focused, manual-assisted stretch session designed to relieve muscular tension, improve joint mobility, and accelerate recovery.',
      time: '5 min'
    }
  ];

  return (
    <section id="method" className="py-20 md:py-28 bg-[#F5F5F0] border-b border-[#E5E2DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#C0392B] font-bold block">
              The 45-Minute Efficiency Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#2C3E50] tracking-tight leading-tight">
              Optimal Fitness Results. <br />
              <span className="italic font-light text-[#C0392B]">Zero Stress Setup.</span>
            </h2>
            <p className="text-[#5D6D7E] text-sm leading-relaxed">
              Why 45 minutes? Science shows that 45 minutes is the ideal duration for high-intensity or highly focused private training. It maximizes physical output, improves joint safety, and avoids the systemic fatigue that leads to injury.
            </p>
          </div>

          <div className="lg:col-span-6">
            {/* Quick trust assurances */}
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E5E2DE] shadow-sm space-y-4 text-left">
              <h4 className="font-serif font-bold text-[#2C3E50] text-lg">Our Premium In-Home Assurances:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#5D6D7E]"><strong>Respecting Your Home:</strong> Quiet setup using soft neoprene weights and protective training mats.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#5D6D7E]"><strong>Sanitization Protocols:</strong> All equipment is thoroughly disinfected before entering your home.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#5D6D7E]"><strong>Floor Protection:</strong> Use of rubberized, non-marking gear for pristine floors.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#5D6E7E]"><strong>One-on-One Privacy:</strong> Exercise comfortably in the safety and discretion of your home.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Timeline Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {steps.map((st, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 sm:p-7 rounded-sm border border-[#E5E2DE] text-left flex flex-col justify-between space-y-6 relative hover:shadow-xs transition duration-200"
            >
              {/* Counter Indicator badge */}
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-sm bg-[#F5F5F0] border border-[#E5E2DE] flex items-center justify-center text-[#2C3E50]">
                  {st.icon}
                </div>
                <span className="font-mono text-xs font-bold text-[#C0392B] bg-[#F5F5F0] border border-[#E5E2DE] px-2.5 py-1 rounded-sm">
                  {st.time}
                </span>
              </div>

              {/* Text context */}
              <div className="space-y-2">
                <span className="font-sans text-[9px] text-[#7F8C8D] block font-semibold uppercase tracking-[0.15em]">
                  Phase 0{idx + 1}
                </span>
                <h4 className="font-serif font-bold text-[#2C3E50] text-[#1e2d3d] text-lg leading-tight">
                  {st.title}
                </h4>
                <p className="text-[#5D6D7E] text-xs leading-relaxed">
                  {st.desc}
                </p>
              </div>

              {/* Progress step join lines for visual feedback */}
              {idx < 3 && (
                <div className="hidden md:block absolute top-[2.5rem] right-[-1.5rem] w-6 border-t-2 border-dashed border-[#E5E2DE] z-10" />
              )}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
