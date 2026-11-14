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
  Check
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

  // Pre-select recommended plan if user hasn't explicitly chosen yet
  const handleSelectPlan = (plan: 'A' | 'B' | 'C') => {
    setActivePlan(plan);
  };

  const handleNext = () => {
    if (currentStep === 2) {
      // Diagnostic finished, auto-suggest plan
      setActivePlan(recommendedPlan);
    }
    if (currentStep < 6) {
      setCurrentStep(s => s + 1);
    } else {
      // Finalize and save
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
    } else if (onCancel) {
      onCancel();
    }
  };

  // Calculate days remaining to target exam
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Wizard Header & Stepper Indicator */}
      <div className="bg-paper-card border border-paper-border rounded-xl p-6 shadow-editorial mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-paper-border">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold bg-brand-red text-white px-2 py-0.5 rounded">
                STEP {currentStep} OF 6
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
                {currentStep === 1 && 'Candidate Profile & Availability'}
                {currentStep === 2 && 'Pre-Flight Diagnostic Test'}
                {currentStep === 3 && 'Define Your Aim Marks'}
                {currentStep === 4 && 'Preparation Timeline & Calendar'}
                {currentStep === 5 && 'Select Your 90-Day Protocol'}
                {currentStep === 6 && 'Mission Confirmation & Launch'}
              </h2>
            </div>
            <p className="text-xs text-ink-muted mt-1 font-mono">
              Customizing your GATE CSE preparation protocol based on the 90-Day Rescue Plan
            </p>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs font-mono text-ink-muted hover:text-ink self-start sm:self-auto cursor-pointer"
            >
              Skip to Dashboard ✕
            </button>
          )}
        </div>

        {/* Progress Dots */}
        <div className="grid grid-cols-6 gap-2 mt-4">
          {[1, 2, 3, 4, 5, 6].map(step => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all ${
                step === currentStep 
                  ? 'bg-brand-red' 
                  : step < currentStep 
                  ? 'bg-tier-must' 
                  : 'bg-paper-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: CANDIDATE PROFILE */}
      {currentStep === 1 && (
        <div className="bg-paper-card border border-paper-border rounded-xl p-6 sm:p-8 shadow-editorial space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-ink">Let&apos;s personalize your Command Center</h3>
            <p className="text-xs text-ink-muted">
              Knowing your daily commitments helps us prevent burnout and enforce the +2h/day catch-up guardrail.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-ink uppercase mb-1">
                Your Name / Study Alias
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Aryan or GATE Fighter"
                className="w-full px-4 py-2.5 bg-paper border border-paper-border rounded-lg text-ink font-sans focus:outline-none focus:border-brand-red text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-ink uppercase mb-2">
                Current Academic / Professional Status
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'College Final Year', label: 'College Final Year (4th Year)', icon: GraduationCap },
                  { id: 'College 3rd Year', label: 'College 3rd Year (Early Prep)', icon: BookOpen },
                  { id: 'Dropper / Full Time', label: 'Dropper / Full-Time Aspirant', icon: Zap },
                  { id: 'Working Professional', label: 'Working Professional', icon: Briefcase },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStatus(item.id)}
                      className={`p-3 rounded-lg border text-left flex items-center space-x-3 transition cursor-pointer ${
                        status === item.id
                          ? 'border-brand-red bg-brand-redLight/40 text-brand-redDark font-semibold shadow-sm'
                          : 'border-paper-border bg-paper hover:bg-paper-dark text-ink'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-ink uppercase mb-2">
                Available Focused Hours Per Day (Excluding College / Office)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { hours: 4, label: '4 Hours / Day', sub: 'Plan A Standard' },
                  { hours: 5, label: '5 Hours / Day', sub: 'Plan C Catch-Up' },
                  { hours: 8, label: '8+ Hours / Day', sub: 'Plan B Full-Time' },
                ].map(item => (
                  <button
                    key={item.hours}
                    type="button"
                    onClick={() => setDailyHours(item.hours)}
                    className={`p-3 rounded-lg border text-center transition cursor-pointer ${
                      dailyHours === item.hours
                        ? 'border-brand-red bg-brand-redLight/40 text-brand-redDark font-bold shadow-sm'
                        : 'border-paper-border bg-paper hover:bg-paper-dark text-ink'
                    }`}
                  >
                    <div className="text-sm font-mono">{item.label}</div>
                    <div className="text-[10px] text-ink-muted mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PRE-FLIGHT DIAGNOSTIC ("Where Do You Stand?") */}
      {currentStep === 2 && (
        <div className="bg-paper-card border border-paper-border rounded-xl p-6 sm:p-8 shadow-editorial space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-paper-border pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-serif font-bold text-ink">
                  Where Do You Stand? (Active-Recall Diagnostic)
                </span>
                <span className="text-[10px] bg-brand-red text-white font-mono px-2 py-0.5 rounded font-bold">
                  Page 8 · 60 Mins
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                &ldquo;For each chapter below, write down from memory the main method/formula and question pattern. 
                <strong className="text-ink"> Tick only if you could do it without looking.</strong>&rdquo;
              </p>
            </div>

            <div className="bg-paper px-4 py-2 rounded-lg border border-paper-border text-center shrink-0">
              <span className="text-[10px] font-mono text-ink-muted uppercase block">Ticks Score</span>
              <span className="text-2xl font-serif font-black text-ink">{totalChecked} / 36</span>
            </div>
          </div>

          {/* Diagnostic Recommendation Alert */}
          <div className="p-3 bg-brand-redLight border border-brand-red/30 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-red shrink-0" />
              <span>
                <strong>System Analysis: </strong>
                {totalChecked < 12 
                  ? 'Foundational gaps identified (<12 ticks). Plan C (5h/day) recommended to rebuild core.' 
                  : totalChecked <= 24 
                  ? 'Strong foundational baseline (12–24 ticks). Plan A (4h/day) or Plan B recommended.' 
                  : 'Advanced mastery (>24 ticks). Fast-track straight into PYQ intensive!'}
              </span>
            </div>
          </div>

          {/* Diagnostic Checks by Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-2">
            {diagnosticTest.subjects.map(subject => (
              <div key={subject.code} className="bg-paper p-3.5 rounded-lg border border-paper-border space-y-2">
                <div className="flex items-center justify-between border-b border-paper-border pb-1.5">
                  <span className="font-serif font-bold text-xs text-ink">{subject.name}</span>
                  <span className="font-mono text-[10px] bg-paper-dark px-1.5 py-0.5 rounded text-ink-muted font-bold">
                    {subject.code}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {subject.checks.map((chk, idx) => {
                    const key = `${subject.code}_${idx}`;
                    const isChecked = !!userState.diagnosticChecks[key];
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleCheck(subject.code, idx)}
                        className={`w-full text-left p-2 rounded flex items-start space-x-2 text-xs transition cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                            : 'hover:bg-paper-dark text-ink'
                        }`}
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-tier-must shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-ink-muted shrink-0 mt-0.5" />
                        )}
                        <span className="leading-tight">{chk}</span>
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
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-ink">Choose Your Target Marks</h3>
            <p className="text-xs text-ink-muted">
              Select the score you are aiming for. The system will benchmark your mock tests and daily coverage against this goal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className={`p-4 rounded-xl border-2 text-left transition relative cursor-pointer ${
                  targetScore === tier.score 
                    ? tier.color + ' shadow-md' 
                    : 'border-paper-border bg-paper hover:bg-paper-dark text-ink'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-2.5 right-3 bg-brand-red text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                    {tier.badge}
                  </span>
                )}
                <div className="text-xl font-serif font-black">{tier.score} Marks</div>
                <div className="font-bold text-xs mt-1">{tier.title}</div>
                <p className="text-xs text-ink-muted mt-2 leading-relaxed">{tier.desc}</p>
              </button>
            ))}
          </div>

          {/* Target Score Breakdown Preview Table */}
          <div className="bg-paper p-4 rounded-lg border border-paper-border space-y-2">
            <span className="text-xs font-mono font-bold text-ink uppercase">
              Target Breakdown by Subject (Aiming for {targetScore} Marks)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs font-mono">
              {targetScores.subjects.map(s => (
                <div key={s.code} className="p-2 bg-paper-card border border-paper-border rounded text-center">
                  <div className="text-ink-muted text-[10px] font-bold">{s.code}</div>
                  <div className="text-ink font-bold text-sm">
                    {targetScore === 50 ? s.aim_50 : targetScore === 65 ? s.aim_65 : s.aim_80}m
                  </div>
                  <div className="text-[9px] text-ink-muted">avg: {s.avg_marks}m</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: TIMELINE & DATES */}
      {currentStep === 4 && (
        <div className="bg-paper-card border border-paper-border rounded-xl p-6 sm:p-8 shadow-editorial space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-ink">Set Your Schedule & Target Exam Date</h3>
            <p className="text-xs text-ink-muted">
              The 90-day protocol maps dynamically to your calendar dates so you know what is expected on every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-paper p-5 rounded-lg border border-paper-border space-y-3">
              <label className="block text-xs font-mono font-bold text-ink uppercase">
                Preparation Start Date (Day 1)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-paper-card border border-paper-border rounded font-mono text-sm text-ink focus:outline-none focus:border-brand-red"
              />
              <p className="text-[11px] text-ink-muted">
                Defaults to today. If you started earlier or plan to kick off on Monday, set it here.
              </p>
            </div>

            <div className="bg-paper p-5 rounded-lg border border-paper-border space-y-3">
              <label className="block text-xs font-mono font-bold text-ink uppercase">
                Target GATE Exam Date
              </label>
              <input
                type="date"
                value={targetExamDate}
                onChange={e => setTargetExamDate(e.target.value)}
                className="w-full px-3 py-2 bg-paper-card border border-paper-border rounded font-mono text-sm text-ink focus:outline-none focus:border-brand-red"
              />
              <p className="text-[11px] text-ink-muted">
                GATE CSE 2027 is traditionally on the 1st/2nd weekend of Feb 2027 (Feb 6, 2027).
              </p>
            </div>
          </div>

          {/* Days Remaining Banner */}
          <div className="p-4 bg-paper-dark border border-paper-border rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-brand-red" />
              <div>
                <span className="text-xs font-mono font-bold text-ink">Days Remaining to Target Exam:</span>
                <p className="text-[11px] text-ink-muted">
                  You have <strong className="text-ink">{daysLeft} calendar days</strong> until your target exam date.
                </p>
              </div>
            </div>
            <div className="text-2xl font-serif font-black text-brand-red">{daysLeft} Days</div>
          </div>
        </div>
      )}

      {/* STEP 5: SELECT PLAN */}
      {currentStep === 5 && (
        <div className="bg-paper-card border border-paper-border rounded-xl p-6 sm:p-8 shadow-editorial space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-ink">Select Your 90-Day Protocol</h3>
            <p className="text-xs text-ink-muted">
              Choose the execution plan that fits your diagnostic score and available daily study time.
            </p>
          </div>

          {/* Recommendation Banner */}
          <div className="p-3 bg-brand-redLight border border-brand-red/30 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-red shrink-0" />
              <span>
                <strong>System Recommendation: Plan {recommendedPlan}</strong> — {planReason}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className={`p-4 rounded-xl border-2 text-left transition relative cursor-pointer ${
                  activePlan === plan.code 
                    ? 'border-brand-red bg-brand-redLight/40 text-brand-redDark shadow-md' 
                    : 'border-paper-border bg-paper hover:bg-paper-dark text-ink'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 right-3 bg-brand-red text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                    {plan.badge}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-serif font-black">Plan {plan.code}</span>
                  <span className="text-xs font-mono font-bold">{plan.hours}</span>
                </div>
                <div className="font-bold text-xs mt-1 text-ink">{plan.title}</div>
                <div className="text-[11px] font-mono text-tier-must font-semibold mt-1">{plan.focus}</div>
                <p className="text-xs text-ink-muted mt-2 leading-relaxed">{plan.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 6: CONFIRMATION & LAUNCH */}
      {currentStep === 6 && (
        <div className="bg-paper-card border-2 border-brand-red/30 rounded-xl p-6 sm:p-8 shadow-editorial space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-red text-white flex items-center justify-center mx-auto shadow-md">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-ink">
              All Systems Ready, {name.trim() || 'Aspirant'}!
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted max-w-lg mx-auto">
              Your personalized GATE Command Center is locked in. Every daily task, mock analysis, and formula revision will be tracked and saved in your browser.
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-paper p-5 rounded-lg border border-paper-border text-left grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono max-w-2xl mx-auto">
            <div>
              <span className="text-ink-muted text-[10px] uppercase block">Protocol Plan</span>
              <span className="text-base font-serif font-bold text-ink">Plan {activePlan} ({dailyHours}h/day)</span>
            </div>
            <div>
              <span className="text-ink-muted text-[10px] uppercase block">Target Aim</span>
              <span className="text-base font-serif font-bold text-brand-red">{targetScore} Marks</span>
            </div>
            <div>
              <span className="text-ink-muted text-[10px] uppercase block">Diagnostic Score</span>
              <span className="text-base font-serif font-bold text-tier-must">{totalChecked} / 36</span>
            </div>
            <div>
              <span className="text-ink-muted text-[10px] uppercase block">Days to Exam</span>
              <span className="text-base font-serif font-bold text-ink">{daysLeft} Days</span>
            </div>
          </div>

          {/* Local Storage Reassurance */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-mono inline-flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Local Storage Active · You can export your progress or share backups with friends anytime!</span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-paper-border mt-6">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 border border-paper-border rounded-lg text-xs font-mono text-ink-muted hover:text-ink hover:bg-paper-dark transition flex items-center space-x-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentStep === 1 ? 'Cancel' : 'Previous Step'}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 bg-brand-red text-white rounded-lg text-xs font-mono font-bold hover:bg-brand-redDark transition shadow-editorial flex items-center space-x-2 cursor-pointer"
        >
          <span>{currentStep === 6 ? 'Launch My Command Center 🚀' : 'Next Step'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
