import {copyFileSync,mkdirSync} from 'node:fs';
const name=process.argv[2];
if(!['tokens','icons'].includes(name))throw new Error('Expected tokens or icons');
mkdirSync('dist',{recursive:true});
if(name==='tokens') {
  copyFileSync('src/tokens.css','dist/tokens.css');
  copyFileSync('../../design/tokens.json','dist/tokens.json');
}
copyFileSync('../../LICENSE','LICENSE');
