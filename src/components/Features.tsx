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
            Our Specializations
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#2C3E50] tracking-tight">
            Tailored In-Home Personal Training for Health & Longevity.
          </h2>
          <p className="text-[#5D6D7E] text-sm leading-relaxed">
            Skip the crowded gym. Train one-on-one with a dedicated NASM-certified specialist who designs every movement program around your unique lifestyle, safety needs, and physical capabilities.
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
                  Senior Fitness & Fall Prevention
                </h3>
                <div className="inline-block px-3 py-1 bg-[#F5F5F0] border border-[#E5E2DE] text-[10px] uppercase tracking-widest font-semibold text-[#7F8C8D]">
                  Active Aging Program
                </div>
                <p className="text-[#5D6D7E] text-xs sm:text-sm leading-relaxed">
                  Low-impact, evidence-based programs designed to improve bone density, stabilize key joints, and restore fluid mobility so you can navigate daily tasks safely.
                </p>
              </div>

              {/* Specific features list */}
              <ul className="space-y-3 text-xs sm:text-sm text-[#1A1A1A]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Balance & Coordination:</strong> Target core stability to actively prevent falls.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Postural Alignment:</strong> Support optimal spine alignment and overall trunk strength.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Functional Strength:</strong> Practical resistance training using premium, pre-sanitized equipment.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E2DE] text-[10px] text-[#7F8C8D] font-bold font-mono uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C0392B]" />
              <span>Safety Parameters Monitored with Every Workout</span>
            </div>
          </div>

          {/* Specialty 2: Second Active Aging & Mobility card */}
          <div className="bg-white p-8 sm:p-10 rounded-sm border border-[#E5E2DE] hover:shadow-xs transition flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-sm bg-[#F5F5F0] border border-[#E5E2DE] flex items-center justify-center text-[#2C3E50]">
                <Heart className="w-5 h-5 text-[#2C3E50]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-serif italic text-[#2C3E50]">
                  Injury Prevention & Joint Mobility
                </h3>
                <div className="inline-block px-3 py-1 bg-[#F5F5F0] border border-[#E5E2DE] text-[10px] uppercase tracking-widest font-semibold text-[#7F8C8D]">
                  Joint Health Specialty
                </div>
                <p className="text-[#5D6D7E] text-xs sm:text-sm leading-relaxed">
                  Transition safely from clinical physical therapy or address chronic knee, hip, and shoulder stiffness to preserve long-term physical independence.
                </p>
              </div>

              {/* Specific features list */}
              <ul className="space-y-3 text-xs sm:text-sm text-[#1A1A1A]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Range of Motion:</strong> Targeted movements to alleviate tightness and ease stiffness.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Gait & Mechanics:</strong> Enhance walking mechanics and natural motion paths.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Pre-Workout Activation:</strong> Thorough joint preparation to ensure safety under resistance.</span>
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
                  Strength, Toning & Conditioning
                </h3>
                <div className="inline-block px-3 py-1 bg-white border border-[#E5E2DE] text-[10px] uppercase tracking-widest font-semibold text-[#7F8C8D]">
                  All Fitness Levels
                </div>
                <p className="text-[#5D6D7E] text-xs sm:text-sm leading-relaxed">
                  Time-efficient, high-impact workouts tailored for busy professionals, parents, and adults looking to optimize body composition, build muscle, and boost energy.
                </p>
              </div>

              {/* Specific features list */}
              <ul className="space-y-3 text-xs sm:text-sm text-[#1A1A1A]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2C3E50] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Metabolic Circuits:</strong> High-efficiency training to optimize fat loss and boost metabolic rate.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2C3E50] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Expert Coaching:</strong> Personalized progression tracking tailored to your physical capacity.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2C2D50] shrink-0 mt-0.5" />
                  <span><strong className="text-[#2C3E50]">Core & Lumbar Support:</strong> Strengthen structural muscles to relieve chronic lower back tension.</span>
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
