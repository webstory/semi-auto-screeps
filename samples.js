/* Set room defence level */
function setDefenceLevel() {
  return Memory.room['W66S39'].defenceLevel = 0;
}

function spawnSpecialCreeps() {
  // Special spawn logic
  if(false && Game.creeps['upgraderSpecial'] === undefined && Game.time % 3000 < 300) {
    // Threat evaluation for Room1
    const isTargetRoomSafe = Game.rooms['W66S39'].find(FIND_HOSTILE_CREEPS).length <= 0;
    if(isTargetRoomSafe) {
      const initMemory = {
        version: 3,
        role: 'upgrader',
        birth: 'W66S41',
        home: 'W66S39',
        duty: 'W66S39',
        working: false,
        state: 'idle',
      };
      Game.spawns['Home3'].createCreep([WORK,CARRY,MOVE,MOVE], 'upgraderSpecial', initMemory);
    }
  }

  if(false && Game.creeps['builderSpecial'] === undefined && Game.time % 1500 < 300) {
    // Threat evaluation for Room1
    const isTargetRoomSafe = Game.rooms['W66S39'].find(FIND_HOSTILE_CREEPS).length <= 0;
    if(isTargetRoomSafe) {
      const initMemory = {
        version: 3,
        role: 'builder',
        birth: 'W66S41',
        home: 'W66S39',
        duty: 'W66S39',
        working: false,
        state: 'idle',
      };
      Game.spawns['Home3'].createCreep([WORK,CARRY,MOVE,MOVE], 'builderSpecial', initMemory);
    }
  }
}

/* Get ramaining GCL points */
function getRemainingGCL() {
  return Game.gcl.progressTotal - Game.gcl.progress;
}

/* Manual spawn logic */
function manualSpawnLogicSamples() {
  const initMemory = {
    version: 3,
    role: role,
    birth: spawn.room.name,
    home: spawn.room.name,
    duty: 'W61S39',
    working: false,
    state: 'idle',
  };

  Game.spawns["Home1-1"].createCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE], 'settler0', initMemory);

}

/* Already defined in BODYPART_COST
const geneCost = {
  'move': 50,
  'work': 100,
  'carry': 50,
  'attack': 80,
  'ranged_attack': 150,
  'heal': 250,
  'claim': 600,
  'tough': 10
};
*/

