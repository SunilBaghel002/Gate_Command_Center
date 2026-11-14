'use client';

import React, { useState } from 'react';
import { UserState } from '@/lib/storage';
import { WeakTopicItem } from '@/types';
import { chapters } from '@/lib/data';
import { 
  Flame, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Filter, 
  Search, 
  Trash2, 
  AlertTriangle,
  Calendar,
  Sparkles
} from 'lucide-react';

interface WeakTopicLogProps {
  userState: UserState;
  onUpdateState: (updater: (prev: UserState) => UserState) => void;
  isOpenModalDirectly?: boolean;
  onCloseModal?: () => void;
  defaultChapter?: string;
  defaultSubject?: string;
}

export const WeakTopicLog: React.FC<WeakTopicLogProps> = ({
  userState,
  onUpdateState,
  isOpenModalDirectly,
  onCloseModal,
  defaultChapter = '',
  defaultSubject = '',
}) => {
  const [filterResolved, setFilterResolved] = useState<'all' | 'pending' | 'resolved'>('all');
  const [filterReason, setFilterReason] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // New Item Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(!!isOpenModalDirectly);
  const [newChapter, setNewChapter] = useState<string>(defaultChapter);
  const [newSubject, setNewSubject] = useState<string>(defaultSubject || 'DM');
  const [newWhatWentWrong, setNewWhatWentWrong] = useState<string>('');
  const [newReason, setNewReason] = useState<'Concept' | 'Silly' | 'Time' | 'Risky guess'>('Concept');

  // Filter items
  const filteredTopics = userState.weakTopics.filter(item => {
    if (filterResolved === 'pending' && item.resolved) return false;
    if (filterResolved === 'resolved' && !item.resolved) return false;
    if (filterReason !== 'all' && item.reason !== filterReason) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.chapter.toLowerCase().includes(q) ||
        item.what_went_wrong.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Toggle resolved
  const toggleResolved = (id: string) => {
    onUpdateState(prev => ({
      ...prev,
      weakTopics: prev.weakTopics.map(item => {
        if (item.id === id) {
          const nextResolved = !item.resolved;
          return {
            ...item,
            resolved: nextResolved,
            fixed_date: nextResolved ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return item;
      }),
    }));
  };

  // Delete
  const deleteItem = (id: string) => {
    if (confirm('Delete this mistake log entry?')) {
      onUpdateState(prev => ({
        ...prev,
        weakTopics: prev.weakTopics.filter(item => item.id !== id),
      }));
    }
  };

  // Add new
  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapter.trim() || !newWhatWentWrong.trim()) return;

    // Lookup chapter tier if exists in chapters.json
    const foundCh = chapters.find(c => c.name.toLowerCase() === newChapter.trim().toLowerCase());

    const newItem: WeakTopicItem = {
      id: 'err_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      day: userState.currentDay,
      chapter: newChapter.trim(),
      subject: foundCh?.subject || newSubject,
      tier: foundCh?.tier,
      what_went_wrong: newWhatWentWrong.trim(),
      reason: newReason,
      logged_date: new Date().toISOString().split('T')[0],
      resolved: false,
    };

    onUpdateState(prev => ({
      ...prev,
      weakTopics: [newItem, ...prev.weakTopics],
    }));

    setNewWhatWentWrong('');
    setIsModalOpen(false);
    if (onCloseModal) onCloseModal();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title & Instructions Banner */}
      <div className="bg-paper-card border border-paper-border rounded-lg p-5 sm:p-6 shadow-editorial">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-serif font-black text-ink">
                Weak-Topic Vault & Error Log
              </span>
              <span className="text-xs bg-brand-red text-white font-mono px-2 py-0.5 rounded font-bold">
                PDF Pages 158–159
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              "Every mark you lose in a PYQ set or a mock gets a line here. Fix the ✅ chapters first. Read the whole log on Day 89."
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-brand-red text-white text-xs font-semibold rounded hover:bg-brand-redDark transition shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Mistake</span>
          </button>
        </div>

        {/* Stats strip */}
        <div className="mt-4 pt-3 border-t border-paper-border flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-ink-muted">Total Errors Logged: </span>
            <strong className="text-ink">{userState.weakTopics.length}</strong>
          </div>
          <div>
            <span className="text-ink-muted">Pending Fixes: </span>
            <strong className="text-brand-red">
              {userState.weakTopics.filter(w => !w.resolved).length}
            </strong>
          </div>
          <div>
            <span className="text-ink-muted">Resolved: </span>
            <strong className="text-tier-must">
              {userState.weakTopics.filter(w => w.resolved).length}
            </strong>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-paper-card border border-paper-border rounded-lg p-4 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-ink-muted absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by chapter, concept or mistake..."
            className="w-full pl-8 pr-3 py-1.5 bg-paper rounded border border-paper-border text-xs text-ink focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="flex bg-paper p-0.5 rounded border border-paper-border">
            {(['all', 'pending', 'resolved'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setFilterResolved(mode)}
                className={`px-2.5 py-1 rounded capitalize font-medium transition ${
                  filterResolved === mode
                    ? 'bg-ink text-paper font-bold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Reason filter */}
          <select
            value={filterReason}
            onChange={e => setFilterReason(e.target.value)}
            className="bg-paper border border-paper-border rounded px-2.5 py-1 text-ink focus:outline-none cursor-pointer"
          >
            <option value="all">All Reasons</option>
            <option value="Concept">Concept</option>
            <option value="Silly">Silly Slip</option>
            <option value="Time">Time</option>
            <option value="Risky guess">Risky Guess</option>
          </select>
        </div>
      </div>

      {/* Errors Table / List */}
      <div className="bg-paper-card border border-paper-border rounded-lg overflow-hidden shadow-editorial">
        {filteredTopics.length === 0 ? (
          <div className="p-8 text-center text-xs text-ink-muted space-y-2">
            <Sparkles className="w-8 h-8 text-brand-red mx-auto opacity-40" />
            <p className="font-semibold text-ink">No weak topics found in this view.</p>
            <p>Log any questions you get wrong during daily PYQ sets or mock tests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper-dark/80 text-ink-muted font-mono uppercase text-[10px] border-b border-paper-border">
                <tr>
                  <th className="p-3 w-10 text-center">✓</th>
                  <th className="p-3 w-16">Day</th>
                  <th className="p-3 w-48">Chapter & Subject</th>
                  <th className="p-3">What Went Wrong</th>
                  <th className="p-3 w-28">Reason</th>
                  <th className="p-3 w-28">Fixed On</th>
                  <th className="p-3 w-10 text-center">Del</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-border bg-paper-card">
                {filteredTopics.map(item => (
                  <tr 
                    key={item.id} 
                    className={`transition hover:bg-paper/40 ${item.resolved ? 'bg-paper/20 opacity-70' : ''}`}
                  >
                    {/* Toggle resolved */}
                    <td className="p-3 text-center">
                      <button onClick={() => toggleResolved(item.id)}>
                        {item.resolved ? (
                          <CheckCircle2 className="w-4 h-4 text-tier-must fill-tier-mustBg" />
                        ) : (
                          <Circle className="w-4 h-4 text-paper-border hover:text-ink" />
                        )}
                      </button>
                    </td>

                    {/* Day */}
                    <td className="p-3 font-mono font-bold text-ink">
                      Day {item.day}
                    </td>

                    {/* Chapter & Subject */}
                    <td className="p-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] bg-ink text-paper px-1.5 py-0.2 rounded font-mono font-bold">
                          {item.subject}
                        </span>
                        {item.tier && (
                          <span className={`text-[10px] px-1 rounded font-mono ${
                            item.tier === '✅' ? 'text-tier-must font-bold' : 'text-tier-basics'
                          }`}>
                            {item.tier}
                          </span>
                        )}
                      </div>
                      <div className={`font-semibold mt-0.5 ${item.resolved ? 'line-through text-ink-muted' : 'text-ink'}`}>
                        {item.chapter}
                      </div>
                    </td>

                    {/* What went wrong */}
                    <td className={`p-3 ${item.resolved ? 'line-through text-ink-muted' : 'text-ink-light'}`}>
                      {item.what_went_wrong}
                    </td>

                    {/* Reason */}
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        item.reason === 'Concept'
                          ? 'bg-red-50 text-brand-red border border-red-200'
                          : item.reason === 'Silly'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : item.reason === 'Time'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {item.reason}
                      </span>
                    </td>

                    {/* Fixed date */}
                    <td className="p-3 font-mono text-[11px] text-ink-muted">
                      {item.fixed_date || '—'}
                    </td>

                    {/* Delete */}
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="text-ink-muted hover:text-brand-red transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Mistake Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-paper-card border border-paper-border rounded-lg max-w-lg w-full p-6 shadow-elevated space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-paper-border">
              <h3 className="font-serif font-bold text-base text-ink">
                Log New Error in Weak-Topic Vault
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseModal) onCloseModal();
                }}
                className="text-ink-muted hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNew} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink">Chapter Name</label>
                <input
                  type="text"
                  required
                  value={newChapter}
                  onChange={e => setNewChapter(e.target.value)}
                  placeholder="e.g. Cache Organisation & Mapping"
                  className="w-full mt-1 px-3 py-1.5 bg-paper rounded border border-paper-border text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ink">Subject</label>
                  <select
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="w-full mt-1 px-2.5 py-1.5 bg-paper rounded border border-paper-border text-ink"
                  >
                    {['DM', 'EM', 'DL', 'COA', 'PDS', 'Algo', 'TOC', 'CD', 'OS', 'DBMS', 'CN', 'GA'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-ink">Mistake Reason</label>
                  <select
                    value={newReason}
                    onChange={e => setNewReason(e.target.value as any)}
                    className="w-full mt-1 px-2.5 py-1.5 bg-paper rounded border border-paper-border text-ink"
                  >
                    <option value="Concept">Concept (Didn't know)</option>
                    <option value="Silly">Silly Slip (Calculation/units)</option>
                    <option value="Time">Time (Ran out)</option>
                    <option value="Risky guess">Risky Guess (&lt;50% sure)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-ink">What Went Wrong (Exact Slip or Theory Gap)</label>
                <textarea
                  required
                  rows={3}
                  value={newWhatWentWrong}
                  onChange={e => setNewWhatWentWrong(e.target.value)}
                  placeholder="e.g. Confused write-through vs write-back dirty bit penalty, lost 2 marks."
                  className="w-full mt-1 px-3 py-1.5 bg-paper rounded border border-paper-border text-ink resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onCloseModal) onCloseModal();
                  }}
                  className="px-3 py-1.5 bg-paper border border-paper-border rounded text-ink hover:bg-paper-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-red text-white font-semibold rounded hover:bg-brand-redDark shadow-sm"
                >
                  Save Mistake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
