var Konstante = require( './Konstante' )
	, RregullatBaze = require( './RregullatBaze' );

/**
 * letrat jane te renditura
 */
function eshteKolor( letrat, rregullat ) {
	var nrLetra = letrat.length;
	var fillimi = letrat[ 0 ].vlera, fundi = letrat[ nrLetra - 1 ].vlera;
	// kontrollo per 131
	if( rregullat.kolor131 && letrat.length === 5 ) {
		var eshte131 = true;
		if( fillimi !== fundi - 2 ) {
			eshte131 = false;
		}
		for( var i = 1; i < 4; i++ ) {
			if( letrat[ i ].vlera !== fillimi + 1 ) {
				eshte131 = false;
			}
		}
		return eshte131;
	}
	// kontrollo per zhola ne kolor
	if( !rregullat.kolorMeZhol && fundi > 15 ) {
		return false;
	}
	// kontrollo per kolor qe fillon me as ose dysh

	// kontrollo per kolor normal
	var eshteKolor = true, diferencaMesLetrave, i;
	for( i = 0; i < nrLetra - 1; i++ ) {
		diferencaMesLetrave = letrat[ i + 1 ].vlera - letrat[ i ].vlera;
		eshteKolor = eshteKolor && ( diferencaMesLetrave === 1 );
	}
	// nese lejohet kolori me As dhe Dysh ne fillim, bej nje kontroll te dyte
	if( !eshteKolor && rregullat.kolorMeAs ) {
		// nese hedhja permban nje leter me vleren 13, kontrolli nuk duhet bere
		var kaDerr = letrat.find( function( l ) {
			return l.vlera === 13;
		} );
		if( kaDerr ) {
			return false;
		}
		// kur nuk ka derr, zbresim me 13 vleren e asit dhe dyshit
		eshteKolor = true;
		letrat = letrat.map( function( l ) {
			l.vlera = l.vlera > 13 ? l.vlera - 13 : l.vlera;
			return l;
		} ).sort( function( l1, l2 ) {
			return l1.vlera - l2.vlera;
		} );
		for( i = 0; i < nrLetra - 1; i++ ) {
			diferencaMesLetrave = letrat[ i + 1 ].vlera - letrat[ i ].vlera;
			eshteKolor = eshteKolor && ( diferencaMesLetrave === 1 );
		}
	}
	return eshteKolor;
}

function Hedhje( letrat, hedhesi ) {
	this.letrat = letrat;
	this.hedhesi = hedhesi;
	this.perparesia = Konstante.PERPARESI_ZERO;
	this.vlera = 0;
}

Hedhje.prototype = {

	renditLetrat: function() {
		this.letrat.sort( function( l1, l2 ) {
			return l1.vlera - l2.vlera;
		} );
	},

	kontrolloVlefshmerine: function( rregullat ) {
		if( typeof rregullat === 'undefined' ) {
			rregullat = RregullatBaze;
		}
		var nrLetra = this.letrat.length;
		// hedhjet me 1 leter jane gjithmone te vlefshme
		if( nrLetra === 1 ) {
			return true;
		}
		// hedhjet me 2, 3 ose 4 letra te njejta
		// trajtojme rastin e vecante te hedhjes se dy zholave
		if( rregullat.lejohenDyZhola ) {
			return ( nrLetra === 2 && this.letrat[ 0 ].id === 53 && this.letrat[ 1 ].id === 54 );
		}
		if( nrLetra < 5 ) {
			var vlera = this.letrat[ 0 ].vlera, teNjejta = true;
			this.letrat.forEach( function( l ) {
				teNjejta = teNjejta && ( l.vlera === vlera );
			} );
			return teNjejta;
		}
		// 5 letra e lart, kontrollojme per kolor, pasi ti kemi renditur letrat
		this.renditLetrat();
		return eshteKolor( this.letrat, rregullat );
	},

	llogaritHedhjen: function( rregullat ) {
		if( typeof rregullat === 'undefined' ) {
			rregullat = RregullatBaze;
		}
		if( !this.kontrolloVlefshmerine( rregullat ) ) {
			return false;
		}
		var nrLetra = this.letrat.length;
		// cakto nivelin e perparesise
		if( nrLetra < 4 ) {
			this.perparesia = Konstante.PERPARESI_NORMALE;
		}
		else if( nrLetra === 4 ) {
			this.perparesia = Konstante.PERPARESI_BOMBE;
		}
		else if( nrLetra > 4 && nrLetra < 16 ) {
			// kontrollo a kemi kolor njengjyresh (shkalle)
			var lloji = this.letrat[ 0 ].lloji, teNjejta = true;
			this.letrat.forEach( function( l ) {
				teNjejta = teNjejta && ( l.lloji === lloji );
			} );
			this.perparesia = teNjejta ? Konstante.PERPARESI_SHKALLE : Konstante.PERPARESI_NORMALE;
		}
		// llogarit vleren e hedhjes
		this.vlera = this.letrat.reduce( function( total, l ) {
			return total + l.vlera;
		}, 0 );
		// shto peshen e perparesise
		this.vlera += 1000 * this.perparesia;
		return true;
	},

	thyenHedhjen: function( hedhjaTjeter, rregullat ) {
		if( typeof rregullat === 'undefined' ) {
			rregullat = RregullatBaze;
		}
		// perparesia percakton thyerjen pavaresisht rregullave
		if( this.perparesia > hedhjaTjeter.perparesia ) {
			return true;
		}
		else if( this.perparesia < hedhjaTjeter.perparesia ) {
			return false;
		}
		// hedhje normale (perparesi te njejta)
		// duhet numer i njejte letrash
		var nrLetra = this.letrat.length;
		if( nrLetra !== hedhjaTjeter.letrat.length ) {
			return false;
		}
		// duhet vlere me e larte se hedhja tjeter
		if( this.vlera <= hedhjaTjeter.vlera ) {
			return false;
		}
		// ne rast kolori aplikojme thyerjen me "nji me shume" ose "disa me shume"
		if( nrLetra > 4 ) {
			// rendisim letrat per rastin e koloreve qe fillojne me As ose Dysh
			hedhjaTjeter.renditLetrat();
			var koeficientiDiference = rregullat.kolorNjeMeShume ? 1 : this.letrat[ 0 ].vlera - hedhjaTjeter.letrat[ 0 ].vlera;
			var diferencaELejuar = koeficientiDiference * nrLetra;
			return ( this.vlera - hedhjaTjeter.vlera === diferencaELejuar );
		}
		// ne fund te kontrolleve ngelet qe hedhja eshte thyerse
		return true;
	},

	kaLetrenMeKod: function( kod ) {
		return this.letrat.find( function( l ) {
			return l.kodi === kod;
		} ) || false;
	},

	paraqitBukur: function() {
		var paraqitjaLetra = this.letrat.sort( function( l1, l2 ) {
			return l1.vlera - l2.vlera;
		} ).map( function( l ) {
			return l.kodi;
		} ).join( ' ' );
		paraqitjaLetra = paraqitjaLetra || 'Bosh';
		return paraqitjaLetra + ' hedhes (' + this.hedhesi + ') p=' + this.perparesia;
	}

}

exports = module.exports = Hedhje;
