'use strict';
var config = require('../config.js');
var log = require('debug')('connection');

var CANNON = require('cannon');

let Robot = require('../lib/robot.js');
let World = require('../lib/world.js');
let Maze = require('../lib/maze.js');

module.exports = (socket) => {
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

  var points = maze.spawnObjects(config.dungeon.rooms);
  log('Points', points);
  let hasTarget = false;
  for (let i = 0; i < points.length; i++) {
    var point = world.addCube(new CANNON.Vec3(points[i][0] * config.map.cubeSize, points[i][1] * config.map.cubeSize, 0));
    if (Math.random() > 0.8 && !hasTarget) {
      point.userData = {type: 'target'};
      hasTarget = 1;
    } else {
      point.userData = {type: 'point'};
    }

    point.collisionResponse = 0;
  };

  let bot = new Robot(world);
  bot.randomize();
  bot.appendToWorld(new CANNON.Vec3(maze.spawn.x * config.map.cubeSize, maze.spawn.y * config.map.cubeSize, config.robot.spawnHeight));

  world.startSimulation(bot.onTick);

  socket.on('robot.getState', (data, cb) => {
    if (cb) {
      cb(bot._toJSON());
    }
  });

  socket.on('map.getPoints', (data, cb) => {
    cb(points);
  });

  socket.on('map.getMaze', (data, cb) => {
    cb(maze.maze);
  });

  socket.on('config.get', (data, cb) => {
    cb(config);
  });

  socket.on('robot.applyForce', (data) => {
    bot.force = new CANNON.Vec3(data.fx, data.fy, data.fz);
  });
};
