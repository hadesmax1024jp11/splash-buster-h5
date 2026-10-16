import * as T from 'three';
import {RoundedBoxGeometry} from './RoundedBoxGeometry.js';
import {finish,glass,ornament} from './finishes.js';

const box=(g,x,y,z,w,h,d,m)=>{const o=new T.Mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(w,h,d)*.08),typeof m==='number'?finish(m):m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o;};
const cyl=(g,x,y,z,rt,rb,h,m)=>{const o=new T.Mesh(new T.CylinderGeometry(rt,rb,h,40),typeof m==='number'?finish(m):m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o;};
const ring=(g,x,y,z,r,m)=>{const o=new T.Mesh(new T.TorusGeometry(r,.025,10,40),m);o.position.set(x,y,z);o.rotation.x=Math.PI/2;g.add(o);return o;};
function leaves(g,x,y,z,s=1){for(let i=0;i<7;i++){const o=new T.Mesh(new T.SphereGeometry(.22,12,8),finish(i%2?0x4b8158:0x83a759));o.position.set(x+Math.cos(i*2.4)*s*.18,y+s*(.1+i*.055),z+Math.sin(i*2.4)*s*.18);o.scale.set(s*.6,s*1.6,s*.35);o.rotation.z=Math.sin(i*2.4)*.7;g.add(o);}}
function frontLabel(g,text,color=0x4d6c6d,y=0){const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d');x.fillStyle='#fff7df';x.fillRect(0,0,256,128);x.strokeStyle='#ac9155';x.lineWidth=6;x.strokeRect(9,9,238,110);x.fillStyle='#'+new T.Color(color).getHexString();x.textAlign='center';x.font='bold 30px Georgia';x.fillText(text,128,65);x.font='13px Georgia';x.fillText('MAISON • COLLECTION',128,94);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const o=new T.Mesh(new T.PlaneGeometry(.62,.3),new T.MeshPhysicalMaterial({map:t,roughness:.4,clearcoat:.5}));o.rotation.y=Math.PI;o.position.set(0,y,-.47);g.add(o);}
const templates=new Map();
export function makeExtraItem(type,theme){
 const key=theme+type;if(templates.has(key)){const t=templates.get(key),o=t.clone(true);o.shardMaterial=t.shardMaterial;return o;}
 const g=new T.Group(),gold=finish(0xc2a05a,'metal'),wood=finish(0x9b6b48,'wood');let shard;
 if(theme==='bedroom'){
  if(type===3||type===41){shard=type===3?ornament(0x73546c,'leather'):wood;box(g,0,0,0,.92,.86,.9,shard);box(g,0,.44,0,.96,.08,.94,shard);box(g,0,.07,-.465,.15,.14,.025,gold);for(const x of [-.35,.35])box(g,x,0,-.457,.025,.8,.012,gold);}
  else if(type===2){shard=finish(0xe3c5bb,'fabric');cyl(g,0,-.45,0,.3,.34,.1,gold);cyl(g,0,-.16,0,.045,.045,.5,gold);cyl(g,0,.2,0,.22,.44,.5,shard);ring(g,0,-.05,0,.44,gold);ring(g,0,.45,0,.22,gold);}
  else if(type===11||type===14){shard=ornament(0x355b75);cyl(g,0,-.44,0,.37,.4,.1,gold);const dial=cyl(g,0,0,0,.42,.42,.22,shard);dial.rotation.x=Math.PI/2;const face=new T.Mesh(new T.CircleGeometry(.34,40),finish(0xfff3d4));face.position.z=-.12;face.rotation.y=Math.PI;g.add(face);for(let i=0;i<12;i++){const a=i*Math.PI/6;const tick=box(g,Math.sin(a)*.28,Math.cos(a)*.28,-.135,.02,.045,.014,gold);tick.rotation.z=-a;}box(g,0,.08,-.15,.02,.18,.02,gold);const hand=box(g,.07,0,-.16,.18,.018,.02,gold);hand.rotation.z=.3;}
  else{shard=glass(type%2?0x91bcbd:0xca91ab);shard.opacity=.78;box(g,0,-.08,0,.74,.73,.7,shard);cyl(g,0,.33,0,.12,.12,.13,gold);box(g,0,.44,0,.3,.13,.29,gold);frontLabel(g,'PARFUM',0x70565a,-.07);}
 }else if(theme==='balcony'){
  if(type===3||type===41){shard=wood;box(g,0,0,0,.92,.94,.9,shard);for(let i=0;i<4;i++)box(g,0,-.36+i*.24,-.46,.94,.025,.02,0x634b37);frontLabel(g,type===3?'SEEDS':'GARDEN',0x47604c);}
  else if(type===2){shard=finish(0x598d7b,'metal');cyl(g,0,-.08,0,.29,.34,.65,shard);const spout=cyl(g,-.33,.07,0,.065,.09,.45,shard);spout.rotation.z=-.8;const h=ring(g,.3,.04,0,.21,gold);h.rotation.x=0;cyl(g,0,.27,0,.19,.2,.05,gold);}
  else if(type===14){shard=finish(0x48636a,'metal');box(g,0,0,0,.66,.72,.66,glass(0xffe1ac));for(const x of [-.34,.34])for(const z of [-.34,.34])box(g,x,0,z,.045,.8,.045,shard);box(g,0,-.42,0,.76,.06,.76,shard);cyl(g,0,.42,0,.05,.5,.18,shard);cyl(g,0,-.19,0,.14,.14,.36,finish(0xffdf9c));}
  else{shard=ornament(type%2?0x397f69:0x995936);cyl(g,0,-.19,0,.4,.28,.57,shard);cyl(g,0,.1,0,.36,.36,.03,finish(0x49392a,'wood'));ring(g,0,.1,0,.4,gold);leaves(g,0,.08,0,.75);}
 }else{
  if(type===3||type===41){shard=type===3?finish(0xa9c7c6,'fabric'):finish(0xc39d71,'wood');box(g,0,-.1,0,.9,.75,.9,shard);for(let i=0;i<3;i++)box(g,0,.28+i*.07,0,.82,.065,.8,finish(i%2?0xf3eee0:0xc6dfd9,'fabric'));if(type===41)for(let i=0;i<7;i++)box(g,-.38+i*.125,-.1,-.46,.025,.68,.025,0x876b4b);}
  else if(type===2){shard=ornament(0x3a8190);cyl(g,0,-.09,0,.29,.32,.77,shard);cyl(g,0,.33,0,.07,.07,.15,gold);box(g,.07,.43,0,.32,.06,.08,gold);frontLabel(g,'SOAP',0x3a8190,-.08);}
  else if(type===11||type===14){shard=ornament(type===11?0x568c91:0x82658b);cyl(g,0,-.03,0,.39,.39,.84,shard);cyl(g,0,.42,0,.41,.41,.08,gold);frontLabel(g,'BATH SALT',0x568080);}
  else{shard=glass(type%2?0x8cbdb7:0xd8b78e);shard.opacity=.82;cyl(g,0,-.12,0,.32,.34,.72,shard);cyl(g,0,.3,0,.13,.2,.13,shard);cyl(g,0,.43,0,.14,.14,.15,gold);frontLabel(g,'SPA',0x568080,-.1);}
 }
 g.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true;});g.shardMaterial=shard;templates.set(key,g);const result=g.clone(true);result.shardMaterial=shard;return result;
}

