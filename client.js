// globale per klientin ne fjale
var socket;
var poz;
var letrat;
// globale per te gjithe lojtaret dhe gjendjen
var ljt;
var gjendja;
// elementet per output
var konsol;
var dritarja;

function logo(vendi, mjeti, mesazhi) {
	if(!mjeti) mjeti = 'p';
	elem = '<' + mjeti + '>' + mesazhi + '</' + mjeti + '>';
	$(vendi).prepend(elem);
}

function dore(nr_letra, letrat, vlera, hedhesi, perparesia) {this.nr_letra=nr_letra; this.letrat=letrat; 
	this.vlera=vlera; this.hedhesi=hedhesi; this.perparesia=perparesia;}

function lidhu(name) {
	socket = io.connect();
	socket.emit('krijo lojtar', name)
	socket.on('nr-user', function(data) { logo(konsol, null, 'Usera te lidhur: '+data); });
	socket.on('njofto pozicion', function(data) { poz = parseInt(data); });
	socket.on('gati', function(data) {
		logo(konsol, null, data.mesazhi);
		var ljt = $.parseJSON(data.ljt);
		for(var i=0;i<data.max_user;i++) logo(konsol, null, 'Lojtari: '+ljt[i].emri + ', '+'pozicioni ' + ljt[i].poz);
	});
	socket.on('plot', function(data) { logo(konsol, null, data); });
	socket.on('fresko letrat', function(data) {
		letrat = $.parseJSON(data);
		var mesazhi = 'Letrat tuaja jane: ';
		for(var i=0;i<letrat.length;i++) mesazhi+= letrat[i].kodi + ', ';
		logo(konsol, null, mesazhi);
	});
	socket.on('perditesim', function(data) {
		logo(konsol, null, data.mesazhi);
		ljt = $.parseJSON(data.ljt);
		gjendja = $.parseJSON(data.gjendja);
		gjendja.fusha = $.parseJSON(data.fusha);
		gjendja.fusha.letrat = $.parseJSON(data.letrat_fushe);
		logo(dritarja, null, 'Radhen per te luajtur e ka ' + ljt[gjendja.radha].emri);
		if(gjendja.radha === poz) {
			if(gjendja.fusha.perparesia===-2) logo(konsol, null, 'Jeni i lire te hidhni cfare te deshironi!'); // -2 duhet bere -1
			else {
				var msg_letrat = 'Letrat ne fushe jane: ';
				for(var i=0;i<gjendja.fusha.nr_letra;i++) if(gjendja.fusha.letrat[i]) 
					msg_letrat += (gjendja.fusha.letrat[i].kodi + ', ');
				msg_letrat += ('hedhur nga ' + gjendja.fusha.hedhesi.emri);
				logo(dritarja, null, msg_letrat);
			}
		}
	});
	socket.on('pranohet', function(data) {
		if(data.pas) logo(dritarja, null, ljt[gjendja.radha].emri + ' beri pas.');
		else logo(dritarja, null, ljt[gjendja.radha].emri + ' hodhi letra ne fushe.');
	});
	socket.on('nuk pranohet', function(data) {
		logo(konsol, null, data.mesazhi);
	});
	socket.on('doli lojtar', function(data) {
		logo(dritarja, null, data.mesazhi);
	});
	socket.on('fund round', function(data) {
		logo(dritarja, null, data.mesazhi);
	});
}

$(document).ready(function() {
	konsol = document.getElementById('console');
	dritarja = document.getElementById('dritarja');
	
	$('#lidhu').click(function() {
		var name = $('input[name="ljt_emri"]').val();
		lidhu(name);
	});
	
	$('#hidh').click(function() {
		// nderto doren ne varesi te inputit
		var str_dora = $('input[name="dora"]').val();
		var arr_dora = str_dora.split(' ');
		for(var i=0;i<arr_dora.length;i++) arr_dora[i] = parseInt(arr_dora[i]);
		var d_letrat = new Array();
		for(var i=0;i<arr_dora.length;i++) d_letrat.push(letrat[arr_dora[i]-1]);
		var dora = new dore(arr_dora.length, d_letrat, 0, 0, -1);
		// dergo doren per kontroll ne server
		socket.emit('vlereso doren', JSON.stringify(dora));
	});
	$('#pas').click(function() {
		logo(konsol, null, 'Eee, bona pas!');
		socket.emit('pas', {});
	});
	
	
	
});