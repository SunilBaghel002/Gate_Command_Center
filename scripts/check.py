import json

with open('data/plan_a.json', 'r', encoding='utf-8') as f:
    plan_a = json.load(f)

for day_idx in [0, 13, 60, 84]:
    d = plan_a[day_idx]
    print(f"=== DAY {d['day']} ({d['phase']}) ===")
    print(f"Est Time: {d['estimated_time']}")
    print(f"GA: {d['ga_slot']}")
    print(f"Revisions: {len(d['revisions'])}")
    for r in d['revisions']:
        print(f"   {r['level']} : {r['chapters'][:60]}...")
    print(f"Tasks: {len(d['tasks'])}")
    for t in d['tasks']:
        print(f"  - {t['tier']} [{t['subject']}] {t['title']} | {t['duration']} | {t['pyqs']}")