export function makeExtraRoom(theme){
 const g=new T.Group(),wood=finish(0xa37c56,'wood'),chrome=finish(0xbbced0,'metal'),linen=finish(0xeee4d5,'fabric');
 const balcony=theme==='balcony',bath=theme==='bathroom';
 box(g,0,-1.73,balcony?-2:5,balcony?38:70,.35,balcony?28:90,finish(bath?0xc5dcd8:balcony?0xb8a48c:0xb49878,bath?'stone':'wood'));
 if(balcony){const sky=box(g,0,18,45,110,60,.2,new T.MeshBasicMaterial({color:0xc3e4ed}));sky.castShadow=sky.receiveShadow=false;}else box(g,0,5.2,17,38,14,.35,bath?0xdcebe7:0xe6d9df);
 if(balcony){
  // Open railing with distant skyline, rather than a solid interior back wall.
  for(let i=0;i<14;i++){const h=3+(i%4)*1.2,x=-26+i*4;const tower=box(g,x,(h-27)/2,33,2.8,h+23,1,new T.MeshBasicMaterial({color:i%2?0xa3c2cc:0xb0ced5}));tower.castShadow=tower.receiveShadow=false;for(let y=-.5;y<h-2;y+=1.2)for(const dx of [-.7,.7]){const win=box(g,x+dx,y,32.45,.35,.5,.02,new T.MeshBasicMaterial({color:0xd7e8e7}));win.castShadow=win.receiveShadow=false;}}
  box(g,0,.6,12,36,.15,.22,chrome);box(g,0,-1.2,12,36,.15,.22,chrome);
  for(let x=-18;x<=18;x+=1.2)box(g,x,-.3,12,.08,1.9,.08,chrome);
  for(const x of [-9,9]){box(g,x,-.9,9,3.5,1.2,1.5,wood);for(let i=0;i<4;i++)leaves(g,x-1.2+i*.8,-.3,9,3);}
  for(let i=0;i<8;i++){const o=new T.Mesh(new T.SphereGeometry(.13,12,8),new T.MeshStandardMaterial({color:0xffe7ae,emissive:0xffbb55,emissiveIntensity:.7}));o.position.set(-12+i*3.5,7+Math.abs(3.5-i)*.15,12);g.add(o);}
  box(g,0,8.1,12,30,.035,.035,0x4a5b5c);box(g,-12,-.2,5,2.3,.2,2.3,wood);box(g,-12,1,6,2.3,2.3,.2,wood);
 }else if(theme==='bedroom'){
  box(g,-7,-.75,11,8,1.25,7,wood);box(g,-7,0,11,7.7,.6,6.8,linen);box(g,-7,.35,10.1,7.8,.3,4.5,finish(0xa8b8c6,'fabric'));
  box(g,-7,1,14.3,8,3,.35,finish(0x99838c,'fabric'));for(const x of [-9,-5])box(g,x,.5,13,2.8,.45,1.5,linen);
  box(g,10,2.3,14,6,7.6,2.4,wood);for(const x of [8.5,11.5]){box(g,x,2.3,12.75,2.85,7.3,.1,finish(0xd0b99a,'wood'));box(g,x+(x<10?.9:-.9),2.2,12.62,.08,1,.08,chrome);}
  box(g,0,5,16.7,4,4,.2,wood);box(g,0,5,16.54,3.6,3.6,.08,0xa8ccd8);box(g,0,5,16.42,.08,3.6,.06,0xfff0dc);
  box(g,0,-1.5,4,15,.04,12,finish(0xc5aeba,'fabric'));box(g,-13,-.3,12,2.4,2.3,2,wood);cyl(g,-13,1.8,12,.7,1,.9,linen);cyl(g,-13,1.05,12,.06,.06,.7,chrome);
 }else{
  for(let x=-18;x<=18;x+=2){box(g,x,5,16.79,.025,13,.015,0xb5ccc6);box(g,x,-1.54,4,.02,.01,55,0x9fb7b4);}for(let y=-1;y<12;y+=2)box(g,0,y,16.78,38,.025,.015,0xb5ccc6);
  box(g,-8,-.5,11,7.5,2,4,finish(0xf5f3e6));box(g,-8,.53,11,6.8,.07,3.4,finish(0x689a9e));box(g,-8,.57,11,6.5,.035,3.1,glass(0xbee1df));cyl(g,-11,.9,12.5,.08,.08,.8,chrome);
  box(g,6,-.1,13,6,2.7,2.4,finish(0x7eaca6,'wood'));box(g,6,1.32,13,6.2,.18,2.6,finish(0xf5f3e6));cyl(g,6,1.52,13,.95,.7,.32,finish(0xf5f3e6));cyl(g,6,1.7,13.8,.055,.055,.7,chrome);
  box(g,6,4.4,16.65,5.2,4.2,.18,chrome);box(g,6,4.4,16.5,4.9,3.9,.05,new T.MeshPhysicalMaterial({color:0x9ebdc6,metalness:1,roughness:.08,envMapIntensity:1.5}));
  box(g,12,4,14,.1,6,4,glass(0xcbe5e5));cyl(g,12,5,16,.045,.045,5,chrome);cyl(g,12,7.5,15.5,.4,.4,.07,chrome);
  box(g,-14,3.4,16,.08,.08,3,chrome);box(g,-14,2.5,15,1.7,1.8,.12,finish(0xf1d9bb,'fabric'));
 }
 return g;
}
