import json
import os

files = [
    'data/chapters.json',
    'data/plan_a.json',
    'data/plan_b.json',
    'data/plan_c.json',
    'data/diagnostic_test.json',
    'data/target_scores.json',
    'data/mock_system.json',
    'data/top_10_chapters.json',
    'data/exam_strategy.json',
    'data/gate_command_center_master.json'
]

print("=== DATASET INTEGRITY & VALIDATION REPORT ===")
for fpath in files:
    size_kb = os.path.getsize(fpath) / 1024
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if isinstance(data, list):
        count_str = f"{len(data)} items"
    elif isinstance(data, dict):
        count_str = f"{len(data.keys())} keys"
    print(f"✓ {fpath:36} | {size_kb:8.2f} KB | {count_str}")

with open('data/chapters.json', 'r', encoding='utf-8') as f:
    ch = json.load(f)

tiers = {'✅': 0, '🟡': 0, '❌': 0}
for c in ch:
    tiers[c['tier']] = tiers.get(c['tier'], 0) + 1

print("\n--- Chapter Tier Breakdown ---")
print(f"✅ Must-Do:      {tiers['✅']} chapters")
print(f"🟡 Basics Only:  {tiers['🟡']} chapters")
print(f"❌ Skip:         {tiers['❌']} chapters")
print(f"Total Chapters:  {len(ch)} chapters")

with open('data/plan_a.json', 'r', encoding='utf-8') as f:
    pa = json.load(f)

total_tasks = sum(len(d['tasks']) for d in pa)
total_revisions = sum(len(d['revisions']) for d in pa)
print(f"\n--- Plan A Breakdown ---")
print(f"Total Days:      {len(pa)}")
print(f"Total Tasks:     {total_tasks}")
print(f"Total Revisions: {total_revisions}")
