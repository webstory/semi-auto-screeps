'use strict';

function ev(c) {
  return (
    c.getActiveBodyparts(WORK) * 100 +
    c.getActiveBodyparts(RANGED_ATTACK) * 150 +
    c.getActiveBodyparts(ATTACK) * 80 +
    c.getActiveBodyparts(HEAL) * 0
  );
}

module.exports = {
  run: (tower) => {
    // Priority 1: Heal creeps
    const patients = tower.room.find(FIND_MY_CREEPS, {
      filter: (c) => (
        (c.hits / c.hitsMax) < 0.95
      )
    }).sort((a,b) => a.hits - b.hits);

    if(patients.length > 0) { return tower.heal(patients[0]); }

    // Priority 2: Repair weaken barricade
    const walls = tower.room.find(FIND_STRUCTURES, {
      filter: (o) => (
        _.some([STRUCTURE_WALL, STRUCTURE_RAMPART], (t) => o.structureType == t) &&
        o.hits < 512000
      )
    }).sort((a,b) => a.hits - b.hits);

    if(walls.length > 0) {
      return tower.repair(walls[0]);
    }

    // Priority 3: Attack any hostile
    const enemies = tower.room.find(FIND_HOSTILE_CREEPS, {
      filter: (c) => c.owner.username != '_Invader' && ev(c) > 0
    }).sort((a,b) => ev(b) - ev(a));
    if(enemies.length > 0) {
      return tower.attack(enemies[Math.floor(Math.random() * Math.min(3, enemies.length))]);
    }
  }
}