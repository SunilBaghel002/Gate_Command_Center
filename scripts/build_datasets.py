import fitz
import re
import json
import math
import os

def extract_skip_list(doc):
    skip_text = ''
    for p in range(8, 13):
        skip_text += '\n' + doc[p].get_text('text')
    pattern = re.compile(r'(?:\n|^)(\d{1,3})\n([✅🟡❌])\n(.*?)(?=(?:\n\d{1,3}\n[✅🟡❌]\n|\Z))', re.DOTALL)
    matches = list(pattern.finditer(skip_text))
    subjects = {'GA', 'EM', 'DM', 'DL', 'COA', 'PDS', 'Algo', 'TOC', 'CD', 'OS', 'DBMS', 'CN'}
    chapters = []
    for m in matches:
        num = int(m.group(1))
        tier = m.group(2)
        body = m.group(3).strip()
        lines = [l.strip() for l in body.split('\n') if l.strip()]
        subj_idx = -1
        for i, line in enumerate(lines):
            if line in subjects:
                subj_idx = i
                break
        if subj_idx != -1:
            name = ' '.join(lines[:subj_idx])
            subj = lines[subj_idx]
            stats = lines[subj_idx+1:subj_idx+5]
            asked = stats[0] if len(stats) > 0 else ''
            marks = stats[1] if len(stats) > 1 else ''
            hours = stats[2] if len(stats) > 2 else ''
            mph = stats[3] if len(stats) > 3 else ''
            chapters.append({
                'id': num,
                'tier': tier,
                'tier_name': 'Must-do' if tier == '✅' else ('Basics only' if tier == '🟡' else 'Skip'),
                'name': name,
                'subject': subj,
                'asked_ratio': asked,
                'marks': marks,
                'hours': hours,
                'marks_per_hour': mph
            })
    return chapters

