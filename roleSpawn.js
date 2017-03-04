'use strict';

const spawnPlan = require('spawnPlan');

function buildCreepDNA(gene, energyAvail) {
  let dna = [];
  let dna_temp = [];
  let cursor = 0;
  let cost = 0;

  while(true) {
    const codon = gene[cursor];
    if(codon == '/') {
      dna = dna_temp;
      cursor = cursor + 1;
      continue;
    }
    cost = cost + BODYPART_COST[codon];
    if(cost > energyAvail) { break; }
    dna_temp.push(codon);
    cursor = cursor + 1;
    if(cursor >= gene.length) {
      dna = dna_temp;
      break;
    }
  }

  return dna;
}

function spawnCreep(spawnName, role, dna) {
  const spawn = Game.spawns[spawnName];

  if(_.isArray(dna) && dna.length == 0) {
    return false;
  }

  if(_.isString(dna)) {
    dna = spawnPlan['manual'].geneBank(dna);
  }

  if(dna === undefined || dna === null) {
    dna = spawnPlan[spawnName].geneBank[role];
  }

  const initMemory = {
    version: 3,
    role: role,
    birth: spawn.room.name,
    home: spawn.room.name,
    duty: spawn.room.name,
    working: false,
    state: 'idle',
  };
  const name = spawn.createCreep(dna, role + Date.now(), initMemory);
  return name;
}

module.exports = {
  spawnCreep: spawnCreep,
  run: (spawn) => {
    // Wait until spawn is available
    if(spawn.spawning != null) { return false; }

    const plan = spawnPlan[spawn.name];
    if(!plan) {
      console.error("Plan for "+spawn.name+" is not defined.");
      return false;
    }

    const geneBank = plan.geneBank;
    const keep = _.clone(plan.keep);

    const creepsCount = _.clone(Memory.room[spawn.room.name]['resident']);
    let curCreepCount = {};

    // Treat evaluation
    if(spawn.room.controller.safeMode == undefined && spawn.room.find(FIND_HOSTILE_CREEPS).length >= 3) {
      keep.push('gatekeeper');
      keep.push('deployer');
      keep.push('deployer');
    }

    // Spawn a civilian
    for(let role of keep) {
      creepsCount[role] = creepsCount[role] || 0;
      creepsCount[role]--;
      curCreepCount[role] = (curCreepCount[role] || 0) + 1;

      if(creepsCount[role] < 0) {
        const dna = buildCreepDNA(geneBank[role], spawn.room.energyAvailable);
        const name = spawnCreep(spawn.name, role, dna);

        if(_.isString(name)) {
          console.log(`Spawn: ${name} with DNA [${dna.join(',')}] (${curCreepCount[role]})`);
          return name;
        }
      }
    }

    // Life expand to old warrior
    const army = spawn.room.find(FIND_MY_CREEPS, {
      filter: (c) => (
        false &&
        _.some(['_disabled_warrior','remote_collector'], (r) => c.memory.role == r) &&
        c.pos.isNearTo(spawn) &&
        c.ticksToLive < 1450
      )
    });

    if(army.length > 0) {
      return spawn.renewCreep(_.sample(army));
    }
  }
}