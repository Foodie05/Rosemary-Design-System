import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import {validateSource,resolveAliases,validateContrast} from './design-engine.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const ajv=new Ajv({allErrors:true,strict:false});
for(const name of ['tokens','contracts']) {
  const validator=ajv.compile(read(`design/${name}.schema.json`));
  if(!validator(read(`design/${name}.json`)))throw new Error(`${name} schema: ${JSON.stringify(validator.errors)}`);
}
const tokens=read('design/tokens.json'),contracts=read('design/contracts.json');validateSource(tokens,contracts);
for(const mode of ['light','dark'])if(validateContrast(resolveAliases(tokens.themes[mode])).length)throw new Error('Default theme contrast failed');
const logo=fs.readFileSync(path.join(root,'assets/rosemary-logo.png'));
const {createHash}=await import('node:crypto');
if(createHash('sha256').update(logo).digest('hex')!=='fe0ee00522c8a47f2242676f8417b240d299263e8dbc7b7bddc28ece9bb36d4c')throw new Error('Official logo changed');
console.log('Both schemas valid; 33 unique component contracts, semantic references, default theme contrast, motion and logo invariants passed.');
