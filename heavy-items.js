import * as T from 'three';
import {RoundedBoxGeometry} from './RoundedBoxGeometry.js';
import {finish} from './finishes.js';
const cache=new Map();
export function heavyItem(type){
 if(!cache.has(type)){
  const g=new T.Group(),gold=type===51,m=finish(gold?0xe3b440:0x999c94,gold?'metal':'stone');
  if(gold){m.emissive.setHex(0xb77c15);m.emissiveIntensity=.12;}m.roughness=gold?.3:.9;m.envMapIntensity=gold?1.8:.3;m.bumpScale=gold?.002:.035;m.userData.solid=true;
  const geo=new RoundedBoxGeometry(.96,.94,.92,3,.045);
  if(gold){const p=geo.attributes.position;for(let i=0;i<p.count;i++){const scale=1-.17*(p.getY(i)/.94+.5);p.setX(i,p.getX(i)*scale);p.setZ(i,p.getZ(i)*scale);}geo.computeVertexNormals();}
  const mesh=new T.Mesh(geo,m);mesh.castShadow=mesh.receiveShadow=true;g.add(mesh);
  if(gold){const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d');x.clearRect(0,0,256,128);x.fillStyle='#72501f';x.textAlign='center';x.font='bold 30px Georgia';x.fillText('FINE GOLD',128,42);x.font='bold 40px Georgia';x.fillText('999.9',128,92);const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;const stamp=new T.Mesh(new T.PlaneGeometry(.68,.34),new T.MeshStandardMaterial({map,transparent:true,roughness:.4,depthWrite:false}));stamp.position.set(0,.04,-.425);stamp.rotation.y=Math.PI;g.add(stamp);}
  else{const inset=finish(0x515850,'stone');for(const x of [-.23,.23]){const hole=new T.Mesh(new RoundedBoxGeometry(.25,.025,.5,2,.025),inset);hole.position.set(x,.476,0);g.add(hole);}for(let i=0;i<20;i++){const pore=new T.Mesh(new T.CircleGeometry(.008+(i%3)*.004,5),inset);pore.position.set(Math.sin(i*7.1)*.4,Math.cos(i*2.9)*.4,-.463);pore.rotation.y=Math.PI;g.add(pore);}}
  g.shardMaterial=m;cache.set(type,g);
 }
 const t=cache.get(type),g=t.clone(true);g.shardMaterial=t.shardMaterial;return g;
}
const badges=new Map();
export function damageBadge(remaining){
 if(!badges.has(remaining)){const c=document.createElement('canvas');c.width=256;c.height=80;const x=c.getContext('2d');x.fillStyle='#123c50ee';x.fillRect(0,0,256,80);x.strokeStyle='#ffe297';x.lineWidth=5;x.strokeRect(3,3,250,74);x.fillStyle='#fff0b8';x.textAlign='center';x.font='bold 36px sans-serif';x.fillText(`再擊 ${remaining} 次`,128,53);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;badges.set(remaining,new T.SpriteMaterial({map:t,depthTest:false,depthWrite:false}));}
 const s=new T.Sprite(badges.get(remaining));s.scale.set(.95,.3,1);s.position.y=.78;s.renderOrder=20;return s;
}
