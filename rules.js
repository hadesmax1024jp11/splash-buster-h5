export function playableLevel(original) {
  return {...original, originalAmmo:original.ammo, ammo:original.ammo*2, theme:original.theme||(original.id<=10?'kitchen':'living'), easy:true};
}
export function materialKind(type,theme) {
  if(theme==='living')return type===3||type===41?'wood':'ceramic';
  return type>=11&&type<=16?'glass':type===1?'metal':type===2?'ceramic':'wood';
}
