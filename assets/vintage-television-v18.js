// A native 3D console with a CSS3D screen: YouTube remains a real, controllable
// iframe. No copying video pixels across origins or downloading the film.
export const TV_VIDEO_ID='iGqoLtIby9s';
export const TV_LAYOUT=Object.freeze({position:Object.freeze([40.8,0,7.48]),screen:Object.freeze([-.14,1.24,.353]),width:1.02,height:.765});
export function televisionVisible({front,near,area,left,right,top,bottom,hidden,blocked}){
 return !hidden&&!blocked&&front&&near&&area>400&&left<1.05&&right> -1.05&&bottom<1.05&&top> -1.05;
}
// Bring the physical set close enough for the native player controls to read.
export function frameTelevisionCamera(camera,aim,dt){
 if(!window.__vintageTVActive)return false;
 const target=[40.94,1.24,TV_LAYOUT.position[2]-TV_LAYOUT.screen[2]];
 const reduced=typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion:reduce)').matches;
 const alpha=reduced?1:1-Math.exp(-Math.min(dt,.05)*5);
 const position=[40.94,1.52,target[2]-2.35];
 camera.position.x+=(position[0]-camera.position.x)*alpha;
 camera.position.y+=(position[1]-camera.position.y)*alpha;
 camera.position.z+=(position[2]-camera.position.z)*alpha;
 aim.x+=(target[0]-aim.x)*alpha;aim.y+=(target[1]-aim.y)*alpha;aim.z+=(target[2]-aim.z)*alpha;
 camera.lookAt(aim);return true;
}
export function createTelevisionSurface(){
 const element=document.createElement('div');element.className='vintage-tv-screen';
 const button=document.createElement('button');button.type='button';button.className='vintage-tv-watch';
 button.innerHTML='<span class="tv-play" aria-hidden="true">▷</span><span>THE RING</span><small>WATCH THE TAPE</small>';
 button.setAttribute('aria-label','Watch The Ring tape on the vintage television');element.append(button);
 const controls=document.createElement('div');controls.className='vintage-tv-controls';controls.hidden=true;
 const power=document.createElement('button');power.type='button';power.textContent='TV POWER OFF';
 const external=document.createElement('a');external.textContent='OPEN ON YOUTUBE ↗';external.href='https://www.youtube.com/watch?v='+TV_VIDEO_ID;external.target='_blank';external.rel='noopener noreferrer';
 controls.append(power,external);
 let iframe=null,active=false;
 function stop(){
  if(iframe){iframe.src='about:blank';iframe.remove();iframe=null}
  active=false;window.__vintageTVActive=false;button.hidden=false;controls.hidden=true;
 }
 function start(){
  if(active)return;
  window.__iswasTour?.pause('vintage-television');window.__v9Paused=true;window.__vintageTVActive=true;
  iframe=document.createElement('iframe');iframe.title='The Ring — cursed videotape';
  iframe.width='640';iframe.height='480';iframe.referrerPolicy='strict-origin-when-cross-origin';
  iframe.allow='encrypted-media; fullscreen; picture-in-picture';iframe.allowFullscreen=true;
  // Explicit playback stays inside the native YouTube controls; no background autoplay.
  iframe.src='https://www.youtube-nocookie.com/embed/'+TV_VIDEO_ID+'?playsinline=1&rel=0&enablejsapi=1&autoplay=0&origin='+encodeURIComponent(location.origin);
  element.append(iframe);button.hidden=true;controls.hidden=false;active=true;
 }
 button.addEventListener('click',start);power.addEventListener('click',()=>{stop();button.focus({preventScroll:true})});
 const pagehide=()=>stop();window.addEventListener('pagehide',pagehide);
 window.addEventListener('gallery-waypoint',pagehide);window.addEventListener('gallery-tour',pagehide);
 return {element,controls,button,start,stop,get powered(){return active},dispose(){stop();window.removeEventListener('pagehide',pagehide);window.removeEventListener('gallery-waypoint',pagehide);window.removeEventListener('gallery-tour',pagehide);element.remove();controls.remove()}};
}
export function createVintageTelevision({React:R,jsx:J,useFrame,useThree,CSS3DRenderer,CSS3DObject,Scene,Vector3}){
 const h=J.jsx;
 function VintageTelevision(){
  const {camera,size,gl}=useThree();
  const surface=R.useMemo(createTelevisionSurface,[]);
  const world=R.useMemo(()=>new Scene(),[]),renderer=R.useMemo(()=>new CSS3DRenderer(),[]);
  const screen=R.useMemo(()=>{
   const object=new CSS3DObject(surface.element);
   object.position.set(TV_LAYOUT.position[0]-TV_LAYOUT.screen[0],TV_LAYOUT.screen[1],TV_LAYOUT.position[2]-TV_LAYOUT.screen[2]);
   object.rotation.y=Math.PI;object.scale.set(TV_LAYOUT.width/640,TV_LAYOUT.height/480,1);world.add(object);return object;
  },[surface,world]);
  const scratch=R.useMemo(()=>({corner:new Vector3,view:new Vector3,visible:false,width:0,height:0,rect:null}),[]);
  R.useEffect(()=>{
   const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('./vintage-television-v18.css',import.meta.url).href;
   if(!document.querySelector('link[data-vintage-television]')){link.dataset.vintageTelevision='';document.head.append(link)}
   const layer=renderer.domElement;layer.className='vintage-tv-layer';layer.style.cssText='position:fixed;inset:0;z-index:4;pointer-events:none;display:none';
   document.body.append(layer,surface.controls);
   const keyboard=document.createElement('button');keyboard.type='button';keyboard.className='vintage-tv-access sr-only';keyboard.textContent='GO TO THE VINTAGE TELEVISION';keyboard.hidden=true;
   keyboard.onclick=()=>window.dispatchEvent(new CustomEvent('gallery-waypoint',{detail:{id:'cigars'}}));document.body.append(keyboard);
   scratch.keyboard=keyboard;
   const visibility=()=>{if(document.hidden)surface.stop()};document.addEventListener('visibilitychange',visibility);
   const move=()=>{if(surface.powered)surface.stop()};gl.domElement.addEventListener('pointerdown',move);
   return()=>{document.removeEventListener('visibilitychange',visibility);gl.domElement.removeEventListener('pointerdown',move);keyboard.remove();surface.dispose();layer.remove();world.remove(screen)};
  },[renderer,surface,screen,world]);
  useFrame(()=>{
   const root=document.documentElement,review=root.dataset.roomReview;
   const gallery=root.classList.contains('is-gallery');
   const blocked=!!document.querySelector('dialog[open],.gallery-dialog,.tome-back:not(.is-shut),.magic-portal')||root.classList.contains('record-viewing')||(!gallery&&!review);
   if(scratch.keyboard)scratch.keyboard.hidden=!gallery||blocked;
   camera.updateMatrixWorld(true);
   let left=Infinity,right=-Infinity,top=-Infinity,bottom=Infinity,front=true;
   for(let n=0;n<4;n++){
    const x=screen.position.x+(n&1?TV_LAYOUT.width/2:-TV_LAYOUT.width/2),y=screen.position.y+(n&2?TV_LAYOUT.height/2:-TV_LAYOUT.height/2);
    scratch.corner.set(x,y,screen.position.z);scratch.view.copy(scratch.corner).applyMatrix4(camera.matrixWorldInverse);
    if(scratch.view.z>=-camera.near){front=false;break}
    scratch.corner.project(camera);left=Math.min(left,scratch.corner.x);right=Math.max(right,scratch.corner.x);top=Math.max(top,scratch.corner.y);bottom=Math.min(bottom,scratch.corner.y);
   }
   const distance=Math.hypot(camera.position.x-screen.position.x,camera.position.z-screen.position.z);
   const visible=televisionVisible({front:front&&camera.position.z<screen.position.z-.25,near:distance<9&&Math.abs(camera.position.x-screen.position.x)<3.2,area:(right-left)*(top-bottom)*size.width*size.height/4,left,right,top,bottom,hidden:document.hidden,blocked:blocked||(review&&review!=='cigars'&&review!=='tv'&&review!=='room')});
   const layer=renderer.domElement;
   if(review)root.dataset.tvReview=JSON.stringify({visible,front,blocked,distance,near:camera.near,viewZ:scratch.view.z,point:[screen.position.x,screen.position.y,screen.position.z],camera:[camera.position.x,camera.position.y,camera.position.z],area:(right-left)*(top-bottom)*size.width*size.height/4,review,left,right,top,bottom});
   if(!visible){
    layer.style.display='none';surface.element.style.pointerEvents='none';
    if(scratch.visible)surface.stop();scratch.visible=false;return;
   }
   scratch.visible=true;
   if(scratch.width!==size.width||scratch.height!==size.height){
    scratch.width=size.width;scratch.height=size.height;renderer.setSize(size.width,size.height);scratch.rect=gl.domElement.getBoundingClientRect();
   }
   if(scratch.rect){layer.style.left=scratch.rect.left+'px';layer.style.top=scratch.rect.top+'px';layer.style.width=size.width+'px';layer.style.height=size.height+'px'}
   layer.style.display='block';surface.element.style.pointerEvents='auto';surface.controls.hidden=!surface.powered;
   renderer.render(world,camera);
  });
  return h('group',{name:'The Ring · vintage television screen'});
 }
 return {VintageTelevision};
}
