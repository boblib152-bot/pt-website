/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function Features() {
  return (
    <section id="specialties" className="py-20 md:py-28 bg-[#FDFCFB] border-y border-[#E5E2DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#7F8C8D] font-bold block">
            Targeted Specializations
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#2C3E50] tracking-tight">
            Specialized In-Home Care for Health & Longevity.
          </h2>
          <p className="text-[#5D6D7E] text-sm leading-relaxed">
            We don’t believe in cookie-cutter gym routines. Hanoch Lib is a dedicated private personal trainer certified by the National Academy of Sports Medicine.
          </p>
        </div>

        {/* Binary Specialty Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Specialty 1: Seniors & Elderly Population */}
          <div className="bg-white p-8 sm:p-10 rounded-sm border border-[#E5E2DE] hover:shadow-xs transition flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-sm bg-[#F5F5F0] border border-[#E5E2DE] flex items-center justify-center text-[#2C3E50]">
                <Heart className="w-5 h-5 text-[#2C3E50]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-serif italic text-[#2C3E50]">
                  Active Aging & Balance Care
                </h3>
                <div className="inline-block px-3 py-1 bg-[#F5F5F0] border border-[#E5E2DE] text-[10px] uppercase tracking-widest font-semibold text-[#7F8C8D]">
                  Seniors 65+ Specialty
                </div>
                <p className="text-[#5D6D7E] text-xs sm:text-sm leading-relaxed">
                  Customized, low-impact training pathways constructed to strengthen bone density, increase knee & hip stability, and relieve joint stiffness safely in your home.
                </p>
              </div>

              {/* Specific features list */}
              <ul className="space-y-3 text-xs sm:text-sm text-[#1A1A1A]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Balance Work:</strong> Improving stability and full risk reduction.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Postural Stability:</strong> Helping you stand taller, feel stronger, and reach without stiffness.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Gentle Strength Training:</strong> Easy, custom resistance using sanitized fitness gear.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E2DE] text-[10px] text-[#7F8C8D] font-bold font-mono uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C0392B]" />
              <span>Safety Parameters Monitored with Every Workout</span>
            </div>
          </div>

          {/* Specialty 2: Second Active Aging & Mobility card (just like Specialty 1) */}
          <div className="bg-white p-8 sm:p-10 rounded-sm border border-[#E5E2DE] hover:shadow-xs transition flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-sm bg-[#F5F5F0] border border-[#E5E2DE] flex items-center justify-center text-[#2C3E50]">
                <Heart className="w-5 h-5 text-[#2C3E50]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-serif italic text-[#2C3E50]">
                  Mobility & Joint Health Care
                </h3>
                <div className="inline-block px-3 py-1 bg-[#F5F5F0] border border-[#E5E2DE] text-[10px] uppercase tracking-widest font-semibold text-[#7F8C8D]">
                  Seniors 65+ Specialty
                </div>
                <p className="text-[#5D6D7E] text-xs sm:text-sm leading-relaxed">
                  Safe, targeted exercises post-clinical therapy or as general preventative movement to relieve knee & hip stiffness and maintain independent living.
                </p>
              </div>

              {/* Specific features list */}
              <ul className="space-y-3 text-xs sm:text-sm text-[#1A1A1A]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Stiffness Relief:</strong> Range of motion movements focused on stiffness reduction.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Postural Strength:</strong> Supporting natural gait and safe movement paths.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Joint Warmups:</strong> Extra care and slow preparation before any resistance work.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E2DE] text-[10px] text-[#7F8C8D] font-bold font-mono uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C0392B]" />
              <span>Safety Parameters Monitored with Every Workout</span>
            </div>
          </div>

          {/* Specialty 3: General Strength & Body Transformation */}
          <div className="bg-[#F5F5F0]/70 p-8 sm:p-10 rounded-sm border border-[#E5E2DE] hover:shadow-xs transition flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-sm bg-white border border-[#E5E2DE] flex items-center justify-center text-[#C0392B]">
                <TrendingUp className="w-5 h-5 text-[#C0392B]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-serif italic text-[#2C3E50]">
                  Body Transformation & Muscle Strength
                </h3>
                <div className="inline-block px-3 py-1 bg-white border border-[#E5E2DE] text-[10px] uppercase tracking-widest font-semibold text-[#7F8C8D]">
                  General Population & Weight Loss
                </div>
                <p className="text-[#5D6D7E] text-xs sm:text-sm leading-relaxed">
                  High-efficiency, healthy fat loss and muscle toning programs designed for busy corporate executives, busy parents, and adults looking to build natural physical strength.
                </p>
              </div>

              {/* Specific features list */}
              <ul className="space-y-3 text-xs sm:text-sm text-[#1A1A1A]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2C3E50] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Fat-Burning Circuits:</strong> Efficient exercises that help boost metabolism and burn fat.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2C3E50] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Certified Guidance:</strong> Professional, step-by-step workouts tailored to your exact fitness level.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2C2D50] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Core & Hip Strength:</strong> Relieving lower back stiffness after sitting too long.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E2DE] text-[10px] text-[#7F8C8D] font-bold font-mono uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2C3E50]" />
              <span>Customized strength sessions tailored to your body and pace.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
