// Reproduce the pinned, offline Material subset. The archive is checked before extraction.
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
const root=new URL('../',import.meta.url),archive=new URL('vendor/material-color-utilities-0.4.0.tgz',root),manifest=JSON.parse(fs.readFileSync(new URL('vendor/material-color-utilities.json',root),'utf8'));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex'),manifest.sourceSha256);
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'rosemary-material-'));
try{
 execFileSync('tar',['-xf',archive.pathname,'-C',temporary]);
 const entry=[['Hct','hct/hct.js'],['TonalPalette','palettes/tonal_palette.js'],['QuantizerCelebi','quantize/quantizer_celebi.js'],['Score','score/score.js'],['argbFromHex,hexFromArgb','utils/string_utils.js']].map(([name,file])=>`export {${name}} from './package/${file}';`).join('\n');
 fs.writeFileSync(path.join(temporary,'entry.mjs'),entry+'\n');
 const output=path.join(temporary,'bundle.js');
 execFileSync('npm',['exec','--yes','--package=esbuild@0.28.2','--','esbuild',path.join(temporary,'entry.mjs'),'--bundle','--minify','--format=iife','--global-name=RosemaryMaterial','--legal-comments=inline','--outfile='+output],{stdio:'inherit'});
 const bundle=fs.readFileSync(output,'utf8')+'\nwindow.RosemaryMaterial=RosemaryMaterial;\n';
 assert.equal(crypto.createHash('sha256').update(bundle).digest('hex'),manifest.bundleSha256,'The rebuilt subset matches the recorded bundle');
 if(!process.argv.includes('--check'))fs.writeFileSync(new URL('vendor/material-color-utilities.js',root),bundle);
 console.log('Pinned Material subset reproduced byte for byte.');
}finally{fs.rmSync(temporary,{recursive:true,force:true});}
