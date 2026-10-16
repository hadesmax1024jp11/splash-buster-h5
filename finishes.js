import * as T from 'three';
const maps=new Map();
function surface(kind){
 if(maps.has(kind))return maps.get(kind);
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d'),im=ctx.createImageData(512,512);let seed=781;
 const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return (seed>>>0)/4294967296;};
 for(let y=0;y<512;y++)for(let x=0;x<512;x++){
  let v=220,n=noise();
  if(kind==='wood')v=218+9*Math.sin(x*.11+Math.sin(y*.017)*3)+4*Math.sin(x*.62+y*.007)+n*8;
  else if(kind==='fabric')v=190+(x%4<2?18:0)+(y%4<2?18:0)+n*12;
  else if(kind==='stone')v=224+Math.sin(x*.017+y*.026+Math.sin(y*.033)*3)*8+n*14;
  else if(kind==='metal')v=216+n*18+Math.sin(y*1.8)*12;
  else v=225+n*24;
  const i=(y*512+x)*4;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;
 }
 ctx.putImageData(im,0,0);const tex=new T.CanvasTexture(c);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.anisotropy=4;tex.colorSpace=T.SRGBColorSpace;
 maps.set(kind,tex);return tex;
}
export function finish(color,kind='ceramic'){
 const texture=surface(kind),rough={wood:.52,fabric:.96,stone:.38,metal:.28,paper:.8,ceramic:.22}[kind]??.5;
 return new T.MeshPhysicalMaterial({color,map:texture,bumpMap:texture,bumpScale:kind==='fabric'?.018:kind==='wood'?.004:.0015,roughness:rough,metalness:kind==='metal'?.88:0,clearcoat:kind==='ceramic'?.55:kind==='wood'?.16:0,clearcoatRoughness:.2,sheen:kind==='fabric'?1:0,sheenRoughness:.85,sheenColor:new T.Color(color),envMapIntensity:kind==='metal'?1.3:.65});
}
export function glass(color=0xffffff){return new T.MeshPhysicalMaterial({color,metalness:0,roughness:.09,transparent:true,opacity:.32,depthWrite:false,ior:1.48,clearcoat:1,envMapIntensity:1.8,side:T.DoubleSide});}

const decorated=new Map();
export function ornament(color=0x24567d,kind='porcelain'){
 const key=kind+color;if(decorated.has(key))return decorated.get(key);
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
 const ink='#'+new T.Color(color).getHexString();
 x.fillStyle=kind==='leather'?ink:'#f5efda';x.fillRect(0,0,512,512);
 x.strokeStyle=kind==='leather'?'#d7b86d':ink;x.fillStyle=x.strokeStyle;x.lineWidth=3;
 for(const y of [18,30,482,494]){x.beginPath();x.moveTo(0,y);x.lineTo(512,y);x.stroke();}
 for(let row=0;row<3;row++)for(let col=0;col<4;col++){
  const cx=col*128+64+(row%2?32:0),cy=100+row*145;
  x.save();x.translate(cx,cy);
  for(let petal=0;petal<8;petal++){x.rotate(Math.PI/4);x.beginPath();x.ellipse(0,18,7,18,0,0,Math.PI*2);x.stroke();}
  x.beginPath();x.arc(0,0,6,0,Math.PI*2);x.fill();
  x.beginPath();x.moveTo(0,40);x.bezierCurveTo(45,15,50,55,58,60);x.stroke();x.restore();
 }
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;
 const m=finish(0xffffff,kind==='leather'?'wood':'ceramic');m.map=tex;m.roughness=kind==='leather'?.42:.17;m.clearcoat=1;m.clearcoatRoughness=.12;m.envMapIntensity=1.5;
 decorated.set(key,m);return m;
}
