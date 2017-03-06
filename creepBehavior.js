'use strict';

/**
 * Common actions
 */
function sayStatus(code) {
  switch(code) {
    case OK: return "ok";
    case ERR_NOT_OWNER: return "not mine";
    case ERR_NO_PATH: return "no path";
    case ERR_BUSY: return "busy";
    case ERR_NOT_FOUND: return "not found";
    case ERR_NOT_ENOUGH_ENERGY: return "hungry";
    case ERR_NOT_ENOUGH_RESOURCES: return "res need";
    case ERR_INVALID_TARGET: return "where?";
    case ERR_FULL: return "full";
    case ERR_NOT_IN_RANGE: return "going";
    case ERR_TIRED: return "tired";
    case ERR_NO_BODYPART: return "no part";
    case ERR_RCL_NOT_ENOUGH: return 'week RCL';
    case ERR_GCL_NOT_ENOUGH: return 'no GCL';
    default: return code;
  }
}

function canWork(creep) {
  const ctx = creep.memory;

  if(ctx.working && _.sum(creep.carry) <= 0) {
    return false;
  } else if(!ctx.working && _.sum(creep.carry) >= creep.carryCapacity) {
    return true;
  } else {
    return ctx.working;
  }
}

function recharge(creep) {
  const ctx = creep.memory;
  let status = ERR_INVALID_TARGET;

  if(ctx.target) {
    const target = Game.getObjectById(ctx.target);

    if(!target ||
      ((target instanceof Resource) && target.amount < 50) ||
      ((target instanceof Structure) &&
        (!_.some([STRUCTURE_LINK, STRUCTURE_STORAGE, STRUCTURE_CONTAINER], (t) => target.structureType == t)) ||
        (target.structureType == STRUCTURE_LINK && target.energy <= 0) ||
        (target.structureType == STRUCTURE_STORAGE && target.store && target.store[RESOURCE_ENERGY] <= 0) ||
        (target.structureType == STRUCTURE_CONTAINER && target.store && target.store[RESOURCE_ENERGY] <= 0)
      )
    ) {
      ctx.target = null;
      return status;
    }

    if(creep.pos.isNearTo(target)) {
      status = creep.withdraw(target, RESOURCE_ENERGY);

      switch(status) {
        case OK: return status;
        case ERR_FULL: ctx.target = null; return status;
      }

      status = creep.pickup(target);

      switch(status) {
        case OK: return status;
        case ERR_FULL: ctx.target = null; return status;
      }

      status = creep.harvest(target);

      switch(status) {
        case OK: return status;
        case ERR_FULL: ctx.target = null; return status;
        case ERR_INVALID_TARGET: ctx.target = null; return status;
        default: ctx.target = null; return status;
      }
    } else {
      status = creep.moveTo(target, {reusePath:15});
      if(status == ERR_NO_PATH) {
        ctx.target = null;
        return status;
      } else {
        return status;
      }
    }
  }

  const dropped = creep.room.find(FIND_DROPPED_ENERGY, {
    filter: (o) => o.amount >= 50 && creep.pos.inRangeTo(o, 5)
  });

  if(dropped.length > 0) {
    ctx.target = creep.pos.findClosestByRange(dropped, { ignoreCreeps: true }).id;
    return status;
  }

  const containers = creep.room.find(FIND_STRUCTURES, {
    filter: (s) => (
      (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0) ||
      (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0) ||
      (s.structureType == STRUCTURE_LINK && s.energy > 0)
    )
  });

  if(containers.length > 0) {
    const target = creep.pos.findClosestByPath(containers, { ignoreCreeps: true });
    if(target) {
      ctx.target = target.id;
    }

    return status;
  }

  const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, { ignoreCreeps: true });

  ctx.target = source ? source.id : null;
  return status;
}


