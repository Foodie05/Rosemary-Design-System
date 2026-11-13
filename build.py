#!/usr/bin/env python3
"""Build the editable portal, validated SVG resources, and an offline HTML deliverable."""
from pathlib import Path
import base64
import hashlib
import html
import io
import json
import re
import struct
import subprocess
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parent
SCRIPTS = ['assets-data.js', 'vendor/material-color-utilities.js', 'color-engine.js', 'icon-library.js', 'component-catalog.js', 'ui.js', 'input-validation.js',
           'motion-physics.js', 'motion.js', 'layout-motion.js', 'field-focus.js', 'custom-select.js', 'component-demos.js', 'component-viewer.js', 'pages.js', 'color-studio.js', 'overview-page.js',
           'asset-pages.js', 'component-pages.js', 'loading-motion-pages.js',
           'reference-pages.js', 'subbrand-page.js', 'case-studies-page.js', 'sdk-page.js', 'interaction-lab.js', 'app.js']
STYLES = ['tokens.css', 'styles.css', 'specifications.css', 'component-demos.css', 'navigation.css', 'custom-select.css', 'brand-lockup.css', 'forma-home.css', 'selection-controls.css', 'subbrand-page.css', 'sdk-page.css', 'surfaces.css', 'color-roles.css', 'color-system.css', 'case-studies-page.css', 'physical-motion.css', 'field-focus.css', 'shell-interactions.css', 'layout-motion.css', 'input-validation.css']
ICON_COUNT = len(json.loads((ROOT / 'design/icons.json').read_text(encoding='utf-8')))
ZIP_TIMESTAMP = (2026, 10, 11, 0, 0, 0)


