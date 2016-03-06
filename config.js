module.exports = {
  port: 7777,
  robot: {
    m: {base: 5.0, variation: 2.0},
    r: {base: 5.0, variation: 2.5},
    linearDamping: 0.1,
    angularDamping: 0.1,
    spawnHeight: 5,
  },
  world: {
    g: {base: 10.0, variation: 2.0},
    iterations: 2,
    friction: 0.4,
    restitution: 0.3,
    stepInterval: 50,
    defaultTimeStep: 0.1,
  },
  dungeon: {
    width: 30,
    height: 30,
    rooms: 50,
    roomSize: 10,
  },
  map: {
    cubeSize: 10,
    cubeHeight: 30,
  },
};