////////////////////
// Harvester actions
////////////////////
function harvest(creep) {
  const ctx = creep.memory;

  const sources = creep.room.find(FIND_SOURCES, {
    filter: (s) => {
      return (
        (creep.pos.getRangeTo(s) < 2 && creep.memory.affinityTime > 0) ||
        (s.pos.findInRange(FIND_MY_CREEPS, 1, {
          filter: (c) => c.memory.role == 'harvester' && c.name != creep.name
        }).length < 1)
      );
    }
  });

  const source = creep.pos.findClosestByRange(sources);

  if(source) {
    ctx.target = source.id;
  }

  const target = Game.getObjectById(ctx.target);
  const status = creep.harvest(target);

  switch(status) {
    case OK: creep.memory.affinityTime = 100; return status;
    case ERR_NOT_IN_RANGE: return creep.moveTo(source, {reusePath:15});
    case ERR_INVALID_TARGET: ctx.target = null; return status;
    case ERR_FULL: ctx.target = null; return status;
    case ERR_NOT_ENOUGH_ENERGY: return status;
    default: creep.say(sayStatus(status)); return status;
  }
}

function chargeHarvester(creep) {
  const structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        (_.some([STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER], (o) => s.structureType == o) && s.my != false && s.energy < s.energyCapacity)
        || (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity)
        || (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity)
      );
    }
  });
  const status = creep.transfer(structure, RESOURCE_ENERGY);

  if(status == ERR_NOT_IN_RANGE) {
    return creep.moveTo(structure, {reusePath:15});
  }
  if(status == ERR_INVALID_TARGET) {
    return creep.drop(RESOURCE_ENERGY);
  }

  return status;
}

////////////////////
// Builder actions
////////////////////
function findBuildTarget(creep) {
  // Priority 1: Urgent repairs
  // Includes Walls and Ramparts, Prevent total destruction.
  const toUrgentRepairs = creep.room.find(FIND_STRUCTURES, {
    filter: o => ( o.hits < Math.min(100000, o.hitsMax * 0.2) )
  });

  if(toUrgentRepairs.length > 0) {
    const toUrgentRepair = creep.pos.findClosestByPath(toUrgentRepairs);
    if(toUrgentRepair) {
      return toUrgentRepair.id;
    }
  }

  // Priority 2: Build
  const toBuild = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
  if(toBuild) {
    return toBuild.id;
  }

  // Priority 3: Repair others
  const toRepairs = creep.room.find(FIND_STRUCTURES, {
    filter: o => (
      (!_.some([STRUCTURE_WALL, STRUCTURE_RAMPART], (t) => o.structureType == t) && o.my != false) &&
      (
        (o.hits < o.hitsMax && creep.pos.inRangeTo(o, 5)) ||
        ((o.hits / o.hitsMax) < 0.8)
      )
    )
  });

  if(toRepairs.length > 0) {
    const toRepair = creep.pos.findClosestByPath(toRepairs);

    if(toRepair) {
      return toRepair.id;
    }
  }

  return null;
}

function doBuild(creep, noRepair) {
  const ctx = creep.memory;

  if(!ctx.target) {
    return ERR_INVALID_TARGET;
  }

  const target = Game.getObjectById(ctx.target);
  let status = ERR_INVALID_TARGET;

  if(!target) {
    ctx.target = null;
    return ERR_INVALID_TARGET;
  }

  if(creep.pos.inRangeTo(target, 3)) {
    const t = creep.room.lookAt(target);
    for(let i in t) {
      const targetType = t[i].type;
      if(targetType == LOOK_CONSTRUCTION_SITES) {
        status = creep.build(target);
        if(status == OK) { break; }
      } else if(!noRepair && targetType == LOOK_STRUCTURES) {
        status = creep.repair(target);
        if(status == OK) { break; }
      }
    }

    if(status != OK) {
      ctx.target = null;
      return status;
    }
  } else {
    status = creep.moveTo(target, {reusePath:15});
    if(status == ERR_NO_PATH) {
      ctx.target = null;
      return ERR_INVALID_TARGET;
    } else {
      return status;
    }
  }
}


