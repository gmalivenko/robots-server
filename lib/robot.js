'use strict';

var config = require('../config.js');
var log = require('debug')('robot');

var CANNON = require('cannon');

class Robot {
  constructor(world) {
    if (!world) {
      log('Robot:constructor wrong world object');
    }

    this._world = world;
    this.m = 0;
    this.r = 0;
    this.hp = 100;
    this.done = 0;
    this.points = 0;
  }

  destructor() {
    delete this._sphereBody;
  }

  randomize() {
    this.m = config.robot.m.base +
      Math.random() * config.robot.m.variation / 2.0 - config.robot.m.variation / 2.0;
    this.r = config.robot.r.base +
      Math.random() * config.robot.r.variation / 2.0 - config.robot.r.variation / 2.0;
  }

  appendToWorld(position) {

    this._sphereBody = new CANNON.Body({
      mass: this.m,
      position: position,
      shape: new CANNON.Sphere(this.r),
      material: this._world.groundMaterial,
    });

    this._sphereBody.allowSleep = false;
    this._sphereBody.linearDamping = config.robot.linearDamping;
    this._sphereBody.angularDamping = config.robot.angularDamping;

    this._world.addBody(this._sphereBody);
    this._updateVars();

    this._sphereBody.addEventListener('collide', (e) => {
      if (e.contact.bj.userData && e.contact.bj.userData.type == 'target') {
        this.done = 1;
      }

      if (e.contact.bj.userData && e.contact.bj.userData.type == 'point') {
        this.points++;
      }

      log('collide with body on speed: ', this._sphereBody.id, e.contact.bi.id, e.contact.bj.id, e.contact.bj.userData, this._sphereBody.velocity.length());
      if (this._sphereBody.velocity.length() >= 5) {
        this.hp -= Math.exp(this._sphereBody.velocity.length() / 10.0);
      }
    });
  }

  onTick() {
  }

  set force(force) {
    // this._world.toggleSimulation();

    log('Robot: set force : ', force);
    this._sphereBody.force = force;

    // this._world.toggleSimulation();
  }

  _updateVars() {
    this.x = this._sphereBody.position.x;
    this.y = this._sphereBody.position.y;
    this.z = this._sphereBody.position.z;

    this.vx = this._sphereBody.velocity.x;
    this.vy = this._sphereBody.velocity.y;
    this.vz = this._sphereBody.velocity.z;
  }

  _toJSON() {
    this._updateVars();
    function omitKeys(obj) {
      var dup = {};
      for (var key in obj) {
        if (typeof obj[key] == 'number') {
          dup[key] = obj[key];
        }
      }

      return dup;
    }

    return JSON.stringify(omitKeys(this));
  }
};

module.exports = Robot;
