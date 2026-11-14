'use client';

import React from 'react';
import { UserState, exportUserStateJson, getDaysRemaining } from '@/lib/storage';
import { 
  Calendar, 
  Flame, 
  Target, 
  Clock, 
  Download, 
  Upload, 
  RotateCcw, 
  BookOpen, 
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Settings,
  User
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

  return (
    <header className="border-b border-paper-border bg-paper-light sticky top-0 z-40 shadow-editorial">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand & Edition */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={onOpenOverview} 
              className="w-10 h-10 rounded bg-brand-red text-white flex items-center justify-center font-serif font-black text-xl shadow-sm hover:bg-brand-redDark transition cursor-pointer"
              title="Click to view System Overview & Purpose"
            >
              90
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenOverview}
                  className="text-lg sm:text-xl font-serif font-bold tracking-tight text-ink hover:text-brand-red transition text-left cursor-pointer"
                >
                  GATE Command Center
                </button>
                <span className="text-xs bg-ink text-paper px-2 py-0.5 rounded font-mono font-medium">
                  2027
                </span>
                {userState.userName && (
                  <span className="hidden sm:inline-flex items-center space-x-1 text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                    <User className="w-3 h-3" />
                    <span>{userState.userName}</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ink-muted flex items-center space-x-2">
                <span>90-Day Execution Engine · 1,840 Questions Analyzed</span>
                <button
                  onClick={onOpenOverview}
                  className="underline hover:text-ink cursor-pointer"
                >
                  (Why this works)
                </button>
              </p>
            </div>
          </div>

          {/* Key Metrics Pillbox */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Days to GATE */}
            <div className="flex items-center space-x-1.5 bg-paper-card border border-paper-border px-2.5 py-1 rounded shadow-sm">
              <Clock className="w-3.5 h-3.5 text-brand-red" />
              <span className="text-ink-muted">Exam:</span>
              <span className="font-mono font-bold text-ink">{daysRemaining}d</span>
            </div>

            {/* Streak */}
            <div className="flex items-center space-x-1.5 bg-paper-card border border-paper-border px-2.5 py-1 rounded shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-ink-muted">Streak:</span>
              <span className="font-mono font-bold text-ink">{streak}d</span>
            </div>

            {/* Overall Days Progress */}
            <div className="flex items-center space-x-1.5 bg-paper-card border border-paper-border px-2.5 py-1 rounded shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-tier-must" />
              <span className="text-ink-muted">Done:</span>
              <span className="font-mono font-bold text-ink">{completedDaysCount} / 90</span>
            </div>

            {/* Target Score */}
            <div className="flex items-center space-x-1.5 bg-paper-card border border-paper-border px-2 py-1 rounded shadow-sm">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <select
                value={userState.targetScore}
                onChange={(e) => onUpdateState(p => ({ ...p, targetScore: Number(e.target.value) as 50 | 65 | 80 }))}
                className="bg-transparent font-mono font-bold text-ink focus:outline-none cursor-pointer text-xs"
                title="Target Score Aim"
              >
                <option value={50}>Aim: 50m</option>
                <option value={65}>Aim: 65m</option>
                <option value={80}>Aim: 80+m</option>
              </select>
            </div>

            {/* Setup / Onboarding Button */}
            <button
              onClick={onOpenOnboarding}
              className="p-1.5 bg-paper-card border border-paper-border rounded hover:bg-paper-dark transition text-ink font-mono text-xs flex items-center space-x-1 cursor-pointer"
              title="Re-run Onboarding & Diagnostic"
            >
              <Settings className="w-3.5 h-3.5 text-ink-muted" />
              <span className="hidden sm:inline">Setup</span>
            </button>

            {/* Backup / Export */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => exportUserStateJson(userState)}
                title="Export Progress Backup (JSON) to transfer to other laptops"
                className="p-1.5 bg-paper-card border border-paper-border rounded hover:bg-paper-dark transition text-ink-muted hover:text-ink cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <label 
                title="Import Progress Backup (JSON)"
                className="p-1.5 bg-paper-card border border-paper-border rounded hover:bg-paper-dark transition text-ink-muted hover:text-ink cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Secondary Bar: Navigation Tabs and Plan Switcher */}
        <div className="mt-2.5 pt-2 border-t border-paper-border/80 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          
          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'daily', label: 'Daily Tracker', icon: Calendar },
              { id: 'mocks', label: '9 Mock Hub', badge: '9 Mocks', icon: Target },
              { id: 'weak-topics', label: 'Error Vault', badge: userState.weakTopics.filter(w => !w.resolved).length || null, icon: Flame },
              { id: 'skip-list', label: '178 Chapters', icon: BookOpen },
              { id: 'top-10', label: 'Top 10 High-Yield', icon: CheckCircle2 },
              { id: 'diagnostic', label: 'Pre-Flight Diagnostic', icon: RotateCcw },
              { id: 'strategy', label: 'Exam Strategy', icon: Clock },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-ink text-paper shadow-sm font-semibold'
                      : 'text-ink-light hover:bg-paper-dark hover:text-ink'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
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

          {/* Plan Switcher & Start Date */}
          <div className="flex items-center space-x-2.5 self-end md:self-auto text-xs">
            {/* Start Date */}
            <div className="flex items-center space-x-1 text-ink-muted">
              <span>Start:</span>
              <input
                type="date"
                value={userState.startDate}
                onChange={handleStartDateChange}
                className="bg-paper-card border border-paper-border rounded px-1.5 py-0.5 text-ink font-mono text-xs focus:outline-none"
              />
            </div>

            {/* Plan A / B / C Selector */}
            <div className="flex items-center bg-paper-dark p-0.5 rounded border border-paper-border">
              {[
                { code: 'A', label: 'Plan A (4h)', title: 'College / Job · 140 Chapters' },
                { code: 'B', label: 'Plan B (8h)', title: 'Full Time · 172 Chapters' },
                { code: 'C', label: 'Plan C (5h)', title: 'Foundation Rescue · 105 Chapters' },
              ].map(p => {
                const isSelected = userState.activePlan === p.code;
                return (
                  <button
                    key={p.code}
                    onClick={() => handlePlanChange(p.code as 'A' | 'B' | 'C')}
                    title={p.title}
                    className={`px-2 py-0.5 rounded text-xs font-semibold transition cursor-pointer ${
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
