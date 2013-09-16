
var socket;
var letrat;

function logo(vendi, mjeti, mesazhi) {
	if(!vendi) vendi = document.getElementById('console');
	if(!mjeti) mjeti = 'p';
	elem = '<' + mjeti + '>' + mesazhi + '</' + mjeti + '>';
	$(vendi).prepend(elem);
}

function lidhu(name) {
	socket = io.connect();
	socket.emit('krijo lojtar', name)
	socket.on('nr-user', function(data) {
		//$('#nr-user').html('Users connected: ' + data);
		logo(null, null, 'Usera te lidhur: '+data);
	});
	socket.on('gati', function(data) {
		logo(null, null, data.mesazhi);
		var ljt = $.parseJSON(data.ljt);
		//for(var i=0;i<data.max_user;i++) console.log('Lojtari: '+ljt[i].emri + ', '+'pozicioni ' + ljt[i].poz);
		for(var i=0;i<data.max_user;i++) logo(null, null, 'Lojtari: '+ljt[i].emri + ', '+'pozicioni ' + ljt[i].poz);
		
	});
	socket.on('plot', function(data) {
		logo(null, null, data);
	});
	socket.on('fresko letrat', function(data) {
		letrat = $.parseJSON(data);
		var mesazhi = 'Letrat tuaja jane: ';
		for(var i=0;i<letrat.length;i++) mesazhi+= letrat[i].kodi + ', ';
		logo(null, null, mesazhi);
	});
}

$(document).ready(function() {
	$('#lidhu').click(function() {
		var name = $('input[name="ljt_emri"]').val();
		lidhu(name);
	});
});