'use strict';
var config = require('../config.js');
var log = require('debug')('connection');

var CANNON = require('cannon');

let Robot = require('../models/robot.js');
let World = require('../models/world.js');
let Maze = require('../models/maze.js');

module.exports = (socket) => {
  let Robot = require('../models/robot.js');
  let World = require('../models/world.js');

  let world = new World();

  let maze = new Maze(
    config.dungeon.height,
    config.dungeon.width,
    config.dungeon.rooms,
    config.dungeon.roomSize
  );

  for (var i = 0; i < maze.h; i++) {
    for (var j = 0; j < maze.w; j++) {
      if (maze.maze[i][j] == 0) {
        world.addCube(new CANNON.Vec3(j * config.map.cubeSize, i * config.map.cubeSize, 0));
      }
    }
  }

  let bot = new Robot(world);
  bot.randomize();
  bot.appendToWorld(new CANNON.Vec3(maze.spawn.x * config.map.cubeSize, maze.spawn.y * config.map.cubeSize, config.robot.spawnHeight));

  world.startSimulation(bot.onTick);

  socket.on('robot.getState', (data, cb) => {
    if (cb) {
      cb(bot._toJSON());
    }
    /*
    var str = '';
    for (var i = 0; i < maze.h; i++) {
      for (var j = 0; j < maze.w; j++) {
        if (Math.floor(bot.x / config.map.cubeSize) == j && Math.floor(bot.y / config.map.cubeSize) == i) {
          str += '@';
        } else
        if (maze.maze[i][j] == 0) {
          str += '#';
        } else {
          str += ' ';
        }
      }

      str += '\n';
    }

    console.log(str);*/
  });

  socket.on('map.get', (data, cb) => {
    cb(maze.maze);
  });

  socket.on('config.get', (data, cb) => {
    cb(config);
  });

  socket.on('robot.applyForce', (data) => {
    bot.force = new CANNON.Vec3(data.fx, data.fy, data.fz);
  });
};
