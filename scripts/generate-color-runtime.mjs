import fs from 'node:fs';
const source=fs.readFileSync(new URL('../design/color-recipe.js',import.meta.url),'utf8');
const adapter=fs.readFileSync(new URL('../design/portal-color-adapter.js',import.meta.url),'utf8');
const material=fs.readFileSync(new URL('../vendor/material-color-utilities.js',import.meta.url),'utf8').replace('window.RosemaryMaterial=RosemaryMaterial;','export default RosemaryMaterial;');
const outputs={'packages/tokens/src/material-runtime.js':material,'color-engine.js':source.replace('export function','function')+'\n'+adapter,'packages/tokens/src/color-recipe.js':source};
for(const [name,content] of Object.entries(outputs)){const url=new URL('../'+name,import.meta.url);if(process.argv.includes('--check')){if(fs.readFileSync(url,'utf8')!==content)throw new Error('Generated color runtime differs: '+name);}else fs.writeFileSync(url,content);}
console.log('Canonical portal / SDK color runtimes '+(process.argv.includes('--check')?'checked.':'generated.'));
