// Generated from design/input-validation.json; run pnpm design:generate.
export interface RosemaryPasswordResult { readonly length:boolean; readonly characters:boolean; readonly categories:boolean; readonly valid:boolean; }
export const rosemaryPasswordPolicy=Object.freeze({minLength:8,maxLength:32,minimumCategories:2,requirements:["8–32 个字符","仅使用英文字母、数字和英文符号，不含空格","字母、数字、英文符号中至少包含两类"] as readonly string[]});
export function checkRosemaryPassword(value:string):RosemaryPasswordResult {
  const points=Array.from(value,c=>c.codePointAt(0)!);let letters=false,digits=false,symbols=false;
  for(const n of points){if(n>=65&&n<=90||n>=97&&n<=122)letters=true;else if(n>=48&&n<=57)digits=true;else if(n>=33&&n<=126)symbols=true;}
  const length=points.length>=8&&points.length<=32,characters=points.length>0&&points.every(n=>n>=33&&n<=126),categories=Number(letters)+Number(digits)+Number(symbols)>=2;
  return {length,characters,categories,valid:length&&characters&&categories};
}
