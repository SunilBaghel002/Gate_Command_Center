'use client';

import React from 'react';
import { UserState } from '@/lib/storage';
import { diagnosticTest } from '@/lib/data';
import { 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  HelpCircle,
  Clock
} from 'lucide-react';

interface DiagnosticViewProps {
  userState: UserState;
  onUpdateState: (updater: (prev: UserState) => UserState) => void;
  onSelectTab: (tab: string) => void;
}

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({
  userState,
  onUpdateState,
  onSelectTab,
}) => {
  // Toggle diagnostic check
  const toggleCheck = (code: string, idx: number) => {
    const key = `${code}_${idx}`;
    onUpdateState(prev => ({
      ...prev,
      diagnosticChecks: {
        ...prev.diagnosticChecks,
        [key]: !prev.diagnosticChecks[key],
      },
    }));
  };

  // Calculate score
  const totalChecked = Object.values(userState.diagnosticChecks).filter(Boolean).length;

  // Recommended plan
  let recommendedPlan: 'A' | 'B' | 'C' = 'C';
  let planReason = 'Start from must-do chapters and foundation. Shortest path to marks.';
  if (totalChecked >= 12) {
    recommendedPlan = 'A';
    planReason = 'You know the core basics well. Follow Plan A (~4h/day) or Plan B (8h/day if full time).';
  }

  const applyRecommendedPlan = (plan: 'A' | 'B' | 'C') => {
    onUpdateState(prev => ({ ...prev, activePlan: plan }));
    alert(`Switched to Plan ${plan}!`);
    onSelectTab('daily');
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-paper-card border border-paper-border rounded-lg p-5 sm:p-6 shadow-editorial">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-serif font-black text-ink">
                Where Do You Stand? (Diagnostic Test)
              </span>
              <span className="text-xs bg-brand-red text-white font-mono px-2 py-0.5 rounded font-bold">
                Part 1 · Page 8
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              "Five minutes a subject, an hour in all, before Day 1. For each chapter below, write down from memory the main method/formula and question pattern. Tick only if you could do it without looking."
            </p>
          </div>

          {/* Current Score Badge */}
          <div className="bg-paper p-3 rounded-lg border border-paper-border text-center self-start md:self-auto min-w-[140px]">
            <span className="text-[10px] font-mono text-ink-muted uppercase">Your Score</span>
            <div className="text-2xl font-serif font-bold text-ink">
              {totalChecked} / 36
            </div>
            <span className="text-[10px] font-mono text-brand-red font-semibold">
              Recommended: Plan {recommendedPlan}
            </span>
          </div>
        </div>

        {/* Plan Recommendation Outcome Box */}
        <div className="mt-4 p-4 bg-brand-redLight border border-brand-red/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-brand-redDark uppercase tracking-wider text-[11px]">
              Recommendation based on {totalChecked} ticks:
            </span>
            <p className="text-ink font-medium mt-0.5">{planReason}</p>
          </div>

          <button
            onClick={() => applyRecommendedPlan(recommendedPlan)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-brand-red text-white font-semibold rounded hover:bg-brand-redDark transition shadow-sm self-start sm:self-auto shrink-0"
          >
            <span>Switch to Plan {recommendedPlan} & Start</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 12 Subjects Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {diagnosticTest.subjects.map(subj => {
          // Count checked in this subject
          let subjChecked = 0;
          for (let i = 0; i < subj.checks.length; i++) {
            if (userState.diagnosticChecks[`${subj.code}_${i}`]) subjChecked++;
          }

          return (
            <div 
              key={subj.code} 
              className="bg-paper-card border border-paper-border rounded-lg p-4 shadow-editorial space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-paper-border">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold bg-ink text-paper px-2 py-0.5 rounded">
                    {subj.code}
                  </span>
                  <h4 className="text-sm font-bold text-ink">
                    {subj.name}
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-ink-muted">
                  {subjChecked} / 3
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {subj.checks.map((chk, idx) => {
                  const isChecked = !!userState.diagnosticChecks[`${subj.code}_${idx}`];

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(subj.code, idx)}
                      className={`p-2.5 rounded border cursor-pointer transition flex items-start space-x-2.5 ${
                        isChecked
                          ? 'bg-tier-mustBg border-tier-mustBorder text-tier-must font-semibold'
                          : 'bg-paper border-paper-border hover:border-ink-muted text-ink-light'
                      }`}
                    >
                      <button className="mt-0.5">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-tier-must" />
                        ) : (
                          <Circle className="w-4 h-4 text-paper-border" />
                        )}
                      </button>
                      <span className="flex-1">{chk}</span>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
