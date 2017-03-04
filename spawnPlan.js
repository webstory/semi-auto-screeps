'use strict';

const C = {
  H: 'harvester',
  U: 'upgrader',
  B: 'builder',
  WW: 'wall_worker',
  C: 'collector',
  D: 'deployer',
  W: 'warrior',
  GK: 'gatekeeper',
  RH: 'remote_harvester',
  RV: 'reserver',
  M: 'miner',
}

module.exports = {
  /*************************************************************************************/
  'manual': {
    geneBank: {
      'settler1': [],
      'settler2': [],
      'remote_collector': [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, // + 350
                  CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                  CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], // + 600 = 950
    },

    keep: []
  },

  /*************************************************************************************/
  'Home1': {
    geneBank: {
      'harvester': [WORK,WORK,CARRY,MOVE,'/',WORK,WORK,'/',WORK,WORK],
      'miner': [WORK,CARRY,MOVE],
      'upgrader': [WORK,WORK,CARRY,MOVE,'/',WORK,WORK,WORK],//,WORK,MOVE,'/',WORK,WORK,MOVE,'/',WORK,WORK],
      'builder': [WORK,WORK,CARRY,MOVE,'/',WORK,WORK,CARRY,MOVE,'/',CARRY,CARRY,CARRY,MOVE],
      'wall_worker': [WORK,WORK,CARRY,MOVE,'/',CARRY,CARRY],
      'collector': [MOVE,MOVE,CARRY,CARRY,'/',MOVE,MOVE,CARRY,CARRY,'/',
                  MOVE,MOVE,CARRY,CARRY,'/',CARRY,CARRY,
                  CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], // 900
      'deployer': [MOVE,MOVE,CARRY,CARRY,'/',MOVE,MOVE,CARRY,CARRY,CARRY,CARRY],
      'warrior': [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                  TOUGH,TOUGH,TOUGH,TOUGH,TOUGH, // + 100
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK, // + 1200
                  MOVE,MOVE,MOVE,MOVE,MOVE,
                  MOVE,MOVE,MOVE,MOVE,MOVE], // +500 = 1800
      //'remote_harvester': [WORK,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,ATTACK,ATTACK],
      'remote_harvester': [WORK,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,ATTACK,ATTACK,ATTACK],
      'reserver': [MOVE,MOVE,MOVE,MOVE,CLAIM],
      'remote_collector': [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, // + 350
                  CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                  CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], // + 600 = 950
    },

    keep: [
        C.H, C.H, C.U, C.B, // Beginning
        C.B, C.B, C.B, // Tier 1
        //C.C, C.D, C.D, C.D, // Tier 2
        //C.W, C.W,
        //C.RH, C.RH, C.RV, // Tier 3
        //C.U, C.U, // Tier 4
        //C.RC, C.RC, C.RC, C.RC, C.RC, C.RH, C.RH, C.RH, C.RV, // Temporary
        //C.M,
      ]
  },

  /*************************************************************************************/
  'Home1-1': {
    geneBank: {
      'warrior': [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE],
    },

    keep: []
  },

  /*************************************************************************************/
  'HoyaHome2': {
    geneBank: {
      'wall_worker': [WORK,CARRY,MOVE],
    },

    keep: [C.WW]
  },

  /*************************************************************************************/
  'Home3': {
    geneBank: {
      'harvester': [WORK,WORK,CARRY,MOVE,'/',WORK,WORK,'/',WORK,WORK],
      'upgrader': [WORK,WORK,CARRY,MOVE,'/',WORK,WORK,WORK,WORK,MOVE,'/',WORK,WORK,MOVE,'/',WORK,WORK],
      'builder': [WORK,WORK,CARRY,MOVE,'/',WORK,WORK,CARRY,MOVE],
      'wall_worker': [WORK,WORK,CARRY,MOVE,'/',CARRY,CARRY],
      'collector': [MOVE,CARRY,CARRY,MOVE,'/',CARRY,CARRY],
      'deployer': [MOVE,CARRY,CARRY,'/',MOVE,CARRY,CARRY],
      'warrior': [TOUGH,TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE],
      'gatekeeper': [MOVE,MOVE,MOVE,MOVE,MOVE,
                  MOVE,MOVE,MOVE,MOVE,MOVE, // + 500
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,'/', // +1200 = 1700
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,'/', // +400  = 2100
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,'/', // +400  = 2500
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,'/', // +400  = 2900
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,'/', // +400  = 3300
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],    // +400  = 3700
      'remote_harvester': [WORK,WORK,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY],
      'reserver': [MOVE,MOVE,MOVE,CLAIM,CLAIM],
    },

    keep: [C.H,C.H,C.U,C.B,C.B,C.B,C.U,C.D,C.D,C.C]
  },

  /*************************************************************************************/
  'Home4': {
    geneBank: {
      'harvester': [WORK,WORK,CARRY,MOVE,'/',WORK,WORK,'/',WORK,WORK],
      'upgrader': [WORK,WORK,CARRY,MOVE,'/',WORK,WORK,WORK,WORK,MOVE,'/',WORK,WORK,MOVE,'/',WORK,WORK],
      'builder': [WORK,WORK,CARRY,MOVE,'/',WORK,WORK,CARRY,MOVE],
      'wall_worker': [WORK,WORK,CARRY,MOVE,'/',CARRY,CARRY],
      'collector': [MOVE,CARRY,CARRY,MOVE,'/',CARRY,CARRY],
      'deployer': [MOVE,CARRY,CARRY,'/',MOVE,CARRY,CARRY,'/',MOVE,CARRY,CARRY,CARRY,CARRY],
      'warrior': [TOUGH,MOVE,'/',TOUGH,ATTACK,ATTACK,MOVE,MOVE,MOVE],
      'gatekeeper': [MOVE,MOVE,MOVE,MOVE,MOVE,
                  MOVE,MOVE,MOVE,MOVE,MOVE, // + 500
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,'/', // +1200 = 1700
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,'/', // +400  = 2100
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,'/', // +400  = 2500
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,'/', // +400  = 2900
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,'/', // +400  = 3300
                  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],    // +400  = 3700
      'remote_harvester': [WORK,MOVE,CARRY,MOVE,'/',MOVE,MOVE,CARRY,CARRY,'/',MOVE,MOVE,CARRY,CARRY],
      'reserver': [MOVE,CLAIM],
    },

    keep: [C.H,C.H,C.U,C.B,C.B,C.U,C.B,C.D,C.C,C.D,C.RH,C.RV,C.RH]
  },

}