'use strict';

var config = require('./config.js');
var io = require('socket.io').listen(config.port);
io.on('connection', require('./events/connection.js'));
