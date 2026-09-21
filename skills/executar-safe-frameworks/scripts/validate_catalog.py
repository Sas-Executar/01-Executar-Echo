#!/usr/bin/env python3
import json, re, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
errors=[]
# SKILL metadata
skill=(ROOT/'SKILL.md').read_text(encoding='utf-8')
lines=skill.splitlines()
if len(lines)>500: errors.append(f'SKILL.md has {len(lines)} lines; expected <=500')
m=re.search(r'^name:\s*(.+)$',skill,re.M)
if not m: errors.append('Missing name in SKILL.md frontmatter')
else:
    name=m.group(1).strip()
    if len(name)>64 or not re.fullmatch(r'[a-z0-9-]+',name): errors.append(f'Invalid skill name: {name}')
md=re.search(r'^description:\s*(.+)$',skill,re.M)
if not md: errors.append('Missing description in SKILL.md frontmatter')
elif_len=len(md.group(1).strip())
if md and elif_len>1024: errors.append(f'Description too long: {elif_len}')
# catalog
domains=json.loads((ROOT/'catalog'/'domains.json').read_text(encoding='utf-8'))
domain_ids={d['id'] for d in domains}
if len(domain_ids)!=23: errors.append(f'Expected 23 domains, got {len(domain_ids)}')
seen_id=set(); seen_name=set(); records=[]
for line_no,line in enumerate((ROOT/'catalog'/'frameworks.jsonl').read_text(encoding='utf-8').splitlines(),1):
    if not line.strip(): continue
    try: r=json.loads(line)
    except Exception as e:
        errors.append(f'Invalid JSON line {line_no}: {e}'); continue
    records.append(r)
    if r['id'] in seen_id: errors.append(f'Duplicate id {r["id"]}')
    seen_id.add(r['id'])
    key=r['name'].casefold()
    if key in seen_name: errors.append(f'Duplicate name {r["name"]}')
    seen_name.add(key)
    if r['domain_id'] not in domain_ids: errors.append(f'Unknown domain for {r["id"]}')
    if not re.fullmatch(r'FW-D\d{2}-\d{3}',r['id']): errors.append(f'Bad ID format {r["id"]}')
    if len(r['purpose'].split())>50: errors.append(f'Purpose >50 words {r["id"]}')
    for d in r.get('related_domains',[]):
        if d not in domain_ids: errors.append(f'Unknown related domain {d} in {r["id"]}')
# direct markdown links
for target in re.findall(r'\]\(([^)]+)\)',skill):
    if target.startswith(('http://','https://','#')): continue
    p=(ROOT/target)
    if not p.exists(): errors.append(f'Missing linked file: {target}')
if errors:
    print('FAIL')
    for e in errors: print('-',e)
    sys.exit(1)
print(f'PASS | domains={len(domain_ids)} frameworks={len(records)} skill_lines={len(lines)}')
