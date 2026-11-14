'use client';

import React, { useState } from 'react';
import { UserState, exportUserStateJson, getDaysRemaining } from '@/lib/storage';
import { 
  Calendar, 
  Flame, 
  Target, 
  Clock, 
  Download, 
  Upload, 
  BookOpen, 
  CheckCircle2,
  Sparkles,
  Settings,
  User,
  Award,
  Zap,
  Info,
  CalendarDays
} from 'lucide-react';

interface HeaderProps {
  userState: UserState;
  onUpdateState: (updater: (prev: UserState) => UserState) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenOverview: () => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userState,
  onUpdateState,
  activeTab,
  onSelectTab,
  onOpenOverview,
  onOpenOnboarding,
}) => {
  const daysRemaining = getDaysRemaining(userState.targetExamDate);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  
  // Calculate completed count
  const completedDaysCount = Object.values(userState.completedDays).filter(Boolean).length;
  
  // Streak calculation (consecutive completed days ending around current day)
  let streak = 0;
  for (let d = userState.currentDay; d >= 1; d--) {
    if (userState.completedDays[d]) {
      streak++;
    } else if (d < userState.currentDay) {
      break;
    }
  }

  const handlePlanChange = (plan: 'A' | 'B' | 'C') => {
    onUpdateState(prev => ({
      ...prev,
      activePlan: plan,
    }));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateState(prev => ({
      ...prev,
      startDate: e.target.value,
    }));
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onUpdateState(() => parsed);
        alert('All progress & data restored successfully from backup!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  // Formatted start date for clean display
  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <header className="border-b border-paper-border bg-paper-light sticky top-0 z-40 shadow-editorial w-full">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ROW 1: BRAND, CORE METRICS, & ACTIONS */}
        <div className="py-2.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-paper-border/60">
          
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3 shrink-0">
            <button 
              onClick={onOpenOverview} 
              className="w-9 h-9 rounded bg-brand-red text-white flex items-center justify-center font-serif font-black text-lg shadow-sm hover:bg-brand-redDark transition cursor-pointer"
              title="View 90-Day Statistical System Blueprint"
            >
              90
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenOverview}
                  className="text-lg font-serif font-black tracking-tight text-ink hover:text-brand-red transition text-left cursor-pointer"
                >
                  GATE Command Center
                </button>
                <span className="text-[11px] bg-ink text-paper px-1.5 py-0.5 rounded font-mono font-bold">
                  2027
                </span>
                {userState.userName && (
                  <span className="inline-flex items-center space-x-1 text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
                    <User className="w-3 h-3 text-emerald-600" />
                    <span>{userState.userName}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-ink-muted">
                <span>90-Day Rescue Plan · 1,840 Questions Analyzed</span>
                <span className="text-ink-muted/50">•</span>
                <button
                  onClick={onOpenOverview}
                  className="text-brand-red hover:underline font-mono cursor-pointer flex items-center space-x-0.5"
                >
                  <span>Why this works</span>
                </button>
              </div>
            </div>
          </div>

          {/* Vitals Pills & Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            {/* Exam Countdown */}
            <div className="flex items-center space-x-1.5 bg-paper-card border border-paper-border px-2.5 py-1 rounded-md shadow-sm">
              <Clock className="w-3.5 h-3.5 text-brand-red" />
              <span className="text-ink-muted font-medium">Exam:</span>
              <span className="font-mono font-bold text-ink">{daysRemaining}d</span>
            </div>

            {/* Streak */}
            <div className="flex items-center space-x-1.5 bg-paper-card border border-paper-border px-2.5 py-1 rounded-md shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-ink-muted font-medium">Streak:</span>
              <span className="font-mono font-bold text-ink">{streak}d</span>
            </div>

            {/* Days Done */}
            <div className="flex items-center space-x-1.5 bg-paper-card border border-paper-border px-2.5 py-1 rounded-md shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-tier-must" />
              <span className="text-ink-muted font-medium">Done:</span>
              <span className="font-mono font-bold text-ink">{completedDaysCount} / 90</span>
            </div>

            {/* Aim Score Selector */}
            <div className="flex items-center space-x-1.5 bg-paper-card border border-paper-border px-2.5 py-1 rounded-md shadow-sm">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-ink-muted font-medium">Aim:</span>
              <select
                value={userState.targetScore}
                onChange={(e) => onUpdateState(p => ({ ...p, targetScore: Number(e.target.value) as 50 | 65 | 80 }))}
                className="bg-transparent font-mono font-bold text-ink focus:outline-none cursor-pointer text-xs pr-1"
                title="Target Score Aim"
              >
                <option value={50}>50m (Safe)</option>
                <option value={65}>65m (IITs)</option>
                <option value={80}>80+m (AIR &lt; 100)</option>
              </select>
            </div>

            {/* Setup / Onboarding Button (with Diagnostic) */}
            <button
              onClick={onOpenOnboarding}
              className="px-2.5 py-1 bg-paper-card border border-paper-border hover:border-brand-red hover:text-brand-red rounded-md transition text-ink font-mono text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm"
              title="Re-run Diagnostic & Onboarding Setup"
            >
              <Settings className="w-3.5 h-3.5 text-brand-red" />
              <span className="font-semibold">Setup / Diagnostic</span>
            </button>

            {/* Export / Import Progress */}
            <div className="flex items-center space-x-1 bg-paper-card border border-paper-border rounded-md p-0.5 shadow-sm">
              <button
                onClick={() => exportUserStateJson(userState)}
                title="Export Progress Backup (JSON) to transfer between laptops"
                className="p-1 hover:bg-paper-dark rounded transition text-ink-muted hover:text-ink cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <label 
                title="Import Backup (JSON)"
                className="p-1 hover:bg-paper-dark rounded transition text-ink-muted hover:text-ink cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
              </label>
            </div>

          </div>

        </div>

        {/* ROW 2: CLEAN NAVIGATION TABS & PLAN SELECTOR */}
        <div className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          
          {/* Navigation Tabs (Diagnostic moved to Onboarding/Setup as requested) */}
          <nav className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar scrollbar-none py-0.5">
            {[
              { id: 'daily', label: 'Daily Tracker', icon: Calendar },
              { id: 'mocks', label: '9 Mock Hub', badge: '9 Mocks', icon: Target },
              { id: 'weak-topics', label: 'Error Vault', badge: userState.weakTopics.filter(w => !w.resolved).length || null, icon: Flame },
              { id: 'skip-list', label: '178 Chapters', icon: BookOpen },
              { id: 'top-10', label: 'Top 10 Focus', icon: Award },
              { id: 'strategy', label: 'Exam Strategy', icon: Clock },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-ink text-paper font-bold shadow-sm'
                      : 'text-ink-light hover:bg-paper-dark hover:text-ink font-medium'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive 
                        ? 'bg-brand-red text-white' 
                        : 'bg-paper-border text-ink'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Start Date Pill + Plan A/B/C Selector */}
          <div className="flex items-center space-x-2 self-start md:self-auto shrink-0 text-xs font-mono">
            
            {/* Start Date Indicator & Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDatePicker(prev => !prev)}
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-paper-card border border-paper-border hover:border-ink-muted rounded-lg text-ink cursor-pointer shadow-sm"
                title="Change Preparation Start Date"
              >
                <CalendarDays className="w-3.5 h-3.5 text-brand-red" />
                <span className="text-[11px] text-ink-muted">Start:</span>
                <span className="font-bold text-[11px]">{formatDisplayDate(userState.startDate)}</span>
              </button>

              {/* Popover Date Input */}
              {showDatePicker && (
                <div className="absolute right-0 top-full mt-1 p-2 bg-paper-card border border-paper-border rounded-lg shadow-editorial z-50 flex items-center space-x-2">
                  <input
                    type="date"
                    value={userState.startDate}
                    onChange={e => {
                      handleStartDateChange(e);
                      setShowDatePicker(false);
                    }}
                    className="px-2 py-1 bg-paper border border-paper-border rounded text-xs font-mono text-ink focus:outline-none"
                  />
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="text-[10px] text-ink-muted hover:text-ink px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Plan A / B / C Segmented Pill Switcher */}
            <div className="flex items-center bg-paper-dark/80 p-0.5 rounded-lg border border-paper-border">
              {[
                { code: 'A', label: 'Plan A (4h)', title: 'Plan A: Standard (~4h/day) · College & Jobs' },
                { code: 'B', label: 'Plan B (8h)', title: 'Plan B: Full-Time (~8h/day) · Intensive Reps' },
                { code: 'C', label: 'Plan C (5h)', title: 'Plan C: Foundation Rescue (~5h/day)' },
              ].map(p => {
                const isSelected = userState.activePlan === p.code;
                return (
                  <button
                    key={p.code}
                    onClick={() => handlePlanChange(p.code as 'A' | 'B' | 'C')}
                    title={p.title}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-paper-card text-brand-red shadow-sm'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </header>
  );
};
