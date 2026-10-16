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
  this.scene=scene;this.items=[];
  const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'#ffffff');g.addColorStop(.16,'#fff3c9');g.addColorStop(.4,'#ffffff55');g.addColorStop(1,'#ffffff00');x.fillStyle=g;x.fillRect(0,0,64,64);this.map=new T.CanvasTexture(c);
  this.light=new T.PointLight(0xffd99a,0,9,2);scene.add(this.light);this.energy=0;
 }
 add(pos,dust=false){
  if(this.items.length>=96)return;
  const m=new T.SpriteMaterial({map:this.map,color:dust?0xd4c3a8:0xffe4ad,transparent:true,opacity:dust?.22:.85,depthWrite:false,blending:dust?T.NormalBlending:T.AdditiveBlending});
  const mesh=new T.Sprite(m);mesh.position.copy(pos);const size=dust?.55:.1+Math.random()*.16;mesh.scale.setScalar(size);this.scene.add(mesh);
  this.items.push({mesh,size,dust,life:dust?.45:.2+Math.random()*.18,max:dust?.45:.38,v:new T.Vector3((Math.random()-.5)*6,Math.random()*4,(Math.random()-.5)*6)});
 }
 burst(pos,kind='ceramic',small=false){
  this.light.position.copy(pos);this.energy=small?4:13;
  for(let i=0;i<(small?4:12);i++)this.add(pos,kind==='wood'||kind==='stone'||i%4===0);
 }
 update(dt){
  this.energy*=Math.exp(-dt*18);this.light.intensity=this.energy;
  for(const p of this.items){p.life-=dt;p.mesh.position.addScaledVector(p.v,dt);p.v.y-=dt*5;p.mesh.material.opacity=Math.max(0,p.life/p.max)*(p.dust?.22:1);p.mesh.scale.setScalar(p.dust?p.size*(2-p.life/p.max):p.size);if(p.life<=0){this.scene.remove(p.mesh);p.mesh.material.dispose();}}
  this.items=this.items.filter(p=>p.life>0);
 }
 clear(){for(const p of this.items){this.scene.remove(p.mesh);p.mesh.material.dispose();}this.items=[];this.energy=0;this.light.intensity=0;}
}