def parse_day_block(d_num, raw_content, plan_code, plan_name, default_hours):
    subjects_set = {'DM', 'EM', 'DL', 'COA', 'PDS', 'Algo', 'TOC', 'CD', 'OS', 'DBMS', 'CN', 'GA'}
    
    # Clean lines
    lines = [
        l.strip() for l in raw_content.split('\n')
        if l.strip() and 'GATE CSE 2027' not in l and not l.startswith('@@M') and not l.startswith('[[PAGE_')
    ]
    
    time_est = default_hours
    ga_slot = None
    rev_lines = []
    in_revise = False
    task_lines = []
    
    for l in lines:
        if l == 'Date':
            continue
        if l.startswith('~') and 'h' in l and time_est == default_hours:
            time_est = l
        elif l.startswith('GA ') and ('PYQs' in l or 'timed' in l or 'min' in l or 'm ·' in l) and not ga_slot:
            ga_slot = l
        elif l.startswith('Revise R'):
            in_revise = True
            rev_lines.append(l)
        elif in_revise:
            if l in subjects_set or l.startswith('Mock ') or l.startswith('Analyse mock') or l.startswith('Fix what') or l.startswith('Light day') or any(l.startswith(sym) for sym in ['✅', '🟡', '❌']):
                in_revise = False
                task_lines.append(l)
            else:
                rev_lines.append(l)
        elif l in ['Mocks', 'Final revision', 'LEARN + CHAPTER PYQS', 'PYQ MASTERY', 'Week 13 check-in', 'Days done:'] or l.isdigit():
            continue
        elif 'check-in' in l or 'Rows that slipped' in l or 'Catch-up plan' in l or "Next week I'll change" in l:
            continue
        else:
            task_lines.append(l)
            
    revisions = []
    if rev_lines:
        full_rev = ' '.join(rev_lines).replace('Revise ', '')
        parts = re.split(r'\s*·\s*(?=R\d)', full_rev)
        for p in parts:
            m = re.match(r'(R\d)\s+(.*)', p)
            if m:
                revisions.append({'level': m.group(1), 'chapters': m.group(2).strip()})

    # Group task lines
    tasks = []
    current_task = None
    for l in task_lines:
        is_new = False
        if l in subjects_set:
            is_new = True
        elif l.startswith('Mock ') or l.startswith('Analyse mock') or l.startswith('Fix what') or l.startswith('Light day'):
            is_new = True
        elif any(l.startswith(sym) for sym in ['✅', '🟡', '❌']) and (current_task is None or current_task.get('title')):
            is_new = True
            
        if is_new:
            if current_task:
                tasks.append(current_task)
            current_task = {'subject': l if l in subjects_set else 'STUDY', 'lines': [l] if l not in subjects_set else []}
        else:
            if current_task is None:
                current_task = {'subject': 'STUDY', 'lines': [l]}
            else:
                current_task['lines'].append(l)
    if current_task:
        tasks.append(current_task)

    # Refine tasks
    refined = []
    for t in tasks:
        subj = t['subject']
        t_lines = t['lines']
        tier = None
        title = ''
        pyqs = ''
        duration = ''
        lecture = None
        optional = None
        topic_lines = []
        
        for l in t_lines:
            if l == 'Date' or 'check-in' in l or 'Days done:' in l:
                continue
            if not tier and any(l.startswith(sym) for sym in ['✅', '🟡', '❌']):
                tier = l[0]
                title = l[1:].strip()
            elif not title and ('Mock' in l or 'Analyse' in l or 'Fix what' in l or 'Light day' in l or 'sweep' in l or 'revision' in l):
                title = l
            elif not pyqs and ('PYQs' in l or 'PYQ' in l):
                pyqs = l
            elif not duration and re.match(r'^\d+h(\s*\d+m?)?$|^\d+m$', l):
                duration = l
            elif l.startswith('▶'):
                lecture = l.replace('▶', '').strip()
            elif l.startswith('Optional, only if you have time:'):
                optional = l
            elif l.startswith('(only the parts') or l.startswith('(1 video') or l.startswith('(2 videos'):
                if lecture:
                    lecture += ' ' + l
                else:
                    topic_lines.append(l)
            else:
                if not title:
                    title = l
                else:
                    topic_lines.append(l)
                    
        full_topics = ' '.join(topic_lines)
        # filter out check-in junk
        if 'Week ' in full_topics and 'check-in' in full_topics:
            full_topics = full_topics.split('Week ')[0]
        topics = [top.strip() for top in re.split(r'\s*·\s*', full_topics) if top.strip() and not top.startswith('Week ')]
        
        if title and title != 'Date':
            refined.append({
                'subject': subj,
                'tier': tier,
                'tier_name': 'Must-do' if tier == '✅' else ('Basics only' if tier == '🟡' else ('Skip' if tier == '❌' else None)),
                'title': title,
                'duration': duration,
                'pyqs': pyqs,
                'topics': topics,
                'lecture': lecture,
                'optional': optional
            })
            
    # Phase
    if d_num <= 50:
        phase = 'Learn + Chapter PYQs'
    elif d_num <= 60:
        phase = 'PYQ Mastery'
    elif d_num <= 83:
        phase = 'Mocks'
    else:
        phase = 'Final Revision'

    return {
        'day': d_num,
        'week': math.ceil(d_num / 7),
        'phase': phase,
        'plan_code': plan_code,
        'plan_name': plan_name,
        'estimated_time': time_est,
        'ga_slot': ga_slot,
        'revisions': revisions,
        'tasks': refined
    }

def extract_plan(doc, start_page, end_page, plan_code, plan_name, default_daily_hours):
    plan_text = ''
    for p in range(start_page - 1, end_page):
        plan_text += f'\n[[PAGE_{p+1}]]\n' + doc[p].get_text('text')
    
    splits = re.split(r'(?:\n|^)Day\s+(\d{1,2})\b', plan_text)
    days = []
    
    for i in range(1, len(splits), 2):
        d_num = int(splits[i])
        raw_content = splits[i+1].strip()
        day_obj = parse_day_block(d_num, raw_content, plan_code, plan_name, default_daily_hours)
        days.append(day_obj)
        
    return days

