'use strict';

var config = require('../config.js');
var log = require('debug')('world');

var CANNON = require('cannon');

class World {
  constructor() {
    this.g = config.world.g.base +
      Math.random() * config.world.g.variation / 2.0 - config.world.g.variation / 2.0;

    this._holded = false;
    this._timeStep = config.world.defaultTimeStep;

    this._world = new CANNON.World();
    this._world.gravity.set(0, 0, -this.g); // m/s²
    this._world.quatNormalizeSkip = 0;
    this._world.quatNormalizeFast = false;

    this._solver = new CANNON.GSSolver();
    this._world.defaultContactMaterial.contactEquationStiffness = 1e9;
    this._world.defaultContactMaterial.contactEquationRelaxation = 4;
    this._solver.iterations = 7;
    this._solver.tolerance = 0.1;
    this._world.solver = new CANNON.SplitSolver(this._solver);

    this._world.broadphase = new CANNON.NaiveBroadphase();

    this.groundMaterial = new CANNON.Material('groundMaterial');
    this.groundGroundCm = new CANNON.ContactMaterial(this.groundMaterial, this.groundMaterial, {
      friction: config.world.friction,
      restitution: config.world.restitution,
      frictionEquationRegularizationTime: 3,
    });
    this._world.addContactMaterial(this.groundGroundCm);

    this._groundBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 0, 0),
      material: this.groundMaterial,
    });

    this._groundShape = new CANNON.Plane();
    this._groundBody.addShape(this._groundShape);
    this._world.addBody(this._groundBody);

    this._objects = [];
  }

  addCube(position) {
    let size = config.map.cubeSize / 2.0;
    let box = new CANNON.Body({
      mass: 0,
      position: position,
      shape: new CANNON.Box(new CANNON.Vec3(size, size, config.map.cubeHeight)),
    });
    this._world.addBody(box);
    this._objects.push(box);
  }

  addBody(body) {
    this._world.addBody(body);
    this._objects.push(body);
  }

  destructor() {
    delete this._world;
  }

  startSimulation(onTick) {
    this._timerId = setInterval(() => {
      if (!this._holded) {
        if (onTick) {
          onTick();
        }

        this._step(this._timeStep);
      } else {
        this._timeStep += config.world.defaultTimeStep;
      }

    }, config.world.stepInterval);
  }

  stopSimulation() {
    clearInterval(this._timerId);
  }

  toggleSimulation() {
    this._holded = !this._holded;
  }

  _step(dt) {
    this._world.step(dt);
  }

  get world() {
    return this._world;
  }

};

module.exports = World;