def authored_registry(filename, expression):
    script = "const fs=require('node:fs'),vm=require('node:vm');const context={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),context);console.log(JSON.stringify(" + expression + "));"
    result = subprocess.run(['node', '-e', script, str(ROOT / filename)], check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def icon_resources():
    icons = authored_registry('icon-library.js', 'context.window.RosemaryIconLibrary.icons')
    catalog = authored_registry('component-catalog.js', 'context.window.RosemaryComponentCatalog')
    if len(icons) != ICON_COUNT or len(catalog) != 33:
        raise ValueError('Unexpected icon or component catalog count.')
    # Shared generator owns the current icon archive and sprite, including LICENSE.
    payload = (ROOT / f'rosemary-icons-{ICON_COUNT}.zip').read_bytes()
    with zipfile.ZipFile(io.BytesIO(payload)) as archive:
        if {name for name in archive.namelist() if name.endswith('.svg')} != {f'rosemary-icons/{name}.svg' for name in icons}:
            raise ValueError('Icon archive does not match the shared catalog.')
        for name in icons:
            expected = (ROOT / 'packages/icons/svg' / f'{name}.svg').read_bytes()
            tree = ET.fromstring(expected)
            if tree.attrib.get('viewBox') != '0 0 24 24':
                raise ValueError(f'Unexpected icon viewBox: {name}')
            for node in tree.iter():
                if node.tag.split('}')[-1] not in {'svg','title','path','circle','rect','line','polyline','polygon','ellipse','g'}:
                    raise ValueError(f'Unexpected SVG element: {name}')
                if any(key.lower().startswith('on') or key.split('}')[-1] in ('href','src') for key in node.attrib):
                    raise ValueError(f'Unexpected active SVG attribute: {name}')
            if archive.read(f'rosemary-icons/{name}.svg') != expected:
                raise ValueError(f'Icon archive differs from shared source: {name}')
        if archive.read('rosemary-icons/LICENSE') != (ROOT / 'LICENSE').read_bytes():
            raise ValueError('Icon archive license differs from source.')
    sprite = (ROOT / 'rosemary-icons-sprite.svg').read_text(encoding='utf-8')
    return payload, sprite


def build():
    subprocess.run(['node', str(ROOT/'scripts/generate-portal-colors.mjs'), '--check'],check=True)
    tokens = json.loads((ROOT / 'tokens.json').read_text(encoding='utf-8'))
    guide = (ROOT / 'brand-guide.md').read_text(encoding='utf-8')
    references = (ROOT / 'research/design-system-reference-review.md').read_text(encoding='utf-8')
    logo = (ROOT / 'assets/rosemary-logo.png').read_bytes()
    meta = json.loads((ROOT / 'assets/logo-source.json').read_text(encoding='utf-8'))
    if logo[:8] != b'\x89PNG\r\n\x1a\n' or struct.unpack('>II', logo[16:24]) != (1000,1000):
        raise ValueError('Official logo format or dimensions changed.')
    if hashlib.sha256(logo).hexdigest() != meta['sha256']:
        raise ValueError('Official logo no longer matches the provided source.')
    logo_data = 'data:image/png;base64,' + base64.b64encode(logo).decode('ascii')
    archive, sprite = icon_resources()
    themes = tokens['themes']
    if set(themes['light']) != set(themes['dark']):
        raise ValueError('Themes must expose the same semantic roles.')
    rules = []
    for name, values in themes.items():
        for key, value in values.items():
            if not re.fullmatch(r'#[0-9A-Fa-f]{6}', value):
                raise ValueError(f'Invalid color: {name}.{key}')
        selector = ':root, [data-theme="light"]' if name == 'light' else '[data-theme="dark"]'
        declarations = '\n'.join(f'  --{key}: {value};' for key,value in values.items())
        rules.append(f'{selector} {{\n{declarations}\n}}')
    radius_vars = '\n'.join(f'  --radius-{key}: {value}px;' for key,value in tokens['radiusPx'].items())
    rules.append(':root {\n' + radius_vars + '\n  --radius-compact: calc(var(--radius-control) * .5);\n}')
    motion = tokens['motionMs']
    motion_vars = {'feedback': motion['instantFeedback'], 'state': motion['state'],
                   'enter': motion['transition'], 'page': motion['page'], 'exit': motion['exit'], 'layout': motion['layout'],
                   'fold-cycle': tokens['components']['loading']['cycleMs'],
                   'progress': tokens['components']['progress']['transitionMs']}
    declarations = '\n'.join(f'  --motion-{key}: {value}ms;' for key,value in motion_vars.items())
    rules.append(':root {\n' + declarations + '\n  --motion-ease: ' + tokens['motionEasing'] + ';\n}')
    physics = json.loads((ROOT / 'design/interaction-motion.json').read_text(encoding='utf-8'))
    travel_easing = authored_registry('motion-physics.js', 'context.window.RosemaryPhysics.cssEasing(' + json.dumps(physics['travel']) + ')')
    rules.append('@supports (animation-timing-function: linear(0, 1)) {\n:root {\n  --motion-spring-travel: ' + travel_easing + ';\n  --motion-spring-travel-duration: ' + str(physics['travel']['durationMs']) + 'ms;\n}\n}')
    disclosure_easing = authored_registry('motion-physics.js', 'context.window.RosemaryPhysics.cssEasing(' + json.dumps(physics['disclosure']) + ')')
    rules.append('@supports (animation-timing-function: linear(0, 1)) {\n:root {\n  --motion-disclosure-ease: ' + disclosure_easing + ';\n}\n}')
    (ROOT / 'tokens.css').write_text('\n\n'.join(rules) + '\n', encoding='utf-8')
    exports = {
        'ROSEMARY_INPUT_VALIDATION': json.loads((ROOT / 'design/input-validation.json').read_text(encoding='utf-8')), 'ROSEMARY_MOTION_PHYSICS': physics, 'ROSEMARY_TOKENS': tokens, 'ROSEMARY_GUIDE': guide, 'ROSEMARY_LOGO_DATA': logo_data,
        'ROSEMARY_REFERENCE_REVIEW': references, 'ROSEMARY_ICON_SPRITE': sprite,
        'ROSEMARY_ICON_ARCHIVE_DATA': 'data:application/zip;base64,' + base64.b64encode(archive).decode('ascii')
    }
    data = '\n'.join(f'window.{key} = {json.dumps(value,ensure_ascii=False)};' for key,value in exports.items())
    (ROOT / 'assets-data.js').write_text(data + '\n', encoding='utf-8')
    document = (ROOT / 'index.html').read_text(encoding='utf-8')
    document = document.replace('href="./assets/rosemary-logo.png"', 'href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'/%3E"')
    for name in STYLES:
        content = (ROOT / name).read_text(encoding='utf-8')
        document = document.replace(f'<link rel="stylesheet" href="./{name}">', '<style>\n' + content + '\n</style>')
    scripts = []
    for name in SCRIPTS:
        document = document.replace(f'<script src="./{name}" defer></script>', '')
        scripts.append((ROOT / name).read_text(encoding='utf-8').replace('</script', '<\\/script'))
    document = document.replace('</body>', '<script>\n' + '\n'.join(scripts) + '\n</script>\n</body>')
    output = ROOT / 'rosemary-design-portal.html'
    output.write_text(document, encoding='utf-8')
    bundle = ROOT / 'rosemary-design-portal-source.zip'
    names = ['index.html', '404.html', *STYLES, *SCRIPTS, 'tokens.json', 'brand-guide.md', 'build.py', 'README.md', 'LICENSE', 'BRAND-ASSETS.md',
             'rosemary-design-portal.html', f'rosemary-icons-{ICON_COUNT}.zip', 'rosemary-icons-sprite.svg',
             'assets/rosemary-logo.png', 'assets/logo-source.json', 'design/icons.json', 'design/interaction-motion.json', 'design/input-validation.json', 'tests/input-validation.test.mjs', 'tests/interaction-physics.test.mjs', 'tests/field-focus.test.mjs', 'tests/layout-motion-check.mjs', 'research/design-system-reference-review.md',
             'docs/sdk/getting-started.md', 'docs/sdk/migration.md', 'docs/sdk/release-checklist.md',
             'docs/sdk/0.4.1-consistency-review.md', 'docs/sdk/0.4.2-theme-navigation-review.md', 'docs/sdk/flutter-review.md',
             'tests/browser-check.mjs', 'tests/lab-checks.mjs', 'tests/component-browser-checks.mjs', 'tests/navigation-browser-checks.mjs', 'tests/date-picker-browser-checks.mjs', 'tests/static-check.mjs', 'tests/motion-lifecycle-check.mjs', 'tests/control-surface-check.mjs', 'docs/portal-surface-hierarchy.md', 'research/quiet-controls-review.md', 'research/dynamic-color-system.md', 'dynamic-color-review.json', 'quiet-surface-review.json', 'scripts/generate-portal-colors.mjs', 'scripts/generate-color-runtime.mjs', 'design/color-recipe.js', 'design/portal-color-adapter.js', 'design/color-system.json', 'docs/standards/forma-1.3.md', 'docs/sdk/input-validation.md', 'docs/sdk/interaction.md', 'scripts/generate-interaction.mjs', 'scripts/generate-password-policy.mjs', 'docs/sdk/0.5.0-migration.md', 'docs/sdk/0.5.0-release-notes.md', 'sdk-0.5.0-browser-review.json', 'scripts/vendor-material.mjs', 'vendor/material-color-utilities.json', 'vendor/material-color-utilities.LICENSE', 'vendor/material-color-utilities-0.4.0.tgz', 'quiet-controls-review.json', 'portal-surface-review.json', 'browser-test-report.json', 'local-review-report.json', 'sdk-browser-review.json', 'verification.md']
    names += [str(path.relative_to(ROOT)) for path in sorted((ROOT/'packages/icons/svg').glob('*.svg'))]
    names += [str(path.relative_to(ROOT)) for path in sorted((ROOT/'screenshots').glob('*')) if path.suffix in {'.png','.jpg'} and path.name!='failure.png']
    with zipfile.ZipFile(bundle,'w',zipfile.ZIP_DEFLATED) as packaged:
        for name in names:
            path=ROOT/name
            packaged.write(path,arcname='rosemary-design-portal/'+name)
    print(f'Built {output.name}: {output.stat().st_size:,} bytes')
    print(f'Validated {len(themes["light"])} roles per theme, {ICON_COUNT} icons, 33 component specifications and the official logo hash.')
    print(f'Packed {bundle.name}: {bundle.stat().st_size:,} bytes')


if __name__ == '__main__':
    build()
