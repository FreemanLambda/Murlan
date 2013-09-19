(function() {

var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var fs = require('fs');
var loja = require('./loja');
const KOHA_PRITJE = 10000; // milisekonda

var nr_user = 0;
const MAX_USER = 4;

function reqHandler(req, res) {
	if(req.url==='/') req.url = '/index.html';
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
			socket.emit('njofto pozicion', loja.ljt[poz_lirshem].poz);
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
			perditesoKlientet();
			// merr nje dore per vleresim nga lojtari qe ka radhen
		}
		
	});
	socket.on('vlereso doren', function(data) {
		console.log('Erdhi dora per vleresim');
		console.log(data);
		var v_dora = JSON.parse(data);
		var dora = new loja.dore(v_dora.nr_letra, v_dora.letrat, 0, loja.ljt[loja.gjendja.radha], -1);
		if(loja.pranohetDora(dora, loja.gjendja.fusha)) {
			console.log('Dora u pranua, megjithese nuk eshte implementuar logjika e pranimit');
			var doli_lojtari = loja.luajDoren(dora, loja.gjendja.fusha);
			console.log(dora);
			console.log(loja.gjendja.fusha);
			io.sockets.emit('pranohet', {
				hedhesi : dora.hedhesi.emri,
				letrat  : JSON.stringify(dora.letrat),
				pas     : false
			});
			if(doli_lojtari) io.sockets.emit('doli lojtar', { mesazhi : dora.hedhesi.emri + ' doli'});
			if(!loja.gjendja.duhet_vazhduar_loja) {	
				var msg = 'Loja mbaroi';
				console.log(msg);
				io.sockets.emit('fund round', { mesazhi : msg });
			}
			loja.kaloRadhen();
			perditesoKlientet();
		}
		else {
			socket.emit('nuk pranohet', {mesazhi : 'Dora nuk pranohet'}); // mesazhi mund te perpunohet per te shpjeguar arsyen
		}
	});
	socket.on('pas', function(data) {
		console.log('Lojtari beri pas');
		loja.pas(loja.ljt[loja.gjendja.radha]);
		io.sockets.emit('pranohet', {pas : true});
		loja.kaloRadhen();
		perditesoKlientet();
	});
	io.sockets.emit('nr-user', nr_user);
});

function perditesoKlientet() {
	// te dhenat qe duhet ti dije cdo lojtar ne cdo status te lojes
	var perditesimi = {
		mesazhi : 'Perditesimi erdhi',
		ljt : JSON.stringify(loja.ljt, ['emri','poz','dalur','nr_letra']),
		gjendja : JSON.stringify(loja.gjendja, ['radha', 'nr_lojtare', 'lojtare_te_dalur', 'cikel_pas', 'roundi', 'duhet_vazhduar_loja']),
		fusha : JSON.stringify(loja.gjendja.fusha, ['nr_letra', 'vlera', 'hedhesi', 'perparesia']),
		letrat_fushe : JSON.stringify(loja.gjendja.fusha.letrat, ['id', 'vlera', 'lloji', 'kodi', 'ne_loje'])
	}
	io.sockets.emit('perditesim', perditesimi);
	for(var i=0;i<4;i++) freskoLetrat(loja.ljt[i]);
}
function freskoLetrat(lojtar) { lojtar.socket.emit('fresko letrat', JSON.stringify(lojtar.letrat)); }

app.listen(80);
console.log('Server is listening on port 80');

})();