
var socket;
function lidhu(name) {
	socket = io.connect();
	socket.emit('create player', name)
	socket.on('nr-user', function(data) {
		$('#nr-user').html('Users connected: ' + data);
	});
	socket.on('ready', function(data) {
		$('#udhezim').html(data);
	});
	socket.on('full', function(data) {
		$('#udhezim').html(data);
	});
}

$(document).ready(function() {
	$('#lidhu').click(function() {
		var name = $('input[name="ljt_emri"]').val();
		lidhu(name);
	});
});