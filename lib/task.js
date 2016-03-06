'use strict';

// Strategy:
// MoveToPoint, Path, Goto

// constraint example:
// {key: vx, min: -0.01, max: 0.01}

class Task {

  constructor(strategy) {
    this._strategy = strategy;
  }

  check(robot) {
    return this._strategy.check(robot);
  }

};

module.exports = Task;
