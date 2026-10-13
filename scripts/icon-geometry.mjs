// SVG endpoint arcs are converted to cubic segments (at most 90 degrees each).
// Renderers consume only absolute M/L/C/Z. Original SVG remains the source asset.
const TAU=Math.PI*2;
export function arcCubics(x1,y1,rx,ry,rotation,large,sweep,x2,y2) {
  rx=Math.abs(rx);ry=Math.abs(ry);
  if(x1===x2&&y1===y2)return [];
  if(rx===0||ry===0)return [{op:'L',values:[x2,y2]}];
  const phi=rotation*Math.PI/180,cs=Math.cos(phi),sn=Math.sin(phi);
  const xp=cs*(x1-x2)/2+sn*(y1-y2)/2,yp=-sn*(x1-x2)/2+cs*(y1-y2)/2;
  const scale=xp*xp/(rx*rx)+yp*yp/(ry*ry);
  if(scale>1){rx*=Math.sqrt(scale);ry*=Math.sqrt(scale);}
  const factor=(large===sweep?-1:1)*Math.sqrt(Math.max(0,(rx*rx*ry*ry-rx*rx*yp*yp-ry*ry*xp*xp)/(rx*rx*yp*yp+ry*ry*xp*xp)));
  const cxp=factor*rx*yp/ry,cyp=-factor*ry*xp/rx;
  const cx=cs*cxp-sn*cyp+(x1+x2)/2,cy=sn*cxp+cs*cyp+(y1+y2)/2;
  const ux=(xp-cxp)/rx,uy=(yp-cyp)/ry,vx=(-xp-cxp)/rx,vy=(-yp-cyp)/ry;
  let start=Math.atan2(uy,ux),angle=Math.atan2(ux*vy-uy*vx,ux*vx+uy*vy);
  if(!sweep&&angle>0)angle-=TAU;if(sweep&&angle<0)angle+=TAU;
  const count=Math.ceil(Math.abs(angle)/(Math.PI/2)),step=angle/count,result=[];
  const point=t=>[cx+rx*cs*Math.cos(t)-ry*sn*Math.sin(t),cy+rx*sn*Math.cos(t)+ry*cs*Math.sin(t)];
  const tangent=t=>[-rx*cs*Math.sin(t)-ry*sn*Math.cos(t),-rx*sn*Math.sin(t)+ry*cs*Math.cos(t)];
  for(let i=0;i<count;i++) {
    const end=start+step,k=4/3*Math.tan(step/4),a=point(start),b=point(end),da=tangent(start),db=tangent(end);
    result.push({op:'C',values:[a[0]+k*da[0],a[1]+k*da[1],b[0]-k*db[0],b[1]-k*db[1],...b]});start=end;
  }
  result.at(-1).values.splice(4,2,x2,y2);return result;
}
export function normalizePath(d) {
  const words=d.match(/[a-zA-Z]|[-+]?(?:\d*\.?\d+)(?:[eE][-+]?\d+)?/g)||[];
  if(d.replace(/[a-zA-Z]|[-+]?(?:\d*\.?\d+)(?:[eE][-+]?\d+)?/g,'').replace(/[\s,]/g,''))throw new Error('Invalid SVG path character');
  let i=0,command,x=0,y=0,sx=0,sy=0,previous='',controlX=0,controlY=0;
  const out=[],counts={M:2,L:2,H:1,V:1,C:6,S:4,A:7};
  const push=(op,values=[])=>out.push({op,values});
  while(i<words.length) {
    if(/^[a-zA-Z]$/.test(words[i]))command=words[i++];
    if(!command)throw new Error('Path must start with a command');
    const upper=command.toUpperCase(),relative=upper!==command;
    if(upper==='Z'){push('Z');x=sx;y=sy;previous='Z';command=undefined;continue;}
    const count=counts[upper];if(!count)throw new Error(`Unsupported path command ${command}`);
    const values=words.slice(i,i+count).map(Number);
    if(values.length!==count||values.some(v=>!Number.isFinite(v)))throw new Error(`Invalid arguments for ${command}`);
    i+=count;const ox=x,oy=y;
    const px=n=>n+(relative?ox:0),py=n=>n+(relative?oy:0);
    if(upper==='M'||upper==='L'){x=px(values[0]);y=py(values[1]);push(upper,[x,y]);if(upper==='M'){sx=x;sy=y;command=relative?'l':'L';}}
    if(upper==='H'){x=px(values[0]);push('L',[x,y]);}
    if(upper==='V'){y=py(values[0]);push('L',[x,y]);}
    if(upper==='C'){const data=[px(values[0]),py(values[1]),px(values[2]),py(values[3]),px(values[4]),py(values[5])];push('C',data);[controlX,controlY]=data.slice(2,4);[x,y]=data.slice(4);}
    if(upper==='S'){const reflected=['C','S'].includes(previous)?[2*x-controlX,2*y-controlY]:[x,y];const data=[...reflected,px(values[0]),py(values[1]),px(values[2]),py(values[3])];push('C',data);[controlX,controlY]=data.slice(2,4);[x,y]=data.slice(4);}
    if(upper==='A'){const [rx,ry,rotation,large,sweep,dx,dy]=values;if(![0,1].includes(large)||![0,1].includes(sweep))throw new Error('Invalid arc flags');x=px(dx);y=py(dy);out.push(...arcCubics(ox,oy,rx,ry,rotation,large,sweep,x,y));}
    previous=upper;
  }
  return out.map(({op,values})=>({op,values:values.map(v=>Number(v.toFixed(6)))}));
}
export function normalizeSvgElements(markup) {
  const shapes=[];let consumed='';
  for(const match of markup.matchAll(/<(path|circle|rect)\s+([^>]*)\/>/g)) {
    consumed+=match[0];const [,kind,attrs]=match;
    const a=Object.fromEntries([...attrs.matchAll(/([a-z]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
    if(kind==='path'){if(Object.keys(a).some(k=>k!=='d'))throw new Error('Unsupported path attributes');shapes.push(normalizePath(a.d));continue;}
    const num=(key,fallback=0)=>{const v=Number(a[key]??fallback);if(!Number.isFinite(v))throw new Error(`Invalid ${kind}.${key}`);return v;};
    if(kind==='circle'){const cx=num('cx'),cy=num('cy'),r=num('r');if(r<=0)throw new Error('Invalid circle');shapes.push(normalizePath(`M${cx+r} ${cy} A${r} ${r} 0 1 1 ${cx-r} ${cy} A${r} ${r} 0 1 1 ${cx+r} ${cy} Z`));}
    if(kind==='rect'){const x=num('x'),y=num('y'),w=num('width'),h=num('height'),rx=Math.min(num('rx'),w/2),ry=Math.min(num('ry',num('rx')),h/2);if(w<=0||h<=0||rx<0||ry<0)throw new Error('Invalid rect');shapes.push(normalizePath(rx&&ry?`M${x+rx} ${y} H${x+w-rx} A${rx} ${ry} 0 0 1 ${x+w} ${y+ry} V${y+h-ry} A${rx} ${ry} 0 0 1 ${x+w-rx} ${y+h} H${x+rx} A${rx} ${ry} 0 0 1 ${x} ${y+h-ry} V${y+ry} A${rx} ${ry} 0 0 1 ${x+rx} ${y} Z`:`M${x} ${y} H${x+w} V${y+h} H${x} Z`));}
  }
  if(consumed.replace(/\s/g,'')!==markup.replace(/\s/g,''))throw new Error('Unrecognized SVG markup');
  if(!shapes.length)throw new Error('Icon has no geometry');return shapes;
}
