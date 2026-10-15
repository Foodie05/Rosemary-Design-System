export const componentIds = ['button','link','iconButton','input','textarea','select','search','checkbox','radio','switch','slider','date','upload','tabs','breadcrumb','pagination','menu','tooltip','popover','dialog','drawer','toast','alert','card','list','table','badge','avatar','empty','skeleton','loading','progress','stepper'];
export const colorRoles = ['canvas','surface','raised','ink','muted','border','control','primary','on-primary','primary-soft','sun','on-sun','sky','on-sky','success','success-soft','warning','warning-soft','danger','danger-soft','on-danger','info','info-soft','focus'];
export const camel = value => value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
export const contrastPairs = [
  ['ink','canvas',4.5],['muted','canvas',4.5],['ink','surface',4.5],['muted','surface',4.5],
  ['ink','raised',4.5],['muted','raised',4.5],['on-primary','primary',4.5],
  ['primary','primary-soft',4.5],['ink','primary-soft',4.5],['on-sun','sun',4.5],['on-sky','sky',4.5],
  ['success','success-soft',4.5],['warning','warning-soft',4.5],['danger','danger-soft',4.5],
  ['info','info-soft',4.5],['on-danger','danger',4.5],
  ['control','canvas',3],['control','surface',3],['control','raised',3],
  ['focus','canvas',3],['focus','surface',3],['focus','raised',3]
];
export function parseColor(value) {
  if (typeof value !== 'string' || !/^#[\da-f]{6}$/i.test(value)) throw new TypeError(`Expected opaque sRGB #RRGGBB, received ${String(value)}`);
  return [1,3,5].map(offset => parseInt(value.slice(offset,offset+2),16)/255);
}
export function luminance(value) {
  const rgb=parseColor(value).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);
  return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722;
}
export function contrast(a,b) {
  const x=luminance(a),y=luminance(b);
  return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);
}
export function resolveAliases(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new TypeError('Theme must be a color-role object');
  const found=Object.keys(record);
  if (found.length!==colorRoles.length || colorRoles.some(role=>!Object.hasOwn(record,role)) || found.some(role=>!colorRoles.includes(role))) throw new TypeError('Theme must contain exactly all 24 color roles');
  const resolved={},visiting=new Set();
  function get(role) {
    if(Object.hasOwn(resolved,role))return resolved[role];
    if(visiting.has(role))throw new TypeError(`Circular color alias at ${role}`);
    if(!Object.hasOwn(record,role))throw new TypeError(`Missing color alias ${role}`);
    visiting.add(role);
    const raw=record[role],alias=typeof raw==='string' && /^\{([a-z-]+)\}$/.exec(raw);
    const value=alias?get(alias[1]):raw;
    parseColor(value);visiting.delete(role);resolved[role]=value.toUpperCase();return resolved[role];
  }
  return Object.fromEntries(colorRoles.map(role=>[role,get(role)]));
}
export function validateContrast(colors) {
  return contrastPairs.flatMap(([foreground,background,target])=> {
    const ratio=contrast(colors[foreground],colors[background]);
    return ratio+1e-12<target?[{kind:'contrast',foreground,background,ratio,target}]:[];
  });
}
export function validateSource(tokens,contracts) {
  if(tokens.sdkVersion!=='0.4.2'||tokens.specVersion!=='1.2.0')throw new Error('SDK/spec versions must remain distinct');
  if(JSON.stringify(Object.keys(tokens.themes).sort())!==JSON.stringify(['dark','light']))throw new Error('Required modes are light and dark');
  for(const [mode,colors] of Object.entries(tokens.themes)) {
    const failures=validateContrast(resolveAliases(colors));
    if(failures.length)throw new Error(`${mode} contrast: ${JSON.stringify(failures)}`);
  }
  for(const key of ['components']) {
    if(JSON.stringify(Object.keys(tokens[key]).sort())!==JSON.stringify([...componentIds].sort()))throw new Error('Component token coverage mismatch');
  }
  if(contracts.components.length!==33||new Set(contracts.components.map(x=>x.id)).size!==33||componentIds.some(id=>!contracts.components.some(x=>x.id===id)))throw new Error('33 unique contracts required');
  if(tokens.motion.drawerEnterMs!==220||tokens.motion.drawerExitMs!==180)throw new Error('Drawer timing drift');
  if(contracts.common.date.timezone!=='none-local-date-and-time')throw new Error('Date timezone semantics drift');
  for(const [id,c]of Object.entries(tokens.components)) {
    for(const key of ['foreground','background','focus','border'])if(!colorRoles.includes(c[key]))throw new Error(`${id}.${key} unknown semantic role`);
    if(!Object.hasOwn(tokens.radius,c.radius))throw new Error(`${id} unknown radius role`);
  }
}
