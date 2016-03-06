'use strict';

// Point: {x: .., y: ..., z: ...}

// Constraints example:
// [{key: vx, min: -0.01, max: 0.01}]

class MoveToPoint {

  constructor(point, constraints) {
    this._point = point;
    this._constrains = constraints;
    this._constrains.push({key: 'x', val: point.x, eps: 0.01});
    this._constrains.push({key: 'y', val: point.y, eps: 0.01});
  }

  check(robot) {
    for (var i = 0; i < this._constrains.length; i++) {
      let key = this._constrains[i].key;
      if (Math.abs(robot[key] - this._constrains[i].val) > this._constrains[i].eps) {
        return false;
      }
    }

    return true;
  }

};

module.exports = MoveToPoint;
