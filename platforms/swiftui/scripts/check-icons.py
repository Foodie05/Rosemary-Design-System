#!/usr/bin/env python3
"""Validate literal SDK and consumer icon references against the actual shared catalog."""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[3]
icons=json.loads((root/'design/icons.json').read_text())
errors=[]
count=0
for path in (root/'platforms/swiftui').rglob('*.swift'):
    if 'Generated' in path.parts: continue
    text=path.read_text()
    for name in re.findall(r'Rosemary(?:Icon|IconButton)\("([^"\\]+)"',text):
        count+=1
        if name not in icons: errors.append(f'{path.relative_to(root)}: unknown icon {name}')
if errors: raise SystemExit('\n'.join(errors))
print(f'Validated {count} literal SwiftUI icon calls against {len(icons)} generated icons.')
