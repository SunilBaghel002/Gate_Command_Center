import { MockAnalysisData, WeakTopicItem } from '@/types';

export interface UserState {
  hasCompletedOnboarding: boolean;
  userName: string;
  candidateStatus: string; // 'College 3rd Year' | 'College Final Year' | 'Dropper / Full Time' | 'Working Professional'
  dailyHours: number;
  activePlan: 'A' | 'B' | 'C';
  startDate: string; // ISO date format YYYY-MM-DD
  targetExamDate: string; // ISO date format YYYY-MM-DD
  currentDay: number;
  completedDays: Record<number, boolean>;
  completedTasks: Record<string, boolean>; // key: `${plan}_d${day}_t${index}`
  completedRevisions: Record<string, boolean>; // key: `${plan}_d${day}_r${index}`
  completedGA: Record<string, boolean>; // key: `${plan}_d${day}_ga`
  mockAnalyses: Record<number, MockAnalysisData>; // keyed by mock_no 1..9
  weakTopics: WeakTopicItem[];
  diagnosticChecks: Record<string, boolean>; // key: `${subjectCode}_${index}`
  targetScore: 50 | 65 | 80;
  notes: Record<string, string>; // custom user notes per day or chapter
}

const STORAGE_KEY = 'gate_command_center_state_v1';

export function getDefaultStartDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getDefaultTargetDate(): string {
  return '2027-02-06';
}

export const initialUserState: UserState = {
  hasCompletedOnboarding: false,
  userName: '',
  candidateStatus: 'College Final Year',
  dailyHours: 4,
  activePlan: 'A',
  startDate: getDefaultStartDate(),
  targetExamDate: getDefaultTargetDate(),
  currentDay: 1,
  completedDays: {},
  completedTasks: {},
  completedRevisions: {},
  completedGA: {},
  mockAnalyses: {},
  weakTopics: [],
  diagnosticChecks: {},
  targetScore: 65,
  notes: {},
};

export function loadUserState(): UserState {
  if (typeof window === 'undefined') {
    return initialUserState;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialUserState;
    const parsed = JSON.parse(raw);
    return { ...initialUserState, ...parsed };
  } catch (err) {
    console.error('Failed to load user state from localStorage:', err);
    return initialUserState;
  }
}

export function saveUserState(state: UserState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save user state to localStorage:', err);
  }
}

export function exportUserStateJson(state: UserState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const userTag = state.userName ? `_${state.userName.replace(/\s+/g, '_')}` : '';
  downloadAnchor.setAttribute('download', `gate_command_center_backup${userTag}_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function calculateRealDate(startDateStr: string, dayNumber: number): string {
  try {
    const start = new Date(startDateStr);
    const target = new Date(start.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000);
    return target.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return `Day ${dayNumber}`;
  }
}

export function getDaysRemaining(targetDateStr?: string): number {
  const targetDate = targetDateStr ? new Date(`${targetDateStr}T09:00:00`) : new Date('2027-02-06T09:00:00');
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function getDaysRemainingToGate2027(): number {
  return getDaysRemaining('2027-02-06');
}
