import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {createTelevisionSurface,frameTelevisionCamera,TV_VIDEO_ID,TV_LAYOUT,televisionVisible} from '../assets/vintage-television-v18.js';
import {ROOM_ADDITIONS,ROOM_RUGS,CIGAR_SEATING,cigarChairYaw} from '../assets/hospitality-room-v18.js';
assert.equal(TV_VIDEO_ID,'iGqoLtIby9s');assert.ok(Math.abs(TV_LAYOUT.width/TV_LAYOUT.height-4/3)<1e-12);
assert.equal(TV_LAYOUT.position[0],ROOM_ADDITIONS.cigars.position[0]);
// Both chairs face the actual TV image, remain on the rug, and leave the
// coffee table and console footprints clear (oriented polygon separation).
function rectangle(x,z,w,d,yaw){const c=Math.cos(yaw),s=Math.sin(yaw);return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>[x+c*a*w/2+s*b*d/2,z-s*a*w/2+c*b*d/2])}
function overlaps(a,b){
 for(const poly of [a,b])for(let i=0;i<4;i++){
  const p=poly[i],q=poly[(i+1)%4],axis=[-(q[1]-p[1]),q[0]-p[0]];
  const ranges=[a,b].map(points=>points.map(p=>p[0]*axis[0]+p[1]*axis[1]));
  if(Math.max(...ranges[0])<Math.min(...ranges[1])||Math.max(...ranges[1])<Math.min(...ranges[0]))return false;
 }return true;
}
const table=rectangle(40.8,6.6-CIGAR_SEATING.table[2],1.3,.84,0),consoleBox=rectangle(TV_LAYOUT.position[0],TV_LAYOUT.position[2],1.68,.52,0);
for(const chair of CIGAR_SEATING.chairs){
 const yaw=cigarChairYaw(chair.x,chair.z),x=40.8-chair.x,z=6.6-chair.z;
 const target=[TV_LAYOUT.position[0]-TV_LAYOUT.screen[0]-x,TV_LAYOUT.position[2]-TV_LAYOUT.screen[2]-z];
 const length=Math.hypot(...target),front=[-Math.sin(yaw),-Math.cos(yaw)];
 assert.ok((front[0]*target[0]+front[1]*target[1])/length>.999999,'Every chair points directly at the TV screen');
 const footprint=rectangle(x,z,1.13,1.02,Math.PI+yaw);
 assert.ok(footprint.every(([x,z])=>x>38.45&&x<43.15&&z>4.645&&z<7.595),'Both chairs remain on the cigar rug');
 assert.equal(overlaps(footprint,table),false,'Coffee table stays clear of the turned chairs');
 assert.equal(overlaps(footprint,consoleBox),false,'TV stays clear of the turned chairs');
}
assert.ok(TV_LAYOUT.position[2]+.26<ROOM_ADDITIONS.cigars.position[2]+1.45-.23);
assert.deepEqual(ROOM_RUGS.bar.position,[34,.028,5.45]);
const normal={front:true,near:true,area:500,left:-.1,right:.1,top:.1,bottom:-.1,hidden:false,blocked:false};
assert.equal(televisionVisible(normal),true);
for(const change of [{front:false},{near:false},{area:100},{left:1.1},{right:-1.1},{bottom:1.1},{top:-1.1},{hidden:true},{blocked:true}])assert.equal(televisionVisible({...normal,...change}),false);
let paused=0,events={},created=[];
class Element {
 children=[];hidden=false;handlers={};src='';removed=false;focused=false;
 append(...nodes){this.children.push(...nodes)}
 setAttribute(){}
 addEventListener(name,fn){this.handlers[name]=fn}
 focus(){this.focused=true}
 remove(){this.removed=true}
}
globalThis.document={createElement:tag=>{const el=new Element;el.tagName=tag;created.push(el);return el}};
globalThis.location={origin:'https://example.test'};
globalThis.window={__iswasTour:{pause:reason=>{assert.equal(reason,'vintage-television');paused++}},addEventListener:(name,fn)=>events[name]=fn,removeEventListener:name=>delete events[name]};
const camera={position:{x:40.8,y:2.1,z:2.3},lookAt(){}},aim={x:40.8,y:1,z:6.8};
assert.equal(frameTelevisionCamera(camera,aim,.016),false);
const tv=createTelevisionSurface();assert.equal(tv.powered,false);assert.equal(tv.controls.hidden,true);assert.equal(created.filter(el=>el.tagName==='iframe').length,0,'No YouTube request before deliberate activation');
tv.start();assert.equal(tv.powered,true);assert.equal(paused,1);
for(let n=0;n<250;n++)assert.equal(frameTelevisionCamera(camera,aim,1/60),true);
assert.ok(Math.abs(camera.position.z-(TV_LAYOUT.position[2]-TV_LAYOUT.screen[2]-2.35))<1e-6);
assert.ok(Math.abs(aim.z-(TV_LAYOUT.position[2]-TV_LAYOUT.screen[2]))<1e-6);
const iframe=created.find(el=>el.tagName==='iframe');assert.equal(iframe.title,'The Ring — cursed videotape');
const url=new URL(iframe.src);assert.equal(url.hostname,'www.youtube-nocookie.com');assert.equal(url.pathname,'/embed/iGqoLtIby9s');assert.equal(url.searchParams.get('autoplay'),'0');assert.equal(url.searchParams.get('origin'),'https://example.test');
assert.equal(tv.button.hidden,true);assert.equal(tv.controls.hidden,false);
tv.start();assert.equal(created.filter(el=>el.tagName==='iframe').length,1,'Repeated activation does not stack video/audio');
tv.stop();assert.equal(iframe.src,'about:blank');assert.equal(iframe.removed,true);assert.equal(tv.powered,false);assert.equal(tv.button.hidden,false);assert.equal(frameTelevisionCamera(camera,aim,.016),false);
tv.start();events['gallery-waypoint']();assert.equal(tv.powered,false,'Navigating to another room releases the viewing camera and stops playback');
tv.start();events.pagehide();assert.equal(tv.powered,false,'Leaving the page stops playback');tv.dispose();assert.equal(events.pagehide,undefined);assert.equal(tv.element.removed,true);
const source=readFileSync(new URL('../assets/hospitality-room-v18.js',import.meta.url),'utf8');
assert.match(source,/THE GOLD ROOM/);assert.match(source,/Lloyd · Gold Room bartender/);assert.match(source,/prefers-reduced-motion/);assert.match(source,/document.hidden/);
assert.ok(statSync(new URL('../characters/lloyd/lloyd.webp',import.meta.url)).size<180000);assert.ok(statSync(new URL('../characters/lloyd/lloyd-mobile.webp',import.meta.url)).size<60000);
console.log('PASS: chairs face the actual TV; chairs stay on their rug; table/TV clearance; 4:3 aperture; camera visibility/occlusion gates; no initial YouTube request; exact supplied video; no autoplay; duplicate prevention; stop/pagehide/disposal; Gold Room, Lloyd and reduced-motion hooks; bounded avatar delivery sizes.');
