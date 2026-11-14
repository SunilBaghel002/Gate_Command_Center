export type Tier = '✅' | '🟡' | '❌';
export type TierName = 'Must-do' | 'Basics only' | 'Skip';

export interface Chapter {
  id: number;
  tier: Tier;
  tier_name: TierName;
  name: string;
  subject: string;
  asked_ratio: string;
  marks: string;
  hours: string;
  marks_per_hour: string;
}

export interface RevisionItem {
  level: string; // 'R1', 'R2', etc.
  chapters: string;
}

export interface TaskItem {
  subject: string;
  tier: Tier | null;
  tier_name?: TierName | null;
  title: string;
  duration?: string;
  pyqs?: string;
  topics?: string[];
  lecture?: string | null;
  optional?: string | null;
}

export interface DayPlan {
  day: number;
  week: number;
  phase: string;
  plan_code: 'A' | 'B' | 'C';
  plan_name: string;
  estimated_time: string;
  ga_slot?: string | null;
  revisions: RevisionItem[];
  tasks: TaskItem[];
}

export interface MockTestMeta {
  mock_no: number;
  day: number;
  analysis_day: number;
  block: number;
  paper_recommendation: string;
}

export interface SubjectMockScore {
  subject: string;
  attempted: number;
  right: number;
  wrong: number;
  marks: number;
  minutes: number;
  weakest_chapter: string;
}

export interface QuestionTypeAnalysis {
  type: 'MCQ' | 'MSQ' | 'NAT';
  attempted: number;
  right: number;
  accuracy: number;
  note: string;
}

export interface MockAnalysisData {
  mock_no: number;
  day: number;
  paper_name: string;
  total_score: number;
  total_attempted: number;
  negative_marks: number;
  date_taken: string;
  subject_scores: SubjectMockScore[];
  question_types: QuestionTypeAnalysis[];
  lost_marks_by_reason: {
    concept: number;
    silly: number;
    time: number;
    risky_guess: number;
  };
  fix_chapters: [string, string];
  notes: string;
}

export interface WeakTopicItem {
  id: string;
  day: number;
  chapter: string;
  subject: string;
  tier?: Tier;
  what_went_wrong: string;
  reason: 'Concept' | 'Silly' | 'Time' | 'Risky guess';
  logged_date: string;
  fixed_date?: string;
  resolved: boolean;
}

export interface TargetScores {
  subjects: Array<{
    subject: string;
    code: string;
    avg_marks: number;
    aim_50: number;
    aim_65: number;
    aim_80: number;
  }>;
  totals: {
    avg_marks: number;
    aim_50: number;
    aim_65: number;
    aim_80: number;
  };
}
