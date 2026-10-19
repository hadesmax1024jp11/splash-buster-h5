import * as T from 'three';
import {finish} from './finishes.js';

const edges={wood:finish(0xb28b60,'wood'),metal:finish(0xc3cbd0,'metal'),glass:finish(0xc6e9ec,'ceramic'),ceramic:finish(0xe5d9c2,'stone')};
export function fragment(kind,material){
 if(material.userData.solid)return new T.Mesh(new T.DodecahedronGeometry(.12+Math.random()*.12,0),material);
 if(kind==='wood')return new T.Mesh(new T.BoxGeometry(.08+Math.random()*.1,.035,.25+Math.random()*.3),[edges.wood,edges.wood,material,material,edges.wood,edges.wood]);
 if(kind==='metal')return new T.Mesh(new T.CylinderGeometry(.3,.29,.13+Math.random()*.16,8,1,true,Math.random()*6,.6+Math.random()*.6),material);
 const shape=new T.Shape();shape.moveTo(-.17,-.11);shape.lineTo(.06,-.16);shape.lineTo(.22,.03);shape.lineTo(.04,.2);shape.closePath();
 const geo=new T.ExtrudeGeometry(shape,{depth:kind==='glass'?.018:.045,bevelEnabled:false});
 // Use a different patch of the original ornament on each broken face.
 const uv=geo.attributes.uv,offset=Math.random();for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)+offset,uv.getY(i)+.5);
 geo.center();return new T.Mesh(geo,[material,edges[kind]||edges.ceramic]);
}

export class ImpactEffects{
 constructor(scene){
  this.scene=scene;this.items=[];this.cooldown=0;
  const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'#ffffff');g.addColorStop(.14,'#ffffff');g.addColorStop(.38,'#ffffff88');g.addColorStop(1,'#ffffff00');x.fillStyle=g;x.fillRect(0,0,64,64);this.map=new T.CanvasTexture(c);
  this.light=new T.PointLight(0xffc16b,0,13,2);scene.add(this.light);this.energy=0;
 }
 emit(pos,type,color,size,life,v=new T.Vector3()){
  if(this.items.length>=180)return;
  const dust=type==='dust';
  const m=new T.SpriteMaterial({map:this.map,color,transparent:true,opacity:dust?.24:1,depthWrite:false,blending:dust?T.NormalBlending:T.AdditiveBlending,rotation:Math.random()*Math.PI});
  const mesh=new T.Sprite(m);mesh.position.copy(pos);mesh.scale.setScalar(size);this.scene.add(mesh);
  this.items.push({mesh,size,type,life,max:life,v});
 }
 add(pos,dust=false){
  this.emit(pos,dust?'dust':'spark',dust?0xbeb6ab:0xffd17a,dust?.6:.13,dust?.55:.32,new T.Vector3((Math.random()-.5)*7,Math.random()*5,(Math.random()-.5)*7));
 }
 trail(pos,kind){
  this.emit(pos,'glint',kind==='glass'||kind==='ceramic'?0xbcefff:0xffbc52,.12+Math.random()*.1,.22);
 }
 burst(pos,kind='ceramic',small=false){
  this.light.position.copy(pos);this.energy=Math.max(this.energy,small?7:18);
  for(let i=0;i<(small?5:16);i++){
   const dust=i%5===0,color=kind==='glass'||kind==='ceramic'?0xc5efff:0xffc56e;
   this.emit(pos,dust?'dust':'spark',dust?0xc5b6a1:color,dust?.6:.1+Math.random()*.13,dust?.6:.25+Math.random()*.3,new T.Vector3((Math.random()-.5)*10,1+Math.random()*6,(Math.random()-.5)*10));
  }
 }
 explode(pos,kind){
  if(this.cooldown>0)return false;
  this.cooldown=.22;this.light.position.copy(pos);this.energy=48;
  // Short layered fire bloom illuminates nearby fragments without hiding the target.
  this.emit(pos,'fire',0xff5010,1.15,.46,new T.Vector3(0,.8,0));
  this.emit(pos,'core',0xffd875,.7,.2);
  for(let i=0;i<7;i++){
   const at=new T.Vector3().copy(pos).add(new T.Vector3((Math.random()-.5)*.6,Math.random()*.35,(Math.random()-.5)*.6));
   this.emit(at,'fire',i%2?0xff7619:0xffc53d,.35+Math.random()*.35,.3+Math.random()*.2,new T.Vector3((Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3));
  }
  for(let i=0;i<12;i++)this.emit(pos,'spark',0xffb83f,.1,.35+Math.random()*.3,new T.Vector3((Math.random()-.5)*12,Math.random()*7,(Math.random()-.5)*12));
  return true;
 }
 update(dt){
  this.cooldown=Math.max(0,this.cooldown-dt);this.energy*=Math.exp(-dt*12);this.light.intensity=this.energy;
  for(const p of this.items){
   p.life-=dt;const t=Math.max(0,p.life/p.max),age=1-t;
   p.mesh.position.addScaledVector(p.v,dt);
   if(p.type==='spark')p.v.y-=dt*6;
   p.mesh.material.opacity=t*(p.type==='dust'?.24:p.type==='fire'?.8:1);
   const size=p.size*(p.type==='fire'||p.type==='dust'?1+age*1.7:p.type==='core'?1+age*2:1);
   p.mesh.scale.set(size,p.type==='spark'?size*2.8:size,1);
   if(p.type==='glint')p.mesh.scale.multiplyScalar(.5+Math.sin(age*Math.PI)*.8);
   if(p.life<=0){this.scene.remove(p.mesh);p.mesh.material.dispose();}
  }
  this.items=this.items.filter(p=>p.life>0);
 }
 clear(){for(const p of this.items){this.scene.remove(p.mesh);p.mesh.material.dispose();}this.items=[];this.energy=0;this.cooldown=0;this.light.intensity=0;}
}
