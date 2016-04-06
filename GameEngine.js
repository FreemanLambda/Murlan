var EventEmitter = require( 'events' ).EventEmitter
	, Konstante = require( './elements/Konstante' )
	, Leter = require( './elements/Leter' )
	, Dore = require( './elements/Dore' )
	, Hedhje = require( './elements/Hedhje' )
	, TabeleRadhe = require( './elements/TabeleRadhe' );

exports = module.exports = GameEngine;

function trazoPako() {
	// nderto nje pako letrash dhe trazoje
	var pako = [], id, lloji, vlera, kodi, i;
	for( i = 0; i < 54; i++ ) {
		// id ( 1 - 54 )
		id = i + 1;
		var leter = new Leter( id );
		pako.push( leter );
	}

	// trazimi (1000 shkembime)
	for( i = 0; i < 1000; i++ ) {
		// gjenero dy indekse random dhe shkembeji ne pakon e letrave
		var index1 = Math.floor( Math.random() * 54 ),
			index2 = Math.floor( Math.random() * 54 );
		if( index1 !== index2 ) {
			var tmp = pako[ index1 ];
			pako[ index1 ] = pako[ index2 ];
			pako[ index2 ] = tmp;
		}
	}

	return pako;
}

function shperndajLetrat( lojtaret, pozFillim ) {
	// krijo pako te trazuar
	var pako = trazoPako();

	// shperndaj letrat mes lojtareve ne forme rrethore
	var duart = [];
	var k = pozFillim;
	var nrLojtare = lojtaret.length;

	for( var i = 0; i < nrLojtare; i++ ) {
		duart[ i ] = new Dore( [], lojtaret[ i ].id );
	}
	pako.forEach( function( leter ) {
		duart[ k++ % nrLojtare ].letrat.push( leter );
	} );
	duart.forEach( function( dore ) {
		dore.rendit();
	} );

	return duart;
}

function GameEngine( gjendje ) {
	this._radha = gjendje.radha;
	this._raundi = gjendje.raundi;
	this._cikelPas = gjendje.cikelPas;
	this._lojtaret = gjendje.lojtaret;
	this._rregullat = gjendje.rregullat;
	this._historia = gjendje.historia;
	this._fusha = gjendje.fusha;
	this._duart = gjendje.duart;

	// nderfaqja per sinjalet hyrese dhe dalese
	this.sinjalizuesi = new EventEmitter();
	// caktimi i veprimeve mbi sinjalet hyrese
	var self = this;
	self.sinjalizuesi.on( 'fillo', function( data ) {
		self._fillo( data.lojtaret, data.rregullat );
	} );
	self.sinjalizuesi.on( 'hidh', function( hedhje ) {
		self._shqyrtoHedhjen( hedhje );
	} );
	self.sinjalizuesi.on( 'pas', function( pronar ) {
		self._pas( pronar );
	} );
}

