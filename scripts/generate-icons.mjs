import {readFileSync} from 'node:fs';
import {normalizeSvgElements} from './icon-geometry.mjs';
export function iconOutputs(root) {
  const icons=JSON.parse(readFileSync(new URL('../design/icons.json',import.meta.url),'utf8'));
  const names=Object.keys(icons);
  if(names.length!==71)throw new Error('Expected all 71 original icon IDs');
  const outputs=new Map(),geometry=Object.fromEntries(names.map(name=>[name,normalizeSvgElements(icons[name].markup)]));
  const b='Generated from design/icons.json. Do not edit.';
  const metadata=Object.fromEntries(names.map(name=>[name,{label:icons[name].label,category:icons[name].category,usage:icons[name].usage}]));
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
