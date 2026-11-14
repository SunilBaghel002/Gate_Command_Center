'use client';

import React from 'react';
import { top10Chapters } from '@/lib/data';
import { Sparkles, Trophy, BookOpen, Clock, Target, CheckCircle2 } from 'lucide-react';

export const Top10View: React.FC = () => {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-paper-card border border-paper-border rounded-lg p-5 sm:p-6 shadow-editorial">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-serif font-black text-ink">
                Top 10 High-Yield Chapters
              </span>
              <span className="text-xs bg-brand-red text-white font-mono px-2 py-0.5 rounded font-bold">
                ~14.4 Marks
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              "Asked in 10 to 12 of the last 13 papers. A high score doesn't come from giving every chapter the same time — it comes from never losing the marks that come back every year."
            </p>
          </div>

          <div className="p-3 bg-paper rounded-lg border border-paper-border text-xs font-mono text-center">
            <span className="text-ink-muted uppercase text-[10px]">Combined Weight</span>
            <div className="text-xl font-serif font-bold text-brand-red">
              10–12 Years · 234 PYQs
            </div>
          </div>
        </div>
      </div>

      {/* The 10 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {top10Chapters.map(ch => (
          <div 
            key={ch.rank} 
            className="bg-paper-card border border-paper-border rounded-lg p-5 shadow-editorial relative overflow-hidden flex flex-col justify-between"
          >
            {/* Rank badge */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-paper-dark border-l border-b border-paper-border rounded-bl-lg flex items-center justify-center font-mono font-bold text-ink">
              #{ch.rank}
            </div>

            <div className="space-y-2 pr-12">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-ink text-paper font-mono px-2 py-0.5 rounded font-bold">
                  {ch.subject}
                </span>
                <span className="text-xs bg-tier-mustBg text-tier-must border border-tier-mustBorder px-2 py-0.2 rounded font-semibold font-mono">
                  ✅ Must-Do
                </span>
              </div>

              <h4 className="text-base font-serif font-bold text-ink">
                {ch.name}
              </h4>
            </div>

            <div className="mt-4 pt-3 border-t border-paper-border flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] text-ink-muted">Asked 2014–2026:</span>
                <div className="font-bold text-ink">{ch.years_asked} Years</div>
              </div>

              <div className="space-y-0.5 text-center">
                <span className="text-[10px] text-ink-muted">Past Questions:</span>
                <div className="font-bold text-ink">{ch.pyqs} PYQs</div>
              </div>

              <div className="space-y-0.5 text-right">
                <span className="text-[10px] text-ink-muted">Avg Marks / Paper:</span>
                <div className="font-bold text-brand-red text-sm">~{ch.marks_per_paper} M</div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
