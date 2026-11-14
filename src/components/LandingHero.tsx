'use client';

import React from 'react';
import { 
  Sparkles, 
  Target, 
  Compass, 
  BookOpen, 
  Brain, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  Flame, 
  Clock, 
  Upload,
  Calendar,
  Layers,
  ChevronRight,
  Award
} from 'lucide-react';
import { exportUserStateJson, UserState } from '@/lib/storage';

interface LandingHeroProps {
  onStartOnboarding: () => void;
  onEnterDashboard: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userState: UserState;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartOnboarding,
  onEnterDashboard,
  onImportBackup,
  userState,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Header / Purpose Statement */}
      <div className="bg-paper-card border-2 border-paper-border rounded-xl p-6 sm:p-10 shadow-editorial text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-48 h-48 bg-brand-red/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Badges */}
        <div className="inline-flex items-center space-x-2 bg-brand-redLight border border-brand-red/30 px-3 py-1 rounded-full text-xs font-mono text-brand-redDark mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-red" />
          <span>GATE CSE 2027 · The 90-Day Statistical Rescue Engine</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-ink tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Stop Guessing What to Study.
          <br />
          <span className="text-brand-red italic font-serif">Execute the Numbers.</span>
        </h1>

        {/* The Purpose of Building This */}
        <p className="mt-4 text-base sm:text-lg text-ink-muted max-w-3xl mx-auto font-sans leading-relaxed">
          Built from empirical analysis of <strong className="text-ink font-semibold">1,840 past questions across 13 GATE papers (2008–2026)</strong>. 
          Standard preparation wastes 300+ hours on low-yield chapters. 
          This command center ruthlessly filters the entire syllabus so you only spend your hours where marks actually live.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartOnboarding}
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-red text-white font-serif font-bold text-base rounded-lg hover:bg-brand-redDark shadow-editorial flex items-center justify-center space-x-2 transition-transform transform active:scale-95 cursor-pointer"
          >
            <span>{userState.hasCompletedOnboarding ? 'Re-run Onboarding & Diagnostic' : 'Start Pre-Flight Onboarding'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onEnterDashboard}
            className="w-full sm:w-auto px-6 py-3.5 bg-paper border border-paper-border text-ink font-mono text-sm font-semibold rounded-lg hover:bg-paper-dark shadow-sm flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <span>Enter Dashboard Directly</span>
            <ChevronRight className="w-4 h-4 text-ink-muted" />
          </button>

          <label className="w-full sm:w-auto px-5 py-3.5 bg-paper border border-dashed border-paper-border hover:border-ink-muted text-ink-muted font-mono text-xs rounded-lg flex items-center justify-center space-x-2 cursor-pointer transition">
            <Upload className="w-4 h-4" />
            <span>Load Friend&apos;s Backup</span>
            <input type="file" accept=".json" onChange={onImportBackup} className="hidden" />
          </label>
        </div>

        {/* 100% Local Storage Notice */}
        <div className="mt-5 text-xs font-mono text-ink-muted flex items-center justify-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-tier-must" />
          <span>100% Local-Storage Powered — Zero Login, Zero Cloud Lock-in, Zero Lost Progress.</span>
        </div>
      </div>

      {/* Core Numbers & Statistical Blueprint */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-paper-card border border-paper-border rounded-lg p-4 shadow-sm text-center">
          <div className="text-3xl font-serif font-bold text-ink">1,840</div>
          <div className="text-xs font-mono text-ink-muted mt-1">Questions Analyzed</div>
          <div className="text-[11px] text-ink-light mt-0.5">13 Papers (2008–2026)</div>
        </div>

        <div className="bg-paper-card border border-paper-border rounded-lg p-4 shadow-sm text-center">
          <div className="text-3xl font-serif font-bold text-tier-must">64 Chapters</div>
          <div className="text-xs font-mono text-ink-muted mt-1">Must-Do Core Tier</div>
          <div className="text-[11px] text-tier-must font-semibold mt-0.5">~62.1 Marks in ~185 Hours</div>
        </div>

        <div className="bg-paper-card border border-paper-border rounded-lg p-4 shadow-sm text-center">
          <div className="text-3xl font-serif font-bold text-brand-red">9 Mocks</div>
          <div className="text-xs font-mono text-ink-muted mt-1">Scheduled Rhythm</div>
          <div className="text-[11px] text-ink-light mt-0.5">Mock → Analysis → Fix Day</div>
        </div>

        <div className="bg-paper-card border border-paper-border rounded-lg p-4 shadow-sm text-center">
          <div className="text-3xl font-serif font-bold text-ink">3 Protocols</div>
          <div className="text-xs font-mono text-ink-muted mt-1">Plan A, B, and C</div>
          <div className="text-[11px] text-ink-light mt-0.5">Customized to your daily hours</div>
        </div>
      </div>

      {/* What This Website Actually Does */}
      <div className="bg-paper-card border border-paper-border rounded-xl p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="border-b border-paper-border pb-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-brand-red" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
              What This System Does & Why It Works
            </h2>
          </div>
          <p className="text-xs font-mono text-ink-muted mt-1">
            Engineered around the GATE CSE 2027 90-Day Rescue Plan documentation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="space-y-3 p-4 bg-paper rounded-lg border border-paper-border">
            <div className="w-9 h-9 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-serif font-bold text-base text-ink">
              Pre-Flight Diagnostic
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              36 rapid active-recall checks covering all 12 subjects in 60 minutes. Before studying Day 1, determine exactly where your foundational gaps are and let the system prescribe your optimal daily hours (Plan A, B, or C).
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-3 p-4 bg-paper rounded-lg border border-paper-border">
            <div className="w-9 h-9 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-serif font-bold text-base text-ink">
              Task-First Daily Board
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              No scrolling through overwhelming 90-day grids. Today&apos;s chapter, theory checklist, targeted PYQ count, curated YouTube lectures (with 1.5× playback guidance), and scheduled spaced repetition ($R_1 \to R_5$) load directly at the top.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-3 p-4 bg-paper rounded-lg border border-paper-border">
            <div className="w-9 h-9 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-serif font-bold text-base text-ink">
              9 Mock Analysis Studio
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Scheduled mock calendar from Day 61 to 85. Evaluates 12 subjects, breaks down MCQ/MSQ/NAT accuracy, logs negative marks, classifies errors (Concept vs Silly vs Time vs Risky Guess), and selects the <em>Two Chapters to Fix Tomorrow</em>.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="space-y-3 p-4 bg-paper rounded-lg border border-paper-border">
            <div className="w-9 h-9 rounded bg-red-100 text-red-800 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-serif font-bold text-base text-ink">
              Error Vault & Weak-Topic Log
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              The golden rule of Day 89: <em>&quot;A mistake made in December that you don&apos;t fix is guaranteed to reappear on the first Sunday of February.&quot;</em> Log every missed question, tag it by priority tier, and mark it resolved.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="space-y-3 p-4 bg-paper rounded-lg border border-paper-border">
            <div className="w-9 h-9 rounded bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              5
            </div>
            <h3 className="font-serif font-bold text-base text-ink">
              178-Chapter Skip List
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Every chapter classified into <strong>✅ Must-Do (64)</strong>, <strong>🟡 Basics Only (76)</strong>, or <strong>❌ Skip (38)</strong>. Ranked by Marks per Hour ROI. Never spend 20 hours on a chapter that historically awards 0.3 marks.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="space-y-3 p-4 bg-paper rounded-lg border border-paper-border">
            <div className="w-9 h-9 rounded bg-stone-200 text-stone-800 flex items-center justify-center font-bold">
              6
            </div>
            <h3 className="font-serif font-bold text-base text-ink">
              Zero-Server Local Storage
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Every checkbox, mock mark, and diagnostic tick automatically persists in your browser. Share backup JSON files with friends or transfer seamlessly between laptops with one click.
            </p>
          </div>
        </div>
      </div>

      {/* How They Can Improve Their Results (The 4 Non-Negotiable Rules) */}
      <div className="bg-brand-redLight/30 border border-brand-red/30 rounded-xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-serif font-bold text-brand-redDark flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-brand-red" />
          <span>The 4 Non-Negotiable Rules to Guarantee 65+ Marks</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-ink">
          <div className="bg-paper p-4 rounded-lg border border-paper-border">
            <strong className="text-brand-red font-mono block mb-1">Rule 1: The Catch-Up Guardrail</strong>
            If you miss a day, you may only add <strong>+2 hours/day max</strong> within the week. Never attempt to cram 12 hours in one weekend. If more than 4 hours behind, compress Basics-Only topics rather than dropping Must-Do chapters.
          </div>

          <div className="bg-paper p-4 rounded-lg border border-paper-border">
            <strong className="text-brand-red font-mono block mb-1">Rule 2: Daily General Aptitude Slot</strong>
            GA yields <strong>15 marks</strong> with higher ROI than any technical subject. The plan mandates a dedicated 1-hour GA slot every single day (numerical relations, spatial, comprehension).
          </div>

          <div className="bg-paper p-4 rounded-lg border border-paper-border">
            <strong className="text-brand-red font-mono block mb-1">Rule 3: Spaced Repetition ($R_1 \to R_5$)</strong>
            Memory fades in 48 hours without active recall. Days schedule automatic revision check-ins at Day +3 ($R_1$), Day +7 ($R_2$), Day +14 ($R_3$), Day +30 ($R_4$), and Day +60 ($R_5$).
          </div>

          <div className="bg-paper p-4 rounded-lg border border-paper-border">
            <strong className="text-brand-red font-mono block mb-1">Rule 4: Mock Pathology over Vanity Scores</strong>
            In Mocks 1–9, a score of 42 is not a failure; it is diagnostic gold. Categorize every lost mark: did you lose it to lack of concept, silly arithmetic slip, or time crunch? Fix the two highest-yield leaks the next morning.
          </div>
        </div>
      </div>

      {/* Final Launch CTA */}
      <div className="text-center py-6">
        <button
          onClick={onStartOnboarding}
          className="px-10 py-4 bg-brand-red text-white font-serif font-black text-lg rounded-xl hover:bg-brand-redDark shadow-editorial transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center space-x-3"
        >
          <span>Begin Onboarding & Setup</span>
          <ArrowRight className="w-6 h-6" />
        </button>
        <p className="mt-2 text-xs font-mono text-ink-muted">
          Takes ~3 minutes · Configures your personalized plan, dates, and diagnostic baseline.
        </p>
      </div>

    </div>
  );
};
