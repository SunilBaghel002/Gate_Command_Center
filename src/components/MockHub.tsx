'use client';

import React, { useState } from 'react';
import { UserState } from '@/lib/storage';
import { MockAnalysisData, SubjectMockScore, QuestionTypeAnalysis, WeakTopicItem } from '@/types';
import { mockSystem, chapters } from '@/lib/data';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  ChevronRight, 
  BarChart3, 
  HelpCircle,
  Clock,
  Sparkles,
  Save,
  Plus
} from 'lucide-react';

interface MockHubProps {
  userState: UserState;
  onUpdateState: (updater: (prev: UserState) => UserState) => void;
}

const ALL_SUBJECTS = ['GA', 'EM', 'DM', 'DL', 'COA', 'PDS', 'Algo', 'TOC', 'CD', 'OS', 'DBMS', 'CN'];

export const MockHub: React.FC<MockHubProps> = ({ userState, onUpdateState }) => {
  const [selectedMockNo, setSelectedMockNo] = useState<number>(1);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Existing analysis or default empty form
  const existingAnalysis: MockAnalysisData | undefined = userState.mockAnalyses[selectedMockNo];

  const defaultAnalysis: MockAnalysisData = {
    mock_no: selectedMockNo,
    day: mockSystem.calendar.find(m => m.mock_no === selectedMockNo)?.day || 61,
    paper_name: existingAnalysis?.paper_name || `GATE Past Paper / Mock ${selectedMockNo}`,
    total_score: existingAnalysis?.total_score || 0,
    total_attempted: existingAnalysis?.total_attempted || 0,
    negative_marks: existingAnalysis?.negative_marks || 0,
    date_taken: existingAnalysis?.date_taken || new Date().toISOString().split('T')[0],
    subject_scores: existingAnalysis?.subject_scores || ALL_SUBJECTS.map(subj => ({
      subject: subj,
      attempted: 0,
      right: 0,
      wrong: 0,
      marks: 0,
      minutes: 0,
      weakest_chapter: '',
    })),
    question_types: existingAnalysis?.question_types || [
      { type: 'MCQ', attempted: 0, right: 0, accuracy: 0, note: '' },
      { type: 'MSQ', attempted: 0, right: 0, accuracy: 0, note: '' },
      { type: 'NAT', attempted: 0, right: 0, accuracy: 0, note: '' },
    ],
    lost_marks_by_reason: existingAnalysis?.lost_marks_by_reason || {
      concept: 0,
      silly: 0,
      time: 0,
      risky_guess: 0,
    },
    fix_chapters: existingAnalysis?.fix_chapters || ['', ''],
    notes: existingAnalysis?.notes || '',
  };

  const [formData, setFormData] = useState<MockAnalysisData>(defaultAnalysis);

  // Switch mock
  const handleSelectMock = (num: number) => {
    setSelectedMockNo(num);
    const existing = userState.mockAnalyses[num];
    if (existing) {
      setFormData(existing);
    } else {
      setFormData({
        mock_no: num,
        day: mockSystem.calendar.find(m => m.mock_no === num)?.day || 61,
        paper_name: `GATE Paper / Mock ${num}`,
        total_score: 0,
        total_attempted: 0,
        negative_marks: 0,
        date_taken: new Date().toISOString().split('T')[0],
        subject_scores: ALL_SUBJECTS.map(subj => ({
          subject: subj,
          attempted: 0,
          right: 0,
          wrong: 0,
          marks: 0,
          minutes: 0,
          weakest_chapter: '',
        })),
        question_types: [
          { type: 'MCQ', attempted: 0, right: 0, accuracy: 0, note: '' },
          { type: 'MSQ', attempted: 0, right: 0, accuracy: 0, note: '' },
          { type: 'NAT', attempted: 0, right: 0, accuracy: 0, note: '' },
        ],
        lost_marks_by_reason: {
          concept: 0,
          silly: 0,
          time: 0,
          risky_guess: 0,
        },
        fix_chapters: ['', ''],
        notes: '',
      });
    }
  };

  // Save Analysis
  const handleSaveAnalysis = () => {
    onUpdateState(prev => {
      const nextAnalyses = {
        ...prev.mockAnalyses,
        [formData.mock_no]: formData,
      };

      // Also auto-append fix chapters to WeakTopicLog if not already present
      let nextWeak = [...prev.weakTopics];
      formData.fix_chapters.forEach(chName => {
        if (chName && chName.trim()) {
          const already = nextWeak.some(w => w.chapter.toLowerCase() === chName.trim().toLowerCase() && !w.resolved);
          if (!already) {
            nextWeak.push({
              id: 'mock_' + formData.mock_no + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
              day: formData.day,
              chapter: chName.trim(),
              subject: 'Fix Chapter',
              what_went_wrong: `Identified as weakest chapter in Mock ${formData.mock_no} (${formData.paper_name})`,
              reason: 'Concept',
              logged_date: new Date().toISOString().split('T')[0],
              resolved: false,
            });
          }
        }
      });

      return {
        ...prev,
        mockAnalyses: nextAnalyses,
        weakTopics: nextWeak,
      };
    });
    setIsEditing(false);
    alert(`Mock ${formData.mock_no} Analysis saved successfully!`);
  };

  // Rolling averages
  const getBlockAverage = (mocks: number[]) => {
    const scores = mocks
      .map(m => userState.mockAnalyses[m]?.total_score)
      .filter((s): s is number => typeof s === 'number');
    if (!scores.length) return null;
    const sum = scores.reduce((a, b) => a + b, 0);
    return (sum / scores.length).toFixed(1);
  };

  const block1Avg = getBlockAverage([1, 2, 3]);
  const block2Avg = getBlockAverage([4, 5, 6]);
  const block3Avg = getBlockAverage([7, 8, 9]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title & Overview Banner */}
      <div className="bg-paper-card border border-paper-border rounded-lg p-5 sm:p-6 shadow-editorial">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-serif font-black text-ink">
                9 Full Mocks Hub & Analysis Studio
              </span>
              <span className="text-xs bg-brand-red text-white font-mono px-2 py-0.5 rounded font-bold">
                Days 61–85
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              "A three-day rhythm: Mock Day (3h timed) $\to$ Analysis Day (mark every question) $\to$ Fix + Revise Day."
            </p>
          </div>

          {/* Block Averages */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="p-2.5 bg-paper rounded border border-paper-border text-center">
              <div className="text-[10px] text-ink-muted uppercase">Mocks 1–3 Avg</div>
              <div className="text-base font-bold text-ink">{block1Avg ? `${block1Avg} M` : '—'}</div>
            </div>
            <div className="p-2.5 bg-paper rounded border border-paper-border text-center">
              <div className="text-[10px] text-ink-muted uppercase">Mocks 4–6 Avg</div>
              <div className="text-base font-bold text-ink">{block2Avg ? `${block2Avg} M` : '—'}</div>
            </div>
            <div className="p-2.5 bg-paper rounded border border-paper-border text-center">
              <div className="text-[10px] text-ink-muted uppercase">Mocks 7–9 Avg</div>
              <div className="text-base font-bold text-ink">{block3Avg ? `${block3Avg} M` : '—'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Score Graph (Target 50, 65, 80 Benchmark) */}
      <div className="bg-paper-card border border-paper-border rounded-lg p-5 shadow-editorial space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-brand-red" />
            <h3 className="text-sm font-serif font-bold text-ink">
              Mock Score Progression (Mocks 1 to 9 vs Target Lines)
            </h3>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-brand-red inline-block" />
              <span>Target 80+</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-blue-600 inline-block" />
              <span>Target 65</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-amber-600 inline-block" />
              <span>Target 50</span>
            </span>
          </div>
        </div>

        {/* Visual Graph Container */}
        <div className="h-44 w-full bg-paper rounded p-3 relative flex items-end justify-between border border-paper-border text-xs font-mono">
          {/* Target guideline 80 */}
          <div className="absolute left-0 right-0 top-[20%] border-b border-dashed border-brand-red/40 pointer-events-none flex justify-end pr-2 text-[10px] text-brand-red">
            80 Marks
          </div>
          {/* Target guideline 65 */}
          <div className="absolute left-0 right-0 top-[35%] border-b border-dashed border-blue-500/40 pointer-events-none flex justify-end pr-2 text-[10px] text-blue-600">
            65 Marks
          </div>
          {/* Target guideline 50 */}
          <div className="absolute left-0 right-0 top-[50%] border-b border-dashed border-amber-500/40 pointer-events-none flex justify-end pr-2 text-[10px] text-amber-600">
            50 Marks
          </div>

          {/* Bars / Points for Mocks 1 to 9 */}
          {mockSystem.calendar.map((m) => {
            const analysis = userState.mockAnalyses[m.mock_no];
            const score = analysis?.total_score || 0;
            const heightPercent = Math.min(100, Math.max(8, (score / 100) * 100));
            const isSelected = selectedMockNo === m.mock_no;

            return (
              <div 
                key={m.mock_no} 
                onClick={() => handleSelectMock(m.mock_no)}
                className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer z-10 group"
              >
                {analysis ? (
                  <span className="text-[11px] font-bold text-ink mb-1 group-hover:text-brand-red">
                    {score}
                  </span>
                ) : (
                  <span className="text-[9px] text-ink-muted mb-1">—</span>
                )}

                <div 
                  style={{ height: analysis ? `${heightPercent}%` : '4px' }}
                  className={`w-6 sm:w-8 rounded-t transition-all ${
                    isSelected
                      ? 'bg-ink'
                      : analysis
                      ? 'bg-brand-red hover:bg-brand-redDark'
                      : 'bg-paper-border hover:bg-ink-muted'
                  }`}
                />

                <span className={`text-[10px] mt-1.5 font-semibold ${isSelected ? 'text-brand-red underline' : 'text-ink-muted'}`}>
                  M{m.mock_no}
                </span>
                <span className="text-[9px] text-ink-subtle">D{m.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mock Test Selector Grid (Cards 1 to 9) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {mockSystem.blocks.map(block => (
          <div key={block.title} className="bg-paper-card border border-paper-border rounded-lg p-3.5 shadow-sm space-y-2">
            <div className="text-xs font-serif font-bold text-ink border-b border-paper-border pb-1">
              {block.title}
              <p className="text-[10px] font-sans font-normal text-ink-muted">{block.target_focus}</p>
            </div>
            
            <div className="space-y-1.5">
              {block.mocks.map(mockNo => {
                const meta = mockSystem.calendar.find(m => m.mock_no === mockNo)!;
                const analysis = userState.mockAnalyses[mockNo];
                const isSelected = selectedMockNo === mockNo;

                return (
                  <button
                    key={mockNo}
                    onClick={() => handleSelectMock(mockNo)}
                    className={`w-full text-left p-2.5 rounded border text-xs transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-ink text-paper border-ink'
                        : analysis
                        ? 'bg-paper hover:bg-paper-dark border-paper-border'
                        : 'bg-paper-light hover:bg-paper border-dashed border-paper-border text-ink-muted'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center space-x-1.5">
                        <span>Mock {mockNo}</span>
                        <span className="font-mono text-[10px] opacity-75">
                          (Day {meta.day})
                        </span>
                      </div>
                      <div className="text-[11px] opacity-80 truncate max-w-[180px]">
                        {analysis?.paper_name || meta.paper_recommendation}
                      </div>
                    </div>

                    <div className="text-right">
                      {analysis ? (
                        <div className="font-mono font-bold text-sm">
                          {analysis.total_score} M
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono italic">
                          Not logged
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Mock Analysis Form & Details (PDF Pages 150-151) */}
      <div className="bg-paper-card border border-paper-border rounded-lg p-6 shadow-editorial space-y-6">
        
        {/* Form Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-paper-border">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-serif font-bold text-ink">
                Mock {selectedMockNo} Detailed Analysis Sheet
              </span>
              <span className="text-xs bg-paper border border-paper-border px-2 py-0.5 rounded font-mono">
                Scheduled: Day {formData.day} · Analysis: Day {formData.day + 1}
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-1">
              "Give the analysis about as long as the mock took. Mark every question: right, wrong, or skipped."
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-paper border border-paper-border hover:bg-paper-dark text-ink transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'View Mode' : 'Edit Analysis'}</span>
            </button>
            <button
              onClick={handleSaveAnalysis}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded text-xs font-semibold bg-brand-red text-white hover:bg-brand-redDark transition shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Mock {selectedMockNo}</span>
            </button>
          </div>
        </div>

        {/* Top Summary Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-paper p-4 rounded-lg border border-paper-border">
          <div>
            <label className="text-[11px] font-semibold text-ink-muted uppercase">Paper Used</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.paper_name}
              onChange={e => setFormData({ ...formData, paper_name: e.target.value })}
              placeholder="e.g. GATE 2025 Set 1"
              className="w-full mt-1 px-2.5 py-1 text-xs bg-paper-card border border-paper-border rounded font-semibold text-ink disabled:opacity-80"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-ink-muted uppercase">Total Score (Marks)</label>
            <input
              type="number"
              disabled={!isEditing}
              value={formData.total_score}
              onChange={e => setFormData({ ...formData, total_score: Number(e.target.value) })}
              className="w-full mt-1 px-2.5 py-1 text-xs bg-paper-card border border-paper-border rounded font-mono font-bold text-ink disabled:opacity-80"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-ink-muted uppercase">Total Attempted (/65)</label>
            <input
              type="number"
              disabled={!isEditing}
              value={formData.total_attempted}
              onChange={e => setFormData({ ...formData, total_attempted: Number(e.target.value) })}
              className="w-full mt-1 px-2.5 py-1 text-xs bg-paper-card border border-paper-border rounded font-mono text-ink disabled:opacity-80"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-brand-red uppercase">Negative Marks Lost</label>
            <input
              type="number"
              step="0.33"
              disabled={!isEditing}
              value={formData.negative_marks}
              onChange={e => setFormData({ ...formData, negative_marks: Number(e.target.value) })}
              className="w-full mt-1 px-2.5 py-1 text-xs bg-paper-card border border-red-300 text-brand-red font-mono font-bold rounded disabled:opacity-80"
            />
          </div>
        </div>

        {/* 12 Subjects Table Breakdown (PDF Page 150) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-serif font-bold text-ink uppercase tracking-wider">
              Section Breakdown by Subject (12 Subjects)
            </h4>
            <span className="text-[11px] text-ink-muted">
              Record marks, time spent, and weakest chapter
            </span>
          </div>

          <div className="overflow-x-auto border border-paper-border rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper-dark/80 text-ink-muted font-mono uppercase text-[10px] border-b border-paper-border">
                <tr>
                  <th className="p-2.5">Subject</th>
                  <th className="p-2.5 w-20">Attempted</th>
                  <th className="p-2.5 w-16">Right</th>
                  <th className="p-2.5 w-16">Wrong</th>
                  <th className="p-2.5 w-20">Marks</th>
                  <th className="p-2.5 w-20">Minutes</th>
                  <th className="p-2.5">Weakest Chapter in This Subject</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-border bg-paper-card">
                {formData.subject_scores.map((score, sIdx) => (
                  <tr key={score.subject} className="hover:bg-paper/40 transition">
                    <td className="p-2.5 font-mono font-bold text-ink">
                      {score.subject}
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        disabled={!isEditing}
                        value={score.attempted}
                        onChange={e => {
                          const val = Number(e.target.value);
                          const next = [...formData.subject_scores];
                          next[sIdx].attempted = val;
                          setFormData({ ...formData, subject_scores: next });
                        }}
                        className="w-16 px-1.5 py-0.5 text-xs bg-paper border border-paper-border rounded font-mono disabled:bg-transparent disabled:border-none"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        disabled={!isEditing}
                        value={score.right}
                        onChange={e => {
                          const val = Number(e.target.value);
                          const next = [...formData.subject_scores];
                          next[sIdx].right = val;
                          setFormData({ ...formData, subject_scores: next });
                        }}
                        className="w-14 px-1.5 py-0.5 text-xs bg-paper border border-paper-border rounded font-mono text-tier-must font-semibold disabled:bg-transparent disabled:border-none"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        disabled={!isEditing}
                        value={score.wrong}
                        onChange={e => {
                          const val = Number(e.target.value);
                          const next = [...formData.subject_scores];
                          next[sIdx].wrong = val;
                          setFormData({ ...formData, subject_scores: next });
                        }}
                        className="w-14 px-1.5 py-0.5 text-xs bg-paper border border-paper-border rounded font-mono text-brand-red font-semibold disabled:bg-transparent disabled:border-none"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        step="0.33"
                        disabled={!isEditing}
                        value={score.marks}
                        onChange={e => {
                          const val = Number(e.target.value);
                          const next = [...formData.subject_scores];
                          next[sIdx].marks = val;
                          setFormData({ ...formData, subject_scores: next });
                        }}
                        className="w-16 px-1.5 py-0.5 text-xs bg-paper border border-paper-border rounded font-mono font-bold text-ink disabled:bg-transparent disabled:border-none"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        disabled={!isEditing}
                        value={score.minutes}
                        onChange={e => {
                          const val = Number(e.target.value);
                          const next = [...formData.subject_scores];
                          next[sIdx].minutes = val;
                          setFormData({ ...formData, subject_scores: next });
                        }}
                        className="w-16 px-1.5 py-0.5 text-xs bg-paper border border-paper-border rounded font-mono text-ink-muted disabled:bg-transparent disabled:border-none"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={score.weakest_chapter}
                        placeholder="e.g. Cache Mapping"
                        onChange={e => {
                          const val = e.target.value;
                          const next = [...formData.subject_scores];
                          next[sIdx].weakest_chapter = val;
                          setFormData({ ...formData, subject_scores: next });
                        }}
                        className="w-full px-2 py-0.5 text-xs bg-paper border border-paper-border rounded text-ink disabled:bg-transparent disabled:border-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Question Type & Lost Marks by Reason */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Question Types */}
          <div className="bg-paper p-4 rounded-lg border border-paper-border space-y-3">
            <h4 className="text-xs font-serif font-bold text-ink uppercase tracking-wider">
              By Question Type (Accuracy & Negative Cost)
            </h4>
            
            <div className="space-y-2 text-xs">
              {formData.question_types.map((qt, qIdx) => (
                <div key={qt.type} className="flex items-center justify-between p-2 bg-paper-card rounded border border-paper-border">
                  <div>
                    <span className="font-mono font-bold text-ink mr-2">{qt.type}</span>
                    <span className="text-[11px] text-ink-muted">
                      {qt.type === 'MCQ' ? '(Negative marks)' : qt.type === 'MSQ' ? '(No partial marks)' : '(Numerical)'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-ink-muted text-[11px]">Att:</span>
                    <input
                      type="number"
                      disabled={!isEditing}
                      value={qt.attempted}
                      onChange={e => {
                        const next = [...formData.question_types];
                        next[qIdx].attempted = Number(e.target.value);
                        setFormData({ ...formData, question_types: next });
                      }}
                      className="w-12 px-1 py-0.5 bg-paper rounded border border-paper-border text-center disabled:bg-transparent"
                    />
                    <span className="text-ink-muted text-[11px]">Right:</span>
                    <input
                      type="number"
                      disabled={!isEditing}
                      value={qt.right}
                      onChange={e => {
                        const next = [...formData.question_types];
                        next[qIdx].right = Number(e.target.value);
                        setFormData({ ...formData, question_types: next });
                      }}
                      className="w-12 px-1 py-0.5 bg-paper rounded border border-paper-border text-center disabled:bg-transparent text-tier-must font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lost Marks by Reason */}
          <div className="bg-paper p-4 rounded-lg border border-paper-border space-y-3">
            <h4 className="text-xs font-serif font-bold text-ink uppercase tracking-wider">
              Lost Marks by Reason (Where did marks go?)
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { key: 'concept', label: 'Concept', desc: "Didn't know the theory", color: 'text-brand-red' },
                { key: 'silly', label: 'Silly Slip', desc: 'Calculation, sign, units, misread NOT', color: 'text-amber-600' },
                { key: 'time', label: 'Time Crunch', desc: 'Ran out of time / spent >5m', color: 'text-blue-600' },
                { key: 'risky_guess', label: 'Risky Guess', desc: 'MCQ guessed below 50% sure', color: 'text-purple-600' },
              ].map(reason => (
                <div key={reason.key} className="flex items-center justify-between p-2 bg-paper-card rounded border border-paper-border">
                  <div>
                    <span className={`font-bold mr-1.5 ${reason.color}`}>{reason.label}</span>
                    <span className="text-[11px] text-ink-muted">{reason.desc}</span>
                  </div>
                  <div className="flex items-center space-x-1 font-mono">
                    <input
                      type="number"
                      step="0.33"
                      disabled={!isEditing}
                      value={formData.lost_marks_by_reason[reason.key as keyof typeof formData.lost_marks_by_reason]}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          lost_marks_by_reason: {
                            ...formData.lost_marks_by_reason,
                            [reason.key]: Number(e.target.value),
                          },
                        });
                      }}
                      className="w-16 px-1.5 py-0.5 bg-paper rounded border border-paper-border font-bold text-ink text-center disabled:bg-transparent"
                    />
                    <span className="text-[11px] text-ink-muted">M</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action: Two Chapters to Fix Tomorrow */}
        <div className="p-4 bg-brand-redLight/60 border border-brand-red/30 rounded-lg space-y-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-red" />
            <h4 className="text-xs font-serif font-bold text-brand-redDark uppercase tracking-wider">
              Two Chapters to Fix Tomorrow (Action Item)
            </h4>
          </div>
          <p className="text-xs text-ink-muted">
            "Pick the two biggest concept gaps from this mock and re-learn them tomorrow before starting anything else."
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-ink">Chapter 1</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.fix_chapters[0]}
                onChange={e => {
                  const next: [string, string] = [e.target.value, formData.fix_chapters[1]];
                  setFormData({ ...formData, fix_chapters: next });
                }}
                placeholder="e.g. Cache Organisation & Mapping"
                className="w-full mt-1 px-3 py-1.5 bg-paper-card border border-brand-red/40 rounded text-xs font-semibold text-ink disabled:opacity-80"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-ink">Chapter 2</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.fix_chapters[1]}
                onChange={e => {
                  const next: [string, string] = [formData.fix_chapters[0], e.target.value];
                  setFormData({ ...formData, fix_chapters: next });
                }}
                placeholder="e.g. Paging & TLB"
                className="w-full mt-1 px-3 py-1.5 bg-paper-card border border-brand-red/40 rounded text-xs font-semibold text-ink disabled:opacity-80"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
