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

const defaultGeneBank = {
  'harvester': [WORK,WORK,CARRY,MOVE,'/',WORK,WORK,'/',WORK,WORK],
  'upgrader': [WORK,CARRY,MOVE,'/',WORK,WORK,MOVE,'/',WORK,WORK,MOVE,'/',WORK,WORK,MOVE,'/',WORK,WORK,'/',
               WORK,CARRY,MOVE,'/',WORK,WORK,MOVE,'/',WORK,WORK,MOVE,'/',WORK,WORK,MOVE,'/',WORK,WORK,'/',
               WORK,CARRY,MOVE,'/',WORK,WORK,MOVE,'/',WORK,WORK,MOVE,'/',WORK,WORK,MOVE,'/',WORK,WORK],
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
  'remote_harvester': [WORK,MOVE,CARRY,MOVE,'/',MOVE,CARRY,CARRY,'/',MOVE,CARRY,CARRY,'/',WORK,WORK,MOVE,MOVE],
  'reserver': [MOVE,CLAIM],
};

module.exports = {
  /*************************************************************************************/
  'HoyaHome2': {
    geneBank: defaultGeneBank,

    workplace: {},

    keep: []
  },

  /*************************************************************************************/
  'Home3': {
    geneBank: defaultGeneBank,

    workplace: {
      'remote_harvester': ['W66S42','W65S42','W67S42','W65S41'],
      'remote_collector': ['W66S42','W65S42','W67S42','W65S41'],
      'reserver': ['W66S42','W65S42','W67S42','W65S41'],
    },

    keep: [[C.H,C.H,C.U,C.B,C.U,C.D,C.D,C.C],
           [C.RH,C.RH,C.RH,C.RH, C.RH,C.RH,C.RH,C.RH]]
  },

  /*************************************************************************************/
  'Home4': {
    geneBank: defaultGeneBank,

    workplace: {
      'remote_harvester': ['W69S43','W68S42','W69S43','W68S42','W69S41'],
      'remote_collector': ['W69S43'],
      'reserver': ['W69S43'],
    },

    keep: [[C.H,C.H,C.U,C.B,C.B,C.U,C.D,C.C,C.D],
           [C.RH,C.RH,C.RH,C.RH,C.RH]]
  },

  /*************************************************************************************/
  'Home5': {
    geneBank: defaultGeneBank,

    workplace: {
      'remote_harvester': ['W68S41'],
      'remote_collector': ['W68S41'],
      'reserver': ['W68S41'],
    },

    keep: [[C.H,C.H,C.U,C.B,C.D,C.U,C.B,C.C,C.C,C.D],
           [C.RH,C.RH]]
  },


  /*************************************************************************************/
  'Home6': {
    geneBank: defaultGeneBank,

    workplace: {
      'remote_harvester': ['W61S41','W64S42','W64S41','W64S41','W64S42','W64S42','W62S41','W62S41','W61S41'],
      'remote_collector': ['W64S41'],
      'reserver': ['W64S41'],
    },

    keep: [[C.H,C.U,C.B,C.D],
           [C.RH,C.RH]]
  },

}