var express = require( 'express' )
	, winston = require( 'winston' )
    , config = require( 'config' )
    , app = express()
    , http = require( 'http' ).Server( app )
	, GameEngine = require( './GameEngine' )
	, Lojtar = require( './elements/Lojtar' );

/**
 * Load controllers
 */
app.use( require( './controllers' ) );

/**
 * Start listening...
 */
// var server = http.listen( config.get( 'server.port' ), function () {
//     winston.log( 'info', 'Classroom app listening at %s', config.get( 'server.host' ) + ':' + config.get( 'server.port' ) );
// } );

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

var ge = new GameEngine( {} );

var lojtaret = [
	new Lojtar( 0, 'Edra', 0 ),
	new Lojtar( 1, 'Mario', 1 ),
	new Lojtar( 2, 'Azmi', 2 ),
	new Lojtar( 3, 'Miri', 3 )
];

var stdin = process.openStdin();

// trajtimi i sinjaleve ne dalje te GameEngine
ge.sinjalizuesi.on( 'jep radhen', function( data ) {
	console.log( 'radhen e ka: ' + lojtaret[ data.radha ].emer + ' (' + lojtaret[ data.radha ].id + ')' );
	console.log( data.fusha.paraqitBukur() );
	console.log( data.duart[ data.radha ].paraqitBukur() );
} );

ge.sinjalizuesi.on( 'refuzo hedhjen', function( arsye ) {
	console.log( arsye );
} );

ge.sinjalizuesi.on( 'doli lojtar', function( data ) {
	console.log( 'doli lojtari: ' + lojtaret[ data.id ].emer );
	console.log( 'fitoi ' + data.piket + ' pike' );
} );

ge.sinjalizuesi.on( 'shpall raundin', function( data ) {
	console.log( 'Raundi mbaroi' );
	console.log( 'Piket e raundit: ' );
	console.log( data.piket );
	console.log( 'Renditja e pergjithshme:' );
	console.log( data.renditja );
	console.log( 'Raundin tjeter (' + data.historia.humbesi + ') do i jape leter (' + data.historia.fituesi + ')' );
} );

ge.sinjalizuesi.on( 'mbyll lojen', function( data ) {
	console.log( 'Loja mbaroi! Renditja perfundimtare:' );
	console.log( data.renditja );
} );

// futja e sinjaleve ne hyrje te GameEngine
stdin.addListener( 'data', function( d ) {
    var consoleInput = ( d.toString().trim() );
	var parts = consoleInput.split( ' ' );
	var hedhja = {
		pronari: parseInt( parts[ 0 ] ),
		kodet: parts.splice( 1 )
	}
	if( hedhja.kodet[ 0 ] === 'pas' ) {
		ge.sinjalizuesi.emit( 'pas', hedhja.pronari );
	}
	else {
		ge.sinjalizuesi.emit( 'hidh', hedhja );
	}

});

ge.sinjalizuesi.emit( 'fillo', {
	lojtaret: lojtaret,
	rregullat: {}
} );
