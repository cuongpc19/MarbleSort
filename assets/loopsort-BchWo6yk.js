import"./modulepreload-polyfill-B5Qt9EMX.js";const eu={},nu=typeof location<"u"&&new URLSearchParams(location.search).get("data")||(eu?"./data/":"../../Manythings/LoopSort-teardown/data/"),In={R:"#ff4265",O:"#ff8a27",Y:"#ffd332",G:"#52d94c",B:"#36a9ff",P:"#ad62ff",PNK:"#ff65b2",GR:"#8590a6",BR:"#b8733a",LB:"#21d8d0",DG:"#12a85e",BL:"#5f6bff",W:"#eef1f6",LPNK:"#f79ac0",DPNK:"#c31f6e"},Qs=.85,Tl=["#f5c518","#3fbf4f","#2f8fe0","#ef5fa7","#f2892a","#5fd0e8","#e8442e"],ra=4,Dr=4,iu=64,si=1,su=1.4,ru=1.38,au=.93,Al=1.68*su,ou=1,wl=2.6*ru,Cn=14,lu=.12,cu=0,hu=14,uu=900,Rl=26,Cl=200,Pl=650,fu=1,_i=.92,du=14,Ll=2,pu=3;let Ys,Qr,jr,Jc;async function mu(){const i=async a=>(await fetch(nu+a)).json(),t=["Levels.json","Carriers.json","Splines.json","Areas.json"],[e,n,s,r]=await Promise.all(t.map(i));Ys=Object.fromEntries(e.map(a=>[a.Id,a])),Qr=Object.fromEntries(n.map(a=>[a.Id,a])),jr=Object.fromEntries(s.map(a=>[a.Id,a])),Jc=r.slice().sort((a,o)=>a.UnlockLevel-o.UnlockLevel)}function gu(i,t){const e=i.s===void 0?1:i.s;return((e-2)*t+(3-2*e))*t*t+e*t}function _u(i,t){for(let e=0;e<t;e++){if(i.length<3)return i;const n=[i[0]];for(let s=0;s<i.length-1;s++){const r=i[s],a=i[s+1];s>0&&n.push({x:r.x+(a.x-r.x)*.25,y:r.y+(a.y-r.y)*.25}),s<i.length-2&&n.push({x:r.x+(a.x-r.x)*.75,y:r.y+(a.y-r.y)*.75})}n.push(i[i.length-1]),i=n}return i}function Qc(i,t){const e=gu(i,t),n=i.path;if(!n||n.length<2)return{x:i.fx+(i.tx-i.fx)*e,y:i.fy+(i.ty-i.fy)*e,rot:i.rot};const s=xu(n,e*i.plen);let r=(i.rot1===void 0?i.rot:i.rot1)-i.rot;for(;r>Math.PI;)r-=Math.PI*2;for(;r<-Math.PI;)r+=Math.PI*2;return{x:s.x,y:s.y,rot:i.rot+r*e}}function xu(i,t){for(let e=0;e<i.length-1;e++){const n=i[e+1].x-i[e].x,s=i[e+1].y-i[e].y,r=Math.hypot(n,s);if(t<=r||e===i.length-2){const a=r>1e-6?Math.max(0,Math.min(1,t/r)):1;return{x:i[e].x+n*a,y:i[e].y+s*a}}t-=r}return i[i.length-1]}function Dl(i){let t=null;for(const e of Jc)e.UnlockLevel<=i&&(t=e);return t?t.Type:""}function vu(i){const t=i.split(";"),e=t[0].split(`
`),n=e[0].trim(),s=n.match(/^([0-9]+)/),r=n.match(/^([A-Z])/),a=e.length>1?parseFloat(e[1]):NaN;return{idx:s&&!r?+s[1]:null,mk:r?r[1]:null,rot:isNaN(a)?0:a,x:+t[1],y:+t[2]}}function Mu(i){const t=[],e={};for(const n of i.Spline.split(":")){const s=vu(n);s.idx!==null?t.push({idx:s.idx,x:s.x,y:-s.y}):s.mk&&s.mk!=="Q"&&(e[s.mk]={x:s.x,y:-s.y,rot:s.rot})}return t.sort((n,s)=>n.idx-s.idx),{closed:!!i.Closed,spacing:i.Spacing||.58,path:t,docks:e}}function yu(i){const t=[];for(const e of i.ColorData.split(":")){const n=e.split(";").map(r=>r.trim()).filter(Boolean);if(n.length<2)continue;const s=n.slice(1).map(r=>{const a=r.match(/^([A-Z]+?)(_H)?(?:_K_([A-Z]+))?$/);return a?{color:a[1],hidden:!!a[2],key:a[3]||null,seen:!1}:{color:r.split("_")[0],hidden:!1,key:null,seen:!1}});t.push({lane:n[0],blocks:s})}return t}function Su(i,t){const e=i.length,n=[],s=l=>t?i[(l+e)%e]:l<0?{x:2*i[0].x-i[1].x,y:2*i[0].y-i[1].y}:l>=e?{x:2*i[e-1].x-i[e-2].x,y:2*i[e-1].y-i[e-2].y}:i[l],r=(l,c,u,d,h)=>{const f=Math.max(d-u,1e-6),g=(d-h)/f,y=(h-u)/f;return{x:g*l.x+y*c.x,y:g*l.y+y*c.y}},a=0,o=t?e:e-1;for(let l=a;l<o;l++){const c=s(l-1),u=s(l),d=s(l+1),h=s(l+2),f=(E,M)=>Math.max(Math.sqrt(Math.hypot(M.x-E.x,M.y-E.y)),.001),g=0,y=g+f(c,u),m=y+f(u,d),p=m+f(d,h),S=Math.max(8,Math.ceil((m-y)*8));for(let E=0;E<S;E++){const M=y+(m-y)*(E/S),T=r(c,u,g,y,M),b=r(u,d,y,m,M),C=r(d,h,m,p,M),v=r(T,b,g,m,M),A=r(b,C,y,p,M);n.push(r(v,A,y,m,M))}}return t||n.push(i[e-1]),n}function bu(i,t,e){const n=[],s=i.length,r=t?s:s-1;for(let a=0;a<r;a++){const o=i[a],l=i[(a+1)%s],c=Math.hypot(l.x-o.x,l.y-o.y),u=Math.max(1,Math.ceil(c/e));for(let d=0;d<u;d++)n.push({x:o.x+(l.x-o.x)*(d/u),y:o.y+(l.y-o.y)*(d/u)})}return t||n.push(i[s-1]),n}function Eu(i,t){let e=0;const n=i.length,s=t?n:n-1;for(let r=0;r<s;r++){const a=i[r],o=i[(r+1)%n];e+=Math.hypot(o.x-a.x,o.y-a.y)}return e}function Tu(i){const t=(i||0)*Math.PI/180;return{x:-Math.sin(t),y:Math.cos(t)}}class jc{constructor(t){const e=Ys[t];this.id=t,this.lv=e;const n=Mu(jr[e.Spline]);this.geo=n,this.closed=n.closed,this.ring=bu(Su(n.path,n.closed),n.closed,.18),this.len=Eu(this.ring,n.closed),this.r=.215*au;const s=this.r*2;this.abreast=Math.max(1,Math.floor(2*(_i-this.r)/s)+1),this.railSlots=Math.floor(this.len/s*this.abreast*.8),this.slotCount=e.SlotCount,this.perBlock=iu,this.capCubes=this.slotCount*this.perBlock,this.trucks=yu(Qr[e.Carriers]).map(r=>{const a=n.docks[r.lane],o=Tu(a.rot),l=this.railToward(a.x,a.y,o.x,o.y);return{lane:r.lane,blocks:r.blocks,x:a.x,y:a.y,mx:o.x,my:o.y,px:l.px,py:l.py,cap:ra,fill:0,claim:null,lastDump:null,gone:!1,ate:0,ripple:-1,drain:-1,check:-1,confetti:[],miniPops:[]}});for(const r of this.trucks)this.reveal(r);if(this.fit=1,this.trucks.length>1){const r=a=>{const o=this.trucks.map(l=>{const c=l.cap*Al*a+ou/2,u=wl*a/2,d=-l.my,h=l.mx,f=[];for(const g of[0,c])for(const y of[-1,1])f.push({x:l.x-l.mx*g+d*y*u,y:l.y-l.my*g+h*y*u});return{x0:Math.min(...f.map(g=>g.x)),x1:Math.max(...f.map(g=>g.x)),y0:Math.min(...f.map(g=>g.y)),y1:Math.max(...f.map(g=>g.y))}});for(let l=0;l<o.length;l++)for(let c=l+1;c<o.length;c++){const u=o[l],d=o[c];if(Math.min(u.x1,d.x1)>Math.max(u.x0,d.x0)&&Math.min(u.y1,d.y1)>Math.max(u.y0,d.y0))return!0}return!1};if(r(1)){let a=.1,o=1;for(let l=0;l<24;l++){const c=(a+o)/2;r(c)?o=c:a=c}this.fit=a}}this.slotLen=Al*this.fit,this.truckW=wl*this.fit,this.cubes=[],this.pending=[],this.flying=[],this.state="play",this.taps=0,this.peak=0,this.history=[],this.pourSeq=0,this.delivered={},this.revived={},this.now=performance.now(),this.bounds=this.computeBounds(),this.extraTrays=0}get spare(){return this._spare===void 0&&(this._spare=this.findSpareDock()),this._spare}set spare(t){this._spare=t}findSpareDock(){const t=this.ring,e=t.length,n=ra*this.slotLen,s=this.truckW/2,r=_i+Qs+.35,a=this.trucks.map(S=>Math.hypot(S.x-S.px,S.y-S.py)).sort((S,E)=>S-E),o=Math.max(2.2,Math.min(3.6,a.length?a[a.length>>1]:2.8)),l=this.trucks.map(S=>({x:S.x,y:S.y,mx:S.mx,my:S.my,L:S.cap*this.slotLen,h:s})),c=(S,E,M,T)=>{const b=(S.x-E)*S.mx+(S.y-M)*S.my,C=-(E-S.x)*S.my+(M-S.y)*S.mx;return b>-T&&b<S.L+T&&Math.abs(C)<S.h+T},u=t.filter((S,E)=>E%2===0),d=(S,E)=>{let M=1/0;for(const T of u){const b=(T.x-S)**2+(T.y-E)**2;b<M&&(M=b)}return Math.sqrt(M)},h=this.bounds,f=h.x1-h.x0,g=h.y1-h.y0,y=_i+Qs+.5;let m=null;const p=Math.max(1,Math.round(.5/.18));for(let S=0;S<e;S+=p){const E=t[this.closed?(S-1+e)%e:Math.max(0,S-1)],M=t[this.closed?(S+1)%e:Math.min(e-1,S+1)],T=Math.hypot(M.x-E.x,M.y-E.y)||1,b=-(M.y-E.y)/T,C=(M.x-E.x)/T;for(const v of[-1,1])for(const A of[o,o*.85,o*1.2]){const O=Math.round(Math.atan2(C*v,b*v)/(Math.PI/2))*(Math.PI/2),N=Math.round(Math.cos(O)),I=Math.round(Math.sin(O));if(N*b*v+I*C*v<Math.cos(Math.PI/6))continue;const X=t[S].x+N*A,B=t[S].y+I*A,q=0,st={x:X,y:B,mx:-N,my:-I,L:n,h:s};let J=!0,pt=1/0,Q=h.x0,ct=h.x1,ut=h.y0,zt=h.y1;for(let Wt=0;J&&Wt<=n+1e-6;Wt+=.5)for(const Jt of[-s-.15,0,s+.15]){const j=X+N*Wt-I*Jt,ot=B+I*Wt+N*Jt,Mt=d(j,ot);if(Mt<r){J=!1;break}if(pt=Math.min(pt,Mt),l.some($t=>c($t,j,ot,.35))){J=!1;break}Q=Math.min(Q,j-y),ct=Math.max(ct,j+y),ut=Math.min(ut,ot-y),zt=Math.max(zt,ot+y)}for(let Wt=0;J&&Wt<=A;Wt+=.4)l.some(Jt=>c(Jt,X-N*Wt,B-I*Wt,.2))&&(J=!1);if(J)for(const Wt of l)for(let Jt=0;J&&Jt<=Wt.L;Jt+=.5)c(st,Wt.x-Wt.mx*Jt,Wt.y-Wt.my*Jt,.35)&&(J=!1);if(!J)continue;const Ot=Math.max((ct-Q)/f,(zt-ut)/g),pe=Ot*20-Math.min(pt,6)*.05+Math.abs(q);if(!m||pe<m.score){const Wt=this.railToward(X,B,-N,-I);m={x:X,y:B,mx:-N,my:-I,px:Wt.px,py:Wt.py,score:pe,grow:Ot}}}}return m}get plaque(){return this._plaque===void 0&&(this._plaque=this.findPlaque()),this._plaque}findPlaque(){if(!this.closed)return null;const t=this.ring,e=this.bounds,n=(c,u)=>{let d=!1;for(let h=0,f=t.length-1;h<t.length;f=h++)t[h].y>u!=t[f].y>u&&c<(t[f].x-t[h].x)*(u-t[h].y)/(t[f].y-t[h].y)+t[h].x&&(d=!d);return d},s=t.filter((c,u)=>u%2===0),r=this.trucks.map(c=>({x:c.x,y:c.y,mx:c.mx,my:c.my,L:c.cap*this.slotLen,h:this.truckW/2})),a=(c,u)=>{let d=1/0;for(const h of s)d=Math.min(d,(h.x-c)**2+(h.y-u)**2);d=Math.sqrt(d)-(_i+Qs);for(const h of r){const f=(h.x-c)*h.mx+(h.y-u)*h.my,g=-(c-h.x)*h.my+(u-h.y)*h.mx,y=f<0?-f:f>h.L?f-h.L:0,m=Math.abs(g)-h.h;d=Math.min(d,Math.hypot(Math.max(0,y),Math.max(0,m)))}return d};let o=null;const l=.5;for(let c=e.x0;c<=e.x1;c+=l)for(let u=e.y0;u<=e.y1;u+=l){const d=a(c,u);d<2.4||n(c,u)&&(!o||d>o.clear)&&(o={x:c,y:u,clear:d})}return o}canAddTray(){return this.state!=="win"&&this.extraTrays<1&&!!this.spare}addTray(){if(!this.canAddTray())return!1;const t=this.spare;return this.trucks.push({lane:"+",blocks:[],x:t.x,y:t.y,mx:t.mx,my:t.my,px:t.px,py:t.py,cap:ra,fill:0,claim:null,lastDump:null,gone:!1,ate:0,ripple:-1,drain:-1,check:-1,confetti:[],miniPops:[],extra:!0,addedAt:this.now}),this.extraTrays++,this.spare=null,this._plaque=void 0,this.bounds=this.computeBounds(),this.state="play",!0}railToward(t,e,n,s){let r=null,a=1/0;for(const o of this.ring){const l=o.x-t,c=o.y-e;if(l*n+c*s<=0)continue;const u=l*l+c*c;u<a&&(a=u,r=o)}return r?{px:r.x,py:r.y}:this.nearestPoint(t,e)}nearestPoint(t,e){let n=0,s=1/0;for(let r=0;r<this.ring.length;r++){const a=this.ring[r].x-t,o=this.ring[r].y-e,l=a*a+o*o;l<s&&(s=l,n=r)}return{i:n,px:this.ring[n].x,py:this.ring[n].y}}computeBounds(){let t=1/0,e=1/0,n=-1/0,s=-1/0;const r=(o,l)=>{t=Math.min(t,o),e=Math.min(e,l),n=Math.max(n,o),s=Math.max(s,l)};for(const o of this.ring)r(o.x,o.y);for(const o of this.trucks){const l=o.cap*this.slotLen+.5,c=this.truckW/2+.3;for(const u of[0,l])for(const d of[-1,1])r(o.x-o.mx*u-o.my*d*c,o.y-o.my*u+o.mx*d*c)}const a=_i+Qs+.5;return{x0:t-a,y0:e-a,x1:n+a,y1:s+a}}reveal(t){t.blocks.length&&(t.blocks[t.blocks.length-1].seen=!0)}slotPos(t,e,n){const s=t.cap*this.slotLen-(e+(n===void 0?.5:n))*this.slotLen;return{x:t.x-t.mx*s,y:t.y-t.my*s}}candyPos(t,e,n){const s=this.slotPos(t,e),r=n%16,a=(r%4-1.5)*this.slotLen*.235,o=(Math.floor(r/4)-1.5)*this.slotLen*.235;return{x:s.x+t.mx*a-t.my*o,y:s.y+t.my*a+t.mx*o}}packing(t){return t.fill>0||this.flying.some(e=>e.truck===t)}canStart(t,e){return t.fill>0?!0:!this.trucks.some(n=>n!==t&&!n.gone&&n.fill>0&&n.claim===e)}accepts(t,e){return t.gone||t.blocks.length>=t.cap?!1:t.fill>0?e===t.claim:t.blocks.length?e===t.blocks[t.blocks.length-1].color:!0}wants(t){return t.gone||t.blocks.length>=t.cap?null:t.fill>0?t.claim:t.blocks.length?t.blocks[t.blocks.length-1].color:"*"}loose(){return this.cubes.length+this.pending.length}candyCount(){let t=this.loose();for(const e of this.trucks)t+=e.fill;return t}counter(){return Math.ceil(this.candyCount()/this.perBlock)}tapSlot(t){return!t||!t.blocks.length?-1:t.blocks.length-1}tapLoad(t){return this.tapRun(t).boxes}tapRun(t){const e=t.fill>0,n=e?t.claim:t.blocks.length?t.blocks[t.blocks.length-1].color:null;let s=0;for(let r=t.blocks.length-1;r>=0;r--){const a=t.blocks[r];if(a.color!==n||a.hidden&&!a.seen||a.flying)break;s++}return{partial:e,boxes:s,color:n}}canTap(t,e){if(this.state!=="play"||t.gone||t.drain>=0||this.innerSlot(t,e))return!1;if(t.fill>0)return!0;if(!t.blocks.length||this.flying.some(s=>s.truck===t))return!1;const n=this.tapLoad(t);return n>=1&&this.counter()+n<=this.slotCount}canTapAny(t){return!!t&&this.canTap(t)}isStuck(){if(this.state!=="play"||this.pending.length||this.flying.length)return!1;for(const t of this.trucks)if(!t.gone&&t.drain>=0)return!1;for(const t of this.cubes)for(const e of this.trucks)if(this.accepts(e,t.color))return!1;for(const t of this.trucks)if(this.canTapAny(t))return!1;return!0}innerSlot(t,e){return Number.isInteger(e)&&e<t.blocks.length-(t.fill>0?0:this.tapRun(t).boxes)}tap(t,e){if(!this.canTap(t,e))return!1;const n=this.now;if(t.ripple=n,this.pending.some(u=>u.truck===t)){for(const u of this.pending)u.truck===t&&(u.at=n);this.releaseDue(n,t)}const s=this.tapRun(t),r=s.color,a=s.partial&&this.counter()+s.boxes>this.slotCount?0:s.boxes;t.rippleSlot=t.blocks.length-1+(s.partial?1:0);const o=[];if(s.partial){const u=t.blocks.length,d=this.flying.filter(f=>f.truck===t&&f.slot===u);this.flying=this.flying.filter(f=>!d.includes(f));const h=Array.from({length:t.fill},(f,g)=>g);for(const f of h)o.push({slot:u,piece:f});t.fill=0}const l=t.blocks.length;t.blocks.length-=a;for(let u=0;u<a;u++)for(let d=0;d<this.perBlock;d++)o.push({slot:l-1-u,piece:d});t.claim=null,this.reveal(t),this.taps++;const c=++this.pourSeq;return s.partial?this.history=[]:this.history.push({truck:t,color:r,n:a,pour:c}),o.forEach(({slot:u,piece:d})=>this.pending.push({color:r,truck:t,slot:u,piece:d,pour:c,tapAt:n,at:n+cu+d*hu})),this.peak=Math.max(this.peak,this.counter()),!0}finish(t,e){const n=this.now;if(t.gone=!0,e){t.drain=n,t.check=n;for(let s=0;s<28;s++){const r=Math.random()*Math.PI*2,a=1.6+Math.random()*4.4;t.confetti.push({x:t.x,y:t.y,vx:Math.cos(r)*a,vy:Math.sin(r)*a-2,rot:Math.random()*6.3,vr:(Math.random()-.5)*14,col:Tl[Math.random()*Tl.length|0],life:0})}}}probe(t){const e=this.ring,n=e.length;let s=-1,r=1/0;const a=h=>{const f=this.closed?(h%n+n)%n:Math.max(0,Math.min(n-1,h)),g=e[f].x-t.x,y=e[f].y-t.y,m=g*g+y*y;m<r&&(r=m,s=f)};if(t.seg===void 0)for(let h=0;h<n;h++)a(h);else for(let h=-14;h<=14;h++)a(t.seg+h);t.seg=s;const o=this.closed?(s-1+n)%n:Math.max(0,s-1),l=this.closed?(s+1)%n:Math.min(n-1,s+1);let c=e[l].x-e[o].x,u=e[l].y-e[o].y;const d=Math.hypot(c,u)||1;return{px:e[s].x,py:e[s].y,tx:c/d,ty:u/d}}physics(t){const e=this.cubes,n=e.length;if(!n)return;const s=this.r,r=s*2*(s*2),a=_i-s,o=a+3.5,l=this.ring.length-1;for(const h of e){if(h.way&&h.way.length){const E=h.way[0];let M=E.x-h.x,T=E.y-h.y;const b=Math.hypot(M,T);((h.x-E.x)*E.nx+(h.y-E.y)*E.ny>=-.02||b<=Cn*t*1.2||(h.lap||0)>E.budget)&&h.way.shift(),M/=b||1,T/=b||1,h.vx=M*Cn,h.vy=T*Cn,h.x+=h.vx*t,h.y+=h.vy*t;continue}const f=this.probe(h);h.landed||(h.mtx!==void 0&&f.tx*h.mtx+f.ty*h.mty<0&&(f.tx=-f.tx,f.ty=-f.ty),h.mtx=f.tx,h.mty=f.ty);const g=-f.ty,y=f.tx,m=(h.x-f.px)*g+(h.y-f.py)*y;let p=h.vx*f.tx+h.vy*f.ty,S=h.vx*g+h.vy*y;if(!h.landed&&Math.abs(m)<=a&&(h.landed=!0,h.way=null),h.landed)p+=((h.spd||Cn)-p)*Math.min(1,du*t),S*=Math.exp(-7*t),h.vx=f.tx*p+g*S,h.vy=f.ty*p+y*S;else{let E,M;{const b=h.src;let C=0,v=0,A=0;b&&(C=b.px-b.x,v=b.py-b.y,A=Math.hypot(C,v)),!h.offRamp&&(A<=.4||((h.x-b.x)*C+(h.y-b.y)*v)/A>=A)&&(h.offRamp=!0,h.offAt=h.lap||0);let O,N;A>.4?(O=C/A,N=v/A):(O=-Math.sign(m)*g,N=-Math.sign(m)*y);const I=-Math.sign(m)*g,X=-Math.sign(m)*y;if(!h.offRamp)C=O,v=N;else{const q=Math.min(1,((h.lap||0)-(h.offAt||0))/1.6);C=O*(1-q)+I*q,v=N*(1-q)+X*q}const B=Math.min(1,Math.abs(m)/fu);E=C*B+f.tx*(1-B),M=v*B+f.ty*(1-B)}let T=Math.hypot(E,M);T<.001&&(E=-Math.sign(m)*g,M=-Math.sign(m)*y,T=1),h.vx=E/T*Cn,h.vy=M/T*Cn}if(h.x+=h.vx*t,h.y+=h.vy*t,h.landed){const E=(h.x-f.px)*g+(h.y-f.py)*y;if(Math.abs(E)>a){const M=Math.sign(E),T=Math.abs(E)-a;h.x-=g*T*M,h.y-=y*T*M;const b=h.vx*g+h.vy*y;b*M>0&&(h.vx-=g*b,h.vy-=y*b)}}else if(!h.src&&Math.abs(m)>o){const E=Math.sign(m),M=Math.abs(m)-o;h.x-=g*M*E,h.y-=y*M*E}if(h.vrot*=.93,h.rot+=h.vrot*t,!this.closed&&h.seg>=l-1){const E=this.ring[l];(h.x-E.x)*f.tx+(h.y-E.y)*f.ty>0&&(h.x=this.ring[0].x,h.y=this.ring[0].y,h.seg=0)}}const c=s*2.2,u=h=>!h.landed,d=(h,f)=>(h+32768)*65536+(f+32768);for(let h=0;h<pu;h++){const f=new Map;for(let g=0;g<n;g++){const y=e[g];if(u(y))continue;const m=d(y.x/c|0,y.y/c|0);let p=f.get(m);p||f.set(m,p=[]),p.push(g)}for(let g=0;g<n;g++){const y=e[g];if(u(y))continue;const m=y.x/c|0,p=y.y/c|0;for(let S=m-1;S<=m+1;S++)for(let E=p-1;E<=p+1;E++){const M=f.get(d(S,E));if(M)for(const T of M){if(T<=g)continue;const b=e[T];let C=b.x-y.x,v=b.y-y.y;const A=C*C+v*v;if(A>=r||A===0)continue;const O=Math.sqrt(A);C/=O,v/=O;const N=s*2-O;if(y.x-=C*N*.5,y.y-=v*N*.5,b.x+=C*N*.5,b.y+=v*N*.5,h===0){const I=(b.vx-y.vx)*C+(b.vy-y.vy)*v;if(I<0){const X=-1.25*I*.5;y.vx-=C*X,y.vy-=v*X,b.vx+=C*X,b.vy+=v*X;const B=Math.min(10,Math.abs(X)*8);y.vrot+=(Math.random()-.5)*B,b.vrot+=(Math.random()-.5)*B}}}}}}}releaseDue(t,e=null){for(let n=0;n<this.pending.length;n++){const s=this.pending[n];if(s.at>t||e&&s.truck!==e)continue;const r=s.truck,a=this.candyPos(r,s.slot,s.piece),o=Cn,l=r.x-a.x,c=r.y-a.y,u=Math.hypot(l,c)||1,d=[{x:r.x,y:r.y,nx:r.mx,ny:r.my,budget:u*2+.6}],h=l,f=c;this.cubes.push({x:a.x,y:a.y,vx:h/u*o,vy:f/u*o,rot:Math.atan2(f,h),vrot:0,way:d,sz:1,color:s.color,piece:s.piece,slot:s.slot,seg:void 0,spd:Cn*(1+(Math.random()*2-1)*lu),src:r,born:t}),r.pourUntil=t+uu,this.pending.splice(n,1),n--}}step(t,e){this.now=e;for(const o of this.trucks){o.miniPops=(o.miniPops||[]).filter(l=>e-l.at<700);for(const l of o.confetti)l.life+=t,l.vy+=9*t,l.x+=l.vx*t,l.y+=l.vy*t,l.rot+=l.vr*t;o.confetti=o.confetti.filter(l=>l.life<1.3)}const n=this.flying.filter(o=>e-o.at>=o.ms);for(const o of n)(o.truck.miniPops||(o.truck.miniPops=[])).push({slot:o.slot,piece:o.piece,at:e});this.flying=this.flying.filter(o=>e-o.at<o.ms);for(const o of this.trucks)for(let l=0;l<o.blocks.length;l++)if(o.blocks[l].flying){const c=this.flying.some(u=>u.truck===o&&u.slot===l);o.blocks[l].flying=c,c||(o.blocks[l].packedAt=e)}if(this.state==="play"&&(this.peak=Math.max(this.peak,this.counter())),this.state!=="play")return;this.releaseDue(e);const s=t/Ll;for(const o of this.cubes)o._x=o.x,o._y=o.y;for(let o=0;o<Ll;o++)this.physics(s);const r=6.5*t;for(const o of this.cubes){if(Math.hypot(o.vx,o.vy)<3)continue;let l=Math.atan2(o.vy,o.vx)-o.rot;for(;l>Math.PI;)l-=Math.PI*2;for(;l<-Math.PI;)l+=Math.PI*2;o.rot+=Math.max(-r,Math.min(r,l))}const a=this.len*.34;for(const o of this.cubes)o.lap=(o.lap||0)+Math.hypot(o.x-o._x,o.y-o._y),o.src&&o.lap>a&&(o.src=null);this.absorb(e);for(const o of this.trucks)!o.gone&&o.blocks.length&&!this.flying.some(l=>l.truck===o)&&this.deliver(o);!this.cubes.length&&!this.pending.length&&!this.flying.length&&this.trucks.every(o=>o.gone||!o.blocks.length&&!o.fill)?this.state="win":this.isStuck()&&(this.state="lose")}absorb(t){const e=Math.max(this.r*2.6,_i+this.r),n=e*e;for(const s of this.trucks)if(!s.gone&&!(t<(s.pourUntil||0))&&!this.cubes.some(r=>r.src===s&&!r.landed))for(let r=this.cubes.length-1;r>=0;r--){const a=this.cubes[r];if(a.src===s||!this.accepts(s,a.color)||!this.canStart(s,a.color))continue;const o=a.x-s.px,l=a.y-s.py;if(o*o+l*l>n)continue;this.cubes.splice(r,1),s.fill||(s.claim=a.color,s.lastDump=null),this.history=this.history.filter(E=>E.color!==a.color);const c=s.blocks.length,u=s.fill,d=this.candyPos(s,c,u),h=[{x:a.x,y:a.y}];Math.hypot(s.px-s.x,s.py-s.y)>.4&&h.push({x:s.px,y:s.py}),h.push({x:s.x,y:s.y},{x:d.x,y:d.y});for(let E=h.length-1;E>0;E--)Math.hypot(h[E].x-h[E-1].x,h[E].y-h[E-1].y)<.001&&h.splice(E,1);const f=_u(h,2);let g=0;for(let E=0;E<f.length-1;E++)g+=Math.hypot(f[E+1].x-f[E].x,f[E+1].y-f[E].y);const y=Math.max(Cl,Math.min(Pl,g/Rl*1e3)),m=Math.max(0,Math.min(3,Cn*y/1e3/(g||1))),p=Math.max(t,s.nextFlyAt||0);s.nextFlyAt=p+10,s.arriveAt=Math.max(s.arriveAt||0,p+y),s.ate=s.arriveAt;const S={at:p,ms:y,s:m,truck:s,slot:c,piece:u,color:a.color,rot:a.rot,rot1:Math.atan2(s.my,s.mx),sz:a.sz,path:f,plen:g,fx:a.x,fy:a.y,tx:d.x,ty:d.y};if(this.flying.push(S),s.fill++,s.fill>=this.perBlock){s.fill=0;const E={color:s.claim,hidden:!1,key:null,seen:!0,flying:!0};s.blocks.push(E);for(const M of this.flying)M.truck===s&&M.slot===c&&(M.block=E);s.claim=null}}}deliver(t){if(t.gone||this.packing(t)||t.blocks.some(r=>r.flying))return!1;const e={};for(const r of t.blocks)e[r.color]=(e[r.color]||0)+1;let n=null;for(const r in e)e[r]>=Dr&&(n=r);if(!n)return!1;this.delivered[n]=(this.delivered[n]||0)+Dr*this.perBlock;let s=Dr;return t.blocks=t.blocks.filter(r=>!(r.color===n&&s-- >0)),t.blocks.length?(t.flashDeliver=this.now,this.reveal(t)):this.finish(t,!0),!0}canUndo(){const t=this.history[this.history.length-1];return!t||t.truck.gone||this.packing(t.truck)||this.cubes.filter(n=>n.color===t.color).length+this.pending.filter(n=>n.color===t.color).length<t.n*this.perBlock||t.truck.blocks.length+t.n>t.truck.cap?null:t}undo(){const t=this.canUndo();if(!t)return!1;let n=t.n*this.perBlock;if(this.pending=this.pending.filter(s=>s.pour!==t.pour?!0:(n--,!1)),n>0){const s=this.cubes.map((a,o)=>({i:o,d:(a.x-t.truck.px)**2+(a.y-t.truck.py)**2,c:a})).filter(a=>a.c.color===t.color).sort((a,o)=>o.d-a.d).slice(0,n).map(a=>a.c),r=new Set(s);this.cubes=this.cubes.filter(a=>!r.has(a))}for(let s=0;s<t.n;s++)t.truck.blocks.push({color:t.color,hidden:!1,key:null,seen:!0});return t.truck.lastDump=null,this.reveal(t.truck),this.history.pop(),this.state="play",!0}shuffle(t){if(t.gone||t.blocks.length<2||this.packing(t))return!1;for(let e=t.blocks.length-1;e>0;e--){const n=Math.random()*(e+1)|0;[t.blocks[e],t.blocks[n]]=[t.blocks[n],t.blocks[e]]}for(const e of t.blocks)e.seen=e.seen||!e.hidden;return this.reveal(t),t.lastDump=null,!0}addConveyorSlot(){return this.slotCount++,this.capCubes=this.slotCount*this.perBlock,this.state==="lose"&&(this.state="play",this.isStuck()&&(this.state="lose")),!0}addBaySlot(t){return t.gone||this.packing(t)||this.pending.some(e=>e.truck===t)?!1:(t.cap++,this.bounds=this.computeBounds(),!0)}revivePlan(){const t={};for(const s of this.cubes)t[s.color]=(t[s.color]||0)+1;for(const s of this.pending)t[s.color]=(t[s.color]||0)+1;for(const s of this.trucks)s.fill&&(t[s.claim]=(t[s.claim]||0)+s.fill);for(const s of this.flying)s.block&&(t[s.color]=(t[s.color]||0)+1);let e=null,n=-1;for(const s in t)t[s]>n&&(n=t[s],e=s);return e}revive(){const t=this.revivePlan();if(!t)return null;let e=this.cubes.filter(n=>n.color===t).length+this.pending.filter(n=>n.color===t).length;this.cubes=this.cubes.filter(n=>n.color!==t),this.pending=this.pending.filter(n=>n.color!==t),this.flying=this.flying.filter(n=>n.color!==t);for(const n of this.trucks){e+=n.blocks.filter(s=>s.color===t).length*this.perBlock,n.blocks=n.blocks.filter(s=>s.color!==t),n.claim===t&&(e+=n.fill,n.claim=null,n.fill=0),n.lastDump===t&&(n.lastDump=null);for(const s of this.flying.filter(r=>r.truck===n)){const r=s.block?n.blocks.indexOf(s.block):n.blocks.length;if(r===s.slot)continue;const a=Qc(s,Math.max(0,Math.min(1,(this.now-s.at)/s.ms))),o=this.candyPos(n,r,s.piece);s.slot=r,s.path=[{x:a.x,y:a.y},o],s.plen=Math.hypot(o.x-a.x,o.y-a.y),s.fx=a.x,s.fy=a.y,s.tx=o.x,s.ty=o.y,s.rot=a.rot,s.at=this.now,s.ms=Math.max(Cl,Math.min(Pl,s.plen/Rl*1e3)),s.s=Math.min(3,Cn*s.ms/1e3/(s.plen||1))}n.arriveAt=Math.max(this.now,...this.flying.filter(s=>s.truck===n).map(s=>s.at+s.ms)),n.ate=n.arriveAt,this.reveal(n)}return this.revived[t]=(this.revived[t]||0)+e,this.history=[],this.state="play",t}hitTest(t,e){for(const n of this.trucks){if(n.gone)continue;const s=t-n.x,r=e-n.y,a=-(s*n.mx+r*n.my),o=s*-n.my+r*n.mx;if(a>=-.6&&a<=n.cap*this.slotLen+.6&&Math.abs(o)<=this.truckW/2+.4)return n}return null}}let dn=null,ns=null,Zi=null,Xa=0,th=0;function Au(i){dn=i,i.getContext("2d")}function eh(i){ns=i,Yo()}function Be(){return ns}function Il(i,t){Xa=i||0,th=t||0,Yo()}function wu(i,t){if(!ns||!Zi)return null;const e=dn.getBoundingClientRect(),n=dn.width/e.width;return ns.hitTest(((i-e.left)*n-Zi.ox)/Zi.sc,((t-e.top)*n-Zi.oy)/Zi.sc)}function Yo(){const i=dn.getBoundingClientRect(),t=Math.min(2,window.devicePixelRatio||1);if(dn.width=Math.max(1,Math.round(i.width*t)),dn.height=Math.max(1,Math.round(i.height*t)),!ns)return;const e=ns.bounds,n=Math.round(Xa*t),s=Xa?Math.round(Math.min(dn.width*.082,dn.height*.046)):0,r=n+Math.round(s*1.35),a=Math.round(th*t),o=Math.min(dn.width/(e.x1-e.x0),(dn.height-r-a)/(e.y1-e.y0));Zi={sc:o,head:r,bar:n,gauge:s,ox:(dn.width-(e.x1-e.x0)*o)/2-e.x0*o,oy:r+(dn.height-r-a-(e.y1-e.y0)*o)/2-e.y0*o}}const nh="ls_sound";let ri=localStorage.getItem(nh)!=="0",we=null,ws=null,Ki=null,qa=null;const Ul={};function Nl(){if(!we){const i=window.AudioContext||window.webkitAudioContext;if(!i)return null;we=new i;const t=we.createGain();t.gain.value=.62;const e=we.createBiquadFilter();e.type="lowpass",e.frequency.value=5200,e.Q.value=.7;const n=we.createBiquadFilter();n.type="highshelf",n.frequency.value=2400,n.gain.value=-6,t.connect(e),e.connect(n),n.connect(we.destination),ws=we.createGain(),ws.gain.value=1,ws.connect(t),Ki=we.createDelay(.6);const s=we.createGain(),r=we.createBiquadFilter(),a=we.createGain();Ki.delayTime.value=.17,s.gain.value=.25,r.type="lowpass",r.frequency.value=2800,a.gain.value=.45,Ki.connect(r),r.connect(s),s.connect(Ki),Ki.connect(a),a.connect(t);const o=Math.floor(we.sampleRate*.5);qa=we.createBuffer(1,o,we.sampleRate);const l=qa.getChannelData(0);for(let c=0;c<o;c++)l[c]=Math.random()*2-1}return we.state==="suspended"&&we.resume().catch(()=>{}),we}function Te({f:i,f2:t,dur:e,type:n="sine",vol:s=.15,at:r=0,atk:a=.006,wet:o=0}){const l=we.currentTime+r,c=we.createOscillator(),u=we.createGain();if(c.type=n,c.frequency.setValueAtTime(i,l),t&&c.frequency.exponentialRampToValueAtTime(Math.max(20,t),l+e),u.gain.setValueAtTime(1e-4,l),u.gain.exponentialRampToValueAtTime(s,l+a),u.gain.exponentialRampToValueAtTime(1e-4,l+e),c.connect(u),u.connect(ws),o){const d=we.createGain();d.gain.value=o,u.connect(d),d.connect(Ki)}c.start(l),c.stop(l+e+.03)}function ai({f:i=1800,f2:t,dur:e,vol:n=.1,q:s=1.2,type:r="bandpass",at:a=0}){const o=we.currentTime+a,l=we.createBufferSource();l.buffer=qa;const c=we.createBiquadFilter();c.type=r,c.Q.value=s,c.frequency.setValueAtTime(i,o),t&&c.frequency.exponentialRampToValueAtTime(t,o+e);const u=we.createGain();u.gain.setValueAtTime(n,o),u.gain.exponentialRampToValueAtTime(1e-4,o+e),l.connect(c),c.connect(u),u.connect(ws),l.start(o,Math.random()*.3),l.stop(o+e+.02)}const je=i=>440*Math.pow(2,(i-69)/12);function js(i,t){const e=performance.now();return e-(Ul[i]||-1/0)<t?!1:(Ul[i]=e,!0)}let aa=0;const kr={ui(){Te({f:740,f2:990,dur:.07,type:"sine",vol:.05,atk:.008})},pour(i){ai({f:2600,f2:1300,dur:.14,vol:.05,q:.8,type:"lowpass"}),ai({f:1800,f2:2600,dur:.08,vol:.03,at:.05,type:"lowpass"});const t=Math.max(1,Math.min(3,i||1));[0,4,7,12].forEach((e,n)=>Te({f:je(67+e),f2:je(67+e)*1.5,dur:.1,vol:.09+t*.01,at:.04+n*.05,wet:.12}))},belt(){js("belt",110)&&(ai({f:1600+Math.random()*700,dur:.05,vol:.022,q:1.4,type:"lowpass"}),Te({f:620+Math.random()*260,f2:430,dur:.06,vol:.022,atk:.01}))},catch(){if(!js("catch",95))return;aa=(aa+1)%8;const i=je(72+[0,2,4,5,7,9,11,12][aa]);Te({f:i*.7,f2:i*.44,dur:.16,vol:.1,atk:.008}),Te({f:i*1.35,f2:i*.85,dur:.09,type:"sine",vol:.035,atk:.008})},box(){Te({f:210,f2:130,dur:.14,type:"sine",vol:.11,atk:.006}),ai({f:900,f2:300,dur:.09,vol:.05,q:.8,type:"lowpass"}),[60,64,67,72].forEach((i,t)=>Te({f:je(i),dur:.26,type:"sine",vol:.075,at:.04+t*.06,wet:.25}))},deliver(){Te({f:180,f2:115,dur:.16,type:"sine",vol:.11}),[64,67,72,76,79].forEach((i,t)=>Te({f:je(i),dur:.34,type:"sine",vol:.085,at:.05+t*.065,wet:.3}))},blocked(){Te({f:330,f2:180,dur:.16,type:"sine",vol:.07,atk:.01}),Te({f:165,f2:95,dur:.2,type:"triangle",vol:.03,atk:.012})},whoosh(){ai({f:400,f2:1500,dur:.2,vol:.045,q:.7,type:"lowpass"})},Undo(){kr.whoosh(),[79,76,72].forEach((i,t)=>Te({f:je(i),dur:.12,type:"triangle",vol:.09,at:.05+t*.05}))},Shuffle(){for(let i=0;i<5;i++)ai({f:1200+i*260,dur:.06,vol:.035,q:1.2,type:"lowpass",at:i*.05});Te({f:520,f2:980,dur:.28,vol:.05,wet:.2})},ConveyorCapacity(){kr.whoosh(),[72,79,84].forEach((i,t)=>Te({f:je(i),dur:.2,type:"triangle",vol:.1,at:.06+t*.07,wet:.3}))},Capacity(){Te({f:180,f2:420,dur:.2,type:"triangle",vol:.12}),[76,81,88].forEach((i,t)=>Te({f:je(i),dur:.22,type:"triangle",vol:.1,at:.12+t*.07,wet:.3}))},revive(){[67,72,76,79,84].forEach((i,t)=>Te({f:je(i),dur:.3,type:"triangle",vol:.11,at:t*.08,wet:.35}))},win(){[[60,0],[64,.1],[67,.2],[72,.32],[76,.32]].forEach(([i,t])=>{Te({f:je(i),dur:.6,type:"sine",vol:.11,at:t,wet:.3}),Te({f:je(i-12),dur:.55,vol:.05,at:t})})},star(i){Te({f:je(67+i*4),dur:.34,type:"sine",vol:.12,wet:.3,atk:.01}),Te({f:je(79+i*4),dur:.18,vol:.04,atk:.01})},coin(){[0,.08,.16].forEach((i,t)=>Te({f:780+t*150,dur:.13,type:"sine",vol:.09,at:i,wet:.25,atk:.01}))},lose(){[67,63,60].forEach((i,t)=>Te({f:je(i),f2:je(i)*.97,dur:.3,type:"triangle",vol:.09,at:t*.16}))},launch(){js("launch",120)&&Te({f:300,f2:820,dur:.45,vol:.025,atk:.09})},boom(){if(js("boom",120)){Te({f:88,f2:34,dur:.36,vol:.12,atk:.008}),ai({f:900,f2:140,dur:.4,vol:.05,q:.6,type:"lowpass"});for(let i=0;i<4;i++)ai({f:1200+Math.random()*900,dur:.05,vol:.016,q:1.5,type:"lowpass",at:.12+Math.random()*.4})}}},ne={isEnabled:()=>ri,toggle(){return ri=!ri,localStorage.setItem(nh,ri?"1":"0"),ri&&this.play("ui"),ri},unlock(){ri&&Nl()},play(i,t=1){!ri||!Nl()||!kr[i]||kr[i](t)}};let tr=["#ff4265","#ff8a27","#ffd332","#52d94c","#36a9ff","#ad62ff","#ff65b2","#21d8d0","#fff4b0"];const oa=i=>i[Math.random()*i.length|0],Ru=11;function Cu(i,{sound:t,reduced:e=!1,palette:n=null}={}){n&&(tr=n.filter(C=>!/^#(3|2|1)/.test(C)));const s=document.createElement("canvas");s.className="fireworks",i.prepend(s);const r=s.getContext("2d"),a=Math.min(2,window.devicePixelRatio||1);let o=0,l=0;const c=()=>{const C=i.getBoundingClientRect();o=C.width,l=C.height,s.width=Math.round(o*a),s.height=Math.round(l*a),r.setTransform(a,0,0,a,0,0)};c();const u=[],d=[],h=[],f=performance.now();let g=f,y=f+350,m=f,p=3;function S(C,v=0){u.push({x:C,y:l+10,vx:(Math.random()-.5)*60,vy:-(l*(.95+Math.random()*.35)),at:performance.now()+v,color:oa(tr),top:l*(.14+Math.random()*.3),trail:[],sounded:!1})}function E(C,v,A){const O=Math.random(),N=e?30:70+(Math.random()*40|0),I=oa(tr),X=260+Math.random()*200;for(let B=0;B<N;B++){const q=B/N*Math.PI*2+Math.random()*.08,st=O<.35?X:X*(.35+Math.random()*.75);d.push({x:C,y:v,vx:Math.cos(q)*st,vy:Math.sin(q)*st,life:0,max:1.1+Math.random()*.9,color:B%3?A:I,size:3.2+Math.random()*3,glitter:Math.random()<.3})}d.push({x:C,y:v,vx:0,vy:0,life:0,max:.26,color:"#fff",size:46,flash:!0}),t==null||t.play("boom",.7+Math.random()*.6)}function M(C){for(let v=0;v<C;v++)h.push({x:Math.random()*o,y:-30-Math.random()*120,vx:(Math.random()-.5)*50,vy:120+Math.random()*140,rot:Math.random()*6.3,vr:(Math.random()-.5)*7,color:oa(tr),s:9+Math.random()*7,sway:Math.random()*6.3})}for(const C of[.22,.5,.78])S(o*C,C===.5?120:0);M(e?14:46),t==null||t.play("launch",1);function T(C){r.save(),r.translate(C.x,C.y),r.rotate(C.rot);const v=C.s;r.fillStyle=C.color,r.beginPath(),r.moveTo(-v*.9,0),r.lineTo(-v*1.6,-v*.55),r.lineTo(-v*1.6,v*.55),r.closePath(),r.moveTo(v*.9,0),r.lineTo(v*1.6,-v*.55),r.lineTo(v*1.6,v*.55),r.closePath(),r.globalAlpha=.8,r.fill(),r.globalAlpha=1,r.beginPath(),r.ellipse(0,0,v,v*.72,0,0,Math.PI*2),r.fill(),r.fillStyle="rgba(255,255,255,.55)",r.beginPath(),r.ellipse(-v*.3,-v*.28,v*.35,v*.18,-.4,0,Math.PI*2),r.fill(),r.restore()}function b(C){if(!s.isConnected||i.classList.contains("hide")){s.remove();return}requestAnimationFrame(b);const v=i.getBoundingClientRect();(Math.abs(v.width-o)>1||Math.abs(v.height-l)>1)&&c();const A=Math.min(.05,(C-g)/1e3);g=C;const O=C-f;C>=y&&p<(e?4:Ru)&&(S(o*(.1+Math.random()*.8)),p++,t==null||t.play("launch"),y=C+(e?600:190)),!e&&C>=m&&O<3e3&&(M(O<1200?5:2),m=C+160),r.clearRect(0,0,o,l),r.globalCompositeOperation="lighter";for(let N=u.length-1;N>=0;N--){const I=u[N];if(!(C<I.at)){I.vy+=520*A,I.x+=I.vx*A,I.y+=I.vy*A,I.trail.push({x:I.x,y:I.y}),I.trail.length>10&&I.trail.shift();for(let X=0;X<I.trail.length;X++){const B=I.trail[X];r.fillStyle=`rgba(255,236,170,${X/I.trail.length*.8})`,r.beginPath(),r.arc(B.x,B.y,1.2+X*.22,0,Math.PI*2),r.fill()}(I.y<=I.top||I.vy>=-20)&&(E(I.x,I.y,I.color),u.splice(N,1))}}for(let N=d.length-1;N>=0;N--){const I=d[N];if(I.life+=A,I.life>=I.max){d.splice(N,1);continue}const X=1-I.life/I.max;if(I.flash){const B=r.createRadialGradient(I.x,I.y,0,I.x,I.y,I.size*2.2);B.addColorStop(0,`rgba(255,255,255,${X})`),B.addColorStop(1,"rgba(255,255,255,0)"),r.fillStyle=B,r.beginPath(),r.arc(I.x,I.y,I.size*2.2,0,Math.PI*2),r.fill();continue}I.vx*=1-1.6*A,I.vy*=1-1.6*A,I.vy+=110*A,I.x+=I.vx*A,I.y+=I.vy*A,!(I.glitter&&Math.random()<.35)&&(r.globalAlpha=Math.min(1,X*1.6),r.fillStyle=I.color,r.beginPath(),r.arc(I.x,I.y,I.size*(.5+X*.5),0,Math.PI*2),r.fill())}r.globalAlpha=1,r.globalCompositeOperation="source-over";for(let N=h.length-1;N>=0;N--){const I=h[N];if(I.sway+=A*3,I.x+=(I.vx+Math.sin(I.sway)*30)*A,I.y+=I.vy*A,I.rot+=I.vr*A,I.y>l+40){h.splice(N,1);continue}T(I)}}requestAnimationFrame(b)}function $o(i="happy"){return`<svg class="mascot ${i}" viewBox="0 0 120 96" aria-hidden="true">
    <path d="M22 48 2 30v36Z" fill="#ffb2c9" stroke="#e8628c" stroke-width="3" stroke-linejoin="round"/>
    <path d="M98 48 118 30v36Z" fill="#ffb2c9" stroke="#e8628c" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="60" cy="52" rx="40" ry="34" fill="#ff6f98" stroke="#e8628c" stroke-width="3"/>
    <path d="M34 30q12 44 44 50" fill="none" stroke="#fff3c4" stroke-width="7" opacity=".85"/>
    <ellipse cx="42" cy="32" rx="10" ry="5" fill="#fff" opacity=".6" transform="rotate(-25 42 32)"/>
    ${i==="happy"?'<path d="M44 48q4 -6 8 0M68 48q4 -6 8 0" fill="none" stroke="#5a2340" stroke-width="4" stroke-linecap="round"/>':'<circle cx="48" cy="48" r="4" fill="#5a2340"/><circle cx="72" cy="48" r="4" fill="#5a2340"/>'}${i==="happy"?'<path d="M50 60q10 11 20 0" fill="none" stroke="#5a2340" stroke-width="4" stroke-linecap="round"/><ellipse cx="41" cy="58" rx="6" ry="3.5" fill="#ff8fb3" opacity=".8"/><ellipse cx="79" cy="58" rx="6" ry="3.5" fill="#ff8fb3" opacity=".8"/>':'<path d="M51 66q9 -8 18 0" fill="none" stroke="#5a2340" stroke-width="4" stroke-linecap="round"/><path d="M79 44q2 7 -2 9" fill="none" stroke="#7fd4ff" stroke-width="4" stroke-linecap="round"/>'}
  </svg>`}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Zo="186",Pu=0,Fl=1,Lu=2,Rs=1,Du=2,Ss=3,Ai=0,sn=1,ln=2,Kn=0,Cs=1,Ol=2,Bl=3,kl=4,Iu=5,Ji=100,Uu=101,Nu=102,Fu=103,Ou=104,Bu=200,ku=201,zu=202,Hu=203,ih=204,sh=205,Gu=206,Vu=207,Wu=208,Xu=209,qu=210,Yu=211,$u=212,Zu=213,Ku=214,Ya=0,$a=1,Za=2,Fs=3,Ka=4,Ja=5,Qa=6,ja=7,rh=0,Ju=1,Qu=2,En=0,ah=1,oh=2,lh=3,ch=4,hh=5,uh=6,fh=7,dh=300,wi=301,is=302,la=303,ca=304,ta=306,to=1e3,Zn=1001,eo=1002,Xe=1003,ju=1004,er=1005,Ze=1006,ha=1007,bi=1008,cn=1009,ph=1010,mh=1011,Os=1012,Ko=1013,On=1014,Un=1015,Bn=1016,Jo=1017,Qo=1018,Bs=1020,gh=35902,_h=35899,xh=1021,vh=1022,bn=1023,jn=1026,Ei=1027,Mh=1028,jo=1029,Ri=1030,tl=1031,el=1033,Ir=33776,Ur=33777,Nr=33778,Fr=33779,no=35840,io=35841,so=35842,ro=35843,ao=36196,oo=37492,lo=37496,co=37488,ho=37489,zr=37490,uo=37491,fo=37808,po=37809,mo=37810,go=37811,_o=37812,xo=37813,vo=37814,Mo=37815,yo=37816,So=37817,bo=37818,Eo=37819,To=37820,Ao=37821,wo=36492,Ro=36494,Co=36495,Po=36283,Lo=36284,Hr=36285,Do=36286,tf=3200,Io=0,ef=1,di="",on="srgb",Gr="srgb-linear",Vr="linear",ve="srgb",ua=7680,nf=519,sf=512,rf=513,af=514,nl=515,of=516,lf=517,il=518,cf=519,hf=35044,zl="300 es",Nn=2e3,ks=2001;function uf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Wr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ff(){const i=Wr("canvas");return i.style.display="block",i}const Hl={};function Gl(...i){const t="THREE."+i.shift();console.log(t,...i)}function yh(i){const t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Kt(...i){i=yh(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function de(...i){i=yh(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function ts(...i){const t=i.join(" ");t in Hl||(Hl[t]=!0,Kt(...i))}function df(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const pf={[Ya]:$a,[Za]:Qa,[Ka]:ja,[Fs]:Ja,[$a]:Ya,[Qa]:Za,[ja]:Ka,[Ja]:Fs};class Pi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fa=Math.PI/180,Uo=180/Math.PI;function os(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ye[i&255]+Ye[i>>8&255]+Ye[i>>16&255]+Ye[i>>24&255]+"-"+Ye[t&255]+Ye[t>>8&255]+"-"+Ye[t>>16&15|64]+Ye[t>>24&255]+"-"+Ye[e&63|128]+Ye[e>>8&255]+"-"+Ye[e>>16&255]+Ye[e>>24&255]+Ye[n&255]+Ye[n>>8&255]+Ye[n>>16&255]+Ye[n>>24&255]).toLowerCase()}function le(i,t,e){return Math.max(t,Math.min(e,i))}function mf(i,t){return(i%t+t)%t}function da(i,t,e){return(1-e)*i+e*t}function ds(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function nn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const vl=class vl{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};vl.prototype.isVector2=!0;let Ft=vl;class ls{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],d=n[s+3],h=r[a+0],f=r[a+1],g=r[a+2],y=r[a+3];if(d!==y||l!==h||c!==f||u!==g){let m=l*h+c*f+u*g+d*y;m<0&&(h=-h,f=-f,g=-g,y=-y,m=-m);let p=1-o;if(m<.9995){const S=Math.acos(m),E=Math.sin(S);p=Math.sin(p*S)/E,o=Math.sin(o*S)/E,l=l*p+h*o,c=c*p+f*o,u=u*p+g*o,d=d*p+y*o}else{l=l*p+h*o,c=c*p+f*o,u=u*p+g*o,d=d*p+y*o;const S=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=S,c*=S,u*=S,d*=S}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],d=r[a],h=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+u*d+l*f-c*h,t[e+1]=l*g+u*h+c*d-o*f,t[e+2]=c*g+u*f+o*h-l*d,t[e+3]=u*g-o*d-l*h-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),d=o(r/2),h=l(n/2),f=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"YZX":this._x=h*u*d+c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d-h*f*g;break;case"XZY":this._x=h*u*d-c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d+h*f*g;break;default:Kt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],u=e[6],d=e[10],h=n+o+d;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(u-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(le(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,e=Math.sin(e*c)/u,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Ml=class Ml{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Vl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Vl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),u=2*(o*e-r*s),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*u,this.y=n+l*u+o*c-r*d,this.z=s+l*d+r*u-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return pa.copy(this).projectOnVector(t),this.sub(pa)}reflect(t){return this.sub(pa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Ml.prototype.isVector3=!0;let G=Ml;const pa=new G,Vl=new ls,yl=class yl{constructor(t,e,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],d=n[7],h=n[2],f=n[5],g=n[8],y=s[0],m=s[3],p=s[6],S=s[1],E=s[4],M=s[7],T=s[2],b=s[5],C=s[8];return r[0]=a*y+o*S+l*T,r[3]=a*m+o*E+l*b,r[6]=a*p+o*M+l*C,r[1]=c*y+u*S+d*T,r[4]=c*m+u*E+d*b,r[7]=c*p+u*M+d*C,r[2]=h*y+f*S+g*T,r[5]=h*m+f*E+g*b,r[8]=h*p+f*M+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return e*a*u-e*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],d=u*a-o*c,h=o*l-u*r,f=c*r-a*l,g=e*d+n*h+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return t[0]=d*y,t[1]=(s*c-u*n)*y,t[2]=(o*n-s*a)*y,t[3]=h*y,t[4]=(u*e-s*l)*y,t[5]=(s*r-o*e)*y,t[6]=f*y,t[7]=(n*l-c*e)*y,t[8]=(a*e-n*r)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return ts("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ma.makeScale(t,e)),this}rotate(t){return ts("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ma.makeRotation(-t)),this}translate(t,e){return ts("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ma.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};yl.prototype.isMatrix3=!0;let te=yl;const ma=new te,Wl=new te().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xl=new te().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gf(){const i={enabled:!0,workingColorSpace:Gr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ve&&(s.r=Jn(s.r),s.g=Jn(s.g),s.b=Jn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ve&&(s.r=es(s.r),s.g=es(s.g),s.b=es(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===di?Vr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ts("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ts("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Gr]:{primaries:t,whitePoint:n,transfer:Vr,toXYZ:Wl,fromXYZ:Xl,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:on},outputColorSpaceConfig:{drawingBufferColorSpace:on}},[on]:{primaries:t,whitePoint:n,transfer:ve,toXYZ:Wl,fromXYZ:Xl,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:on}}}),i}const ce=gf();function Jn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function es(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Fi;class _f{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Fi===void 0&&(Fi=Wr("canvas")),Fi.width=t.width,Fi.height=t.height;const s=Fi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Fi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Wr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Jn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Jn(e[n]/255)*255):e[n]=Jn(e[n]);return{data:e,width:t.width,height:t.height}}else return Kt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let xf=0;class sl{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:xf++}),this.uuid=os(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ga(s[a].image)):r.push(ga(s[a]))}else r=ga(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ga(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?_f.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Kt("Texture: Unable to serialize Texture."),{})}let vf=0;const _a=new G;class Ke extends Pi{constructor(t=Ke.DEFAULT_IMAGE,e=Ke.DEFAULT_MAPPING,n=Zn,s=Zn,r=Ze,a=bi,o=bn,l=cn,c=Ke.DEFAULT_ANISOTROPY,u=di){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:vf++}),this.uuid=os(),this.name="",this.source=new sl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ft(0,0),this.repeat=new Ft(1,1),this.center=new Ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(_a).x}get height(){return this.source.getSize(_a).y}get depth(){return this.source.getSize(_a).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Kt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Kt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==dh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case to:t.x=t.x-Math.floor(t.x);break;case Zn:t.x=t.x<0?0:1;break;case eo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case to:t.y=t.y-Math.floor(t.y);break;case Zn:t.y=t.y<0?0:1;break;case eo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ke.DEFAULT_IMAGE=null;Ke.DEFAULT_MAPPING=dh;Ke.DEFAULT_ANISOTROPY=1;const Sl=class Sl{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],g=l[9],y=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(c+1)/2,M=(f+1)/2,T=(p+1)/2,b=(u+h)/4,C=(d+y)/4,v=(g+m)/4;return E>M&&E>T?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=b/n,r=C/n):M>T?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=b/s,r=v/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=C/r,s=v/r),this.set(n,s,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(d-y)*(d-y)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(d-y)/S,this.z=(h-u)/S,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=le(this.x,t.x,e.x),this.y=le(this.y,t.y,e.y),this.z=le(this.z,t.z,e.z),this.w=le(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=le(this.x,t,e),this.y=le(this.y,t,e),this.z=le(this.z,t,e),this.w=le(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(le(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Sl.prototype.isVector4=!0;let Pe=Sl;class Mf extends Pi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ze,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Pe(0,0,t,e),this.scissorTest=!1,this.viewport=new Pe(0,0,t,e),this.textures=[];const s={width:t,height:e,depth:n.depth},r=new Ke(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:Ze,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new sl(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tn extends Mf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Sh extends Ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class yf extends Ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}}const Jr=class Jr{constructor(t,e,n,s,r,a,o,l,c,u,d,h,f,g,y,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,u,d,h,f,g,y,m)}set(t,e,n,s,r,a,o,l,c,u,d,h,f,g,y,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Jr().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,s=1/Oi.setFromMatrixColumn(t,0).length(),r=1/Oi.setFromMatrixColumn(t,1).length(),a=1/Oi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const h=a*u,f=a*d,g=o*u,y=o*d;e[0]=l*u,e[4]=-l*d,e[8]=c,e[1]=f+g*c,e[5]=h-y*c,e[9]=-o*l,e[2]=y-h*c,e[6]=g+f*c,e[10]=a*l}else if(t.order==="YXZ"){const h=l*u,f=l*d,g=c*u,y=c*d;e[0]=h+y*o,e[4]=g*o-f,e[8]=a*c,e[1]=a*d,e[5]=a*u,e[9]=-o,e[2]=f*o-g,e[6]=y+h*o,e[10]=a*l}else if(t.order==="ZXY"){const h=l*u,f=l*d,g=c*u,y=c*d;e[0]=h-y*o,e[4]=-a*d,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*u,e[9]=y-h*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const h=a*u,f=a*d,g=o*u,y=o*d;e[0]=l*u,e[4]=g*c-f,e[8]=h*c+y,e[1]=l*d,e[5]=y*c+h,e[9]=f*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const h=a*l,f=a*c,g=o*l,y=o*c;e[0]=l*u,e[4]=y-h*d,e[8]=g*d+f,e[1]=d,e[5]=a*u,e[9]=-o*u,e[2]=-c*u,e[6]=f*d+g,e[10]=h-y*d}else if(t.order==="XZY"){const h=a*l,f=a*c,g=o*l,y=o*c;e[0]=l*u,e[4]=-d,e[8]=c*u,e[1]=h*d+y,e[5]=a*u,e[9]=f*d-g,e[2]=g*d-f,e[6]=o*u,e[10]=y*d+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Sf,t,bf)}lookAt(t,e,n){const s=this.elements;return rn.subVectors(t,e),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),oi.crossVectors(n,rn),oi.lengthSq()===0&&(Math.abs(n.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),oi.crossVectors(n,rn)),oi.normalize(),nr.crossVectors(rn,oi),s[0]=oi.x,s[4]=nr.x,s[8]=rn.x,s[1]=oi.y,s[5]=nr.y,s[9]=rn.y,s[2]=oi.z,s[6]=nr.z,s[10]=rn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],d=n[5],h=n[9],f=n[13],g=n[2],y=n[6],m=n[10],p=n[14],S=n[3],E=n[7],M=n[11],T=n[15],b=s[0],C=s[4],v=s[8],A=s[12],O=s[1],N=s[5],I=s[9],X=s[13],B=s[2],q=s[6],st=s[10],J=s[14],pt=s[3],Q=s[7],ct=s[11],ut=s[15];return r[0]=a*b+o*O+l*B+c*pt,r[4]=a*C+o*N+l*q+c*Q,r[8]=a*v+o*I+l*st+c*ct,r[12]=a*A+o*X+l*J+c*ut,r[1]=u*b+d*O+h*B+f*pt,r[5]=u*C+d*N+h*q+f*Q,r[9]=u*v+d*I+h*st+f*ct,r[13]=u*A+d*X+h*J+f*ut,r[2]=g*b+y*O+m*B+p*pt,r[6]=g*C+y*N+m*q+p*Q,r[10]=g*v+y*I+m*st+p*ct,r[14]=g*A+y*X+m*J+p*ut,r[3]=S*b+E*O+M*B+T*pt,r[7]=S*C+E*N+M*q+T*Q,r[11]=S*v+E*I+M*st+T*ct,r[15]=S*A+E*X+M*J+T*ut,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],u=t[2],d=t[6],h=t[10],f=t[14],g=t[3],y=t[7],m=t[11],p=t[15],S=l*f-c*h,E=o*f-c*d,M=o*h-l*d,T=a*f-c*u,b=a*h-l*u,C=a*d-o*u;return e*(y*S-m*E+p*M)-n*(g*S-m*T+p*b)+s*(g*E-y*T+p*C)-r*(g*M-y*b+m*C)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],u=t[10];return e*(a*u-o*c)-n*(r*u-o*l)+s*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],d=t[9],h=t[10],f=t[11],g=t[12],y=t[13],m=t[14],p=t[15],S=e*o-n*a,E=e*l-s*a,M=e*c-r*a,T=n*l-s*o,b=n*c-r*o,C=s*c-r*l,v=u*y-d*g,A=u*m-h*g,O=u*p-f*g,N=d*m-h*y,I=d*p-f*y,X=h*p-f*m,B=S*X-E*I+M*N+T*O-b*A+C*v;if(B===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const q=1/B;return t[0]=(o*X-l*I+c*N)*q,t[1]=(s*I-n*X-r*N)*q,t[2]=(y*C-m*b+p*T)*q,t[3]=(h*b-d*C-f*T)*q,t[4]=(l*O-a*X-c*A)*q,t[5]=(e*X-s*O+r*A)*q,t[6]=(m*M-g*C-p*E)*q,t[7]=(u*C-h*M+f*E)*q,t[8]=(a*I-o*O+c*v)*q,t[9]=(n*O-e*I-r*v)*q,t[10]=(g*b-y*M+p*S)*q,t[11]=(d*M-u*b-f*S)*q,t[12]=(o*A-a*N-l*v)*q,t[13]=(e*N-n*A+s*v)*q,t[14]=(y*E-g*T-m*S)*q,t[15]=(u*T-d*E+h*S)*q,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,u=a+a,d=o+o,h=r*c,f=r*u,g=r*d,y=a*u,m=a*d,p=o*d,S=l*c,E=l*u,M=l*d,T=n.x,b=n.y,C=n.z;return s[0]=(1-(y+p))*T,s[1]=(f+M)*T,s[2]=(g-E)*T,s[3]=0,s[4]=(f-M)*b,s[5]=(1-(h+p))*b,s[6]=(m+S)*b,s[7]=0,s[8]=(g+E)*C,s[9]=(m-S)*C,s[10]=(1-(h+y))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Oi.set(s[0],s[1],s[2]).length();const o=Oi.set(s[4],s[5],s[6]).length(),l=Oi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),_n.copy(this);const c=1/a,u=1/o,d=1/l;return _n.elements[0]*=c,_n.elements[1]*=c,_n.elements[2]*=c,_n.elements[4]*=u,_n.elements[5]*=u,_n.elements[6]*=u,_n.elements[8]*=d,_n.elements[9]*=d,_n.elements[10]*=d,e.setFromRotationMatrix(_n),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,s,r,a,o=Nn,l=!1){const c=this.elements,u=2*r/(e-t),d=2*r/(n-s),h=(e+t)/(e-t),f=(n+s)/(n-s);let g,y;if(l)g=r/(a-r),y=a*r/(a-r);else if(o===Nn)g=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===ks)g=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Nn,l=!1){const c=this.elements,u=2/(e-t),d=2/(n-s),h=-(e+t)/(e-t),f=-(n+s)/(n-s);let g,y;if(l)g=1/(a-r),y=a/(a-r);else if(o===Nn)g=-2/(a-r),y=-(a+r)/(a-r);else if(o===ks)g=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};Jr.prototype.isMatrix4=!0;let Re=Jr;const Oi=new G,_n=new Re,Sf=new G(0,0,0),bf=new G(1,1,1),oi=new G,nr=new G,rn=new G,ql=new Re,Yl=new ls;class pi{constructor(t=0,e=0,n=0,s=pi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(le(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-le(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(le(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-le(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(le(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-le(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Kt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ql.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ql,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Yl.setFromEuler(this),this.setFromQuaternion(Yl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}pi.DEFAULT_ORDER="XYZ";class rl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ef=0;const $l=new G,Bi=new ls,Wn=new Re,ir=new G,ps=new G,Tf=new G,Af=new ls,Zl=new G(1,0,0),Kl=new G(0,1,0),Jl=new G(0,0,1),Ql={type:"added"},wf={type:"removed"},ki={type:"childadded",child:null},xa={type:"childremoved",child:null};class qe extends Pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=os(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=qe.DEFAULT_UP.clone();const t=new G,e=new pi,n=new ls,s=new G(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Re},normalMatrix:{value:new te}}),this.matrix=new Re,this.matrixWorld=new Re,this.matrixAutoUpdate=qe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Bi.setFromAxisAngle(t,e),this.quaternion.multiply(Bi),this}rotateOnWorldAxis(t,e){return Bi.setFromAxisAngle(t,e),this.quaternion.premultiply(Bi),this}rotateX(t){return this.rotateOnAxis(Zl,t)}rotateY(t){return this.rotateOnAxis(Kl,t)}rotateZ(t){return this.rotateOnAxis(Jl,t)}translateOnAxis(t,e){return $l.copy(t).applyQuaternion(this.quaternion),this.position.add($l.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Zl,t)}translateY(t){return this.translateOnAxis(Kl,t)}translateZ(t){return this.translateOnAxis(Jl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Wn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ir.copy(t):ir.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ps.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wn.lookAt(ps,ir,this.up):Wn.lookAt(ir,ps,this.up),this.quaternion.setFromRotationMatrix(Wn),s&&(Wn.extractRotation(s.matrixWorld),Bi.setFromRotationMatrix(Wn),this.quaternion.premultiply(Bi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(de("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ql),ki.child=t,this.dispatchEvent(ki),ki.child=null):de("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(wf),xa.child=t,this.dispatchEvent(xa),xa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Wn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Wn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Wn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ql),ki.child=t,this.dispatchEvent(ki),ki.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ps,t,Tf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ps,Af,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),u=a(t.images),d=a(t.shapes),h=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}qe.DEFAULT_UP=new G(0,1,0);qe.DEFAULT_MATRIX_AUTO_UPDATE=!0;qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class yn extends qe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Rf={type:"move"};class va{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new yn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new yn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new yn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const y of t.hand.values()){const m=e.getJointPose(y,n),p=this._getHandJoint(c,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&h>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Rf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new yn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const bh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},li={h:0,s:0,l:0},sr={h:0,s:0,l:0};function Ma(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class oe{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=on){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ce.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=ce.workingColorSpace){return this.r=t,this.g=e,this.b=n,ce.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=ce.workingColorSpace){if(t=mf(t,1),e=le(e,0,1),n=le(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Ma(a,r,t+1/3),this.g=Ma(a,r,t),this.b=Ma(a,r,t-1/3)}return ce.colorSpaceToWorking(this,s),this}setStyle(t,e=on){function n(r){r!==void 0&&parseFloat(r)<1&&Kt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Kt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Kt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=on){const n=bh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Kt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Jn(t.r),this.g=Jn(t.g),this.b=Jn(t.b),this}copyLinearToSRGB(t){return this.r=es(t.r),this.g=es(t.g),this.b=es(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=on){return ce.workingToColorSpace($e.copy(this),t),Math.round(le($e.r*255,0,255))*65536+Math.round(le($e.g*255,0,255))*256+Math.round(le($e.b*255,0,255))}getHexString(t=on){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ce.workingColorSpace){ce.workingToColorSpace($e.copy(this),e);const n=$e.r,s=$e.g,r=$e.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=ce.workingColorSpace){return ce.workingToColorSpace($e.copy(this),e),t.r=$e.r,t.g=$e.g,t.b=$e.b,t}getStyle(t=on){ce.workingToColorSpace($e.copy(this),t);const e=$e.r,n=$e.g,s=$e.b;return t!==on?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(li),this.setHSL(li.h+t,li.s+e,li.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(li),t.getHSL(sr);const n=da(li.h,sr.h,e),s=da(li.s,sr.s,e),r=da(li.l,sr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $e=new oe;oe.NAMES=bh;class Cf extends qe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new pi,this.environmentIntensity=1,this.environmentRotation=new pi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}}const xn=new G,Xn=new G,ya=new G,qn=new G,zi=new G,Hi=new G,jl=new G,Sa=new G,ba=new G,Ea=new G,Ta=new Pe,Aa=new Pe,wa=new Pe;class Sn{constructor(t=new G,e=new G,n=new G){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),xn.subVectors(t,e),s.cross(xn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){xn.subVectors(s,e),Xn.subVectors(n,e),ya.subVectors(t,e);const a=xn.dot(xn),o=xn.dot(Xn),l=xn.dot(ya),c=Xn.dot(Xn),u=Xn.dot(ya),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const h=1/d,f=(c*l-o*u)*h,g=(a*u-o*l)*h;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,qn)===null?!1:qn.x>=0&&qn.y>=0&&qn.x+qn.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,qn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,qn.x),l.addScaledVector(a,qn.y),l.addScaledVector(o,qn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return Ta.setScalar(0),Aa.setScalar(0),wa.setScalar(0),Ta.fromBufferAttribute(t,e),Aa.fromBufferAttribute(t,n),wa.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Ta,r.x),a.addScaledVector(Aa,r.y),a.addScaledVector(wa,r.z),a}static isFrontFacing(t,e,n,s){return xn.subVectors(n,e),Xn.subVectors(t,e),xn.cross(Xn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return xn.subVectors(this.c,this.b),Xn.subVectors(this.a,this.b),xn.cross(Xn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Sn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Sn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Sn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Sn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Sn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;zi.subVectors(s,n),Hi.subVectors(r,n),Sa.subVectors(t,n);const l=zi.dot(Sa),c=Hi.dot(Sa);if(l<=0&&c<=0)return e.copy(n);ba.subVectors(t,s);const u=zi.dot(ba),d=Hi.dot(ba);if(u>=0&&d<=u)return e.copy(s);const h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),e.copy(n).addScaledVector(zi,a);Ea.subVectors(t,r);const f=zi.dot(Ea),g=Hi.dot(Ea);if(g>=0&&f<=g)return e.copy(r);const y=f*c-l*g;if(y<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(Hi,o);const m=u*g-f*d;if(m<=0&&d-u>=0&&f-g>=0)return jl.subVectors(r,s),o=(d-u)/(d-u+(f-g)),e.copy(s).addScaledVector(jl,o);const p=1/(m+y+h);return a=y*p,o=h*p,e.copy(n).addScaledVector(zi,a).addScaledVector(Hi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class $s{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(vn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(vn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=vn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,vn):vn.fromBufferAttribute(r,a),vn.applyMatrix4(t.matrixWorld),this.expandByPoint(vn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),rr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),rr.copy(n.boundingBox)),rr.applyMatrix4(t.matrixWorld),this.union(rr)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,vn),vn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ms),ar.subVectors(this.max,ms),Gi.subVectors(t.a,ms),Vi.subVectors(t.b,ms),Wi.subVectors(t.c,ms),ci.subVectors(Vi,Gi),hi.subVectors(Wi,Vi),xi.subVectors(Gi,Wi);let e=[0,-ci.z,ci.y,0,-hi.z,hi.y,0,-xi.z,xi.y,ci.z,0,-ci.x,hi.z,0,-hi.x,xi.z,0,-xi.x,-ci.y,ci.x,0,-hi.y,hi.x,0,-xi.y,xi.x,0];return!Ra(e,Gi,Vi,Wi,ar)||(e=[1,0,0,0,1,0,0,0,1],!Ra(e,Gi,Vi,Wi,ar))?!1:(or.crossVectors(ci,hi),e=[or.x,or.y,or.z],Ra(e,Gi,Vi,Wi,ar))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,vn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(vn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Yn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Yn=[new G,new G,new G,new G,new G,new G,new G,new G],vn=new G,rr=new $s,Gi=new G,Vi=new G,Wi=new G,ci=new G,hi=new G,xi=new G,ms=new G,ar=new G,or=new G,vi=new G;function Ra(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){vi.fromArray(i,r);const o=s.x*Math.abs(vi.x)+s.y*Math.abs(vi.y)+s.z*Math.abs(vi.z),l=t.dot(vi),c=e.dot(vi),u=n.dot(vi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Oe=new G,lr=new Ft;let Pf=0;class Qn extends Pi{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Pf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=hf,this.updateRanges=[],this.gpuType=Un,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)lr.fromBufferAttribute(this,e),lr.applyMatrix3(t),this.setXY(e,lr.x,lr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix3(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix4(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyNormalMatrix(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.transformDirection(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ds(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=nn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ds(e,this.array)),e}setX(t,e){return this.normalized&&(e=nn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ds(e,this.array)),e}setY(t,e){return this.normalized&&(e=nn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ds(e,this.array)),e}setZ(t,e){return this.normalized&&(e=nn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ds(e,this.array)),e}setW(t,e){return this.normalized&&(e=nn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=nn(e,this.array),n=nn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=nn(e,this.array),n=nn(n,this.array),s=nn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=nn(e,this.array),n=nn(n,this.array),s=nn(s,this.array),r=nn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}}class Eh extends Qn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Th extends Qn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class De extends Qn{constructor(t,e,n){super(new Float32Array(t),e,n)}}const Lf=new $s,gs=new G,Ca=new G;class al{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Lf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;gs.subVectors(t,this.center);const e=gs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(gs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ca.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(gs.copy(t.center).add(Ca)),this.expandByPoint(gs.copy(t.center).sub(Ca))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let Df=0;const un=new Re,Pa=new qe,Xi=new G,an=new $s,_s=new $s,He=new G;class en extends Pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Df++}),this.uuid=os(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(uf(t)?Th:Eh)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new te().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return un.makeRotationFromQuaternion(t),this.applyMatrix4(un),this}rotateX(t){return un.makeRotationX(t),this.applyMatrix4(un),this}rotateY(t){return un.makeRotationY(t),this.applyMatrix4(un),this}rotateZ(t){return un.makeRotationZ(t),this.applyMatrix4(un),this}translate(t,e,n){return un.makeTranslation(t,e,n),this.applyMatrix4(un),this}scale(t,e,n){return un.makeScale(t,e,n),this.applyMatrix4(un),this}lookAt(t){return Pa.lookAt(t),Pa.updateMatrix(),this.applyMatrix4(Pa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Xi).negate(),this.translate(Xi.x,Xi.y,Xi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new De(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Kt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $s);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){de("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];an.setFromBufferAttribute(r),this.morphTargetsRelative?(He.addVectors(this.boundingBox.min,an.min),this.boundingBox.expandByPoint(He),He.addVectors(this.boundingBox.max,an.max),this.boundingBox.expandByPoint(He)):(this.boundingBox.expandByPoint(an.min),this.boundingBox.expandByPoint(an.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&de('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new al);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){de("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(t){const n=this.boundingSphere.center;if(an.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];_s.setFromBufferAttribute(o),this.morphTargetsRelative?(He.addVectors(an.min,_s.min),an.expandByPoint(He),He.addVectors(an.max,_s.max),an.expandByPoint(He)):(an.expandByPoint(_s.min),an.expandByPoint(_s.max))}an.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)He.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(He));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)He.fromBufferAttribute(o,c),l&&(Xi.fromBufferAttribute(t,c),He.add(Xi)),s=Math.max(s,n.distanceToSquared(He))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&de('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){de("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Qn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new G,l[v]=new G;const c=new G,u=new G,d=new G,h=new Ft,f=new Ft,g=new Ft,y=new G,m=new G;function p(v,A,O){c.fromBufferAttribute(n,v),u.fromBufferAttribute(n,A),d.fromBufferAttribute(n,O),h.fromBufferAttribute(r,v),f.fromBufferAttribute(r,A),g.fromBufferAttribute(r,O),u.sub(c),d.sub(c),f.sub(h),g.sub(h);const N=1/(f.x*g.y-g.x*f.y);isFinite(N)&&(y.copy(u).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(N),m.copy(d).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(N),o[v].add(y),o[A].add(y),o[O].add(y),l[v].add(m),l[A].add(m),l[O].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let v=0,A=S.length;v<A;++v){const O=S[v],N=O.start,I=O.count;for(let X=N,B=N+I;X<B;X+=3)p(t.getX(X+0),t.getX(X+1),t.getX(X+2))}const E=new G,M=new G,T=new G,b=new G;function C(v){T.fromBufferAttribute(s,v),b.copy(T);const A=o[v];E.copy(A),E.sub(T.multiplyScalar(T.dot(A))).normalize(),M.crossVectors(b,A);const N=M.dot(l[v])<0?-1:1;a.setXYZW(v,E.x,E.y,E.z,N)}for(let v=0,A=S.length;v<A;++v){const O=S[v],N=O.start,I=O.count;for(let X=N,B=N+I;X<B;X+=3)C(t.getX(X+0)),C(t.getX(X+1)),C(t.getX(X+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Qn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);const s=new G,r=new G,a=new G,o=new G,l=new G,c=new G,u=new G,d=new G;if(t)for(let h=0,f=t.count;h<f;h+=3){const g=t.getX(h+0),y=t.getX(h+1),m=t.getX(h+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,y),a.fromBufferAttribute(e,m),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,f=e.count;h<f;h+=3)s.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),a.fromBufferAttribute(e,h+2),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)He.fromBufferAttribute(t,e),He.normalize(),t.setXYZ(e,He.x,He.y,He.z)}toNonIndexed(){function t(o,l){const c=o.array,u=o.itemSize,d=o.normalized,h=new c.constructor(l.length*u);let f=0,g=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?f=l[y]*o.data.stride+o.offset:f=l[y]*u;for(let p=0;p<u;p++)h[g++]=c[f++]}return new Qn(h,u,d)}if(this.index===null)return Kt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new en,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,d=c.length;u<d;u++){const h=c[u],f=t(h,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){const f=c[d];u.push(f.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],d=r[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,u=a.length;c<u;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const La=new G,If=new G,Uf=new te;class fi{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=La.subVectors(n,e).cross(If.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const s=t.delta(La),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Uf.getNormalMatrix(t),s=this.coplanarPoint(La).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}}let Nf=0;class cs extends Pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Nf++}),this.uuid=os(),this.name="",this.type="Material",this.blending=Cs,this.side=Ai,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ih,this.blendDst=sh,this.blendEquation=Ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new oe(0,0,0),this.blendAlpha=0,this.depthFunc=Fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ua,this.stencilZFail=ua,this.stencilZPass=ua,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Kt(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Kt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new oe().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new fi().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ft().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ft().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const $n=new G,Da=new G,cr=new G,hr=new G;class Ah{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,$n)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=$n.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):($n.copy(this.origin).addScaledVector(this.direction,e),$n.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Da.copy(t).add(e).multiplyScalar(.5),cr.copy(e).sub(t).normalize(),hr.copy(this.origin).sub(Da);const r=t.distanceTo(e)*.5,a=-this.direction.dot(cr),o=hr.dot(this.direction),l=-hr.dot(cr),c=hr.lengthSq(),u=Math.abs(1-a*a);let d,h,f,g;if(u>0)if(d=a*l-o,h=a*o-l,g=r*u,d>=0)if(h>=-g)if(h<=g){const y=1/u;d*=y,h*=y,f=d*(d+a*h+2*o)+h*(a*d+h+2*l)+c}else h=r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;else h<=-g?(d=Math.max(0,-(-a*r+o)),h=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c):h<=g?(d=0,h=Math.min(Math.max(-r,-l),r),f=h*(h+2*l)+c):(d=Math.max(0,-(a*r+o)),h=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c);else h=a>0?-r:r,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Da).addScaledVector(cr,h),f}intersectSphere(t,e){if(t.radius<0)return null;$n.subVectors(t.center,this.origin);const n=$n.dot(this.direction),s=$n.dot($n)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(n=(t.min.x-h.x)*c,s=(t.max.x-h.x)*c):(n=(t.max.x-h.x)*c,s=(t.min.x-h.x)*c),u>=0?(r=(t.min.y-h.y)*u,a=(t.max.y-h.y)*u):(r=(t.max.y-h.y)*u,a=(t.min.y-h.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(t.min.z-h.z)*d,l=(t.max.z-h.z)*d):(o=(t.max.z-h.z)*d,l=(t.min.z-h.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,$n)!==null}intersectTriangle(t,e,n,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,d=t.x-a.x,h=t.y-a.y,f=t.z-a.z,g=e.x-a.x,y=e.y-a.y,m=e.z-a.z,p=n.x-a.x,S=n.y-a.y,E=n.z-a.z,M=Math.abs(l),T=Math.abs(c),b=Math.abs(u);let C,v,A,O,N,I,X,B,q,st,J,pt;if(M>=T&&M>=b?(A=l,I=d,q=g,pt=p,l>=0?(C=c,v=u,O=h,N=f,X=y,B=m,st=S,J=E):(C=u,v=c,O=f,N=h,X=m,B=y,st=E,J=S)):T>=b?(A=c,I=h,q=y,pt=S,c>=0?(C=u,v=l,O=f,N=d,X=m,B=g,st=E,J=p):(C=l,v=u,O=d,N=f,X=g,B=m,st=p,J=E)):(A=u,I=f,q=m,pt=E,u>=0?(C=l,v=c,O=d,N=h,X=g,B=y,st=p,J=S):(C=c,v=l,O=h,N=d,X=y,B=g,st=S,J=p)),A===0)return null;const Q=C/A,ct=v/A,ut=1/A,zt=O-Q*I,Ot=N-ct*I,pe=X-Q*q,Wt=B-ct*q,Jt=st-Q*pt,j=J-ct*pt,ot=Jt*Wt-j*pe,Mt=zt*j-Ot*Jt,$t=pe*Ot-Wt*zt;if(s){if(ot<0||Mt<0||$t<0)return null}else if((ot<0||Mt<0||$t<0)&&(ot>0||Mt>0||$t>0))return null;const Ut=ot+Mt+$t;if(Ut===0)return null;const ie=ut*(ot*I+Mt*q+$t*pt);return(Ut>0?ie<0:ie>0)?null:this.at(ie/Ut,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Qi extends cs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pi,this.combine=rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const tc=new Re,Mi=new Ah,ur=new al,ec=new G,fr=new G,dr=new G,pr=new G,Ia=new G,mr=new G,nc=new G,gr=new G;class be extends qe{constructor(t=new en,e=new Qi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){mr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],d=r[l];u!==0&&(Ia.fromBufferAttribute(d,t),a?mr.addScaledVector(Ia,u):mr.addScaledVector(Ia.sub(e),u))}e.add(mr)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ur.copy(n.boundingSphere),ur.applyMatrix4(r),Mi.copy(t.ray).recast(t.near),!(ur.containsPoint(Mi.origin)===!1&&(Mi.intersectSphere(ur,ec)===null||Mi.origin.distanceToSquared(ec)>(t.far-t.near)**2))&&(tc.copy(r).invert(),Mi.copy(t.ray).applyMatrix4(tc),!(n.boundingBox!==null&&Mi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Mi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,y=h.length;g<y;g++){const m=h[g],p=a[m.materialIndex],S=Math.max(m.start,f.start),E=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let M=S,T=E;M<T;M+=3){const b=o.getX(M),C=o.getX(M+1),v=o.getX(M+2);s=_r(this,p,t,n,c,u,d,b,C,v),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),y=Math.min(o.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){const S=o.getX(m),E=o.getX(m+1),M=o.getX(m+2);s=_r(this,a,t,n,c,u,d,S,E,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,y=h.length;g<y;g++){const m=h[g],p=a[m.materialIndex],S=Math.max(m.start,f.start),E=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let M=S,T=E;M<T;M+=3){const b=M,C=M+1,v=M+2;s=_r(this,p,t,n,c,u,d,b,C,v),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),y=Math.min(l.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){const S=m,E=m+1,M=m+2;s=_r(this,a,t,n,c,u,d,S,E,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Ff(i,t,e,n,s,r,a,o){let l;if(t.side===sn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Ai,o),l===null)return null;gr.copy(o),gr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(gr);return c<e.near||c>e.far?null:{distance:c,point:gr.clone(),object:i}}function _r(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,fr),i.getVertexPosition(l,dr),i.getVertexPosition(c,pr);const u=Ff(i,t,e,n,fr,dr,pr,nc);if(u){const d=new G;Sn.getBarycoord(nc,fr,dr,pr,d),s&&(u.uv=Sn.getInterpolatedAttribute(s,o,l,c,d,new Ft)),r&&(u.uv1=Sn.getInterpolatedAttribute(r,o,l,c,d,new Ft)),a&&(u.normal=Sn.getInterpolatedAttribute(a,o,l,c,d,new G),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new G,materialIndex:0};Sn.getNormal(fr,dr,pr,h.normal),u.face=h,u.barycoord=d}return u}class Of extends Ke{constructor(t=null,e=1,n=1,s,r,a,o,l,c=Xe,u=Xe,d,h){super(null,a,o,l,c,u,s,r,d,h),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const yi=new al,Bf=new Ft(.5,.5),xr=new G;class ol{constructor(t=new fi,e=new fi,n=new fi,s=new fi,r=new fi,a=new fi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Nn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],d=r[5],h=r[6],f=r[7],g=r[8],y=r[9],m=r[10],p=r[11],S=r[12],E=r[13],M=r[14],T=r[15];if(s[0].setComponents(c-a,f-u,p-g,T-S).normalize(),s[1].setComponents(c+a,f+u,p+g,T+S).normalize(),s[2].setComponents(c+o,f+d,p+y,T+E).normalize(),s[3].setComponents(c-o,f-d,p-y,T-E).normalize(),n)s[4].setComponents(l,h,m,M).normalize(),s[5].setComponents(c-l,f-h,p-m,T-M).normalize();else if(s[4].setComponents(c-l,f-h,p-m,T-M).normalize(),e===Nn)s[5].setComponents(c+l,f+h,p+m,T+M).normalize();else if(e===ks)s[5].setComponents(l,h,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),yi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),yi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(yi)}intersectsSprite(t){yi.center.set(0,0,0);const e=Bf.distanceTo(t.center);return yi.radius=.7071067811865476+e,yi.applyMatrix4(t.matrixWorld),this.intersectsSphere(yi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(xr.x=s.normal.x>0?t.max.x:t.min.x,xr.y=s.normal.y>0?t.max.y:t.min.y,xr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(xr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class wh extends Ke{constructor(t=[],e=wi,n,s,r,a,o,l,c,u){super(t,e,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class kf extends Ke{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class zs extends Ke{constructor(t,e,n=On,s,r,a,o=Xe,l=Xe,c,u=jn,d=1){if(u!==jn&&u!==Ei)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:t,height:e,depth:d};super(h,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new sl(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}}class zf extends zs{constructor(t,e=On,n=wi,s,r,a=Xe,o=Xe,l,c=jn){const u={width:t,height:t,depth:1},d=[u,u,u,u,u,u];super(t,t,e,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Rh extends Ke{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class hs extends en{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],d=[];let h=0,f=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new De(c,3)),this.setAttribute("normal",new De(u,3)),this.setAttribute("uv",new De(d,2));function g(y,m,p,S,E,M,T,b,C,v,A){const O=M/C,N=T/v,I=M/2,X=T/2,B=b/2,q=C+1,st=v+1;let J=0,pt=0;const Q=new G;for(let ct=0;ct<st;ct++){const ut=ct*N-X;for(let zt=0;zt<q;zt++){const Ot=zt*O-I;Q[y]=Ot*S,Q[m]=ut*E,Q[p]=B,c.push(Q.x,Q.y,Q.z),Q[y]=0,Q[m]=0,Q[p]=b>0?1:-1,u.push(Q.x,Q.y,Q.z),d.push(zt/C),d.push(1-ct/v),J+=1}}for(let ct=0;ct<v;ct++)for(let ut=0;ut<C;ut++){const zt=h+ut+q*ct,Ot=h+ut+q*(ct+1),pe=h+(ut+1)+q*(ct+1),Wt=h+(ut+1)+q*ct;l.push(zt,Ot,Wt),l.push(Ot,pe,Wt),pt+=6}o.addGroup(f,pt,A),f+=pt,h+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class ll extends en{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new G,u=new Ft;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,h=3;d<=e;d++,h+=3){const f=n+d/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[h]/t+1)/2,u.y=(a[h+1]/t+1)/2,l.push(u.x,u.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new De(a,3)),this.setAttribute("normal",new De(o,3)),this.setAttribute("uv",new De(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ll(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Gn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Kt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const u=n[s],h=n[s+1]-u,f=(a-u)/h;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new Ft:new G);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new G,s=[],r=[],a=[],o=new G,l=new Re;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new G)}r[0]=new G,a[0]=new G;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),d=Math.abs(s[0].y),h=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(le(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(le(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class cl extends Gn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new Ft){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),d=Math.sin(this.aRotation),h=l-this.aX,f=c-this.aY;l=h*u-f*d+this.aX,c=h*d+f*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Hf extends cl{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function hl(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,d){let h=(a-r)/c-(o-r)/(c+u)+(o-a)/u,f=(o-a)/u-(l-a)/(u+d)+(l-o)/d;h*=u,f*=u,s(a,o,h,f)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const ic=new G,sc=new G,Ua=new hl,Na=new hl,Fa=new hl;class No extends Gn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new G){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(sc.subVectors(s[0],s[1]).add(s[0]),c=sc);const d=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(ic.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=ic),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(d),f),y=Math.pow(d.distanceToSquared(h),f),m=Math.pow(h.distanceToSquared(u),f);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),Ua.initNonuniformCatmullRom(c.x,d.x,h.x,u.x,g,y,m),Na.initNonuniformCatmullRom(c.y,d.y,h.y,u.y,g,y,m),Fa.initNonuniformCatmullRom(c.z,d.z,h.z,u.z,g,y,m)}else this.curveType==="catmullrom"&&(Ua.initCatmullRom(c.x,d.x,h.x,u.x,this.tension),Na.initCatmullRom(c.y,d.y,h.y,u.y,this.tension),Fa.initCatmullRom(c.z,d.z,h.z,u.z,this.tension));return n.set(Ua.calc(l),Na.calc(l),Fa.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new G().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function rc(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function Gf(i,t){const e=1-i;return e*e*t}function Vf(i,t){return 2*(1-i)*i*t}function Wf(i,t){return i*i*t}function Ps(i,t,e,n){return Gf(i,t)+Vf(i,e)+Wf(i,n)}function Xf(i,t){const e=1-i;return e*e*e*t}function qf(i,t){const e=1-i;return 3*e*e*i*t}function Yf(i,t){return 3*(1-i)*i*i*t}function $f(i,t){return i*i*i*t}function Ls(i,t,e,n,s){return Xf(i,t)+qf(i,e)+Yf(i,n)+$f(i,s)}class Ch extends Gn{constructor(t=new Ft,e=new Ft,n=new Ft,s=new Ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new Ft){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ls(t,s.x,r.x,a.x,o.x),Ls(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Zf extends Gn{constructor(t=new G,e=new G,n=new G,s=new G){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new G){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ls(t,s.x,r.x,a.x,o.x),Ls(t,s.y,r.y,a.y,o.y),Ls(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Ph extends Gn{constructor(t=new Ft,e=new Ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Ft){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Kf extends Gn{constructor(t=new G,e=new G){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new G){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new G){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Lh extends Gn{constructor(t=new Ft,e=new Ft,n=new Ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new Ft){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ps(t,s.x,r.x,a.x),Ps(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Dh extends Gn{constructor(t=new G,e=new G,n=new G){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new G){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ps(t,s.x,r.x,a.x),Ps(t,s.y,r.y,a.y),Ps(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ih extends Gn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Ft){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(rc(o,l.x,c.x,u.x,d.x),rc(o,l.y,c.y,u.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new Ft().fromArray(s))}return this}}var Fo=Object.freeze({__proto__:null,ArcCurve:Hf,CatmullRomCurve3:No,CubicBezierCurve:Ch,CubicBezierCurve3:Zf,EllipseCurve:cl,LineCurve:Ph,LineCurve3:Kf,QuadraticBezierCurve:Lh,QuadraticBezierCurve3:Dh,SplineCurve:Ih});class Jf extends Gn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Fo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Fo[s.type]().fromJSON(s))}return this}}class ac extends Jf{constructor(t){super(),this.type="Path",this.currentPoint=new Ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Ph(this.currentPoint.clone(),new Ft(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Lh(this.currentPoint.clone(),new Ft(t,e),new Ft(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Ch(this.currentPoint.clone(),new Ft(t,e),new Ft(n,s),new Ft(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Ih(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+c,e+u,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new cl(t,e,n,s,r,a,o,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Oo extends ac{constructor(t){super(t),this.uuid=os(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new ac().fromJSON(s))}return this}}function Qf(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Uh(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=id(i,t,r,e)),i.length>80*e){o=i[0],l=i[1];let u=o,d=l;for(let h=e;h<s;h+=e){const f=i[h],g=i[h+1];f<o&&(o=f),g<l&&(l=g),f>u&&(u=f),g>d&&(d=g)}c=Math.max(u-o,d-l),c=c!==0?32767/c:0}return Hs(r,a,e,o,l,c,0),a}function Uh(i,t,e,n,s){let r;if(s===pd(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=oc(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=oc(a/n|0,i[a],i[a+1],r);return r&&ss(r,r.next)&&(Vs(r),r=r.next),r}function Ci(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ss(e,e.next)||Le(e.prev,e,e.next)===0)){if(Vs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Hs(i,t,e,n,s,r,a){if(!i)return;!a&&r&&ld(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?td(i,n,s,r):jf(i)){t.push(l.i,i.i,c.i),Vs(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=ed(Ci(i),t),Hs(i,t,e,n,s,r,2)):a===2&&nd(i,t,e,n,s,r):Hs(Ci(i),t,e,n,s,r,1);break}}}function jf(i){const t=i.prev,e=i,n=i.next;if(Le(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,u=Math.min(s,r,a),d=Math.min(o,l,c),h=Math.max(s,r,a),f=Math.max(o,l,c);let g=n.next;for(;g!==t;){if(g.x>=u&&g.x<=h&&g.y>=d&&g.y<=f&&bs(s,o,r,l,a,c,g.x,g.y)&&Le(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function td(i,t,e,n){const s=i.prev,r=i,a=i.next;if(Le(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,u=s.y,d=r.y,h=a.y,f=Math.min(o,l,c),g=Math.min(u,d,h),y=Math.max(o,l,c),m=Math.max(u,d,h),p=Bo(f,g,t,e,n),S=Bo(y,m,t,e,n);let E=i.prevZ,M=i.nextZ;for(;E&&E.z>=p&&M&&M.z<=S;){if(E.x>=f&&E.x<=y&&E.y>=g&&E.y<=m&&E!==s&&E!==a&&bs(o,u,l,d,c,h,E.x,E.y)&&Le(E.prev,E,E.next)>=0||(E=E.prevZ,M.x>=f&&M.x<=y&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&bs(o,u,l,d,c,h,M.x,M.y)&&Le(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;E&&E.z>=p;){if(E.x>=f&&E.x<=y&&E.y>=g&&E.y<=m&&E!==s&&E!==a&&bs(o,u,l,d,c,h,E.x,E.y)&&Le(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;M&&M.z<=S;){if(M.x>=f&&M.x<=y&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&bs(o,u,l,d,c,h,M.x,M.y)&&Le(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function ed(i,t){let e=i;do{const n=e.prev,s=e.next.next;!ss(n,s)&&Fh(n,e,e.next,s)&&Gs(n,s)&&Gs(s,n)&&(t.push(n.i,e.i,s.i),Vs(e),Vs(e.next),e=i=s),e=e.next}while(e!==i);return Ci(e)}function nd(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&ud(a,o)){let l=Oh(a,o);a=Ci(a,a.next),l=Ci(l,l.next),Hs(a,t,e,n,s,r,0),Hs(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function id(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=Uh(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(hd(c))}s.sort(sd);for(let r=0;r<s.length;r++)e=rd(s[r],e);return e}function sd(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function rd(i,t){const e=ad(i,t);if(!e)return t;const n=Oh(e,i);return Ci(n,n.next),Ci(e,e.next)}function ad(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(ss(i,e))return e;do{if(ss(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,a=e.x<e.next.x?e:e.next,d===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let u=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Nh(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const d=Math.abs(s-e.y)/(n-e.x);Gs(e,i)&&(d<u||d===u&&(e.x>a.x||e.x===a.x&&od(a,e)))&&(a=e,u=d)}e=e.next}while(e!==o);return a}function od(i,t){return Le(i.prev,i,t.prev)<0&&Le(t.next,i,i.next)<0}function ld(i,t,e,n){let s=i;do s.z===0&&(s.z=Bo(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,cd(s)}function cd(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function Bo(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function hd(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Nh(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function bs(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Nh(i,t,e,n,s,r,a,o)}function ud(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!fd(i,t)&&(Gs(i,t)&&Gs(t,i)&&dd(i,t)&&(Le(i.prev,i,t.prev)||Le(i,t.prev,t))||ss(i,t)&&Le(i.prev,i,i.next)>0&&Le(t.prev,t,t.next)>0)}function Le(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ss(i,t){return i.x===t.x&&i.y===t.y}function Fh(i,t,e,n){const s=Mr(Le(i,t,e)),r=Mr(Le(i,t,n)),a=Mr(Le(e,n,i)),o=Mr(Le(e,n,t));return!!(s!==r&&a!==o||s===0&&vr(i,e,t)||r===0&&vr(i,n,t)||a===0&&vr(e,i,n)||o===0&&vr(e,t,n))}function vr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Mr(i){return i>0?1:i<0?-1:0}function fd(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Fh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Gs(i,t){return Le(i.prev,i,i.next)<0?Le(i,t,i.next)>=0&&Le(i,i.prev,t)>=0:Le(i,t,i.prev)<0||Le(i,i.next,t)<0}function dd(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Oh(i,t){const e=ko(i.i,i.x,i.y),n=ko(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function oc(i,t,e,n){const s=ko(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Vs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ko(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function pd(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class md{static triangulate(t,e,n=2){return Qf(t,e,n)}}class Ds{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ds.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];lc(t),cc(n,t);let a=t.length;e.forEach(lc);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,cc(n,e[l]);const o=md.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function lc(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function cc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Ti extends en{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,d=t/o,h=e/l,f=[],g=[],y=[],m=[];for(let p=0;p<u;p++){const S=p*h-a;for(let E=0;E<c;E++){const M=E*d-r;g.push(M,-S,0),y.push(0,0,1),m.push(E/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<o;S++){const E=S+c*p,M=S+c*(p+1),T=S+1+c*(p+1),b=S+1+c*p;f.push(E,M,b),f.push(M,T,b)}this.setIndex(f),this.setAttribute("position",new De(g,3)),this.setAttribute("normal",new De(y,3)),this.setAttribute("uv",new De(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ti(t.width,t.height,t.widthSegments,t.heightSegments)}}class Xr extends en{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],u=[];let d=t;const h=(e-t)/s,f=new G,g=new Ft;for(let y=0;y<=s;y++){for(let m=0;m<=n;m++){const p=r+m/n*a;f.x=d*Math.cos(p),f.y=d*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,u.push(g.x,g.y)}d+=h}for(let y=0;y<s;y++){const m=y*(n+1);for(let p=0;p<n;p++){const S=p+m,E=S,M=S+n+1,T=S+n+2,b=S+1;o.push(E,M,b),o.push(M,T,b)}}this.setIndex(o),this.setAttribute("position",new De(l,3)),this.setAttribute("normal",new De(c,3)),this.setAttribute("uv",new De(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xr(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class qr extends en{constructor(t=new Oo([new Ft(0,.5),new Ft(-.5,-.5),new Ft(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let u=0;u<t.length;u++)c(t[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new De(s,3)),this.setAttribute("normal",new De(r,3)),this.setAttribute("uv",new De(a,2));function c(u){const d=s.length/3,h=u.extractPoints(e);let f=h.shape;const g=h.holes;Ds.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const S=g[m];Ds.isClockWise(S)===!0&&(g[m]=S.reverse())}const y=Ds.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const S=g[m];f=f.concat(S)}for(let m=0,p=f.length;m<p;m++){const S=f[m];s.push(S.x,S.y,0),r.push(0,0,1),a.push(S.x,S.y)}for(let m=0,p=y.length;m<p;m++){const S=y[m],E=S[0]+d,M=S[1]+d,T=S[2]+d;n.push(E,M,T),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return gd(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new qr(n,t.curveSegments)}}function gd(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class ul extends en{constructor(t=new Dh(new G(-1,-1,0),new G(-1,1,0),new G(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new G,l=new G,c=new Ft;let u=new G;const d=[],h=[],f=[],g=[];y(),this.setIndex(g),this.setAttribute("position",new De(d,3)),this.setAttribute("normal",new De(h,3)),this.setAttribute("uv",new De(f,2));function y(){for(let E=0;E<e;E++)m(E);m(r===!1?e:0),S(),p()}function m(E){u=t.getPointAt(E/e,u);const M=a.normals[E],T=a.binormals[E];for(let b=0;b<=s;b++){const C=b/s*Math.PI*2,v=Math.sin(C),A=-Math.cos(C);l.x=A*M.x+v*T.x,l.y=A*M.y+v*T.y,l.z=A*M.z+v*T.z,l.normalize(),h.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,d.push(o.x,o.y,o.z)}}function p(){for(let E=1;E<=e;E++)for(let M=1;M<=s;M++){const T=(s+1)*(E-1)+(M-1),b=(s+1)*E+(M-1),C=(s+1)*E+M,v=(s+1)*(E-1)+M;g.push(T,b,v),g.push(b,C,v)}}function S(){for(let E=0;E<=e;E++)for(let M=0;M<=s;M++)c.x=E/e,c.y=M/s,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new ul(new Fo[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class _d extends cs{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new oe(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}}function rs(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];if(hc(s))s.isRenderTargetTexture?(Kt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(hc(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function tn(i){const t={};for(let e=0;e<i.length;e++){const n=rs(i[e]);for(const s in n)t[s]=n[s]}return t}function hc(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function xd(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Bh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ce.workingColorSpace}const vd={clone:rs,merge:tn};var Md=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,yd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class kn extends cs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Md,this.fragmentShader=yd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=rs(t.uniforms),this.uniformsGroups=xd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new oe().setHex(s.value);break;case"v2":this.uniforms[n].value=new Ft().fromArray(s.value);break;case"v3":this.uniforms[n].value=new G().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Pe().fromArray(s.value);break;case"m3":this.uniforms[n].value=new te().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Re().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class Sd extends kn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class bd extends cs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Io,this.normalScale=new Ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class uc extends bd{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ft(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return le(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new oe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new oe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new oe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Ed extends cs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=tf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Td extends cs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class fl extends qe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new oe(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class Ad extends fl{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new oe(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const Oa=new Re,fc=new G,dc=new G;class wd{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ft(512,512),this.mapType=cn,this.map=null,this.mapPass=null,this.matrix=new Re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ol,this._frameExtents=new Ft(1,1),this._viewportCount=1,this._viewports=[new Pe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera;fc.setFromMatrixPosition(t.matrixWorld),e.position.copy(fc),dc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(dc),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){Oa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(Oa,t.coordinateSystem,t.reversedDepth);const r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===ks||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(Oa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const yr=new G,Sr=new ls,Pn=new G;class kh extends qe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Re,this.projectionMatrix=new Re,this.projectionMatrixInverse=new Re,this.coordinateSystem=Nn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(yr,Sr,Pn),Pn.x===1&&Pn.y===1&&Pn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(yr,Sr,Pn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(yr,Sr,Pn),Pn.x===1&&Pn.y===1&&Pn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(yr,Sr,Pn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ui=new G,pc=new Ft,mc=new Ft;class pn extends kh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Uo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(fa*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Uo*2*Math.atan(Math.tan(fa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ui.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ui.x,ui.y).multiplyScalar(-t/ui.z),ui.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ui.x,ui.y).multiplyScalar(-t/ui.z)}getViewSize(t,e){return this.getViewBounds(t,pc,mc),e.subVectors(mc,pc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(fa*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class dl extends kh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Rd extends wd{constructor(){super(new dl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Cd extends fl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.target=new qe,this.shadow=new Rd}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}class Pd extends fl{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}const qi=-90,Yi=1;class Ld extends qe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new pn(qi,Yi,t,e);s.layers=this.layers,this.add(s);const r=new pn(qi,Yi,t,e);r.layers=this.layers,this.add(r);const a=new pn(qi,Yi,t,e);a.layers=this.layers,this.add(a);const o=new pn(qi,Yi,t,e);o.layers=this.layers,this.add(o);const l=new pn(qi,Yi,t,e);l.layers=this.layers,this.add(l);const c=new pn(qi,Yi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Nn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ks)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,d=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(d,h,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Dd extends pn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const gc=new Re;class Id{constructor(t,e,n=0,s=1/0){this.ray=new Ah(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new rl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):de("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return gc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(gc),this}intersectObject(t,e=!0,n=[]){return zo(t,this,n,e),n.sort(_c),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)zo(t[s],this,n,e);return n.sort(_c),n}}function _c(i,t){return i.distance-t.distance}function zo(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)zo(r[a],t,e,!0)}}const bl=class bl{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};bl.prototype.isMatrix2=!0;let xc=bl;function vc(i,t,e,n){const s=Ud(n);switch(e){case xh:return i*t;case Mh:return i*t/s.components*s.byteLength;case jo:return i*t/s.components*s.byteLength;case Ri:return i*t*2/s.components*s.byteLength;case tl:return i*t*2/s.components*s.byteLength;case vh:return i*t*3/s.components*s.byteLength;case bn:return i*t*4/s.components*s.byteLength;case el:return i*t*4/s.components*s.byteLength;case Ir:case Ur:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Nr:case Fr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case io:case ro:return Math.max(i,16)*Math.max(t,8)/4;case no:case so:return Math.max(i,8)*Math.max(t,8)/2;case ao:case oo:case co:case ho:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case lo:case zr:case uo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case fo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case po:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case mo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case go:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case _o:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case xo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case vo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Mo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case yo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case So:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case bo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Eo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case To:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ao:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case wo:case Ro:case Co:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Po:case Lo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Hr:case Do:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Ud(i){switch(i){case cn:case ph:return{byteLength:1,components:1};case Os:case mh:case Bn:return{byteLength:2,components:1};case Jo:case Qo:return{byteLength:2,components:4};case On:case Ko:case Un:return{byteLength:4,components:1};case gh:case _h:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Zo}}));typeof window<"u"&&(window.__THREE__?Kt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Zo);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function zh(){let i=null,t=!1,e=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),e(r,a)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Nd(i){const t=new WeakMap;function e(o,l){const c=o.array,u=o.usage,d=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const u=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,u);else{d.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<d.length;f++){const g=d[h],y=d[f];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++h,d[h]=y)}d.length=h+1;for(let f=0,g=d.length;f<g;f++){const y=d[f];i.bufferSubData(c,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Fd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Od=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Bd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,kd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Hd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Gd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Vd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Wd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Xd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,qd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Yd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,$d=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Zd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Kd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Jd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Qd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,jd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ep=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,np=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ip=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,sp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,rp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ap=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,op=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,lp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,cp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,up=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,fp="gl_FragColor = linearToOutputTexel( gl_FragColor );",dp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,pp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,mp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,gp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,_p=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,vp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Mp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,yp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Sp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,bp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ep=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Tp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ap=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,wp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Rp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Cp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Pp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Lp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Dp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ip=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Up=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Np=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Fp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Op=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Bp=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,kp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Vp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,qp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$p=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Zp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Kp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Jp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Qp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,jp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,em=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,nm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,im=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,rm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,am=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,om=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,hm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,um=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,fm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,dm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,pm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,mm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,_m=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,xm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,vm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Mm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,ym=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Sm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,bm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Em=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Tm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Am=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Rm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Cm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Pm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Lm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Dm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Im=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Um=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Nm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Fm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Om=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,km=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Hm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Vm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Wm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Xm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,qm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ym=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$m=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Zm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Km=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Jm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,t0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,e0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,n0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,i0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,s0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,r0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,a0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,o0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,c0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,u0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,f0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,d0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,p0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,m0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,se={alphahash_fragment:Fd,alphahash_pars_fragment:Od,alphamap_fragment:Bd,alphamap_pars_fragment:kd,alphatest_fragment:zd,alphatest_pars_fragment:Hd,aomap_fragment:Gd,aomap_pars_fragment:Vd,batching_pars_vertex:Wd,batching_vertex:Xd,begin_vertex:qd,beginnormal_vertex:Yd,bsdfs:$d,iridescence_fragment:Zd,bumpmap_pars_fragment:Kd,clipping_planes_fragment:Jd,clipping_planes_pars_fragment:Qd,clipping_planes_pars_vertex:jd,clipping_planes_vertex:tp,color_fragment:ep,color_pars_fragment:np,color_pars_vertex:ip,color_vertex:sp,common:rp,cube_uv_reflection_fragment:ap,defaultnormal_vertex:op,displacementmap_pars_vertex:lp,displacementmap_vertex:cp,emissivemap_fragment:hp,emissivemap_pars_fragment:up,colorspace_fragment:fp,colorspace_pars_fragment:dp,envmap_fragment:pp,envmap_common_pars_fragment:mp,envmap_pars_fragment:gp,envmap_pars_vertex:_p,envmap_physical_pars_fragment:Rp,envmap_vertex:xp,fog_vertex:vp,fog_pars_vertex:Mp,fog_fragment:yp,fog_pars_fragment:Sp,gradientmap_pars_fragment:bp,lightmap_pars_fragment:Ep,lights_lambert_fragment:Tp,lights_lambert_pars_fragment:Ap,lights_pars_begin:wp,lights_toon_fragment:Cp,lights_toon_pars_fragment:Pp,lights_phong_fragment:Lp,lights_phong_pars_fragment:Dp,lights_physical_fragment:Ip,lights_physical_pars_fragment:Up,lights_fragment_begin:Np,lights_fragment_maps:Fp,lights_fragment_end:Op,lightprobes_pars_fragment:Bp,logdepthbuf_fragment:kp,logdepthbuf_pars_fragment:zp,logdepthbuf_pars_vertex:Hp,logdepthbuf_vertex:Gp,map_fragment:Vp,map_pars_fragment:Wp,map_particle_fragment:Xp,map_particle_pars_fragment:qp,metalnessmap_fragment:Yp,metalnessmap_pars_fragment:$p,morphinstance_vertex:Zp,morphcolor_vertex:Kp,morphnormal_vertex:Jp,morphtarget_pars_vertex:Qp,morphtarget_vertex:jp,normal_fragment_begin:tm,normal_fragment_maps:em,normal_pars_fragment:nm,normal_pars_vertex:im,normal_vertex:sm,normalmap_pars_fragment:rm,clearcoat_normal_fragment_begin:am,clearcoat_normal_fragment_maps:om,clearcoat_pars_fragment:lm,iridescence_pars_fragment:cm,opaque_fragment:hm,packing:um,premultiplied_alpha_fragment:fm,project_vertex:dm,dithering_fragment:pm,dithering_pars_fragment:mm,roughnessmap_fragment:gm,roughnessmap_pars_fragment:_m,shadowmap_pars_fragment:xm,shadowmap_pars_vertex:vm,shadowmap_vertex:Mm,shadowmask_pars_fragment:ym,skinbase_vertex:Sm,skinning_pars_vertex:bm,skinning_vertex:Em,skinnormal_vertex:Tm,specularmap_fragment:Am,specularmap_pars_fragment:wm,tonemapping_fragment:Rm,tonemapping_pars_fragment:Cm,transmission_fragment:Pm,transmission_pars_fragment:Lm,uv_pars_fragment:Dm,uv_pars_vertex:Im,uv_vertex:Um,worldpos_vertex:Nm,background_vert:Fm,background_frag:Om,backgroundCube_vert:Bm,backgroundCube_frag:km,cube_vert:zm,cube_frag:Hm,depth_vert:Gm,depth_frag:Vm,distance_vert:Wm,distance_frag:Xm,equirect_vert:qm,equirect_frag:Ym,linedashed_vert:$m,linedashed_frag:Zm,meshbasic_vert:Km,meshbasic_frag:Jm,meshlambert_vert:Qm,meshlambert_frag:jm,meshmatcap_vert:t0,meshmatcap_frag:e0,meshnormal_vert:n0,meshnormal_frag:i0,meshphong_vert:s0,meshphong_frag:r0,meshphysical_vert:a0,meshphysical_frag:o0,meshtoon_vert:l0,meshtoon_frag:c0,points_vert:h0,points_frag:u0,shadow_vert:f0,shadow_frag:d0,sprite_vert:p0,sprite_frag:m0},Dt={common:{diffuse:{value:new oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},envMapRotation:{value:new te},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new Ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new oe(16777215)},opacity:{value:1},center:{value:new Ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},Dn={basic:{uniforms:tn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.fog]),vertexShader:se.meshbasic_vert,fragmentShader:se.meshbasic_frag},lambert:{uniforms:tn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new oe(0)},envMapIntensity:{value:1}}]),vertexShader:se.meshlambert_vert,fragmentShader:se.meshlambert_frag},phong:{uniforms:tn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new oe(0)},specular:{value:new oe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:se.meshphong_vert,fragmentShader:se.meshphong_frag},standard:{uniforms:tn([Dt.common,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.roughnessmap,Dt.metalnessmap,Dt.fog,Dt.lights,{emissive:{value:new oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:se.meshphysical_vert,fragmentShader:se.meshphysical_frag},toon:{uniforms:tn([Dt.common,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.gradientmap,Dt.fog,Dt.lights,{emissive:{value:new oe(0)}}]),vertexShader:se.meshtoon_vert,fragmentShader:se.meshtoon_frag},matcap:{uniforms:tn([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,{matcap:{value:null}}]),vertexShader:se.meshmatcap_vert,fragmentShader:se.meshmatcap_frag},points:{uniforms:tn([Dt.points,Dt.fog]),vertexShader:se.points_vert,fragmentShader:se.points_frag},dashed:{uniforms:tn([Dt.common,Dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:se.linedashed_vert,fragmentShader:se.linedashed_frag},depth:{uniforms:tn([Dt.common,Dt.displacementmap]),vertexShader:se.depth_vert,fragmentShader:se.depth_frag},normal:{uniforms:tn([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,{opacity:{value:1}}]),vertexShader:se.meshnormal_vert,fragmentShader:se.meshnormal_frag},sprite:{uniforms:tn([Dt.sprite,Dt.fog]),vertexShader:se.sprite_vert,fragmentShader:se.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:se.background_vert,fragmentShader:se.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new te}},vertexShader:se.backgroundCube_vert,fragmentShader:se.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:se.cube_vert,fragmentShader:se.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:se.equirect_vert,fragmentShader:se.equirect_frag},distance:{uniforms:tn([Dt.common,Dt.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:se.distance_vert,fragmentShader:se.distance_frag},shadow:{uniforms:tn([Dt.lights,Dt.fog,{color:{value:new oe(0)},opacity:{value:1}}]),vertexShader:se.shadow_vert,fragmentShader:se.shadow_frag}};Dn.physical={uniforms:tn([Dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new Ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new Ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new oe(0)},specularColor:{value:new oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new Ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:se.meshphysical_vert,fragmentShader:se.meshphysical_frag};const br={r:0,b:0,g:0},g0=new Re,Hh=new te;Hh.set(-1,0,0,0,1,0,0,0,1);function _0(i,t,e,n,s,r){const a=new oe(0);let o=s===!0?0:1,l,c,u=null,d=0,h=null;function f(S){let E=S.isScene===!0?S.background:null;if(E&&E.isTexture){const M=S.backgroundBlurriness>0;E=t.get(E,M)}return E}function g(S){let E=!1;const M=f(S);M===null?m(a,o):M&&M.isColor&&(m(M,1),E=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?e.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||E)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function y(S,E){const M=f(E);M&&(M.isCubeTexture||M.mapping===ta)?(c===void 0&&(c=new be(new hs(1,1,1),new kn({name:"BackgroundCubeMaterial",uniforms:rs(Dn.backgroundCube.uniforms),vertexShader:Dn.backgroundCube.vertexShader,fragmentShader:Dn.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,b,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(g0.makeRotationFromEuler(E.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Hh),c.material.toneMapped=ce.getTransfer(M.colorSpace)!==ve,(u!==M||d!==M.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=M,d=M.version,h=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new be(new Ti(2,2),new kn({name:"BackgroundMaterial",uniforms:rs(Dn.background.uniforms),vertexShader:Dn.background.vertexShader,fragmentShader:Dn.background.fragmentShader,side:Ai,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=ce.getTransfer(M.colorSpace)!==ve,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||d!==M.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=M,d=M.version,h=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function m(S,E){S.getRGB(br,Bh(i)),e.buffers.color.setClear(br.r,br.g,br.b,E,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,E=1){a.set(S),o=E,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,m(a,o)},render:g,addToRenderList:y,dispose:p}}function x0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null);let r=s,a=!1;function o(N,I,X,B,q){let st=!1;const J=d(N,B,X,I);r!==J&&(r=J,c(r.object)),st=f(N,B,X,q),st&&g(N,B,X,q),q!==null&&t.update(q,i.ELEMENT_ARRAY_BUFFER),(st||a)&&(a=!1,M(N,I,X,B),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function l(){return i.createVertexArray()}function c(N){return i.bindVertexArray(N)}function u(N){return i.deleteVertexArray(N)}function d(N,I,X,B){const q=B.wireframe===!0;let st=n[I.id];st===void 0&&(st={},n[I.id]=st);const J=N.isInstancedMesh===!0?N.id:0;let pt=st[J];pt===void 0&&(pt={},st[J]=pt);let Q=pt[X.id];Q===void 0&&(Q={},pt[X.id]=Q);let ct=Q[q];return ct===void 0&&(ct=h(l()),Q[q]=ct),ct}function h(N){const I=[],X=[],B=[];for(let q=0;q<e;q++)I[q]=0,X[q]=0,B[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:X,attributeDivisors:B,object:N,attributes:{},index:null}}function f(N,I,X,B){const q=r.attributes,st=I.attributes;let J=0;const pt=X.getAttributes();for(const Q in pt)if(pt[Q].location>=0){const ut=q[Q];let zt=st[Q];if(zt===void 0&&(Q==="instanceMatrix"&&N.instanceMatrix&&(zt=N.instanceMatrix),Q==="instanceColor"&&N.instanceColor&&(zt=N.instanceColor)),ut===void 0||ut.attribute!==zt||zt&&ut.data!==zt.data)return!0;J++}return r.attributesNum!==J||r.index!==B}function g(N,I,X,B){const q={},st=I.attributes;let J=0;const pt=X.getAttributes();for(const Q in pt)if(pt[Q].location>=0){let ut=st[Q];ut===void 0&&(Q==="instanceMatrix"&&N.instanceMatrix&&(ut=N.instanceMatrix),Q==="instanceColor"&&N.instanceColor&&(ut=N.instanceColor));const zt={};zt.attribute=ut,ut&&ut.data&&(zt.data=ut.data),q[Q]=zt,J++}r.attributes=q,r.attributesNum=J,r.index=B}function y(){const N=r.newAttributes;for(let I=0,X=N.length;I<X;I++)N[I]=0}function m(N){p(N,0)}function p(N,I){const X=r.newAttributes,B=r.enabledAttributes,q=r.attributeDivisors;X[N]=1,B[N]===0&&(i.enableVertexAttribArray(N),B[N]=1),q[N]!==I&&(i.vertexAttribDivisor(N,I),q[N]=I)}function S(){const N=r.newAttributes,I=r.enabledAttributes;for(let X=0,B=I.length;X<B;X++)I[X]!==N[X]&&(i.disableVertexAttribArray(X),I[X]=0)}function E(N,I,X,B,q,st,J){J===!0?i.vertexAttribIPointer(N,I,X,q,st):i.vertexAttribPointer(N,I,X,B,q,st)}function M(N,I,X,B){y();const q=B.attributes,st=X.getAttributes(),J=I.defaultAttributeValues;for(const pt in st){const Q=st[pt];if(Q.location>=0){let ct=q[pt];if(ct===void 0&&(pt==="instanceMatrix"&&N.instanceMatrix&&(ct=N.instanceMatrix),pt==="instanceColor"&&N.instanceColor&&(ct=N.instanceColor)),ct!==void 0){const ut=ct.normalized,zt=ct.itemSize,Ot=t.get(ct);if(Ot===void 0)continue;const pe=Ot.buffer,Wt=Ot.type,Jt=Ot.bytesPerElement,j=Wt===i.INT||Wt===i.UNSIGNED_INT||ct.gpuType===Ko;if(ct.isInterleavedBufferAttribute){const ot=ct.data,Mt=ot.stride,$t=ct.offset;if(ot.isInstancedInterleavedBuffer){for(let Ut=0;Ut<Q.locationSize;Ut++)p(Q.location+Ut,ot.meshPerAttribute);N.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let Ut=0;Ut<Q.locationSize;Ut++)m(Q.location+Ut);i.bindBuffer(i.ARRAY_BUFFER,pe);for(let Ut=0;Ut<Q.locationSize;Ut++)E(Q.location+Ut,zt/Q.locationSize,Wt,ut,Mt*Jt,($t+zt/Q.locationSize*Ut)*Jt,j)}else{if(ct.isInstancedBufferAttribute){for(let ot=0;ot<Q.locationSize;ot++)p(Q.location+ot,ct.meshPerAttribute);N.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let ot=0;ot<Q.locationSize;ot++)m(Q.location+ot);i.bindBuffer(i.ARRAY_BUFFER,pe);for(let ot=0;ot<Q.locationSize;ot++)E(Q.location+ot,zt/Q.locationSize,Wt,ut,zt*Jt,zt/Q.locationSize*ot*Jt,j)}}else if(J!==void 0){const ut=J[pt];if(ut!==void 0)switch(ut.length){case 2:i.vertexAttrib2fv(Q.location,ut);break;case 3:i.vertexAttrib3fv(Q.location,ut);break;case 4:i.vertexAttrib4fv(Q.location,ut);break;default:i.vertexAttrib1fv(Q.location,ut)}}}}S()}function T(){A();for(const N in n){const I=n[N];for(const X in I){const B=I[X];for(const q in B){const st=B[q];for(const J in st)u(st[J].object),delete st[J];delete B[q]}}delete n[N]}}function b(N){if(n[N.id]===void 0)return;const I=n[N.id];for(const X in I){const B=I[X];for(const q in B){const st=B[q];for(const J in st)u(st[J].object),delete st[J];delete B[q]}}delete n[N.id]}function C(N){for(const I in n){const X=n[I];for(const B in X){const q=X[B];if(q[N.id]===void 0)continue;const st=q[N.id];for(const J in st)u(st[J].object),delete st[J];delete q[N.id]}}}function v(N){for(const I in n){const X=n[I],B=N.isInstancedMesh===!0?N.id:0,q=X[B];if(q!==void 0){for(const st in q){const J=q[st];for(const pt in J)u(J[pt].object),delete J[pt];delete q[st]}delete X[B],Object.keys(X).length===0&&delete n[I]}}}function A(){O(),a=!0,r!==s&&(r=s,c(r.object))}function O(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:O,dispose:T,releaseStatesOfGeometry:b,releaseStatesOfObject:v,releaseStatesOfProgram:C,initAttributes:y,enableAttribute:m,disableUnusedAttributes:S}}function v0(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),e.update(c,n,u))}function o(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let f=0;f<u;f++)h+=c[f];e.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function M0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==bn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const v=C===Bn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==cn&&C!==Un&&!v&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(Kt("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=e.logarithmicDepthBuffer===!0,h=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&h===!1&&Kt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:E,maxFragmentUniforms:M,maxSamples:T,samples:b}}function y0(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new fi,o=new te,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const f=d.length!==0||h||n!==0||s;return s=h,n=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){e=u(d,h,0)},this.setState=function(d,h,f){const g=d.clippingPlanes,y=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{const S=r?0:n,E=S*4;let M=p.clippingState||null;l.value=M,M=u(g,h,E,f);for(let T=0;T!==E;++T)M[T]=e[T];p.clippingState=M,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(d,h,f,g){const y=d!==null?d.length:0;let m=null;if(y!==0){if(m=l.value,g!==!0||m===null){const p=f+y*4,S=h.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,M=f;E!==y;++E,M+=4)a.copy(d[E]).applyMatrix4(S,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}const ji=4,S0=6,b0=20,E0=256,xs=new dl,Mc=new oe;let Ba=null,ka=0,za=0,Ha=!1;const T0=new G,Si=new G;class yc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=T0}=r;Ba=this._renderer.getRenderTarget(),ka=this._renderer.getActiveCubeFace(),za=this._renderer.getActiveMipmapLevel(),Ha=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ec(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Ba,ka,za),this._renderer.xr.enabled=Ha,t.scissorTest=!1,$i(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===wi||t.mapping===is?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ba=this._renderer.getRenderTarget(),ka=this._renderer.getActiveCubeFace(),za=this._renderer.getActiveMipmapLevel(),Ha=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ze,minFilter:Ze,generateMipmaps:!1,type:Bn,format:bn,colorSpace:Gr,depthBuffer:!1},s=Sc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Sc(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=A0(r)),this._blurMaterial=R0(r,t,e),this._ggxMaterial=w0(r,t,e)}return s}_compileMaterial(t){const e=new be(new en,t);this._renderer.compile(e,xs)}_sceneToCubeUV(t,e,n,s,r){const l=new pn(90,1,e,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(Mc),d.toneMapping=En,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new be(new hs,new Qi({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1})));const y=this._backgroundBox,m=y.material;let p=!1;const S=t.background;S?S.isColor&&(m.color.copy(S),t.background=null,p=!0):(m.color.copy(Mc),p=!0);for(let E=0;E<6;E++){const M=E%3;M===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[E],r.y,r.z)):M===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[E]));const T=this._cubeSize;$i(s,M*T,E>2?T:0,T,T),d.setRenderTarget(s),p&&d.render(y,l),d.render(t,l)}d.toneMapping=f,d.autoClear=h,t.background=S}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===wi||t.mapping===is;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ec()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;$i(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,xs)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),u=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),h=c*1.25,f=d*h,{_lodMax:g}=this,y=this._sizeLods[n],m=3*y*(n>g-ji?n-g+ji:0),p=4*(this._cubeSize-y);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=g-e,$i(r,m,p,3*y,2*y),s.setRenderTarget(r),s.render(o,xs),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,$i(t,m,p,3*y,2*y),s.setRenderTarget(t),s.render(o,xs)}_blur(t,e,n,s){const r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,a),this._blurPass(r,t,n,n,a)}_blurPass(t,e,n,s,r){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;const c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;const u=this._sizeLods[s],d=3*u*(s>this._lodMax-ji?s-this._lodMax+ji:0),h=4*(this._cubeSize-u);$i(e,d,h,3*u,2*u),a.setRenderTarget(e),a.render(l,xs)}}function A0(i){const t=[],e=[];let n=i;const s=i-ji+1+S0;for(let r=0;r<s;r++){const a=Math.pow(2,n);t.push(a);const o=1/(a-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,h=6,f=3,g=new Float32Array(f*h*d),y=new Float32Array(f*h*d);for(let p=0;p<d;p++){const S=p%3*2/3-1,E=p>2?0:-1,M=[S,E,0,S+2/3,E,0,S+2/3,E+1,0,S,E,0,S+2/3,E+1,0,S,E+1,0];g.set(M,f*h*p);for(let T=0;T<h;T++){const b=u[T*2]*2-1,C=u[T*2+1]*2-1;p===0?Si.set(1,C,b):p===1?Si.set(-b,1,-C):p===2?Si.set(-b,C,1):p===3?Si.set(-1,C,-b):p===4?Si.set(-b,-1,C):Si.set(b,C,-1),Si.toArray(y,(p*h+T)*f)}}const m=new en;m.setAttribute("position",new Qn(g,f)),m.setAttribute("outputDirection",new Qn(y,f)),e.push(new be(m,null)),n>ji&&n--}return{lodMeshes:e,sizeLods:t}}function Sc(i,t,e){const n=new Tn(i,t,e);return n.texture.mapping=ta,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function $i(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function w0(i,t,e){return new kn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:E0,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ea(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function R0(i,t,e){return new kn({name:"SphericalGaussianBlur",defines:{SAMPLES:b0,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:ea(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function bc(){return new kn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ea(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Ec(){return new kn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ea(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function ea(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class Gh extends Tn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new wh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new hs(5,5,5),r=new kn({name:"CubemapFromEquirect",uniforms:rs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:sn,blending:Kn});r.uniforms.tEquirect.value=e;const a=new be(s,r),o=e.minFilter;return e.minFilter===bi&&(e.minFilter=Ze),new Ld(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}function C0(i){let t=new WeakMap,e=new WeakMap,n=null;function s(h,f=!1){return h==null?null:f?a(h):r(h)}function r(h){if(h&&h.isTexture){const f=h.mapping;if(f===la||f===ca)if(t.has(h)){const g=t.get(h).texture;return o(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const y=new Gh(g.height);return y.fromEquirectangularTexture(i,h),t.set(h,y),h.addEventListener("dispose",c),o(y.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){const f=h.mapping,g=f===la||f===ca,y=f===wi||f===is;if(g||y){let m=e.get(h);const p=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return n===null&&(n=new yc(i)),m=g?n.fromEquirectangular(h,m):n.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,e.set(h,m),m.texture;if(m!==void 0)return m.texture;{const S=h.image;return g&&S&&S.height>0||y&&S&&l(S)?(n===null&&(n=new yc(i)),m=g?n.fromEquirectangular(h):n.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,e.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function o(h,f){return f===la?h.mapping=wi:f===ca&&(h.mapping=is),h}function l(h){let f=0;const g=6;for(let y=0;y<g;y++)h[y]!==void 0&&f++;return f===g}function c(h){const f=h.target;f.removeEventListener("dispose",c);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(h){const f=h.target;f.removeEventListener("dispose",u);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function P0(i){const t={};function e(n){if(t[n]!==void 0)return t[n];const s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&ts("WebGLRenderer: "+n+" extension not supported."),s}}}function L0(i,t,e,n){const s={},r=new WeakMap;function a(d){const h=d.target;h.index!==null&&t.remove(h.index);for(const g in h.attributes)t.remove(h.attributes[g]);h.removeEventListener("dispose",a),delete s[h.id];const f=r.get(h);f&&(t.remove(f),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function o(d,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,e.memory.geometries++),h}function l(d){const h=d.attributes;for(const f in h)t.update(h[f],i.ARRAY_BUFFER)}function c(d){const h=[],f=d.index,g=d.attributes.position;let y=0;if(g===void 0)return;if(f!==null){const S=f.array;y=f.version;for(let E=0,M=S.length;E<M;E+=3){const T=S[E+0],b=S[E+1],C=S[E+2];h.push(T,b,b,C,C,T)}}else{const S=g.array;y=g.version;for(let E=0,M=S.length/3-1;E<M;E+=3){const T=E+0,b=E+1,C=E+2;h.push(T,b,b,C,C,T)}}const m=new(g.count>=65535?Th:Eh)(h,1);m.version=y;const p=r.get(d);p&&t.remove(p),r.set(d,m)}function u(d){const h=r.get(d);if(h){const f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function D0(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,h){i.drawElements(n,h,r,d*a),e.update(h,n,1)}function c(d,h,f){f!==0&&(i.drawElementsInstanced(n,h,r,d*a,f),e.update(h,n,f))}function u(d,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,d,0,f);let y=0;for(let m=0;m<f;m++)y+=h[m];e.update(y,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function I0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:de("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function U0(i,t,e){const n=new WeakMap,s=new Pe;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let h=n.get(o);if(h===void 0||h.count!==d){let A=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let E=0;f===!0&&(E=1),g===!0&&(E=2),y===!0&&(E=3);let M=o.attributes.position.count*E,T=1;M>t.maxTextureSize&&(T=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const b=new Float32Array(M*T*4*d),C=new Sh(b,M,T,d);C.type=Un,C.needsUpdate=!0;const v=E*4;for(let O=0;O<d;O++){const N=m[O],I=p[O],X=S[O],B=M*T*4*O;for(let q=0;q<N.count;q++){const st=q*v;f===!0&&(s.fromBufferAttribute(N,q),b[B+st+0]=s.x,b[B+st+1]=s.y,b[B+st+2]=s.z,b[B+st+3]=0),g===!0&&(s.fromBufferAttribute(I,q),b[B+st+4]=s.x,b[B+st+5]=s.y,b[B+st+6]=s.z,b[B+st+7]=0),y===!0&&(s.fromBufferAttribute(X,q),b[B+st+8]=s.x,b[B+st+9]=s.y,b[B+st+10]=s.z,b[B+st+11]=X.itemSize===4?s.w:1)}}h={count:d,texture:C,size:new Ft(M,T)},n.set(o,h),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let y=0;y<c.length;y++)f+=c[y];const g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function N0(i,t,e,n,s){let r=new WeakMap;function a(c){const u=s.render.frame,d=c.geometry,h=t.get(c,d);if(r.get(h)!==u&&(t.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function o(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:a,dispose:o}}const F0={[ah]:"LINEAR_TONE_MAPPING",[oh]:"REINHARD_TONE_MAPPING",[lh]:"CINEON_TONE_MAPPING",[ch]:"ACES_FILMIC_TONE_MAPPING",[uh]:"AGX_TONE_MAPPING",[fh]:"NEUTRAL_TONE_MAPPING",[hh]:"CUSTOM_TONE_MAPPING"};function O0(i,t,e,n,s,r){const a=new Tn(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new en;c.setAttribute("position",new De([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new De([0,2,0,0,2,0],2));const u=new Sd({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new be(c,u),h=new dl(-1,1,1,-1,0,1);let f=null,g=null,y=!1,m,p=null,S=[],E=!1;this.setSize=function(M,T){a.setSize(M,T),o!==null&&o.setSize(M,T),l!==null&&l.setSize(M,T);for(let b=0;b<S.length;b++){const C=S[b];C.setSize&&C.setSize(M,T)}},this.setEffects=function(M){S=M,E=S.length>0&&S[0].isRenderPass===!0;const T=a.width,b=a.height;S.length>0&&o===null&&(o=new Tn(T,b,{type:Bn,depthBuffer:!1,stencilBuffer:!1}),l=new Tn(T,b,{type:Bn,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<S.length;C++){const v=S[C];v.setSize&&v.setSize(T,b)}},this.begin=function(M,T){if(y||M.toneMapping===En&&S.length===0)return!1;if(p=T,T!==null){const b=T.width,C=T.height;(a.width!==b||a.height!==C)&&this.setSize(b,C)}return E===!1&&M.setRenderTarget(a),m=M.toneMapping,M.toneMapping=En,!0},this.hasRenderPass=function(){return E},this.end=function(M,T){M.toneMapping=m,y=!0;let b=a,C=o;for(let v=0;v<S.length;v++){const A=S[v];A.enabled!==!1&&(A.render(M,C,b,T),A.needsSwap!==!1&&(b=C,C=C===o?l:o))}if(f!==M.outputColorSpace||g!==M.toneMapping){f=M.outputColorSpace,g=M.toneMapping,u.defines={},ce.getTransfer(f)===ve&&(u.defines.SRGB_TRANSFER="");const v=F0[g];v&&(u.defines[v]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=b.texture,M.setRenderTarget(p),M.render(d,h),p=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}const Vh=new Ke,Ho=new zs(1,1),Wh=new Sh,Xh=new yf,qh=new wh,Tc=[],Ac=[],wc=new Float32Array(16),Rc=new Float32Array(9),Cc=new Float32Array(4);function us(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Tc[s];if(r===void 0&&(r=new Float32Array(s),Tc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function ke(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function ze(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function na(i,t){let e=Ac[t];e===void 0&&(e=new Int32Array(t),Ac[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function B0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function k0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;i.uniform2fv(this.addr,t),ze(e,t)}}function z0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ke(e,t))return;i.uniform3fv(this.addr,t),ze(e,t)}}function H0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;i.uniform4fv(this.addr,t),ze(e,t)}}function G0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),ze(e,t)}else{if(ke(e,n))return;Cc.set(n),i.uniformMatrix2fv(this.addr,!1,Cc),ze(e,n)}}function V0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),ze(e,t)}else{if(ke(e,n))return;Rc.set(n),i.uniformMatrix3fv(this.addr,!1,Rc),ze(e,n)}}function W0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),ze(e,t)}else{if(ke(e,n))return;wc.set(n),i.uniformMatrix4fv(this.addr,!1,wc),ze(e,n)}}function X0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function q0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;i.uniform2iv(this.addr,t),ze(e,t)}}function Y0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;i.uniform3iv(this.addr,t),ze(e,t)}}function $0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;i.uniform4iv(this.addr,t),ze(e,t)}}function Z0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function K0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;i.uniform2uiv(this.addr,t),ze(e,t)}}function J0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;i.uniform3uiv(this.addr,t),ze(e,t)}}function Q0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;i.uniform4uiv(this.addr,t),ze(e,t)}}function j0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ho.compareFunction=e.isReversedDepthBuffer()?il:nl,r=Ho):r=Vh,e.setTexture2D(t||r,s)}function tg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Xh,s)}function eg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||qh,s)}function ng(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Wh,s)}function ig(i){switch(i){case 5126:return B0;case 35664:return k0;case 35665:return z0;case 35666:return H0;case 35674:return G0;case 35675:return V0;case 35676:return W0;case 5124:case 35670:return X0;case 35667:case 35671:return q0;case 35668:case 35672:return Y0;case 35669:case 35673:return $0;case 5125:return Z0;case 36294:return K0;case 36295:return J0;case 36296:return Q0;case 35678:case 36198:case 36298:case 36306:case 35682:return j0;case 35679:case 36299:case 36307:return tg;case 35680:case 36300:case 36308:case 36293:return eg;case 36289:case 36303:case 36311:case 36292:return ng}}function sg(i,t){i.uniform1fv(this.addr,t)}function rg(i,t){const e=us(t,this.size,2);i.uniform2fv(this.addr,e)}function ag(i,t){const e=us(t,this.size,3);i.uniform3fv(this.addr,e)}function og(i,t){const e=us(t,this.size,4);i.uniform4fv(this.addr,e)}function lg(i,t){const e=us(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function cg(i,t){const e=us(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function hg(i,t){const e=us(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function ug(i,t){i.uniform1iv(this.addr,t)}function fg(i,t){i.uniform2iv(this.addr,t)}function dg(i,t){i.uniform3iv(this.addr,t)}function pg(i,t){i.uniform4iv(this.addr,t)}function mg(i,t){i.uniform1uiv(this.addr,t)}function gg(i,t){i.uniform2uiv(this.addr,t)}function _g(i,t){i.uniform3uiv(this.addr,t)}function xg(i,t){i.uniform4uiv(this.addr,t)}function vg(i,t,e){const n=this.cache,s=t.length,r=na(e,s);ke(n,r)||(i.uniform1iv(this.addr,r),ze(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Ho:a=Vh;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function Mg(i,t,e){const n=this.cache,s=t.length,r=na(e,s);ke(n,r)||(i.uniform1iv(this.addr,r),ze(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Xh,r[a])}function yg(i,t,e){const n=this.cache,s=t.length,r=na(e,s);ke(n,r)||(i.uniform1iv(this.addr,r),ze(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||qh,r[a])}function Sg(i,t,e){const n=this.cache,s=t.length,r=na(e,s);ke(n,r)||(i.uniform1iv(this.addr,r),ze(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Wh,r[a])}function bg(i){switch(i){case 5126:return sg;case 35664:return rg;case 35665:return ag;case 35666:return og;case 35674:return lg;case 35675:return cg;case 35676:return hg;case 5124:case 35670:return ug;case 35667:case 35671:return fg;case 35668:case 35672:return dg;case 35669:case 35673:return pg;case 5125:return mg;case 36294:return gg;case 36295:return _g;case 36296:return xg;case 35678:case 36198:case 36298:case 36306:case 35682:return vg;case 35679:case 36299:case 36307:return Mg;case 35680:case 36300:case 36308:case 36293:return yg;case 36289:case 36303:case 36311:case 36292:return Sg}}class Eg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=ig(e.type)}}class Tg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=bg(e.type)}}class Ag{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Ga=/(\w+)(\])?(\[|\.)?/g;function Pc(i,t){i.seq.push(t),i.map[t.id]=t}function wg(i,t,e){const n=i.name,s=n.length;for(Ga.lastIndex=0;;){const r=Ga.exec(n),a=Ga.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Pc(e,c===void 0?new Eg(o,i,t):new Tg(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new Ag(o),Pc(e,d)),e=d}}}class Or{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);wg(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Lc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Rg=37297;let Cg=0;function Pg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Dc=new te;function Lg(i){ce._getMatrix(Dc,ce.workingColorSpace,i);const t=`mat3( ${Dc.elements.map(e=>e.toFixed(4))} )`;switch(ce.getTransfer(i)){case Vr:return[t,"LinearTransferOETF"];case ve:return[t,"sRGBTransferOETF"];default:return Kt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Ic(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Pg(i.getShaderSource(t),o)}else return r}function Dg(i,t){const e=Lg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const Ig={[ah]:"Linear",[oh]:"Reinhard",[lh]:"Cineon",[ch]:"ACESFilmic",[uh]:"AgX",[fh]:"Neutral",[hh]:"Custom"};function Ug(i,t){const e=Ig[t];return e===void 0?(Kt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Er=new G;function Ng(){ce.getLuminanceCoefficients(Er);const i=Er.x.toFixed(4),t=Er.y.toFixed(4),e=Er.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Fg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Es).join(`
`)}function Og(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Bg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Es(i){return i!==""}function Uc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Nc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const kg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Go(i){return i.replace(kg,Hg)}const zg=new Map;function Hg(i,t){let e=se[t];if(e===void 0){const n=zg.get(t);if(n!==void 0)e=se[n],Kt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Go(e)}const Gg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fc(i){return i.replace(Gg,Vg)}function Vg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Oc(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const Wg={[Rs]:"SHADOWMAP_TYPE_PCF",[Ss]:"SHADOWMAP_TYPE_VSM"};function Xg(i){return Wg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const qg={[wi]:"ENVMAP_TYPE_CUBE",[is]:"ENVMAP_TYPE_CUBE",[ta]:"ENVMAP_TYPE_CUBE_UV"};function Yg(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":qg[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const $g={[is]:"ENVMAP_MODE_REFRACTION"};function Zg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":$g[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Kg={[rh]:"ENVMAP_BLENDING_MULTIPLY",[Ju]:"ENVMAP_BLENDING_MIX",[Qu]:"ENVMAP_BLENDING_ADD"};function Jg(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Kg[i.combine]||"ENVMAP_BLENDING_NONE"}function Qg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function jg(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=Xg(e),c=Yg(e),u=Zg(e),d=Jg(e),h=Qg(e),f=Fg(e),g=Og(r),y=s.createProgram();let m,p,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Es).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Es).join(`
`),p.length>0&&(p+=`
`)):(m=[Oc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Es).join(`
`),p=[Oc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==En?"#define TONE_MAPPING":"",e.toneMapping!==En?se.tonemapping_pars_fragment:"",e.toneMapping!==En?Ug("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",se.colorspace_pars_fragment,Dg("linearToOutputTexel",e.outputColorSpace),Ng(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Es).join(`
`)),a=Go(a),a=Uc(a,e),a=Nc(a,e),o=Go(o),o=Uc(o,e),o=Nc(o,e),a=Fc(a),o=Fc(o),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===zl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===zl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const E=S+m+a,M=S+p+o,T=Lc(s,s.VERTEX_SHADER,E),b=Lc(s,s.FRAGMENT_SHADER,M);s.attachShader(y,T),s.attachShader(y,b),e.index0AttributeName!==void 0?s.bindAttribLocation(y,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function C(N){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(y)||"",X=s.getShaderInfoLog(T)||"",B=s.getShaderInfoLog(b)||"",q=I.trim(),st=X.trim(),J=B.trim();let pt=!0,Q=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(pt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,T,b);else{const ct=Ic(s,T,"vertex"),ut=Ic(s,b,"fragment");de("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+q+`
`+ct+`
`+ut)}else q!==""?Kt("WebGLProgram: Program Info Log:",q):(st===""||J==="")&&(Q=!1);Q&&(N.diagnostics={runnable:pt,programLog:q,vertexShader:{log:st,prefix:m},fragmentShader:{log:J,prefix:p}})}s.deleteShader(T),s.deleteShader(b),v=new Or(s,y),A=Bg(s,y)}let v;this.getUniforms=function(){return v===void 0&&C(this),v};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let O=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return O===!1&&(O=s.getProgramParameter(y,Rg)),O},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Cg++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=T,this.fragmentShader=b,this}let t_=0;class e_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new n_(t),e.set(t,n)),n}}class n_{constructor(t){this.id=t_++,this.code=t,this.usedTimes=0}}function i_(i){return i===Ri||i===zr||i===Hr}function s_(i,t,e,n,s,r){const a=new rl,o=new e_,l=new Set,c=[],u=new Map,d=n.logarithmicDepthBuffer;let h=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return l.add(v),v===0?"uv":`uv${v}`}function y(v,A,O,N,I,X){const B=N.fog,q=I.geometry,st=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?N.environment:null,J=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,pt=t.get(v.envMap||st,J),Q=pt&&pt.mapping===ta?pt.image.height:null,ct=f[v.type];v.precision!==null&&(h=n.getMaxPrecision(v.precision),h!==v.precision&&Kt("WebGLProgram.getParameters:",v.precision,"not supported, using",h,"instead."));const ut=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,zt=ut!==void 0?ut.length:0;let Ot=0;q.morphAttributes.position!==void 0&&(Ot=1),q.morphAttributes.normal!==void 0&&(Ot=2),q.morphAttributes.color!==void 0&&(Ot=3);let pe,Wt,Jt,j;if(ct){const _e=Dn[ct];pe=_e.vertexShader,Wt=_e.fragmentShader}else{pe=v.vertexShader,Wt=v.fragmentShader;const _e=o.getVertexShaderStage(v),ue=o.getFragmentShaderStage(v);o.update(v,_e,ue),Jt=_e.id,j=ue.id}const ot=i.getRenderTarget(),Mt=i.state.buffers.depth.getReversed(),$t=I.isInstancedMesh===!0,Ut=I.isBatchedMesh===!0,ie=!!v.map,Ce=!!v.matcap,ee=!!pt,he=!!v.aoMap,ge=!!v.lightMap,re=!!v.bumpMap&&v.wireframe===!1,xe=!!v.normalMap,Fe=!!v.displacementMap,Ve=!!v.emissiveMap,Ee=!!v.metalnessMap,Ie=!!v.roughnessMap,V=v.anisotropy>0,Ue=v.clearcoat>0,me=v.dispersion>0,R=v.retroreflectivity>0,x=v.iridescence>0,W=v.sheen>0,Y=v.transmission>0,tt=V&&!!v.anisotropyMap,xt=Ue&&!!v.clearcoatMap,Et=Ue&&!!v.clearcoatNormalMap,rt=Ue&&!!v.clearcoatRoughnessMap,lt=x&&!!v.iridescenceMap,Tt=x&&!!v.iridescenceThicknessMap,Ht=W&&!!v.sheenColorMap,Pt=W&&!!v.sheenRoughnessMap,Rt=!!v.specularMap,Bt=!!v.specularColorMap,qt=!!v.specularIntensityMap,Qt=Y&&!!v.transmissionMap,z=Y&&!!v.thicknessMap,Ct=!!v.gradientMap,at=!!v.alphaMap,At=v.alphaTest>0,Lt=!!v.alphaHash,dt=!!v.extensions;let Vt=En;v.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&(Vt=i.toneMapping);const Nt={shaderID:ct,shaderType:v.type,shaderName:v.name,vertexShader:pe,fragmentShader:Wt,defines:v.defines,customVertexShaderID:Jt,customFragmentShaderID:j,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:h,batching:Ut,batchingColor:Ut&&I._colorsTexture!==null,instancing:$t,instancingColor:$t&&I.instanceColor!==null,instancingMorph:$t&&I.morphTexture!==null,outputColorSpace:ot===null?i.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:ce.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:ie,matcap:Ce,envMap:ee,envMapMode:ee&&pt.mapping,envMapCubeUVHeight:Q,aoMap:he,lightMap:ge,bumpMap:re,normalMap:xe,displacementMap:Fe,emissiveMap:Ve,normalMapObjectSpace:xe&&v.normalMapType===ef,normalMapTangentSpace:xe&&v.normalMapType===Io,packedNormalMap:xe&&v.normalMapType===Io&&i_(v.normalMap.format),metalnessMap:Ee,roughnessMap:Ie,anisotropy:V,anisotropyMap:tt,clearcoat:Ue,clearcoatMap:xt,clearcoatNormalMap:Et,clearcoatRoughnessMap:rt,dispersion:me,retroreflection:R,iridescence:x,iridescenceMap:lt,iridescenceThicknessMap:Tt,sheen:W,sheenColorMap:Ht,sheenRoughnessMap:Pt,specularMap:Rt,specularColorMap:Bt,specularIntensityMap:qt,transmission:Y,transmissionMap:Qt,thicknessMap:z,gradientMap:Ct,opaque:v.transparent===!1&&v.blending===Cs&&v.alphaToCoverage===!1,alphaMap:at,alphaTest:At,alphaHash:Lt,combine:v.combine,mapUv:ie&&g(v.map.channel),aoMapUv:he&&g(v.aoMap.channel),lightMapUv:ge&&g(v.lightMap.channel),bumpMapUv:re&&g(v.bumpMap.channel),normalMapUv:xe&&g(v.normalMap.channel),displacementMapUv:Fe&&g(v.displacementMap.channel),emissiveMapUv:Ve&&g(v.emissiveMap.channel),metalnessMapUv:Ee&&g(v.metalnessMap.channel),roughnessMapUv:Ie&&g(v.roughnessMap.channel),anisotropyMapUv:tt&&g(v.anisotropyMap.channel),clearcoatMapUv:xt&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:Et&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:lt&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:Tt&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:Ht&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:Pt&&g(v.sheenRoughnessMap.channel),specularMapUv:Rt&&g(v.specularMap.channel),specularColorMapUv:Bt&&g(v.specularColorMap.channel),specularIntensityMapUv:qt&&g(v.specularIntensityMap.channel),transmissionMapUv:Qt&&g(v.transmissionMap.channel),thicknessMapUv:z&&g(v.thicknessMap.channel),alphaMapUv:at&&g(v.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(xe||V),vertexNormals:!!q.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!q.attributes.uv&&(ie||at),fog:!!B,useFog:v.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||q.attributes.normal===void 0&&xe===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Mt,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:q.attributes.position!==void 0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:zt,morphTextureStride:Ot,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&O.length>0,shadowMapType:i.shadowMap.type,toneMapping:Vt,decodeVideoTexture:ie&&v.map.isVideoTexture===!0&&ce.getTransfer(v.map.colorSpace)===ve,decodeVideoTextureEmissive:Ve&&v.emissiveMap.isVideoTexture===!0&&ce.getTransfer(v.emissiveMap.colorSpace)===ve,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===ln,flipSided:v.side===sn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:dt&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(dt&&v.extensions.multiDraw===!0||Ut)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Nt.vertexUv1s=l.has(1),Nt.vertexUv2s=l.has(2),Nt.vertexUv3s=l.has(3),l.clear(),Nt}function m(v){const A=[];if(v.shaderID?A.push(v.shaderID):(A.push(v.customVertexShaderID),A.push(v.customFragmentShaderID)),v.defines!==void 0)for(const O in v.defines)A.push(O),A.push(v.defines[O]);return v.isRawShaderMaterial===!1&&(p(A,v),S(A,v),A.push(i.outputColorSpace)),A.push(v.customProgramCacheKey),A.join()}function p(v,A){v.push(A.precision),v.push(A.outputColorSpace),v.push(A.envMapMode),v.push(A.envMapCubeUVHeight),v.push(A.mapUv),v.push(A.alphaMapUv),v.push(A.lightMapUv),v.push(A.aoMapUv),v.push(A.bumpMapUv),v.push(A.normalMapUv),v.push(A.displacementMapUv),v.push(A.emissiveMapUv),v.push(A.metalnessMapUv),v.push(A.roughnessMapUv),v.push(A.anisotropyMapUv),v.push(A.clearcoatMapUv),v.push(A.clearcoatNormalMapUv),v.push(A.clearcoatRoughnessMapUv),v.push(A.iridescenceMapUv),v.push(A.iridescenceThicknessMapUv),v.push(A.sheenColorMapUv),v.push(A.sheenRoughnessMapUv),v.push(A.specularMapUv),v.push(A.specularColorMapUv),v.push(A.specularIntensityMapUv),v.push(A.transmissionMapUv),v.push(A.thicknessMapUv),v.push(A.combine),v.push(A.fogExp2),v.push(A.sizeAttenuation),v.push(A.morphTargetsCount),v.push(A.morphAttributeCount),v.push(A.numSunLights),v.push(A.numDirLights),v.push(A.numPointLights),v.push(A.numSpotLights),v.push(A.numSpotLightMaps),v.push(A.numHemiLights),v.push(A.numRectAreaLights),v.push(A.numSunLightShadows),v.push(A.numDirLightShadows),v.push(A.numPointLightShadows),v.push(A.numSpotLightShadows),v.push(A.numSpotLightShadowsWithMaps),v.push(A.numLightProbes),v.push(A.shadowMapType),v.push(A.toneMapping),v.push(A.numClippingPlanes),v.push(A.numClipIntersection),v.push(A.depthPacking)}function S(v,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.retroreflection&&a.enable(24),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),A.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function E(v){const A=f[v.type];let O;if(A){const N=Dn[A];O=vd.clone(N.uniforms)}else O=v.uniforms;return O}function M(v,A){let O=u.get(A);return O!==void 0?++O.usedTimes:(O=new jg(i,A,v,s),c.push(O),u.set(A,O)),O}function T(v){if(--v.usedTimes===0){const A=c.indexOf(v);c[A]=c[c.length-1],c.pop(),u.delete(v.cacheKey),v.destroy()}}function b(v){o.remove(v)}function C(){o.dispose()}return{getParameters:y,getProgramCacheKey:m,getUniforms:E,acquireProgram:M,releaseProgram:T,releaseShaderCache:b,programs:c,dispose:C}}function r_(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function a_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function Bc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function kc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function o(h,f,g,y,m,p){let S=i[t];return S===void 0?(S={id:h.id,object:h,geometry:f,material:g,materialVariant:a(h),groupOrder:y,renderOrder:h.renderOrder,z:m,group:p},i[t]=S):(S.id=h.id,S.object=h,S.geometry=f,S.material=g,S.materialVariant=a(h),S.groupOrder=y,S.renderOrder=h.renderOrder,S.z=m,S.group=p),t++,S}function l(h,f,g,y,m,p,S){S.reversedDepth===!0&&(m=-m);const E=o(h,f,g,y,m,p);g.transmission>0?n.push(E):g.transparent===!0?s.push(E):e.push(E)}function c(h,f,g,y,m,p){const S=o(h,f,g,y,m,p);g.transmission>0?n.unshift(S):g.transparent===!0?s.unshift(S):e.unshift(S)}function u(h,f){e.length>1&&e.sort(h||a_),n.length>1&&n.sort(f||Bc),s.length>1&&s.sort(f||Bc)}function d(){for(let h=t,f=i.length;h<f;h++){const g=i[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:u}}function o_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new kc,i.set(n,[a])):s>=r.length?(a=new kc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function l_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new G,color:new oe};break;case"SpotLight":e={position:new G,direction:new G,color:new oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new oe,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new oe,groundColor:new oe};break;case"RectAreaLight":e={color:new oe,position:new G,halfWidth:new G,halfHeight:new G};break}return i[t.id]=e,e}}}function c_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let h_=0;function u_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function f_(i){const t=new l_,e=c_(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new G);const s=new G,r=new Re,a=new Re;function o(c){let u=0,d=0,h=0;for(let I=0;I<9;I++)n.probe[I].set(0,0,0);let f=0,g=0,y=0,m=0,p=0,S=0,E=0,M=0,T=0,b=0,C=0,v=0,A=0,O=0;c.sort(u_);for(let I=0,X=c.length;I<X;I++){const B=c[I],q=B.color,st=B.intensity,J=B.distance;let pt=null;if(B.shadow&&B.shadow.map&&(B.shadow.map.texture.format===Ri?pt=B.shadow.map.texture:pt=B.shadow.map.depthTexture||B.shadow.map.texture),B.isAmbientLight)u+=q.r*st,d+=q.g*st,h+=q.b*st;else if(B.isLightProbe){for(let Q=0;Q<9;Q++)n.probe[Q].addScaledVector(B.sh.coefficients[Q],st);O++}else if(B.isSunLight){const Q=t.get(B);if(Q.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const ct=B.shadow,ut=e.get(B);ut.shadowIntensity=ct.intensity,ut.shadowBias=ct.bias,ut.shadowNormalBias=ct.normalBias,ut.shadowRadius=ct.radius,ut.shadowMapSize.copy(ct.mapSize).multiply(ct.getFrameExtents()),n.sunShadow[g]=ut,n.sunShadowMap[g]=pt;const zt=ct.getViewportCount();for(let Ot=0;Ot<zt;Ot++)n.sunShadowMatrix[y+Ot]=ct.getMatrix(Ot),n.sunShadowCascade[y+Ot]=ct._cascadeData[Ot];y+=zt,g++}n.sun[f]=Q,f++}else if(B.isDirectionalLight){const Q=t.get(B);if(Q.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const ct=B.shadow,ut=e.get(B);ut.shadowIntensity=ct.intensity,ut.shadowBias=ct.bias,ut.shadowNormalBias=ct.normalBias,ut.shadowRadius=ct.radius,ut.shadowMapSize=ct.mapSize,n.directionalShadow[m]=ut,n.directionalShadowMap[m]=pt,n.directionalShadowMatrix[m]=B.shadow.matrix,T++}n.directional[m]=Q,m++}else if(B.isSpotLight){const Q=t.get(B);Q.position.setFromMatrixPosition(B.matrixWorld),Q.color.copy(q).multiplyScalar(st),Q.distance=J,Q.coneCos=Math.cos(B.angle),Q.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),Q.decay=B.decay,n.spot[S]=Q;const ct=B.shadow;if(B.map&&(n.spotLightMap[v]=B.map,v++,ct.updateMatrices(B),B.castShadow&&A++),n.spotLightMatrix[S]=ct.matrix,B.castShadow){const ut=e.get(B);ut.shadowIntensity=ct.intensity,ut.shadowBias=ct.bias,ut.shadowNormalBias=ct.normalBias,ut.shadowRadius=ct.radius,ut.shadowMapSize=ct.mapSize,n.spotShadow[S]=ut,n.spotShadowMap[S]=pt,C++}S++}else if(B.isRectAreaLight){const Q=t.get(B);Q.color.copy(q).multiplyScalar(st),Q.halfWidth.set(B.width*.5,0,0),Q.halfHeight.set(0,B.height*.5,0),n.rectArea[E]=Q,E++}else if(B.isPointLight){const Q=t.get(B);if(Q.color.copy(B.color).multiplyScalar(B.intensity),Q.distance=B.distance,Q.decay=B.decay,B.castShadow){const ct=B.shadow,ut=e.get(B);ut.shadowIntensity=ct.intensity,ut.shadowBias=ct.bias,ut.shadowNormalBias=ct.normalBias,ut.shadowRadius=ct.radius,ut.shadowMapSize=ct.mapSize,ut.shadowCameraNear=ct.camera.near,ut.shadowCameraFar=ct.camera.far,n.pointShadow[p]=ut,n.pointShadowMap[p]=pt,n.pointShadowMatrix[p]=B.shadow.matrix,b++}n.point[p]=Q,p++}else if(B.isHemisphereLight){const Q=t.get(B);Q.skyColor.copy(B.color).multiplyScalar(st),Q.groundColor.copy(B.groundColor).multiplyScalar(st),n.hemi[M]=Q,M++}}E>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Dt.LTC_FLOAT_1,n.rectAreaLTC2=Dt.LTC_FLOAT_2):(n.rectAreaLTC1=Dt.LTC_HALF_1,n.rectAreaLTC2=Dt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;const N=n.hash;(N.sunLength!==f||N.directionalLength!==m||N.pointLength!==p||N.spotLength!==S||N.rectAreaLength!==E||N.hemiLength!==M||N.numSunShadows!==g||N.numDirectionalShadows!==T||N.numPointShadows!==b||N.numSpotShadows!==C||N.numSpotMaps!==v||N.numLightProbes!==O)&&(n.sun.length=f,n.directional.length=m,n.spot.length=S,n.rectArea.length=E,n.point.length=p,n.hemi.length=M,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=y,n.sunShadowCascade.length=y,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.directionalShadowMatrix.length=T,n.pointShadow.length=b,n.pointShadowMap.length=b,n.pointShadowMatrix.length=b,n.spotShadow.length=C,n.spotShadowMap.length=C,n.spotLightMatrix.length=C+v-A,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=O,N.sunLength=f,N.directionalLength=m,N.pointLength=p,N.spotLength=S,N.rectAreaLength=E,N.hemiLength=M,N.numSunShadows=g,N.numDirectionalShadows=T,N.numPointShadows=b,N.numSpotShadows=C,N.numSpotMaps=v,N.numLightProbes=O,n.version=h_++)}function l(c,u){let d=0,h=0,f=0,g=0,y=0,m=0;const p=u.matrixWorldInverse;for(let S=0,E=c.length;S<E;S++){const M=c[S];if(M.isSunLight){const T=n.sun[d];T.direction.setFromMatrixPosition(M.matrixWorld),T.direction.transformDirection(p),d++}else if(M.isDirectionalLight){const T=n.directional[h];T.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),h++}else if(M.isSpotLight){const T=n.spot[g];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),g++}else if(M.isRectAreaLight){const T=n.rectArea[y];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(p),a.identity(),r.copy(M.matrixWorld),r.premultiply(p),a.extractRotation(r),T.halfWidth.set(M.width*.5,0,0),T.halfHeight.set(0,M.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),y++}else if(M.isPointLight){const T=n.point[f];T.position.setFromMatrixPosition(M.matrixWorld),T.position.applyMatrix4(p),f++}else if(M.isHemisphereLight){const T=n.hemi[m];T.direction.setFromMatrixPosition(M.matrixWorld),T.direction.transformDirection(p),m++}}}return{setup:o,setupView:l,state:n}}function zc(i){const t=new f_(i),e=[],n=[],s=[];function r(h){d.camera=h,e.length=0,n.length=0,s.length=0}function a(h){e.push(h)}function o(h){n.push(h)}function l(h){s.push(h)}function c(){t.setup(e)}function u(h){t.setupView(e,h)}const d={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function d_(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new zc(i),t.set(s,[o])):r>=a.length?(o=new zc(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const p_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,m_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,g_=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],__=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],Hc=new Re,vs=new G,Va=new G;function x_(i,t,e){let n=new ol;const s=new Ft,r=new Ft,a=new Pe,o=new Ed,l=new Td,c={},u=e.maxTextureSize,d={[Ai]:sn,[sn]:Ai,[ln]:ln},h=new kn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ft},radius:{value:4}},vertexShader:p_,fragmentShader:m_}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const g=new en;g.setAttribute("position",new Qn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new be(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Rs;let p=this.type;this.render=function(b,C,v){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===Du&&(Kt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Rs);const A=i.getRenderTarget(),O=i.getActiveCubeFace(),N=i.getActiveMipmapLevel(),I=i.state;I.setBlending(Kn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const X=p!==this.type;X&&C.traverse(function(B){B.material&&(Array.isArray(B.material)?B.material.forEach(q=>q.needsUpdate=!0):B.material.needsUpdate=!0)});for(let B=0,q=b.length;B<q;B++){const st=b[B],J=st.shadow;if(J===void 0){Kt("WebGLShadowMap:",st,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;s.copy(J.mapSize);const pt=J.getFrameExtents();s.multiply(pt),r.copy(J.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/pt.x),s.x=r.x*pt.x,J.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/pt.y),s.y=r.y*pt.y,J.mapSize.y=r.y));const Q=i.state.buffers.depth.getReversed();if(J.camera._reversedDepth=Q,J.map===null||X===!0){if(J.map!==null&&(J.map.depthTexture!==null&&(J.map.depthTexture.dispose(),J.map.depthTexture=null),J.map.dispose()),this.type===Ss){if(st.isPointLight){Kt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}J.map=new Tn(s.x,s.y,{format:Ri,type:Bn,minFilter:Ze,magFilter:Ze,generateMipmaps:!1}),J.map.texture.name=st.name+".shadowMap",J.map.depthTexture=new zs(s.x,s.y,Un),J.map.depthTexture.name=st.name+".shadowMapDepth",J.map.depthTexture.format=jn,J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=Xe,J.map.depthTexture.magFilter=Xe}else st.isPointLight?(J.map=new Gh(s.x),J.map.depthTexture=new zf(s.x,On)):(J.map=new Tn(s.x,s.y),J.map.depthTexture=new zs(s.x,s.y,On)),J.map.depthTexture.name=st.name+".shadowMap",J.map.depthTexture.format=jn,this.type===Rs?(J.map.depthTexture.compareFunction=Q?il:nl,J.map.depthTexture.minFilter=Ze,J.map.depthTexture.magFilter=Ze):(J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=Xe,J.map.depthTexture.magFilter=Xe);J.camera.updateProjectionMatrix()}J.map.isWebGLCubeRenderTarget!==!0&&(J.map.width!==s.x||J.map.height!==s.y)&&J.map.setSize(s.x,s.y);const ct=J.map.isWebGLCubeRenderTarget?6:J.getViewportCount();st.isPointLight!==!0&&J.updateMatrices(st,v);for(let ut=0;ut<ct;ut++){const zt=J.getCamera(ut);if(st.isPointLight){const Ot=J.camera,pe=J.matrix,Wt=st.distance||Ot.far;Wt!==Ot.far&&(Ot.far=Wt,Ot.updateProjectionMatrix()),vs.setFromMatrixPosition(st.matrixWorld),Ot.position.copy(vs),Va.copy(Ot.position),Va.add(g_[ut]),Ot.up.copy(__[ut]),Ot.lookAt(Va),Ot.updateMatrixWorld(),pe.makeTranslation(-vs.x,-vs.y,-vs.z),Hc.multiplyMatrices(Ot.projectionMatrix,Ot.matrixWorldInverse),J._frustum.setFromProjectionMatrix(Hc,Ot.coordinateSystem,Ot.reversedDepth)}if(J.map.isWebGLCubeRenderTarget)i.setRenderTarget(J.map,ut),i.clear();else{ut===0&&(i.setRenderTarget(J.map),i.clear());const Ot=J.getViewport(ut);a.set(r.x*Ot.x,r.y*Ot.y,r.x*Ot.z,r.y*Ot.w),I.viewport(a)}n=J.getFrustum(ut),M(C,v,zt,st,this.type)}J.isPointLightShadow!==!0&&this.type===Ss&&S(J,v),J.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(A,O,N)};function S(b,C){const v=t.update(y);h.defines.VSM_SAMPLES!==b.blurSamples&&(h.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null?b.mapPass=new Tn(s.x,s.y,{format:Ri,type:Bn}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),h.uniforms.shadow_pass.value=b.map.depthTexture,h.uniforms.resolution.value.set(b.map.width,b.map.height),h.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(C,null,v,h,y,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value.set(b.map.width,b.map.height),f.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(C,null,v,f,y,null)}function E(b,C,v,A){let O=null;const N=v.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(N!==void 0)O=N;else if(O=v.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const I=O.uuid,X=C.uuid;let B=c[I];B===void 0&&(B={},c[I]=B);let q=B[X];q===void 0&&(q=O.clone(),B[X]=q,C.addEventListener("dispose",T)),O=q}if(O.visible=C.visible,O.wireframe=C.wireframe,A===Ss?O.side=C.shadowSide!==null?C.shadowSide:C.side:O.side=C.shadowSide!==null?C.shadowSide:d[C.side],O.alphaMap=C.alphaMap,O.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,O.map=C.map,O.clipShadows=C.clipShadows,O.clippingPlanes=C.clippingPlanes,O.clipIntersection=C.clipIntersection,O.displacementMap=C.displacementMap,O.displacementScale=C.displacementScale,O.displacementBias=C.displacementBias,O.wireframeLinewidth=C.wireframeLinewidth,O.linewidth=C.linewidth,v.isPointLight===!0&&O.isMeshDistanceMaterial===!0){const I=i.properties.get(O);I.light=v}return O}function M(b,C,v,A,O){if(b.visible===!1)return;if(b.layers.test(C.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&O===Ss)&&(!b.frustumCulled||b.intersectsFrustum(n))){b.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,b.matrixWorld);const X=t.update(b),B=b.material;if(Array.isArray(B)){const q=X.groups;for(let st=0,J=q.length;st<J;st++){const pt=q[st],Q=B[pt.materialIndex];if(Q&&Q.visible){const ct=E(b,Q,A,O);b.onBeforeShadow(i,b,C,v,X,ct,pt),i.renderBufferDirect(v,null,X,ct,b,pt),b.onAfterShadow(i,b,C,v,X,ct,pt)}}}else if(B.visible){const q=E(b,B,A,O);b.onBeforeShadow(i,b,C,v,X,q,null),i.renderBufferDirect(v,null,X,q,b,null),b.onAfterShadow(i,b,C,v,X,q,null)}}const I=b.children;for(let X=0,B=I.length;X<B;X++)M(I[X],C,v,A,O)}function T(b){b.target.removeEventListener("dispose",T);for(const v in c){const A=c[v],O=b.target.uuid;O in A&&(A[O].dispose(),delete A[O])}}}function v_(i,t){function e(){let z=!1;const Ct=new Pe;let at=null;const At=new Pe(0,0,0,0);return{setMask:function(Lt){at!==Lt&&!z&&(i.colorMask(Lt,Lt,Lt,Lt),at=Lt)},setLocked:function(Lt){z=Lt},setClear:function(Lt,dt,Vt,Nt,_e){_e===!0&&(Lt*=Nt,dt*=Nt,Vt*=Nt),Ct.set(Lt,dt,Vt,Nt),At.equals(Ct)===!1&&(i.clearColor(Lt,dt,Vt,Nt),At.copy(Ct))},reset:function(){z=!1,at=null,At.set(-1,0,0,0)}}}function n(){let z=!1,Ct=!1,at=null,At=null,Lt=null;return{setReversed:function(dt){if(Ct!==dt){const Vt=t.get("EXT_clip_control");dt?Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.ZERO_TO_ONE_EXT):Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.NEGATIVE_ONE_TO_ONE_EXT),Ct=dt;const Nt=Lt;Lt=null,this.setClear(Nt)}},getReversed:function(){return Ct},setTest:function(dt){dt?ot(i.DEPTH_TEST):Mt(i.DEPTH_TEST)},setMask:function(dt){at!==dt&&!z&&(i.depthMask(dt),at=dt)},setFunc:function(dt){if(Ct&&(dt=pf[dt]),At!==dt){switch(dt){case Ya:i.depthFunc(i.NEVER);break;case $a:i.depthFunc(i.ALWAYS);break;case Za:i.depthFunc(i.LESS);break;case Fs:i.depthFunc(i.LEQUAL);break;case Ka:i.depthFunc(i.EQUAL);break;case Ja:i.depthFunc(i.GEQUAL);break;case Qa:i.depthFunc(i.GREATER);break;case ja:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}At=dt}},setLocked:function(dt){z=dt},setClear:function(dt){Lt!==dt&&(Lt=dt,Ct&&(dt=1-dt),i.clearDepth(dt))},reset:function(){z=!1,at=null,At=null,Lt=null,Ct=!1}}}function s(){let z=!1,Ct=null,at=null,At=null,Lt=null,dt=null,Vt=null,Nt=null,_e=null;return{setTest:function(ue){z||(ue?ot(i.STENCIL_TEST):Mt(i.STENCIL_TEST))},setMask:function(ue){Ct!==ue&&!z&&(i.stencilMask(ue),Ct=ue)},setFunc:function(ue,Je,We){(at!==ue||At!==Je||Lt!==We)&&(i.stencilFunc(ue,Je,We),at=ue,At=Je,Lt=We)},setOp:function(ue,Je,We){(dt!==ue||Vt!==Je||Nt!==We)&&(i.stencilOp(ue,Je,We),dt=ue,Vt=Je,Nt=We)},setLocked:function(ue){z=ue},setClear:function(ue){_e!==ue&&(i.clearStencil(ue),_e=ue)},reset:function(){z=!1,Ct=null,at=null,At=null,Lt=null,dt=null,Vt=null,Nt=null,_e=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let u={},d={},h={},f=new WeakMap,g=[],y=null,m=!1,p=null,S=null,E=null,M=null,T=null,b=null,C=null,v=new oe(0,0,0),A=0,O=!1,N=null,I=null,X=null,B=null,q=null;const st=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let J=!1,pt=0;const Q=i.getParameter(i.VERSION);Q.indexOf("WebGL")!==-1?(pt=parseFloat(/^WebGL (\d)/.exec(Q)[1]),J=pt>=1):Q.indexOf("OpenGL ES")!==-1&&(pt=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),J=pt>=2);let ct=null,ut={};const zt=i.getParameter(i.SCISSOR_BOX),Ot=i.getParameter(i.VIEWPORT),pe=new Pe().fromArray(zt),Wt=new Pe().fromArray(Ot);function Jt(z,Ct,at,At){const Lt=new Uint8Array(4),dt=i.createTexture();i.bindTexture(z,dt),i.texParameteri(z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Vt=0;Vt<at;Vt++)z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?i.texImage3D(Ct,0,i.RGBA,1,1,At,0,i.RGBA,i.UNSIGNED_BYTE,Lt):i.texImage2D(Ct+Vt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Lt);return dt}const j={};j[i.TEXTURE_2D]=Jt(i.TEXTURE_2D,i.TEXTURE_2D,1),j[i.TEXTURE_CUBE_MAP]=Jt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[i.TEXTURE_2D_ARRAY]=Jt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),j[i.TEXTURE_3D]=Jt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ot(i.DEPTH_TEST),a.setFunc(Fs),re(!1),xe(Fl),ot(i.CULL_FACE),he(Kn);function ot(z){u[z]!==!0&&(i.enable(z),u[z]=!0)}function Mt(z){u[z]!==!1&&(i.disable(z),u[z]=!1)}function $t(z,Ct){return h[z]!==Ct?(i.bindFramebuffer(z,Ct),h[z]=Ct,z===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=Ct),z===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=Ct),!0):!1}function Ut(z,Ct){let at=g,At=!1;if(z){at=f.get(Ct),at===void 0&&(at=[],f.set(Ct,at));const Lt=z.textures;if(at.length!==Lt.length||at[0]!==i.COLOR_ATTACHMENT0){for(let dt=0,Vt=Lt.length;dt<Vt;dt++)at[dt]=i.COLOR_ATTACHMENT0+dt;at.length=Lt.length,At=!0}}else at[0]!==i.BACK&&(at[0]=i.BACK,At=!0);At&&i.drawBuffers(at)}function ie(z){return y!==z?(i.useProgram(z),y=z,!0):!1}const Ce={[Ji]:i.FUNC_ADD,[Uu]:i.FUNC_SUBTRACT,[Nu]:i.FUNC_REVERSE_SUBTRACT};Ce[Fu]=i.MIN,Ce[Ou]=i.MAX;const ee={[Bu]:i.ZERO,[ku]:i.ONE,[zu]:i.SRC_COLOR,[ih]:i.SRC_ALPHA,[qu]:i.SRC_ALPHA_SATURATE,[Wu]:i.DST_COLOR,[Gu]:i.DST_ALPHA,[Hu]:i.ONE_MINUS_SRC_COLOR,[sh]:i.ONE_MINUS_SRC_ALPHA,[Xu]:i.ONE_MINUS_DST_COLOR,[Vu]:i.ONE_MINUS_DST_ALPHA,[Yu]:i.CONSTANT_COLOR,[$u]:i.ONE_MINUS_CONSTANT_COLOR,[Zu]:i.CONSTANT_ALPHA,[Ku]:i.ONE_MINUS_CONSTANT_ALPHA};function he(z,Ct,at,At,Lt,dt,Vt,Nt,_e,ue){if(z===Kn){m===!0&&(Mt(i.BLEND),m=!1);return}if(m===!1&&(ot(i.BLEND),m=!0),z!==Iu){if(z!==p||ue!==O){if((S!==Ji||T!==Ji)&&(i.blendEquation(i.FUNC_ADD),S=Ji,T=Ji),ue)switch(z){case Cs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ol:i.blendFunc(i.ONE,i.ONE);break;case Bl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case kl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:de("WebGLState: Invalid blending: ",z);break}else switch(z){case Cs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ol:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Bl:de("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case kl:de("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:de("WebGLState: Invalid blending: ",z);break}E=null,M=null,b=null,C=null,v.set(0,0,0),A=0,p=z,O=ue}return}Lt=Lt||Ct,dt=dt||at,Vt=Vt||At,(Ct!==S||Lt!==T)&&(i.blendEquationSeparate(Ce[Ct],Ce[Lt]),S=Ct,T=Lt),(at!==E||At!==M||dt!==b||Vt!==C)&&(i.blendFuncSeparate(ee[at],ee[At],ee[dt],ee[Vt]),E=at,M=At,b=dt,C=Vt),(Nt.equals(v)===!1||_e!==A)&&(i.blendColor(Nt.r,Nt.g,Nt.b,_e),v.copy(Nt),A=_e),p=z,O=!1}function ge(z,Ct){z.side===ln?Mt(i.CULL_FACE):ot(i.CULL_FACE);let at=z.side===sn;Ct&&(at=!at),re(at),z.blending===Cs&&z.transparent===!1?he(Kn):he(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),a.setFunc(z.depthFunc),a.setTest(z.depthTest),a.setMask(z.depthWrite),r.setMask(z.colorWrite);const At=z.stencilWrite;o.setTest(At),At&&(o.setMask(z.stencilWriteMask),o.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),o.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),Ve(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?ot(i.SAMPLE_ALPHA_TO_COVERAGE):Mt(i.SAMPLE_ALPHA_TO_COVERAGE)}function re(z){N!==z&&(z?i.frontFace(i.CW):i.frontFace(i.CCW),N=z)}function xe(z){z!==Pu?(ot(i.CULL_FACE),z!==I&&(z===Fl?i.cullFace(i.BACK):z===Lu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Mt(i.CULL_FACE),I=z}function Fe(z){z!==X&&(J&&i.lineWidth(z),X=z)}function Ve(z,Ct,at){z?(ot(i.POLYGON_OFFSET_FILL),(B!==Ct||q!==at)&&(B=Ct,q=at,a.getReversed()&&(Ct=-Ct),i.polygonOffset(Ct,at))):Mt(i.POLYGON_OFFSET_FILL)}function Ee(z){z?ot(i.SCISSOR_TEST):Mt(i.SCISSOR_TEST)}function Ie(z){z===void 0&&(z=i.TEXTURE0+st-1),ct!==z&&(i.activeTexture(z),ct=z)}function V(z,Ct,at){at===void 0&&(ct===null?at=i.TEXTURE0+st-1:at=ct);let At=ut[at];At===void 0&&(At={type:void 0,texture:void 0},ut[at]=At),(At.type!==z||At.texture!==Ct)&&(ct!==at&&(i.activeTexture(at),ct=at),i.bindTexture(z,Ct||j[z]),At.type=z,At.texture=Ct)}function Ue(){const z=ut[ct];z!==void 0&&z.type!==void 0&&(i.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function me(){try{i.compressedTexImage2D(...arguments)}catch(z){de("WebGLState:",z)}}function R(){try{i.compressedTexImage3D(...arguments)}catch(z){de("WebGLState:",z)}}function x(){try{i.texSubImage2D(...arguments)}catch(z){de("WebGLState:",z)}}function W(){try{i.texSubImage3D(...arguments)}catch(z){de("WebGLState:",z)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(z){de("WebGLState:",z)}}function tt(){try{i.compressedTexSubImage3D(...arguments)}catch(z){de("WebGLState:",z)}}function xt(){try{i.texStorage2D(...arguments)}catch(z){de("WebGLState:",z)}}function Et(){try{i.texStorage3D(...arguments)}catch(z){de("WebGLState:",z)}}function rt(){try{i.texImage2D(...arguments)}catch(z){de("WebGLState:",z)}}function lt(){try{i.texImage3D(...arguments)}catch(z){de("WebGLState:",z)}}function Tt(z){return d[z]!==void 0?d[z]:i.getParameter(z)}function Ht(z,Ct){d[z]!==Ct&&(i.pixelStorei(z,Ct),d[z]=Ct)}function Pt(z){pe.equals(z)===!1&&(i.scissor(z.x,z.y,z.z,z.w),pe.copy(z))}function Rt(z){Wt.equals(z)===!1&&(i.viewport(z.x,z.y,z.z,z.w),Wt.copy(z))}function Bt(z,Ct){let at=c.get(Ct);at===void 0&&(at=new WeakMap,c.set(Ct,at));let At=at.get(z);At===void 0&&(At=i.getUniformBlockIndex(Ct,z.name),at.set(z,At))}function qt(z,Ct){const At=c.get(Ct).get(z);l.get(Ct)!==At&&(i.uniformBlockBinding(Ct,At,z.__bindingPointIndex),l.set(Ct,At))}function Qt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},d={},ct=null,ut={},h={},f=new WeakMap,g=[],y=null,m=!1,p=null,S=null,E=null,M=null,T=null,b=null,C=null,v=new oe(0,0,0),A=0,O=!1,N=null,I=null,X=null,B=null,q=null,pe.set(0,0,i.canvas.width,i.canvas.height),Wt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ot,disable:Mt,bindFramebuffer:$t,drawBuffers:Ut,useProgram:ie,setBlending:he,setMaterial:ge,setFlipSided:re,setCullFace:xe,setLineWidth:Fe,setPolygonOffset:Ve,setScissorTest:Ee,activeTexture:Ie,bindTexture:V,unbindTexture:Ue,compressedTexImage2D:me,compressedTexImage3D:R,texImage2D:rt,texImage3D:lt,pixelStorei:Ht,getParameter:Tt,updateUBOMapping:Bt,uniformBlockBinding:qt,texStorage2D:xt,texStorage3D:Et,texSubImage2D:x,texSubImage3D:W,compressedTexSubImage2D:Y,compressedTexSubImage3D:tt,scissor:Pt,viewport:Rt,reset:Qt}}function M_(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ft,u=new WeakMap,d=new Set;let h;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(R,x){return g?new OffscreenCanvas(R,x):Wr("canvas")}function m(R,x,W){let Y=1;const tt=me(R);if((tt.width>W||tt.height>W)&&(Y=W/Math.max(tt.width,tt.height)),Y<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const xt=Math.floor(Y*tt.width),Et=Math.floor(Y*tt.height);h===void 0&&(h=y(xt,Et));const rt=x?y(xt,Et):h;return rt.width=xt,rt.height=Et,rt.getContext("2d").drawImage(R,0,0,xt,Et),Kt("WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+xt+"x"+Et+")."),rt}else return"data"in R&&Kt("WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),R;return R}function p(R){return R.generateMipmaps}function S(R){i.generateMipmap(R)}function E(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(R,x,W,Y,tt,xt=!1){if(R!==null){if(i[R]!==void 0)return i[R];Kt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Et;Y&&(Et=t.get("EXT_texture_norm16"),Et||Kt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let rt=x;if(x===i.RED&&(W===i.FLOAT&&(rt=i.R32F),W===i.HALF_FLOAT&&(rt=i.R16F),W===i.UNSIGNED_BYTE&&(rt=i.R8),W===i.UNSIGNED_SHORT&&Et&&(rt=Et.R16_EXT),W===i.SHORT&&Et&&(rt=Et.R16_SNORM_EXT)),x===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(rt=i.R8UI),W===i.UNSIGNED_SHORT&&(rt=i.R16UI),W===i.UNSIGNED_INT&&(rt=i.R32UI),W===i.BYTE&&(rt=i.R8I),W===i.SHORT&&(rt=i.R16I),W===i.INT&&(rt=i.R32I)),x===i.RG&&(W===i.FLOAT&&(rt=i.RG32F),W===i.HALF_FLOAT&&(rt=i.RG16F),W===i.UNSIGNED_BYTE&&(rt=i.RG8),W===i.UNSIGNED_SHORT&&Et&&(rt=Et.RG16_EXT),W===i.SHORT&&Et&&(rt=Et.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&(rt=i.RG8UI),W===i.UNSIGNED_SHORT&&(rt=i.RG16UI),W===i.UNSIGNED_INT&&(rt=i.RG32UI),W===i.BYTE&&(rt=i.RG8I),W===i.SHORT&&(rt=i.RG16I),W===i.INT&&(rt=i.RG32I)),x===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&(rt=i.RGB8UI),W===i.UNSIGNED_SHORT&&(rt=i.RGB16UI),W===i.UNSIGNED_INT&&(rt=i.RGB32UI),W===i.BYTE&&(rt=i.RGB8I),W===i.SHORT&&(rt=i.RGB16I),W===i.INT&&(rt=i.RGB32I)),x===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&(rt=i.RGBA8UI),W===i.UNSIGNED_SHORT&&(rt=i.RGBA16UI),W===i.UNSIGNED_INT&&(rt=i.RGBA32UI),W===i.BYTE&&(rt=i.RGBA8I),W===i.SHORT&&(rt=i.RGBA16I),W===i.INT&&(rt=i.RGBA32I)),x===i.RGB&&(W===i.UNSIGNED_SHORT&&Et&&(rt=Et.RGB16_EXT),W===i.SHORT&&Et&&(rt=Et.RGB16_SNORM_EXT),W===i.UNSIGNED_INT_5_9_9_9_REV&&(rt=i.RGB9_E5),W===i.UNSIGNED_INT_10F_11F_11F_REV&&(rt=i.R11F_G11F_B10F)),x===i.RGBA){const lt=xt?Vr:ce.getTransfer(tt);W===i.FLOAT&&(rt=i.RGBA32F),W===i.HALF_FLOAT&&(rt=i.RGBA16F),W===i.UNSIGNED_BYTE&&(rt=lt===ve?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT&&Et&&(rt=Et.RGBA16_EXT),W===i.SHORT&&Et&&(rt=Et.RGBA16_SNORM_EXT),W===i.UNSIGNED_SHORT_4_4_4_4&&(rt=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(rt=i.RGB5_A1)}return(rt===i.R16F||rt===i.R32F||rt===i.RG16F||rt===i.RG32F||rt===i.RGBA16F||rt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function T(R,x){let W;return R?x===null||x===On||x===Bs?W=i.DEPTH24_STENCIL8:x===Un?W=i.DEPTH32F_STENCIL8:x===Os&&(W=i.DEPTH24_STENCIL8,Kt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===On||x===Bs?W=i.DEPTH_COMPONENT24:x===Un?W=i.DEPTH_COMPONENT32F:x===Os&&(W=i.DEPTH_COMPONENT16),W}function b(R,x){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==Xe&&R.minFilter!==Ze?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function C(R){const x=R.target;x.removeEventListener("dispose",C),A(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&d.delete(x)}function v(R){const x=R.target;x.removeEventListener("dispose",v),N(x)}function A(R){const x=n.get(R);if(x.__webglInit===void 0)return;const W=R.source,Y=f.get(W);if(Y){const tt=Y[x.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&O(R),Object.keys(Y).length===0&&f.delete(W)}n.remove(R)}function O(R){const x=n.get(R);i.deleteTexture(x.__webglTexture);const W=R.source,Y=f.get(W);delete Y[x.__cacheKey],a.memory.textures--}function N(R){const x=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(x.__webglFramebuffer[Y]))for(let tt=0;tt<x.__webglFramebuffer[Y].length;tt++)i.deleteFramebuffer(x.__webglFramebuffer[Y][tt]);else i.deleteFramebuffer(x.__webglFramebuffer[Y]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[Y])}else{if(Array.isArray(x.__webglFramebuffer))for(let Y=0;Y<x.__webglFramebuffer.length;Y++)i.deleteFramebuffer(x.__webglFramebuffer[Y]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let Y=0;Y<x.__webglColorRenderbuffer.length;Y++)x.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[Y]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const W=R.textures;for(let Y=0,tt=W.length;Y<tt;Y++){const xt=n.get(W[Y]);xt.__webglTexture&&(i.deleteTexture(xt.__webglTexture),a.memory.textures--),n.remove(W[Y])}n.remove(R)}let I=0;function X(){I=0}function B(){return I}function q(R){I=R}function st(){const R=I;return R>=s.maxTextures&&Kt("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+s.maxTextures),I+=1,R}function J(R){const x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function pt(R,x){const W=n.get(R);if(R.isVideoTexture&&V(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&W.__version!==R.version){const Y=R.image;if(Y===null)Kt("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)Kt("WebGLRenderer: Texture marked for update but image is incomplete");else{Mt(W,R,x);return}}else R.isExternalTexture&&(W.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+x)}function Q(R,x){const W=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&W.__version!==R.version){Mt(W,R,x);return}else R.isExternalTexture&&(W.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+x)}function ct(R,x){const W=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&W.__version!==R.version){Mt(W,R,x);return}e.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+x)}function ut(R,x){const W=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&W.__version!==R.version){$t(W,R,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+x)}const zt={[to]:i.REPEAT,[Zn]:i.CLAMP_TO_EDGE,[eo]:i.MIRRORED_REPEAT},Ot={[Xe]:i.NEAREST,[ju]:i.NEAREST_MIPMAP_NEAREST,[er]:i.NEAREST_MIPMAP_LINEAR,[Ze]:i.LINEAR,[ha]:i.LINEAR_MIPMAP_NEAREST,[bi]:i.LINEAR_MIPMAP_LINEAR},pe={[sf]:i.NEVER,[cf]:i.ALWAYS,[rf]:i.LESS,[nl]:i.LEQUAL,[af]:i.EQUAL,[il]:i.GEQUAL,[of]:i.GREATER,[lf]:i.NOTEQUAL};function Wt(R,x){if(x.type===Un&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Ze||x.magFilter===ha||x.magFilter===er||x.magFilter===bi||x.minFilter===Ze||x.minFilter===ha||x.minFilter===er||x.minFilter===bi)&&Kt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,zt[x.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,zt[x.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,zt[x.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,Ot[x.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,Ot[x.minFilter]),x.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,pe[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Xe||x.minFilter!==er&&x.minFilter!==bi||x.type===Un&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");i.texParameterf(R,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Jt(R,x){let W=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",C));const Y=x.source;let tt=f.get(Y);tt===void 0&&(tt={},f.set(Y,tt));const xt=J(x);if(xt!==R.__cacheKey){tt[xt]===void 0&&(tt[xt]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,W=!0),tt[xt].usedTimes++;const Et=tt[R.__cacheKey];Et!==void 0&&(tt[R.__cacheKey].usedTimes--,Et.usedTimes===0&&O(x)),R.__cacheKey=xt,R.__webglTexture=tt[xt].texture}return W}function j(R,x,W){return Math.floor(Math.floor(R/W)/x)}function ot(R,x,W,Y){const xt=R.updateRanges;if(xt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,W,Y,x.data);else{xt.sort((Ht,Pt)=>Ht.start-Pt.start);let Et=0;for(let Ht=1;Ht<xt.length;Ht++){const Pt=xt[Et],Rt=xt[Ht],Bt=Pt.start+Pt.count,qt=j(Rt.start,x.width,4),Qt=j(Pt.start,x.width,4);Rt.start<=Bt+1&&qt===Qt&&j(Rt.start+Rt.count-1,x.width,4)===qt?Pt.count=Math.max(Pt.count,Rt.start+Rt.count-Pt.start):(++Et,xt[Et]=Rt)}xt.length=Et+1;const rt=e.getParameter(i.UNPACK_ROW_LENGTH),lt=e.getParameter(i.UNPACK_SKIP_PIXELS),Tt=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let Ht=0,Pt=xt.length;Ht<Pt;Ht++){const Rt=xt[Ht],Bt=Math.floor(Rt.start/4),qt=Math.ceil(Rt.count/4),Qt=Bt%x.width,z=Math.floor(Bt/x.width),Ct=qt,at=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,Qt),e.pixelStorei(i.UNPACK_SKIP_ROWS,z),e.texSubImage2D(i.TEXTURE_2D,0,Qt,z,Ct,at,W,Y,x.data)}R.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,rt),e.pixelStorei(i.UNPACK_SKIP_PIXELS,lt),e.pixelStorei(i.UNPACK_SKIP_ROWS,Tt)}}function Mt(R,x,W){let Y=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(Y=i.TEXTURE_3D);const tt=Jt(R,x),xt=x.source;e.bindTexture(Y,R.__webglTexture,i.TEXTURE0+W);const Et=n.get(xt);if(xt.version!==Et.__version||tt===!0){if(e.activeTexture(i.TEXTURE0+W),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const at=ce.getPrimaries(ce.workingColorSpace),At=x.colorSpace===di?null:ce.getPrimaries(x.colorSpace),Lt=x.colorSpace===di||at===At?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt)}e.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let lt=m(x.image,!1,s.maxTextureSize);lt=Ue(x,lt);const Tt=r.convert(x.format,x.colorSpace),Ht=r.convert(x.type);let Pt=M(x.internalFormat,Tt,Ht,x.normalized,x.colorSpace,x.isVideoTexture);Wt(Y,x);let Rt;const Bt=x.mipmaps,qt=x.isVideoTexture!==!0,Qt=Et.__version===void 0||tt===!0,z=xt.dataReady,Ct=b(x,lt);if(x.isDepthTexture)Pt=T(x.format===Ei,x.type),Qt&&(qt?e.texStorage2D(i.TEXTURE_2D,1,Pt,lt.width,lt.height):e.texImage2D(i.TEXTURE_2D,0,Pt,lt.width,lt.height,0,Tt,Ht,null));else if(x.isDataTexture)if(Bt.length>0){qt&&Qt&&e.texStorage2D(i.TEXTURE_2D,Ct,Pt,Bt[0].width,Bt[0].height);for(let at=0,At=Bt.length;at<At;at++)Rt=Bt[at],qt?z&&e.texSubImage2D(i.TEXTURE_2D,at,0,0,Rt.width,Rt.height,Tt,Ht,Rt.data):e.texImage2D(i.TEXTURE_2D,at,Pt,Rt.width,Rt.height,0,Tt,Ht,Rt.data);x.generateMipmaps=!1}else qt?(Qt&&e.texStorage2D(i.TEXTURE_2D,Ct,Pt,lt.width,lt.height),z&&ot(x,lt,Tt,Ht)):e.texImage2D(i.TEXTURE_2D,0,Pt,lt.width,lt.height,0,Tt,Ht,lt.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){qt&&Qt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ct,Pt,Bt[0].width,Bt[0].height,lt.depth);for(let at=0,At=Bt.length;at<At;at++)if(Rt=Bt[at],x.format!==bn)if(Tt!==null)if(qt){if(z)if(x.layerUpdates.size>0){const Lt=vc(Rt.width,Rt.height,x.format,x.type);for(const dt of x.layerUpdates){const Vt=Rt.data.subarray(dt*Lt/Rt.data.BYTES_PER_ELEMENT,(dt+1)*Lt/Rt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,dt,Rt.width,Rt.height,1,Tt,Vt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,0,Rt.width,Rt.height,lt.depth,Tt,Rt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,at,Pt,Rt.width,Rt.height,lt.depth,0,Rt.data,0,0);else Kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else qt?z&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,0,Rt.width,Rt.height,lt.depth,Tt,Ht,Rt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,at,Pt,Rt.width,Rt.height,lt.depth,0,Tt,Ht,Rt.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{qt&&Qt&&e.texStorage2D(i.TEXTURE_2D,Ct,Pt,Bt[0].width,Bt[0].height);for(let at=0,At=Bt.length;at<At;at++)Rt=Bt[at],x.format!==bn?Tt!==null?qt?z&&e.compressedTexSubImage2D(i.TEXTURE_2D,at,0,0,Rt.width,Rt.height,Tt,Rt.data):e.compressedTexImage2D(i.TEXTURE_2D,at,Pt,Rt.width,Rt.height,0,Rt.data):Kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?z&&e.texSubImage2D(i.TEXTURE_2D,at,0,0,Rt.width,Rt.height,Tt,Ht,Rt.data):e.texImage2D(i.TEXTURE_2D,at,Pt,Rt.width,Rt.height,0,Tt,Ht,Rt.data)}else if(x.isDataArrayTexture)if(qt){if(Qt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ct,Pt,lt.width,lt.height,lt.depth),z)if(x.layerUpdates.size>0){const at=vc(lt.width,lt.height,x.format,x.type);for(const At of x.layerUpdates){const Lt=lt.data.subarray(At*at/lt.data.BYTES_PER_ELEMENT,(At+1)*at/lt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,At,lt.width,lt.height,1,Tt,Ht,Lt)}x.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,lt.width,lt.height,lt.depth,Tt,Ht,lt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Pt,lt.width,lt.height,lt.depth,0,Tt,Ht,lt.data);else if(x.isData3DTexture)qt?(Qt&&e.texStorage3D(i.TEXTURE_3D,Ct,Pt,lt.width,lt.height,lt.depth),z&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,lt.width,lt.height,lt.depth,Tt,Ht,lt.data)):e.texImage3D(i.TEXTURE_3D,0,Pt,lt.width,lt.height,lt.depth,0,Tt,Ht,lt.data);else if(x.isFramebufferTexture){if(Qt)if(qt)e.texStorage2D(i.TEXTURE_2D,Ct,Pt,lt.width,lt.height);else{let at=lt.width,At=lt.height;for(let Lt=0;Lt<Ct;Lt++)e.texImage2D(i.TEXTURE_2D,Lt,Pt,at,At,0,Tt,Ht,null),at>>=1,At>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){const at=i.canvas;if(at.hasAttribute("layoutsubtree")||at.setAttribute("layoutsubtree","true"),lt.parentNode!==at){at.appendChild(lt),d.add(x),at.onpaint=At=>{const Lt=At.changedElements;for(const dt of d)Lt.includes(dt.image)&&(dt.needsUpdate=!0)},at.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,lt);else{const Lt=i.RGBA,dt=i.RGBA,Vt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Lt,dt,Vt,lt)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Bt.length>0){if(qt&&Qt){const at=me(Bt[0]);e.texStorage2D(i.TEXTURE_2D,Ct,Pt,at.width,at.height)}for(let at=0,At=Bt.length;at<At;at++)Rt=Bt[at],qt?z&&e.texSubImage2D(i.TEXTURE_2D,at,0,0,Tt,Ht,Rt):e.texImage2D(i.TEXTURE_2D,at,Pt,Tt,Ht,Rt);x.generateMipmaps=!1}else if(qt){if(Qt){const at=me(lt);e.texStorage2D(i.TEXTURE_2D,Ct,Pt,at.width,at.height)}z&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Tt,Ht,lt)}else e.texImage2D(i.TEXTURE_2D,0,Pt,Tt,Ht,lt);p(x)&&S(Y),Et.__version=xt.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function $t(R,x,W){if(x.image.length!==6)return;const Y=Jt(R,x),tt=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+W);const xt=n.get(tt);if(tt.version!==xt.__version||Y===!0){e.activeTexture(i.TEXTURE0+W);const Et=ce.getPrimaries(ce.workingColorSpace),rt=x.colorSpace===di?null:ce.getPrimaries(x.colorSpace),lt=x.colorSpace===di||Et===rt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,lt);const Tt=x.isCompressedTexture||x.image[0].isCompressedTexture,Ht=x.image[0]&&x.image[0].isDataTexture,Pt=[];for(let dt=0;dt<6;dt++)!Tt&&!Ht?Pt[dt]=m(x.image[dt],!0,s.maxCubemapSize):Pt[dt]=Ht?x.image[dt].image:x.image[dt],Pt[dt]=Ue(x,Pt[dt]);const Rt=Pt[0],Bt=r.convert(x.format,x.colorSpace),qt=r.convert(x.type),Qt=M(x.internalFormat,Bt,qt,x.normalized,x.colorSpace),z=x.isVideoTexture!==!0,Ct=xt.__version===void 0||Y===!0,at=tt.dataReady;let At=b(x,Rt);Wt(i.TEXTURE_CUBE_MAP,x);let Lt;if(Tt){z&&Ct&&e.texStorage2D(i.TEXTURE_CUBE_MAP,At,Qt,Rt.width,Rt.height);for(let dt=0;dt<6;dt++){Lt=Pt[dt].mipmaps;for(let Vt=0;Vt<Lt.length;Vt++){const Nt=Lt[Vt];x.format!==bn?Bt!==null?z?at&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt,0,0,Nt.width,Nt.height,Bt,Nt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt,Qt,Nt.width,Nt.height,0,Nt.data):Kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt,0,0,Nt.width,Nt.height,Bt,qt,Nt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt,Qt,Nt.width,Nt.height,0,Bt,qt,Nt.data)}}}else{if(Lt=x.mipmaps,z&&Ct){Lt.length>0&&At++;const dt=me(Pt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,At,Qt,dt.width,dt.height)}for(let dt=0;dt<6;dt++)if(Ht){z?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,Pt[dt].width,Pt[dt].height,Bt,qt,Pt[dt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,Qt,Pt[dt].width,Pt[dt].height,0,Bt,qt,Pt[dt].data);for(let Vt=0;Vt<Lt.length;Vt++){const _e=Lt[Vt].image[dt].image;z?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt+1,0,0,_e.width,_e.height,Bt,qt,_e.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt+1,Qt,_e.width,_e.height,0,Bt,qt,_e.data)}}else{z?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,Bt,qt,Pt[dt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,Qt,Bt,qt,Pt[dt]);for(let Vt=0;Vt<Lt.length;Vt++){const Nt=Lt[Vt];z?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt+1,0,0,Bt,qt,Nt.image[dt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Vt+1,Qt,Bt,qt,Nt.image[dt])}}}p(x)&&S(i.TEXTURE_CUBE_MAP),xt.__version=tt.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function Ut(R,x,W,Y,tt,xt){const Et=r.convert(W.format,W.colorSpace),rt=r.convert(W.type),lt=M(W.internalFormat,Et,rt,W.normalized,W.colorSpace),Tt=n.get(x),Ht=n.get(W);if(Ht.__renderTarget=x,!Tt.__hasExternalTextures){const Pt=Math.max(1,x.width>>xt),Rt=Math.max(1,x.height>>xt);tt===i.TEXTURE_3D||tt===i.TEXTURE_2D_ARRAY?e.texImage3D(tt,xt,lt,Pt,Rt,x.depth,0,Et,rt,null):e.texImage2D(tt,xt,lt,Pt,Rt,0,Et,rt,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),Ie(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,tt,Ht.__webglTexture,0,Ee(x)):(tt===i.TEXTURE_2D||tt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,tt,Ht.__webglTexture,xt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ie(R,x,W){if(i.bindRenderbuffer(i.RENDERBUFFER,R),x.depthBuffer){const Y=x.depthTexture,tt=Y&&Y.isDepthTexture?Y.type:null,xt=T(x.stencilBuffer,tt),Et=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Ie(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ee(x),xt,x.width,x.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ee(x),xt,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,xt,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Et,i.RENDERBUFFER,R)}else{const Y=x.textures;for(let tt=0;tt<Y.length;tt++){const xt=Y[tt],Et=r.convert(xt.format,xt.colorSpace),rt=r.convert(xt.type),lt=M(xt.internalFormat,Et,rt,xt.normalized,xt.colorSpace);Ie(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ee(x),lt,x.width,x.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ee(x),lt,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,lt,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ce(R,x,W){const Y=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const tt=n.get(x.depthTexture);if(tt.__renderTarget=x,(!tt.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),Y){if(tt.__webglInit===void 0&&(tt.__webglInit=!0,x.depthTexture.addEventListener("dispose",C)),tt.__webglTexture===void 0){tt.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,tt.__webglTexture),Wt(i.TEXTURE_CUBE_MAP,x.depthTexture);const Tt=r.convert(x.depthTexture.format),Ht=r.convert(x.depthTexture.type);let Pt;x.depthTexture.format===jn?Pt=i.DEPTH_COMPONENT24:x.depthTexture.format===Ei&&(Pt=i.DEPTH24_STENCIL8);for(let Rt=0;Rt<6;Rt++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,0,Pt,x.width,x.height,0,Tt,Ht,null)}}else pt(x.depthTexture,0);const xt=tt.__webglTexture,Et=Ee(x),rt=Y?i.TEXTURE_CUBE_MAP_POSITIVE_X+W:i.TEXTURE_2D,lt=x.depthTexture.format===Ei?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===jn)Ie(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,lt,rt,xt,0,Et):i.framebufferTexture2D(i.FRAMEBUFFER,lt,rt,xt,0);else if(x.depthTexture.format===Ei)Ie(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,lt,rt,xt,0,Et):i.framebufferTexture2D(i.FRAMEBUFFER,lt,rt,xt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ee(R){const x=n.get(R),W=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){const Y=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),Y){const tt=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,Y.removeEventListener("dispose",tt)};Y.addEventListener("dispose",tt),x.__depthDisposeCallback=tt}x.__boundDepthTexture=Y}if(R.depthTexture&&!x.__autoAllocateDepthBuffer)if(W)for(let Y=0;Y<6;Y++)Ce(x.__webglFramebuffer[Y],R,Y);else{const Y=R.texture.mipmaps;Y&&Y.length>0?Ce(x.__webglFramebuffer[0],R,0):Ce(x.__webglFramebuffer,R,0)}else if(W){x.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[Y]),x.__webglDepthbuffer[Y]===void 0)x.__webglDepthbuffer[Y]=i.createRenderbuffer(),ie(x.__webglDepthbuffer[Y],R,!1);else{const tt=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xt=x.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,xt),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,xt)}}else{const Y=R.texture.mipmaps;if(Y&&Y.length>0?e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),ie(x.__webglDepthbuffer,R,!1);else{const tt=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xt=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,xt),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,xt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function he(R,x,W){const Y=n.get(R);x!==void 0&&Ut(Y.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&ee(R)}function ge(R){const x=R.texture,W=n.get(R),Y=n.get(x);R.addEventListener("dispose",v);const tt=R.textures,xt=R.isWebGLCubeRenderTarget===!0,Et=tt.length>1;if(Et||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=x.version,a.memory.textures++),xt){W.__webglFramebuffer=[];for(let rt=0;rt<6;rt++)if(x.mipmaps&&x.mipmaps.length>0){W.__webglFramebuffer[rt]=[];for(let lt=0;lt<x.mipmaps.length;lt++)W.__webglFramebuffer[rt][lt]=i.createFramebuffer()}else W.__webglFramebuffer[rt]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){W.__webglFramebuffer=[];for(let rt=0;rt<x.mipmaps.length;rt++)W.__webglFramebuffer[rt]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(Et)for(let rt=0,lt=tt.length;rt<lt;rt++){const Tt=n.get(tt[rt]);Tt.__webglTexture===void 0&&(Tt.__webglTexture=i.createTexture(),a.memory.textures++)}if(R.samples>0&&Ie(R)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let rt=0;rt<tt.length;rt++){const lt=tt[rt];W.__webglColorRenderbuffer[rt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[rt]);const Tt=r.convert(lt.format,lt.colorSpace),Ht=r.convert(lt.type),Pt=M(lt.internalFormat,Tt,Ht,lt.normalized,lt.colorSpace,R.isXRRenderTarget===!0),Rt=Ee(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Rt,Pt,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+rt,i.RENDERBUFFER,W.__webglColorRenderbuffer[rt])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),ie(W.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(xt){e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),Wt(i.TEXTURE_CUBE_MAP,x);for(let rt=0;rt<6;rt++)if(x.mipmaps&&x.mipmaps.length>0)for(let lt=0;lt<x.mipmaps.length;lt++)Ut(W.__webglFramebuffer[rt][lt],R,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,lt);else Ut(W.__webglFramebuffer[rt],R,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0);p(x)&&S(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Et){for(let rt=0,lt=tt.length;rt<lt;rt++){const Tt=tt[rt],Ht=n.get(Tt);let Pt=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Pt=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Pt,Ht.__webglTexture),Wt(Pt,Tt),Ut(W.__webglFramebuffer,R,Tt,i.COLOR_ATTACHMENT0+rt,Pt,0),p(Tt)&&S(Pt)}e.unbindTexture()}else{let rt=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(rt=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(rt,Y.__webglTexture),Wt(rt,x),x.mipmaps&&x.mipmaps.length>0)for(let lt=0;lt<x.mipmaps.length;lt++)Ut(W.__webglFramebuffer[lt],R,x,i.COLOR_ATTACHMENT0,rt,lt);else Ut(W.__webglFramebuffer,R,x,i.COLOR_ATTACHMENT0,rt,0);p(x)&&S(rt),e.unbindTexture()}R.depthBuffer&&ee(R)}function re(R){const x=R.textures;for(let W=0,Y=x.length;W<Y;W++){const tt=x[W];if(p(tt)){const xt=E(R),Et=n.get(tt).__webglTexture;e.bindTexture(xt,Et),S(xt),e.unbindTexture()}}}const xe=[],Fe=[];function Ve(R){if(R.samples>0){if(Ie(R)===!1){const x=R.textures,W=R.width,Y=R.height;let tt=i.COLOR_BUFFER_BIT;const xt=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Et=n.get(R),rt=x.length>1;if(rt)for(let Tt=0;Tt<x.length;Tt++)e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Et.__webglMultisampledFramebuffer);const lt=R.texture.mipmaps;lt&&lt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Et.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Et.__webglFramebuffer);for(let Tt=0;Tt<x.length;Tt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(tt|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(tt|=i.STENCIL_BUFFER_BIT)),rt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Et.__webglColorRenderbuffer[Tt]);const Ht=n.get(x[Tt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ht,0)}i.blitFramebuffer(0,0,W,Y,0,0,W,Y,tt,i.NEAREST),l===!0&&(xe.length=0,Fe.length=0,xe.push(i.COLOR_ATTACHMENT0+Tt),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(xe.push(xt),Fe.push(xt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Fe)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,xe))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),rt)for(let Tt=0;Tt<x.length;Tt++){e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,Et.__webglColorRenderbuffer[Tt]);const Ht=n.get(x[Tt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,Ht,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Et.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){const x=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function Ee(R){return Math.min(s.maxSamples,R.samples)}function Ie(R){const x=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function V(R){const x=a.render.frame;u.get(R)!==x&&(u.set(R,x),R.update())}function Ue(R,x){const W=R.colorSpace,Y=R.format,tt=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||W!==Gr&&W!==di&&(ce.getTransfer(W)===ve?(Y!==bn||tt!==cn)&&Kt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):de("WebGLTextures: Unsupported texture color space:",W)),x}function me(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=st,this.resetTextureUnits=X,this.getTextureUnits=B,this.setTextureUnits=q,this.setTexture2D=pt,this.setTexture2DArray=Q,this.setTexture3D=ct,this.setTextureCube=ut,this.rebindTextures=he,this.setupRenderTarget=ge,this.updateRenderTargetMipmap=re,this.updateMultisampleRenderTarget=Ve,this.setupDepthRenderbuffer=ee,this.setupFrameBufferTexture=Ut,this.useMultisampledRTT=Ie,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function y_(i,t){function e(n,s=di){let r;const a=ce.getTransfer(s);if(n===cn)return i.UNSIGNED_BYTE;if(n===Jo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Qo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===gh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===_h)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ph)return i.BYTE;if(n===mh)return i.SHORT;if(n===Os)return i.UNSIGNED_SHORT;if(n===Ko)return i.INT;if(n===On)return i.UNSIGNED_INT;if(n===Un)return i.FLOAT;if(n===Bn)return i.HALF_FLOAT;if(n===xh)return i.ALPHA;if(n===vh)return i.RGB;if(n===bn)return i.RGBA;if(n===jn)return i.DEPTH_COMPONENT;if(n===Ei)return i.DEPTH_STENCIL;if(n===Mh)return i.RED;if(n===jo)return i.RED_INTEGER;if(n===Ri)return i.RG;if(n===tl)return i.RG_INTEGER;if(n===el)return i.RGBA_INTEGER;if(n===Ir||n===Ur||n===Nr||n===Fr)if(a===ve)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ir)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Nr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ir)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ur)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Nr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Fr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===no||n===io||n===so||n===ro)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===no)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===io)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===so)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ro)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ao||n===oo||n===lo||n===co||n===ho||n===zr||n===uo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ao||n===oo)return a===ve?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===lo)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===co)return r.COMPRESSED_R11_EAC;if(n===ho)return r.COMPRESSED_SIGNED_R11_EAC;if(n===zr)return r.COMPRESSED_RG11_EAC;if(n===uo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===fo||n===po||n===mo||n===go||n===_o||n===xo||n===vo||n===Mo||n===yo||n===So||n===bo||n===Eo||n===To||n===Ao)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===fo)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===po)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===mo)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===go)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===_o)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===xo)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===vo)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Mo)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===yo)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===So)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===bo)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Eo)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===To)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ao)return a===ve?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wo||n===Ro||n===Co)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===wo)return a===ve?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ro)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Co)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Po||n===Lo||n===Hr||n===Do)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Po)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Lo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Hr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Do)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Bs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const S_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,b_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class E_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Rh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new kn({vertexShader:S_,fragmentShader:b_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new be(new Ti(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class T_ extends Pi{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,g=null;const y=typeof XRWebGLBinding<"u",m=new E_,p={},S=e.getContextAttributes();let E=null,M=null;const T=[],b=[],C=new Ft;let v=null,A=null;const O=new pn;O.viewport=new Pe;const N=new pn;N.viewport=new Pe;const I=[O,N],X=new Dd;let B=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ot=T[j];return ot===void 0&&(ot=new va,T[j]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(j){let ot=T[j];return ot===void 0&&(ot=new va,T[j]=ot),ot.getGripSpace()},this.getHand=function(j){let ot=T[j];return ot===void 0&&(ot=new va,T[j]=ot),ot.getHandSpace()};function st(j){const ot=b.indexOf(j.inputSource);if(ot===-1)return;const Mt=T[ot];Mt!==void 0&&(Mt.update(j.inputSource,j.frame,c||a),Mt.dispatchEvent({type:j.type,data:j.inputSource}))}function J(){s.removeEventListener("select",st),s.removeEventListener("selectstart",st),s.removeEventListener("selectend",st),s.removeEventListener("squeeze",st),s.removeEventListener("squeezestart",st),s.removeEventListener("squeezeend",st),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",pt);for(let j=0;j<T.length;j++){const ot=b[j];ot!==null&&(b[j]=null,T[j].disconnect(ot))}B=null,q=null,m.reset();for(const j in p)delete p[j];if(t.setRenderTarget(E),f=null,h=null,d=null,s=null,M=null,Jt.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(C.width,C.height,!1),A!==null){const j=A.camera;j.fov=A.fov,j.zoom=A.zoom,j.updateProjectionMatrix(),A=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&Kt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,n.isPresenting===!0&&Kt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&y&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(E=t.getRenderTarget(),s.addEventListener("select",st),s.addEventListener("selectstart",st),s.addEventListener("selectend",st),s.addEventListener("squeeze",st),s.addEventListener("squeezestart",st),s.addEventListener("squeezeend",st),s.addEventListener("end",J),s.addEventListener("inputsourceschange",pt),S.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(C),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let Mt=null,$t=null,Ut=null;S.depth&&(Ut=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Mt=S.stencil?Ei:jn,$t=S.stencil?Bs:On);const ie={colorFormat:e.RGBA8,depthFormat:Ut,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(ie),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),M=new Tn(h.textureWidth,h.textureHeight,{format:bn,type:cn,depthTexture:new zs(h.textureWidth,h.textureHeight,$t,void 0,void 0,void 0,void 0,void 0,void 0,Mt),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const Mt={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Mt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Tn(f.framebufferWidth,f.framebufferHeight,{format:bn,type:cn,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Jt.setContext(s),Jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function pt(j){for(let ot=0;ot<j.removed.length;ot++){const Mt=j.removed[ot],$t=b.indexOf(Mt);$t>=0&&(b[$t]=null,T[$t].disconnect(Mt))}for(let ot=0;ot<j.added.length;ot++){const Mt=j.added[ot];let $t=b.indexOf(Mt);if($t===-1){for(let ie=0;ie<T.length;ie++)if(ie>=b.length){b.push(Mt),$t=ie;break}else if(b[ie]===null){b[ie]=Mt,$t=ie;break}if($t===-1)break}const Ut=T[$t];Ut&&Ut.connect(Mt)}}const Q=new G,ct=new G;function ut(j,ot,Mt){Q.setFromMatrixPosition(ot.matrixWorld),ct.setFromMatrixPosition(Mt.matrixWorld);const $t=Q.distanceTo(ct),Ut=ot.projectionMatrix.elements,ie=Mt.projectionMatrix.elements,Ce=Ut[14]/(Ut[10]-1),ee=Ut[14]/(Ut[10]+1),he=(Ut[9]+1)/Ut[5],ge=(Ut[9]-1)/Ut[5],re=(Ut[8]-1)/Ut[0],xe=(ie[8]+1)/ie[0],Fe=Ce*re,Ve=Ce*xe,Ee=$t/(-re+xe),Ie=Ee*-re;if(ot.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Ie),j.translateZ(Ee),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Ut[10]===-1)j.projectionMatrix.copy(ot.projectionMatrix),j.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{const V=Ce+Ee,Ue=ee+Ee,me=Fe-Ie,R=Ve+($t-Ie),x=he*ee/Ue*V,W=ge*ee/Ue*V;j.projectionMatrix.makePerspective(me,R,x,W,V,Ue),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function zt(j,ot){ot===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ot.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let ot=j.near,Mt=j.far;m.texture!==null&&(m.depthNear>0&&(ot=m.depthNear),m.depthFar>0&&(Mt=m.depthFar)),X.near=N.near=O.near=ot,X.far=N.far=O.far=Mt,(B!==X.near||q!==X.far)&&(s.updateRenderState({depthNear:X.near,depthFar:X.far}),B=X.near,q=X.far),X.layers.mask=j.layers.mask|6,O.layers.mask=X.layers.mask&-5,N.layers.mask=X.layers.mask&-3;const $t=j.parent,Ut=X.cameras;zt(X,$t);for(let ie=0;ie<Ut.length;ie++)zt(Ut[ie],$t);Ut.length===2?ut(X,O,N):X.projectionMatrix.copy(O.projectionMatrix),A===null&&j.isPerspectiveCamera&&(A={camera:j,fov:j.fov,zoom:j.zoom}),Ot(j,X,$t)};function Ot(j,ot,Mt){Mt===null?j.matrix.copy(ot.matrixWorld):(j.matrix.copy(Mt.matrixWorld),j.matrix.invert(),j.matrix.multiply(ot.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ot.projectionMatrix),j.projectionMatrixInverse.copy(ot.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Uo*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return X},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(j){l=j,h!==null&&(h.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(X)},this.getCameraTexture=function(j){return p[j]};let pe=null;function Wt(j,ot){if(u=ot.getViewerPose(c||a),g=ot,u!==null){const Mt=u.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let $t=!1;Mt.length!==X.cameras.length&&(X.cameras.length=0,$t=!0);for(let ee=0;ee<Mt.length;ee++){const he=Mt[ee];let ge=null;if(f!==null)ge=f.getViewport(he);else{const xe=d.getViewSubImage(h,he);ge=xe.viewport,ee===0&&(t.setRenderTargetTextures(M,xe.colorTexture,xe.depthStencilTexture),t.setRenderTarget(M))}let re=I[ee];re===void 0&&(re=new pn,re.layers.enable(ee),re.viewport=new Pe,I[ee]=re),re.matrix.fromArray(he.transform.matrix),re.matrix.decompose(re.position,re.quaternion,re.scale),re.projectionMatrix.fromArray(he.projectionMatrix),re.projectionMatrixInverse.copy(re.projectionMatrix).invert(),re.viewport.set(ge.x,ge.y,ge.width,ge.height),ee===0&&(X.matrix.copy(re.matrix),X.matrix.decompose(X.position,X.quaternion,X.scale)),$t===!0&&X.cameras.push(re)}const Ut=s.enabledFeatures;if(Ut&&Ut.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){d=n.getBinding();const ee=d.getDepthInformation(Mt[0]);ee&&ee.isValid&&ee.texture&&m.init(ee,s.renderState)}if(Ut&&Ut.includes("camera-access")&&y){t.state.unbindTexture(),d=n.getBinding();for(let ee=0;ee<Mt.length;ee++){const he=Mt[ee].camera;if(he){let ge=p[he];ge||(ge=new Rh,p[he]=ge);const re=d.getCameraImage(he);ge.sourceTexture=re}}}}for(let Mt=0;Mt<T.length;Mt++){const $t=b[Mt],Ut=T[Mt];$t!==null&&Ut!==void 0&&Ut.update($t,ot,c||a)}pe&&pe(j,ot),ot.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ot}),g=null}const Jt=new zh;Jt.setAnimationLoop(Wt),this.setAnimationLoop=function(j){pe=j},this.dispose=function(){}}}const A_=new Re,Yh=new te;Yh.set(-1,0,0,0,1,0,0,0,1);function w_(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Bh(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,S,E,M){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,M)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),y(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,S,E):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===sn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===sn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=t.get(p),E=S.envMap,M=S.envMapRotation;E&&(m.envMap.value=E,m.envMapRotation.value.setFromMatrix4(A_.makeRotationFromEuler(M)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Yh),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,S,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=E*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===sn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){const S=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function R_(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,T){const b=T.program;n.uniformBlockBinding(M,b)}function c(M,T){let b=s[M.id];b===void 0&&(m(M),b=u(M),s[M.id]=b,M.addEventListener("dispose",S));const C=T.program;n.updateUBOMapping(M,C);const v=t.render.frame;r[M.id]!==v&&(h(M),r[M.id]=v)}function u(M){const T=d();M.__bindingPointIndex=T;const b=i.createBuffer(),C=M.__size,v=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,C,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,b),b}function d(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return de("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(M){const T=s[M.id],b=M.uniforms,C=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let v=0,A=b.length;v<A;v++){const O=b[v];if(Array.isArray(O))for(let N=0,I=O.length;N<I;N++)f(O[N],v,N,C);else f(O,v,0,C)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(M,T,b,C){if(y(M,T,b,C)===!0){const v=M.__offset,A=M.value;if(Array.isArray(A)){let O=0;for(let N=0;N<A.length;N++){const I=A[N],X=p(I);g(I,M.__data,O),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(O+=X.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(A,M.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,M.__data)}}function g(M,T,b){typeof M=="number"||typeof M=="boolean"?T[0]=M:M.isMatrix3?(T[0]=M.elements[0],T[1]=M.elements[1],T[2]=M.elements[2],T[3]=0,T[4]=M.elements[3],T[5]=M.elements[4],T[6]=M.elements[5],T[7]=0,T[8]=M.elements[6],T[9]=M.elements[7],T[10]=M.elements[8],T[11]=0):ArrayBuffer.isView(M)?T.set(new M.constructor(M.buffer,M.byteOffset,T.length)):M.toArray(T,b)}function y(M,T,b,C){const v=M.value,A=T+"_"+b;if(C[A]===void 0)return typeof v=="number"||typeof v=="boolean"?C[A]=v:ArrayBuffer.isView(v)?C[A]=v.slice():C[A]=v.clone(),!0;{const O=C[A];if(typeof v=="number"||typeof v=="boolean"){if(O!==v)return C[A]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(O.equals(v)===!1)return O.copy(v),!0}}return!1}function m(M){const T=M.uniforms;let b=0;const C=16;for(let A=0,O=T.length;A<O;A++){const N=Array.isArray(T[A])?T[A]:[T[A]];for(let I=0,X=N.length;I<X;I++){const B=N[I],q=Array.isArray(B.value)?B.value:[B.value];for(let st=0,J=q.length;st<J;st++){const pt=q[st],Q=p(pt),ct=b%C,ut=ct%Q.boundary,zt=ct+ut;b+=ut,zt!==0&&C-zt<Q.storage&&(b+=C-zt),B.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=b,b+=Q.storage}}}const v=b%C;return v>0&&(b+=C-v),M.__size=b,M.__cache={},this}function p(M){const T={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(T.boundary=4,T.storage=4):M.isVector2?(T.boundary=8,T.storage=8):M.isVector3||M.isColor?(T.boundary=16,T.storage=12):M.isVector4?(T.boundary=16,T.storage=16):M.isMatrix3?(T.boundary=48,T.storage=48):M.isMatrix4?(T.boundary=64,T.storage=64):M.isTexture?Kt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(T.boundary=16,T.storage=M.byteLength):Kt("WebGLRenderer: Unsupported uniform value type.",M),T}function S(M){const T=M.target;T.removeEventListener("dispose",S);const b=a.indexOf(T.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function E(){for(const M in s)i.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:l,update:c,dispose:E}}const C_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Ln=null;function P_(){return Ln===null&&(Ln=new Of(C_,16,16,Ri,Bn),Ln.name="DFG_LUT",Ln.minFilter=Ze,Ln.magFilter=Ze,Ln.wrapS=Zn,Ln.wrapT=Zn,Ln.generateMipmaps=!1,Ln.needsUpdate=!0),Ln}class L_{constructor(t={}){const{canvas:e=ff(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=cn}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const y=f,m=new Set([el,tl,jo]),p=new Set([cn,On,Os,Bs,Jo,Qo]),S=new Uint32Array(4),E=new Int32Array(4),M=new G;let T=null,b=null;const C=[],v=[];let A=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=En,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const O=this;let N=!1,I=null,X=null,B=null,q=null;this._outputColorSpace=on;let st=0,J=0,pt=null,Q=-1,ct=null;const ut=new Pe,zt=new Pe;let Ot=null;const pe=new oe(0);let Wt=0,Jt=e.width,j=e.height,ot=1,Mt=null,$t=null;const Ut=new Pe(0,0,Jt,j),ie=new Pe(0,0,Jt,j);let Ce=!1;const ee=new ol;let he=!1,ge=!1;const re=new Re,xe=new G,Fe=new Pe,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ee=!1;function Ie(){return pt===null?ot:1}let V=n;function Ue(_,w){return e.getContext(_,w)}let me,R,x,W,Y,tt,xt,Et,rt,lt,Tt,Ht,Pt,Rt,Bt,qt,Qt,z,Ct,at,At,Lt,dt;try{const _={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Zo}`),e.addEventListener("webglcontextlost",_e,!1),e.addEventListener("webglcontextrestored",ue,!1),e.addEventListener("webglcontextcreationerror",Je,!1),V===null){const w="webgl2";if(V=Ue(w,_),V===null)throw Ue(w)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Vt()}catch(_){throw e.removeEventListener("webglcontextlost",_e,!1),e.removeEventListener("webglcontextrestored",ue,!1),e.removeEventListener("webglcontextcreationerror",Je,!1),de("WebGLRenderer: "+_.message),_}function Vt(){me=new P0(V),me.init(),At=new y_(V,me),R=new M0(V,me,t,At),x=new v_(V,me),R.reversedDepthBuffer&&h&&x.buffers.depth.setReversed(!0),X=V.createFramebuffer(),B=V.createFramebuffer(),q=V.createFramebuffer(),W=new I0(V),Y=new r_,tt=new M_(V,me,x,Y,R,At,W),xt=new C0(O),Et=new Nd(V),Lt=new x0(V,Et),rt=new L0(V,Et,W,Lt),lt=new N0(V,rt,Et,Lt,W),z=new U0(V,R,tt),Bt=new y0(Y),Tt=new s_(O,xt,me,R,Lt,Bt),Ht=new w_(O,Y),Pt=new o_,Rt=new d_(me),Qt=new _0(O,xt,x,lt,g,l),qt=new x_(O,lt,R),dt=new R_(V,W,R,x),Ct=new v0(V,me,W),at=new D0(V,me,W),W.programs=Tt.programs,O.capabilities=R,O.extensions=me,O.properties=Y,O.renderLists=Pt,O.shadowMap=qt,O.state=x,O.info=W}y!==cn&&(A=new O0(y,e.width,e.height,o,s,r));const Nt=new T_(O,V);this.xr=Nt,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const _=me.get("WEBGL_lose_context");_&&_.loseContext()},this.forceContextRestore=function(){const _=me.get("WEBGL_lose_context");_&&_.restoreContext()},this.getPixelRatio=function(){return ot},this.setPixelRatio=function(_){_!==void 0&&(ot=_,this.setSize(Jt,j,!1))},this.getSize=function(_){return _.set(Jt,j)},this.setSize=function(_,w,D=!0){if(Nt.isPresenting){Kt("WebGLRenderer: Can't change size while VR device is presenting.");return}Jt=_,j=w,e.width=Math.floor(_*ot),e.height=Math.floor(w*ot),D===!0&&(e.style.width=_+"px",e.style.height=w+"px"),A!==null&&A.setSize(e.width,e.height),this.setViewport(0,0,_,w)},this.getDrawingBufferSize=function(_){return _.set(Jt*ot,j*ot).floor()},this.setDrawingBufferSize=function(_,w,D){Jt=_,j=w,ot=D,e.width=Math.floor(_*D),e.height=Math.floor(w*D),this.setViewport(0,0,_,w)},this.setEffects=function(_){if(y===cn){de("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(_){for(let w=0;w<_.length;w++)if(_[w].isOutputPass===!0){Kt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(_||[])},this.getCurrentViewport=function(_){return _.copy(ut)},this.getViewport=function(_){return _.copy(Ut)},this.setViewport=function(_,w,D,P){_.isVector4?Ut.set(_.x,_.y,_.z,_.w):Ut.set(_,w,D,P),x.viewport(ut.copy(Ut).multiplyScalar(ot).round())},this.getScissor=function(_){return _.copy(ie)},this.setScissor=function(_,w,D,P){_.isVector4?ie.set(_.x,_.y,_.z,_.w):ie.set(_,w,D,P),x.scissor(zt.copy(ie).multiplyScalar(ot).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(_){x.setScissorTest(Ce=_)},this.setOpaqueSort=function(_){Mt=_},this.setTransparentSort=function(_){$t=_},this.getClearColor=function(_){return _.copy(Qt.getClearColor())},this.setClearColor=function(){Qt.setClearColor(...arguments)},this.getClearAlpha=function(){return Qt.getClearAlpha()},this.setClearAlpha=function(){Qt.setClearAlpha(...arguments)},this.clear=function(_=!0,w=!0,D=!0){let P=0;if(_){let k=!1;if(pt!==null){const mt=pt.texture.format;k=m.has(mt)}if(k){const mt=pt.texture.type,ft=p.has(mt),_t=Qt.getClearColor(),vt=Qt.getClearAlpha(),wt=_t.r,kt=_t.g,Gt=_t.b;ft?(S[0]=wt,S[1]=kt,S[2]=Gt,S[3]=vt,V.clearBufferuiv(V.COLOR,0,S)):(E[0]=wt,E[1]=kt,E[2]=Gt,E[3]=vt,V.clearBufferiv(V.COLOR,0,E))}else P|=V.COLOR_BUFFER_BIT}w&&(P|=V.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),D&&(P|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P!==0&&V.clear(P)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(_){_.setRenderer(this),I=_},this.dispose=function(){e.removeEventListener("webglcontextlost",_e,!1),e.removeEventListener("webglcontextrestored",ue,!1),e.removeEventListener("webglcontextcreationerror",Je,!1),Qt.dispose(),Pt.dispose(),Rt.dispose(),Y.dispose(),xt.dispose(),lt.dispose(),Lt.dispose(),dt.dispose(),Tt.dispose(),Nt.dispose(),Nt.removeEventListener("sessionstart",Ii),Nt.removeEventListener("sessionend",Js),Vn.stop()};function _e(_){_.preventDefault(),Gl("WebGLRenderer: Context Lost."),N=!0}function ue(){Gl("WebGLRenderer: Context Restored."),N=!1;const _=W.autoReset,w=qt.enabled,D=qt.autoUpdate,P=qt.needsUpdate,k=qt.type;Vt(),W.autoReset=_,qt.enabled=w,qt.autoUpdate=D,qt.needsUpdate=P,qt.type=k}function Je(_){de("WebGLRenderer: A WebGL context could not be created. Reason: ",_.statusMessage)}function We(_){const w=_.target;w.removeEventListener("dispose",We),wn(w)}function wn(_){gn(_),Y.remove(_)}function gn(_){const w=Y.get(_).programs;w!==void 0&&(w.forEach(function(D){Tt.releaseProgram(D)}),_.isShaderMaterial&&Tt.releaseShaderCache(_))}this.renderBufferDirect=function(_,w,D,P,k,mt){w===null&&(w=Ve);const ft=k.isMesh&&k.matrixWorld.determinantAffine()<0,_t=it(_,w,D,P,k);x.setMaterial(P,ft);let vt=D.index,wt=1;if(P.wireframe===!0){if(vt=rt.getWireframeAttribute(D),vt===void 0)return;wt=2}const kt=D.drawRange,Gt=D.attributes.position;let St=kt.start*wt,ae=(kt.start+kt.count)*wt;mt!==null&&(St=Math.max(St,mt.start*wt),ae=Math.min(ae,(mt.start+mt.count)*wt)),vt!==null?(St=Math.max(St,0),ae=Math.min(ae,vt.count)):Gt!=null&&(St=Math.max(St,0),ae=Math.min(ae,Gt.count));const Xt=ae-St;if(Xt<0||Xt===1/0)return;Lt.setup(k,P,_t,D,vt);let Zt,jt=Ct;if(vt!==null&&(Zt=Et.get(vt),jt=at,jt.setIndex(Zt)),k.isMesh)P.wireframe===!0?(x.setLineWidth(P.wireframeLinewidth*Ie()),jt.setMode(V.LINES)):jt.setMode(V.TRIANGLES);else if(k.isLine){let ye=P.linewidth;ye===void 0&&(ye=1),x.setLineWidth(ye*Ie()),k.isLineSegments?jt.setMode(V.LINES):k.isLineLoop?jt.setMode(V.LINE_LOOP):jt.setMode(V.LINE_STRIP)}else k.isPoints?jt.setMode(V.POINTS):k.isSprite&&jt.setMode(V.TRIANGLES);if(k.isBatchedMesh)if(me.get("WEBGL_multi_draw"))jt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const ye=k._multiDrawStarts,bt=k._multiDrawCounts,Qe=k._multiDrawCount,fe=vt?Et.get(vt).bytesPerElement:1,hn=Y.get(P).currentProgram.getUniforms();for(let Rn=0;Rn<Qe;Rn++)hn.setValue(V,"_gl_DrawID",Rn),jt.render(ye[Rn]/fe,bt[Rn])}else if(k.isInstancedMesh)jt.renderInstances(St,Xt,k.count);else if(D.isInstancedBufferGeometry){const ye=D._maxInstanceCount!==void 0?D._maxInstanceCount:1/0,bt=Math.min(D.instanceCount,ye);jt.renderInstances(St,Xt,bt)}else jt.render(St,Xt)};function Li(_,w,D,P){I!==null&&_.isNodeMaterial&&I.setObject(P,_),he===!0&&Bt.setState(_,D,!1),_.transparent===!0&&_.side===ln&&_.forceSinglePass===!1?(_.side=sn,_.needsUpdate=!0,$(_,w,P),_.side=Ai,_.needsUpdate=!0,$(_,w,P),_.side=ln):$(_,w,P)}this.compile=function(_,w,D=null){D===null&&(D=_),I!==null&&I.renderStart(_,w,D),b=Rt.get(D),b.init(w),v.push(b),D.traverseVisible(function(k){k.isLight&&k.layers.test(w.layers)&&(b.pushLight(k),k.castShadow&&b.pushShadow(k))}),_!==D&&_.traverseVisible(function(k){k.isLight&&k.layers.test(w.layers)&&(b.pushLight(k),k.castShadow&&b.pushShadow(k))}),b.setupLights(),I!==null&&I.updateLights(b.state.lightsArray),ge=this.localClippingEnabled,he=Bt.init(this.clippingPlanes,ge),he===!0&&Bt.setGlobalState(this.clippingPlanes,w),I!==null&&qt.render(b.state.shadowsArray,D,w);const P=new Set;return _.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const mt=k.material;if(mt)if(Array.isArray(mt))for(let ft=0;ft<mt.length;ft++){const _t=mt[ft];Li(_t,D,w,k),P.add(_t)}else Li(mt,D,w,k),P.add(mt)}),b=v.pop(),I!==null&&I.renderEnd(),P},this.compileAsync=function(_,w,D=null){const P=this.compile(_,w,D);return new Promise(k=>{function mt(){if(P.forEach(function(ft){const vt=Y.get(ft).currentProgram;(vt===void 0||vt.isReady())&&P.delete(ft)}),P.size===0){k(_);return}setTimeout(mt,10)}me.get("KHR_parallel_shader_compile")!==null?mt():setTimeout(mt,10)})};let Di=null;function Ks(_){Di&&Di(_)}function Ii(){Vn.stop()}function Js(){Vn.start()}const Vn=new zh;Vn.setAnimationLoop(Ks),typeof self<"u"&&Vn.setContext(self),this.setAnimationLoop=function(_){Di=_,Nt.setAnimationLoop(_),_===null?Vn.stop():Vn.start()},Nt.addEventListener("sessionstart",Ii),Nt.addEventListener("sessionend",Js),this.render=function(_,w){if(w!==void 0&&w.isCamera!==!0){de("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;I!==null&&I.renderStart(_,w);const D=Nt.enabled===!0&&Nt.isPresenting===!0,P=A!==null&&(pt===null||D)&&A.begin(O,pt);if(_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),w.parent===null&&w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),Nt.enabled===!0&&Nt.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Nt.cameraAutoUpdate===!0&&Nt.updateCamera(w),w=Nt.getCamera()),_.isScene===!0&&_.onBeforeRender(O,_,w,pt),b=Rt.get(_,v.length),b.init(w),b.state.textureUnits=tt.getTextureUnits(),v.push(b),re.multiplyMatrices(w.projectionMatrix,w.matrixWorldInverse),ee.setFromProjectionMatrix(re,Nn,w.reversedDepth),ge=this.localClippingEnabled,he=Bt.init(this.clippingPlanes,ge),T=Pt.get(_,C.length),T.init(),C.push(T),Nt.enabled===!0&&Nt.isPresenting===!0){const ft=O.xr.getDepthSensingMesh();ft!==null&&U(ft,w,-1/0,O.sortObjects)}U(_,w,0,O.sortObjects),T.finish(),I!==null&&I.updateLights(b.state.lightsArray),O.sortObjects===!0&&T.sort(Mt,$t),Ee=Nt.enabled===!1||Nt.isPresenting===!1||Nt.hasDepthSensing()===!1,Ee&&Qt.addToRenderList(T,_),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),he===!0&&Bt.beginShadows();const k=b.state.shadowsArray;if(qt.render(k,_,w),he===!0&&Bt.endShadows(),(P&&A.hasRenderPass())===!1){const ft=T.opaque,_t=T.transmissive;if(b.setupLights(),w.isArrayCamera){const vt=w.cameras;if(_t.length>0)for(let wt=0,kt=vt.length;wt<kt;wt++){const Gt=vt[wt];et(ft,_t,_,Gt)}Ee&&Qt.render(_);for(let wt=0,kt=vt.length;wt<kt;wt++){const Gt=vt[wt];L(T,_,Gt,Gt.viewport)}}else _t.length>0&&et(ft,_t,_,w),Ee&&Qt.render(_),L(T,_,w)}pt!==null&&J===0&&(tt.updateMultisampleRenderTarget(pt),tt.updateRenderTargetMipmap(pt)),P&&A.end(O),_.isScene===!0&&_.onAfterRender(O,_,w),Lt.resetDefaultState(),Q=-1,ct=null,v.pop(),v.length>0?(b=v[v.length-1],tt.setTextureUnits(b.state.textureUnits),he===!0&&Bt.setGlobalState(O.clippingPlanes,b.state.camera)):b=null,C.pop(),C.length>0?T=C[C.length-1]:T=null,I!==null&&I.renderEnd()};function U(_,w,D,P){if(_.visible===!1)return;if(_.layers.test(w.layers)){if(_.isGroup)D=_.renderOrder;else if(_.isLOD)_.autoUpdate===!0&&_.update(w);else if(_.isLightProbeGrid)b.pushLightProbeGrid(_);else if(_.isLight)b.pushLight(_),_.castShadow&&b.pushShadow(_);else if(_.isSprite){if(!_.frustumCulled||_.intersectsFrustum(ee)){P&&Fe.setFromMatrixPosition(_.matrixWorld).applyMatrix4(re);const ft=lt.update(_),_t=_.material;_t.visible&&T.push(_,ft,_t,D,Fe.z,null,w)}}else if((_.isMesh||_.isLine||_.isPoints)&&(!_.frustumCulled||_.intersectsFrustum(ee))){const ft=lt.update(_),_t=_.material;if(P&&(_.boundingSphere!==void 0?(_.boundingSphere===null&&_.computeBoundingSphere(),Fe.copy(_.boundingSphere.center)):(ft.boundingSphere===null&&ft.computeBoundingSphere(),Fe.copy(ft.boundingSphere.center)),Fe.applyMatrix4(_.matrixWorld).applyMatrix4(re)),Array.isArray(_t)){const vt=ft.groups;for(let wt=0,kt=vt.length;wt<kt;wt++){const Gt=vt[wt],St=_t[Gt.materialIndex];St&&St.visible&&T.push(_,ft,St,D,Fe.z,Gt,w)}}else _t.visible&&T.push(_,ft,_t,D,Fe.z,null,w)}}const mt=_.children;for(let ft=0,_t=mt.length;ft<_t;ft++)U(mt[ft],w,D,P)}function L(_,w,D,P){const{opaque:k,transmissive:mt,transparent:ft}=_;b.setupLightsView(D),he===!0&&Bt.setGlobalState(O.clippingPlanes,D),P&&x.viewport(ut.copy(P)),k.length>0&&K(k,w,D),mt.length>0&&K(mt,w,D),ft.length>0&&K(ft,w,D),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function et(_,w,D,P){if((D.isScene===!0?D.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[P.id]===void 0){const St=me.has("EXT_color_buffer_half_float")||me.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[P.id]=new Tn(1,1,{generateMipmaps:!0,type:St?Bn:cn,minFilter:bi,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ce.workingColorSpace})}const mt=b.state.transmissionRenderTarget[P.id],ft=P.viewport||ut;mt.setSize(ft.z*O.transmissionResolutionScale,ft.w*O.transmissionResolutionScale);const _t=O.getRenderTarget(),vt=O.getActiveCubeFace(),wt=O.getActiveMipmapLevel();O.setRenderTarget(mt),O.getClearColor(pe),Wt=O.getClearAlpha(),Wt<1&&O.setClearColor(16777215,.5),O.clear(),Ee&&Qt.render(D);const kt=O.toneMapping;O.toneMapping=En;const Gt=P.viewport;if(P.viewport!==void 0&&(P.viewport=void 0),b.setupLightsView(P),he===!0&&Bt.setGlobalState(O.clippingPlanes,P),K(_,D,P),tt.updateMultisampleRenderTarget(mt),tt.updateRenderTargetMipmap(mt),me.has("WEBGL_multisampled_render_to_texture")===!1){let St=!1;for(let ae=0,Xt=w.length;ae<Xt;ae++){const Zt=w[ae],{object:jt,geometry:ye,material:bt,group:Qe}=Zt;if(bt.side===ln&&jt.layers.test(P.layers)){const fe=bt.side;bt.side=sn,bt.needsUpdate=!0,H(jt,D,P,ye,bt,Qe),bt.side=fe,bt.needsUpdate=!0,St=!0}}St===!0&&(tt.updateMultisampleRenderTarget(mt),tt.updateRenderTargetMipmap(mt))}O.setRenderTarget(_t,vt,wt),O.setClearColor(pe,Wt),Gt!==void 0&&(P.viewport=Gt),O.toneMapping=kt}function K(_,w,D){const P=w.isScene===!0?w.overrideMaterial:null;for(let k=0,mt=_.length;k<mt;k++){const ft=_[k],{object:_t,geometry:vt,group:wt}=ft;let kt=ft.material;kt.allowOverride===!0&&P!==null&&(kt=P),_t.layers.test(D.layers)&&H(_t,w,D,vt,kt,wt)}}function H(_,w,D,P,k,mt){I!==null&&k.isNodeMaterial&&I.setObject(_,k),_.onBeforeRender(O,w,D,P,k,mt),_.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,_.matrixWorld),_.normalMatrix.getNormalMatrix(_.modelViewMatrix),k.onBeforeRender(O,w,D,P,_,mt),k.transparent===!0&&k.side===ln&&k.forceSinglePass===!1?(k.side=sn,k.needsUpdate=!0,O.renderBufferDirect(D,w,P,k,_,mt),k.side=Ai,k.needsUpdate=!0,O.renderBufferDirect(D,w,P,k,_,mt),k.side=ln):O.renderBufferDirect(D,w,P,k,_,mt),_.onAfterRender(O,w,D,P,k,mt)}function $(_,w,D){w.isScene!==!0&&(w=Ve);const P=Y.get(_),k=b.state.lights,mt=b.state.shadowsArray,ft=k.state.version,_t=Tt.getParameters(_,k.state,mt,w,D,b.state.lightProbeGridArray),vt=Tt.getProgramCacheKey(_t);let wt=P.programs;P.environment=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?w.environment:null,P.fog=w.fog;const kt=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap;P.envMap=xt.get(_.envMap||P.environment,kt),P.envMapRotation=P.environment!==null&&_.envMap===null?w.environmentRotation:_.envMapRotation,wt===void 0&&(_.addEventListener("dispose",We),wt=new Map,P.programs=wt);let Gt=wt.get(vt);if(Gt!==void 0){if(P.currentProgram===Gt&&P.lightsStateVersion===ft)return ht(_,_t),Gt}else _t.uniforms=Tt.getUniforms(_),I!==null&&_.isNodeMaterial&&I.build(_,D,_t),_.onBeforeCompile(_t,O),Gt=Tt.acquireProgram(_t,vt),wt.set(vt,Gt),P.uniforms=_t.uniforms;const St=P.uniforms;return(!_.isShaderMaterial&&!_.isRawShaderMaterial||_.clipping===!0)&&(St.clippingPlanes=Bt.uniform),ht(_,_t),P.needsLights=yt(_),P.lightsStateVersion=ft,P.needsLights&&(St.ambientLightColor.value=k.state.ambient,St.lightProbe.value=k.state.probe,St.sunLights.value=k.state.sun,St.sunLightShadows.value=k.state.sunShadow,St.directionalLights.value=k.state.directional,St.directionalLightShadows.value=k.state.directionalShadow,St.spotLights.value=k.state.spot,St.spotLightShadows.value=k.state.spotShadow,St.rectAreaLights.value=k.state.rectArea,St.ltc_1.value=k.state.rectAreaLTC1,St.ltc_2.value=k.state.rectAreaLTC2,St.pointLights.value=k.state.point,St.pointLightShadows.value=k.state.pointShadow,St.hemisphereLights.value=k.state.hemi,St.sunShadowMatrix.value=k.state.sunShadowMatrix,St.sunShadowCascade.value=k.state.sunShadowCascade,St.directionalShadowMatrix.value=k.state.directionalShadowMatrix,St.spotLightMatrix.value=k.state.spotLightMatrix,St.spotLightMap.value=k.state.spotLightMap,St.pointShadowMatrix.value=k.state.pointShadowMatrix),P.lightProbeGrid=b.state.lightProbeGridArray.length>0,P.currentProgram=Gt,P.uniformsList=null,Gt}function nt(_){if(_.uniformsList===null){const w=_.currentProgram.getUniforms();_.uniformsList=Or.seqWithValue(w.seq,_.uniforms)}return _.uniformsList}function ht(_,w){const D=Y.get(_);D.outputColorSpace=w.outputColorSpace,D.batching=w.batching,D.batchingColor=w.batchingColor,D.instancing=w.instancing,D.instancingColor=w.instancingColor,D.instancingMorph=w.instancingMorph,D.skinning=w.skinning,D.morphTargets=w.morphTargets,D.morphNormals=w.morphNormals,D.morphColors=w.morphColors,D.morphTargetsCount=w.morphTargetsCount,D.numClippingPlanes=w.numClippingPlanes,D.numIntersection=w.numClipIntersection,D.vertexAlphas=w.vertexAlphas,D.vertexTangents=w.vertexTangents,D.toneMapping=w.toneMapping}function F(_,w){if(_.length===0)return null;if(_.length===1)return _[0].texture!==null?_[0]:null;M.setFromMatrixPosition(w.matrixWorld);for(let D=0,P=_.length;D<P;D++){const k=_[D];if(k.texture!==null&&k.boundingBox.containsPoint(M))return k}return null}function it(_,w,D,P,k){w.isScene!==!0&&(w=Ve),tt.resetTextureUnits();const mt=w.fog,ft=P.isMeshStandardMaterial||P.isMeshLambertMaterial||P.isMeshPhongMaterial?w.environment:null,_t=pt===null?O.outputColorSpace:pt.isXRRenderTarget===!0?pt.texture.colorSpace:ce.workingColorSpace,vt=P.isMeshStandardMaterial||P.isMeshLambertMaterial&&!P.envMap||P.isMeshPhongMaterial&&!P.envMap,wt=xt.get(P.envMap||ft,vt),kt=P.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,Gt=!!D.attributes.tangent&&(!!P.normalMap||P.anisotropy>0),St=!!D.morphAttributes.position,ae=!!D.morphAttributes.normal,Xt=!!D.morphAttributes.color;let Zt=En;P.toneMapped&&(pt===null||pt.isXRRenderTarget===!0)&&(Zt=O.toneMapping);const jt=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,ye=jt!==void 0?jt.length:0,bt=Y.get(P),Qe=b.state.lights;if(he===!0&&(ge===!0||_!==ct)){const Se=_===ct&&P.id===Q;Bt.setState(P,_,Se)}let fe=!1;P.version===bt.__version?(bt.needsLights&&bt.lightsStateVersion!==Qe.state.version||bt.outputColorSpace!==_t||k.isBatchedMesh&&bt.batching===!1||!k.isBatchedMesh&&bt.batching===!0||k.isBatchedMesh&&bt.batchingColor===!0&&k._colorsTexture===null||k.isBatchedMesh&&bt.batchingColor===!1&&k._colorsTexture!==null||k.isInstancedMesh&&bt.instancing===!1||!k.isInstancedMesh&&bt.instancing===!0||k.isSkinnedMesh&&bt.skinning===!1||!k.isSkinnedMesh&&bt.skinning===!0||k.isInstancedMesh&&bt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&bt.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&bt.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&bt.instancingMorph===!1&&k.morphTexture!==null||bt.envMap!==wt||P.fog===!0&&bt.fog!==mt||bt.numClippingPlanes!==void 0&&(bt.numClippingPlanes!==Bt.numPlanes||bt.numIntersection!==Bt.numIntersection)||bt.vertexAlphas!==kt||bt.vertexTangents!==Gt||bt.morphTargets!==St||bt.morphNormals!==ae||bt.morphColors!==Xt||bt.toneMapping!==Zt||bt.morphTargetsCount!==ye||!!bt.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(fe=!0):(fe=!0,bt.__version=P.version);let hn=bt.currentProgram;fe===!0&&(hn=$(P,w,k),I&&P.isNodeMaterial&&I.onUpdateProgram(P,hn,bt));let Rn=!1,ei=!1,Ui=!1;const Me=hn.getUniforms(),Ne=bt.uniforms;if(x.useProgram(hn.program)&&(Rn=!0,ei=!0,Ui=!0),P.id!==Q&&(Q=P.id,ei=!0),bt.needsLights){const Se=F(b.state.lightProbeGridArray,k);bt.lightProbeGrid!==Se&&(bt.lightProbeGrid=Se,ei=!0)}if(Rn||ct!==_){x.buffers.depth.getReversed()&&_.reversedDepth!==!0&&(_._reversedDepth=!0,_.updateProjectionMatrix()),Me.setValue(V,"projectionMatrix",_.projectionMatrix),Me.setValue(V,"viewMatrix",_.matrixWorldInverse);const ii=Me.map.cameraPosition;ii!==void 0&&ii.setValue(V,xe.setFromMatrixPosition(_.matrixWorld)),R.logarithmicDepthBuffer&&Me.setValue(V,"logDepthBufFC",2/(Math.log(_.far+1)/Math.LN2)),(P.isMeshPhongMaterial||P.isMeshToonMaterial||P.isMeshLambertMaterial||P.isMeshBasicMaterial||P.isMeshStandardMaterial||P.isShaderMaterial)&&Me.setValue(V,"isOrthographic",_.isOrthographicCamera===!0),ct!==_&&(ct=_,ei=!0,Ui=!0)}if(bt.needsLights&&(Qe.state.sunShadowMap.length>0&&Me.setValue(V,"sunShadowMap",Qe.state.sunShadowMap,tt),Qe.state.directionalShadowMap.length>0&&Me.setValue(V,"directionalShadowMap",Qe.state.directionalShadowMap,tt),Qe.state.spotShadowMap.length>0&&Me.setValue(V,"spotShadowMap",Qe.state.spotShadowMap,tt),Qe.state.pointShadowMap.length>0&&Me.setValue(V,"pointShadowMap",Qe.state.pointShadowMap,tt)),k.isSkinnedMesh){Me.setOptional(V,k,"bindMatrix"),Me.setOptional(V,k,"bindMatrixInverse");const Se=k.skeleton;Se&&(Se.boneTexture===null&&Se.computeBoneTexture(),Me.setValue(V,"boneTexture",Se.boneTexture,tt))}k.isBatchedMesh&&(Me.setOptional(V,k,"batchingTexture"),Me.setValue(V,"batchingTexture",k._matricesTexture,tt),Me.setOptional(V,k,"batchingIdTexture"),Me.setValue(V,"batchingIdTexture",k._indirectTexture,tt),Me.setOptional(V,k,"batchingColorTexture"),k._colorsTexture!==null&&Me.setValue(V,"batchingColorTexture",k._colorsTexture,tt));const ni=D.morphAttributes;if((ni.position!==void 0||ni.normal!==void 0||ni.color!==void 0)&&z.update(k,D,hn),(ei||bt.receiveShadow!==k.receiveShadow)&&(bt.receiveShadow=k.receiveShadow,Me.setValue(V,"receiveShadow",k.receiveShadow)),(P.isMeshStandardMaterial||P.isMeshLambertMaterial||P.isMeshPhongMaterial)&&P.envMap===null&&w.environment!==null&&(Ne.envMapIntensity.value=w.environmentIntensity),Ne.dfgLUT!==void 0&&(Ne.dfgLUT.value=P_()),ei){if(Me.setValue(V,"toneMappingExposure",O.toneMappingExposure),bt.needsLights&&Z(Ne,Ui),mt&&P.fog===!0&&Ht.refreshFogUniforms(Ne,mt),Ht.refreshMaterialUniforms(Ne,P,ot,j,b.state.transmissionRenderTarget[_.id]),bt.needsLights&&bt.lightProbeGrid){const Se=bt.lightProbeGrid;Ne.probesSH.value=Se.texture,Ne.probesMin.value.copy(Se.boundingBox.min),Ne.probesMax.value.copy(Se.boundingBox.max),Ne.probesResolution.value.copy(Se.resolution)}Or.upload(V,nt(bt),Ne,tt)}if(P.isShaderMaterial&&P.uniformsNeedUpdate===!0&&(Or.upload(V,nt(bt),Ne,tt),P.uniformsNeedUpdate=!1),P.isSpriteMaterial&&Me.setValue(V,"center",k.center),Me.setValue(V,"modelViewMatrix",k.modelViewMatrix),Me.setValue(V,"normalMatrix",k.normalMatrix),Me.setValue(V,"modelMatrix",k.matrixWorld),P.uniformsGroups!==void 0){const Se=P.uniformsGroups;for(let ii=0,Ni=Se.length;ii<Ni;ii++){const El=Se[ii];dt.update(El,hn),dt.bind(El,hn)}}return hn}function Z(_,w){_.ambientLightColor.needsUpdate=w,_.lightProbe.needsUpdate=w,_.sunLights.needsUpdate=w,_.sunLightShadows.needsUpdate=w,_.directionalLights.needsUpdate=w,_.directionalLightShadows.needsUpdate=w,_.pointLights.needsUpdate=w,_.pointLightShadows.needsUpdate=w,_.spotLights.needsUpdate=w,_.spotLightShadows.needsUpdate=w,_.rectAreaLights.needsUpdate=w,_.hemisphereLights.needsUpdate=w}function yt(_){return _.isMeshLambertMaterial||_.isMeshToonMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isShadowMaterial||_.isShaderMaterial&&_.lights===!0}this.getActiveCubeFace=function(){return st},this.getActiveMipmapLevel=function(){return J},this.getRenderTarget=function(){return pt},this.setRenderTargetTextures=function(_,w,D){const P=Y.get(_);P.__autoAllocateDepthBuffer=_.resolveDepthBuffer===!1,P.__autoAllocateDepthBuffer===!1&&(P.__useRenderToTexture=!1),Y.get(_.texture).__webglTexture=w,Y.get(_.depthTexture).__webglTexture=P.__autoAllocateDepthBuffer?void 0:D,P.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(_,w){const D=Y.get(_);D.__webglFramebuffer=w,D.__useDefaultFramebuffer=w===void 0},this.setRenderTarget=function(_,w=0,D=0){pt=_,st=w,J=D;let P=null,k=!1,mt=!1;if(_){const _t=Y.get(_);if(_t.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(V.FRAMEBUFFER,_t.__webglFramebuffer),ut.copy(_.viewport),zt.copy(_.scissor),Ot=_.scissorTest,x.viewport(ut),x.scissor(zt),x.setScissorTest(Ot),Q=-1;return}else if(_t.__webglFramebuffer===void 0)tt.setupRenderTarget(_);else if(_t.__hasExternalTextures)tt.rebindTextures(_,Y.get(_.texture).__webglTexture,Y.get(_.depthTexture).__webglTexture);else if(_.depthBuffer){const kt=_.depthTexture;if(_t.__boundDepthTexture!==kt){if(kt!==null&&Y.has(kt)&&(_.width!==kt.image.width||_.height!==kt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");tt.setupDepthRenderbuffer(_)}}const vt=_.texture;(vt.isData3DTexture||vt.isDataArrayTexture||vt.isCompressedArrayTexture)&&(mt=!0);const wt=Y.get(_).__webglFramebuffer;_.isWebGLCubeRenderTarget?(Array.isArray(wt[w])?P=wt[w][D]:P=wt[w],k=!0):_.samples>0&&tt.useMultisampledRTT(_)===!1?P=Y.get(_).__webglMultisampledFramebuffer:Array.isArray(wt)?P=wt[D]:P=wt,ut.copy(_.viewport),zt.copy(_.scissor),Ot=_.scissorTest}else ut.copy(Ut).multiplyScalar(ot).floor(),zt.copy(ie).multiplyScalar(ot).floor(),Ot=Ce;if(D!==0&&(P=X),x.bindFramebuffer(V.FRAMEBUFFER,P)&&x.drawBuffers(_,P),x.viewport(ut),x.scissor(zt),x.setScissorTest(Ot),k){const _t=Y.get(_.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+w,_t.__webglTexture,D)}else if(mt){const _t=w;for(let vt=0;vt<_.textures.length;vt++){const wt=Y.get(_.textures[vt]);V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0+vt,wt.__webglTexture,D,_t)}}else if(_!==null&&D!==0){const _t=Y.get(_.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,_t.__webglTexture,D)}Q=-1};function gt(_){const w=Y.get(_);return(w.__readFormat!==_.format||w.__readType!==_.type)&&(w.__readFormat=_.format,w.__readType=_.type,w.__formatReadable=R.textureFormatReadable(_.format),w.__typeReadable=R.textureTypeReadable(_.type)),w}this.readRenderTargetPixels=function(_,w,D,P,k,mt,ft,_t=0){if(!(_&&_.isWebGLRenderTarget)){de("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let vt=Y.get(_).__webglFramebuffer;if(_.isWebGLCubeRenderTarget&&ft!==void 0&&(vt=vt[ft]),vt){x.bindFramebuffer(V.FRAMEBUFFER,vt);try{const wt=_.textures[_t],kt=wt.format,Gt=wt.type;_.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+_t);const St=gt(wt);if(St.__formatReadable===!1){de("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(St.__typeReadable===!1){de("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}w>=0&&w<=_.width-P&&D>=0&&D<=_.height-k&&V.readPixels(w,D,P,k,At.convert(kt),At.convert(Gt),mt)}finally{const wt=pt!==null?Y.get(pt).__webglFramebuffer:null;x.bindFramebuffer(V.FRAMEBUFFER,wt)}}},this.readRenderTargetPixelsAsync=async function(_,w,D,P,k,mt,ft,_t=0){if(!(_&&_.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let vt=Y.get(_).__webglFramebuffer;if(_.isWebGLCubeRenderTarget&&ft!==void 0&&(vt=vt[ft]),vt)if(w>=0&&w<=_.width-P&&D>=0&&D<=_.height-k){x.bindFramebuffer(V.FRAMEBUFFER,vt);const wt=_.textures[_t],kt=wt.format,Gt=wt.type;_.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+_t);const St=gt(wt);if(St.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(St.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ae=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,ae),V.bufferData(V.PIXEL_PACK_BUFFER,mt.byteLength,V.STREAM_READ),V.readPixels(w,D,P,k,At.convert(kt),At.convert(Gt),0),V.bindBuffer(V.PIXEL_PACK_BUFFER,null);const Xt=pt!==null?Y.get(pt).__webglFramebuffer:null;x.bindFramebuffer(V.FRAMEBUFFER,Xt);const Zt=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await df(V,Zt,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,ae),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,mt),V.bindBuffer(V.PIXEL_PACK_BUFFER,null),V.deleteBuffer(ae),V.deleteSync(Zt),mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(_,w=null,D=0){const P=Math.pow(2,-D),k=Math.floor(_.image.width*P),mt=Math.floor(_.image.height*P),ft=w!==null?w.x:0,_t=w!==null?w.y:0;tt.setTexture2D(_,0),V.copyTexSubImage2D(V.TEXTURE_2D,D,0,0,ft,_t,k,mt),x.unbindTexture()},this.copyTextureToTexture=function(_,w,D=null,P=null,k=0,mt=0){let ft,_t,vt,wt,kt,Gt,St,ae,Xt;const Zt=_.isCompressedTexture?_.mipmaps[mt]:_.image;if(D!==null)ft=D.max.x-D.min.x,_t=D.max.y-D.min.y,vt=D.isBox3?D.max.z-D.min.z:1,wt=D.min.x,kt=D.min.y,Gt=D.isBox3?D.min.z:0;else{const Ne=Math.pow(2,-k);ft=Math.floor(Zt.width*Ne),_t=Math.floor(Zt.height*Ne),_.isDataArrayTexture?vt=Zt.depth:_.isData3DTexture?vt=Math.floor(Zt.depth*Ne):vt=1,wt=0,kt=0,Gt=0}P!==null?(St=P.x,ae=P.y,Xt=P.z):(St=0,ae=0,Xt=0);const jt=At.convert(w.format),ye=At.convert(w.type);let bt;w.isData3DTexture?(tt.setTexture3D(w,0),bt=V.TEXTURE_3D):w.isDataArrayTexture||w.isCompressedArrayTexture?(tt.setTexture2DArray(w,0),bt=V.TEXTURE_2D_ARRAY):(tt.setTexture2D(w,0),bt=V.TEXTURE_2D),x.activeTexture(V.TEXTURE0),x.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,w.flipY),x.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),x.pixelStorei(V.UNPACK_ALIGNMENT,w.unpackAlignment);const Qe=x.getParameter(V.UNPACK_ROW_LENGTH),fe=x.getParameter(V.UNPACK_IMAGE_HEIGHT),hn=x.getParameter(V.UNPACK_SKIP_PIXELS),Rn=x.getParameter(V.UNPACK_SKIP_ROWS),ei=x.getParameter(V.UNPACK_SKIP_IMAGES);x.pixelStorei(V.UNPACK_ROW_LENGTH,Zt.width),x.pixelStorei(V.UNPACK_IMAGE_HEIGHT,Zt.height),x.pixelStorei(V.UNPACK_SKIP_PIXELS,wt),x.pixelStorei(V.UNPACK_SKIP_ROWS,kt),x.pixelStorei(V.UNPACK_SKIP_IMAGES,Gt);const Ui=_.isDataArrayTexture||_.isData3DTexture,Me=w.isDataArrayTexture||w.isData3DTexture;if(_.isDepthTexture){const Ne=Y.get(_),ni=Y.get(w),Se=Y.get(Ne.__renderTarget),ii=Y.get(ni.__renderTarget);x.bindFramebuffer(V.READ_FRAMEBUFFER,Se.__webglFramebuffer),x.bindFramebuffer(V.DRAW_FRAMEBUFFER,ii.__webglFramebuffer);for(let Ni=0;Ni<vt;Ni++)Ui&&(V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Y.get(_).__webglTexture,k,Gt+Ni),V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Y.get(w).__webglTexture,mt,Xt+Ni)),V.blitFramebuffer(wt,kt,ft,_t,St,ae,ft,_t,V.DEPTH_BUFFER_BIT,V.NEAREST);x.bindFramebuffer(V.READ_FRAMEBUFFER,null),x.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else if(k!==0||_.isRenderTargetTexture||Y.has(_)){const Ne=Y.get(_),ni=Y.get(w);x.bindFramebuffer(V.READ_FRAMEBUFFER,B),x.bindFramebuffer(V.DRAW_FRAMEBUFFER,q);for(let Se=0;Se<vt;Se++)Ui?V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Ne.__webglTexture,k,Gt+Se):V.framebufferTexture2D(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,Ne.__webglTexture,k),Me?V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,ni.__webglTexture,mt,Xt+Se):V.framebufferTexture2D(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,ni.__webglTexture,mt),k!==0?V.blitFramebuffer(wt,kt,ft,_t,St,ae,ft,_t,V.COLOR_BUFFER_BIT,V.NEAREST):Me?V.copyTexSubImage3D(bt,mt,St,ae,Xt+Se,wt,kt,ft,_t):V.copyTexSubImage2D(bt,mt,St,ae,wt,kt,ft,_t);x.bindFramebuffer(V.READ_FRAMEBUFFER,null),x.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else Me?_.isDataTexture||_.isData3DTexture?V.texSubImage3D(bt,mt,St,ae,Xt,ft,_t,vt,jt,ye,Zt.data):w.isCompressedArrayTexture?V.compressedTexSubImage3D(bt,mt,St,ae,Xt,ft,_t,vt,jt,Zt.data):V.texSubImage3D(bt,mt,St,ae,Xt,ft,_t,vt,jt,ye,Zt):_.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,mt,St,ae,ft,_t,jt,ye,Zt.data):_.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,mt,St,ae,Zt.width,Zt.height,jt,Zt.data):V.texSubImage2D(V.TEXTURE_2D,mt,St,ae,ft,_t,jt,ye,Zt);x.pixelStorei(V.UNPACK_ROW_LENGTH,Qe),x.pixelStorei(V.UNPACK_IMAGE_HEIGHT,fe),x.pixelStorei(V.UNPACK_SKIP_PIXELS,hn),x.pixelStorei(V.UNPACK_SKIP_ROWS,Rn),x.pixelStorei(V.UNPACK_SKIP_IMAGES,ei),mt===0&&w.generateMipmaps&&V.generateMipmap(bt),x.unbindTexture()},this.initRenderTarget=function(_){Y.get(_).__webglFramebuffer===void 0&&tt.setupRenderTarget(_)},this.initTexture=function(_){_.isCubeTexture?tt.setTextureCube(_,0):_.isData3DTexture?tt.setTexture3D(_,0):_.isDataArrayTexture||_.isCompressedArrayTexture?tt.setTexture2DArray(_,0):tt.setTexture2D(_,0),x.unbindTexture()},this.resetState=function(){st=0,J=0,pt=null,x.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Nn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ce._getDrawingBufferColorSpace(t),e.unpackColorSpace=ce._getUnpackColorSpace()}}const Ms=new G;function fn(i,t,e,n,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;Ms.copy(t),Ms[n]=0,Ms.normalize();const c=.5*a/(a+o),u=1-Ms.angleTo(i)/l;return Math.sign(Ms[e])===1?u*c:o/(a+o)+c+c*(1-u)}class Is extends hs{constructor(t=1,e=1,n=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new G,c=new G,u=new G(t,e,n).divideScalar(2).subScalar(r),d=this.attributes.position.array,h=this.attributes.normal.array,f=this.attributes.uv.array,g=d.length/6,y=new G,m=.5/a;for(let p=0,S=0;p<d.length;p+=3,S+=2)switch(l.fromArray(d,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),d[p+0]=u.x*Math.sign(l.x)+c.x*r,d[p+1]=u.y*Math.sign(l.y)+c.y*r,d[p+2]=u.z*Math.sign(l.z)+c.z*r,h[p+0]=c.x,h[p+1]=c.y,h[p+2]=c.z,Math.floor(p/g)){case 0:y.set(1,0,0),f[S+0]=fn(y,c,"z","y",r,n),f[S+1]=1-fn(y,c,"y","z",r,e);break;case 1:y.set(-1,0,0),f[S+0]=1-fn(y,c,"z","y",r,n),f[S+1]=1-fn(y,c,"y","z",r,e);break;case 2:y.set(0,1,0),f[S+0]=1-fn(y,c,"x","z",r,t),f[S+1]=fn(y,c,"z","x",r,n);break;case 3:y.set(0,-1,0),f[S+0]=1-fn(y,c,"x","z",r,t),f[S+1]=1-fn(y,c,"z","x",r,n);break;case 4:y.set(0,0,1),f[S+0]=1-fn(y,c,"x","y",r,t),f[S+1]=1-fn(y,c,"y","x",r,e);break;case 5:y.set(0,0,-1),f[S+0]=fn(y,c,"x","y",r,t),f[S+1]=1-fn(y,c,"y","x",r,e);break}}static fromJSON(t){return new Is(t.width,t.height,t.depth,t.segments,t.radius)}}function D_(i,t,e){t=Math.max(t,globalThis.innerWidth||0),e=Math.max(e,globalThis.innerHeight||0);const n=Math.min(1.6,Math.max(1,globalThis.devicePixelRatio||1));i.width=Math.max(1,Math.round(Math.min(2400,t*n))),i.height=Math.max(1,Math.round(Math.min(1800,e*n)));const s=i.getContext("2d"),r=i.width,a=i.height,o=r/a>1.15,l=a*(o?.29:.18),c=s.createLinearGradient(0,0,0,l);c.addColorStop(0,"#70e2dc"),c.addColorStop(.55,"#a8f1df"),c.addColorStop(1,"#ddffe9"),s.fillStyle=c,s.fillRect(0,0,r,l);const u=s.createLinearGradient(0,l,0,a);u.addColorStop(0,"#fff7c9"),u.addColorStop(.48,"#ffedc8"),u.addColorStop(1,"#ffd8c2"),s.fillStyle=u,s.fillRect(0,l,r,a-l);const d=s.createRadialGradient(r*.5,a*.42,0,r*.5,a*.42,a*.72);d.addColorStop(0,"#ffffffd9"),d.addColorStop(.42,"#fffbe676"),d.addColorStop(1,"#ffbfa900"),s.fillStyle=d,s.fillRect(0,0,r,a),s.lineWidth=Math.max(2,r/900),s.strokeStyle="#238f8b22";for(let f=0;f<=r;f+=r/9)s.beginPath(),s.moveTo(f,0),s.lineTo(f,l),s.stroke();const h=s.createLinearGradient(0,l-a*.018,0,l+a*.025);h.addColorStop(0,"#fffce8"),h.addColorStop(.38,"#fff0a8"),h.addColorStop(.42,"#ff7f9c"),h.addColorStop(1,"#d85378"),s.fillStyle=h,s.fillRect(0,l-a*.018,r,a*.043),s.fillStyle="#8f3f6726",s.fillRect(0,l+a*.025,r,a*.012),s.strokeStyle="#d68d7b24",s.lineWidth=Math.max(1.5,r/1100);for(let f=1;f<7;f++){const g=f/7,y=l+(a-l)*g*g;s.beginPath(),s.moveTo(0,y),s.lineTo(r,y),s.stroke()}for(let f=-6;f<=6;f++)s.beginPath(),s.moveTo(r*.5+f*r*.035,l),s.lineTo(r*.5+f*r*.16,a),s.stroke()}const I_="#f6e0ad",Tr=2.65,Ar=.38,Ae=.74,wr=.5,Wa=1.28,Yr=4,Gc=Yr*Yr,$h=180,U_=910,Zh=520,Vc=1.15,N_=$h+340,Rr=460,ys=380,F_=300,O_=380,Ts=i=>Number.isFinite(i.arriveAt)?i.arriveAt+N_:i.drain+U_,Cr=i=>Ts(i)+Zh,Wc=i=>new oe(i);function B_(i,t){const e=matchMedia("(prefers-reduced-motion: reduce)"),n=[],s=U=>(n.push(U),U),r=document.createElement("canvas");r.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block",i.insertBefore(r,i.firstChild);const a=new L_({canvas:r,antialias:!0,alpha:!0});a.setClearColor(0,0),a.setPixelRatio(Math.min(2,window.devicePixelRatio||1)),a.shadowMap.enabled=!0,a.shadowMap.type=Rs,a.toneMapping=En,a.toneMappingExposure=1;const o=new Cf,l=document.createElement("canvas");function c(){D_(l,i.clientWidth,i.clientHeight),document.body.style.backgroundImage=`url(${l.toDataURL("image/webp",.92)})`,document.body.style.backgroundSize="100% 100%",document.body.style.backgroundRepeat="no-repeat",o.background=null,document.body.classList.remove("has-side-scene"),document.body.style.removeProperty("--ls-side-image")}const u=typeof location<"u"&&+new URLSearchParams(location.search).get("fov"),d=new pn(u||20,1,4,4e3);o.add(new Pd(16777215,.58)),o.add(new Ad(16775388,3443843,.46));const h=new Cd(16774108,1.34);h.castShadow=!0,h.shadow.mapSize.set(2048,2048),h.shadow.bias=-3e-4,h.shadow.normalBias=.035,h.shadow.radius=2,o.add(h);const f=new yn,g=new yn,y=new yn,m=new yn,p=new yn;o.add(f,g,y,m,p);const S=new WeakMap,E=s(new Is(1,1,1,4,.18)),M=s(new Is(1,1,1,4,.23)),T=new Map;function b(U,L){const et=L?U+"!":U;if(!T.has(et)){const K={color:Wc(U),roughness:.28,metalness:0,clearcoat:.62,clearcoatRoughness:.22};L&&(K.emissive=Wc(U),K.emissiveIntensity=.3),T.set(et,s(new uc(K)))}return T.get(et)}const C=s(new Qi({color:10136544,transparent:!0,opacity:.25,depthWrite:!1,side:ln}));s(new Qi({color:1513535,transparent:!0,opacity:.2,depthWrite:!1,side:ln}));const v=new Oo;v.moveTo(-.31,-.095),v.quadraticCurveTo(-.35,-.095,-.35,-.055),v.lineTo(-.35,.055),v.quadraticCurveTo(-.35,.095,-.31,.095),v.lineTo(.045,.095),v.lineTo(.045,.19),v.quadraticCurveTo(.045,.235,.085,.21),v.lineTo(.355,.025),v.quadraticCurveTo(.39,0,.355,-.025),v.lineTo(.085,-.21),v.quadraticCurveTo(.045,-.235,.045,-.19),v.lineTo(.045,-.095),v.closePath();const A=s(new qr(v,8));function O(U,L,et,K,H,$,nt,ht,F,it){const Z=new be(E,b(ht,it));return Z.scale.set(K,$,H),Z.position.set(L,nt+$/2,et),F!==void 0&&(Z.rotation.y=F),Z.castShadow=!0,Z.receiveShadow=!0,U.add(Z),Z}function N(U,L,et,K,H,$,nt,ht,F,it,Z=.14){const yt=Math.max(.015,Math.min(Z,K/2-.01,H/2-.01,$/2-.01)),gt=new be(new Is(K,$,H,5,yt),b(ht,it));return gt.position.set(L,nt+$/2,et),F!==void 0&&(gt.rotation.y=F),gt.castShadow=!0,gt.receiveShadow=!0,U.add(gt),gt}function I(U){U.traverse(L=>{L.geometry&&!n.includes(L.geometry)&&L.geometry.dispose()}),U.clear()}const X=2.82;function B(U){const L=U.ring.map(nt=>new G(nt.x,0,nt.y)),et=new No(L,U.closed,"centripetal"),K=Math.max(384,L.length*2),H=et.getPoints(K);U.closed&&H.pop();const $=H.map((nt,ht)=>{const F=H[U.closed?(ht-1+H.length)%H.length:Math.max(0,ht-1)],it=H[U.closed?(ht+1)%H.length:Math.min(H.length-1,ht+1)],Z=Math.hypot(it.x-F.x,it.z-F.z)||1;return{x:-(it.z-F.z)/Z,z:(it.x-F.x)/Z}});return{points:H,normals:$,closed:U.closed}}function q(U,L,et,K,H=0){const{points:$,normals:nt,closed:ht}=U,F=$.length,it=[],Z=[];for(let w=0;w<F;w++){const D=$[w],P=nt[w];for(const k of[-1,1]){const mt=H+L*k/2;it.push(D.x+P.x*mt,et,D.z+P.z*mt)}}for(let w=0;w<F-(ht?0:1);w++){const D=(w+1)%F;Z.push(w*2,D*2,w*2+1,D*2,D*2+1,w*2+1)}const yt=new en;yt.setAttribute("position",new De(it,3)),yt.setIndex(Z),yt.computeVertexNormals();const gt=b(K);gt.side=ln;const _=new be(yt,gt);_.receiveShadow=!0,f.add(_)}function st(U,L,et,K,H){const{points:$,normals:nt,closed:ht}=U,F=$.length,it=[],Z=[];for(let _=0;_<F;_++){const w=$[_],D=nt[_],P=L/2;it.push(w.x-D.x*P,et+K,w.z-D.z*P,w.x+D.x*P,et+K,w.z+D.z*P,w.x-D.x*P,et,w.z-D.z*P,w.x+D.x*P,et,w.z+D.z*P)}for(let _=0;_<F-(ht?0:1);_++){const w=(_+1)%F,D=_*4,P=w*4;Z.push(D,P,D+1,P,P+1,D+1),Z.push(D+2,D+3,P+2,D+3,P+3,P+2),Z.push(D,D+2,P,D+2,P+2,P),Z.push(D+1,P+1,D+3,D+3,P+1,P+3)}const yt=new en;yt.setAttribute("position",new De(it,3)),yt.setIndex(Z),yt.computeVertexNormals();const gt=new be(yt,b(H));return gt.castShadow=!0,gt.receiveShadow=!0,f.add(gt),gt}function J(U,L,et,K,H){const{points:$,normals:nt,closed:ht}=U,F=$.map((gt,_)=>new G(gt.x+nt[_].x*L,K,gt.z+nt[_].z*L)),it=new No(F,ht,"centripetal"),Z=new ul(it,$.length,et,10,ht),yt=new be(Z,b(H));yt.castShadow=!0,yt.receiveShadow=!0,f.add(yt)}function pt(U){const L=(U.x0+U.x1)/2,et=(U.y0+U.y1)/2,K=Math.max(U.x1-U.x0,U.y1-U.y0),H=(Ot()?ut:zt)*Math.PI/180,$=K*1.25;d.position.set(L,$*Math.sin(H),et+$*Math.cos(H)),d.lookAt(L,0,et),h.position.set(L-K*.5,K*1.2,et+K*.35),h.target.position.set(L,0,et),o.add(h.target);const nt=h.shadow.camera;nt.left=-K,nt.right=K,nt.top=K,nt.bottom=-K,nt.near=.5,nt.far=K*3,nt.updateProjectionMatrix()}const Q=U=>typeof location<"u"&&+new URLSearchParams(location.search).get(U),ct=Q("ringfit")||1,ut=Q("elev")||54,zt=Q("delev")||42,Ot=()=>wn>=We;function pe(U){const L=U.bounds,et=(L.x0+L.x1)/2,K=(L.y0+L.y1)/2,H=U.ring,$=H.length,nt=X/2,ht=[];for(let D=0;D<$;D++){const P=H[U.closed?(D-1+$)%$:Math.max(0,D-1)],k=H[U.closed?(D+1)%$:Math.min($-1,D+1)],mt=Math.hypot(k.x-P.x,k.y-P.y)||1,ft=-(k.y-P.y)/mt,_t=(k.x-P.x)/mt;for(const vt of[-1,1])ht.push(new G(H[D].x+ft*vt*nt,0,H[D].y+_t*vt*nt))}const F=[];for(const D of U.trucks){const P=Tr*(U.fit??1)/2;for(const k of[U.slotPos(D,0,0),U.slotPos(D,D.cap-1,1)])for(const mt of[-1,1])for(const ft of[0,Ae+1.15])F.push(new G(k.x-D.my*mt*P,ft,k.y+D.mx*mt*P))}const it=!document.getElementById("chrome").classList.contains("hide"),Z=it?document.getElementById("topbar").offsetHeight+12:0,yt=it?document.getElementById("tools").offsetHeight+18:0,gt=Math.max(.2,1-2*Z/wn),_=Math.max(.2,1-2*yt/wn),w=new G(et,0,K);for(let D=0;D<120;D++){d.updateMatrixWorld(),d.updateProjectionMatrix();let P=0,k=1e9,mt=-1e9;for(const Gt of ht.concat(F)){const St=Gt.clone().project(d);k=Math.min(k,St.y),mt=Math.max(mt,St.y)}for(const Gt of ht){const St=Gt.clone().project(d);P=Math.max(P,Math.abs(St.x)/ct,St.y/gt/1,-St.y/_/1)}for(const Gt of F){const St=Gt.clone().project(d);P=Math.max(P,Math.abs(St.x)/.99,St.y/gt/1,-St.y/_/1)}const ft=(gt-_)/2,_t=(k+mt)/2,vt=w.clone().project(d).y,wt=w.clone().add(new G(0,0,-1)).project(d).y;if(Math.abs(_t-ft)>.004&&Math.abs(wt-vt)>1e-6){const Gt=(ft-_t)/(wt-vt);w.z+=Gt,d.position.z+=Gt,d.lookAt(w);continue}if(P<=1&&P>.99)break;const kt=d.position.clone().sub(w);kt.multiplyScalar(Math.max(.6,Math.min(1.6,P/.995))),d.position.copy(w).add(kt),d.lookAt(w)}}function Wt(U){var K;I(f),I(m);const L=Math.max(3,Math.floor(U.len/2.5));for(let H=0;H<L;H++){const $=new yn;$.position.y=.397;const nt=new be(E,b("#8a68cf"));if(nt.scale.set(.065,.02,1.82),nt.position.y=.012,$.add(nt),H%4===0){const ht=new be(A,C);ht.rotation.x=-Math.PI/2,ht.position.y=.034,ht.scale.set(.8,.8,.8),$.add(ht)}m.add($)}const et=new be(new Ti(250,250),s(new _d({color:2707289,opacity:.24})));if(et.rotation.x=-Math.PI/2,et.position.y=-.03,et.receiveShadow=!0,f.add(et),((K=U.ring)==null?void 0:K.length)>1){const H=B(U);st(H,2.88,.03,.18,"#176f78"),st(H,2.64,.16,.16,"#36bba8"),st(H,2.36,.28,.1,"#38256d"),q(H,2.18,.397,"#6849ad");for(const $ of[-1,1])J(H,$*1.25,.065,.405,"#d6fff0")}if(!U.closed){const H=U.ring,$=H.length;for(const[nt,ht]of[[H[0],H[1]],[H[$-1],H[$-2]]]){const F=Math.atan2(ht.y-nt.y,ht.x-nt.x),it={x:nt.x+Math.cos(F)*.4,y:nt.y+Math.sin(F)*.4};O(f,it.x,it.y,.9,X+.04,1.22,.02,"#ff93a6",-F,!0),O(f,it.x-Math.cos(F)*.18,it.y-Math.sin(F)*.18,.6,X-.4,.86,.18,"#534361",-F),O(f,it.x+Math.cos(F)*.4,it.y+Math.sin(F)*.4,.18,X,.18,1.25,"#fff2d7",-F,!0)}}for(const H of U.trucks){const $=Jt(U,H),nt=H.cap*$,ht=Tr*(U.fit??1),F=U.slotPos(H,(H.cap-1)/2,.5),it=j(H),Z=(_,w=!1)=>(_.userData.truck=H,_.userData.tintWhenPacked=w,_);Z(N(f,F.x,F.y,nt+.56,ht+.34,.22,.03,"#6f5ea0",it,!0,.13),!0),Z(N(f,F.x,F.y,nt+.46,ht+.24,.5,.2,"#a294cb",it,!0,.18),!0),Z(N(f,F.x,F.y,nt+.28,ht+.04,.14,.67,"#a294cb",it,!0,.06));for(let _=0;_<H.cap;_++){const w=U.slotPos(H,_,.5);Z(N(f,w.x,w.y,$-.12,ht-.2,.055,.755,"#8e7fbb",it,!0,.025)),Z(N(f,w.x,w.y,$-.2,ht-.3,.04,.805,"#b3a7d8",it,!0,.018))}for(const _ of[-1,1]){const w=F.x-H.my*_*(ht/2-.025),D=F.y+H.mx*_*(ht/2-.025);Z(N(f,w,D,nt+.27,.14,.18,.69,"#c4bbe4",it,!0,.058))}const yt={x:F.x-H.mx*nt/2,z:F.y-H.my*nt/2};Z(N(f,yt.x,yt.z,.15,ht+.02,.18,.69,"#c4bbe4",it,!0,.06));const gt=Math.hypot(H.px-H.x,H.py-H.y);if(gt>.4){const _=new yn;_.position.set(H.px,0,H.py),_.rotation.y=-Math.atan2(H.py-H.y,H.px-H.x),_.userData.bridgeTruck=H;const w=O(_,-gt/2,0,gt+.1,1.35,.13,.43,"#c4bbe4",0,!0);w.userData.truck=H;for(const P of[-1,1]){const k=O(_,-gt/2,P*.69,gt+.08,.17,.22,.45,"#7f6fb0",0,!0);k.userData.truck=H}for(const P of[.27,.55,.8]){const k=O(_,-gt*P,0,.12,1.16,.035,.575,"#b3a7d8",0,!0);k.userData.truck=H}const D=O(_,-.13,0,.4,1.62,.18,.34,"#a294cb",0,!0);D.userData.truck=H,f.add(_)}}}function Jt(U,L){const et=U.slotPos(L,0,.5),K=U.slotPos(L,1,.5);return Math.hypot(et.x-K.x,et.y-K.y)||1.5}const j=U=>Math.atan2(-U.my,U.mx),ot=document.createElement("canvas");ot.width=128,ot.height=128;const Mt=ot.getContext("2d");Mt.textAlign="center",Mt.textBaseline="middle",Mt.lineJoin="round",Mt.globalAlpha=.3,Mt.font="900 30px Trebuchet MS, system-ui, sans-serif",Mt.fillStyle="#ffffff";for(const[U,L,et]of[[24,25,-.18],[103,27,.2],[26,104,.2],[102,102,-.2]])Mt.save(),Mt.translate(U,L),Mt.rotate(et),Mt.fillText("?",0,0),Mt.restore();Mt.globalAlpha=1,Mt.font="900 112px Trebuchet MS, system-ui, sans-serif",Mt.lineWidth=16,Mt.strokeStyle="#ffffff",Mt.strokeText("?",64,70),Mt.fillStyle="#ff2f76",Mt.fillText("?",64,70);const $t=s(new kf(ot));$t.colorSpace=on;const Ut=s(new Qi({map:$t,transparent:!0,depthWrite:!1}));function ie(U,L,et,K,H,$,nt=!1,ht){const F=new be(new Ti(1.18,1.18),H);F.rotation.x=-Math.PI/2,F.position.set(L,K,et),F.userData.truck=$,Number.isInteger(ht)&&(F.userData.slot=ht),nt&&(F.userData.drainTruck=$),U.add(F)}const Ce=new Map;function ee(U){return Ce.has(U)||Ce.set(U,s(new uc({color:U,emissive:U,emissiveIntensity:.18,roughness:.2,metalness:0,clearcoat:.92,clearcoatRoughness:.16}))),Ce.get(U)}function he(U,L,et,K,H,$,nt=0,ht=wr*.7){const F=new be(M,ee($));return F.position.set(L,H+ht/2,et),F.scale.set(K,ht,K),F.rotation.y=nt,F.castShadow=!0,F.receiveShadow=!0,U.add(F),F}function ge(U,L,et,K){const H=U.slotPos(L,et,.5),$=Jt(U,L),nt=Math.floor(K/Gc),ht=K%Gc,F=ht%Yr,it=Math.floor(ht/Yr),Z=$*.235,yt=(F-1.5)*Z,gt=(it-1.5)*Z,_=$*.15;return{x:H.x+L.mx*yt-L.my*gt,y:H.y+L.my*yt+L.mx*gt,bottom:Ae+.2+nt*_*.92,height:_,size:$*.222,layer:nt}}function re(U,L,et,K){return K?(U.perBlock-1-L)*si+(si-1-et):L*si+et}function xe(U,L,et,K,H=null,$=!1,nt=!1,ht=!0,F=0,it=null,Z=0){const yt=Jt(U,L),gt=U.slotPos(L,et,.5),_=j(L);H=H||Array.from({length:U.perBlock},(Xt,Zt)=>Zt);const w=In[K]||"#ff79a6",D=Xt=>(Xt.userData.truck=L,Xt.userData.slot=et,nt&&(Xt.userData.drainTruck=L),it!==null&&(Xt.userData.sourcePulseAt=it,Xt.userData.sourcePulseTruck=L),Z&&(Xt.userData.stackPackAt=Z),Xt),P=U.fit??1,k=new G;d.getWorldDirection(k);const mt=(Xt,Zt)=>Math.sqrt(Math.max(.08,1-Math.pow(Xt*k.x+Zt*k.z,2)));mt(L.mx,L.my),mt(-L.my,L.mx);const ft=yt-.08,_t=Tr*P-.06,vt=ft,wt=_t;if($){D(N(g,gt.x,gt.y,vt+.02,wt+.02,.18,Ae+.025,"#fff9e9",_,!0,.07)),D(N(g,gt.x,gt.y,vt,wt,.72,Ae+.16,I_,_,!0,.16)),ie(g,gt.x,gt.y,Ae+.92,Ut,L,nt,et);return}if(ht){const Xt=D(N(g,gt.x,gt.y,vt,wt,.72,Ae+.05,w,_,!0,.16)),Zt=D(N(g,gt.x,gt.y,vt+.05,wt+.05,.18,Ae+.77,w,_,!0,.12));Xt.userData.boxSealAt=F||0,Xt.userData.boxSealBaseY=Xt.position.y,Xt.userData.boxSealRole="body",Xt.userData.boxSealHeight=.72,Zt.userData.boxSealAt=F||0,Zt.userData.boxSealBaseY=Zt.position.y,Zt.userData.boxSealRole="lid";return}D(N(g,gt.x,gt.y,vt+.06,wt+.06,.18,Ae+.025,"#e4ad68",_,!0,.08)),D(N(g,gt.x,gt.y,vt-.1,wt-.1,.055,Ae+.2,"#fff0bd",_,!0,.025));const kt=.3,Gt=Ae+.17;for(const Xt of[-1,1]){const Zt=Xt*(wt/2-.055);D(N(g,gt.x-L.my*Zt,gt.y+L.mx*Zt,vt,.11,kt,Gt,"#ffd28a",_,!0,.045));const jt=Xt*(vt/2-.055);D(N(g,gt.x+L.mx*jt,gt.y+L.my*jt,.11,wt-.16,kt,Gt,"#ffd28a",_,!0,.045))}if(it!==null){const Xt=wt+.05,Zt=Xt/2-.035;for(const jt of[-1,1]){const ye=jt*(Zt/2+.018),bt=D(N(g,gt.x-L.my*ye,gt.y+L.mx*ye,vt+.05,Zt,.16,Ae+.78,w,_,!0,.1));delete bt.userData.sourcePulseAt,delete bt.userData.sourcePulseTruck,bt.userData.sourceLidAt=it,bt.userData.sourceLidTruck=L,bt.userData.sourceLidSide=jt,bt.userData.sourceLidHalf=Zt/2}}const St=new Set(H),ae=it!==null;for(let Xt=0;Xt<U.perBlock;Xt++){if(!St.has(Xt))continue;const Zt=(L.miniPops||[]).find(jt=>jt.slot===et&&jt.piece===Xt);for(let jt=0;jt<si;jt++){const ye=ge(U,L,et,re(U,Xt,jt,ae)),bt=D(he(g,ye.x,ye.y,ye.size,ye.bottom,w,_+(jt%2?-.045:.045),ye.height));ae&&(bt.userData.jiggleAt=it,bt.userData.jiggleSeed=Xt*.618+jt*.31),bt.userData.candyPiece=Xt,bt.userData.miniCandy=!0,bt.userData.miniIndex=Xt*si+jt,bt.userData.miniLayer=ye.layer,Zt&&(bt.userData.miniPopAt=Zt.at+jt*22)}}}function Fe(U,L,et=!0){var nt;const K=S.get(L)||[],H=L.claim||((nt=K.find(ht=>ht==null?void 0:ht.color))==null?void 0:nt.color);if(!H)return!1;const $=Array.from({length:U.perBlock},(ht,F)=>F);for(let ht=0;ht<Math.min(Dr,L.cap);ht++)xe(U,L,ht,H,$,!1,!0,et,0);return!0}function Ve(U,L,et=!1){var k,mt;const K=U.slotPos(L,(L.cap-1)/2,.5),H=j(L),$=L.cap*Jt(U,L)+.42,nt=Tr*(U.fit??1)+.15,ht=L.claim||((mt=(k=S.get(L))==null?void 0:k.find(ft=>ft==null?void 0:ft.color))==null?void 0:mt.color),F=In[ht]||"#fb7bab",it=et?Vc:0,Z=ft=>(ft.userData.truck=L,et&&(ft.userData.closeTruck=L,ft.userData.closeBaseY=ft.position.y),ft.userData.exitTruck=L,ft.userData.exitCenterX=K.x,ft.userData.exitCenterZ=K.y,ft);Z(N(g,K.x,K.y,$,nt,.2,Ae+.79+it,F,H,!0,.085)),Z(N(g,K.x,K.y,$-.12,nt-.12,.11,Ae+.99+it,F,H,!0,.05));const yt=Math.min(1.7,$*.26);Z(N(g,K.x,K.y,yt,nt-.08,.038,Ae+1.105+it,"#fff6dd",H,!0,.016)),Z(O(g,K.x,K.y,.58,.47,.105,Ae+1.15+it,F,H,!0));for(const ft of[-1,1]){const _t=K.x+L.mx*ft*.46,vt=K.y+L.my*ft*.46;Z(O(g,_t,vt,.27,.31,.065,Ae+1.16+it,F,H+.35*ft,!0))}const gt=K.x-L.mx*$*.32,_=K.y-L.my*$*.32,w=new be(new ll(.37,28),b("#ffefad",!0));w.rotation.x=-Math.PI/2,w.position.set(gt,Ae+1.14+it,_),g.add(Z(w));const D=new Oo;D.moveTo(-.2,0),D.lineTo(-.055,-.14),D.lineTo(.25,.18),D.lineTo(.15,.27),D.lineTo(-.055,.04),D.lineTo(-.12,.1),D.closePath();const P=new be(new qr(D),b("#248d78",!0));P.rotation.x=-Math.PI/2,P.position.set(gt,Ae+1.15+it,_),g.add(Z(P))}function Ee(U){I(g);for(const L of U.trucks){if(L.gone){const $=!e.matches&&L.drain>=0&&U.now<Cr(L),nt=U.now<Ts(L);$&&Fe(U,L,!nt)?U.now>=Ts(L)&&Ve(U,L,!0):Ve(U,L);continue}const et=U.flying.filter($=>$.truck===L),K=U.pending.filter($=>$.truck===L),H=K.length?K[0].slot:null;for(let $=0;$<L.blocks.length;$++){const nt=L.blocks[$],ht=new Set(et.filter(yt=>yt.slot===$).map(yt=>yt.piece)),F=Array.from({length:U.perBlock},(yt,gt)=>gt).filter(yt=>!ht.has(yt)),it=H!==null&&$>=H?$+1:$,Z=nt.packedAt&&U.now<nt.packedAt+ys;xe(U,L,it,nt.color,F,nt.hidden&&!nt.seen,!1,!nt.flying&&!Z,Z?0:nt.packedAt?nt.packedAt+ys:0,null,Z?nt.packedAt:0)}if(L.fill>0&&L.claim){const $=L.blocks.length,nt=new Set(et.filter(F=>F.slot===$).map(F=>F.piece)),ht=Array.from({length:Math.min(U.perBlock,L.fill)},(F,it)=>it).filter(F=>!nt.has(F));xe(U,L,$,L.claim,ht,!1,!1,!1,0)}for(const $ of new Set(K.map(nt=>nt.slot))){const nt=K.filter(ht=>ht.slot===$);xe(U,L,$,nt[0].color,nt.map((ht,F)=>ht.piece??F),!1,!1,!1,0,nt[0].tapAt??nt[0].at)}S.set(L,L.blocks.map($=>({...$})))}for(const L of g.children)L.userData.basePos=L.position.clone(),L.userData.baseScale=L.scale.clone(),L.userData.baseRotY=L.rotation.y}function Ie(U){let L="";for(const et of U.trucks)et.gone?L+=et.drain<0?"x":U.now<Ts(et)?"s":U.now<Cr(et)?"c":"o":L+=et.blocks.map(K=>(K.hidden&&!K.seen?"?":K.color)+(K.flying?"~":K.packedAt&&U.now<K.packedAt+ys?"^":"")).join(""),L+="|"+et.cap+":"+(et.claim||"")+":"+et.fill+";";return L+=U.pending.map(et=>et.truck.lane+":"+et.slot+":"+et.piece).join("/"),L+=U.flying.map(et=>et.truck.lane+":"+et.slot+":"+et.piece).join("/"),L}const V=s(new Xr(.62,.78,32)),Ue=[],me=s(new Xr(.9,1.08,32)),R=[],x=[],W=[],Y=s(new Ti(.36,.14)),tt=[],xt=()=>s(new Qi({color:16777215,transparent:!0,depthWrite:!1,depthTest:!1,side:ln}));function Et(){const U=new be(Y,xt());return p.add(U),U}function rt(){const U=new be(V,xt());return U.rotation.x=-Math.PI/2,U.renderOrder=10,p.add(U),U}function lt(){const U=new be(me,xt());return U.rotation.x=-Math.PI/2,U.renderOrder=10,p.add(U),U}function Tt(){const U=new be(E,xt());return U.renderOrder=11,p.add(U),U}function Ht(U){const L=U.now,et=e.matches,K=et?[]:U.trucks.flatMap(F=>F.blocks.map((it,Z)=>({t:F,b:it,slot:Z,at:(it.packedAt||0)+ys}))).filter(F=>F.b.packedAt&&L-F.at>=0&&L-F.at<Rr+180);for(;Ue.length<K.length;)Ue.push(rt());for(let F=0;F<Ue.length;F++){const it=Ue[F],Z=K[F];if(!Z){it.visible=!1;continue}const yt=Math.min(1,(L-Z.at)/(Rr+180)),gt=U.slotPos(Z.t,Z.slot,.5);it.visible=!0,it.position.set(gt.x,Ae+wr+.3,gt.y);const _=.48+yt*1.48;it.scale.set(_,_,_),it.material.color.set("#fff0a6"),it.material.opacity=(1-yt)*.92}const H=et?[]:U.trucks.filter(F=>Number.isFinite(F.ripple)&&F.ripple>=0&&L-F.ripple>=0&&L-F.ripple<430);for(;R.length<H.length;)R.push(lt());for(let F=0;F<R.length;F++){const it=R[F],Z=H[F];if(!Z){it.visible=!1;continue}const yt=Math.min(1,(L-Z.ripple)/430),gt=U.slotPos(Z,Number.isInteger(Z.rippleSlot)?Z.rippleSlot:Math.max(0,Z.blocks.length-1),.5),_=1-Math.pow(1-yt,3),w=.72+_*.82;it.visible=!0,it.position.set(gt.x,Ae+1.03+yt*.1,gt.y),it.scale.set(w,w,w),it.material.color.set("#ff5f91"),it.material.opacity=(1-yt)*.82}const $=et?[]:H.flatMap(F=>Array.from({length:10},(it,Z)=>({t:F,n:Z})));for(;x.length<$.length;)x.push(Tt());for(let F=0;F<x.length;F++){const it=x[F],Z=$[F];if(!Z){it.visible=!1;continue}const yt=Math.min(1,(L-Z.t.ripple)/430),gt=1-Math.pow(1-yt,3),_=U.slotPos(Z.t,Number.isInteger(Z.t.rippleSlot)?Z.t.rippleSlot:Math.max(0,Z.t.blocks.length-1),.5),w=Z.n*2.399+.35,D=.2+gt*(.78+Z.n%3*.12),P=.17*(1-yt);it.visible=!0,it.position.set(_.x+Math.cos(w)*D,Ae+.94+Math.sin(yt*Math.PI)*(.34+Z.n%2*.1),_.y+Math.sin(w)*D),it.scale.set(P,P*.72,P),it.rotation.set(yt*3+Z.n,0,yt*4-Z.n),it.material.color.set(Z.n%3===0?"#fff4b0":"#ff72a0"),it.material.opacity=1-yt}const nt=et?[]:K.flatMap(F=>Array.from({length:14},(it,Z)=>({...F,n:Z})));for(;W.length<nt.length;)W.push(Tt());for(let F=0;F<W.length;F++){const it=W[F],Z=nt[F];if(!Z){it.visible=!1;continue}const yt=Math.min(1,(L-Z.at)/(Rr+180)),gt=1-Math.pow(1-yt,3),_=U.slotPos(Z.t,Z.slot,.5),w=Z.n*2.399+.8,D=.24+gt*(1.1+Z.n%4*.11),P=.19*(1-yt);it.visible=!0,it.position.set(_.x+Math.cos(w)*D,Ae+1.02+Math.sin(yt*Math.PI)*(.52+Z.n%3*.07),_.y+Math.sin(w)*D),it.scale.set(P,P*.78,P),it.rotation.set(yt*4+Z.n,0,-yt*5+Z.n*.2),it.material.color.set(Z.n%4===0?"#fff1a5":In[Z.b.color]||"#ff7b9e"),it.material.opacity=1-yt}const ht=et?[]:U.trucks.flatMap(F=>F.confetti);for(;tt.length<ht.length;)tt.push(Et());for(let F=0;F<tt.length;F++){const it=tt[F];if(F>=ht.length){it.visible=!1;continue}const Z=ht[F];it.visible=!0,it.position.set(Z.x,Ae+wr+.35,Z.y),it.rotation.set(-Math.PI/2,0,Z.rot),it.material.color.set(Z.col),it.material.opacity=Math.max(0,1-Z.life/1.3)}}function Pt(U){if(!e.matches){for(const L of g.children){const et=L.userData.sourceLidAt;if(et===void 0)continue;const K=Math.max(0,Math.min(1,(U.now-et)/F_)),H=1-Math.pow(1-K,3),$=H*1.02+Math.sin(K*Math.PI)*.08,nt=L.userData.baseScale,ht=L.userData.basePos,F=L.userData.sourceLidTruck,it=L.userData.sourceLidHalf||1,Z=L.userData.sourceLidSide||1,yt=Z*it*(1-Math.cos($)),gt=it*Math.sin($);L.position.set(ht.x-F.my*yt,ht.y+gt,ht.z+F.mx*yt),L.rotation.x=Z*$,L.rotation.y=L.userData.baseRotY,L.rotation.z=0,L.scale.set(nt.x,nt.y,nt.z),L.visible=!0}for(const L of g.children){const et=L.userData.sourcePulseAt;if(et===void 0)continue;const K=Math.max(0,Math.min(1,(U.now-et)/O_)),H=Math.sin(Math.min(1,K/.42)*Math.PI),$=Math.sin(Math.max(0,(K-.18)/.82)*Math.PI),nt=L.userData.baseScale,ht=L.userData.basePos;L.position.y=ht.y-H*.045+$*.075,L.scale.set(nt.x*(1+$*.035),nt.y*(1-H*.12+$*.05),nt.z*(1+$*.035))}for(const L of g.children){const et=L.userData.jiggleAt;if(et===void 0)continue;const K=Math.max(0,U.now-et),H=Math.min(1,K/150),$=L.userData.jiggleSeed||0,nt=Math.abs(Math.sin(K*.028+$*6.1))*H,ht=L.userData.baseScale,F=L.userData.basePos;L.position.y=F.y+nt*.16,L.scale.set(ht.x*(1+.1*(1-nt)*H),ht.y*(1-.16*(1-nt)*H+.08*nt),ht.z*(1+.1*(1-nt)*H)),L.rotation.y=L.userData.baseRotY+Math.sin(K*.021+$*4.3)*.28*H,L.rotation.z=Math.sin(K*.017+$*2.9)*.16*H}for(const L of g.children){const et=L.userData.miniPopAt;if(!et||U.now<et)continue;const K=Math.max(0,Math.min(1,(U.now-et)/300)),H=Math.abs(Math.sin(K*Math.PI*2))*(1-K)*(K<.5?1:.45),$=Math.sin(Math.min(1,K/.18)*Math.PI)*(1-K),nt=L.userData.baseScale,ht=L.userData.basePos;L.scale.set(nt.x*(1+.3*$),nt.y*(1-.34*$+.1*H),nt.z*(1+.3*$)),L.position.y=ht.y+H*.3,L.rotation.y=L.userData.baseRotY+(L.userData.miniIndex%2?-.22:.22)*H}for(const L of g.children){const et=L.userData.stackPackAt;if(!et)continue;const K=U.now-et,H=L.userData.baseScale,$=L.userData.basePos;if(L.userData.miniCandy){const nt=(L.userData.miniLayer||0)*42+L.userData.miniIndex%16*5,ht=Math.max(0,Math.min(1,(K-nt)/245)),F=Math.sin(ht*Math.PI)*(1-ht*.35);L.position.y=$.y+F*.28,L.scale.set(H.x*(1+.22*F),H.y*(1-.24*F),H.z*(1+.22*F)),L.rotation.y=L.userData.baseRotY+(L.userData.miniIndex%2?-.13:.13)*F}else{const nt=Math.max(0,Math.min(1,K/ys)),ht=Math.sin(nt*Math.PI);L.position.y=$.y+ht*.025,L.scale.set(H.x*(1+.035*ht),H.y*(1-.07*ht),H.z*(1+.035*ht))}}for(const L of g.children){const et=L.userData.boxSealAt;if(!et)continue;const K=Math.max(0,Math.min(1,(U.now-et)/Rr)),H=L.userData.baseScale;if(L.userData.boxSealRole==="body"){const $=1-Math.pow(1-K,3),nt=Math.sin(K*Math.PI),ht=L.userData.boxSealHeight||.72,F=L.userData.boxSealBaseY-ht/2;L.position.y=F+ht*Math.max(.025,$)/2,L.scale.set(H.x*(1+.07*nt),H.y*Math.max(.025,$),H.z*(1+.07*nt))}else{const $=Math.max(0,Math.min(1,(K-.16)/.84)),nt=1.5,F=1+(nt+1)*Math.pow($-1,3)+nt*Math.pow($-1,2),it=Math.sin($*Math.PI);L.position.y=L.userData.boxSealBaseY+(1-F)*.72,L.rotation.z=(1-F)*.16,L.scale.set(H.x*(1+.08*it),H.y*(1-.12*it),H.z*(1+.08*it))}}for(const L of U.trucks)if(L.gone&&L.drain>=0){if(U.now<Cr(L)){const et=Math.max(0,Math.min(1,(U.now-Ts(L))/Zh)),K=et*et*(3-2*et);for(const H of g.children)H.userData.closeTruck===L&&(H.position.y=H.userData.closeBaseY-Vc*K)}}else if(L.ate>0){const et=Math.max(0,Math.min(1,(U.now-L.ate)/$h)),K=Math.sin(et*Math.PI);for(const H of g.children){if(H.userData.truck!==L||H.userData.slot!==L.blocks.length-1||H.userData.candyPiece===void 0)continue;const $=H.userData.baseScale;H.scale.set($.x*(1+.045*K),$.y*(1-.08*K),$.z*(1+.045*K))}}}}function Rt(U){for(const L of f.children)L.userData.bridgeTruck&&(L.visible=!0,L.scale.x=1)}const Bt=new Map;function qt(U){if(!Bt.has(U)){const L=U.clone();L.color.multiplyScalar(.46),Bt.set(U,s(L))}return Bt.get(U)}function Qt(U){var L,et;for(const K of f.children){const H=K.userData.truck;if(!H)continue;K.userData.litMat||(K.userData.litMat=K.material);const $=!H.gone&&H.blocks.length>0&&H.drain<0&&!U.flying.some(F=>F.truck===H)&&U.state==="play"&&!U.canTapAny(H),nt=K.userData.tintWhenPacked&&H.gone&&U.now>=Cr(H),ht=H.claim||((et=(L=S.get(H))==null?void 0:L.find(F=>F==null?void 0:F.color))==null?void 0:et.color);K.material=nt?b(In[ht]||"#ff83aa",!0):$?qt(K.userData.litMat):K.userData.litMat,K.scale.y=1,K.visible=!0}}const z=[],Ct=[[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1]];function at(U,L,et,K,H){const[$,nt]=Ct[H],ht=$*K,F=nt*K,it=Math.cos(et||0),Z=Math.sin(et||0);return{x:U+it*ht-Z*F,y:L+Z*ht+it*F}}const At=new WeakMap;let Lt=null;const dt=Math.PI/2;function Vt(U){const L=[],et=Lt===null?0:Math.max(0,Math.min(50,U.now-Lt));Lt=U.now;const K=!e.matches;U.r*2*Wa;const H=U.r*2*1.08,$=H*.72,nt=0,ht=new Map;if(K){const F=U.r*2.3,it=(gt,_)=>(gt/F|0)*65536+(_/F|0),Z=new Map;for(const gt of U.cubes){if(!gt.landed)continue;const _=it(gt.x+5e3,gt.y+5e3);let w=Z.get(_);w||Z.set(_,w=[]),w.push(gt)}const yt=(U.r*2*1.15)**2;for(const gt of U.cubes){if(!gt.landed)continue;const _=(gt.x+5e3)/F|0,w=(gt.y+5e3)/F|0;let D=0;for(let P=-1;P<=1;P++)for(let k=-1;k<=1;k++){const mt=Z.get((_+P)*65536+w+k);if(mt)for(const ft of mt)ft!==gt&&(ft.x-gt.x)**2+(ft.y-gt.y)**2<yt&&D++}ht.set(gt,D)}}for(const F of U.cubes){let it=F.x,Z=F.y,yt=Ar+.025,gt=0,_=At.get(F);_||(_={roll:0,seed:((F.piece??0)*.6180339+(F.born||0)*.0137)%1,landAt:0},At.set(F,_));let w=1,D=0;if(K)if(!F.landed)_.roll+=et*(.011+.005*_.seed);else{_.landAt||(_.landAt=U.now);const P=Math.round(_.roll/dt)*dt;_.roll+=(P-_.roll)*Math.min(1,et*.012);const k=(U.now-_.landAt)/220;k<1&&(D=Math.sin(k*Math.PI)*.22*(1-k*.5));const mt=ht.get(F)||0,ft=Math.max(0,Math.min(1,(mt-3)/3))*(_.seed>.45?1:.25);_.pile=(_.pile||0)+(ft-(_.pile||0))*Math.min(1,et*.01),yt+=_.pile*$*1.05,gt+=_.pile*(_.seed-.5)*1.1;const _t=Math.min(1,Math.abs(F.vrot||0)/5);yt+=Math.abs(Math.sin(U.now*.016+_.seed*40))*(.03+.07*_t),gt+=Math.sin(U.now*.013+_.seed*30)*(.08+.22*_t)}if(!F.landed&&F.src){const P=F.src,k=Math.max(1,Math.hypot(P.x-P.px,P.y-P.py)),ft=1-Math.min(1,Math.hypot(F.x-P.px,F.y-P.py)/k),_t=ft*ft*(3-2*ft),vt=Math.sin(ft*Math.PI),wt=Math.max(0,Math.min(1,(U.now-F.born)/620)),kt=Math.sin(wt*Math.PI),Gt=((F.piece??0)%4-1.5)*.22;if(it-=P.my*Gt*kt,Z+=P.mx*Gt*kt,yt=(Ae+.14)*(1-_t)+(Ar+.025)*_t+vt*.58,gt=vt*.22+Gt*kt*.18,K){const St=Math.max(0,Math.min(1,(U.now-F.born||0)/340)),ae=Math.sin(St*Math.PI);yt+=ae*(.55+.55*_.seed),w=1+.28*ae}}for(let P=0;P<si;P++){const k=at(it,Z,F.rot,nt,P);let mt=k.x,ft=k.y,_t=yt,vt=H,wt=$;if(!F.landed&&F.src&&Number.isInteger(F.slot)&&Number.isInteger(F.piece)){const kt=ge(U,F.src,F.slot,re(U,F.piece,P,!0)),Gt=Math.max(0,Math.min(1,(U.now-F.born-P*14)/360)),St=Gt*Gt*(3-2*Gt),ae=Math.sin(Gt*Math.PI),Xt=ae*(.13+P%3*.025),Zt=P*2.399+Gt*2.2;mt=kt.x+(k.x-kt.x)*St,ft=kt.y+(k.y-kt.y)*St,mt+=Math.cos(Zt)*Xt,ft+=Math.sin(Zt)*Xt,_t=kt.bottom+(yt-kt.bottom)*St+ae*(.16+P%3*.025),vt=kt.size+(H-kt.size)*St,wt=kt.height+($-kt.height)*St}L.push({x:mt,y:ft,bottom:_t,color:F.color,rot:(F.rot||0)+(P-3.5)*.018,tilt:gt+(P%2?-.035:.035),worldSize:vt*w,worldHeight:wt*w,roll:_.roll,squash:D})}}for(const F of U.flying){const it=Math.max(0,Math.min(1,(U.now-F.at)/F.ms)),Z=Qc(F,it);for(let yt=0;yt<si;yt++){const gt=yt*.014,_=Math.max(0,Math.min(1,(it-gt)/(1-gt))),w=_*_*(3-2*_),D=Math.sin(_*Math.PI),P=at(Z.x,Z.y,Z.rot,nt,yt),k=ge(U,F.truck,F.slot,F.piece*si+yt),mt=D*(.08+yt%3*.018),ft=yt*2.399+_*2.6,_t=(F.piece??0)*.6180339%1,vt=K?D*(.38+.3*_t):0,wt=K?1+.3*D:1;L.push({x:P.x+(k.x-P.x)*w-F.truck.my*(yt-3.5)*.018*D+Math.cos(ft)*mt,y:P.y+(k.y-P.y)*w+F.truck.mx*(yt-3.5)*.018*D+Math.sin(ft)*mt,color:F.color,rot:Z.rot+((F.rot1??Z.rot)-Z.rot)*w,bottom:Ar+.025+(k.bottom-(Ar+.025))*w+D*(.24+yt%3*.035)+vt,worldSize:(H+(k.size-H)*w)*wt,worldHeight:($+(k.height-$)*w)*wt,roll:K?(_t<.5?1:-1)*w*Math.PI*2:0,tilt:-D*.12,squash:_>.86?Math.sin((_-.86)/.14*Math.PI)*.08:0})}}for(;z.length<L.length;){const F=new be(M,ee("#ff79ab"));F.castShadow=!1,F.receiveShadow=!0,y.add(F),z.push(F)}for(let F=0;F<z.length;F++){const it=z[F],Z=L[F];if(it.visible=!!Z,!Z)continue;const yt=Z.worldSize??U.r*2*Wa*(Z.sz??1);it.material=ee(In[Z.color]||"#ff79ab");const gt=Z.sizeFactor??1,_=Z.heightFactor??1,w=(Z.worldHeight??wr*Wa*_)*(1-(Z.squash||0));it.scale.set(yt*gt*(1+(Z.squash||0)*.45),w,yt*gt*(1+(Z.squash||0)*.45)),it.position.set(Z.x,Z.bottom+w/2,Z.y),it.rotation.set(Z.tilt||0,Z.rot||0,(Z.tilt||0)*.55+(Z.roll||0),"YXZ")}}let Nt=null,_e="",ue="",Je=0,We=0,wn=0,gn=null;function Li(){const U=i.getBoundingClientRect();!U.width||!U.height||Math.abs(U.width-We)<1&&Math.abs(U.height-wn)<1||(We=U.width,wn=U.height,a.setSize(We,wn,!1),d.aspect=We/wn,d.updateProjectionMatrix(),Nt&&(pt(Nt.bounds),pe(Nt),c()))}function Di(){Je=requestAnimationFrame(Di);const U=t();if(!U){Li(),a.render(o,d);return}const L=U.trucks.map(H=>H.cap).join(",");if(U!==Nt||L!==ue){const H=U===Nt&&!e.matches,$=d.position.clone(),nt=d.quaternion.clone();Nt=U,ue=L,Wt(U),c(),_e="",We=wn=0,Li(),pt(U.bounds),pe(U),gn=H?{fromPos:$,fromQuat:nt,toPos:d.position.clone(),toQuat:d.quaternion.clone(),t0:performance.now()}:null,gn&&(d.position.copy($),d.quaternion.copy(nt))}if(Li(),gn){const H=Math.min(1,(performance.now()-gn.t0)/520),$=H*H*(3-2*H);d.position.lerpVectors(gn.fromPos,gn.toPos,$),d.quaternion.slerpQuaternions(gn.fromQuat,gn.toQuat,$),H>=1&&(gn=null)}for(const H of f.children){const $=H.userData.truck||H.userData.bridgeTruck;if(!$||!$.extra)continue;H.userData.popBase||(H.userData.popBase=H.scale.clone());const nt=e.matches?1:Math.max(0,Math.min(1,(U.now-$.addedAt)/420)),ht=1.7,F=ht+1,it=nt>=1?1:1+F*Math.pow(nt-1,3)+ht*Math.pow(nt-1,2),Z=H.userData.popBase;H.userData.bridgeTruck||H.scale.set(Z.x*Math.max(.01,it),Z.y*Math.max(.01,it),Z.z*Math.max(.01,it))}const et=Ie(U);et!==_e&&(_e=et,Ee(U)),Pt(U),Rt(),Ht(U),Qt(U),Vt(U);const K=U.ring;for(let H=0;H<m.children.length;H++){let $=(H*U.len/m.children.length+(e.matches?0:U.now*.009))%U.len;for(let nt=0;nt<K.length-(U.closed?0:1);nt++){const ht=K[nt],F=K[(nt+1)%K.length],it=Math.hypot(F.x-ht.x,F.y-ht.y);if($<=it){const Z=m.children[H],yt=$/(it||1);Z.position.x=ht.x+(F.x-ht.x)*yt,Z.position.z=ht.y+(F.y-ht.y)*yt,Z.rotation.y=-Math.atan2(F.y-ht.y,F.x-ht.x);break}$-=it}}a.render(o,d)}Je=requestAnimationFrame(Di);const Ks=new Id,Ii=new Ft;function Js(U,L){const et=r.getBoundingClientRect();if(!et.width||!et.height)return null;Ii.x=(U-et.left)/et.width*2-1,Ii.y=-((L-et.top)/et.height)*2+1,Ks.setFromCamera(Ii,d);const K=Ks.intersectObjects([...g.children,...f.children],!0);for(const H of K){const $=H.object.userData&&H.object.userData.truck;if($)return{truck:$,slot:Number.isInteger(H.object.userData.slot)?H.object.userData.slot:$.blocks.length-($.fill>0?0:1)}}return null}function Vn(U,L,et){const K=r.getBoundingClientRect(),H=new G(U,et===void 0?Ae+.92:et,L);return H.project(d),{x:K.left+(H.x+1)/2*K.width,y:K.top+(1-H.y)/2*K.height}}return{pick:Js,project:Vn,dispose(){cancelAnimationFrame(Je),I(f),I(g),I(y),I(p);for(const U of n)U.dispose&&U.dispose();a.dispose(),document.body.classList.remove("has-side-scene"),r.remove()}}}let Ws=1299;const Xc={Default:10,Hard:30,SuperHard:50},qc=[900,1900],Us={Hard:"HARD",SuperHard:"SUPER HARD"},Ns=i=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+i+"</svg>",Pr=i=>'<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">'+i+"</svg>",ti={gear:Ns('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8"/><circle cx="12" cy="12" r="6.6"/>'),home:Ns('<path d="M3 11l9-7 9 7"/><path d="M5.5 10.2V19h13v-8.8"/><path d="M10 19v-5h4v5"/>'),retry:Ns('<polyline points="21 4 21 9.5 15.5 9.5"/><path d="M19.1 14.5A7.6 7.6 0 1 1 17.3 6.6L21 9.5"/>'),Undo:Pr('<path d="M12 14a16 16 0 1 1-2 23" stroke="#78509d" stroke-width="8"/><path d="M12 12a16 16 0 1 1-2 23" stroke="#fff7db" stroke-width="7"/><path d="M5 7v14h14" fill="#fff7db" stroke="#fff7db" stroke-width="3"/><path d="m17 25-5-3v12l5-3m14-6 5-3v12l-5-3" fill="#ffadc3"/><rect x="16" y="22" width="16" height="12" rx="5" fill="#f76f98"/><path d="m22 24 4 8" stroke="#fff1d5" stroke-width="4"/>'),Shuffle:Pr('<path d="M5 12h6c10 0 12 24 22 24h8M33 28l8 8-8 7M5 36h6c10 0 12-24 22-24h8M33 5l8 7-8 7" stroke="#bc567a" stroke-width="7"/><path d="M5 10h6c10 0 12 24 22 24h8M33 26l8 8-8 7M5 34h6c10 0 12-24 22-24h8M33 3l8 7-8 7" stroke="#fff8dc" stroke-width="5"/><circle cx="13" cy="13" r="7" fill="#ffe073"/><circle cx="33" cy="32" r="7" fill="#a1e8ce"/><path d="m10 10 3-1m17 20 3-1" stroke="#fff" stroke-width="3"/>'),ConveyorCapacity:Pr('<rect x="3" y="25" width="42" height="17" rx="8" fill="#426f70"/><rect x="4" y="24" width="40" height="14" rx="7" stroke="#fff2cf" stroke-width="3"/><path d="M11 30h0m9 0h0m9 0h0m9 0h0" stroke="#d7d1c2" stroke-width="5"/><circle cx="13" cy="17" r="8" fill="#ff82a3"/><path d="M9 13h4" stroke="#ffd8de" stroke-width="3"/><path d="M33 7v14m-7-7h14" stroke="#2c9479" stroke-width="8"/><path d="M33 5v14m-7-7h14" stroke="#fff9d7" stroke-width="6"/>'),Capacity:Pr('<path d="m5 19 19-8 19 8v22H5Z" fill="#d18d46"/><path d="M6 20h36v20H6Z" fill="#fff0c5"/><path d="m5 19 19 8 19-8-19-8Z" fill="#ffe2a0"/><path d="M24 27v13" stroke="#e9bd78" stroke-width="2"/><circle cx="16" cy="18" r="6" fill="#ff82a3"/><circle cx="29" cy="19" r="6" fill="#a78bdd"/><path d="M35 5v14m-7-7h14" stroke="#d18d46" stroke-width="8"/><path d="M35 3v14m-7-7h14" stroke="#fffbea" stroke-width="6"/>')},k_=Ns('<path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M16 9a5 5 0 0 1 0 6m2-9a9 9 0 0 1 0 12"/>'),z_=Ns('<path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="m17 9 5 6m0-6-5 6"/>'),ia=[{id:"Undo",l:"Undo",cost:300,free:3,name:"Undo",hint:"Puts the last poured candy back in its box",can:i=>i.canUndo()},{id:"Shuffle",l:"Shuffle",cost:300,free:3,name:"Shuffle",target:!0,hint:"Tap a tray to shuffle its boxes",can:i=>i.trucks.some(t=>!t.gone&&t.blocks.length>1)},{id:"ConveyorCapacity",l:"Belt +1",cost:800,free:3,name:"Bigger Belt",hint:"The belt holds one more box of candy",can:i=>i.state!=="lose"||i.trucks.some(t=>!t.gone&&t.blocks.length&&t.drain<0&&i.counter()+i.tapLoad(t)<=i.slotCount+1)},{id:"Capacity",l:"Tray +1",cost:900,free:3,name:"Extra Tray",hint:"Adds one empty tray next to the belt",can:i=>i.canAddTray()}],mi=Object.fromEntries(ia.map(i=>[i.id,i])),H_=["Undo","ConveyorCapacity","Capacity"];let mn=null;const G_=2100,Br=matchMedia("(prefers-reduced-motion: reduce)"),It=i=>document.getElementById(i);function pl(i){console.error(i);const t=document.createElement("div");t.style.cssText="position:fixed;left:12px;right:12px;bottom:12px;z-index:99;background:#4a1030;border:1px solid #ff7ba3;color:#ffd6e2;padding:12px 14px;border-radius:12px;font:12px/1.5 system-ui;white-space:pre-wrap",t.textContent="Error: "+(i&&i.message?i.message:i),document.body.appendChild(t)}addEventListener("error",i=>pl(i.error||i.message));addEventListener("unhandledrejection",i=>pl(i.reason));const Mn="ls_",Yc=(i,t)=>{const e=+localStorage.getItem(Mn+i);return isFinite(e)&&e?e:t},Yt={get level(){return Math.max(1,Math.min(Ws,Yc("level",1)))},set level(i){localStorage.setItem(Mn+"level",Math.max(1,Math.min(Ws,i)))},get coins(){return Math.max(0,Yc("coins",0))},set coins(i){localStorage.setItem(Mn+"coins",Math.max(0,Math.round(i)))},stars(){try{return JSON.parse(localStorage.getItem(Mn+"stars")||"{}")}catch{return{}}},setStar(i,t){const e=this.stars();(e[i]||0)<t&&(e[i]=t,localStorage.setItem(Mn+"stars",JSON.stringify(e)))},get eager(){return localStorage.getItem(Mn+"eager")!=="0"},set eager(i){localStorage.setItem(Mn+"eager",i?"1":"0")},bst(i){const t=localStorage.getItem(Mn+"b_"+i);return t===null?mi[i].free:Math.max(0,+t)},setBst(i,t){localStorage.setItem(Mn+"b_"+i,Math.max(0,t))}};let Vo=[3];function V_(){const i=[];for(let t=2;t<=Ws;t++){const e=Ys[t],n=Qr[e.Carriers].ColorData;if(/_H|_K_/.test(n)||!jr[e.Spline].Closed)continue;const s=n.split(":").map(r=>r.trim().split(";").filter(Boolean)).filter(r=>r.length>1).length;s>=3&&s<=5&&i.push(t)}i.length&&(Vo=i)}let Fn=!1,Ge=!1,Wo=0,Xo=0,$c=performance.now(),As=!1,Zs=!1,Zc=null,Lr=0;function fs(){const i=Yt.coins.toLocaleString("en-US");It("homeCoins").textContent=i,It("gameCoins").textContent=i}function ml(i){if(!i){Il(0,0);return}Il(It("topbar").offsetHeight,It("toolDock").offsetHeight)}function zn(){Fn=!0,Ge=!1,ml(!1),eh(new jc(Vo[Math.random()*Vo.length|0])),It("home").classList.remove("hide"),It("chrome").classList.add("hide"),It("cards").classList.add("hide");const i=Yt.level;It("homeLv").textContent=i,It("homeArea").textContent="",Xo=performance.now()+800,mn=null,An(null),fs(),gl()}function Hn(i){Fn=!1,Ge=!1,Wo=0,mn=null,An(null),As=!1,Zs=!1,i=Math.max(1,Math.min(Ws,i)),Yt.level=i,It("home").classList.add("hide"),It("chrome").classList.remove("hide"),It("cards").classList.add("hide");const t=Ys[i].Theme,e=It("levelPill");It("hudLv").textContent=i,e.classList.toggle("tagged",!!Us[t]),e.classList.toggle("sh",t==="SuperHard");const n=e.querySelector("em");n.textContent=Us[t]||"",n.hidden=!Us[t],eh(new jc(i)),gi(),ml(!0),fs(),gl(),i===1&&An("Tap the outer box to pour its candy onto the belt",6500)}let Kc=0;function An(i,t){const e=It("hint");if(clearTimeout(Kc),!i){e.hidden=!0;return}e.innerHTML="<span>"+i+"</span>",e.hidden=!1,t&&(Kc=setTimeout(()=>{It("hint").hidden=!0},t))}function $r(i){const t=Yt.bst(i);return t>0?'<span class="n">'+t+"</span>":'<span class="n buy">'+mi[i].cost+"</span>"}function gi(){const i=Be(),t=It("tools");t.innerHTML=ia.map(e=>'<button class="tool'+(mn===e.id?" on":"")+'" data-b="'+e.id+'" aria-label="'+e.name+'" aria-pressed="'+(mn===e.id)+'" title="'+e.name+" — "+e.hint+'">'+ti[e.id]+$r(e.id)+"</button>").join("");for(const e of t.querySelectorAll(".tool")){const n=mi[e.dataset.b];e.disabled=!i||Fn||Yt.bst(n.id)<=0&&Yt.coins<n.cost||mn!==n.id&&!n.can(i),e.onclick=()=>sa(n.id)}}function sa(i){if(!Be()||Fn)return;const e=mi[i];if(mn===i){ne.play("ui"),mn=null,An(null),gi();return}if(Yt.bst(i)<=0)return ne.play("ui"),X_(e);Kh(e)}function Kh(i){const t=Be();if(!i.can(t)){ne.play("blocked"),An("Can't use that right now",1600);return}if(i.target){ne.play("ui"),mn=i.id,An(i.hint),gi();return}let e=!1;if(i.id==="Undo"&&(e=t.undo()),i.id==="ConveyorCapacity"&&(e=t.addConveyorSlot()),i.id==="Capacity"&&(e=t.addTray()),!e){ne.play("blocked"),An("Can't use that right now",1600);return}ne.play(i.id),Yt.setBst(i.id,Yt.bst(i.id)-1),t.state==="play"&&(Ge=!1,It("cards").classList.add("hide")),gi()}function W_(i){const t=Be(),e=mi[mn];let n=!1;if(e.id==="Shuffle"&&(n=t.shuffle(i)),!n){ne.play("blocked"),An("Can't use that on this tray",1400);return}ne.play(e.id),Yt.setBst(e.id,Yt.bst(e.id)-1),mn=null,An(null),gi(),Yo()}function X_(i){const t=!Ge;as(`
    <h2>${i.name.toUpperCase()}</h2>
    <div class="sub">${i.hint}</div>
    <div class="reward"><span class="price"></span>${i.cost.toLocaleString("en-US")}</div>
    <div class="stat"><span>Your coins</span><b>${Yt.coins.toLocaleString("en-US")}</b></div>
    ${Yt.coins>=i.cost?`<div class="stat"><span>Left after buying</span><b>${(Yt.coins-i.cost).toLocaleString("en-US")}</b></div>`:`<div class="stat"><span>Not enough coins</span><b>need ${(i.cost-Yt.coins).toLocaleString("en-US")} more</b></div>`}
    <button class="btn gold" id="aBuy" ${Yt.coins>=i.cost?"":"disabled"}>BUY AND USE</button>
    <button class="btn ghost" id="aNo">No thanks</button>`,"ask"),It("aNo").onclick=()=>{ne.play("ui"),t?It("cards").classList.add("hide"):Zr()},It("aBuy").onclick=()=>{Yt.coins<i.cost||(ne.play("ui"),Yt.coins=Yt.coins-i.cost,Yt.setBst(i.id,Yt.bst(i.id)+1),fs(),t?It("cards").classList.add("hide"):Zr(),Kh(i))}}const qo=["R","O","Y","G","B","P","PNK","LB"];function Xs(i,t=0){let e=t;return[...i].map(n=>n===" "?" ":'<span style="color:'+In[qo[e++%qo.length]]+'">'+n+"</span>").join("")}function as(i,t){t!=="warn jam"&&(Zs=!1);const e=It("cards"),n=/\bres\b/.test(t||"");e.classList.toggle("res",n),e.innerHTML=(n&&/\bwin\b/.test(t)?'<div class="rays"></div>':"")+'<div class="card'+(t?" "+t:"")+'">'+i+"</div>",e.classList.remove("hide")}function q_(i){const t=i.peak/i.slotCount;return t<=.5?3:t<=.75?2:1}function Jh(){ne.play("win");const i=Be(),t=i.lv.Theme,e=q_(i),n=Xc[t]||Xc.Default;Yt.coins=Yt.coins+n,Yt.setStar(i.id,e),i.id+1>Yt.level&&(Yt.level=i.id+1);const s=Dl(i.id+1)!==Dl(i.id),r=["Sweet!","Delicious!","Yummy!","Sugar rush!","Tasty!"][i.id%5];as(`
    ${$o("happy")}
    <div class="lvChip">Level ${i.id}</div>
    <h2 class="bigTitle candy">${Xs("COMPLETE!",3)}</h2>
    <div class="praise">${r}</div>
    <div class="stars"><i>★</i><i>★</i><i>★</i></div>
    <div class="reward"><span class="coin"></span>+${n}</div>
    ${Us[t]?'<p class="rwhy'+(t==="SuperHard"?" sh":"")+'">'+Us[t]+" LEVEL BONUS</p>":""}
    ${s?'<div class="banner">New candy line unlocked!</div>':""}
    <div class="winRow">
      <button class="sq" id="cHome" title="Home" aria-label="Home">${ti.home}</button>
      <button class="sq" id="cReplay" title="Play again" aria-label="Play again">${ti.retry}</button>
      <button class="b3 grow" id="cNext">Next level →</button>
    </div>`,"res win"),Cu(It("cards"),{sound:ne,reduced:Br.matches,palette:[...qo,"LPNK","DPNK"].map(l=>In[l])});const a=It("cards").querySelectorAll(".stars i"),o=e===3?[0,2,1]:e===2?[0,1]:[0];o.forEach((l,c)=>setTimeout(()=>{a[l].isConnected&&(a[l].classList.add("on"),ne.play("star",c))},380+c*230)),setTimeout(()=>{a[0].isConnected&&ne.play("coin")},420+o.length*230),It("cReplay").onclick=()=>{ne.play("ui"),Hn(i.id)},It("cNext").onclick=()=>{ne.play("ui"),Hn(i.id+1)},It("cHome").onclick=()=>{ne.play("ui"),zn()},fs()}function Zr(){ne.play("lose");const i=Be(),t=qc[Math.min(Wo,qc.length-1)],e=Yt.coins>=t,n=H_.map(r=>{const a=mi[r],o=!a.can(i)||Yt.bst(r)<=0&&Yt.coins<a.cost;return'<button class="way" data-b="'+r+'"'+(o?" disabled":"")+' title="'+a.name+" — "+a.hint+'">'+ti[r]+'<span class="l">'+a.l+"</span>"+$r(r)+"</button>"}).join(""),s=i.revivePlan();as(`
    ${$o("sad")}
    <h2 class="bigTitle warm candy">${Xs("Candy jam!",6)}</h2>
    <p class="lead">No tray can take the candy on the belt.</p>
    ${$_(i,s)}
    ${s?'<p class="planNote">Revive clears every <b style="background:'+(In[s]||"#8590a6")+'"></b> candy</p>':""}
    <div class="ways">${n}
      <button class="way" id="cRetry" title="Play again">${ti.retry}<span class="l">Restart</span></button>
    </div>
    <button class="b3" id="cRev" ${e&&s?"":"disabled"}>Revive
      <span class="tag"><span class="price"></span>${t.toLocaleString("en-US")}</span></button>
    <button class="b3 ghost" id="cHome">Home</button>`,"res lose");for(const r of It("cards").querySelectorAll(".way"))r.onclick=()=>sa(r.dataset.b);It("cRetry").onclick=()=>{ne.play("ui"),Hn(i.id)},It("cHome").onclick=()=>{ne.play("ui"),zn()},It("cRev").onclick=()=>{Yt.coins<t||!i.revive()||(ne.play("revive"),Yt.coins=Yt.coins-t,Wo++,Ge=!1,It("cards").classList.add("hide"),fs(),gi())}}function Qh(i){return i.state!=="play"||!i.trucks.some(t=>!t.gone&&t.blocks.length)||i.trucks.some(t=>i.canTapAny(t))||i.pending.length||i.flying.length?!1:i.cubes.length>0&&i.cubes.every(t=>(t.lap||0)>=i.len)}function Y_(i){const t=[];for(let e=0;e<i.cubes.length&&t.length<8;e++)t.push(In[i.cubes[e].color]||"#8590a6");return t.map((e,n)=>'<i style="background:'+e+";animation-delay:"+-n*90+'ms"></i>').join("")}function $_(i,t){const e=[];for(const s of i.cubes)e[e.length-1]!==s.color&&e.push(s.color);const n=e.slice(0,12);return n.length?'<div class="plan">'+n.map((s,r)=>'<i class="'+(s===t?"go":"")+'" style="background:'+(In[s]||"#8590a6")+";animation-delay:"+r*60+'ms"></i>').join("")+"</div>":""}function Z_(i){const t=mi.ConveyorCapacity,e=!t.can(i)||Yt.bst(t.id)<=0&&Yt.coins<t.cost;Zs=!0;const n=mi.Capacity,s=!n.can(i)||Yt.bst(n.id)<=0&&Yt.coins<n.cost;as(`
    ${$o("sad")}
    <h2 class="bigTitle warm candy">${Xs("Belt full!",9)}</h2>
    <p class="lead">No room for the next box yet · ${i.counter()}/${i.slotCount} boxes on the belt</p>
    <div class="jamRail"><div class="jamRun">${Y_(i)}</div><span class="jamStop"></span></div>
    <div class="ways">
      <button class="way" data-b="ConveyorCapacity"${e?" disabled":""}
        title="${t.name} — ${t.hint}">${ti.ConveyorCapacity}<span class="l">${t.l}</span>${$r(t.id)}</button>
      <button class="way" data-b="Capacity"${s?" disabled":""}
        title="${n.name} — ${n.hint}">${ti.Capacity}<span class="l">${n.l}</span>${$r(n.id)}</button>
    </div>
    <button class="b3" id="jWait">I'll wait</button>`,"res jam");for(const r of It("cards").querySelectorAll(".way"))r.onclick=()=>sa(r.dataset.b);It("jWait").onclick=jh}function jh(){Zs=!1,It("cards").classList.add("hide")}function tu(i){const t=Math.min(.04,(i-$c)/1e3);$c=i;const e=Be();if(e){e!==Zc&&(Zc=e,Lr=e.trucks.filter(l=>l.gone).length);const n=e.pending.length+e.cubes.length,s=e.pending.length;if((!Fn||!Br.matches)&&e.step(t,i),!Fn){const l=Math.max(0,s-e.pending.length),c=Math.max(0,n-e.pending.length-e.cubes.length);l&&ne.play("belt",l),c&&ne.play("catch",c),e.trucks.some(d=>d.blocks.some(h=>h.packedAt===e.now))&&ne.play("box");const u=e.trucks.filter(d=>d.gone).length;u>Lr&&ne.play("deliver",u-Lr),Lr=u}const r=It("beltGauge");It("hudBags").textContent=e.counter()+" / "+e.slotCount;const a=e.plaque;if(r.hidden=!1,a){const l=qs.project(a.x,a.y,.35);r.style.left=l.x+"px",r.style.top=l.y+"px"}else r.style.left="50%",r.style.top=It("topbar").offsetHeight+26+"px";const o=e.counter()>e.slotCount*2/3;if(r.classList.toggle("warning",o),r.setAttribute("aria-label","Boxes on belt: "+e.counter()+"/"+e.slotCount+(o?", almost full":"")),Fn){if(!Br.matches&&i>Xo){Xo=i+G_;const l=e.trucks.filter(c=>!c.gone&&c.blocks.length);if(!l.length||e.state!=="play")zn();else{const c=l.filter(u=>e.canTap(u)&&e.counter()<e.slotCount-1);c.length&&e.tap(c[Math.random()*c.length|0])}}}else if(!Ge&&e.state!=="play"){Ge=!0;const l=Br.matches?700:2300;setTimeout(e.state==="win"?Jh:Zr,e.state==="win"?l:450)}else Ge||(Qh(e)?As||(As=!0,Z_(e)):As&&(As=!1,Zs&&jh()))}requestAnimationFrame(tu)}function gl(){const i=Be();if(!i||It("dev").classList.contains("hide"))return;const t=i.lv,e=new Set;for(const n of i.trucks)for(const s of n.blocks)e.add(s.color);It("dev").innerHTML=`
    <h3>Level ${i.id} · ${t.Theme} · Candy Factory</h3>
    <div class="kv">
      <b>Khay</b><span>${i.trucks.length}</span>
      <b>Colours</b><span>${e.size}</span>
      <b>Belt capacity</b><span>${i.slotCount} boxes = ${i.capCubes} candies</span>
      <b>Belt</b><span>${i.closed?"closed loop":"open — Portal"} · ${i.len.toFixed(1)} u</span>
      <b>Candy/box</b><span>${i.perBlock}</span>
    </div>
    <h3 style="margin-top:10px">Carriers #${t.Carriers}</h3>
    <code>${Qr[t.Carriers].ColorData}</code>
    <h3>Splines #${t.Spline}</h3>
    <code>${jr[t.Spline].Spline.replace(/\n/g,"⏎")}</code>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button id="dLv">Go to level…</button>
      <button id="dCoin">+1000 xu</button>
      <button id="dWin">Win now</button>
      <button id="dReset">Reset progress</button>
      <button id="dBst">+9 booster</button>
      <label style="display:flex;gap:5px;align-items:center">
        <input type="checkbox" id="eager"> Eager pickup</label>
    </div>`,It("dLv").onclick=()=>{const n=prompt("Level (1-1299)",i.id);n&&Hn(+n)},It("dCoin").onclick=()=>{Yt.coins=Yt.coins+1e3,fs(),gi()},It("dWin").onclick=()=>{i.state="win"},It("dBst").onclick=()=>{for(const n of ia)Yt.setBst(n.id,Yt.bst(n.id)+9);gi()},It("eager").checked=Yt.eager,It("eager").onchange=n=>{Yt.eager=n.target.checked,n.target.checked},It("dReset").onclick=()=>{confirm("Erase all progress?")&&(xl(),zn())}}const _l=It("stage");Au(_l);_l.style.opacity="0";const qs=B_(It("frame"),()=>Be());window.__ls3=qs;_l.addEventListener("pointerdown",i=>{if(Fn||Ge)return;ne.unlock();const t=qs.pick(i.clientX,i.clientY);if(!t)return;const e=t.truck;if(mn)return W_(e);const n=Be(),s=Math.max(1,n.tapLoad(e))*n.perBlock;if(n.tap(e,t.slot)){ne.play("pour",s);return}if(ne.play("blocked"),n.innerSlot(e,t.slot)){An("Inner box — take the outer box out first",1600);return}n.state==="play"&&!e.gone&&e.blocks.length&&e.drain<0&&An("No room yet — wait for the trays to pack some candy",1600)});It("btnPlay").disabled=!0;It("homeArea").textContent="loading…";It("btnPlay").onclick=()=>{ne.unlock(),ne.play("ui"),Hn(Yt.level)};It("btnSet").innerHTML=ti.gear;It("btnHomeSet").innerHTML=ti.gear;It("btnSet").onclick=()=>{ne.play("ui"),Kr(!0)};It("btnHomeSet").onclick=()=>{ne.unlock(),ne.play("ui"),Kr(!1)};function Kr(i){const t=Ge;Ge=!0;const e=ne.isEnabled();as(`
    <h2 class="bigTitle candy">${Xs("Settings",12)}</h2>
    <label class="swRow"><span>${e?k_:z_} Sound</span>
      <input type="checkbox" id="sSound" ${e?"checked":""}><i></i></label>
    <div class="swRow"><span>Go to level</span>
      <input id="sLevel" type="number" min="1" max="${Yt.level}" value="${i?Be().id:Yt.level}"></div>
    <button class="b3" id="sGo">Play this level</button>
    ${i?'<button class="b3 ghost" id="sRetry">Restart this level</button>':""}
    ${i?'<button class="b3 ghost" id="sHome">Back to home</button>':""}
    <button class="b3 danger" id="sReset">Start over from level 1</button>
    <button class="b3 ghost" id="sClose">Close</button>`,"res set");const n=()=>{Ge=t,It("cards").classList.add("hide")};It("sSound").onchange=()=>{ne.toggle(),Kr(i)},It("sGo").onclick=()=>{const s=Math.max(1,Math.min(Yt.level,Math.round(+It("sLevel").value||1)));ne.play("ui"),Ge=!1,Hn(s)},i&&(It("sRetry").onclick=()=>{ne.play("ui"),Ge=!1,Hn(Be().id)},It("sHome").onclick=()=>{ne.play("ui"),Ge=!1,zn()}),It("sClose").onclick=()=>{ne.play("ui"),n()},It("sReset").onclick=()=>{ne.play("ui"),as(`
      <h2 class="bigTitle warm candy">${Xs("Start over?",15)}</h2>
      <p class="lead">All levels, stars, coins and boosters go back to the start. This can't be undone.</p>
      <button class="b3 danger" id="rYes">Yes, start over</button>
      <button class="b3 ghost" id="rNo">Cancel</button>`,"res set"),It("rNo").onclick=()=>{ne.play("ui"),Kr(i)},It("rYes").onclick=()=>{xl(),Ge=!1,zn()}}}function xl(){for(const i of["level","coins","stars","eager"])localStorage.removeItem(Mn+i);for(const i of ia)localStorage.removeItem(Mn+"b_"+i.id)}It("devBtn").onclick=()=>{It("dev").classList.toggle("hide"),gl()};addEventListener("resize",()=>ml(!Fn));addEventListener("keydown",i=>{i.target.tagName!=="INPUT"&&(i.key==="r"&&!Fn&&Hn(Be().id),i.key==="Escape"&&zn())});window.__ls={show:Hn,home:zn,game:()=>Be(),save:Yt,eager:i=>{const t=It("eager");t&&(t.checked=i)},booster:i=>sa(i),arm:()=>mn,pick:(i,t)=>wu(i,t),bst:i=>Yt.bst(i),lose:()=>{Ge=!0,Zr()},jam:()=>Qh(Be()),laps:()=>{const i=Be();return i.cubes.map(t=>+((t.lap||0)/i.len).toFixed(2))},win:()=>{Ge=!0,Jh()},tapLane:i=>{const t=Be(),e=t.trucks.find(n=>n.lane===i&&!n.gone);return e?t.tap(e):!1},fast:i=>{const t=Be();let e=performance.now();for(let n=0;n<i*60&&t.state==="play";n++)e+=1e3/60,t.step(1/60,e);return t.state},state:()=>{const i=Be();return{level:i.id,state:i.state,counter:i.counter(),cap:i.slotCount,taps:i.taps,peak:i.peak,cubes:i.cubes.length,pending:i.pending.length,perBlock:i.perBlock,coins:Yt.coins,trucks:i.trucks.map(t=>({lane:t.lane,gone:t.gone,fill:t.fill,blocks:t.blocks.map(e=>e.color+(e.hidden&&!e.seen?"?":"")),wants:i.wants(t)}))}}};(async()=>{try{await mu()}catch(t){throw pl(new Error("could not load level data ("+(t.message||t)+")")),t}Ws=Math.max(1,Object.keys(Ys).length),V_(),It("btnPlay").disabled=!1,Yt.eager;const i=new URLSearchParams(location.search);i.get("dev")&&(It("dev").classList.remove("hide"),It("devBtn").hidden=!1),i.has("reset")&&(xl(),i.delete("reset"),history.replaceState(null,"",location.pathname+(i.toString()?"?"+i:"")),zn()),i.get("picktest")&&setTimeout(()=>{const t=Be();if(!t){console.log("PICKTEST: FAIL - khong co game");return}let e=0,n=0;for(const s of t.trucks)for(let r=0;r<s.blocks.length;r++){const a=t.slotPos(s,r,.5),o=qs.project(a.x,a.y),l=qs.pick(o.x,o.y);l&&l.truck===s&&l.slot===r?e++:(n++,console.log("PICKTEST: truot xe lane="+s.lane+" o "+r+" tai "+Math.round(o.x)+","+Math.round(o.y)+" -> "+(l?"lane="+l.truck.lane+" o "+l.slot:"khong trung gi")))}console.log("PICKTEST: "+e+"/"+(e+n)+(n?" FAIL":" PASS"))},900),i.get("level")?Hn(+i.get("level")):zn(),requestAnimationFrame(tu)})();