////////////////////
// Collector actions
////////////////////
function collect(creep) {
  // Priority 1: Mining depot
  const containers = creep.room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        (s.structureType == STRUCTURE_CONTAINER
        && s.store[RESOURCE_ENERGY] >= (creep.carryCapacity - creep.carry.energy)
        && s.pos.findInRange(FIND_SOURCES, 3).length > 0)
      );
    }
  }).sort((a,b) => (b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]));

  if(containers.length > 0) {
    const source = containers[0];
    const status = creep.withdraw(source, RESOURCE_ENERGY);

    if(status == ERR_NOT_IN_RANGE) {
      return creep.moveTo(source, {reusePath:15});
    }

    return status;
  }

  // Priority 2: Dropped resource
  const drops = creep.room.find(FIND_DROPPED_ENERGY, {
    filter: (o) => true
  });

  const drop = creep.pos.findClosestByRange(drops);
  if(drop) {
    const status = creep.pickup(drop);
    if(status == ERR_NOT_IN_RANGE) {
      return creep.moveTo(drop, {reusePath:15});
    }

    return status;
  }


  return ERR_INVALID_TARGET;
}

function deliverToStorage(creep) {
  const ctx = creep.memory;
  let status = ERR_INVALID_TARGET;
  let target = Game.getObjectById(ctx.target);

  const storages = creep.room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        ((_.some([STRUCTURE_STORAGE], (o) => s.structureType == o)
          && s.store[RESOURCE_ENERGY] < s.storeCapacity - creep.carry.energy))
      );
    }
  });

  if(storages.length > 0) {
    target = creep.pos.findClosestByPath(storages);
    if(target) {
      ctx.target = target.id;
    }
  }

  status = creep.transfer(target, RESOURCE_ENERGY);

  switch(status) {
    case OK: return status;
    case ERR_NOT_IN_RANGE: return creep.moveTo(target, {reusePath:30});
    case ERR_INVALID_TARGET: ctx.target = null; return status;
    case ERR_NOT_ENOUGH_ENERGY: ctx.target = null; return status;
    default: creep.say(sayStatus(status)); return status;
  }
}

///////////////////////
// Deployer actions
///////////////////////
function withdrawFromStorage(creep) {
  // Priority 1: Storage
  const storages = creep.room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        (s.structureType == STRUCTURE_STORAGE
        && s.store[RESOURCE_ENERGY] >= creep.carryCapacity)
      );
    }
  });

  if(storages.length > 0) {
    const source = creep.pos.findClosestByPath(storages, { ignoreCreeps: true });
    const status = creep.withdraw(source, RESOURCE_ENERGY);

    if(status == ERR_NOT_IN_RANGE) {
      return creep.moveTo(source, {reusePath:15});
    }

    return status;
  }

  // Prority 2: Mining depot(Act as collector)
  const containers = creep.room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        (s.structureType == STRUCTURE_CONTAINER
        && s.store[RESOURCE_ENERGY] >= (creep.carryCapacity - creep.carry.energy)
        && s.pos.findInRange(FIND_SOURCES, 3).length > 0)
      );
    }
  }).sort((a,b) => (b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]));

  if(containers.length > 0) {
    const source = containers[0];
    const status = creep.withdraw(source, RESOURCE_ENERGY);

    if(status == ERR_NOT_IN_RANGE) {
      return creep.moveTo(source, {reusePath:15});
    }

    return status;
  }

  return ERR_INVALID_TARGET;
}

