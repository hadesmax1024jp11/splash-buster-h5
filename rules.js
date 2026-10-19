function shuffled(items,random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function playableLevel(original,random=Math.random) {
  if(original.originalAmmo)return original;
  const rotating=original.id%5===0;
  const tables=original.tables.map(t=>({...t,pos:[...t.pos],rot:[...t.rot],dim:t.dim.map((v,i)=>i<2?v*Math.SQRT1_2:v)}));
  let objects=original.objects.flatMap(o=>Array.from({length:rotating?3:1},()=>({...o,size:[...o.size],rot:[...o.rot],pos:[...o.pos]})));
  if(original.generated){
    for(const table of tables){
      const items=shuffled(objects.filter(o=>o.table===table.id),random);
      const maxW=Math.max(...items.map(o=>o.size[0])),maxD=Math.max(...items.map(o=>o.size[2]));
      const cols=Math.max(1,Math.floor((table.dim[0]-.2)/(maxW+.12))),rows=Math.max(1,Math.floor((table.dim[1]-.2)/(maxD+.12)));
      const dx=(table.dim[0]-.2)/cols,dz=(table.dim[1]-.2)/rows;
      const cells=[];for(let z=0;z<rows;z++)for(let x=0;x<cols;x++)cells.push({x:(x-(cols-1)/2)*dx,z:(z-(rows-1)/2)*dz,height:0,items:[]});
      // Randomly leave some slots empty to vary silhouettes; retain enough supports for tall rotation rounds.
      const active=shuffled(cells,random).slice(0,Math.max(1,Math.min(items.length,Math.ceil(cells.length*(.75+random()*.25)))));
      for(const o of items){const choices=[...active].sort((a,b)=>a.height-b.height);const cell=choices[Math.floor(random()*Math.min(3,choices.length))];cell.items.push(o);cell.height+=o.size[1];}
      for(const cell of active){let y=0;cell.items.sort((a,b)=>b.size[0]*b.size[2]-a.size[0]*a.size[2]);for(const o of cell.items){o.pos=[cell.x,y+o.size[1]/2,cell.z];o.rot=[0,0,0,1];y+=o.size[1];}}
    }
  }
  const previousHits=objects.reduce((n,o)=>n+(original.id>=11?(original.id>=31?3:2)+(o.type===51?1:0):1),0);
  const previousAmmo=Math.max(original.ammo*2*(rotating?3:1),original.id>=11?Math.ceil(previousHits*1.3):0);
  return {...original,objects,tables,rotating,rotationSpeed:rotating?-Math.PI*2/24:0,originalAmmo:original.ammo,ammo:Math.max(1,Math.ceil(previousAmmo/2)),theme:original.theme||(original.id<=10?'kitchen':'living'),easy:false};
}
export function materialKind(type,theme) {
  if(type===51)return 'metal';
  if(type===52)return 'stone';
  if(theme==='bedroom')return type===3||type===41?'wood':type===11||type===14||type===2?'ceramic':'glass';
  if(theme==='balcony')return type===3||type===41?'wood':type===2||type===14?'metal':'ceramic';
  if(theme==='bathroom')return type===3||type===41?'wood':type===2||type===11||type===14?'ceramic':'glass';
  if(theme==='living')return type===3||type===41?'wood':'ceramic';
  return type>=11&&type<=16?'glass':type===1?'metal':type===2?'ceramic':'wood';
}

export function requiredHits(type,level){return level>=6?(level>=31?3:2)+(type===51?1:0):1;}
