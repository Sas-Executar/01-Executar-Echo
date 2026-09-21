#!/usr/bin/env python3
import sys,re
from pathlib import Path
if len(sys.argv)!=2:
    print('usage: validate_report.py <report.md>'); sys.exit(2)
p=Path(sys.argv[1]); txt=p.read_text(encoding='utf-8')
required=['Executive synthesis','Object and intent','Evidence base','Framework selection','Framework analyses','Cross-framework synthesis','Gaps, conflicts and limitations','Sources']
missing=[h for h in required if not re.search(r'^#{1,4}\s+.*'+re.escape(h),txt,re.I|re.M)]
framework_ids=re.findall(r'FW-D\d{2}-\d{3}',txt)
if missing:
    print('FAIL | missing sections:',', '.join(missing)); sys.exit(1)
if not framework_ids:
    print('FAIL | no framework IDs found'); sys.exit(1)
print(f'PASS | framework_refs={len(set(framework_ids))}')
