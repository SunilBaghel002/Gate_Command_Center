'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DailyBoard } from '@/components/DailyBoard';
import { MockHub } from '@/components/MockHub';
import { WeakTopicLog } from '@/components/WeakTopicLog';
import { SkipListExplorer } from '@/components/SkipListExplorer';
import { DiagnosticView } from '@/components/DiagnosticView';
import { Top10View } from '@/components/Top10View';
import { ExamStrategyView } from '@/components/ExamStrategyView';
import { LandingHero } from '@/components/LandingHero';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { UserState, loadUserState, saveUserState, initialUserState } from '@/lib/storage';
import { getPlanDays } from '@/lib/data';

export default function Home() {
  const [userState, setUserState] = useState<UserState>(initialUserState);
  const [activeTab, setActiveTab] = useState<string>('daily');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Screen mode: 'landing' | 'onboarding' | 'dashboard'
  const [screenMode, setScreenMode] = useState<'landing' | 'onboarding' | 'dashboard'>('landing');

  // Quick Mistake Modal State
  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState<boolean>(false);
  const [modalDefaultChapter, setModalDefaultChapter] = useState<string>('');
  const [modalDefaultSubject, setModalDefaultSubject] = useState<string>('');

  // Load from LocalStorage
  useEffect(() => {
    const loaded = loadUserState();
    setUserState(loaded);
    if (loaded.hasCompletedOnboarding) {
      setScreenMode('dashboard');
    } else {
      setScreenMode('landing');
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage on changes
  const handleUpdateState = (updater: (prev: UserState) => UserState) => {
    setUserState(prev => {
      const next = updater(prev);
      saveUserState(next);
      return next;
    });
  };

  // Open Weak-Topic quick modal from Daily Board
  const handleOpenWeakTopicModal = (chapterName?: string, subjectCode?: string) => {
    setModalDefaultChapter(chapterName || '');
    setModalDefaultSubject(subjectCode || '');
    setIsMistakeModalOpen(true);
  };

  // Handle Backup Import directly from landing screen or anywhere
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        handleUpdateState(() => parsed);
        setScreenMode('dashboard');
        alert('All progress and settings restored successfully from backup!');
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Days for current active plan
  const currentPlanDays = getPlanDays(userState.activePlan);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink-muted">Loading GATE Command Center...</p>
        </div>
      </div>
    );
  }

  // SCREEN 1: LANDING OVERVIEW (What the website does, purpose, features, how to improve results)
  if (screenMode === 'landing') {
    return (
      <main className="min-h-screen bg-paper">
        <LandingHero
          userState={userState}
          onStartOnboarding={() => setScreenMode('onboarding')}
          onEnterDashboard={() => setScreenMode('dashboard')}
          onImportBackup={handleImportBackup}
        />
      </main>
    );
  }

  // SCREEN 2: ONBOARDING WIZARD (Candidate profile, pre-flight diagnostic, target, dates, plan)
  if (screenMode === 'onboarding') {
    return (
      <main className="min-h-screen bg-paper py-6">
        <OnboardingWizard
          userState={userState}
          onUpdateState={handleUpdateState}
          onComplete={() => {
            setScreenMode('dashboard');
            setActiveTab('daily');
          }}
          onCancel={() => setScreenMode(userState.hasCompletedOnboarding ? 'dashboard' : 'landing')}
        />
      </main>
    );
  }

  // SCREEN 3: MAIN PERSONALIZED DASHBOARD
  return (
    <main className="min-h-screen bg-paper pb-16">
      {/* Top Header */}
      <Header
        userState={userState}
        onUpdateState={handleUpdateState}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenOverview={() => setScreenMode('landing')}
        onOpenOnboarding={() => setScreenMode('onboarding')}
      />

      {/* Active Tab View */}
      {activeTab === 'daily' && (
        <DailyBoard
          days={currentPlanDays}
          userState={userState}
          onUpdateState={handleUpdateState}
          onOpenWeakTopicModal={handleOpenWeakTopicModal}
        />
      )}

      {activeTab === 'mocks' && (
        <MockHub
          userState={userState}
          onUpdateState={handleUpdateState}
        />
      )}

      {activeTab === 'weak-topics' && (
        <WeakTopicLog
          userState={userState}
          onUpdateState={handleUpdateState}
        />
      )}

      {activeTab === 'skip-list' && (
        <SkipListExplorer />
      )}

      {activeTab === 'top-10' && (
        <Top10View />
      )}

      {activeTab === 'diagnostic' && (
        <DiagnosticView
          userState={userState}
          onUpdateState={handleUpdateState}
          onSelectTab={setActiveTab}
        />
      )}

      {activeTab === 'strategy' && (
        <ExamStrategyView />
      )}

      {/* Quick Modal Triggered from Task cards */}
      {isMistakeModalOpen && (
        <WeakTopicLog
          userState={userState}
          onUpdateState={handleUpdateState}
          isOpenModalDirectly={true}
          defaultChapter={modalDefaultChapter}
          defaultSubject={modalDefaultSubject}
          onCloseModal={() => setIsMistakeModalOpen(false)}
        />
      )}
    </main>
  );
}
