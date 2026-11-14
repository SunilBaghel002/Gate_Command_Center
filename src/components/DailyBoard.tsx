'use client';

import React, { useState } from 'react';
import { DayPlan, TaskItem } from '@/types';
import { UserState, calculateRealDate } from '@/lib/storage';
import { 
  CheckCircle2, 
  Circle, 
  Play, 
  Calendar, 
  Clock, 
  BookOpen, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  PlusCircle, 
  HelpCircle, 
  Sparkles,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Award,
  Flame,
  Check,
  ShieldAlert,
  Edit3
} from 'lucide-react';

interface DailyBoardProps {
  days: DayPlan[];
  userState: UserState;
  onUpdateState: (updater: (prev: UserState) => UserState) => void;
  onOpenWeakTopicModal: (defaultChapter?: string, defaultSubject?: string) => void;
}

export const DailyBoard: React.FC<DailyBoardProps> = ({
  days,
  userState,
  onUpdateState,
  onOpenWeakTopicModal,
}) => {
  const currentDay = userState.currentDay;
  const dayPlan = days.find(d => d.day === currentDay) || days[0];

  // Collapsible 90-day grid state (collapsed by default to eliminate vertical scroll wall!)
  const [isGridExpanded, setIsGridExpanded] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Day toggle
  const isDayCompleted = !!userState.completedDays[currentDay];
  const toggleDayCompleted = () => {
    onUpdateState(prev => {
      const nextCompleted = !isDayCompleted;
      if (nextCompleted) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
      return {
        ...prev,
        completedDays: { ...prev.completedDays, [currentDay]: nextCompleted },
      };
    });
  };

  // GA toggle
  const gaKey = `${userState.activePlan}_d${currentDay}_ga`;
  const isGaCompleted = !!userState.completedGA[gaKey];
  const toggleGA = () => {
    onUpdateState(prev => ({
      ...prev,
      completedGA: { ...prev.completedGA, [gaKey]: !isGaCompleted },
    }));
  };

  // Revision toggle
  const toggleRevision = (revIdx: number) => {
    const revKey = `${userState.activePlan}_d${currentDay}_r${revIdx}`;
    onUpdateState(prev => ({
      ...prev,
      completedRevisions: {
        ...prev.completedRevisions,
        [revKey]: !prev.completedRevisions[revKey],
      },
    }));
  };

  // Task toggle
  const toggleTask = (taskIdx: number) => {
    const taskKey = `${userState.activePlan}_d${currentDay}_t${taskIdx}`;
    onUpdateState(prev => ({
      ...prev,
      completedTasks: {
        ...prev.completedTasks,
        [taskKey]: !prev.completedTasks[taskKey],
      },
    }));
  };

  // Note auto-save per day
  const dailyNoteKey = `note_day_${currentDay}`;
  const currentDailyNote = userState.notes[dailyNoteKey] || '';
  const handleNoteChange = (text: string) => {
    onUpdateState(prev => ({
      ...prev,
      notes: { ...prev.notes, [dailyNoteKey]: text },
    }));
  };

  // Navigation
  const goToDay = (d: number) => {
    if (d >= 1 && d <= 90) {
      onUpdateState(prev => ({ ...prev, currentDay: d }));
    }
  };

  // Open YouTube Lecture Search
  const openLecture = (lectureText: string) => {
    const cleanQuery = lectureText.replace(/\(.*?\)/g, '').trim();
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Progress calculations for today
  const totalTasks = (dayPlan.tasks?.length || 0) + (dayPlan.ga_slot ? 1 : 0) + (dayPlan.revisions?.length || 0);
  let completedTodayCount = 0;
  if (isGaCompleted && dayPlan.ga_slot) completedTodayCount++;
  dayPlan.revisions?.forEach((_, i) => {
    if (userState.completedRevisions[`${userState.activePlan}_d${currentDay}_r${i}`]) completedTodayCount++;
  });
  dayPlan.tasks?.forEach((_, i) => {
    if (userState.completedTasks[`${userState.activePlan}_d${currentDay}_t${i}`]) completedTodayCount++;
  });
  const todayProgressPercent = totalTasks > 0 ? Math.round((completedTodayCount / totalTasks) * 100) : 0;

  // Phase badge styling
  const getPhaseColor = (phase: string) => {
    if (phase.includes('Learn') || phase.includes('Phase 1')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (phase.includes('PYQ') || phase.includes('Phase 2')) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (phase.includes('Mocks') || phase.includes('Phase 3')) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-purple-100 text-purple-800 border-purple-300';
  };

  // Calculate current week days (7-day slice)
  const currentWeek = dayPlan.week || Math.ceil(currentDay / 7);
  const weekStartDay = (currentWeek - 1) * 7 + 1;
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStartDay + i).filter(d => d <= 90);

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      
      {/* Celebration Notification Toast */}
      {showCelebration && (
        <div className="bg-emerald-600 text-white p-3 rounded-lg shadow-editorial flex items-center justify-between text-xs font-mono animate-bounce">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="font-bold">Day {currentDay} marked complete! Streak extended!</span>
          </div>
          <span>Keep pushing forward 🔥</span>
        </div>
      )}

      {/* TOP CONTROL BAR (TASK-FIRST: COMPACT & ZERO VERTICAL WASTE) */}
      <div className="bg-paper-card border border-paper-border rounded-xl p-4 shadow-editorial flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Day & Phase Meta */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-serif font-black text-ink">
              Day {currentDay}
            </span>
            <span className="text-xs font-mono text-ink-muted">/ 90</span>
          </div>

          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-paper border border-paper-border text-ink font-semibold">
            {calculateRealDate(userState.startDate, currentDay)}
          </span>

          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${getPhaseColor(dayPlan.phase)}`}>
            {dayPlan.phase}
          </span>

          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-paper-dark text-ink-muted">
            Week {dayPlan.week} · {dayPlan.estimated_time}
          </span>
        </div>

        {/* Center & Right: Controls & Stepper */}
        <div className="flex items-center space-x-2.5 self-start md:self-auto flex-wrap gap-y-2">
          
          {/* Day Navigation */}
          <div className="flex items-center space-x-1 bg-paper border border-paper-border rounded-lg p-0.5">
            <button
              onClick={() => goToDay(currentDay - 1)}
              disabled={currentDay <= 1}
              className="p-1.5 rounded hover:bg-paper-dark disabled:opacity-30 text-ink cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Jump Dropdown */}
            <select
              value={currentDay}
              onChange={e => goToDay(Number(e.target.value))}
              className="bg-transparent font-mono text-xs font-bold text-ink px-2 py-1 focus:outline-none cursor-pointer"
            >
              {Array.from({ length: 90 }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>
                  Day {d} {userState.completedDays[d] ? '✓' : ''}
                </option>
              ))}
            </select>

            <button
              onClick={() => goToDay(currentDay + 1)}
              disabled={currentDay >= 90}
              className="p-1.5 rounded hover:bg-paper-dark disabled:opacity-30 text-ink cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Jump to Day 1 Button */}
          <button
            onClick={() => goToDay(1)}
            className="px-2.5 py-1.5 bg-paper hover:bg-paper-dark border border-paper-border rounded-lg text-xs font-mono text-ink cursor-pointer"
          >
            Day 1
          </button>

          {/* Toggle 90-Day Roadmap (Collapsed by default so no scrolling wall!) */}
          <button
            onClick={() => setIsGridExpanded(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1.5 transition cursor-pointer ${
              isGridExpanded
                ? 'bg-ink text-paper border-ink font-bold'
                : 'bg-paper text-ink hover:bg-paper-dark border-paper-border'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>90-Day Roadmap</span>
            {isGridExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Mark Day Complete Button */}
          <button
            onClick={toggleDayCompleted}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer ${
              isDayCompleted
                ? 'bg-tier-must text-white hover:bg-emerald-700'
                : 'bg-brand-red text-white hover:bg-brand-redDark'
            }`}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Day Completed ✓</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                <span>Mark Day Done</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* OPTIONAL COLLAPSIBLE 90-DAY GRID DRAWER (Shown ONLY when toggled!) */}
      {isGridExpanded && (
        <div className="bg-paper-card border border-paper-border rounded-xl p-4 shadow-editorial transition-all animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-paper-border text-xs font-mono">
            <span className="font-bold text-ink">90-Day Quick Navigation Map</span>
            <span className="text-ink-muted">
              (Green = Completed · Crimson = Selected · Gray = Pending)
            </span>
          </div>

          <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-1.5 max-h-48 overflow-y-auto p-1">
            {Array.from({ length: 90 }, (_, i) => i + 1).map(d => {
              const isSelected = d === currentDay;
              const isComp = !!userState.completedDays[d];
              return (
                <button
                  key={d}
                  onClick={() => goToDay(d)}
                  className={`h-7 rounded text-[11px] font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                    isSelected
                      ? 'bg-brand-red text-white ring-2 ring-brand-red ring-offset-1'
                      : isComp
                      ? 'bg-tier-must text-white hover:bg-emerald-700'
                      : 'bg-paper text-ink hover:bg-paper-dark border border-paper-border'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN WORK AREA (TASK-FIRST: DIRECTLY VISIBLE, ZERO OVERFLOW) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: PRIMARY DAILY TASKS (2 COLUMNS WIDE, MIN-W-0 TO PREVENT OVERFLOW) */}
        <div className="lg:col-span-2 space-y-5 min-w-0">
          
          {/* Main Daily Focus Chapter Card */}
          <div className="bg-paper-card border-2 border-paper-border rounded-xl p-5 sm:p-6 shadow-editorial space-y-4 overflow-hidden">
            
            {/* Header / Chapter Title */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-paper-border pb-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-red text-white px-2 py-0.5 rounded shrink-0">
                    Today&apos;s Core Target
                  </span>
                  <span className="text-xs font-mono font-semibold text-ink-muted shrink-0">
                    {dayPlan.estimated_time} Expected
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-black text-ink mt-2 break-words">
                  {dayPlan.tasks?.[0]?.title || `Day ${currentDay} Protocol`}
                </h2>

                <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-y-1">
                  <span className="text-xs font-mono font-bold text-ink-light">
                    Subject: {dayPlan.tasks?.[0]?.subject || 'General'}
                  </span>
                  {dayPlan.tasks?.[0]?.tier && (
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Tier: {dayPlan.tasks?.[0]?.tier} {dayPlan.tasks?.[0]?.tier_name || 'Must-Do'}
                    </span>
                  )}
                </div>
              </div>

              {/* Day Progress Meter */}
              <div className="bg-paper p-3 rounded-lg border border-paper-border text-center min-w-[120px] self-start sm:self-auto shrink-0">
                <span className="text-[10px] font-mono text-ink-muted uppercase block">Day Progress</span>
                <span className="text-xl font-serif font-bold text-ink">
                  {completedTodayCount} / {totalTasks}
                </span>
                <div className="w-full bg-paper-border h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-brand-red h-full transition-all duration-300"
                    style={{ width: `${todayProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ACTION CHECKLIST 1: Theory & Concept Topics */}
            {dayPlan.tasks?.map((task, tIdx) => {
              const taskKey = `${userState.activePlan}_d${currentDay}_t${tIdx}`;
              const isTaskDone = !!userState.completedTasks[taskKey];

              return (
                <div 
                  key={tIdx} 
                  className={`p-4 rounded-xl border transition-all overflow-hidden ${
                    isTaskDone 
                      ? 'bg-emerald-50/50 border-emerald-200' 
                      : 'bg-paper border-paper-border hover:border-ink-muted'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTask(tIdx)}
                      className="flex items-start space-x-3 text-left cursor-pointer flex-1 min-w-0"
                    >
                      {isTaskDone ? (
                        <CheckCircle2 className="w-5 h-5 text-tier-must shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-ink-muted shrink-0 mt-0.5 hover:text-brand-red" />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className={`text-base font-serif font-bold break-words ${isTaskDone ? 'line-through text-ink-muted' : 'text-ink'}`}>
                          {task.title}
                        </span>
                        {task.duration && (
                          <span className="ml-2 text-xs font-mono text-ink-muted whitespace-nowrap">
                            ({task.duration})
                          </span>
                        )}

                        {/* Topics List */}
                        {task.topics && task.topics.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {task.topics.map((top, i) => (
                              <span 
                                key={i}
                                className="text-xs bg-paper-card border border-paper-border px-2 py-0.5 rounded text-ink font-sans break-words"
                              >
                                • {top}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Quick Button to Log a Mistake for this chapter */}
                    <button
                      type="button"
                      onClick={() => onOpenWeakTopicModal(task.title, task.subject)}
                      className="px-2.5 py-1 rounded-md bg-brand-redLight hover:bg-brand-red/20 text-brand-redDark text-[11px] font-mono shrink-0 flex items-center space-x-1 cursor-pointer transition shadow-xs"
                      title="Log a mistake or concept doubt for this topic"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Log Doubt</span>
                    </button>
                  </div>

                  {/* CURATED LECTURE VIDEO CARD (RESTYLED: ZERO OVERFLOW, FULL CONTAINMENT) */}
                  {task.lecture && (
                    <div className="mt-3 p-3.5 bg-red-50/70 border border-red-200/80 rounded-xl space-y-2.5 overflow-hidden">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center space-x-2 text-brand-red font-mono text-xs font-bold">
                          <Play className="w-4 h-4 fill-brand-red text-brand-red shrink-0" />
                          <span>Curated Video Lecture</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full shrink-0">
                          ⚡ 1.5× Playback Recommended
                        </span>
                      </div>

                      {/* Clean wrapping lecture text - will never overflow! */}
                      <div className="text-xs font-mono text-ink font-medium break-words leading-relaxed">
                        {task.lecture}
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-red-200/60">
                        <span className="text-[11px] font-mono text-ink-muted">
                          GATE CSE Standard Track
                        </span>
                        <button
                          type="button"
                          onClick={() => openLecture(task.lecture!)}
                          className="w-full sm:w-auto px-3 py-1.5 bg-brand-red hover:bg-brand-redDark text-white rounded-lg text-xs font-mono font-semibold flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer shrink-0"
                        >
                          <span>Watch on YouTube</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PYQs Target Box */}
                  {task.pyqs && (
                    <div className="mt-2.5 p-3 bg-paper-dark/70 border border-paper-border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono overflow-hidden">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="text-sm shrink-0">🎯</span>
                        <span className="text-ink font-bold break-words">
                          PYQ Target: <span className="text-brand-red font-mono">{task.pyqs}</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-ink-muted bg-paper px-2 py-0.5 rounded border border-paper-border shrink-0 self-start sm:self-auto">
                        Solve strictly with stopwatch
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* ACTION CHECKLIST 2: Daily General Aptitude Slot */}
            {dayPlan.ga_slot && (
              <div 
                className={`p-4 rounded-xl border transition-all overflow-hidden ${
                  isGaCompleted 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : 'bg-paper border-paper-border hover:border-ink-muted'
                }`}
              >
                <button
                  type="button"
                  onClick={toggleGA}
                  className="w-full flex items-start space-x-3 text-left cursor-pointer min-w-0"
                >
                  {isGaCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-tier-must shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-ink-muted shrink-0 mt-0.5 hover:text-brand-red" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded shrink-0">
                        Daily GA Slot (1 Hour)
                      </span>
                      <span className="text-[11px] font-mono text-ink-muted shrink-0">15 Marks Direct Yield</span>
                    </div>
                    <p className={`text-sm font-serif font-bold mt-1 break-words ${isGaCompleted ? 'line-through text-ink-muted' : 'text-ink'}`}>
                      {dayPlan.ga_slot}
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5 font-sans leading-relaxed">
                      Practice 10 numerical/verbal questions from GATE 2018–2024 papers.
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* ACTION CHECKLIST 3: Spaced Repetition (R1 to R5) */}
            {dayPlan.revisions && dayPlan.revisions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-paper-border overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-xs font-mono font-bold text-ink uppercase flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-red shrink-0" />
                    <span>Spaced Repetition Schedule Today</span>
                  </span>
                  <span className="text-[10px] font-mono text-ink-muted">
                    R1 (+3d) · R2 (+7d) · R3 (+14d) · R4 (+30d) · R5 (+60d)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dayPlan.revisions.map((rev, rIdx) => {
                    const revKey = `${userState.activePlan}_d${currentDay}_r${rIdx}`;
                    const isRevDone = !!userState.completedRevisions[revKey];

                    return (
                      <button
                        key={rIdx}
                        type="button"
                        onClick={() => toggleRevision(rIdx)}
                        className={`p-2.5 rounded-lg border text-left flex items-start space-x-2.5 text-xs transition cursor-pointer min-w-0 ${
                          isRevDone 
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                            : 'bg-paper hover:bg-paper-dark border-paper-border text-ink'
                        }`}
                      >
                        {isRevDone ? (
                          <CheckCircle2 className="w-4 h-4 text-tier-must shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-ink-muted shrink-0 mt-0.5 hover:text-brand-red" />
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="font-mono font-bold text-brand-red mr-1.5 shrink-0">{rev.level}:</span>
                          <span className={`break-words ${isRevDone ? 'line-through text-ink-muted' : 'font-medium'}`}>
                            {rev.chapters}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Today's Scratchpad & Formula Notes (Auto-saved to localStorage) */}
          <div className="bg-paper-card border border-paper-border rounded-xl p-4 shadow-editorial space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-ink uppercase flex items-center space-x-1.5">
                <Edit3 className="w-3.5 h-3.5 text-brand-red" />
                <span>Today&apos;s Active Recall Notes & Formulas</span>
              </span>
              <span className="text-[10px] font-mono text-tier-must font-semibold">
                Auto-saved in Local Storage
              </span>
            </div>
            <textarea
              value={currentDailyNote}
              onChange={e => handleNoteChange(e.target.value)}
              placeholder="Jot down the key formula, tricky edge case, or question reference from today's study session..."
              rows={3}
              className="w-full p-3 bg-paper border border-paper-border rounded-lg text-xs font-mono text-ink focus:outline-none focus:border-brand-red resize-none"
            />
          </div>

        </div>

        {/* RIGHT COLUMN: EXECUTIVE SUPPORT & WEEK VIEW (1 COLUMN WIDE, MIN-W-0) */}
        <div className="space-y-5 min-w-0">
          
          {/* Week Overview Card (Direct access to this week's 7 days) */}
          <div className="bg-paper-card border border-paper-border rounded-xl p-4 shadow-editorial space-y-3">
            <div className="flex items-center justify-between border-b border-paper-border pb-2">
              <span className="font-serif font-bold text-sm text-ink">
                Week {currentWeek} Fast Strip
              </span>
              <span className="text-[11px] font-mono text-ink-muted">
                Days {weekDays[0]}–{weekDays[weekDays.length - 1]}
              </span>
            </div>

            <div className="space-y-1.5">
              {weekDays.map(d => {
                const isSelected = d === currentDay;
                const isComp = !!userState.completedDays[d];
                const dayObj = days.find(x => x.day === d);

                return (
                  <button
                    key={d}
                    onClick={() => goToDay(d)}
                    className={`w-full p-2.5 rounded-lg text-xs font-mono flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-brand-red text-white font-bold shadow-sm'
                        : isComp
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-paper hover:bg-paper-dark border border-paper-border text-ink'
                    }`}
                  >
                    <div className="flex items-center space-x-2 shrink-0">
                      <span>Day {d}</span>
                      {isComp && <span className="text-[10px] text-tier-must font-bold">✓</span>}
                    </div>
                    <span className="truncate max-w-[150px] text-[11px] text-right opacity-85">
                      {dayObj?.tasks?.[0]?.title || `Day ${d}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guardrail: The +2h/day Catch-Up Rule */}
          <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-amber-900 font-bold font-serif">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>The Catch-Up Guardrail (Day 89 Rule)</span>
            </div>
            <p className="text-amber-950 font-sans leading-relaxed text-[11px]">
              If you fell behind earlier this week, you may only allocate <strong>+2 hours today</strong> to recover. 
              Never cram 12 hours over the weekend. If more than 4 hours behind, compress Basics-Only topics rather than dropping Must-Do chapters.
            </p>
          </div>

          {/* Target Aim Contribution */}
          <div className="bg-paper-card border border-paper-border rounded-xl p-4 shadow-editorial space-y-3">
            <div className="flex items-center justify-between border-b border-paper-border pb-2">
              <span className="font-serif font-bold text-xs text-ink">
                Your Goal: Target {userState.targetScore} Marks
              </span>
              <span className="text-[10px] font-mono text-brand-red font-bold">
                Plan {userState.activePlan}
              </span>
            </div>

            <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
              Mastering today&apos;s chapter moves you closer to the {userState.targetScore} marks benchmark for {userState.targetScore === 50 ? 'Qualifying' : userState.targetScore === 65 ? 'Old IITs' : 'Top 100 AIR'}.
            </p>

            <button
              onClick={() => onOpenWeakTopicModal(dayPlan.tasks?.[0]?.title, dayPlan.tasks?.[0]?.subject)}
              className="w-full py-2 bg-paper border border-dashed border-paper-border hover:border-brand-red hover:text-brand-red rounded text-xs font-mono flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-brand-red" />
              <span>Log Problematic Question to Vault</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
