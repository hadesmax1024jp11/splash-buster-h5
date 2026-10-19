import * as T from 'three';
import {RoundedBoxGeometry} from './RoundedBoxGeometry.js';
import {finish,glass,ornament} from './finishes.js';
const cache=new Map();let atlas;
export async function loadKitchenAssets(){atlas=await new T.ImageLoader().loadAsync('kitchen-cans-v5.png');}
const metal=()=>finish(0xdce4e8,'metal'),dark=()=>finish(0x20272b,'metal');
function enamel(color){const m=finish(color);m.roughness=.16;m.clearcoat=1;m.clearcoatRoughness=.1;m.envMapIntensity=1.5;return m;}
function mesh(g,geo,mat,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);g.add(m);return m;}
function box(g,w,h,d,m,x=0,y=0,z=0){return mesh(g,new RoundedBoxGeometry(w,h,d,3,Math.min(w,h,d)*.12),m,x,y,z);}
function cyl(g,r,h,m,y=0,r2=r){return mesh(g,new T.CylinderGeometry(r,r2,h,40),m,0,y);}
function ring(g,r,t,m,y=0){const a=mesh(g,new T.TorusGeometry(r,t,8,40),m,0,y);a.rotation.x=Math.PI/2;return a;}
function handle(g,x,y,r,m){const a=mesh(g,new T.TorusGeometry(r,.035,8,24),m,x,y);return a;}
function label(v){const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');const col=v%5,row=Math.floor(v/5),w=atlas.width/5,h=atlas.height/4;
 // Extract only the printed body panel, leaving the source's lid and background off the 3D label.
 const short=row===1;ctx.drawImage(atlas,col*w+w*.27,row*h+h*(short?.43:.25),w*.46,h*(short?.34:.53),0,0,512,256);
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return new T.MeshPhysicalMaterial({map:t,roughness:.28,clearcoat:.8,metalness:.12});}
export function kitchenItem(type,variant=0){const v=((variant%20)+20)%20,key=type+':'+v;if(cache.has(key)){const t=cache.get(key),r=t.clone(true);r.shardMaterial=t.shardMaterial;return r;}
 const g=new T.Group(),steel=metal(),black=dark(),red=enamel(0xd51c22),teal=enamel(0x258c91),cream=enamel(0xfff0d4);let shard=steel;
 if(type===1||type===11||type===12||type===13){
  const n=type===1?v:(v+(type-10)*5)%20,m=label(n);shard=m;cyl(g,.44,.86,steel);mesh(g,new T.CylinderGeometry(.446,.446,.72,48,1,true),m);for(const y of [-.44,.44]){cyl(g,.46,.035,steel,y);ring(g,.42,.016,steel,y+.02);}for(const r of [.32,.36])ring(g,r,.004,steel,.465);const tab=ring(g,.095,.019,steel,.48);tab.scale.set(.65,1,1.4);tab.position.z=.08;g.userData.design='罐頭 '+(n+1);
 }else if(type===2){shard=ornament(0x215e90);for(let i=0;i<4;i++){cyl(g,.46,.065,cream,-.38+i*.11);ring(g,.44,.014,teal,-.34+i*.11);}const cup=new T.Group();g.add(cup);cyl(cup,.29,.48,shard,.23,.25);cyl(cup,.255,.012,cream,.477);cyl(cup,.22,.013,enamel(0x755038),.485);ring(cup,.273,.018,teal,.48);handle(cup,.32,.23,.13,shard);g.userData.design='花紋杯與瓷盤';
 }else if(type===3){shard=red;box(g,.92,.77,.72,red,0,-.04);box(g,.89,.08,.7,steel,0,.37);for(const z of [-.16,.16]){box(g,.68,.025,.095,black,0,.415,z);box(g,.59,.1,.06,finish(0xc98c42,'wood'),0,.43,z);}for(const x of [-.32,.32])box(g,.13,.1,.45,black,x,-.47);const dial=mesh(g,new T.CylinderGeometry(.11,.11,.05,32),steel,0,-.19,-.38);dial.rotation.x=Math.PI/2;box(g,.045,.32,.025,steel,.3,.04,-.38);box(g,.13,.065,.09,black,.3,-.02,-.41);g.userData.design='紅色烤麵包機';
 }else if(type===41){shard=steel;box(g,.85,.87,.68,steel);box(g,.68,.39,.03,black,0,-.12,-.355);box(g,.76,.065,.48,steel,0,-.43,-.12);for(let i=0;i<7;i++)box(g,.025,.009,.39,black,-.27+i*.09,-.39,-.12);box(g,.35,.09,.43,black,0,.04,-.38);cyl(g,.14,.18,cream,-.27);const dial=mesh(g,new T.CylinderGeometry(.12,.12,.025,32),cream,0,.26,-.36);dial.rotation.x=Math.PI/2;box(g,.012,.09,.015,black,.02,.28,-.38);g.userData.design='不鏽鋼咖啡機';
 }else if(type===14){shard=red;cyl(g,.38,.58,red,-.08,.34);for(const x of [-.43,.43]){handle(g,x,.04,.1,steel);box(g,.15,.06,.12,red,x,.14);}cyl(g,.4,.055,steel,.24);cyl(g,.37,.08,red,.29,.4);cyl(g,.08,.11,black,.38);ring(g,.32,.012,red,.335);g.userData.design='紅色琺瑯燉鍋';
 }else if(type===15){shard=teal;cyl(g,.31,.32,teal,-.32,.39);ring(g,.32,.025,steel,-.15);cyl(g,.28,.52,glass(),.12,.22);cyl(g,.28,.045,black,.4);cyl(g,.08,.08,steel,.46);handle(g,.32,.12,.17,glass());const blade=box(g,.33,.018,.07,steel,0,-.1);blade.rotation.y=.6;const dial=mesh(g,new T.CylinderGeometry(.09,.09,.035,24),steel,0,-.3,-.33);dial.rotation.x=Math.PI/2;g.userData.design='薄荷綠果汁機';
 }else{shard=cream;cyl(g,.38,.65,cream,-.06,.36);cyl(g,.4,.06,steel,.29);cyl(g,.35,.07,black,.34);cyl(g,.09,.08,black,.415);for(const x of [-.43,.43])box(g,.16,.09,.18,black,x,.16);box(g,.23,.2,.04,steel,0,-.16,-.38);box(g,.07,.035,.015,enamel(0xff6b20),0,-.12,-.408);box(g,.07,.035,.015,enamel(0x79bb50),0,-.2,-.408);g.userData.design='電鍋';}
 // Keep silhouettes within the existing collision envelope without changing level stacking.
 g.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(g),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());const s=Math.min(.98/size.x,.98/size.y,.98/size.z);for(const c of g.children){c.position.sub(center).multiplyScalar(s);c.scale.multiplyScalar(s);}g.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true;}});g.shardMaterial=shard;cache.set(key,g);const result=g.clone(true);result.shardMaterial=shard;return result;
}
