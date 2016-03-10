'use strict';

// Include config onject & logger
var config = require('../config.js');
var log = require('debug')('connection');

// Attach physics engine
let CANNON = require('cannon');

// Attach classes
let Robot = require('../lib/robot.js');
let World = require('../lib/world.js');
let Maze = require('../lib/maze.js');

// Execute this one for every client
module.exports = (socket) => {
  // Create new world (empty space with plane and physics)
  let world = new World();

  // Create maze object & genarate rooms / spawns
  let maze = new Maze(
    config.dungeon.height,
    config.dungeon.width,
    config.dungeon.rooms,
    config.dungeon.roomSize
  );

  // Create robot, randomize spawn position
  let bot = new Robot(world);
  bot.randomize();
  bot.appendToWorld(new CANNON.Vec3(maze.spawn.x * config.map.cubeSize, maze.spawn.y * config.map.cubeSize, config.robot.spawnHeight));

  // We are generating Cube for every wall in the maze
  for (var i = 0; i < maze.h; i++) {
    for (var j = 0; j < maze.w; j++) {
      if (maze.maze[i][j] == 0) {
        world.addCube(new CANNON.Vec3(j * config.map.cubeSize, i * config.map.cubeSize, 0));
      }
    }
  }

  //  We are generating zero-collision Cube for every "Check point".
  var points = maze.spawnObjects(config.dungeon.rooms);
  bot.pointsCount = points.length;
  for (let i = 0; i < points.length; i++) {
    var point = world.addCube(new CANNON.Vec3(points[i][0] * config.map.cubeSize, points[i][1] * config.map.cubeSize, 0));
    point.userData = {type: 'point', val: 1};
    point.collisionResponse = 0;
  }

  // Start world simulation
  world.startSimulation();

  // Handle events
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
    bot.force = new CANNON.Vec3(data.fx, data.fy, 0); // 0 - component for Fz (jumps denied)
  });

};
