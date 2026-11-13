/* Pure damped-spring model. Positions are dimensionless; velocity is per second. */
(() => {
  'use strict';
  function state({mass=1,stiffness,dampingRatio},position,velocity=0,target=1) {
    if (!(mass>0 && stiffness>0 && dampingRatio>=0)) throw new RangeError('Invalid spring parameters');
    return {frequency:Math.sqrt(stiffness/mass),ratio:dampingRatio,position,velocity,target};
  }
  function sample(s,seconds) {
    const t=Math.max(0,seconds),w=s.frequency,z=s.ratio,x=s.position-s.target,v=s.velocity;
    let position,velocity;
    if (Math.abs(z-1)<1e-6) {
      const b=v+w*x,e=Math.exp(-w*t);
      position=(x+b*t)*e;velocity=(v-w*b*t)*e;
    } else if(z<1) {
      const a=z*w,d=w*Math.sqrt(1-z*z),b=(v+a*x)/d,e=Math.exp(-a*t),c=Math.cos(d*t),n=Math.sin(d*t);
      position=e*(x*c+b*n);velocity=e*((b*d-a*x)*c-(x*d+a*b)*n);
    } else {
      const q=Math.sqrt(z*z-1),r1=-w*(z-q),r2=-w*(z+q),a=(v-r2*x)/(r1-r2),b=x-a;
      position=a*Math.exp(r1*t)+b*Math.exp(r2*t);velocity=a*r1*Math.exp(r1*t)+b*r2*Math.exp(r2*t);
    }
    return {position:s.target+position,velocity};
  }
  function frames(s,durationMs,property='scale') {
    const count=Math.max(2,Math.ceil(durationMs/1000*120));
    return Array.from({length:count+1},(_,i)=>({offset:i/count,[property]:i===count?s.target:sample(s,durationMs/1000*i/count).position}));
  }
  function cssEasing(parameters) {
    const s=state(parameters,0,0,1),duration=parameters.durationMs/1000;
    return 'linear('+Array.from({length:41},(_,i)=>i===40?'1':String(Number(sample(s,duration*i/40).position.toFixed(5)))).join(',')+')';
  }
  window.RosemaryPhysics={state,sample,frames,cssEasing};
})();
