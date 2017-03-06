'use strict';

const RoomConfig = function(roomName) {
  this.panicRoom = new RoomPosition(25, 25, roomName);
  this.link = [
    [[25,25],[25,25]]
  ];

}

const defaultGeneBank = {

}

const SpawnPlan = function(roomName) {
  // Prepare multiple spawns in one room
}