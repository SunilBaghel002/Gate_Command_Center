'use client';

import React, { useState } from 'react';
import { chapters, top10Chapters } from '@/lib/data';
import { Chapter, Tier } from '@/types';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const SkipListExplorer: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'id' | 'mph' | 'asked' | 'marks'>('id');

  const top10Names = new Set(top10Chapters.map(t => t.name.toLowerCase()));

  // Filter & Sort
  const filtered = chapters.filter(c => {
    if (selectedTier !== 'all' && c.tier !== selectedTier) return false;
    if (selectedSubject !== 'all' && c.subject !== selectedSubject) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q);
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'mph') {
      const vA = parseFloat(a.marks_per_hour) || 0;
      const vB = parseFloat(b.marks_per_hour) || 0;
      return vB - vA;
    }
    if (sortBy === 'marks') {
      const vA = parseFloat(a.marks) || 0;
      const vB = parseFloat(b.marks) || 0;
      return vB - vA;
    }
    if (sortBy === 'asked') {
      const vA = parseInt(a.asked_ratio.split('/')[0]) || 0;
      const vB = parseInt(b.asked_ratio.split('/')[0]) || 0;
      return vB - vA;
    }
    return a.id - b.id;
  });

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-paper-card border border-paper-border rounded-lg p-5 sm:p-6 shadow-editorial">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-serif font-black text-ink">
                The Skip List (All 178 Chapters)
              </span>
              <span className="text-xs bg-ink text-paper font-mono px-2 py-0.5 rounded font-bold">
                ROI Ranked
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              "Ranked by marks per hour: the expected marks a chapter brings in an average paper for every hour it takes to study."
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 bg-tier-mustBg text-tier-must border border-tier-mustBorder rounded font-bold">
              ✅ 64 Must-Do (~185h · ~62 Marks)
            </span>
            <span className="px-2.5 py-1 bg-tier-basicsBg text-tier-basics border border-tier-basicsBorder rounded font-bold">
              🟡 76 Basics Only
            </span>
            <span className="px-2.5 py-1 bg-tier-skipBg text-tier-skip border border-tier-skipBorder rounded font-bold">
              ❌ 38 Skip
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-paper-card border border-paper-border rounded-lg p-4 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-ink-muted absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search chapters (e.g. Cache, Paging, Trees)..."
            className="w-full pl-8 pr-3 py-1.5 bg-paper rounded border border-paper-border text-ink focus:outline-none"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tier filter */}
          <select
            value={selectedTier}
            onChange={e => setSelectedTier(e.target.value)}
            className="bg-paper border border-paper-border rounded px-2.5 py-1.5 text-ink cursor-pointer"
          >
            <option value="all">All Tiers (178)</option>
            <option value="✅">✅ Must-Do (64)</option>
            <option value="🟡">🟡 Basics Only (76)</option>
            <option value="❌">❌ Skip (38)</option>
          </select>

          {/* Subject filter */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="bg-paper border border-paper-border rounded px-2.5 py-1.5 text-ink cursor-pointer font-mono"
          >
            <option value="all">All Subjects</option>
            {['GA', 'EM', 'DM', 'DL', 'COA', 'PDS', 'Algo', 'TOC', 'CD', 'OS', 'DBMS', 'CN'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-paper border border-paper-border rounded px-2.5 py-1.5 text-ink cursor-pointer font-mono font-medium"
          >
            <option value="id">Sort by: Rank (#)</option>
            <option value="mph">Sort by: Marks/Hour</option>
            <option value="asked">Sort by: Papers Asked</option>
            <option value="marks">Sort by: Expected Marks</option>
          </select>
        </div>

      </div>

      {/* Chapters Table */}
      <div className="bg-paper-card border border-paper-border rounded-lg overflow-hidden shadow-editorial">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper-dark/80 text-ink-muted font-mono uppercase text-[10px] border-b border-paper-border">
              <tr>
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3 w-20">Tier</th>
                <th className="p-3 w-16">Subject</th>
                <th className="p-3">Chapter Name</th>
                <th className="p-3 w-24 text-center">Asked (2014–26)</th>
                <th className="p-3 w-20 text-center">Marks</th>
                <th className="p-3 w-20 text-center">Hours</th>
                <th className="p-3 w-24 text-center font-bold text-ink">Marks/Hour</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-border bg-paper-card">
              {filtered.map(ch => {
                const isTop10 = top10Names.has(ch.name.toLowerCase());

                return (
                  <tr key={ch.id} className="hover:bg-paper/50 transition">
                    <td className="p-3 font-mono font-bold text-ink-muted text-center">
                      {ch.id}
                    </td>

                    <td className="p-3 font-mono font-semibold">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${
                        ch.tier === '✅'
                          ? 'bg-tier-mustBg text-tier-must border-tier-mustBorder'
                          : ch.tier === '🟡'
                          ? 'bg-tier-basicsBg text-tier-basics border-tier-basicsBorder'
                          : 'bg-tier-skipBg text-tier-skip border-tier-skipBorder'
                      }`}>
                        {ch.tier} {ch.tier_name}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-bold text-ink">
                      {ch.subject}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-ink text-sm">
                          {ch.name}
                        </span>
                        {isTop10 && (
                          <span className="text-[10px] bg-brand-red text-white font-mono px-1.5 py-0.2 rounded font-bold shrink-0">
                            ★ Top 10
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 font-mono text-center text-ink-light">
                      {ch.asked_ratio}
                    </td>

                    <td className="p-3 font-mono text-center text-ink font-semibold">
                      {ch.marks}
                    </td>

                    <td className="p-3 font-mono text-center text-ink-muted">
                      {ch.hours} h
                    </td>

                    <td className="p-3 font-mono text-center font-bold text-brand-red text-sm">
                      {ch.marks_per_hour}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
