import {readFileSync} from 'node:fs';
import {normalizeSvgElements} from './icon-geometry.mjs';
// ZIP store format keeps the browser download reproducible without platform tools.
function iconZip(files) {
  const local=[],central=[]; let offset=0;
  const crc32=data=>{let c=0xffffffff;for(const byte of data){c^=byte;for(let n=0;n<8;n++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;};
  for(const [name,text] of files) {
    const filename=Buffer.from(name),data=Buffer.from(text),crc=crc32(data);
    const head=Buffer.alloc(30);head.writeUInt32LE(0x04034b50);head.writeUInt16LE(20,4);head.writeUInt16LE(33,12);head.writeUInt32LE(crc,14);head.writeUInt32LE(data.length,18);head.writeUInt32LE(data.length,22);head.writeUInt16LE(filename.length,26);
    const directory=Buffer.alloc(46);directory.writeUInt32LE(0x02014b50);directory.writeUInt16LE(20,4);directory.writeUInt16LE(20,6);directory.writeUInt16LE(33,14);directory.writeUInt32LE(crc,16);directory.writeUInt32LE(data.length,20);directory.writeUInt32LE(data.length,24);directory.writeUInt16LE(filename.length,28);directory.writeUInt32LE(offset,42);
    local.push(head,filename,data);central.push(directory,filename);offset+=head.length+filename.length+data.length;
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...local,directory,end]);
}
export function iconOutputs(root) {
  const icons=JSON.parse(readFileSync(new URL('../design/icons.json',import.meta.url),'utf8'));
  const names=Object.keys(icons);
  for(const name of ['sun','moon','theme-system','globe'])if(!icons[name])throw new Error(`Missing theme/navigation icon: ${name}`);
  const outputs=new Map(),geometry=Object.fromEntries(names.map(name=>[name,normalizeSvgElements(icons[name].markup)]));
  const b='Generated from design/icons.json. Do not edit.';
  const quote=value=>"'"+value.replace(/\\/g,'\\\\').replace(/'/g,"\\'")+"'";
  const portalEntries=names.map(name=>`    ${/^[a-z]+$/.test(name)?name:quote(name)}: {\n      label: ${quote(icons[name].label)},\n      category: ${quote(icons[name].category)},\n      paths: ${quote(icons[name].markup)},\n      usage: ${quote(icons[name].usage)}\n    }`).join(',\n');
  outputs.set('icon-library.js',`// ${b}\n(() => {\n  const icons = {\n${portalEntries}\n  };\n\n  window.RosemaryIconLibrary = { icons };\n})();\n`);
  outputs.set('rosemary-icons-sprite.svg','<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none">'+names.map(name=>`<symbol id="rosemary-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><title>${icons[name].label}</title>${icons[name].markup}</symbol>`).join('')+'</svg>\n');
  const metadata=Object.fromEntries(names.map(name=>[name,{label:icons[name].label,category:icons[name].category,usage:icons[name].usage}]));
  const archive=iconZip([...names.map(name=>[`rosemary-icons/${name}.svg`,icons[name].svg]),['rosemary-icons/manifest.json',JSON.stringify(metadata,null,2)+'\n'],['rosemary-icons/LICENSE',readFileSync(new URL('../LICENSE',import.meta.url),'utf8')],['rosemary-icons/README.md',`# Rosemary functional icons\n\n${names.length} SVG icons. MIT licensed. 24-unit viewBox, 1.6-unit stroke, round caps and joins. Use currentColor. The included LICENSE applies to these functional icons; brand logos and marks are not included.\n`]]);
  outputs.set(`rosemary-icons-${names.length}.zip`,archive);
  const assetData=readFileSync(new URL('../assets-data.js',import.meta.url),'utf8');
  if((assetData.match(/^window\.ROSEMARY_ICON_ARCHIVE_DATA = [^\n]+$/gm)||[]).length!==1)throw new Error('Expected exactly one icon archive marker in assets-data.js');
  outputs.set('assets-data.js',assetData.replace(/window\.ROSEMARY_ICON_ARCHIVE_DATA = [^\n]+/,`window.ROSEMARY_ICON_ARCHIVE_DATA = "data:application/zip;base64,${archive.toString('base64')}";`));
  outputs.set('packages/icons/src/index.ts',`// ${b}\nexport const iconNames=${JSON.stringify(names)} as const;\nexport type IconName=typeof iconNames[number];\nexport type RosemaryPathCommand=Readonly<{op:'M'|'L'|'C'|'Z';values:readonly number[]}>;\nexport const iconMetadata=${JSON.stringify(metadata,null,2)} as const;\nexport const iconMarkup=${JSON.stringify(Object.fromEntries(names.map(name=>[name,icons[name].markup])),null,2)} as const;\nexport const iconGeometry:Readonly<Record<IconName,readonly (readonly RosemaryPathCommand[])[]>>=${JSON.stringify(geometry)};\nexport const iconViewBox=24 as const;\nexport const iconStrokeWidth=1.6 as const;\nexport function getIconSvg(name:IconName):string { if(!Object.hasOwn(iconMarkup,name))throw new TypeError('Unknown Rosemary icon '+name);return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+iconMarkup[name]+'</svg>'; }\n`);
  for(const name of names)outputs.set(`packages/icons/svg/${name}.svg`,icons[name].svg.endsWith('\n')?icons[name].svg:icons[name].svg+'\n');
  const ktCommand=c=>`RosemaryPathCommand("${c.op}", listOf(${c.values.map(v=>v+'f').join(', ')}))`;
  const kt=Object.entries(geometry).map(([name,paths])=>`    "${name}" to listOf(${paths.map(commands=>`listOf(${commands.map(ktCommand).join(', ')})`).join(', ')}),`).join('\n');
  outputs.set('platforms/android/rosemary-compose/src/main/java/design/rosemary/compose/generated/RosemaryIcons.kt',`// ${b}\npackage design.rosemary.compose.generated\ndata class RosemaryPathCommand(val op: String, val values: List<Float>)\nobject RosemaryIcons {\n  const val viewBox = 24f\n  const val strokeWidth = 1.6f\n  val paths: Map<String,List<List<RosemaryPathCommand>>> = mapOf(\n${kt}\n  )\n}\n`);
  const swCommand=c=>`RosemaryPathCommand(op: "${c.op}", values: [${c.values.join(', ')}])`;
  const sw=Object.entries(geometry).map(([name,paths])=>`    "${name}": [${paths.map(commands=>`[${commands.map(swCommand).join(', ')}]`).join(', ')}]`).join(',\n');
  outputs.set('platforms/swiftui/Sources/RosemaryUI/Generated/RosemaryIcons.swift',`// ${b}\nimport CoreGraphics\npublic struct RosemaryPathCommand {\n  public let op: String\n  public let values: [CGFloat]\n  public init(op: String, values: [CGFloat]) { self.op = op; self.values = values }\n}\npublic enum RosemaryIcons {\n  public static let viewBox: CGFloat = 24\n  public static let strokeWidth: CGFloat = 1.6\n  public static let paths: [String:[[RosemaryPathCommand]]] = [\n${sw}\n  ]\n}\n`);
  const daCommand=c=>`RosemaryPathCommand('${c.op}', [${c.values.map(v=>Number.isInteger(v)?v+'.0':v).join(', ')}])`;
  const da=Object.entries(geometry).map(([name,paths])=>`    '${name}': [${paths.map(commands=>`[${commands.map(daCommand).join(', ')}]`).join(', ')}],`).join('\n');
  outputs.set('platforms/flutter/rosemary_ui/lib/src/generated/rosemary_icons.dart',`// ${b}\nclass RosemaryPathCommand {\n  final String op;\n  final List<double> values;\n  const RosemaryPathCommand(this.op, this.values);\n}\nclass RosemaryIcons {\n  static const viewBox = 24.0;\n  static const strokeWidth = 1.6;\n  static const paths = <String,List<List<RosemaryPathCommand>>>{\n${da}\n  };\n}\n`);
  outputs.set('design/generated/icon-geometry.json',JSON.stringify({viewBox:24,strokeWidth:1.6,lineCap:'round',lineJoin:'round',fill:'none',commands:['M','L','C','Z'],curvePrecision:6,arcApproximation:'cubic segments at most 90 degrees; original SVG retained',icons:geometry},null,2)+'\n');
  return outputs;
}