const geneBankSample = [
  { // Level 0 : Limit 300
    'harvester': [WORK,WORK,CARRY,MOVE],
    'upgrader': [WORK,WORK,CARRY,MOVE],
    'builder': [WORK,WORK,CARRY,MOVE],
    'deployer': [],
    'collector': [],
  },

  { // Level 1 : Limit 550
    'harvester': [WORK,WORK,CARRY,MOVE],
    'upgrader': [WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY],
    'builder': [WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY],
    'wall_worker': [WORK,WORK,CARRY,MOVE,CARRY,CARRY],
    'collector': [MOVE,CARRY,CARRY],
    'deployer': [MOVE,CARRY,CARRY],
    'warrior': [TOUGH,MOVE],
  },

  { // Level 2 : Limit ??
    'harvester': [WORK,WORK,CARRY,MOVE,WORK,WORK],
    'upgrader': [WORK,WORK,CARRY,MOVE,CARRY],
    'builder': [WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY],
    'wall_worker': [WORK,WORK,CARRY,MOVE,CARRY,CARRY],
    'collector': [MOVE,CARRY,CARRY,MOVE,CARRY,CARRY],
    'deployer': [MOVE,CARRY,CARRY,MOVE,CARRY,CARRY],
    'warrior': [TOUGH,ATTACK,MOVE,MOVE],
    'remote_harvester': [WORK,WORK,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY],
    'reserver': [MOVE,MOVE,MOVE,CLAIM,CLAIM],
  },

  { // Level 3 : Limit ??
    'harvester': [WORK,WORK,CARRY,MOVE,WORK,WORK],
    'upgrader': [WORK,WORK,CARRY,MOVE,WORK,MOVE,WORK],
    'builder': [WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY],
    'wall_worker': [WORK,WORK,CARRY,MOVE,CARRY,CARRY],
    'collector': [MOVE,CARRY,CARRY,MOVE,CARRY,CARRY],
    'deployer': [MOVE,CARRY,CARRY,MOVE,CARRY,CARRY],
    'warrior': [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE],
    'remote_harvester': [WORK,WORK,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY],
    'reserver': [MOVE,MOVE,MOVE,CLAIM,CLAIM],
  },

  { // Level 4 : Limit ??, Storage available
    'harvester': [WORK,WORK,CARRY,MOVE,WORK,WORK],
    'upgrader': [WORK,WORK,CARRY,MOVE,WORK,MOVE,WORK,MOVE,WORK],
    'builder': [WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY],
    'wall_worker': [WORK,WORK,CARRY,MOVE,CARRY,CARRY],
    'collector': [MOVE,CARRY,CARRY,MOVE,CARRY,CARRY],
    'deployer': [MOVE,CARRY,CARRY,MOVE,CARRY,CARRY],
    'warrior': [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE],
    'remote_harvester': [WORK,WORK,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY],
    'reserver': [MOVE,MOVE,MOVE,CLAIM,CLAIM],
  },

  { // Level 5 : Limit ??, Link available
    'harvester': [WORK,WORK,CARRY,MOVE,WORK,WORK],
    'upgrader': [WORK,WORK,CARRY,MOVE,WORK,WORK,WORK,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK],
    'builder': [WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY],
    'wall_worker': [WORK,WORK,CARRY,MOVE,CARRY,CARRY],
    'collector': [MOVE,CARRY,CARRY,MOVE,CARRY,CARRY],
    'deployer': [MOVE,CARRY,CARRY,MOVE,CARRY,CARRY],
    'warrior': [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE],
    'remote_harvester': [WORK,WORK,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY],
    'reserver': [MOVE,MOVE,MOVE,CLAIM,CLAIM],
  },

  { // Level 6
    'harvester': [WORK,WORK,CARRY,MOVE,WORK,WORK],
    'miner': [WORK,CARRY,MOVE],
    'upgrader': [WORK,WORK,CARRY,MOVE,WORK,WORK,WORK,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK],
    'builder': [WORK,WORK,CARRY,MOVE,CARRY,MOVE],
    'wall_worker': [WORK,WORK,CARRY,MOVE,CARRY,CARRY],
    'collector': [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, // + 300
                CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], // + 600 = 900
    'deployer': [MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
    'warrior': [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH, // + 100
                ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                ATTACK,ATTACK,ATTACK,ATTACK,ATTACK, // + 1200
                MOVE,MOVE,MOVE,MOVE,MOVE,
                MOVE,MOVE,MOVE,MOVE,MOVE], // +500 = 1800
    'remote_harvester': [WORK,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,ATTACK],
    'reserver': [MOVE,MOVE,MOVE,MOVE,CLAIM],
    'remote_collector': [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, // + 350
                CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], // + 600 = 950
  }
];

const keepSampleForRoom1 = [
  [], // RCL 0
  [C.H,C.H,C.U,C.B], // RCL 1
  [C.H,C.H,C.U,C.B,C.U,C.B], // RCL 2
  [C.H,C.H,C.U,C.B,C.D], // After turret(RCL 3)
  [C.H,C.H,C.U,C.B,C.U,C.D,C.C], // After Storage(RCL 4)
  [C.H,C.H,C.U,C.B,C.D,C.C], // After Link(RCL 5)
  [
    C.H, C.H, C.U, C.B, // Beginning
    C.U, C.B, C.B, C.B, // Tier 1
    C.H, C.H, C.C, C.D, C.D, C.D, // Tier 2
    //C.W, C.W,
    C.RH, C.RH, C.RV, // Tier 3
    //C.U, C.U, // Tier 4
    //C.RC, C.RC, C.RC, C.RC, C.RC, C.RH, C.RH, C.RH, C.RV, // Temporary
  ], // RCL 6
  [
    C.H, C.H, C.U, C.B, // Beginning
    C.U, C.B, C.B, C.B, // Tier 1
    C.H, C.H, C.C, C.D, C.D, C.D, // Tier 2
    //C.W, C.W,
    C.RH, C.RH, C.RV, // Tier 3
    //C.U, C.U, // Tier 4
    //C.RC, C.RC, C.RC, C.RC, C.RC, C.RH, C.RH, C.RH, C.RV, // Temporary
    C.M,
  ], // RCL 7
  [
    C.H, C.H, C.U, C.B, // Beginning
    C.U, C.B, C.B, C.B, // Tier 1
    C.H, C.H, C.C, C.D, C.D, C.D, // Tier 2
    //C.W, C.W,
    C.RH, C.RH, C.RV, // Tier 3
    //C.U, C.U, // Tier 4
    //C.RC, C.RC, C.RC, C.RC, C.RC, C.RH, C.RH, C.RH, C.RV, // Temporary
    C.M,
  ], // RCL 8
];

const keepSampleForRoom2 = [
      [], // RCL 0
      [C.H,C.H,C.U,C.B], // RCL 1
      [C.H,C.H,C.U,C.B,C.U,C.B], // RCL 2
      [C.H,C.H,C.U,C.B,C.D], // After turret(RCL 3)
      [C.H,C.H,C.U,C.B,C.U,C.D], // After Storage(RCL 4)
      [C.H,C.H,C.U,C.B,C.B,C.D], // After Link(RCL 5)
      [C.H,C.H,C.U,C.B,C.B,C.D], // RCL 6
      [C.H,C.H,C.U,C.B,C.B,C.D], // RCL 7
      [C.H,C.H,C.U,C.B,C.B,C.D], // RCL 8
    ];

 const keepSampleForRoom3 = [
      [], // RCL 0
      [C.H,C.H,C.U,C.B], // RCL 1
      [C.H,C.H,C.U,C.B,C.U,C.B], // RCL 2
      [C.H,C.H,C.U,C.B,C.B,C.H,C.H,C.D,C.U], // After turret(RCL 3)
      [C.H,C.H,C.U,C.B,C.B,C.B,C.H,C.H,C.U,C.D,C.C], // After Storage(RCL 4)
      [C.H,C.H,C.U,C.B,C.B,C.B,C.U,C.H,C.H,C.D,C.D,C.C,C.U,C.U], // After Link(RCL 5)
      [C.H,C.H,C.U,C.B,C.B,C.B,C.H,C.H,C.D,C.D,C.C,C.U,C.U], // RCL 6
      [C.H,C.H,C.U,C.B,C.B,C.H,C.H,C.D,C.D,C.C,C.U,C.U], // RCL 7
      [C.H,C.H,C.U,C.B,C.B,C.H,C.H,C.D,C.D,C.C,C.U,C.U], // RCL 8
    ];


 function CustommineraltransfertoAtanner() {
  if(Game.time % 2000 == 0) {
    let status = ERR_INVALID_TARGET;
    try {
      status = Game.rooms.W66S39.terminal.send("Z", 100, 'W66S37', 'Resource from Hoya82.');
      if(status == OK) {
        //Game.notify("Transaction to Atanner is complete.");
      } else {
        Game.notify("Transaction to Atanner is failed. code:"+status);
      }
    } catch(e) {
      // Do nothing
    }
  }
}