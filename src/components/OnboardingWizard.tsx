'use client';

import React, { useState } from 'react';
import { UserState } from '@/lib/storage';
import { diagnosticTest, targetScores } from '@/lib/data';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Target, 
  Calendar, 
  Clock, 
  BookOpen, 
  Award,
  AlertTriangle,
  User,
  GraduationCap,
  Briefcase,
  Zap,
  Check,
  ShieldCheck,
  Flame,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';

interface OnboardingWizardProps {
  userState: UserState;
  onUpdateState: (updater: (prev: UserState) => UserState) => void;
  onComplete: () => void;
  onCancel?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  userState,
  onUpdateState,
  onComplete,
  onCancel,
}) => {
  // Wizard steps: 1: Profile, 2: Diagnostic, 3: Target, 4: Dates, 5: Plan, 6: Summary
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState<string>(userState.userName || '');
  const [status, setStatus] = useState<string>(userState.candidateStatus || 'College Final Year');
  const [dailyHours, setDailyHours] = useState<number>(userState.dailyHours || 4);
  const [targetScore, setTargetScore] = useState<50 | 65 | 80>(userState.targetScore || 65);
  const [startDate, setStartDate] = useState<string>(userState.startDate || new Date().toISOString().split('T')[0]);
  const [targetExamDate, setTargetExamDate] = useState<string>(userState.targetExamDate || '2027-02-06');
  const [activePlan, setActivePlan] = useState<'A' | 'B' | 'C'>(userState.activePlan || 'A');

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

  const handleSelectAllChecks = () => {
    const allChecks: Record<string, boolean> = {};
    diagnosticTest.subjects.forEach(sub => {
      sub.checks.forEach((_, idx) => {
        allChecks[`${sub.code}_${idx}`] = true;
      });
    });
    onUpdateState(prev => ({ ...prev, diagnosticChecks: allChecks }));
  };

  const handleClearAllChecks = () => {
    onUpdateState(prev => ({ ...prev, diagnosticChecks: {} }));
  };

  const totalChecked = Object.values(userState.diagnosticChecks).filter(Boolean).length;

  // Determine system recommended plan based on diagnostic + hours
  let recommendedPlan: 'A' | 'B' | 'C' = 'A';
  let planReason = '';
  if (totalChecked < 12) {
    recommendedPlan = 'C';
    planReason = 'Pre-flight score (<12 ticks) indicates core topic gaps. Plan C (5h/day) builds foundation quickly.';
  } else if (dailyHours >= 8) {
    recommendedPlan = 'B';
    planReason = 'Full-time study capacity (8h/day) with solid diagnostic base. Plan B maximizes PYQ reps.';
  } else {
    recommendedPlan = 'A';
    planReason = 'Standard 4h/day protocol ideal for college students & working aspirants with strong fundamentals.';
  }

  const handleSelectPlan = (plan: 'A' | 'B' | 'C') => {
    setActivePlan(plan);
  };

  const handleNext = () => {
    if (currentStep === 2) {
      setActivePlan(recommendedPlan);
    }
    if (currentStep < 6) {
      setCurrentStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onUpdateState(prev => ({
        ...prev,
        hasCompletedOnboarding: true,
        userName: name.trim() || 'Aspirant',
        candidateStatus: status,
        dailyHours: dailyHours,
        targetScore: targetScore,
        startDate: startDate,
        targetExamDate: targetExamDate,
        activePlan: activePlan,
      }));
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onCancel) {
      onCancel();
    }
  };

  const calculateDaysLeft = () => {
    try {
      const exam = new Date(`${targetExamDate}T09:00:00`);
      const now = new Date();
      const diff = Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(0, diff);
    } catch {
      return 0;
    }
  };

  const daysLeft = calculateDaysLeft();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24 space-y-6 flex-1">
        
        {/* Wizard Header & Stepper Indicator */}
        <div className="bg-paper-card border border-paper-border rounded-xl p-5 sm:p-6 shadow-editorial">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-paper-border">
            
            {/* Title & Badge */}
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-mono font-bold bg-brand-red text-white px-2.5 py-0.5 rounded">
                  STEP {currentStep} OF 6
                </span>
                <h1 className="text-xl sm:text-2xl font-serif font-black text-ink">
                  {currentStep === 1 && 'Candidate Profile & Study Bandwidth'}
                  {currentStep === 2 && 'Pre-Flight Diagnostic Test ("Where Do You Stand?")'}
                  {currentStep === 3 && 'Define Your Target Marks & Score Matrix'}
                  {currentStep === 4 && 'Timeline & Exam Countdown Calendar'}
                  {currentStep === 5 && 'Select Your 90-Day Protocol (A, B, or C)'}
                  {currentStep === 6 && 'Mission Confirmation & Dashboard Launch'}
                </h1>
              </div>
              <p className="text-xs text-ink-muted mt-1 font-mono">
                Empirical GATE CSE 2027 Setup Engine · Calibrating 1,840 question patterns to your available bandwidth
              </p>
            </div>

            {/* TOP DUAL-ACTION CONTROLS (Zero Scroll Required!) */}
            <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleBack}
                className="px-3 py-1.5 bg-paper hover:bg-paper-dark border border-paper-border rounded-lg text-xs font-mono text-ink-muted hover:text-ink transition flex items-center space-x-1 cursor-pointer"
                title={currentStep === 1 ? 'Cancel Setup' : 'Previous Step'}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-1.5 bg-brand-red hover:bg-brand-redDark text-white rounded-lg text-xs font-mono font-bold transition shadow-sm flex items-center space-x-1.5 cursor-pointer"
                title="Proceed to Next Step"
              >
                <span>{currentStep === 6 ? 'Launch 🚀' : 'Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="p-1.5 text-ink-muted hover:text-brand-red rounded-lg hover:bg-paper transition cursor-pointer"
                  title="Close and go to dashboard"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Progress Step Bar */}
          <div className="grid grid-cols-6 gap-2 sm:gap-3 mt-4">
            {[
              { step: 1, name: 'Profile' },
              { step: 2, name: 'Diagnostic' },
              { step: 3, name: 'Target' },
              { step: 4, name: 'Dates' },
              { step: 5, name: 'Protocol' },
              { step: 6, name: 'Launch' },
            ].map(item => (
              <div key={item.step} className="space-y-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    item.step === currentStep 
                      ? 'bg-brand-red' 
                      : item.step < currentStep 
                      ? 'bg-tier-must' 
                      : 'bg-paper-border'
                  }`}
                />
                <span className="hidden sm:block text-[10px] font-mono text-ink-muted text-center">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: CANDIDATE PROFILE */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Profile Form (2 cols) */}
            <div className="lg:col-span-2 bg-paper-card border border-paper-border rounded-xl p-6 sm:p-8 shadow-editorial space-y-6">
              <div className="space-y-1 border-b border-paper-border pb-3">
                <h2 className="font-serif font-black text-xl text-ink">Personalize Your Preparation Strategy</h2>
                <p className="text-xs text-ink-muted">
                  Knowing your current semester/work schedule allows the command center to calibrate realistic daily question targets.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-mono font-bold text-ink uppercase mb-1.5">
                    Your Full Name or Study Alias
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Aryan or GATE Fighter 2027"
                    className="w-full px-4 py-3 bg-paper border border-paper-border rounded-lg text-ink font-sans focus:outline-none focus:border-brand-red text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-ink uppercase mb-2">
                    Academic / Professional Status
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { id: 'College Final Year', label: 'College Final Year (4th Year)', desc: 'Managing major project & placement season.', icon: GraduationCap },
                      { id: 'College 3rd Year', label: 'College 3rd Year (Early Starter)', desc: 'Building comprehensive 2-year foundation.', icon: BookOpen },
                      { id: 'Dropper / Full Time', label: 'Dropper / Dedicated Aspirant', desc: 'Full-time study without semester distractions.', icon: Zap },
                      { id: 'Working Professional', label: 'Working Professional', desc: 'Maximizing early morning & evening study hours.', icon: Briefcase },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setStatus(item.id)}
                          className={`p-4 rounded-xl border text-left flex items-start space-x-3.5 transition cursor-pointer ${
                            status === item.id
                              ? 'border-brand-red bg-brand-redLight/40 text-brand-redDark font-semibold shadow-sm'
                              : 'border-paper-border bg-paper hover:bg-paper-dark text-ink'
                          }`}
                        >
                          <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-serif font-bold">{item.label}</div>
                            <p className="text-xs text-ink-muted mt-1 leading-relaxed">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-ink uppercase mb-2">
                    Available Focused Daily Hours (Excluding Classes & Commutes)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {[
                      { hours: 4, label: '4 Hours / Day', sub: 'Plan A Standard', desc: 'Ideal for college students. Covers 64 Must-Do chapters.' },
                      { hours: 5, label: '5 Hours / Day', sub: 'Plan C Rescue', desc: 'Extra hour for foundational catch-up and active recall.' },
                      { hours: 8, label: '8+ Hours / Day', sub: 'Plan B Intensive', desc: 'Full-time pace. Exhaustive PYQ drills & multiple mocks.' },
                    ].map(item => (
                      <button
                        key={item.hours}
                        type="button"
                        onClick={() => setDailyHours(item.hours)}
                        className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                          dailyHours === item.hours
                            ? 'border-brand-red bg-brand-redLight/40 text-brand-redDark font-bold shadow-sm'
                            : 'border-paper-border bg-paper hover:bg-paper-dark text-ink'
                        }`}
                      >
                        <div className="text-base font-serif font-bold">{item.label}</div>
                        <div className="text-xs font-mono text-tier-must font-semibold mt-0.5">{item.sub}</div>
                        <p className="text-[11px] text-ink-muted mt-2 leading-relaxed">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Guidance Column */}
            <div className="bg-paper-card border border-paper-border rounded-xl p-6 shadow-editorial space-y-4">
              <h3 className="font-serif font-bold text-base text-ink flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-brand-red" />
                <span>Rescue Plan Guardrails</span>
              </h3>

              <div className="space-y-3.5 text-xs text-ink-muted">
                <div className="p-3 bg-paper rounded-lg border border-paper-border space-y-1">
                  <strong className="text-ink block font-mono text-[11px]">The +2h/day Limit</strong>
                  <p>Never try to cram 14 hours in one Sunday. Missed hours are limited to +2h per weekday within the week.</p>
                </div>

                <div className="p-3 bg-paper rounded-lg border border-paper-border space-y-1">
                  <strong className="text-ink block font-mono text-[11px]">Daily 1-Hour GA Slot</strong>
                  <p>General Aptitude yields 15 marks. The 90-day plan allocates a mandatory 1-hour slot every single day.</p>
                </div>

                <div className="p-3 bg-paper rounded-lg border border-paper-border space-y-1">
                  <strong className="text-ink block font-mono text-[11px]">Spaced Repetition ($R_1 \to R_5$)</strong>
                  <p>Automatic revisions scheduled at +3d, +7d, +14d, +30d, and +60d to lock concepts into long-term memory.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: PRE-FLIGHT DIAGNOSTIC (WIDE SCREEN 4-COLUMN MATRIX) */}
        {currentStep === 2 && (
          <div className="bg-paper-card border border-paper-border rounded-xl p-6 sm:p-8 shadow-editorial space-y-6">
            
            {/* Top Wide Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-paper-border pb-5">
              <div>
                <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                  <span className="text-2xl font-serif font-black text-ink">
                    Where Do You Stand? (Diagnostic Test)
                  </span>
                  <span className="text-xs bg-brand-red text-white font-mono px-2.5 py-0.5 rounded font-bold">
                    Part 1 · Page 8 · 60 Mins
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-1.5 leading-relaxed max-w-3xl">
                  &ldquo;Five minutes a subject, an hour in all, before Day 1. For each chapter below, write down from memory the main method/formula and question pattern. <strong className="text-ink font-semibold">Tick only if you could do it without looking.</strong>&rdquo;
                </p>
              </div>

              {/* Score & Batch Action Buttons */}
              <div className="flex items-center space-x-3 self-start lg:self-auto shrink-0">
                <div className="bg-paper px-4 py-2.5 rounded-lg border border-paper-border text-center">
                  <span className="text-[10px] font-mono text-ink-muted uppercase block">Ticks Score</span>
                  <span className="text-2xl font-serif font-black text-ink">{totalChecked} / 36</span>
                </div>

                <div className="flex flex-col space-y-1 text-xs font-mono">
                  <button
                    type="button"
                    onClick={handleSelectAllChecks}
                    className="px-2.5 py-1 bg-paper hover:bg-paper-dark border border-paper-border rounded text-[11px] text-ink cursor-pointer"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllChecks}
                    className="px-2.5 py-1 bg-paper hover:bg-paper-dark border border-paper-border rounded text-[11px] text-ink-muted hover:text-ink cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Diagnostic Recommendation Alert */}
            <div className="p-3.5 bg-brand-redLight/50 border border-brand-red/30 rounded-lg flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-brand-red shrink-0" />
                <span>
                  <strong>System Diagnostic Result: </strong>
                  {totalChecked < 12 
                    ? 'Foundational gaps (<12 ticks). Plan C (5h/day) recommended to rebuild essentials.' 
                    : totalChecked <= 24 
                    ? 'Strong baseline (12–24 ticks). Plan A (4h/day) or Plan B (8h/day) recommended.' 
                    : 'Advanced competence (>24 ticks). Fast-track straight into PYQ drills and Mock Sprint!'}
                </span>
              </div>
              <span className="font-bold text-brand-red text-sm shrink-0">
                Plan {recommendedPlan} Recommended
              </span>
            </div>

            {/* Expansive 4-Column Subject Matrix Across Full Screen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {diagnosticTest.subjects.map(subject => (
                <div key={subject.code} className="bg-paper p-4 rounded-xl border border-paper-border space-y-2.5 hover:border-ink-muted transition">
                  <div className="flex items-center justify-between border-b border-paper-border pb-2">
                    <span className="font-serif font-bold text-sm text-ink">{subject.name}</span>
                    <span className="font-mono text-[10px] bg-paper-dark px-2 py-0.5 rounded text-ink-muted font-bold">
                      {subject.code}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {subject.checks.map((chk, idx) => {
                      const key = `${subject.code}_${idx}`;
                      const isChecked = !!userState.diagnosticChecks[key];
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleCheck(subject.code, idx)}
                          className={`w-full text-left p-2.5 rounded-lg flex items-start space-x-2 text-xs transition cursor-pointer ${
                            isChecked 
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium' 
                              : 'hover:bg-paper-dark text-ink'
                          }`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-tier-must shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-ink-muted shrink-0 mt-0.5" />
                          )}
                          <span className="leading-snug break-words">{chk}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* STEP 3: TARGET & AIM MARKS */}
        {currentStep === 3 && (
          <div className="bg-paper-card border border-paper-border rounded-xl p-6 sm:p-8 shadow-editorial space-y-6">
            <div className="space-y-1 border-b border-paper-border pb-3">
              <h2 className="font-serif font-black text-xl text-ink">Select Your Target Marks & College Tier</h2>
              <p className="text-xs text-ink-muted">
                Select the score you are aiming for. The system will benchmark your mock tests and daily coverage against this goal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  score: 50 as const,
                  title: 'Target 50 (Qualifying & Safe)',
                  desc: 'Qualifying with solid margin. State Tier-1 colleges, good NITs, and campus M.Tech sponsorship.',
                  color: 'border-blue-300 bg-blue-50/40 text-blue-900',
                },
                {
                  score: 65 as const,
                  title: 'Target 65 (Old IITs & Top NITs)',
                  badge: 'Recommended',
                  desc: 'Top Old IIT cutoffs (IIT Bombay, Madras, Kharagpur, Kanpur) and direct PSU interview shortlists.',
                  color: 'border-brand-red bg-brand-redLight/40 text-brand-redDark',
                },
                {
                  score: 80 as const,
                  title: 'Target 80+ (Top 100 AIR & PSUs)',
                  desc: 'All-India Rank < 100. Direct entry into IISc Bangalore, IIT Bombay CSE, and direct PSU appointments.',
                  color: 'border-purple-300 bg-purple-50/40 text-purple-900',
                },
              ].map(tier => (
                <button
                  key={tier.score}
                  type="button"
                  onClick={() => setTargetScore(tier.score)}
                  className={`p-5 rounded-xl border-2 text-left transition relative cursor-pointer ${
                    targetScore === tier.score 
                      ? tier.color + ' shadow-md' 
                      : 'border-paper-border bg-paper hover:bg-paper-dark text-ink'
                  }`}
                >
                  {tier.badge && (
                    <span className="absolute -top-2.5 right-4 bg-brand-red text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                      {tier.badge}
                    </span>
                  )}
                  <div className="text-2xl font-serif font-black">{tier.score} Marks</div>
                  <div className="font-bold text-sm mt-1">{tier.title}</div>
                  <p className="text-xs text-ink-muted mt-2 leading-relaxed">{tier.desc}</p>
                </button>
              ))}
            </div>

            {/* Full-Width 12-Subject Score Breakdown Grid */}
            <div className="bg-paper p-5 rounded-xl border border-paper-border space-y-3">
              <span className="text-xs font-mono font-bold text-ink uppercase block">
                12-Subject Target Score Blueprint for {targetScore} Marks
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 text-xs font-mono">
                {targetScores.subjects.map(s => (
                  <div key={s.code} className="p-3 bg-paper-card border border-paper-border rounded-lg text-center">
                    <div className="text-ink-muted text-[10px] font-bold">{s.code}</div>
                    <div className="text-brand-red font-bold text-base mt-0.5">
                      {targetScore === 50 ? s.aim_50 : targetScore === 65 ? s.aim_65 : s.aim_80}m
                    </div>
                    <div className="text-[9px] text-ink-muted">avg: {s.avg_marks}m</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: TIMELINE & CALENDAR */}
        {currentStep === 4 && (
          <div className="bg-paper-card border border-paper-border rounded-xl p-6 sm:p-8 shadow-editorial space-y-6">
            <div className="space-y-1 border-b border-paper-border pb-3">
              <h2 className="font-serif font-black text-xl text-ink">Set Your Schedule & Target Exam Date</h2>
              <p className="text-xs text-ink-muted">
                The 90-day protocol maps dynamically to your calendar dates so you know what is expected on every single day.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-paper p-6 rounded-xl border border-paper-border space-y-3">
                <label className="block text-xs font-mono font-bold text-ink uppercase">
                  Preparation Start Date (Day 1)
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-paper-card border border-paper-border rounded-lg font-mono text-sm text-ink focus:outline-none focus:border-brand-red"
                />
                <p className="text-xs text-ink-muted">
                  Defaults to today. If you started earlier or plan to kick off on Monday, set it here.
                </p>
              </div>

              <div className="bg-paper p-6 rounded-xl border border-paper-border space-y-3">
                <label className="block text-xs font-mono font-bold text-ink uppercase">
                  Target GATE Exam Date
                </label>
                <input
                  type="date"
                  value={targetExamDate}
                  onChange={e => setTargetExamDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-paper-card border border-paper-border rounded-lg font-mono text-sm text-ink focus:outline-none focus:border-brand-red"
                />
                <p className="text-xs text-ink-muted">
                  GATE CSE 2027 is traditionally on the 1st/2nd weekend of Feb 2027 (Feb 6, 2027).
                </p>
              </div>
            </div>

            {/* Days Remaining Banner */}
            <div className="p-5 bg-paper-dark border border-paper-border rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-brand-red" />
                <div>
                  <span className="text-sm font-mono font-bold text-ink">Days Remaining to Target Exam:</span>
                  <p className="text-xs text-ink-muted">
                    You have <strong className="text-ink font-semibold">{daysLeft} calendar days</strong> until your target exam date.
                  </p>
                </div>
              </div>
              <div className="text-3xl font-serif font-black text-brand-red">{daysLeft} Days</div>
            </div>
          </div>
        )}

        {/* STEP 5: SELECT PLAN */}
        {currentStep === 5 && (
          <div className="bg-paper-card border border-paper-border rounded-xl p-6 sm:p-8 shadow-editorial space-y-6">
            <div className="space-y-1 border-b border-paper-border pb-3">
              <h2 className="font-serif font-black text-xl text-ink">Select Your 90-Day Execution Protocol</h2>
              <p className="text-xs text-ink-muted">
                Choose the execution plan that fits your diagnostic score and available daily study time.
              </p>
            </div>

            <div className="p-3.5 bg-brand-redLight/50 border border-brand-red/30 rounded-lg flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-red shrink-0" />
                <span>
                  <strong>System Recommendation: Plan {recommendedPlan}</strong> — {planReason}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  code: 'A' as const,
                  title: 'Plan A (Standard)',
                  hours: '~4 Hours / Day',
                  focus: '64 Must-Do Chapters + 12-Year PYQ',
                  desc: 'Balanced protocol designed for college students and working professionals. Zero burnout, maximum ROI.',
                  badge: recommendedPlan === 'A' ? 'Recommended for you' : undefined,
                },
                {
                  code: 'B' as const,
                  title: 'Plan B (Intensive)',
                  hours: '~8 Hours / Day',
                  focus: 'Must-Do + Basics-Only + Deep Mock Rhythm',
                  desc: 'Full-time study protocol for droppers or dedicated prep months. Double daily question targets and fast-paced mastery.',
                  badge: recommendedPlan === 'B' ? 'Recommended for you' : undefined,
                },
                {
                  code: 'C' as const,
                  title: 'Plan C (Rescue & Catch-Up)',
                  hours: '~5 Hours / Day',
                  focus: 'Core Foundations + Must-Do High ROI',
                  desc: 'Built specifically for candidates starting with foundational gaps (<12 ticks). Eliminates low-yield topics early.',
                  badge: recommendedPlan === 'C' ? 'Recommended for you' : undefined,
                },
              ].map(plan => (
                <button
                  key={plan.code}
                  type="button"
                  onClick={() => handleSelectPlan(plan.code)}
                  className={`p-5 rounded-xl border-2 text-left transition relative cursor-pointer ${
                    activePlan === plan.code 
                      ? 'border-brand-red bg-brand-redLight/40 text-brand-redDark shadow-md' 
                      : 'border-paper-border bg-paper hover:bg-paper-dark text-ink'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-2.5 right-4 bg-brand-red text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                      {plan.badge}
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif font-black">Plan {plan.code}</span>
                    <span className="text-xs font-mono font-bold bg-paper px-2 py-0.5 rounded border border-paper-border">{plan.hours}</span>
                  </div>
                  <div className="font-bold text-sm mt-1 text-ink">{plan.title}</div>
                  <div className="text-xs font-mono text-tier-must font-semibold mt-1">{plan.focus}</div>
                  <p className="text-xs text-ink-muted mt-2 leading-relaxed">{plan.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: CONFIRMATION & LAUNCH */}
        {currentStep === 6 && (
          <div className="bg-paper-card border-2 border-brand-red/30 rounded-xl p-8 sm:p-10 shadow-editorial space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-ink">
                Command Center Initialized, {name.trim() || 'Aspirant'}!
              </h2>
              <p className="text-sm text-ink-muted max-w-xl mx-auto">
                Your personalized GATE Command Center is locked in. Every daily task, mock analysis, and formula revision will be tracked and saved in your browser.
              </p>
            </div>

            {/* Wide Summary Matrix */}
            <div className="bg-paper p-6 rounded-xl border border-paper-border text-left grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-mono max-w-4xl mx-auto">
              <div>
                <span className="text-ink-muted text-[10px] uppercase block">Protocol Plan</span>
                <span className="text-lg font-serif font-bold text-ink">Plan {activePlan} ({dailyHours}h/day)</span>
              </div>
              <div>
                <span className="text-ink-muted text-[10px] uppercase block">Target Aim</span>
                <span className="text-lg font-serif font-bold text-brand-red">{targetScore} Marks</span>
              </div>
              <div>
                <span className="text-ink-muted text-[10px] uppercase block">Diagnostic Score</span>
                <span className="text-lg font-serif font-bold text-tier-must">{totalChecked} / 36 Ticks</span>
              </div>
              <div>
                <span className="text-ink-muted text-[10px] uppercase block">Days to Exam</span>
                <span className="text-lg font-serif font-bold text-ink">{daysLeft} Days</span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-mono inline-flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Local Storage Active · You can export your progress or share backups with friends anytime!</span>
            </div>
          </div>
        )}

      </div>

      {/* PERMANENT STICKY BOTTOM ACTION BAR (ALWAYS VISIBLE - NEVER SCROLL TO ADVANCE!) */}
      <div className="sticky bottom-0 z-40 bg-paper/95 backdrop-blur-md border-t-2 border-paper-border py-3.5 px-4 sm:px-6 lg:px-8 shadow-[0_-8px_24px_rgba(22,23,29,0.08)]">
        <div className="max-w-[1500px] w-full mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Previous Step or Cancel */}
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-2.5 bg-paper hover:bg-paper-dark border border-paper-border rounded-lg text-xs font-mono font-bold text-ink transition flex items-center space-x-2 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Cancel Setup' : 'Previous Step'}</span>
          </button>

          {/* Center: Live Step & Parameter Context */}
          <div className="hidden sm:flex items-center space-x-3 text-xs font-mono">
            <span className="text-ink-muted">Step {currentStep} of 6:</span>
            <span className="font-bold text-ink">
              {currentStep === 1 && (name ? `Candidate: ${name}` : 'Configuring Profile')}
              {currentStep === 2 && `${totalChecked} / 36 Diagnostic Ticks`}
              {currentStep === 3 && `Target ${targetScore} Marks Selected`}
              {currentStep === 4 && `${daysLeft} Days to GATE`}
              {currentStep === 5 && `Plan ${activePlan} Selected`}
              {currentStep === 6 && 'Ready to Launch'}
            </span>
          </div>

          {/* Right: Primary Next Step or Launch */}
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-2.5 bg-brand-red hover:bg-brand-redDark text-white rounded-lg text-xs font-mono font-bold transition shadow-editorial flex items-center space-x-2 cursor-pointer transform active:scale-95"
          >
            <span>{currentStep === 6 ? 'Launch My Command Center 🚀' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
};
