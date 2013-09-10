(function() {

var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var fs = require('fs');
var ljt = require('./loja');

var nr_user = 0;
const MAX_USER = 4;

function reqHandler(req, res) {
	fs.readFile(__dirname + req.url, function(err, data) {
		if(err) {
			res.writeHead(500);
			res.end('Failed to open file');
		}
		else {
			res.writeHead(200);
			res.end(data);
		}
	});
}

var app = http.createServer(reqHandler);
var io = socketio.listen(app);

io.sockets.on('connection', function(socket) {
	console.log('User connected.');
	nr_user++;
	socket.on('disconnect', function() {
		console.log('User disconnected.');
		io.sockets.emit('nr-user', --nr_user);
		if(nr_user < MAX_USER) io.sockets.emit('ready', 'A player disconnected, waiting for a replacer...');
	});
	
	socket.on('create player', function(data) {
		ljt.ljt[nr_user-1] = new ljt.lojtar(data);
		console.log('Player ' + nr_user + ' was given the name ' + data);
	});
	
	if(nr_user === MAX_USER) {
		console.log('All users are connected');
		io.sockets.emit('ready', 'All users are connected');
	}
	else if(nr_user > MAX_USER) {
		console.log('User connection rejected');
		socket.emit('full', 'No room for you baby!');
		socket.disconnect();
	}
	io.sockets.emit('nr-user', nr_user);
	
});

app.listen(7777);
console.log('Server is listening on port 7777');

})();