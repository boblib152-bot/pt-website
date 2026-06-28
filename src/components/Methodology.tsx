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
      title: 'Punctual Arrival',
      desc: 'Hanoch arrives exactly on time at your residence. No travel stress, membership cards, or busy parking lots. All training gear is fully pre-sanitized.',
      time: '0 min'
    },
    {
      icon: <ClipboardList className="w-5 h-5 text-brand-500" />,
      title: 'Minimum Footprint Setup',
      desc: 'Hanoch sets up the gear in any clear 6x6 ft floor space. Your living room, patio, or spare room works perfectly with zero preparation or disruption to your floors.',
      time: '2 min'
    },
    {
      icon: <Zap className="w-5 h-5 text-brand-500" />,
      title: 'Custom Strength & Balance',
      desc: 'An active session designed around your safe pace. We alternate posture-support exercises and gentle mobility movements to help build strength and coordination.',
      time: '38 min'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-brand-500" />,
      title: 'Stretching & Cool-down',
      desc: 'Hanoch guides you through a comfortable stretching cool-down to ease muscular tension, improve joint range of motion, and leave you feeling energized.',
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
              The 45-Minute Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#2C3E50] tracking-tight leading-tight">
              Maximum Healthy Strength. <br />
              <span className="italic font-light text-[#C0392B]">Zero Stress Setup.</span>
            </h2>
            <p className="text-[#5D6D7E] text-sm leading-relaxed">
              Why 45 minutes? Shorter, highly focused workouts are much safer for joints and match your body's energy levels perfectly. By focusing purely on custom balance and muscle exercises, we get excellent and safe results without over-exhaustion.
            </p>
          </div>

          <div className="lg:col-span-6">
            {/* Quick trust assurances */}
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E5E2DE] shadow-sm space-y-4 text-left">
              <h4 className="font-serif font-bold text-[#2C3E50] text-lg">Our Absolute In-Home Assurances:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#5D6D7E]"><strong>Quiet Setup:</strong> Gentle, carefully placed gear designed to respect your floors and home.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#5D6D7E]"><strong>Sterilized Gear:</strong> Alcohol-wiped handles and ropes.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#5D6D7E]"><strong>No Floor Scratching:</strong> Soft neoprene-encased weights only.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#5D6E7E]"><strong>Absolute Privacy:</strong> Ideal for self-conscious or active senior clients.</span>
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
