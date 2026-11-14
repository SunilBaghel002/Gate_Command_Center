'use client';

import React from 'react';
import { examStrategy } from '@/lib/data';
import { Clock, CheckSquare, AlertCircle, Compass, ShieldAlert, Sparkles } from 'lucide-react';

export const ExamStrategyView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-paper-card border border-paper-border rounded-lg p-5 sm:p-6 shadow-editorial">
        <div className="flex items-center space-x-2">
          <span className="text-2xl sm:text-3xl font-serif font-black text-ink">
            Exam Day Strategy & 3-Hour Clock Blueprint
          </span>
          <span className="text-xs bg-brand-red text-white font-mono px-2 py-0.5 rounded font-bold">
            Pages 152–154
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          "Three hours, 65 questions, 100 marks: 10 General Aptitude questions (15 marks) and 55 subject questions (85 marks). Plan the time before you sit down."
        </p>
      </div>

      {/* 3-Hour Time Clock Allocation */}
      <div className="bg-paper-card border border-paper-border rounded-lg p-5 shadow-editorial space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-paper-border">
          <Clock className="w-4 h-4 text-brand-red" />
          <h3 className="text-sm font-serif font-bold text-ink uppercase tracking-wider">
            Attempt Order & Time Allocation (The 3-Pass Rule)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {examStrategy.time_blocks.map((block, idx) => (
            <div key={block.block} className="bg-paper p-4 rounded-lg border border-paper-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-ink">{block.block}</span>
                <span className="font-mono text-xs font-bold text-brand-red bg-brand-redLight px-2 py-0.5 rounded border border-brand-red/30">
                  {block.time}
                </span>
              </div>
              <p className="text-xs text-ink-light">
                {block.strategy}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Question Type Playbooks (MCQ, MSQ, NAT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* MCQ */}
        <div className="bg-paper-card border border-paper-border rounded-lg p-5 shadow-editorial space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
            <h4 className="text-sm font-serif font-bold text-ink">MCQ (Negative Marks)</h4>
          </div>
          <p className="text-xs text-ink-light">
            +1 or +2 marks, with 1/3 negative penalty (-0.33 or -0.66).
          </p>
          <div className="p-3 bg-red-50/70 border border-red-200 rounded text-xs text-red-950 space-y-1">
            <strong>Rule:</strong> Answer only when at least <strong>two options</strong> are ruled out. A blind guess costs more than it gains. Keep total MCQ negative marks below 3.
          </div>
        </div>

        {/* MSQ */}
        <div className="bg-paper-card border border-paper-border rounded-lg p-5 shadow-editorial space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h4 className="text-sm font-serif font-bold text-ink">MSQ (No Partial Marks)</h4>
          </div>
          <p className="text-xs text-ink-light">
            One or more options correct. Zero negative marks, but zero partial marks.
          </p>
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-xs text-blue-950 space-y-1">
            <strong>Rule:</strong> Judge each option on its own like <strong>four True/False questions</strong>. Tick only what you can prove. Many MSQs have only one correct option!
          </div>
        </div>

        {/* NAT */}
        <div className="bg-paper-card border border-paper-border rounded-lg p-5 shadow-editorial space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tier-must" />
            <h4 className="text-sm font-serif font-bold text-ink">NAT (Type a Number)</h4>
          </div>
          <p className="text-xs text-ink-light">
            No negative marks. An attempt never costs marks, only time.
          </p>
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded text-xs text-emerald-950 space-y-1">
            <strong>Rule:</strong> Keep full calculator precision while working, round <strong>once at the end</strong> to required decimals. Always double-check units ($ms$ vs $\mu s$, bits vs bytes).
          </div>
        </div>

      </div>

      {/* The Last 7 Days Protocol (PDF Page 152) */}
      <div className="bg-paper-card border border-paper-border rounded-lg p-5 shadow-editorial space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-paper-border">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-brand-red" />
            <h3 className="text-sm font-serif font-bold text-ink uppercase tracking-wider">
              The Last 7 Days & The Night Before (Days 84–90)
            </h3>
          </div>
          <span className="text-xs text-ink-muted">
            No new chapters · Only what you already know, kept sharp
          </span>
        </div>

        <div className="space-y-2">
          {examStrategy.the_last_7_days.map(item => (
            <div 
              key={item.day}
              className={`p-3 rounded border text-xs flex items-start space-x-3 transition ${
                item.day === 85 
                  ? 'bg-blue-50/60 border-blue-200' 
                  : item.day === 90
                  ? 'bg-amber-50/60 border-amber-200'
                  : 'bg-paper border-paper-border'
              }`}
            >
              <span className="font-mono font-bold text-brand-red px-2 py-0.5 bg-paper-card rounded border border-paper-border shrink-0">
                Day {item.day}
              </span>
              <p className="text-ink-light flex-1 pt-0.5">
                {item.focus}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
