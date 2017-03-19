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

function spawnCreep(spawnName, role, dna, options) {
  const spawn = Game.spawns[spawnName];
  const duty = _.get(options, 'duty', spawn.room.name);
  const home = _.get(options, 'home', spawn.room.name);
  const serial = _.get(options, 'serial', Date.now());

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
    home: home,
    duty: duty,
    working: false,
    state: 'idle',
  };
  const name = spawn.createCreep(dna, `(${spawnName})${role}${serial}`, initMemory);
  return name;
}

module.exports = {
  spawnCreep: spawnCreep,
  run: (spawn) => {
    // Wait until spawn is available
    if(spawn.spawning != null) { return false; }

    const plan = spawnPlan[spawn.name];
    if(!plan) {
      console.log("Plan for "+spawn.name+" is not defined.");
      return false;
    }

    const geneBank = plan.geneBank;
    let keepArray = _.clone(plan.keep);
    if(!_.isArray(keepArray[0])) {
      keepArray = [keepArray];
    }

    const creepsCount = _.clone(Memory.room[spawn.room.name]['resident']);
    let curCreepCount = {};

    // Treat evaluation - Gatekeeping
    const enemies = spawn.room.find(FIND_HOSTILE_CREEPS);
    if(spawn.room.controller.safeMode == undefined && enemies.length >= 3) {
      // Purge any non-mendatory spawns
      keepArray = keepArray.slice(0,1);

      // Append gatekeeper
      keepArray[0].push('gatekeeper');
      keepArray[0].push('deployer');
      keepArray[0].push('deployer');
    }

    // Treat evaluation - Creep Defender
    const wounded = spawn.room.find(FIND_MY_CREEPS, {
      filter: (c) => c.hits / c.hitsMax < 0.7
    });

    if(spawn.room.controller.safeMode == undefined && enemies.length >= 1 && wounded.length >= 1) {
      // Append warriors
      for(let i = 0; i < wounded.length; i++) {
        keepArray[0].push('warrior');
      }
    }

    const keep = _.flatten(keepArray);

    // Spawn a civilian
    for(let i in keep) {
      const role = keep[i];
      creepsCount[role] = creepsCount[role] || 0;
      creepsCount[role]--;
      curCreepCount[role] = (curCreepCount[role] || 0) + 1;

      if(creepsCount[role] < 0) {
        const dna = buildCreepDNA(geneBank[role], spawn.room.energyAvailable);
        const workplaces = _.get(plan.workplace, `[${role}]`, [spawn.name]);

        // Spawn absent creep
        // Serial represent his workplace
        // 100 is a safeguard, it must be terminated until than.
        let serial = 0;
        while(serial < 100) {
          serial += 1;
          const workplace = workplaces[serial % workplaces.length];
          const options = {
            duty: workplace,
            serial: serial,
          };
          const name = spawnCreep(spawn.name, role, dna, options);

          if(_.isString(name)) {
            console.log(`Spawn: ${name} with DNA [${dna.join(',')}] (${curCreepCount[role]})`);
            return name;
          }
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