/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Calendar, Activity, MapPin, Sparkles } from 'lucide-react';

interface HeroProps {
  onScrollTo: (selector: string) => void;
}

export default function Hero({ onScrollTo }: HeroProps) {
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-[#FDFCFB] border-b border-[#E5E2DE]">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 -mr-45 -mt-45 w-96 h-96 bg-[#F5F5F0] rounded-full blur-3xl opacity-40 pointer-events-none animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Main Copy Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Certification Badge */}
            <div className="inline-block px-3.5 py-1 bg-[#F5F5F0] border border-[#E5E2DE] rounded-sm text-[10px] uppercase tracking-[0.2em] font-semibold text-[#7F8C8D]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-amber shrink-0" />
                <span>NASM CERTIFIED IN-HOME TRAINER</span>
              </span>
            </div>

            {/* Master Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal leading-[1.1] text-[#2C3E50] tracking-tight">
                Custom Training <br />
                <span className="italic font-light text-[#C0392B]">At Your Doorstep.</span>
              </h1>
              <p className="text-sm sm:text-base text-[#5D6D7E] max-w-xl leading-relaxed font-sans">
                Seamless, private, 45-minute in-home personal training designed for safe balance improvement, healthy weight loss, and functional strength. Hanoch Lib brings all the equipment directly to your living room.
              </p>
            </div>

            {/* Travel Coverage Indicator */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[#7F8C8D] text-xs uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C0392B]" />
                <span>Travel Target: <strong className="text-[#2C3E50]">The Five Towns Area</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent-gold" />
                <span>Structure: <strong className="text-[#2C3E50]">45-Minute Private Workouts</strong></span>
              </div>
            </div>

            {/* Interactive CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onScrollTo('book')}
                className="bg-[#2C3E50] hover:bg-[#1E2D3D] text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-sm border border-[#2C3E50] hover:shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                id="hero_cta_book"
              >
                <Calendar className="w-4 h-4 text-[#E5E2DE]" />
                <span>Schedule Phone Consultation</span>
              </button>
            </div>
          </div>

          {/* Quick Stats & Trust Graphic Column */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E5E2DE] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#2C3E50] text-[#FDFCFB] px-3 py-1 font-mono text-[9px] uppercase font-bold tracking-widest">
                Private In-Home Personal Trainer
              </div>

              {/* Bio snippet */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-sm bg-[#F5F5F0] flex items-center justify-center text-[#2C3E50] font-serif italic text-2xl border border-[#E5E2DE] shadow-xs">
                    HL
                  </div>
                  <div className="text-left">
                    <h4 className="font-serif font-bold text-[#2C3E50] text-lg leading-tight">Hanoch Lib</h4>
                    <p className="text-[#7F8C8D] text-[10px] uppercase tracking-wider font-semibold">NASM Certified Personal Trainer</p>
                  </div>
                </div>

                <div className="border-t border-b border-[#E5E2DE] py-4.5 space-y-3.5 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7F8C8D] uppercase tracking-wider">Methodology</span>
                    <span className="text-[#2C3E50] font-bold">Safe balance training & strength building</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7F8C8D] uppercase tracking-wider">Session Interval</span>
                    <span className="text-[#2C3E50] font-bold">Precisely 45 Minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7F8C8D] uppercase tracking-wider">Physical Assets</span>
                    <span className="text-[#2C3E50] font-bold">Trainer Provided & Sanitized</span>
                  </div>
                </div>

                {/* Core Philosophy Notice */}
                <div className="bg-[#F5F5F0]/60 p-4 rounded-sm border border-[#E5E2DE] text-left">
                  <p className="text-[#5D6D7E] text-xs leading-relaxed font-sans">
                    Zero-pressure workouts designed fully around your joints, strength, and pace. We build physical freedom and confidence, so you can enjoy independent living at home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
