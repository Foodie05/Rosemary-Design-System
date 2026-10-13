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
SCRIPTS = ['assets-data.js', 'icon-library.js', 'component-catalog.js', 'ui.js',
           'motion.js', 'custom-select.js', 'component-demos.js', 'component-viewer.js', 'pages.js', 'overview-page.js',
           'asset-pages.js', 'component-pages.js', 'loading-motion-pages.js',
           'reference-pages.js', 'subbrand-page.js', 'case-studies-page.js', 'interaction-lab.js', 'app.js']
STYLES = ['tokens.css', 'styles.css', 'specifications.css', 'component-demos.css', 'navigation.css', 'custom-select.css', 'brand-lockup.css', 'forma-home.css', 'selection-controls.css', 'subbrand-page.css', 'case-studies-page.css']
ZIP_TIMESTAMP = (2026, 10, 11, 0, 0, 0)


def write_zip_entry(archive, name, data):
    info = zipfile.ZipInfo(name, date_time=ZIP_TIMESTAMP)
    info.compress_type = zipfile.ZIP_DEFLATED
    info.external_attr = 0o100644 << 16
    archive.writestr(info, data)


def authored_registry(filename, expression):
    script = "const fs=require('node:fs'),vm=require('node:vm');const context={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),context);console.log(JSON.stringify(" + expression + "));"
    result = subprocess.run(['node', '-e', script, str(ROOT / filename)], check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def icon_resources():
    icons = authored_registry('icon-library.js', 'context.window.RosemaryIconLibrary.icons')
    catalog = authored_registry('component-catalog.js', 'context.window.RosemaryComponentCatalog')
    if len(icons) != 71 or len(catalog) != 33:
        raise ValueError('Unexpected icon or component catalog count.')
    allowed_tags = {'svg', 'title', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'g'}
    symbols = []
    archive_buffer = io.BytesIO()
    with zipfile.ZipFile(archive_buffer, 'w', zipfile.ZIP_DEFLATED) as archive:
        for name, item in icons.items():
            if not re.fullmatch(r'[a-z0-9-]+', name):
                raise ValueError('Unsafe icon ID.')
            path = ROOT / 'icons' / f'{name}.svg'
            raw = path.read_text(encoding='utf-8')
            tree = ET.fromstring(raw)
            if tree.attrib.get('viewBox') != '0 0 24 24':
                raise ValueError(f'Unexpected icon viewBox: {name}')
            for node in tree.iter():
                if node.tag.split('}')[-1] not in allowed_tags:
                    raise ValueError(f'Unexpected SVG element: {name}')
                if any(key.lower().startswith('on') or key.split('}')[-1] in ('href','src') for key in node.attrib):
                    raise ValueError(f'Unexpected active SVG attribute: {name}')
            write_zip_entry(archive, f'rosemary-icons/{name}.svg', raw)
            symbols.append(f'<symbol id="rosemary-{name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><title>{html.escape(item["label"])}</title>{item["paths"]}</symbol>')
        manifest = {name: {key: item[key] for key in ('label','category','usage')} for name,item in icons.items()}
        write_zip_entry(archive, 'rosemary-icons/manifest.json', json.dumps(manifest, ensure_ascii=False, indent=2))
        write_zip_entry(archive, 'rosemary-icons/README.md', '# Rosemary 功能图标\n\n71 枚原创 SVG，24×24 网格，1.6px 圆角描边，使用 currentColor。图标按钮仍需可访问名称。正式品牌 Logo 不包含在这个图标包中。\n')
    payload = archive_buffer.getvalue()
    (ROOT / 'rosemary-icons-71.zip').write_bytes(payload)
    sprite = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none">' + ''.join(symbols) + '</svg>'
    (ROOT / 'rosemary-icons-sprite.svg').write_text(sprite, encoding='utf-8')
    return payload, sprite


def build():
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
    motion = tokens['motionMs']
    motion_vars = {'feedback': motion['instantFeedback'], 'state': motion['state'],
                   'enter': motion['transition'], 'page': motion['page'], 'exit': motion['exit'], 'layout': motion['layout'],
                   'fold-cycle': tokens['components']['loading']['cycleMs'],
                   'progress': tokens['components']['progress']['transitionMs']}
    declarations = '\n'.join(f'  --motion-{key}: {value}ms;' for key,value in motion_vars.items())
    rules.append(':root {\n' + declarations + '\n  --motion-ease: ' + tokens['motionEasing'] + ';\n}')
    (ROOT / 'tokens.css').write_text('\n\n'.join(rules) + '\n', encoding='utf-8')
    exports = {
        'ROSEMARY_TOKENS': tokens, 'ROSEMARY_GUIDE': guide, 'ROSEMARY_LOGO_DATA': logo_data,
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
             'rosemary-design-portal.html', 'rosemary-icons-71.zip', 'rosemary-icons-sprite.svg',
             'assets/rosemary-logo.png', 'assets/logo-source.json', 'research/design-system-reference-review.md',
             'tests/browser-check.mjs', 'tests/lab-checks.mjs', 'tests/component-browser-checks.mjs', 'tests/navigation-browser-checks.mjs', 'tests/date-picker-browser-checks.mjs', 'tests/static-check.mjs', 'browser-test-report.json', 'local-review-report.json', 'verification.md']
    names += [str(path.relative_to(ROOT)) for path in sorted((ROOT/'icons').glob('*.svg'))]
    names += [str(path.relative_to(ROOT)) for path in sorted((ROOT/'screenshots').glob('*.png')) if path.name!='failure.png']
    with zipfile.ZipFile(bundle,'w',zipfile.ZIP_DEFLATED) as packaged:
        for name in names:
            path=ROOT/name
            if path.exists(): packaged.write(path,arcname='rosemary-design-portal/'+name)
    print(f'Built {output.name}: {output.stat().st_size:,} bytes')
    print(f'Validated {len(themes["light"])} roles per theme, 71 icons, 33 component specifications and the official logo hash.')
    print(f'Packed {bundle.name}: {bundle.stat().st_size:,} bytes')


if __name__ == '__main__':
    build()
