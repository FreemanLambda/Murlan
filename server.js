(function() {

var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var fs = require('fs');
var loja = require('./loja');

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
	console.log('Nje user u lidh');
	nr_user++;
	socket.on('disconnect', function() {
		console.log('Nje user u shkeput');
		io.sockets.emit('nr-user', --nr_user);
		var viktima = loja.shkaterro_lojtar(socket.id);
		if(viktima) console.log('Viktima ishte ' + viktima.emri + ' ne pozicionin ' + viktima.poz);
		if(nr_user < MAX_USER) io.sockets.emit('gati', 'Nje lojtari u shkeput, duke pritur per nje zevendesues...');
	});
	socket.on('krijo lojtar', function(data) {
		var poz_lirshem = loja.cakto_poz();
		if(poz_lirshem !== -1) {
			loja.ljt[poz_lirshem] = new loja.lojtar(socket, data, poz_lirshem, true, 0, false);
			console.log('U krijua lojtari me emer '+data+ ' ne pozicionin ' + loja.ljt[poz_lirshem].poz + ' me socket: ' + loja.ljt[poz_lirshem].socket.id);
		}
		
		if(nr_user > MAX_USER) {
			console.log('Userit iu mohua lidhja');
			socket.emit('plot', 'Nuk ka vend per ju!');
			socket.disconnect();
		}
		else if(nr_user === MAX_USER) {
			console.log('Te gjithe lojtaret jane lidhur');
			io.sockets.emit('gati', {
				mesazhi : 'Te gjithe lojtaret jane lidhur.',
				max_user : MAX_USER,
				ljt : JSON.stringify(loja.ljt, ['emri','poz'])
			});
			loja.s_fillo_lojen(nr_user);
			for(var i=0;i<4;i++) if(loja.ljt[i]) loja.ljt[i].socket.emit('fresko letrat', JSON.stringify(loja.ljt[i].letrat));
			do {
				perditesoKlientet();
				do {
					loja.gjendja.pranohet = false;
					socket.on('luajtur dore', function(data) {
						// kontrollojme vlefshmerine
						// nqs ok pranohet = true
						// nqs nuk pranohet i emitojme nje mesazh gabimi perdoruesit trap dhe presim serish eventin e tij
					});
				} while(!loja.gjendja.pranohet);
			} while(loja.gjendja.duhet_vazhduar_loja);
		}
		
	});
	io.sockets.emit('nr-user', nr_user);
});

function perditesoKlientet() {
	
}

app.listen(7777);
console.log('Server is listening on port 7777');

})();