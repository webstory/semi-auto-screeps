const creepBehavior = require('creepBehavior');
const roleTower = require('roleTower');
const roleSpawn = require('roleSpawn');

global.testHello = (msg) => {
  console.log(msg);
}

global.spawn = roleSpawn.spawnCreep;
global.spawnSettler1 = () => {
  const spawn = Game.spawns["Home3"];
  const initMemory = {
    version: 3,
    role: 'settler',
    birth: spawn.room.name,
    home: spawn.room.name,
    duty: 'W63S41',
    working: false,
    state: 'idle',
  };

  return spawn.createCreep([WORK,CARRY,MOVE,MOVE,MOVE,CLAIM], 'settler'+Date.now(), initMemory);
}

global.spawnSettler2 = () => {
  const spawn = Game.spawns["Home3"];
  const initMemory = {
    version: 3,
    role: 'settler',
    birth: spawn.room.name,
    home: spawn.room.name,
    duty: 'W63S41',
    working: false,
    state: 'idle',
  };

  return spawn.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], 'settler'+Date.now(), initMemory);
}

global.spawnRemoteCollector = () => {
  const spawn = Game.spawns["Home1-1"];
  const initMemory = {
    version: 3,
    role: 'remote_collector',
    birth: spawn.room.name,
    home: spawn.room.name,
    duty: 'W61S39',
    working: false,
    state: 'idle',
  };

  return spawn.createCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE], 'settler'+Date.now(), initMemory);
}


function recalcPopulation() {
  if(Memory.room === undefined) { Memory.room = {}; };

  for(let roomName in Game.rooms) {
    if(Memory.room[roomName] === undefined) { Memory.room[roomName] = {}; };
    Memory.room[roomName]['creep'] = {};
    Memory.room[roomName]['resident'] = {};
  }

  for(let name in Game.creeps) {
    const c = Game.creeps[name];

    Memory.room[c.memory.home]['resident'][c.memory.role] = Memory.room[c.memory.home]['resident'][c.memory.role] || 0;
    Memory.room[c.memory.home]['resident'][c.memory.role]++;

    Memory.room[c.pos.roomName]['creep'][c.memory.role] = Memory.room[c.pos.roomName]['creep'][c.memory.role] || 0;
    Memory.room[c.pos.roomName]['creep'][c.memory.role]++;
  };
}

module.exports.loop = () => {
  PathFinder.use(true);

  for(let name in Memory.creeps) {
    if(Game.creeps[name] === undefined) {
      console.log("Dead: " + name);
      delete Memory.creeps[name];
    }
  };

  recalcPopulation();

  // Tower and Link
  for(let roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    const towers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER });

    towers.map((tower) => roleTower.run(tower));

    const emitterLink = room.find(FIND_STRUCTURES, {
      filter: (s) => (
        s.structureType == STRUCTURE_LINK
        && s.energy >= s.energyCapacity
        && s.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType == STRUCTURE_STORAGE }).length >= 1
      )
    });

    const collectorLink = room.find(FIND_STRUCTURES, {
      filter: (s) => (
        s.structureType == STRUCTURE_LINK
        && s.energy == 0
        && s.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType == STRUCTURE_STORAGE }).length <= 0
      )
    });

    if(emitterLink.length > 0 && collectorLink.length > 0) {
      emitterLink[0].transferEnergy(collectorLink[0]);
    }

  }

  Object.keys(Game.spawns).map((spawnName) => {
    roleSpawn.run(Game.spawns[spawnName]);
  });

  for(let name in Game.creeps) {
    if(Game.cpu.getUsed() >= Game.cpu.tickLimit) {
      console.log("CPU limit reached.");
      return;
    }

    const creep = Game.creeps[name];
    creepBehavior.role[creep.memory.role](creep);
  }
}