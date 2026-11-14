import chaptersData from '../../data/chapters.json';
import planAData from '../../data/plan_a.json';
import planBData from '../../data/plan_b.json';
import planCData from '../../data/plan_c.json';
import mockSystemData from '../../data/mock_system.json';
import targetScoresData from '../../data/target_scores.json';
import diagnosticTestData from '../../data/diagnostic_test.json';
import top10Data from '../../data/top_10_chapters.json';
import examStrategyData from '../../data/exam_strategy.json';

import { Chapter, DayPlan, MockTestMeta, TargetScores } from '@/types';

export const chapters: Chapter[] = chaptersData as Chapter[];
export const planA: DayPlan[] = planAData as DayPlan[];
export const planB: DayPlan[] = planBData as DayPlan[];
export const planC: DayPlan[] = planCData as DayPlan[];

export const mockSystem = mockSystemData;
export const targetScores = targetScoresData as TargetScores;
export const diagnosticTest = diagnosticTestData;
export const top10Chapters = top10Data;
export const examStrategy = examStrategyData;

export function getPlanDays(code: 'A' | 'B' | 'C'): DayPlan[] {
  switch (code) {
    case 'B':
      return planB;
    case 'C':
      return planC;
    case 'A':
    default:
      return planA;
  }
}
