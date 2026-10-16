import * as T from 'three';
const palettes={kitchen:{wall:0xf8e8cf,floor:0xf4e6ce,wood:0xce9561,accent:0x79b6a2},living:{wall:0xf3dfc8,floor:0xbb8358,wood:0x8a5842,accent:0x89a99b}};
const mat=(color,roughness=.65)=>new T.MeshStandardMaterial({color,roughness});
function cube(g,x,y,z,w,h,d,color){const m=new T.Mesh(new T.BoxGeometry(w,h,d),typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function cylinder(g,x,y,z,r1,r2,h,color){const m=new T.Mesh(new T.CylinderGeometry(r1,r2,h,24),typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function labelTexture(title,subtitle,color,icon){const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');x.fillStyle=color;x.fillRect(0,0,256,256);x.fillStyle='#fff7df';x.fillRect(8,9,240,238);x.fillStyle=color;x.fillRect(8,9,240,46);x.textAlign='center';x.font='900 30px Arial';x.fillText(title,128,107);x.font='bold 16px Arial';x.fillText(subtitle,128,210);x.font='56px Arial';x.fillText(icon,128,174);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
const templates=new Map();
export function makeItem(type,theme,originalGeometry,originalMaterial){
  const key=theme+type;if(!templates.has(key)){
    const g=new T.Group();let shard;
    if(theme==='kitchen'){
      if(type===1){shard=mat(0xd55c45,.3);cylinder(g,0,0,0,.46,.46,.93,shard);for(const y of [-.46,.46])cylinder(g,0,y,0,.48,.48,.045,0xcbd0cd);const tex=labelTexture('TOMATO','SOUP','#c9533c','●');const label=new T.Mesh(new T.CylinderGeometry(.466,.466,.72,32,1,true),new T.MeshStandardMaterial({map:tex,roughness:.5}));g.add(label);}
      else if(type===2){shard=mat(0x70b6c6,.27);for(let i=0;i<3;i++){const profile=[new T.Vector2(.22,0),new T.Vector2(.28,.04),new T.Vector2(.46,.28),new T.Vector2(.48,.33),new T.Vector2(.43,.33),new T.Vector2(.22,.08)];const m=new T.Mesh(new T.LatheGeometry(profile,24),shard);m.position.y=-.5+i*.23;g.add(m);}}
      else if(type===3||type===41){const isMilk=type===3;shard=mat(isMilk?0xeaf4ea:0xe5b56b);const tex=labelTexture(isMilk?'MILK':'OAT','FRESH & SIMPLE',isMilk?'#568cbd':'#cc8a45',isMilk?'◉':'✦');const front=new T.MeshStandardMaterial({map:tex,roughness:.8});const materials=[shard,shard,shard,shard,front,front];cube(g,0,-.03,0,.92,.9,.92,materials);if(isMilk){cube(g,0,.43,0,.9,.13,.65,0xd9e6ed);cube(g,0,.5,0,.85,.05,.1,0x92b7ce);}else cube(g,0,.45,0,.92,.04,.92,0xe3bd84);}
      else{shard=originalMaterial;const m=new T.Mesh(originalGeometry,originalMaterial);g.add(m);}
    }else{
      const colors=[0xe2a67e,0x91b2b6,0xcfa0a9,0xb5b96e,0x8caaa0,0xc49062];shard=mat(colors[type%colors.length],.3);
      if(type===3){shard=mat(0x9bb5bd);for(let i=0;i<3;i++){const col=[0xc46e54,0x7094a1,0xb5a274][i];cube(g,0,-.33+i*.33,0,.92,.29,.84,0xfff4d7);cube(g,0,-.47+i*.33,0,.98,.04,.9,col);cube(g,0,-.19+i*.33,0,.98,.04,.9,col);cube(g,0,-.33+i*.33,-.43,.98,.3,.055,col);cube(g,-.24,-.33+i*.33,-.465,.035,.19,.02,0xf9da99);}}
      else if(type===41){shard=mat(0xc59669);cube(g,0,0,0,.93,.93,.93,shard);for(let i=0;i<3;i++)cube(g,0,-.3+i*.3,-.475,.94,.025,.012,0x93643f);cube(g,0,.23,-.49,.4,.14,.018,0x79573e);cube(g,0,.23,-.501,.25,.045,.01,0x3f3b32);}
      else if(type===2){shard=mat(0xe9c98e);cylinder(g,0,-.45,0,.32,.36,.1,0xa17c55);cylinder(g,0,-.16,0,.055,.055,.52,0xa17c55);cylinder(g,0,.23,0,.24,.46,.5,shard);cylinder(g,0,.49,0,.23,.23,.02,0xfff5d6);}
      else{const profile=[new T.Vector2(.22,-.5),new T.Vector2(.35,-.45),new T.Vector2(.46,-.2),new T.Vector2(.43,.12),new T.Vector2(.26,.35),new T.Vector2(.24,.5),new T.Vector2(.18,.5),new T.Vector2(.19,.35)];const m=new T.Mesh(new T.LatheGeometry(profile,28),shard);g.add(m);cylinder(g,0,.48,0,.245,.245,.04,0xf8ead1);}
    }
    g.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true;}});g.shardMaterial=shard;templates.set(key,g);
  }
  const template=templates.get(key),result=template.clone(true);result.shardMaterial=template.shardMaterial;return result;
}
function plant(g,x,z){cylinder(g,x,-.97,z,.46,.34,1.05,0xc28b64);for(let i=0;i<7;i++){const leaf=new T.Mesh(new T.SphereGeometry(.55,12,8),mat(i%2?0x63956a:0x87aa70));leaf.scale.set(.55,1.4,.27);leaf.position.set(x+Math.sin(i*2.4)*.4,.05+i*.15,z+Math.cos(i*2.4)*.4);leaf.rotation.z=Math.sin(i*2.4)*.6;g.add(leaf);}}
function window(g,x,z){cube(g,x,5,z,4.6,3.9,.2,0xfdf3df);cube(g,x,5,z-.14,4.15,3.45,.06,0xb5dce2);for(const dx of [-1,1])cube(g,x+dx*1.08,5,z-.2,.1,3.5,.1,0xfdf3df);cube(g,x,5,z-.21,4.2,.1,.1,0xfdf3df);cube(g,x,3,z-.3,5,.18,.6,0xfdf3df);}
export function makeRoom(theme){const p=palettes[theme],g=new T.Group();cube(g,0,-1.73,5,70,.35,90,p.floor);cube(g,0,5.2,17,38,14,.35,p.wall);cube(g,-19,5,3,.3,14,28,p.wall);cube(g,19,5,3,.3,14,28,p.wall);cube(g,0,-1.25,16.75,38,.35,.15,0xfff5e3);
 if(theme==='kitchen'){
  for(let x=-17;x<=17;x+=2)cube(g,x,-1.545,3,.018,.012,55,0xd3c8b7);for(let z=-20;z<=30;z+=2)cube(g,0,-1.545,z,38,.012,.018,0xd3c8b7);
  for(let x=-11;x<=11;x+=3){cube(g,x,-.05,14,2.9,3,2.4,p.accent);cube(g,x,1.5,13.95,3.03,.2,2.6,0xfdf5df);cube(g,x-.65,0,12.76,1.23,2.55,.05,0xa3c6b5);cube(g,x+.65,0,12.76,1.23,2.55,.05,0xa3c6b5);cube(g,x,1.03,12.65,.55,.07,.07,0xaf8759);}
  for(let x=-9;x<=9;x+=3){cube(g,x,5.4,16,2.8,2.5,1.3,0xf6f0dc);cube(g,x,4.7,15.28,.65,.06,.08,0xb18e5f);}
  cube(g,9,2,11,3.2,7,2.5,0xe7edef);cube(g,9,3.1,9.7,3.05,.04,.1,0xa8b9bc);cube(g,7.9,1.4,9.65,.1,1.15,.12,0x8c9c9b);cube(g,7.9,4.1,9.65,.1,.8,.12,0x8c9c9b);
  cube(g,-4,1.64,13.7,2.5,.05,1.5,0x586c72);for(const x of [-4.65,-3.35])for(const z of [13.25,14.1])cylinder(g,x,1.7,z,.35,.35,.035,0x303e45);
  cylinder(g,1.2,1.9,13.3,.5,.5,.55,0xe1aa64);cylinder(g,1.2,2.22,13.3,.53,.53,.08,0xd4954c);cylinder(g,1.2,2.31,13.3,.1,.1,.12,0x5e6962);
  window(g,-13,16.7);plant(g,-12,8);
 }else{
  for(let x=-18;x<=18;x+=1.5)cube(g,x,-1.544,3,.02,.012,60,0x9c6d4e);for(let z=-20;z<=25;z+=4)cube(g,0,-1.543,z,38,.012,.02,0xa97753);
  cube(g,0,-1.51,5,15,.045,13,0xe5cfac);cube(g,0,-1.48,5,13.8,.025,11.8,0xaabdb5);
  cube(g,-7,-.45,11,7,1.3,3.1,0x729a98);cube(g,-7,.6,12.15,7,2,1,0x729a98);for(const x of [-10.25,-3.75])cube(g,x,.1,11,.65,2.05,3.2,0x7aa5a0);for(const x of [-9,-7,-5])cube(g,x,.22,10.7,1.85,.35,2.1,0x91b8ad);for(const x of [-9,-5]){const cushion=cube(g,x,1.05,11.5,1.3,1.1,.4,x===-9?0xe2b97a:0xe8dbc5);cushion.rotation.z=x===-9?-.15:.2;}
  cube(g,10,2.3,14,4.4,7.7,1.3,p.wood);for(const y of [-.8,1.1,3,4.9]){cube(g,10,y,13.22,4.1,.13,.15,0xe5c298);for(let i=0;i<7;i++)cube(g,8.3+i*.48,y+.7,13.2,.32,1.25,.75,[0xc38569,0xa5b5a4,0xe8d6ad,0x76949b][i%4]);}
  window(g,0,16.7);plant(g,6,10);
  cube(g,-12,5,16.65,3.3,3.8,.18,0x9a7453);cube(g,-12,5,16.5,2.9,3.4,.03,0xfff0d3);const art=new T.Mesh(new T.CircleGeometry(1,28),mat(0xd6a373));art.position.set(-12,5,16.44);art.rotation.y=Math.PI;g.add(art);
 }
 return g;
}
