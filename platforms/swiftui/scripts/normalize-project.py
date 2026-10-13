#!/usr/bin/env python3
"""Normalize only the root local-package navigator reference (checkout folder names vary)."""
import hashlib
import pathlib
import re
import sys

project = pathlib.Path(sys.argv[1])
text = project.read_text()
pattern = r'^\t\t([A-F0-9]{24}) /\* .*? \*/ = \{isa = PBXFileReference; lastKnownFileType = folder; name = (?:"[^"]+"|[^;]+); path = \.\./\.\./\.\.; sourceTree = SOURCE_ROOT; \};$'
matches = list(re.finditer(pattern, text, re.MULTILINE))
if len(matches) != 1:
    raise SystemExit('Expected exactly one root-package folder reference; refusing to normalize another project shape.')
old = matches[0].group(1)
stable = hashlib.sha256(b'RosemaryUI root local package navigator reference').hexdigest()[:24].upper()
references = re.compile(re.escape(old) + r' /\* .*? \*/')
if len(references.findall(text)) != 2:
    raise SystemExit('Expected exactly two root-package navigator references; refusing unexpected changes.')
text = references.sub(stable + ' /* RosemaryUI */', text)
text = re.sub(r'(^\t\t' + stable + r' /\* RosemaryUI \*/ = \{isa = PBXFileReference; lastKnownFileType = folder; )name = (?:"[^"]+"|[^;]+);', r'\1name = RosemaryUI;', text, flags=re.MULTILINE)
# XcodeGen sorts file references by UUID; restore that ordering after the one ID changes.
lines = text.splitlines(keepends=True)
entry = next(line for line in lines if line.startswith("\t\t" + stable + " /* RosemaryUI */ ="))
lines.remove(entry)
start = next(i for i,line in enumerate(lines) if '/* Begin PBXFileReference section */' in line) + 1
end = next(i for i,line in enumerate(lines) if '/* End PBXFileReference section */' in line)
position = next((i for i in range(start,end) if re.match(r'\t\t[A-F0-9]{24} ',lines[i]) and lines[i][2:26] > stable),end)
lines.insert(position,entry)
project.write_text(''.join(lines))