function findDeliverTarget(creep) {
  // Priority 1: Structures
  const structures = creep.room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        ((_.some([STRUCTURE_SPAWN, STRUCTURE_TOWER], (o) => s.structureType == o)
          && s.my != false
          && s.energy < s.energyCapacity))
      );
    }
  });

  if(structures.length > 0) {
    return creep.pos.findClosestByPath(structures, { ignoreCreeps: true }).id;
  }

  // Priority 2: Link emitter
  const linkEmitter = creep.room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        (s.structureType == STRUCTURE_LINK
          && s.energy < s.energyCapacity
          && s.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType == STRUCTURE_STORAGE }).length > 0)
      );
    }
  });

  if(linkEmitter.length > 0) {
    return linkEmitter[0].id;
  }

  // Priority 3: Extensions
  const extensions = creep.room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        ((_.some([STRUCTURE_EXTENSION], (o) => s.structureType == o)
          && s.my != false
          && s.energy < s.energyCapacity))
      );
    }
  });

  if(extensions.length > 0) {
    return creep.pos.findClosestByPath(extensions, { ignoreCreeps: true }).id;
  }

  // Priority 4: Remote container(Usually upgrader's spot)
  const storages = creep.room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        ((_.some([STRUCTURE_CONTAINER], (o) => s.structureType == o)
          && s.my != false
          && s.store[RESOURCE_ENERGY] < s.storeCapacity - creep.carry.energy
          && s.pos.findInRange(FIND_SOURCES, 3).length == 0))
      );
    }
  }).sort((a,b) => (a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]));

  if(storages.length > 0) {
    return storages[0].id;
  }

  // Priority 5: Terminal
  const terminal = creep.room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        ((_.some([STRUCTURE_TERMINAL], (o) => s.structureType == o)
          && s.my != false
          && s.store[RESOURCE_ENERGY] < 1000))
      );
    }
  });

  if(terminal.length > 0) {
    return terminal[0].id;
  }

  return null;
}

function deliver(creep) {
  const ctx = creep.memory;
  const target = Game.getObjectById(ctx.target);
  let status = ERR_INVALID_TARGET;

  if(!target) {
    ctx.target = null;
    return status;
  }

  if(creep.pos.isNearTo(target)) {
    status = creep.transfer(target, RESOURCE_ENERGY);

    switch(status) {
      case OK: return status;
      case ERR_NOT_IN_RANGE: return creep.moveTo(target, {reusePath: 15});
      case ERR_NOT_ENOUGH_RESOURCES: ctx.target = null; return status;
    }
  } else {
    status = creep.moveTo(target, {reusePath:15});
    if(status == ERR_NO_PATH) {
      ctx.target = null;
      return status;
    } else {
      return status;
    }
  }
}

//////////////////////
// Miner actions
//////////////////////
function harvestMineral(creep) {
  const ctx = creep.memory;

  if(!ctx.target) {
    const sources = creep.room.find(FIND_MINERALS);

    ctx.target = creep.pos.findClosestByRange(sources).id;
  }

  const source = Game.getObjectById(ctx.target);
  const status = creep.harvest(source);

  switch(status) {
    case ERR_NOT_IN_RANGE: return creep.moveTo(source, {reusePath:15});
    case ERR_INVALID_TARGET: ctx.target = null; return status;
    case ERR_FULL: ctx.target = null; return status;
    case ERR_TIRED: return status;
    case OK: return status;
    default: creep.say(sayStatus(status)); return status;
  }
}

function chargeMiner(creep) {
  const structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (s) => s.structureType == STRUCTURE_TERMINAL
  });

  const status = creep.transfer(structure, Object.keys(creep.carry)[1]);

  if(status == ERR_NOT_IN_RANGE) {
    return creep.moveTo(structure, {reusePath:15});
  }

  return status;
}

//////////////////
// Reserver actions
//////////////////
function reserve(creep) {
  const controller = creep.room.controller;

  const status = creep.reserveController(controller);

  switch(status) {
    case ERR_NOT_IN_RANGE: return creep.moveTo(controller, {reusePath:50});
    case OK: return status;
    default: creep.say(sayStatus(status)); return status;
  }
}



/**
 * Roles
 */

