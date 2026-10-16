import * as C from './cannon-es.js';
import {playableLevel,materialKind} from './rules.js?v=rooms-20261016';
export class GamePhysics {
  constructor(level, settings, onClear=()=>{}, onImpact=()=>{}) {
    if(!level.originalAmmo)level=playableLevel(level);this.onImpact=onImpact;
    this.level=level;this.settings=settings;this.onClear=onClear;this.time=0;this.shots=0;this.lastShot=-99;this.cleared=0;this.blocks=[];this.balls=[];this.pending=new Map();
    this.world=new C.World({gravity:new C.Vec3(0,settings.physics.gravityY,0),allowSleep:true});
    this.world.broadphase=new C.SAPBroadphase(this.world);this.world.solver.iterations=25;this.world.solver.tolerance=.0001;
    this.world.defaultContactMaterial.friction=.6;this.world.defaultContactMaterial.restitution=0;this.world.defaultContactMaterial.contactEquationStiffness=1e8;
    const floor=new C.Body({mass:0,shape:new C.Plane()});floor.quaternion.setFromEuler(-Math.PI/2,0,0);floor.position.y=-1.55;floor.ground=true;this.world.addBody(floor);
    this.tables=level.tables.map(t=>{const b=new C.Body({mass:0,shape:new C.Box(new C.Vec3(t.dim[0]/2,.175,t.dim[1]/2)),position:new C.Vec3(t.pos[0],t.pos[1]-.175,t.pos[2]),quaternion:new C.Quaternion(...t.rot)});this.world.addBody(b);return {data:t,body:b};});
    for(const data of level.objects){
      const table=this.tables.find(t=>t.data.id===data.table),q=new C.Quaternion(...data.rot),pos=new C.Vec3(...data.pos);table.body.quaternion.vmult(pos,pos);pos.vadd(new C.Vec3(...table.data.pos),pos);table.body.quaternion.mult(q,q);
      const volume=Math.max(1,Math.round(data.size.reduce((a,b)=>a*b,1)));const profile=settings.profiles.objects.find(p=>p.objectType===data.type);const masses=profile?.mass.massByVolume||[1];const mass=(masses[Math.min(volume-1,masses.length-1)]||1)*(level.massScale||1);
      const s=data.size.map(Math.abs);let shape;
      if([1,2,11,12,13,14,15,16].includes(data.type))shape=new C.Cylinder(s[0]*(data.type===2?.3:.485),s[0]*.485,s[1]*.98,12);
      else shape=new C.Box(new C.Vec3(s[0]*.495,s[1]*.495,s[2]*.495));
      const body=new C.Body({mass,shape,position:pos,quaternion:q,linearDamping:0,angularDamping:.05,allowSleep:true,sleepSpeedLimit:.15,sleepTimeLimit:.8});
      const toughness=(level.durabilityTier||0)+(materialKind(data.type,level.theme)==='metal'?2:1);
      const block={data,body,removed:false,hits:0,requiredHits:toughness,table};body.block=block;body.sleep();this.world.addBody(body);this.blocks.push(block);
      body.addEventListener('collide',e=>{
        if(block.removed||this.shots===0)return;
        const speed=Math.abs(e.contact.getImpactVelocityAlongNormal()),kind=materialKind(data.type,level.theme);
        if(e.body.ground){this.onImpact(block,'floor',speed);this.pending.set(block,'fall');return;}
        if(speed>2.5&&this.time-(block.lastImpact??-1)>.12){block.lastImpact=this.time;this.onImpact(block,'hit',speed);}
        if(e.body.projectile&&block.lastBall!==e.body.id){
          block.lastBall=e.body.id;block.hits++;body.wakeUp();
          if(!e.body.boosted&&speed>=settings.physics.destroyVelocityThreshold){e.body.boosted=true;const d=e.body.velocity.clone();d.normalize();const impulse=speed*e.body.mass*body.mass/(e.body.mass+body.mass)*(settings.physics.ballFirstHitBoomPower-1);body.applyImpulse(d.scale(impulse));}
          if(block.hits>=block.requiredHits)this.pending.set(block,kind);
        }else if(speed>(kind==='metal'?13:kind==='wood'?8:5.5)*(1+(level.massScale-1||0)*.7))this.pending.set(block,kind);
      });
    }
  }
  shoot(origin,direction){
    if(this.shots>=this.level.ammo||this.time-this.lastShot<.1)return null;
    this.lastShot=this.time;this.shots++;for(const block of this.blocks)if(!block.removed)block.body.wakeUp();
    const b=new C.Body({mass:this.settings.physics.projectileMass,shape:new C.Sphere(.3),position:new C.Vec3(...origin),linearDamping:0,angularDamping:.05});
    const d=new C.Vec3(...direction);d.normalize();d.scale(this.settings.physics.projectileInitialSpeed,b.velocity);b.projectile=true;
    this.world.addBody(b);const ball={body:b,born:this.time};this.balls.push(ball);return ball;
  }
  remove(block,reason){if(block.removed)return;block.removed=true;this.cleared++;this.world.removeBody(block.body);this.onClear(block,reason);for(const n of this.blocks){if(!n.removed&&n.body.position.distanceTo(block.body.position)<2.5)n.body.wakeUp();}}
  step(dt){
    const steps=Math.max(1,Math.ceil(Math.min(dt,.05)*240)),h=Math.min(dt,.05)/steps;
    for(let i=0;i<steps;i++){this.time+=h;this.world.step(h);for(const [b,r] of this.pending)this.remove(b,r);this.pending.clear();
      if(this.shots)for(const b of this.blocks)if(!b.removed&&(b.body.position.y<-.8||Math.abs(b.body.position.x)>25||Math.abs(b.body.position.z)>30))this.remove(b,'fall');
    }
    for(const b of this.balls)if(this.time-b.born>3&&!b.removed){b.removed=true;this.world.removeBody(b.body);}
    this.balls=this.balls.filter(b=>!b.removed);
  }
  get remaining(){return this.blocks.length-this.cleared;}
  get result(){if(this.remaining===0)return 'win';if(this.shots>=this.level.ammo&&this.time-this.lastShot>5&&this.blocks.every(b=>b.removed||b.body.velocity.length()<.5))return 'lose';return null;}
}
