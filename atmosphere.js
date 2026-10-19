import * as T from 'three';
export const indoorMoods=[
 {name:'屋頂冷白光',key:0xb6d8ff,power:1.8,fill:0x92bfff,lamp:0xc9e5ff},
 {name:'屋頂暖黃光',key:0xffbd72,power:1.9,fill:0xffb761,lamp:0xffd18a},
 {name:'紫藍霓虹',key:0xb44dff,power:1.6,fill:0x42bfff,lamp:0xd46aff,neon:true},
 {name:'桃紅青綠霓虹',key:0xff56ba,power:1.6,fill:0x42e8cf,lamp:0xff80d1,neon:true}
];
export const skies=[
 {name:'晴日',color:0xa7d9eb,key:0xfff0cf,power:2.5,night:false},
 {name:'夕陽',color:0xe4a28c,key:0xffb171,power:1.8,night:false},
 {name:'夜晚',color:0x172a4c,key:0x98baff,power:.6,night:true}
];
export const weathers=['晴朗','多雲','細雨','飄雪'];
export function chooseAtmosphere(theme,random=Math.random){return theme==='balcony'?{sky:skies[Math.floor(random()*skies.length)],weather:weathers[Math.floor(random()*weathers.length)]}:{mood:indoorMoods[Math.floor(random()*indoorMoods.length)]};}
export function createAtmosphere({scene,room,theme,sun,rim,hemi,renderer,random=Math.random,selection=chooseAtmosphere(theme,random)}){
 const g=new T.Group();g.name='scenery-atmosphere';scene.add(g);let time=0;const moving=[],lights=[],shadowLights=[],geometries=new Set(),materials=new Set();
 const mat=(color,metalness=0,roughness=.55)=>{const m=new T.MeshStandardMaterial({color,metalness,roughness});materials.add(m);return m;};
 room.traverse(o=>{if(o.isMesh&&o.geometry.parameters?.width>=38&&o.geometry.parameters?.height<.5&&o.material.isMeshStandardMaterial){o.material=o.material.clone();o.material.roughness=selection.weather==='細雨'?.18:.34;o.material.metalness=.12;o.receiveShadow=true;}});
 const wood=mat(0x906540),brass=mat(0xb98a46,.8,.25),cream=mat(0xece0c9),green=mat(0x56845e),dark=mat(0x304544),fabric=mat(0xd6bd9a);
 function mesh(geo,m,x,y,z){geometries.add(geo);materials.add(m);const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o;}
 const box=(x,y,z,w,h,d,m=wood)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z);
 const cyl=(x,y,z,r,h,m=cream,r2=r)=>mesh(new T.CylinderGeometry(r,r2,h,20),m,x,y,z);
 function plant(x,y,z,s=1){cyl(x,y+.4*s,z,.42*s,.8*s,mat(0xb47756),.3*s);for(let i=0;i<6;i++){const leaf=mesh(new T.SphereGeometry(.25,10,6),green,x+Math.cos(i*2.4)*.45*s,y+(1+i*.13)*s,z+Math.sin(i*2.4)*.3*s);leaf.scale.set(s*.65,s*1.9,s*.6);leaf.rotation.z=Math.sin(i*2.4)*.6;moving.push({object:leaf,phase:i,angle:leaf.rotation.z});}}
 function books(x,y,z){for(let i=0;i<6;i++)box(x+i*.23,y+.45,z,.19,.7+random()*.3,.5,mat([0xa7624e,0x607f8b,0xd5bd8b][i%3]));}
 function frame(x,y,z){box(x,y,z,2.2,2.7,.1,brass);box(x,y,z-.07,2,2.5,.03,cream);const art=mesh(new T.CircleGeometry(.64,24),mat(0x79938b),x,y,z-.1);art.rotation.y=Math.PI;box(x,y-.65,z-.12,1.6,.16,.03,mat(0xc69567));}
 function lamp(x,y,z,color){const shade=mat(color);shade.emissive.set(color);shade.emissiveIntensity=.38;
  if(theme==='kitchen'){y=5.7;z=12;cyl(x,y+1,z,.025,2,brass);cyl(x,y,z,.35,.6,shade,.65);}
  else if(theme==='bathroom'){y=5;z=16;box(x,y,z,.8,.6,.25,brass);box(x,y,z-.18,.65,.4,.12,shade);}
  else if(theme==='balcony'){y=.2;z=10;box(x,y,z,.55,.8,.55,shade);for(const dx of [-.3,.3])for(const dz of [-.3,.3])box(x+dx,y,z+dz,.04,.9,.04,dark);box(x,y+.48,z,.75,.12,.75,dark);}
  else{cyl(x,y,z,.35,.1,brass);cyl(x,y+1,z,.045,2,brass);cyl(x,y+2,z,.38,.7,shade,.7);y+=1.8;}
  const l=new T.PointLight(color,14,12,2);l.position.set(x,y,z-.4);g.add(l);lights.push({light:l,base:14});}

 // Place all decoration behind or beside the target platform, outside the aiming lane.
 if(theme==='kitchen'){
  for(const x of [-6,6]){box(x,3.1,16,3.5,.14,.8);for(let i=0;i<5;i++){cyl(x-1.3+i*.6,3.48,15.9,.2,.6,mat([0xc59a63,0x8eac94,0xe8d9b7][i%3]));cyl(x-1.3+i*.6,3.81,15.9,.22,.06,brass);}}
  box(-6,1.72,13,.8,.08,1.1);for(let i=0;i<5;i++)mesh(new T.SphereGeometry(.18,12,8),mat(i%2?0xe1ad33:0xc24c35),-6+(i%3)*.25,1.91,13+Math.floor(i/3)*.25);
  for(let i=0;i<4;i++){cyl(-1.5+i*.55,3.2,16,.03,1.4,brass);const pan=cyl(-1.5+i*.55,2.55,15.9,.22,.08,dark);pan.rotation.x=Math.PI/2;}
  plant(5,1.65,13,.55);frame(-5,7.6,16.6);
 }else if(theme==='living'){
  box(5,-.8,12,3.8,1.4,1.8);box(5,0,12,4,.14,2);books(4,0,11.5);plant(6.2,.08,12,.7);frame(-4,5.5,16.5);frame(4,6,16.5);
  for(let i=0;i<4;i++)box(-13+i*.18,4.7,16, .16,6.8,.45,fabric);plant(-5,-1.5,8,1.5);
 }else if(theme==='bedroom'){
  box(5,-.5,12,3.5,2,1.7);for(let i=0;i<3;i++){box(5,-1+i*.55,11.1,3.2,.48,.08,cream);box(5,-1+i*.55,11,.4,.06,.08,brass);}books(4, .55,12);frame(-5,6,16.6);frame(5,6.5,16.6);plant(7,-1.5,9,1.8);
  for(let i=0;i<5;i++)box(-2.8+i*.15,5,16.2,.14,5,.4,fabric);
 }else if(theme==='bathroom'){
  for(let y=2;y<5;y+=1.3){box(-5,y,16,3,.12,1);for(let i=0;i<4;i++){cyl(-6+i*.65,y+.33,15.7,.19,.55,mat(i%2?0x89afaa:0xd8bb86));cyl(-6+i*.65,y+.64,15.7,.1,.08,brass);}}
  box(4,-1.5,7,4,.035,2,fabric);plant(-5,-1.5,10,1.4);frame(0,5.4,16.5);
  for(let i=0;i<3;i++)cyl(8+i*.4,1.65,12.5,.15,.5,cream);
 }else{
  box(-6,-1.1,9,2.2,.7,2);box(-6,-.7,10,2.2,1.8,.18);box(6,-1.1,9,2.2,.7,2);box(6,-.7,10,2.2,1.8,.18);cyl(-4,-.6,10,.8,1.8,wood);plant(-4,.35,10,.65);
  for(const x of [-7,7]){box(x,2.8,12,.08,8,.08,wood);for(let y=0;y<6;y+=.7)box(x,y,12,2,.035,.035,wood);plant(x,-1.5,11,2);}
 }
 let skyColor,weatherGeometry,weatherPositions,weatherCount=0,snow=false;
 if(selection.mood){const m=selection.mood;skyColor=new T.Color(({kitchen:0xf3e6d1,living:0xefd9c1,bedroom:0xe6d9df,bathroom:0xdcebe7})[theme]).lerp(new T.Color(m.key),m.neon?.35:.15);
  // Whole-room overhead illumination: no window/daylight preset or floor lamps.
  sun.color.set(m.key);sun.intensity=m.power;sun.position.set(-4,16,4);sun.target.position.set(0,0,5);sun.target.updateMatrixWorld();
  rim.color.set(m.fill);rim.intensity=m.neon?1.25:.65;rim.position.set(7,11,10);
  hemi.color.set(m.fill);hemi.groundColor.set(m.key).multiplyScalar(.32);hemi.intensity=m.neon?.8:.95;scene.environmentIntensity=m.neon?.16:.27;
  box(0,10,14,38,.22,12,mat(0xe0ddd5));
  for(const side of [-1,1]){const color=side<0?m.key:m.fill,glow=new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:m.neon?2.2:1.4,roughness:.25});materials.add(glow);
   // Long ceiling fixtures plus a visible cove strip across the back wall.
   box(side*5,9.83,12,m.neon?.16:1.2,.08,8,glow);box(side*8,8.8,16.5,15,.12,.18,glow);
   const overhead=new T.SpotLight(color,m.neon?280:240,40,Math.PI/5,.48,1.2);overhead.position.set(side*5,9.6,7);overhead.target.position.set(side*3,-1.5,1);overhead.castShadow=true;overhead.shadow.mapSize.set(1024,1024);overhead.shadow.camera.near=.5;overhead.shadow.camera.far=40;overhead.shadow.bias=-.00015;overhead.shadow.normalBias=.025;overhead.shadow.radius=3;shadowLights.push(overhead);g.add(overhead,overhead.target);lights.push({light:overhead,base:m.neon?280:240});
  }
 }else{const s=selection.sky,w=selection.weather;skyColor=new T.Color(s.color);if(w!=='晴朗')skyColor.lerp(new T.Color(s.night?0x25334a:0x9fadb5),.5);sun.target.position.set(0,0,0);sun.target.updateMatrixWorld();rim.position.set(8,6,8);hemi.groundColor.set(0xb7a28b);sun.color.set(s.key);sun.intensity=s.power*(w==='晴朗'?1:.55);sun.position.set(s.name==='夕陽'?14:-9,s.name==='夕陽'?7:18,-8);rim.color.set(s.night?0x7599e8:0xb2d6e8);rim.intensity=s.night?.45:.7;hemi.color.set(s.night?0x7996c6:0xd9e8f1);hemi.intensity=s.night?.48:.8;scene.environmentIntensity=s.night?.22:.45;
  room.traverse(o=>{if(o.isMesh&&o.material.isMeshBasicMaterial){if(o.geometry.parameters.width===110)o.material.color.copy(skyColor);else o.material.color.lerp(new T.Color(s.night?0x253553:0xa7b5be),s.night?.8:.15);}});
  lamp(-5,-1.4,8,0xffca7d);lamp(5,-1.4,10,0xffca7d);
  // A balcony overhead fixture keeps target silhouettes readable on the table at night.
  const tableLight=new T.SpotLight(s.night?0xc1d6ff:0xffedcf,s.night?220:110,40,Math.PI/5,.35,1.2);
  tableLight.position.set(-2,14,1.5);tableLight.target.position.set(0,0,2.8);tableLight.castShadow=true;
  tableLight.shadow.mapSize.set(1024,1024);tableLight.shadow.camera.near=.5;tableLight.shadow.camera.far=40;
  tableLight.shadow.bias=-.00008;tableLight.shadow.normalBias=.008;tableLight.shadow.radius=2;
  g.add(tableLight,tableLight.target);shadowLights.push(tableLight);

  const disc=mesh(new T.SphereGeometry(s.night?.75:1.25,20,12),new T.MeshBasicMaterial({color:s.night?0xe5edff:0xffd99b}),-10,12,30);disc.castShadow=false;
  if(s.night){const data=[];for(let i=0;i<90;i++)data.push((random()-.5)*65,8+random()*18,35);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(data,3));geometries.add(geo);const m=new T.PointsMaterial({color:0xdce8ff,size:.075});materials.add(m);g.add(new T.Points(geo,m));}
  if(w!=='晴朗')for(let i=0;i<8;i++){const cloud=mesh(new T.SphereGeometry(1,12,8),mat(s.night?0x354359:0xd7dce0),-20+i*6,13+random()*3,29);cloud.scale.set(4, .8,1.5);cloud.castShadow=false;moving.push({object:cloud,cloud:true,phase:i});}
  if(w==='細雨'||w==='飄雪'){snow=w==='飄雪';weatherCount=snow?220:300;weatherPositions=new Float32Array(weatherCount*(snow?3:6));for(let i=0;i<weatherCount;i++){const k=i*(snow?3:6);weatherPositions[k]=(random()-.5)*30;weatherPositions[k+1]=random()*23;weatherPositions[k+2]=7+random()*20;if(!snow){weatherPositions[k+3]=weatherPositions[k]+.12;weatherPositions[k+4]=weatherPositions[k+1]+.55;weatherPositions[k+5]=weatherPositions[k+2];}}weatherGeometry=new T.BufferGeometry();weatherGeometry.setAttribute('position',new T.BufferAttribute(weatherPositions,3));geometries.add(weatherGeometry);const m=snow?new T.PointsMaterial({color:0xffffff,size:.075,transparent:true,opacity:.75,depthWrite:false}):new T.LineBasicMaterial({color:0xc9dfef,transparent:true,opacity:.34,depthWrite:false});materials.add(m);g.add(snow?new T.Points(weatherGeometry,m):new T.LineSegments(weatherGeometry,m));}
 }
 renderer.setClearColor(skyColor);scene.fog=new T.Fog(skyColor,selection.weather==='細雨'?25:55,selection.weather==='細雨'?65:100);
 return {label:selection.mood?selection.mood.name:selection.sky.name+' · '+selection.weather,group:g,update(dt){time+=dt;for(const a of lights)a.light.intensity=a.base*(1+Math.sin(time*.6)*.025);for(const a of moving){if(a.cloud){a.object.position.x+=dt*.18;if(a.object.position.x>26)a.object.position.x=-26;}else a.object.rotation.z=a.angle+Math.sin(time*(theme==='balcony'?1.4:.45)+a.phase)*(theme==='balcony'?.07:.015);}if(weatherPositions){for(let i=0;i<weatherCount;i++){const k=i*(snow?3:6);weatherPositions[k+1]-=dt*(snow?1.3:14);weatherPositions[k]+=dt*(snow?Math.sin(time+i)*.25:-1);if(weatherPositions[k+1]<-1.5)weatherPositions[k+1]=22;if(!snow){weatherPositions[k+3]=weatherPositions[k]+.12;weatherPositions[k+4]=weatherPositions[k+1]+.55;}}weatherGeometry.attributes.position.needsUpdate=true;}},dispose(){scene.remove(g);for(const light of shadowLights)light.shadow.dispose();for(const geo of geometries)geo.dispose();for(const m of materials)m.dispose();}};
}
