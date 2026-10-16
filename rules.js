export function playableLevel(original) {
  return {...original, originalAmmo:original.ammo, ammo:Math.max(original.ammo*2,original.id>=11?Math.ceil(original.objects.reduce((n,o)=>n+requiredHits(o.type,original.id),0)*1.3):0), theme:original.theme||(original.id<=10?'kitchen':'living'), easy:true};
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

export function requiredHits(type,level){return level>=11?(level>=31?3:2)+(type===51?1:0):1;}
