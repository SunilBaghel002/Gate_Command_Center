# GATE Command Center (GATE CSE 2027 · 90-Day Rescue Plan)

The definitive, interactive web dashboard built from the **GATE CSE 2027 90-Day Rescue Plan** (160 pages), built on statistical analysis of 1,840 past questions across 13 papers (2008–2026).

---

## 🎨 Theme & Aesthetic
- **Warm Editorial Newsprint Palette:** `#F4EFE6` (Paper), `#16171D` (Deep Ink), `#D8412F` (Crimson brand accent).
- **Tier Indicators:**
  - ✅ **Must-Do (64 Chapters, ~185h, ~62 Marks):** Emerald Green (`#0F9E63`)
  - 🟡 **Basics Only (76 Chapters):** Amber Ochre (`#C98200`)
  - ❌ **Skip / Low-ROI (38 Chapters):** Muted Terracotta (`#B93826`)

---

## 🚀 Key Modules
1. **Interactive Daily Board (Days 1 to 90):**
   - Checkbox execution tracking for daily GA slots, spaced repetition ($R_1 \to R_5$), theory concepts, and PYQs.
   - 1-Click YouTube lecture launcher with 1.5× timestamp recommendations.
   - Built-in Catch-Up Rule advisor (+2h/day max limit within the week).
2. **9 Mock Hub & Analysis Studio (Days 61 to 85):**
   - Scheduled 3-day rhythm (Mock $\to$ Analysis $\to$ Fix).
   - Complete 12-subject score breakdown table (GA, EM, DM, DL, COA, PDS, Algo, TOC, CD, OS, DBMS, CN).
   - Question type analysis: MCQ (-0.33/-0.66 negative marking), MSQ, NAT.
   - Error categorization: Concept vs. Silly Slip vs. Time Crunch vs. Risky Guess.
   - "Two Chapters to Fix Tomorrow" action loop.
   - Mock score trendline chart tracking against Target 50, Target 65, and Target 80+ lines.
3. **Weak-Topic Vault & Error Log (Pages 158–159):**
   - Digital log for every question missed in daily practice or mocks.
   - Filter by Tier (✅ Must-Do priority filter) and resolution status.
4. **The Skip List Explorer (178 Chapters):**
   - Searchable, filterable by Tier, Subject, and sortable by Marks/Hour ROI.
5. **Pre-Flight Diagnostic Test ("Where Do You Stand?"):**
   - 36 active recall checks across 12 subjects with automated track recommendation (<12 ticks $\to$ Plan C, $\ge 12$ ticks $\to$ Plan A/B).
6. **Top 10 High-Yield Chapters:**
   - Detailed breakdown of the 10 chapters worth ~14.4 marks per paper.
7. **Exam Day Strategy:**
   - 3-hour clock breakdown (3-pass rule) and the Last 7 Days checklist.

---

## 💻 Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## ☁️ Deployment on Vercel
1. Push repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Framework Preset: **Next.js** (auto-detected).
4. Click **Deploy**.
