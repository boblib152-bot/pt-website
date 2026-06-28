/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MapPin, Truck, Shield } from 'lucide-react';
import { FAQ_ITEMS } from '../data';

export default function FAQ() {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'Show All FAQs' },
    { key: 'general', label: 'In-Home Philosophy' },
    { key: 'elderly', label: 'Senior Protocols' },
    { key: 'logistics', label: 'Equipment & Space' },
    { key: 'pricing', label: 'Cost & Diagnostic' }
  ];

  const filteredItems = activeCategory === 'all'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter(item => item.category === activeCategory);

  const toggleFAQ = (idx: number) => {
    setActiveIdx(activeIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#FDFCFB]/50 border-b border-[#E5E2DE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Module Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#C0392B] font-bold block">
            Answering Your Logistical Concerns
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#2C3E50] tracking-tight">
            Frequently Asked Logistics.
          </h2>
          <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-2"></div>
          <p className="text-[#5D6D7E] text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Everything you need to know about space footprint sizing, professional safety standards, and customized NASM training parameters.
          </p>
        </div>

        {/* Category filtering chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                setActiveIdx(null); // Reset open states on filter change
              }}
              className={`px-4 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-[#2C3E50] text-[#FDFCFB] border border-[#1A1A1A] shadow-xs'
                  : 'bg-white border border-[#E5E2DE] hover:bg-[#F5F5F0] text-[#2C3E50]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion list */}
        <div className="space-y-3.5 text-left">
          {filteredItems.map((item, idx) => {
            const isOpen = activeIdx === idx;
            return (
              <div 
                key={idx} 
                className={`border rounded-sm transition duration-200 ${
                  isOpen 
                    ? 'bg-white border-[#1A1A1A] shadow-xs' 
                    : 'bg-white border-[#E5E2DE] hover:border-[#2C3E50]'
                }`}
              >
                {/* Trigger Button */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex justify-between items-center px-6 py-5 cursor-pointer text-left focus:outline-none"
                >
                  <span className="font-serif font-bold text-sm sm:text-base text-[#2C3E50] italic pr-4 flex items-center gap-2.5">
                    <HelpCircle className="w-4.5 h-4.5 text-[#C0392B] shrink-0" />
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#7F8C8D] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#7F8C8D] shrink-0" />
                  )}
                </button>

                {/* Dropdown Answer Body */}
                {isOpen && (
                  <div className="px-6 pb-6 border-t border-[#E5E2DE]/40 pt-4">
                    <p className="text-[#5D6D7E] text-xs sm:text-sm leading-relaxed font-sans">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Trust elements underneath */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 pt-12 border-t border-[#E5E2DE]">
          <div className="flex gap-3 items-start text-left">
            <Truck className="w-5 h-5 text-[#C0392B] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-serif font-bold text-[#2C3E50] text-sm tracking-tight mb-1">Direct Equipment Delivery</h5>
              <p className="text-[11px] text-[#7F8C8D] leading-relaxed">
                Hanoch drives with customized balance pads, core blocks, and weights, eliminating the need to purchase any gear.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start text-left">
            <Shield className="w-5 h-5 text-[#C0392B] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-serif font-bold text-[#2C3E50] text-sm tracking-tight mb-1">Insured & CPR Approved</h5>
              <p className="text-[11px] text-[#7F8C8D] leading-relaxed">
                Full physical safety metrics are strictly upheld, protected by verified commercial training liability insurance.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start text-left">
            <MapPin className="w-5 h-5 text-[#C0392B] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-serif font-bold text-[#2C3E50] text-sm tracking-tight mb-1">Five Towns Dedicated Bounds</h5>
              <p className="text-[11px] text-[#7F8C8D] leading-relaxed">
                By focusing on the Five Towns area, we ensure zero arrival delays, staying on a precise schedule.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
