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

function kapLojtarNgaRadha( radha ) {
	return lojtaret.find( function( ljt ) {
		return ljt.id === radha;
	} );
}

var stdin = process.openStdin();

// trajtimi i sinjaleve ne dalje te GameEngine
var Hedhje = require( './elements/Hedhje' );
ge.sinjalizuesi.on( 'jep radhen', function( data ) {
	var ljt = kapLojtarNgaRadha( data.radha );
	var doraLjt = data.duart.find( function( d ) {
		return d.pronari === data.radha;
	} );
	//console.log( 'radhen e ka: ' + ljt.emer + ' (' + ljt.id + ')' );
	//console.log( data.fusha.paraqitBukur() );
	//console.log( doraLjt.paraqitBukur() );
	setTimeout( function() {
		var i = 0, eThen = false, h, m3 = doraLjt.kapLetrenNgaKodi( 'M3' );
		if( !ge._raundi && m3 ) {
			h = new Hedhje( [ m3 ], data.radha );
			eThen = true;
		}
		else {
			do {
				h = new Hedhje( [ doraLjt.letrat[ i ] ], data.radha );
				h.llogaritHedhjen();
				eThen = h.thyenHedhjen( data.fusha );
				i++;
			} while( !eThen && i < doraLjt.letrat.length );
		}

		if( eThen ) {
			var kodet = h.letrat.map( function( l ) {
				return l.kodi;
			} );
			//console.log( ljt.emer + ' hodhi ' + kodet[ 0 ] );
			ge.sinjalizuesi.emit( 'hidh', {
				hedhesi: h.hedhesi,
				kodet: kodet
			} );
		}
		else {
			//console.log( ljt.emer + ' beri pas' );
			ge.sinjalizuesi.emit( 'pas', data.radha );
		}
	}, 1 );
} );

ge.sinjalizuesi.on( 'refuzo hedhjen', function( arsye ) {
	console.log( arsye );
} );

ge.sinjalizuesi.on( 'doli lojtar', function( data ) {
	//console.log( 'doli lojtari: ' + lojtaret[ data.id ].emer );
	//console.log( 'fitoi ' + data.piket + ' pike' );
} );

ge.sinjalizuesi.on( 'shpall raundin', function( data ) {
	// console.log( 'Raundi mbaroi' );
	// console.log( 'Piket e raundit: ' );
	// console.log( data.piket );
	// console.log( 'Renditja e pergjithshme:' );
	// console.log( data.renditja );
	// console.log( 'Raundin tjeter (' + data.historia.humbesi + ') do i jape leter (' + data.historia.fituesi + ')' );
} );

var lojraGjithsej = 0;
ge.sinjalizuesi.on( 'mbyll lojen', function( data ) {
	lojraGjithsej++;
	if( lojraGjithsej > 99 ) {
		console.log('boll mo!');
		return;
	}
	console.log( 'Loja mbaroi! Renditja perfundimtare:' );
	console.log( data.renditja );
	lojtaret.forEach( function( ljt ) {
		ljt.piketTotal = 0;
	} );
	ge.sinjalizuesi.emit( 'fillo', {
		lojtaret: lojtaret,
		rregullat: {}
	} );
} );

// futja e sinjaleve ne hyrje te GameEngine
// stdin.addListener( 'data', function( d ) {
//     var consoleInput = ( d.toString().trim() );
// 	var parts = consoleInput.split( ' ' );
// 	var hedhja = {
// 		hedhesi: parseInt( parts[ 0 ] ),
// 		kodet: parts.splice( 1 )
// 	}
// 	if( hedhja.kodet[ 0 ] === 'pas' ) {
// 		ge.sinjalizuesi.emit( 'pas', hedhja.pronari );
// 	}
// 	else {
// 		ge.sinjalizuesi.emit( 'hidh', hedhja );
// 	}
//
// });

ge.sinjalizuesi.emit( 'fillo', {
	lojtaret: lojtaret,
	rregullat: {}
} );
