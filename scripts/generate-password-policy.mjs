import {readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const p=JSON.parse(readFileSync(path.join(root,'design/input-validation.json'),'utf8')).password;
const banner='Generated from design/input-validation.json; run pnpm design:generate.';
const outputs=new Map();
outputs.set('packages/tokens/src/password.ts',`// ${banner}
export interface RosemaryPasswordResult { readonly length:boolean; readonly characters:boolean; readonly categories:boolean; readonly valid:boolean; }
export const rosemaryPasswordPolicy=Object.freeze({minLength:${p.minLength},maxLength:${p.maxLength},minimumCategories:${p.minimumCategories},requirements:${JSON.stringify(p.requirements)} as readonly string[]});
export function checkRosemaryPassword(value:string):RosemaryPasswordResult {
  const points=Array.from(value,c=>c.codePointAt(0)!);let letters=false,digits=false,symbols=false;
  for(const n of points){if(n>=65&&n<=90||n>=97&&n<=122)letters=true;else if(n>=48&&n<=57)digits=true;else if(n>=${p.allowedCodePointMin}&&n<=${p.allowedCodePointMax})symbols=true;}
  const length=points.length>=${p.minLength}&&points.length<=${p.maxLength},characters=points.length>0&&points.every(n=>n>=${p.allowedCodePointMin}&&n<=${p.allowedCodePointMax}),categories=Number(letters)+Number(digits)+Number(symbols)>=${p.minimumCategories};
  return {length,characters,categories,valid:length&&characters&&categories};
}
`);
outputs.set('platforms/swiftui/Sources/RosemaryUI/PasswordPolicy.swift',`// ${banner}
public struct RosemaryPasswordResult: Equatable, Sendable {
  public let length: Bool
  public let characters: Bool
  public let categories: Bool
  public var valid: Bool { length && characters && categories }
}
public enum RosemaryPasswordPolicy {
  public static let minLength = ${p.minLength}
  public static let maxLength = ${p.maxLength}
  public static let minimumCategories = ${p.minimumCategories}
  public static let requirements = ${JSON.stringify(p.requirements)}
  public static func check(_ value: String) -> RosemaryPasswordResult {
    let points = value.unicodeScalars.map { $0.value }
    var letters = false, digits = false, symbols = false
    for n in points {
      if (65...90).contains(n) || (97...122).contains(n) { letters = true }
      else if (48...57).contains(n) { digits = true }
      else if (${p.allowedCodePointMin}...${p.allowedCodePointMax}).contains(n) { symbols = true }
    }
    return RosemaryPasswordResult(length: points.count >= minLength && points.count <= maxLength,
      characters: !points.isEmpty && points.allSatisfy { (${p.allowedCodePointMin}...${p.allowedCodePointMax}).contains($0) },
      categories: [letters, digits, symbols].filter { $0 }.count >= minimumCategories)
  }
}
`);
outputs.set('platforms/android/rosemary-compose/src/main/java/design/rosemary/compose/PasswordPolicy.kt',`// ${banner}
package design.rosemary.compose

data class RosemaryPasswordResult(val length: Boolean, val characters: Boolean, val categories: Boolean) {
    val valid: Boolean get() = length && characters && categories
}
object RosemaryPasswordPolicy {
    const val minLength = ${p.minLength}
    const val maxLength = ${p.maxLength}
    const val minimumCategories = ${p.minimumCategories}
    val requirements: List<String> = listOf(${p.requirements.map(v=>JSON.stringify(v)).join(', ')})
    fun check(value: String): RosemaryPasswordResult {
        val points = value.codePoints().toArray()
        val letters = points.any { it in 65..90 || it in 97..122 }
        val digits = points.any { it in 48..57 }
        val symbols = points.any { it in ${p.allowedCodePointMin}..${p.allowedCodePointMax} && it !in 65..90 && it !in 97..122 && it !in 48..57 }
        return RosemaryPasswordResult(points.size in minLength..maxLength,
            points.isNotEmpty() && points.all { it in ${p.allowedCodePointMin}..${p.allowedCodePointMax} },
            listOf(letters, digits, symbols).count { it } >= minimumCategories)
    }
}
`);
outputs.set('platforms/flutter/rosemary_ui/lib/src/password_policy.dart',`// ${banner}
class RosemaryPasswordResult {
  final bool length, characters, categories;
  const RosemaryPasswordResult({required this.length, required this.characters, required this.categories});
  bool get valid => length && characters && categories;
}
class RosemaryPasswordPolicy {
  static const minLength = ${p.minLength};
  static const maxLength = ${p.maxLength};
  static const minimumCategories = ${p.minimumCategories};
  static const requirements = <String>${JSON.stringify(p.requirements)};
  static RosemaryPasswordResult check(String value) {
    final points = value.runes.toList();
    final letters = points.any((n) => n >= 65 && n <= 90 || n >= 97 && n <= 122);
    final digits = points.any((n) => n >= 48 && n <= 57);
    final symbols = points.any((n) => n >= ${p.allowedCodePointMin} && n <= ${p.allowedCodePointMax} && !(n >= 65 && n <= 90 || n >= 97 && n <= 122 || n >= 48 && n <= 57));
    return RosemaryPasswordResult(length: points.length >= minLength && points.length <= maxLength,
      characters: points.isNotEmpty && points.every((n) => n >= ${p.allowedCodePointMin} && n <= ${p.allowedCodePointMax}),
      categories: [letters, digits, symbols].where((v) => v).length >= minimumCategories);
  }
}
`);
for(const [file,content]of outputs){const target=path.join(root,file);if(process.argv.includes('--check')){if(readFileSync(target,'utf8')!==content)throw new Error('Stale password policy: '+file);}else writeFileSync(target,content);}
console.log(`Password policy: ${outputs.size} SDK adapters use the canonical ${p.minLength}–${p.maxLength} ASCII / ${p.minimumCategories}-category rule.`);