const role = {
  // HARVESTER
  harvester: (creep) => {
    const ctx = creep.memory;

    if(ctx.affinityTime > 0) {
      ctx.affinityTime--;
    }

    // Temporary: Keep residental room
    if(creep.room.name != ctx.home) {
      return creep.moveTo(new RoomPosition(25, 25, ctx.home), {reusePath:30});
    }

    ctx.working = canWork(creep);

    if(ctx.working) {
      return chargeHarvester(creep);
    } else {
      const status = harvest(creep);
      return status;
    }
  },

  // UPGRADER
  upgrader: (creep) => {
    const ctx = creep.memory;
    ctx.working = canWork(creep);

    // Temporary: Keep residental room
    if(creep.room.name != ctx.home) {
      return creep.moveTo(new RoomPosition(25, 25, ctx.home), {reusePath:30});
    }

    if(ctx.working) {
      ctx.target = creep.room.controller.id;
      const target = Game.getObjectById(ctx.target);
      const status = creep.upgradeController(target);

      switch(status) {
        case OK: return status;
        case ERR_NOT_IN_RANGE: return creep.moveTo(target, {reusePath: 15});
        case ERR_NOT_ENOUGH_RESOURCES: ctx.target = null; return status;
      }
    } else {
      return recharge(creep);
    }
  },

  // BUILDER
  builder: (creep, noRepair) => {
    const ctx = creep.memory;
    let status = ERR_INVALID_TARGET;
    ctx.working = canWork(creep);

    // Temporary: Keep residental room
    if(creep.room.name != ctx.home) {
      return creep.moveTo(new RoomPosition(25, 25, ctx.home), {reusePath:30});
    }

    // Temporary: Flee from enemy
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);

    if(enemies.length > 0) {
      const enemy = creep.pos.findClosestByRange(enemies);
      const range = creep.pos.getRangeTo(enemy);

      if(range < 4) {
        if(creep.room.controller && creep.room.controller.my == true) {
          return creep.moveTo(creep.room.controller, {reusePath:30});
        } else {
          return creep.moveTo(new RoomPosition(25, 25, ctx.home), {reusePath:30});
        }
      }
    }


    if(ctx.working) {
      status = doBuild(creep, noRepair);

      if(status != OK) {
        ctx.target = findBuildTarget(creep);

        if(!noRepair && ctx.target == null) {
          return role.wall_worker(creep);
        } else {
          return doBuild(creep);
        }
      }
    } else {
      return recharge(creep);
    }
  },

  // WALL WORKER
  wall_worker: (creep) => {
    const maxHits = (Memory.room[creep.room.name].defenceLevel || 3) * 1000 * 1000;
    const ctx = creep.memory;
    ctx.working = canWork(creep);

    if(ctx.working) {
      const toRepairs = creep.room.find(FIND_STRUCTURES, {
        filter: (o) => (
          _.some([STRUCTURE_WALL, STRUCTURE_RAMPART], (t) => o.structureType == t) &&
          o.hits < Math.min(o.hitsMax, maxHits)
        )
      }).sort((a,b) => Math.round((a.hits - b.hits) / 100000)).slice(0,4);

      if(toRepairs.length == 0) {
        return role.upgrader(creep);
      }

      const toRepair = creep.pos.findClosestByRange(toRepairs);
      const status = creep.repair(toRepair);

      if(status == ERR_NOT_IN_RANGE) {
        return creep.moveTo(toRepair, {reusePath:15});
      }

      return status;
    } else {
      return recharge(creep);
    }
  },

  // COLLECTOR
  collector: (creep) => {
    const ctx = creep.memory;
    ctx.working = canWork(creep);

    const isOutside = creep.room.name != ctx.home;

    if(isOutside) {
      return creep.moveTo(new RoomPosition(25, 25, ctx.home), {reusePath:30});
    }

    if(ctx.working) {
      return deliverToStorage(creep);
    } else {
      return collect(creep);
    }
  },

  // DEPLOYER
  deployer: (creep) => {
    const ctx = creep.memory;
    let status = ERR_INVALID_TARGET;
    ctx.working = canWork(creep);

    const isOutside = creep.room.name != ctx.home;

    if(isOutside) {
      return creep.moveTo(new RoomPosition(25, 25, ctx.home), {reusePath:30});
    }

    if(ctx.working) {
      status = deliver(creep);

      if(status != OK) {
        ctx.target = findDeliverTarget(creep);
      }
    } else {
      return withdrawFromStorage(creep);
    }
  },

  // MINER
  miner: (creep) => {
    const ctx = creep.memory;

    if(ctx.affinityTime > 0) {
      ctx.affinityTime--;
    }

    // Temporary: Keep residental room
    if(creep.room.name != ctx.home) {
      return creep.moveTo(new RoomPosition(25, 25, ctx.home), {reusePath:30});
    }

    ctx.working = (creep.ticksToLive < 10) || canWork(creep);

    if(ctx.working) {
      return chargeMiner(creep);
    } else {
      const status = harvestMineral(creep);
      return status;
    }
  },

  // REMOTE COLLECTOR
  remote_collector: (creep) => {
    const ctx = creep.memory;
    ctx.working = canWork(creep);
    const arrived = (ctx.working) ? creep.pos.roomName == ctx.home : creep.pos.roomName == ctx.duty;

    if(ctx.tooOld == true && creep.ticksToLive > 1300) {
      ctx.tooOld = false;
    }

    if(!arrived) {
      const target = (ctx.working) ? new RoomPosition(25, 25, ctx.home) : new RoomPosition(25, 25, ctx.duty)
      return creep.moveTo(target, {reusePath:50});
    }

    if(ctx.working) {
      try {
        const homeStorage = creep.room.find(FIND_MY_STRUCTURES, { filter: {structureType:STRUCTURE_STORAGE} })[0];
        if(creep.pos.isNearTo(homeStorage)) {
          return creep.transfer(homeStorage, RESOURCE_ENERGY);
        } else {
          return creep.moveTo(homeStorage, {reusePath:50});
        }
      } catch(e) {
        creep.say("Storage?");
        return ERR_INVALID_TARGET;
      }
    } else { // not working
      if(creep.ticksToLive < 250) {
        ctx.tooOld = true;
        return creep.moveTo(new RoomPosition(25, 25, ctx.home), {reusePath:50});
      }

      try {
        const destStorage = creep.room.find(FIND_STRUCTURES, {
          filter: (s) => {
            _.some([STRUCTURE_STORAGE, STRUCTURE_CONTAINER], (t) => s.structureType == t)
          }
        })[0];

        if(creep.pos.isNearTo(destStorage)) {
          return creep.withdraw(destStorage, RESOURCE_ENERGY);
        } else {
          return creep.moveTo(destStorage, {reusePath:50});
        }
      } catch(e) {
        creep.say("Storage?");
        return ERR_INVALID_TARGET;
      }
    }
  },

  // REMOTE HARVESTER
  remote_harvester: (creep) => {
    const ctx = creep.memory;
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);

    if(enemies.length > 0) {
      return creep.moveTo(new RoomPosition(25, 25, ctx.home), {reusePath:30});
    }

    ctx.working = canWork(creep);

    if(ctx.working) {
      // Road, container maintenance
      const buildTarget = findBuildTarget(creep);
      if(buildTarget) {
        ctx.target = buildTarget;
        return doBuild(creep);
      }

      if(creep.room.name != ctx.home) {
        return creep.moveTo(new RoomPosition(25, 25, ctx.home), {reusePath:30});
      } else {
        return deliverToStorage(creep);
      }
    } else { // not working
      if(creep.room.name != ctx.duty) {
        return creep.moveTo(new RoomPosition(25, 25, ctx.duty));
      } else {
        return harvest(creep);
      }
    }
  },

  // RESERVER
  reserver: (creep) => {
    const ctx = creep.memory;

    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);

    if(enemies.length > 0) {
      const enemy = creep.pos.findClosestByRange(enemies);
      const range = creep.pos.getRangeTo(enemy);

      if(range < 8) {

        //const status = creep.attack(enemy);
        return creep.moveTo(new RoomPosition(25, 25, ctx.home), {reusePath:30});
      }
    }

    const isOutside = creep.room.name != ctx.home;

    if(isOutside) {
      return reserve(creep);
    } else {
      return creep.moveTo(new RoomPosition(25, 25, ctx.duty), {reusePath:30});
    }
  },

  // SETTLER
  settler: (creep) => {
    const ctx = creep.memory;
    let target = null;

    ctx.working = canWork(creep);

    // Step 1: Journey
    if(creep.room.name !== ctx.duty) {
      return creep.moveTo(new RoomPosition(25, 25, ctx.duty), {reusePath:50});
    }

    // Step 2: Dismantle enemy structures if necessery(On duty room)
    const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES, {
      filter: (o) => !_.some([STRUCTURE_CONTROLLER, STRUCTURE_STORAGE, STRUCTURE_CONTAINER], (t) => o.structureType == t)
    });
    if(enemyStructures.length > 0) {
      target = creep.pos.findClosestByPath(enemyStructures);

      if(creep.pos.isNearTo(target)) {
        return (creep.dismantle(target) == OK) || (creep.attack(target));
      } else {
        return creep.moveTo(target, {reusePath:15});
      }
    }

    // Step 2-1: Destroy weak walls
    const enemyWalls = creep.room.find(FIND_STRUCTURES, {
      filter: (o) => (o.structureType == STRUCTURE_WALL && o.hits < 1000)
    }).sort((a,b) => a.hits - b.hits);
    if(enemyWalls.length > 0) {
      target = creep.pos.findClosestByPath(enemyWalls);

      if(creep.pos.isNearTo(target)) {
        return (creep.dismantle(target) == OK) || (creep.attack(target));
      } else {
        return creep.moveTo(target, {reusePath:15});
      }
    }

    // Step 3: Conquer Neutral room
    if(creep.getActiveBodyparts(CLAIM) >= 1 && creep.room.controller.my == false) {
      if(creep.pos.isNearTo(creep.room.controller)) {
        return creep.claimController(creep.room.controller);
        //return creep.reserveController(creep.room.controller);
      } else {
        return creep.moveTo(creep.room.controller, {reusePath:50});
      }
    }

    // Step 4: Building my structures
    if(creep.room.find(FIND_MY_CONSTRUCTION_SITES).length >= 1) {
      if(ctx.working == false) {
        return recharge(creep);
      } else {
        ctx.target = findBuildTarget(creep);
        return doBuild(creep, true);
      }
    }

    // Step 5(final): Act as harvester and RIP
    return role.harvester(creep);
  },

  // WARRIOR
  warrior: (creep) => {
    const ctx = creep.memory;
    ctx.working = canWork(creep);

    const isOutside = creep.room.name != ctx.home;

    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);

    if(enemies.length > 0) {
      const enemy = creep.pos.findClosestByPath(enemies);
      return (creep.attack(enemy) == OK) ||
             (creep.rangedAttack(enemy) == OK) ||
             (creep.moveTo(enemy));
    }

    if(creep.ticksToLive < 500) {
      return creep.moveTo(creep.pos.findClosestByPath(FIND_MY_SPAWNS));
    }

    if(creep.ticksToLive > 1000) {
      return creep.moveTo(_.sample(creep.room.find(FIND_MY_STRUCTURES, {
        filter: (o) => o.structureType == STRUCTURE_RAMPART
      })));
    }
  },

  // GATEKEEPER
  gatekeeper: (creep) => {
    const ctx = creep.memory;
    const isOutside = creep.room.name != ctx.home;

    /* Hard coding: Door location */
    const doorsInRoom = {
      'W66S41': [new RoomPosition(31, 35, 'W66S41')],
      'W69S42': [new RoomPosition(22, 35, 'W69S42')],
    };

    const doors = doorsInRoom[ctx.home];
    const target = doors[0];

    const inPosition = creep.pos.isEqualTo(target);

    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    if(enemies.length > 0) {
      if(inPosition) {
        const enemy = _.head(creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1));
        if(enemy) {
          return (creep.attack(enemy) == OK) ||
                (creep.rangedAttack(enemy) == OK);
        } else {
          return OK;
        }
      } else {
        creep.moveTo(target);
      }
    } else {
      if(inPosition) {
        return creep.move(_.sample([1,2,3,4,5,6,7,8]));
      } else {
        return OK;
      }
    }
  },


};

module.exports = {
  role
};