GameEngine.prototype = {

	/**
	 * lojtaret eshte array me objekte lojtaresh
	 * nje lojtar ka id, emer, pozicion, piket aktuale, piket totale dhe booleanen dalur
	 * rregullat eshte nje objekt me vlera true per rregullat ne fuqi
	 */
	_fillo: function( lojtaret, rregullat ) {
		this._raundi = 0;

		this._rregullat = rregullat;
		this._historia = {
			fituesi: null,
			humbesi: null
		};
		this._lojtaret = lojtaret;

		this._nisRaundin();

	},

	_nisRaundin: function() {
		// shperndaj letrat mes lojtareve ne forme rrethore
		var pozFillim = this._roundi ? this._radha : 0;
		this._cikelPas = 0;
		this._fusha = new Hedhje( [], -1 );
		this._duart = shperndajLetrat( this._lojtaret, pozFillim );
		// emit jep radhen
		var radhaFillim = this._kushHedhIPari();
		this._radha = radhaFillim;
		// tabela e radheve eshte array me id-te e lojtareve
		this.tabelaERadheve = new TabeleRadhe( this._lojtaret );
		this.tabelaERadheve.vendosKoken( radhaFillim );
		// vendos bonusin ne maksimum
		this._piketPerLojtarinQeDel = Konstante.MAX_PIKE_PER_RAUND;
		this.sinjalizuesi.emit( 'jep radhen', {
			radha: this._radha,
			fusha: this._fusha,
			duart: this._duart
		} );
	},

	_kushHedhIPari: function() {
		// ne raundin 0 hedh pronari i treshit mac, ne raunde tjera humbesi i kaluar
		var iPari, kaTreshin;
		if( !this._raundi ) {
			this._duart.forEach( function( dore ) {
				kaTreshin = dore.kaLetrenMeKod( 'M3' );
				if( kaTreshin !== -1 ) {
					iPari = kaTreshin;
				}
			} );
		}
		else {
			// normalisht fillon humbesi
			// nese humbesi ka 2 zhola, fillon fituesi
			var humbesiId = this._historia.humbesi
			var doraHumbesit = this._duart.find( function( d ) {
				return d.pronari === humbesiId;
			} );
			iPari = ( doraHumbesit.kaDyZhola() ? this._historia.fituesi : humbesiId );
		}
		return iPari;
	},

	_shqyrtoHedhjen: function( hedhja ) {
		// kontrollo nese lojtari qe hodhi doren e ka radhen tani
		if( hedhja.hedhesi !== this._radha ) {
			this.sinjalizuesi.emit( 'refuzo hedhjen', 'Nuk e ke ti radhen.' );
			return;
		}
		// kontrollo nese hedhja eshte bosh
		if( !hedhja.kodet.length ) {
			this.sinjalizuesi.emit( 'refuzo hedhjen', 'S\'ke hedhur gje.' );
			return;
		}
		// kontrollo nese lojtari i ka me te vertete letrat qe deklaroi ne hedhje
		var doraELojtarit = this._duart.find( function( dore ) {
			return dore.pronari === hedhja.hedhesi;
		} );
		var kaGenjeshter = false;
		hedhja.kodet.forEach( function( kod ) {
			if( doraELojtarit.kaLetrenMeKod( kod ) === -1 ) {
				kaGenjeshter = true;
			}
		} );
		if( kaGenjeshter ) {
			this.sinjalizuesi.emit( 'refuzo hedhjen', 'Nuk i ke letrat qe pretendon se ke.' );
			return;
		}
		// nderto nje hedhje nisur nga te dhenat
		var letrat = [], letra;
		var pronari = hedhja.hedhesi;
		hedhja.kodet.forEach( function( kod ) {
			letra = doraELojtarit.kapLetrenNgaKodi( kod );
			if( letra ) {
				letrat.push( letra );
			}
		} );
		hedhja = new Hedhje( letrat, pronari );
		var pranohet = hedhja.llogaritHedhjen( this._rregullat );
		if( !pranohet ) {
			this.sinjalizuesi.emit( 'refuzo hedhjen', 'Kombinimi i letrave qe hodhet nuk eshte i vlefshem.' );
			return;
		}
		// kontrollo nese eshte hedhja e pare e raundit te pare dhe nuk eshte hedhur M3
		if( !this._raundi && !this._fusha.vlera ) {
			if( !hedhja.kaLetrenMeKod( 'M3' ) ) {
				this.sinjalizuesi.emit( 'refuzo hedhjen', 'Duhet te luash treshin mac patjeter.' );
				return;
			}
		}
		// kontrollo nese hedhja e thyen dot fushen
		if( !hedhja.thyenHedhjen( this._fusha ) ) {
			this.sinjalizuesi.emit( 'refuzo hedhjen', 'Nuk i thyen dot letrat ne fushe me kombinimin qe zgjodhe.' );
			return;
		}
		// ne fund te te gjitha kontrolleve, mbetet qe hedhja duhet pranuar
		this._luajHedhjen( hedhja );
	},

	_luajHedhjen: function( hedhja ) {
		// vendos hedhjen ne fushe
		this._fusha = hedhja;
		// hiq letrat e hedhjes nga dora qe i perket lojtarit hedhes
		var doraELojtarit = this._duart.find( function( dore ) {
			return dore.pronari === hedhja.hedhesi;
		} );
		doraELojtarit.letrat = doraELojtarit.letrat.filter( function( l ) {
			return !hedhja.kaLetrenMeKod( l.kodi );
		} );
		doraELojtarit.nrLetra = doraELojtarit.letrat.length;
		// kthe ne 0 ciklin e paseve
		this._cikelPas = 0;
		// shiko nese lojtari ka dalur
		if( doraELojtarit.nrLetra === 0 ) {
			this.sinjalizuesi.emit( 'doli lojtar', {
				id: doraELojtarit.pronari,
				piket: this._piketPerLojtarinQeDel
			} );
			var lojtariIDalur = this._lojtaret.find( function( ljt ) {
				return ljt.id === hedhja.hedhesi;
			} );
			// jepi piket lojtarit
			lojtariIDalur.piketRaund = this._piketPerLojtarinQeDel;
			lojtariIDalur.piketTotal += this._piketPerLojtarinQeDel;
			this._piketPerLojtarinQeDel--;
			this.tabelaERadheve.fshijRresht( doraELojtarit.pronari );
			// kur del nje lojtar, e vendosim ne -1 ciklin e paseve per te korigjuar
			// llogaritjen e ciklit te plote te paseve
			this._cikelPas--;
			// kontrollo nese ka ngelur vetem nje lojtar ne fushe
			var teNgelur = this._duart.filter( function( d ) {
				return d.letrat.length;
			} );
			if( teNgelur.length <= 1 ) {
				this._mbyllRaundin();
				// mos lejo kalimin e radhes perderisa po mbaron raundi
				return;
			}
		}

		// kalo radhen te lojtari pasardhes
		this._kaloRadhen();

	},

	_pas: function( pronari ) {
		// kontrollo nese nuk eshte radha e lojtarit
		if( pronari !== this._radha ) {
			this.sinjalizuesi.emit( 'refuzo hedhjen', 'Nuk e ke ti radhen.' );
			return;
		}
		this._cikelPas++;
		var lojtareTeDalur = Konstante.MAX_PIKE_PER_RAUND - this._piketPerLojtarinQeDel;
		if( this._cikelPas >= this._duart.length - lojtareTeDalur - 1 ) {
			this._fusha.perparesia = Konstante.PERPARESI_ZERO;
		}
		this._kaloRadhen();
	},

	_kaloRadhen: function() {
		this._radha = this.tabelaERadheve.gjejTjetrin();
		this.sinjalizuesi.emit( 'jep radhen', {
			radha: this._radha,
			fusha: this._fusha,
			duart: this._duart
		} );
	},

	_mbyllRaundin: function() {
		// jepi piket lojtarit te fundit qe ka ngelur
		var doraNgelur = this._duart.find( function( d ) {
			return d.letrat.length;
		} );
		var iNgeluri = this._lojtaret.find( function( ljt ) {
			return ljt.id === doraNgelur.pronari;
		} );
		iNgeluri.piketRaund = this._piketPerLojtarinQeDel;
		iNgeluri.piketTotal += this._piketPerLojtarinQeDel;
		// percakto humbesin dhe fituesin e raundit
		this._historia.humbesi = iNgeluri.id;
		this._historia.fituesi = this._lojtaret.find( function( ljt ) {
			return ljt.piketRaund === Konstante.MAX_PIKE_PER_RAUND;
		} ).id;
		// shpall raundin
		this.sinjalizuesi.emit( 'shpall raundin', {
			piket: this._lojtaret.sort( function( ljt1, ljt2 ) {
				return ljt2.piketRaund - ljt1.piketRaund;
			} ),
			renditja: this._lojtaret.sort( function( ljt1, ljt2 ) {
				return ljt2.piketTotal - ljt1.piketTotal;
			} ),
			historia: this._historia
		} );
		// kontrollo nese ndonje nga lojtaret ka kaluar kufirin e pikeve
		// nese lojtari eshte i vetem, loja mbaron
		// nese dy lojtare kane kaluar me pike te barabarta, loja vazhdon
		var fitimtaretELojes = this._lojtaret.filter( function( ljt ) {
			return ljt.piketTotal >= Konstante.MAX_PIKE_PER_LOJE;
		} );
		var duhetMbyllurLoja = false;
		if( fitimtaretELojes.length === 1 ) {
			duhetMbyllurLoja = true;
		}
		else if( fitimtaretELojes.length > 1 ) {
			fitimtaretELojes.sort( function( ljt1, ljt2 ) {
				return ljt2.piketTotal - ljt1.piketTotal;
			} );
			duhetMbyllurLoja  = ( fitimtaretELojes[ 0 ].piketTotal !== fitimtaretELojes[ 1 ].piketTotal );
		}
		if( duhetMbyllurLoja ) {
			this._mbyllLojen();
			return;
		}

		// kalo ne raundin tjeter
		this._raundi++;
		this._nisRaundin();
	},

	_mbyllLojen: function() {
		this.sinjalizuesi.emit( 'mbyll lojen', {
			renditja: this._lojtaret.sort( function( ljt2, ljt1 ) {
				return ljt1.piketTotal - ljt2.piketTotal;
			} )
		} );
	}
};
