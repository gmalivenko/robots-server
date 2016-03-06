'use strict';

// Point: {x: .., y: ...}

// Constraints example:
// [{key: vx, min: -0.01, max: 0.01}]

class Path {
  isRobotOnPoint(robot, point, eps) {
    return (Math.abs(robot.x - point.x) <= eps) && (Math.abs(robot.y - point.y) <= eps);
  }

  distanceToLine(point, A, B, C) {
    return Math.abs((A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B));
  }

  constructor(pointA, pointB, constraints) {
    this._isOnThePath = false;
    this._pointA = pointA;
    this._pointB = pointB;

    this._A = pointA.y - pointB.y;
    this._B = pointA.x - pointB.x;
    this._C = pointA.x * pointB.y - pointA.y * pointB.x;

    this._constrains = constraints;
  }

  check(robot) {
    let done = false;
    console.log('Path: _isOnThePath', this._isOnThePath);

    if (this._isOnThePath) {

      if (this.isRobotOnPoint(robot, this._pointB, 0.1)) {
        console.log('Done');
        done = true;
      } else {
        console.log(this.distanceToLine(robot, this._A, this._B, this._C));
        if (this.distanceToLine(robot, this._A, this._B, this._C) > 0.1) {
          this._isOnThePath = false;
        }
      }
    } else {
      if (this.isRobotOnPoint(robot, this._pointA, 0.1)) {
        this._isOnThePath = true;
      }
    }

    for (var i = 0; i < this._constrains.length; i++) {
      let key = this._constrains[i].key;
      if (Math.abs(robot[key] - this._constrains[i].val) > this._constrains[i].eps) {
        return false;
      }
    }

    return done;
  }

};

module.exports = Path;
