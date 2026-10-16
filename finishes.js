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