def main():
    doc = fitz.open('resources/GATE-CSE-2027-90-Day-Rescue-Plan.pdf')
    print('Processing GATE-CSE-2027-90-Day-Rescue-Plan.pdf...')

    os.makedirs('data', exist_ok=True)

    # 1. Skip List
    chapters = extract_skip_list(doc)
    print(f'Extracted {len(chapters)} chapters.')
    with open('data/chapters.json', 'w', encoding='utf-8') as f:
        json.dump(chapters, f, indent=2)

    # 2. Plans A, B, C
    plan_a = extract_plan(doc, start_page=18, end_page=59, plan_code='A', plan_name='College or a Job', default_daily_hours='~4h')
    print(f'Plan A days extracted: {len(plan_a)}')
    with open('data/plan_a.json', 'w', encoding='utf-8') as f:
        json.dump(plan_a, f, indent=2)

    plan_b = extract_plan(doc, start_page=62, end_page=106, plan_code='B', plan_name='Full Time', default_daily_hours='~8h')
    print(f'Plan B days extracted: {len(plan_b)}')
    with open('data/plan_b.json', 'w', encoding='utf-8') as f:
        json.dump(plan_b, f, indent=2)

    plan_c = extract_plan(doc, start_page=109, end_page=145, plan_code='C', plan_name='Starting from Almost Zero', default_daily_hours='~5h')
    print(f'Plan C days extracted: {len(plan_c)}')
    with open('data/plan_c.json', 'w', encoding='utf-8') as f:
        json.dump(plan_c, f, indent=2)

    # 3. Target Scores
    target_scores = {
        'subjects': [
            {'subject': 'General Aptitude', 'code': 'GA', 'avg_marks': 15.0, 'aim_50': 11.0, 'aim_65': 12.0, 'aim_80': 13.0},
            {'subject': 'Engineering Mathematics', 'code': 'EM', 'avg_marks': 6.9, 'aim_50': 3.0, 'aim_65': 4.5, 'aim_80': 5.5},
            {'subject': 'Discrete Mathematics', 'code': 'DM', 'avg_marks': 7.8, 'aim_50': 3.5, 'aim_65': 5.0, 'aim_80': 6.0},
            {'subject': 'Digital Logic', 'code': 'DL', 'avg_marks': 6.5, 'aim_50': 3.0, 'aim_65': 4.0, 'aim_80': 5.0},
            {'subject': 'Computer Organization and Architecture', 'code': 'COA', 'avg_marks': 7.7, 'aim_50': 3.5, 'aim_65': 5.0, 'aim_80': 6.0},
            {'subject': 'Programming and Data Structures', 'code': 'PDS', 'avg_marks': 9.9, 'aim_50': 4.5, 'aim_65': 5.0, 'aim_80': 8.5},
            {'subject': 'Algorithms', 'code': 'Algo', 'avg_marks': 8.4, 'aim_50': 4.0, 'aim_65': 5.5, 'aim_80': 6.5},
            {'subject': 'Theory of Computation', 'code': 'TOC', 'avg_marks': 8.1, 'aim_50': 3.5, 'aim_65': 5.0, 'aim_80': 6.5},
            {'subject': 'Compiler Design', 'code': 'CD', 'avg_marks': 6.1, 'aim_50': 3.0, 'aim_65': 4.0, 'aim_80': 5.0},
            {'subject': 'Operating System', 'code': 'OS', 'avg_marks': 8.4, 'aim_50': 4.0, 'aim_65': 5.5, 'aim_80': 6.5},
            {'subject': 'Databases', 'code': 'DBMS', 'avg_marks': 7.1, 'aim_50': 3.5, 'aim_65': 4.5, 'aim_80': 5.5},
            {'subject': 'Computer Networks', 'code': 'CN', 'avg_marks': 7.6, 'aim_50': 3.5, 'aim_65': 5.0, 'aim_80': 6.0}
        ],
        'totals': {'avg_marks': 99.5, 'aim_50': 50.0, 'aim_65': 65.0, 'aim_80': 80.0}
    }
    with open('data/target_scores.json', 'w', encoding='utf-8') as f:
        json.dump(target_scores, f, indent=2)

    # 4. Diagnostic Test
    diagnostic_test = {
        'instructions': 'Five minutes a subject, an hour in all, before Day 1. For each chapter below, write down from memory the main method or formula and the kind of question GATE asks. Tick the box only if you could do it without looking.',
        'subjects': [
            {'code': 'GA', 'name': 'General Aptitude', 'checks': ['Reading Comprehension & Verbal Reasoning', 'Numerical Relations & Puzzles', 'Analogy & Coding-Decoding']},
            {'code': 'EM', 'name': 'Engineering Mathematics', 'checks': ['Basic Probability', 'Eigenvalues & Eigenvectors', 'Random Variables, Expectation & Variance']},
            {'code': 'DM', 'name': 'Discrete Mathematics', 'checks': ['Graph Colouring', 'Connectivity', 'Monoids & Groups']},
            {'code': 'DL', 'name': 'Digital Logic', 'checks': ['Multiplexers, Decoders & Encoders', 'Boolean Algebra & Logic Gates', 'K-Map Minimisation']},
            {'code': 'COA', 'name': 'Computer Organization and Architecture', 'checks': ['Cache Organisation & Mapping', 'Pipeline Performance & Speedup', 'Cache Performance & Write Policies']},
            {'code': 'PDS', 'name': 'Programming and Data Structures', 'checks': ['C Basics: Operators, Expressions and Control Flow', 'Binary Search Trees', 'Recursion']},
            {'code': 'Algo', 'name': 'Algorithms', 'checks': ['Minimum Spanning Trees', 'Graph Traversals: BFS and DFS', 'Hashing']},
            {'code': 'TOC', 'name': 'Theory of Computation', 'checks': ['Identifying the Language Class', 'Context-Free Grammars', 'Closure Properties']},
            {'code': 'CD', 'name': 'Compiler Design', 'checks': ['Phases of a Compiler', 'Syntax-Directed Translation', 'Bottom-Up Parsing: LR(0), SLR, LALR, CLR']},
            {'code': 'OS', 'name': 'Operating System', 'checks': ['Paging, Page Tables & TLB', 'CPU Scheduling', 'Processes, Threads & IPC']},
            {'code': 'DBMS', 'name': 'Databases', 'checks': ['SQL', 'Functional Dependencies, Closures & Keys', 'Conflict & View Serializability']},
            {'code': 'CN', 'name': 'Computer Networks', 'checks': ['IPv4 Header & Fragmentation', 'Flow Control: Stop-and-Wait, GBN & SR', 'Delays, Throughput & Performance Metrics']}
        ],
        'total_checks': 36,
        'recommendations': [
            {'condition': 'Under 12 ticks', 'plan': 'Plan C', 'reason': 'Start from the must-do chapters and the basics they need. Gets the most-asked marks first.'},
            {'condition': '12 or more, ~4 h a day', 'plan': 'Plan A', 'reason': 'You know your basics and have college or a job.'},
            {'condition': '12 or more, full time', 'plan': 'Plan B', 'reason': 'Every chapter in the syllabus, must-do in full.'},
            {'condition': '0 or 1 tick in a subject', 'plan': 'Any plan', 'reason': 'Watch the full lectures for that subject must-do chapters. Do not skim them.'}
        ]
    }
    with open('data/diagnostic_test.json', 'w', encoding='utf-8') as f:
        json.dump(diagnostic_test, f, indent=2)

    # 5. Mock System
    mock_system = {
        'calendar': [
            {'mock_no': 1, 'day': 61, 'analysis_day': 62, 'block': 1, 'paper_recommendation': 'GATE 2024 Set 1 or Test Series Full Mock 1'},
            {'mock_no': 2, 'day': 64, 'analysis_day': 65, 'block': 1, 'paper_recommendation': 'GATE 2024 Set 2 or Test Series Full Mock 2'},
            {'mock_no': 3, 'day': 67, 'analysis_day': 68, 'block': 1, 'paper_recommendation': 'GATE 2025 Set 1 or Test Series Full Mock 3'},
            {'mock_no': 4, 'day': 70, 'analysis_day': 71, 'block': 2, 'paper_recommendation': 'GATE 2025 Set 2 or Test Series Full Mock 4'},
            {'mock_no': 5, 'day': 73, 'analysis_day': 74, 'block': 2, 'paper_recommendation': 'GATE 2026 Set 1 or Test Series Full Mock 5'},
            {'mock_no': 6, 'day': 76, 'analysis_day': 77, 'block': 2, 'paper_recommendation': 'GATE 2026 Set 2 or Test Series Full Mock 6'},
            {'mock_no': 7, 'day': 79, 'analysis_day': 80, 'block': 3, 'paper_recommendation': 'Test Series Advanced Mock 7'},
            {'mock_no': 8, 'day': 82, 'analysis_day': 83, 'block': 3, 'paper_recommendation': 'Test Series Advanced Mock 8'},
            {'mock_no': 9, 'day': 85, 'analysis_day': 86, 'block': 3, 'paper_recommendation': 'Final Comprehensive Exam Replica (The Last Mock)'}
        ],
        'blocks': [
            {'title': 'Block 1 (Mocks 1–3)', 'mocks': [1, 2, 3], 'target_focus': 'Diagnostic Baseline & Stamina. Learn to sit 3 hours at your exam slot.'},
            {'title': 'Block 2 (Mocks 4–6)', 'mocks': [4, 5, 6], 'target_focus': 'Accuracy & Negative Mark Reduction. Keep MCQ negative marks under 3.'},
            {'title': 'Block 3 (Mocks 7–9)', 'mocks': [7, 8, 9], 'target_focus': 'Speed, Final Calibration & Exam Day Strategy.'}
        ],
        'error_reasons': [
            {'reason': 'Concept', 'meaning': "Didn't know the concept", 'action': 'Re-learn the chapter from notes, solve all PYQs again. Fix ✅ chapters first.'},
            {'reason': 'Silly', 'meaning': 'Knew it, slipped (units, sign, misread NOT)', 'action': 'Write exact slip on sticky note, review before next mock.'},
            {'reason': 'Time', 'meaning': 'Ran out of time / spent >5 min', 'action': 'Any question past 5 minutes should have been marked and left.'},
            {'reason': 'Risky guess', 'meaning': 'MCQ answered below 50% certainty', 'action': 'Answer only when two options are ruled out. Keep MCQ negatives below 3 marks.'}
        ],
        'question_types': [
            {'type': 'MCQ', 'name': 'Multiple Choice Questions', 'rules': '+1 or +2 marks, -0.33 or -0.66 negative mark. Rule out 2 options before guessing.'},
            {'type': 'MSQ', 'name': 'Multiple Select Questions', 'rules': 'No negative marks, no partial marks. Judge each option independently like 4 True/False statements.'},
            {'type': 'NAT', 'name': 'Numerical Answer Type', 'rules': 'No negative marks. Keep precision while working, round once at the end. Verify units (ms vs μs, bits vs bytes).'}
        ],
        'subjects': ['GA', 'EM', 'DM', 'DL', 'COA', 'PDS', 'Algo', 'TOC', 'CD', 'OS', 'DBMS', 'CN']
    }
    with open('data/mock_system.json', 'w', encoding='utf-8') as f:
        json.dump(mock_system, f, indent=2)

    # 6. Top 10 Chapters
    top_10 = [
        {'rank': 1, 'name': 'Cache Organisation & Mapping', 'subject': 'COA', 'years_asked': '12/13', 'pyqs': 30, 'marks_per_paper': 1.8},
        {'rank': 2, 'name': 'Paging, Page Tables & TLB', 'subject': 'OS', 'years_asked': '11/13', 'pyqs': 24, 'marks_per_paper': 1.7},
        {'rank': 3, 'name': 'Minimum Spanning Trees', 'subject': 'Algo', 'years_asked': '10/13', 'pyqs': 24, 'marks_per_paper': 1.6},
        {'rank': 4, 'name': 'Graph Traversals: BFS and DFS', 'subject': 'Algo', 'years_asked': '10/13', 'pyqs': 23, 'marks_per_paper': 1.4},
        {'rank': 5, 'name': 'CPU Scheduling', 'subject': 'OS', 'years_asked': '12/13', 'pyqs': 25, 'marks_per_paper': 1.4},
        {'rank': 6, 'name': 'Pointers and Arrays', 'subject': 'PDS', 'years_asked': '12/13', 'pyqs': 23, 'marks_per_paper': 1.4},
        {'rank': 7, 'name': 'Binary Search Trees', 'subject': 'PDS', 'years_asked': '10/13', 'pyqs': 23, 'marks_per_paper': 1.3},
        {'rank': 8, 'name': 'C Basics: Operators, Expressions and Control Flow', 'subject': 'PDS', 'years_asked': '10/13', 'pyqs': 20, 'marks_per_paper': 1.3},
        {'rank': 9, 'name': 'Recursion', 'subject': 'PDS', 'years_asked': '11/13', 'pyqs': 22, 'marks_per_paper': 1.3},
        {'rank': 10, 'name': 'Pipeline Performance & Speedup', 'subject': 'COA', 'years_asked': '11/13', 'pyqs': 20, 'marks_per_paper': 1.2}
    ]
    with open('data/top_10_chapters.json', 'w', encoding='utf-8') as f:
        json.dump(top_10, f, indent=2)

    # 7. Exam Strategy
    exam_strategy = {
        'time_blocks': [
            {'block': 'General Aptitude', 'time': '15–20 min', 'strategy': 'The easiest marks. Skip any GA question that takes >3 min; come back later.'},
            {'block': 'Pass 1, Subjects', 'time': '~75–80 min', 'strategy': 'Every question you can finish in 2–3 min. Decide in 20 sec: now, later, or skip.'},
            {'block': 'Pass 2', 'time': '~50–55 min', 'strategy': 'The "later" pile: you know the method but it takes multi-step computation.'},
            {'block': 'Pass 3', 'time': '~15–20 min', 'strategy': 'Review marked questions, check numerical entries, avoid wild guesses on MCQs.'}
        ],
        'the_last_7_days': [
            {'day': 84, 'focus': 'General Aptitude, Engineering Maths and Discrete Maths: formulas, short notes, error log, 10 mixed PYQs each.'},
            {'day': 85, 'focus': 'Mock 9: the last full mock at your exam slot.'},
            {'day': 86, 'focus': 'Quick analysis of mock 9 (mistakes only), then Digital Logic and COA.'},
            {'day': 87, 'focus': 'Programming & Data Structures, Algorithms and TOC.'},
            {'day': 88, 'focus': 'Compiler Design and Operating Systems.'},
            {'day': 89, 'focus': 'DBMS and Computer Networks, then read your entire Weak-Topic Log.'},
            {'day': 90, 'focus': 'Light Day: Formula pages only. Print admit card, pack photo ID, check center route. Sleep early.'}
        ]
    }
    with open('data/exam_strategy.json', 'w', encoding='utf-8') as f:
        json.dump(exam_strategy, f, indent=2)

    # 8. Master Manifest
    master_manifest = {
        'project': 'Gate Command Center',
        'edition': 'GATE CSE 2027 · 90-Day Rescue Plan Edition 1',
        'stats': {
            'total_chapters': len(chapters),
            'must_do_chapters': len([c for c in chapters if c['tier'] == '✅']),
            'basics_only_chapters': len([c for c in chapters if c['tier'] == '🟡']),
            'skip_chapters': len([c for c in chapters if c['tier'] == '❌']),
            'plan_a_days': len(plan_a),
            'plan_b_days': len(plan_b),
            'plan_c_days': len(plan_c),
            'total_mocks': len(mock_system['calendar'])
        },
        'chapters': chapters,
        'plans': {
            'A': plan_a,
            'B': plan_b,
            'C': plan_c
        },
        'mock_system': mock_system,
        'target_scores': target_scores,
        'diagnostic_test': diagnostic_test,
        'top_10_chapters': top_10,
        'exam_strategy': exam_strategy
    }
    with open('data/gate_command_center_master.json', 'w', encoding='utf-8') as f:
        json.dump(master_manifest, f, indent=2)
    print('All datasets successfully generated in /data!')

if __name__ == '__main__':
    main()
