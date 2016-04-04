function Dore( pronari, letrat, maxLetra ) {
	this.pronari = pronari,
	this.letrat = letrat,
	this.maxLetra = maxLetra
}

Dore.prototype = {
	rendit: function() {
		this.letrat.sort( function( l1, l2 ) {
			return l1.vlera - l2.vlera;
		} );
	},

	kaLetrenMeKod: function( kod ) {
		var kaLetren = this.letrat.filter( function( l ) {
			return l.kodi === kod;
		} );
		if( kaLetren.length ) {
			return this.pronari;
		}
		else {
			return -1;
		}
	},

	kapLetrenNgaKodi: function( kod ) {
		return this.letrat.find( function( l ) {
			return l.kodi === kod;
		} );
	},

	kaDyZhola: function() {
		return ( this.kaLetrenMeKod( 'KZ' ) !== -1 ) && ( this.kaLetrenMeKod( 'ZZ' ) !== -1 );
	},

	paraqitBukur: function() {
		var paraqitja = this.letrat.sort( function( l1, l2 ) {
			return l1.vlera - l2.vlera;
		} ).map( function( l ) {
			return l.kodi;
		} ).join( ' ' );
		return paraqitja || 'Bosh';
	}
}

function DoreException( error ) {
	this.errorId = error.errorId;
	this.msg = error.msg;
}

exports = module.exports = Dore;
