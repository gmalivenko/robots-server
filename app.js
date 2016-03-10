'use strict';

var config = require('./config.js');
var io = require('socket.io').listen(config.port);
var connection = require('./events/connection.js');

// Attach event handler
io.on('connection', connection);
