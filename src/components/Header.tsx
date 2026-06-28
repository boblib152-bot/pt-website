/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Briefcase, Calendar, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onScrollTo: (selector: string) => void;
  isDashboardOpen: boolean;
  onToggleDashboard: () => void;
}

export default function Header({ onScrollTo, isDashboardOpen, onToggleDashboard }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onScrollTo('hero')}>
            <div className="w-10 h-10 rounded-sm bg-brand-500 flex items-center justify-center text-white shadow-sm border border-[#E5E2DE] hover:bg-brand-600 transition-all">
              <Award className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-neutral-900 block leading-tight">
                HANOCH LIB
              </span>
              <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-[#7F8C8D] font-bold block">
                Premium In-Home Personal Training
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => {
                if (isDashboardOpen) onToggleDashboard();
                setTimeout(() => onScrollTo('specialties'), 100);
              }}
              className="text-[#5D6D7E] hover:text-[#C0392B] text-xs uppercase tracking-widest transition-colors font-medium"
            >
              Specialties
            </button>
            <button
              onClick={() => {
                if (isDashboardOpen) onToggleDashboard();
                setTimeout(() => onScrollTo('method'), 100);
              }}
              className="text-[#5D6D7E] hover:text-[#C0392B] text-xs uppercase tracking-widest transition-colors font-medium"
            >
              The 45-Min Method
            </button>
            <button
              onClick={() => {
                if (isDashboardOpen) onToggleDashboard();
                setTimeout(() => onScrollTo('faq'), 100);
              }}
              className="text-[#5D6D7E] hover:text-[#C0392B] text-xs uppercase tracking-widest transition-colors font-medium"
            >
              Logistics & FAQ
            </button>
          </nav>

          {/* Call to Actions */}
          <div className="flex items-center space-x-4">
            {/* Dashboard Toggle */}
            <button
              onClick={onToggleDashboard}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-[11px] font-medium uppercase tracking-widest border transition-all ${
                isDashboardOpen
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-[#F5F5F0] hover:bg-[#E5E2DE] border-[#E5E2DE] text-[#2C3E50]'
              }`}
              title="Access secure portal for client schedules, workout history and assessments"
              id="header_dashboard_btn"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{isDashboardOpen ? 'Exit Portal' : 'Portal Access'}</span>
            </button>

            <button
              onClick={() => {
                if (isDashboardOpen) onToggleDashboard();
                setTimeout(() => onScrollTo('book'), 100);
              }}
              className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-sm border border-[#1A1A1A] transition-all hover:shadow-md shadow-sm flex items-center gap-2"
              id="header_book_btn"
            >
              <Calendar className="w-4 h-4 text-[#E5E2DE]" />
              <span>Book Call</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
