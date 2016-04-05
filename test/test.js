var should = require( 'should' )
    , Konstante = require( '../elements/Konstante' )
    , Lojtar = require( '../elements/Lojtar' )
    , Leter = require( '../elements/Leter' )
    , TabeleRadhe = require( '../elements/TabeleRadhe' )
    , Hedhje = require( '../elements/Hedhje' )
    , Dore = require( '../elements/Dore' )
    , GameEngine = require( '../GameEngine' );

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

// ndertojme nje pako te trazuar per testet
var pako = trazoPako();

describe( 'Leter', function() {
    it( 'Konstruktori pranon nje id, numer nga 1 ne 54', function() {
        ( function() {
            new Leter()
        } ).should.throw();
        ( function() {
            new Leter( 3 ).should.be.instanceOf( Leter )
        } ).should.not.throw();
        ( function() {
            new Leter( 0 );
        } ).should.throw();
        ( function() {
            new Leter( "foo" );
        } ).should.throw();
        ( function() {
            new Leter( 58 );
        } ).should.throw();
        ( function() {
            new Leter( 54 );
        } ).should.not.throw();
    } );

    it( 'Te dhenat e letres mund te nxirren matematikisht nisur nga id', function() {
        var l1 = new Leter( 1 );
        l1.kodi.should.equal( 'S3' );
        var l2 = new Leter( 10 );
        l2.kodi.should.equal( 'S12' );
        var l3 = new Leter( 25 );
        l3.kodi.should.equal( 'D1' );
        var l4 = new Leter( 27 );
        l4.kodi.should.equal( 'M3' );
        var l5 = new Leter( 39 );
        l5.kodi.should.equal( 'M2' );
        var l6 = new Leter( 46 );
        l6.kodi.should.equal( 'K9' );
        var l7 = new Leter( 1 );
        l7.kodi.should.equal( 'S3' );
        var l8 = new Leter( 53 );
        l8.kodi.should.equal( 'ZZ' );
        var l9 = new Leter( 54 );
        l9.kodi.should.equal( 'KZ' );
    } );
} );

describe( 'TabelaRadhe', function() {

    var lojtaret = [
        new Lojtar( 23, 'Edra', 2 ),
        new Lojtar( 44, 'Mario', 3 ),
        new Lojtar( 123, 'Azmi', 1 ),
        new Lojtar( 16, 'Miri', 0 )
    ];
    var tabela = new TabeleRadhe( lojtaret );

    describe( 'Funksionet baze', function() {

        it( 'lojtaret duhet te jene te renditur sipas pozicioneve (poz)', function() {
            tabela._rreshtat[ 0 ].should.equal( 16 );
            tabela._rreshtat[ 1 ].should.equal( 123 );
            tabela._rreshtat[ 2 ].should.equal( 23 );
            tabela._rreshtat[ 3 ].should.equal( 44 );
        } );

        it( 'vendosim (gjasme rastesisht) koken te lojtari i trete ne radhe', function() {
            tabela.vendosKoken( 23 );
            tabela._koka.should.equal( 2 );
        } );

        it( 'zhvendosjet behen me nga nje pozicion, ne forme rrethore, si ne tavoline', function() {
            tabela.gjejTjetrin().should.equal( 44 );
            tabela.gjejTjetrin().should.equal( 16 );
            tabela.gjejTjetrin().should.equal( 123 );
            tabela.gjejTjetrin().should.equal( 23 );
            tabela.gjejTjetrin().should.equal( 44 );
        } );

        it( 'fshirja e nje rreshti ul numrin e lojtareve, por nuk prishen sistemin e kalimit te radhes', function() {
            tabela.fshijRresht( 44 );
            tabela._rreshtat.should.have.lengthOf( 3 );
            tabela.gjejTjetrin().should.equal( 16 );
            tabela.gjejTjetrin().should.equal( 123 );
            tabela.gjejTjetrin().should.equal( 23 );
            tabela.gjejTjetrin().should.equal( 16 );
            tabela.fshijRresht( 23 );
            tabela.gjejTjetrin().should.equal( 123 );
            tabela.gjejTjetrin().should.equal( 16 );
            tabela.gjejTjetrin().should.equal( 123 );
        } );
    } );

    describe( 'Konstruktori', function() {

        it( 'argumenti bosh nuk lejohet', function() {
            ( function() {
                new TabeleRadhe();
            } ).should.throw();
        } );

        it( 'argumenti duhet te jete i iterueshem me length me te madh se 0', function() {
            ( function() {
                new TabeleRadhe( 100 );
            } ).should.throw();
            ( function() {
                new TabeleRadhe( [] );
            } ).should.throw();
        } );

        it( 'elementet e argumentit duhet te fusha `id` dhe `poz` me vlera numerike pozitive ose 0', function() {
            ( function() {
                new TabeleRadhe( { id: 1 }, { poz: 2 } );
            } ).should.throw();
            ( function() {
                new TabeleRadhe( { id: "foo", poz: "bar" } );
            } ).should.throw();
            ( function() {
                new TabeleRadhe( { id: 1, poz: -1 } );
            } ).should.throw();
            ( function() {
                new TabeleRadhe( { id: -3, poz: 0 } );
            } ).should.throw();
        } );

    } );

    describe( 'Perjashtimet', function() {

        it( '#vendosKoken dhe #fshijRresht zbatohen vetem mbi elemente qe ekzistojne mes rreshtave', function() {
            // #vendosKoken
            ( function() {
                tabela.vendosKoken( 100 );
            } ).should.throw();
            ( function() {
                tabela.vendosKoken( "foo" );
            } ).should.throw();
            ( function() {
                tabela.vendosKoken( -3 );
            } ).should.throw();
            ( function() {
                tabela.vendosKoken( 16 );
            } ).should.not.throw();
            // #fshijRresht
            ( function() {
                tabela.fshijRresht( 16 );
            } ).should.not.throw();
            ( function() {
                tabela.fshijRrest( 100 );
            } ).should.throw();
            ( function() {
                tabela.fshijRresht( "16" );
            } ).should.throw();
            ( function() {
                tabela.fshijRresht( 123 );
            } ).should.not.throw();
            ( function() {
                tabela.fshijRresht( 16 );
            } ).should.throw();
        } );

        it( '#gjejTjetrin nuk zbatohet mbi tabelen boshe', function() {
            ( function() {
                tabela.gjejTjetrin();
            } ).should.throw();
        } );

    } );

} );

describe( 'Hedhje', function() {

    describe( 'Funksionet baze', function() {

        var hedhja = new Hedhje( pako.slice( 0, 13 ), 0 );

        it( '#renditLetrat i rreshton letrat e hedhjes ne rend rrites', function() {
            hedhja.renditLetrat();
            for( var i = 1; i < hedhja.letrat.length; i++ ) {
                hedhja.letrat[ i ].vlera.should.be.above( hedhja.letrat[ i -1 ].vlera - 1 );
            }
        } );

        it( '#kaLetrenMeKod verteton nese letra e dhene eshte pjese e hedhjes', function() {
            var letrat1 = [
                new Leter( 1 ),
                new Leter( 2 ),
                new Leter( 53 ),
                new Leter( 14 )
            ];
            var hedhja1 = new Hedhje( letrat1, 0 );

            hedhja1.kaLetrenMeKod( 'S3' ).should.be.instanceOf( Leter ).and.have.property( 'vlera', 3 );
            hedhja1.kaLetrenMeKod( 'S4' ).should.be.instanceOf( Leter ).and.have.property( 'lloji', 'Spathi' );
            hedhja1.kaLetrenMeKod( 'S5' ).should.not.be.instanceOf( Leter );
            hedhja1.kaLetrenMeKod( 'ZZ' ).should.be.instanceOf( Leter ).and.have.property( 'id', 53 );
            hedhja1.kaLetrenMeKod( 'KZ' ).should.equal( false );
            hedhja1.kaLetrenMeKod( 'M3' ).should.equal( false );
            hedhja1.kaLetrenMeKod( 'D3' ).should.be.instanceOf( Leter );
        } );

        it( '#kontrolloVlefshmerine vendos nese kombinimi i letrave i permbahet rregullave te lojes', function() {
            // nje leter e vetme
            var letrat2 = [ new Leter( 40 ) ];
            var hedhja2 = new Hedhje( letrat2, 0 );
            hedhja2.kontrolloVlefshmerine().should.equal( true );
            // 2 letra te njejta ne vlere
            var letrat3 = [ new Leter( 15 ), new Leter( 28 ) ];
            var hedhja3 = new Hedhje( letrat3, 0 );
            hedhja3.kontrolloVlefshmerine().should.equal( true );
            // 2 zhola
            var letrat4 = [ new Leter( 53 ), new Leter( 54 ) ];
            hedhja4 = new Hedhje( letrat4, 0 );
            hedhja4.kontrolloVlefshmerine( { lejohenDyZhola: true } ).should.equal( true );
            hedhja4.kontrolloVlefshmerine( { lejohenDyZhola: false } ).should.equal( false );
            // 3 letra me ndryshim
            var letrat5 = [ new Leter( 16 ), new Leter( 29 ), new Leter( 41 ) ];
            var hedhja5 = new Hedhje( letrat5, 0 );
            hedhja5.kontrolloVlefshmerine().should.equal( false );
            // kolor normal
            var letrat6 = [ new Leter( 42 ), new Leter( 43 ), new Leter( 44 ), new Leter( 45 ), new Leter( 46 ) ];
            var hedhja6 = new Hedhje( letrat6, 0 );
            hedhja6.kontrolloVlefshmerine().should.equal( true );
            // kolor 131
            var letrat7 = [ new Leter( 43 ), new Leter( 44 ), new Leter( 45 ), new Leter( 18 ), new Leter( 31 ) ];
            var hedhja7 = new Hedhje( letrat7, 0 );
            hedhja7.kontrolloVlefshmerine( { kolor131: false } ).should.equal( false );
            hedhja7.kontrolloVlefshmerine( { kolor131: true } ).should.equal( true );
            // kolor me as ose dysh ne fillim
            var letrat8 = [ new Leter( 1 ), new Leter( 2 ), new Leter( 3 ), new Leter( 4 ), new Leter( 12 ), new Leter( 13 ) ];
            var hedhja8 = new Hedhje( letrat8, 0 );
            hedhja8.kontrolloVlefshmerine( { kolorMeAs: false } ).should.equal( false );
            hedhja8.kontrolloVlefshmerine( { kolorMeAs: true } ).should.equal( true );
            var letrat9 = [ new Leter( 1 ), new Leter( 2 ), new Leter( 3 ), new Leter( 4 ), new Leter( 13 ), new Leter( 5 ) ];
            var hedhja9 = new Hedhje( letrat9, 0 );
            hedhja9.kontrolloVlefshmerine( { kolorMeAs: false } ).should.equal( false );
            hedhja9.kontrolloVlefshmerine( { kolorMeAs: true } ).should.equal( true );
            // kolor me zhol
            var letrat10 = [ new Leter( 11 ), new Leter( 12 ), new Leter( 13 ), new Leter( 53 ), new Leter( 54 ) ];
            var hedhja10 = new Hedhje( letrat10, 0 );
            hedhja10.kontrolloVlefshmerine( { kolorMeZhol: false } ).should.equal( false );
            hedhja10.kontrolloVlefshmerine( { kolorMeZhol: true } ).should.equal( true );
            // kolor i pavlefshem
            var letrat11 = [ new Leter( 42 ), new Leter( 40 ), new Leter( 44 ), new Leter( 45 ), new Leter( 46 ) ];
            var hedhja11 = new Hedhje( letrat11, 0 );
            hedhja11.kontrolloVlefshmerine().should.equal( false );
        } );

        it( '#llogaritHedhjen i vendos vleren dhe perparesine hedhjes, nese eshte e vlefshme', function() {
            // dore normale me 1, 2 ose 3 letra
            var letrat1 = [ new Leter( 40 ) ];
            var hedhja1 = new Hedhje( letrat1, 0 );
            hedhja1.llogaritHedhjen();
            hedhja1.should.have.properties( { vlera: 3, perparesia: Konstante.PERPARESI_NORMALE } );
            hedhja1.letrat.push( new Leter( 27 ) );
            hedhja1.llogaritHedhjen();
            hedhja1.should.have.properties( { vlera: 6, perparesia: Konstante.PERPARESI_NORMALE } );
            hedhja1.letrat.push( new Leter( 28 ) );
            hedhja1.llogaritHedhjen().should.equal( false );
            // bombe
            var letrat2 = [ new Leter( 5 ), new Leter( 18 ), new Leter( 31 ), new Leter( 44 ) ];
            var hedhja2 = new Hedhje( letrat2, 0 );
            hedhja2.llogaritHedhjen();
            hedhja2.should.have.properties( { vlera: 1028, perparesia: Konstante.PERPARESI_BOMBE } );
            hedhja2.letrat.splice( 0, 1 );
            hedhja2.letrat.push( new Leter( 53 ) );
            hedhja2.llogaritHedhjen().should.equal( false );
            // kolor normal
            var letrat3 = [ new Leter( 16 ), new Leter( 30 ), new Leter( 31 ), new Leter( 32 ), new Leter( 33 ), new Leter( 34 ), new Leter( 35 ) ];
            var hedhja3 = new Hedhje( letrat3, 0 );
            hedhja3.llogaritHedhjen();
            hedhja3.should.have.properties( { vlera: 56, perparesia: Konstante.PERPARESI_NORMALE } );
            // kolor shkalle
            hedhja3.letrat.splice( 0, 1 );
            hedhja3.letrat.push( new Leter( 29 ) );
            hedhja3.llogaritHedhjen();
            hedhja3.should.have.properties( { vlera: 2056, perparesia: Konstante.PERPARESI_SHKALLE } );
            // kolor me as
            var letrat4 = [ new Leter( 38 ), new Leter( 26 ), new Leter( 14 ), new Leter( 2 ), new Leter( 42 ) ];
            var hedhja4 = new Hedhje( letrat4, 0 );
            hedhja4.llogaritHedhjen( { kolorMeAs: true } );
            hedhja4.should.have.properties( { vlera: 15, perparesia: Konstante.PERPARESI_NORMALE } );
            // asi dhe dyshi trajtohen normalisht kur vijne pas derrit
            var letrat5 = [ new Leter( 38 ), new Leter( 26 ), new Leter( 48 ), new Leter( 49 ), new Leter( 24 ) ];
            var hedhja5 = new Hedhje( letrat5, 0 );
            hedhja5.llogaritHedhjen( { kolorMeAs: true } );
            hedhja5.should.have.properties( { vlera: 65, perparesia: Konstante.PERPARESI_NORMALE } );
            // kolor me zhola
            var letrat6 = [ new Leter( 38 ), new Leter( 26 ), new Leter( 48 ), new Leter( 49 ), new Leter( 24 ), new Leter( 53 ) ];
            var hedhja6 = new Hedhje( letrat6, 0 );
            hedhja6.llogaritHedhjen( { kolorMeZhol: true } );
            hedhja6.should.have.properties( { vlera: 81, perparesia: Konstante.PERPARESI_NORMALE } );
            hedhja6.letrat.push( new Leter( 54 ) );
            hedhja6.llogaritHedhjen( { kolorMeZhol: false } ).should.equal( false );
            // kolor 131
            var letrat7 = [ new Leter( 18 ), new Leter( 19 ), new Leter( 6 ), new Leter( 45 ), new Leter( 33 ) ];
            var hedhja7 = new Hedhje( letrat7, 0 );
            hedhja7.llogaritHedhjen( { kolor131: true } );
            hedhja7.should.have.properties( { vlera: 40, perparesia: Konstante.PERPARESI_NORMALE } );
            hedhja7.letrat[ 2 ] = new Leter( 7 );
            hedhja7.llogaritHedhjen( { kolor131: true } ).should.equal( false );
        } );

    } );

    describe( 'Thyerjet', function() {

        var hBomb = new Hedhje( [ new Leter( 7 ), new Leter( 20 ), new Leter( 33 ), new Leter( 46 ) ], 0 );
        hBomb.llogaritHedhjen();
        var hNormal = new Hedhje( [ new Leter( 7 ), new Leter( 8 ), new Leter( 9 ), new Leter( 23 ), new Leter( 11 ) ], 0 );
        hNormal.llogaritHedhjen();
        var hShkalle = new Hedhje( [ new Leter( 7 ), new Leter( 8 ), new Leter( 9 ), new Leter( 10 ), new Leter( 11 ) ], 0 );
        hShkalle.llogaritHedhjen();

        it( 'hedhja me perparesi me te madhe fiton pavaresisht letrave', function() {
            // 3 thyen zholin kur ka perparesi me te larte
            var h1 = new Hedhje( [ new Leter( 54 ), 0 ] );
            h1.llogaritHedhjen();
            h1.perparesia = Konstante.PERPARESI_ZERO;
            var h2 = new Hedhje( [ new Leter( 1 ) ], 0 );
            h2.llogaritHedhjen();
            h2.thyenHedhjen( h1 ).should.equal( true );
            // thyerje me numer te ndryshem letrash, kur eshte perparesia e larte
            var h3 = new Hedhje( [ new Leter( 12 ), new Leter( 13 ) ], 0 );
            h3.llogaritHedhjen();
            h3.perparesia = Konstante.PERPARESI_ZERO;
            var h4 = new Hedhje( [ new Leter( 5 ) ] );
            h4.llogaritHedhjen();
            h3.thyenHedhjen( h4 ).should.equal( false );
        } );

        it( 'bomba theyn cdo kombinim pervec shkalleve dhe bombave me te fuqishme', function() {
            hBomb.thyenHedhjen( hNormal ).should.equal( true );
            hBomb.thyenHedhjen( hShkalle ).should.equal( false );
            var hBombMeEForte = new Hedhje( [ new Leter( 8 ), new Leter( 21 ), new Leter( 34 ), new Leter( 47 ) ], 0 );
            hBombMeEForte.llogaritHedhjen();
            hBomb.thyenHedhjen( hBombMeEForte ).should.equal( false );
        } );

        it( 'shkalla theyn cdo gje pervec shkalleve me te larta', function() {
            hShkalle.thyenHedhjen( hNormal ).should.equal( true );
            var hShkalleMeEForte = new Hedhje( [ new Leter( 21 ), new Leter( 22 ), new Leter( 23 ), new Leter( 24 ), new Leter( 25 ) ], 0 );
            hShkalleMeEForte.llogaritHedhjen();
            hShkalle.thyenHedhjen( hShkalleMeEForte ).should.equal( false );
        } );

        it( 'ne perparesi te barabarta numri i letrave duhet te jete i njejte', function() {
            var h1 = new Hedhje( [ new Leter( 7 ), new Leter( 20 ) ], 0 );
            h1.llogaritHedhjen();
            var h2 = new Hedhje( [ new Leter( 8 ), new Leter( 21 ), new Leter( 34 ) ], 0 );
            h2.llogaritHedhjen();
            h2.thyenHedhjen( h1 ).should.equal( false );
        } );

        it( 'per hedhje jo-kolor, fiton hedhja me vleren me te larte', function() {
            var h3 = new Hedhje( [ new Leter( 25 ), new Leter( 51 ) ], 0 );
            h3.llogaritHedhjen();
            var h4 = new Hedhje( [ new Leter( 26 ), new Leter( 52 ) ], 0 );
            h4.llogaritHedhjen();
            h4.thyenHedhjen( h3 ).should.equal( true );
            h3.letrat.splice( 0, 1 );
            h3.llogaritHedhjen();
            h4.letrat.splice( 0, 1 );
            h4.llogaritHedhjen();
            h3.thyenHedhjen( h4 ).should.equal( false );
        } );

        it( 'thyerja e kolorit behet nga nje kolor qe i ka letrat perkatesisht 1 me te larta ne vlere', function() {
            var h5 = new Hedhje( [ new Leter( 34 ), new Leter( 35 ), new Leter( 36 ), new Leter( 11 ), new Leter( 25 ) ], 0 );
            h5.llogaritHedhjen();
            h5.thyenHedhjen( hNormal ).should.equal( true );
        } );

        it( 'kur hiqet rregulli `kolorNjeMeShume`, kolori thyes mund te kete edhe diference 2, 3 etj me kolorin baze', function() {
            var h6 = new Hedhje( [ new Leter( 35 ), new Leter( 36 ), new Leter( 37 ), new Leter( 12 ), new Leter( 26 ) ], 0 );
            h6.llogaritHedhjen();
            h6.thyenHedhjen( hNormal ).should.equal( false );
            // me rregull te hequr
            h6.thyenHedhjen( hNormal, { kolorNjeMeShume: false } ).should.equal( true );
            // kolori me as
            var hKolorAs = new Hedhje( [ new Leter( 38 ), new Leter( 26 ), new Leter( 14 ), new Leter( 2 ), new Leter( 42 ) ], 0 );
            hKolorAs.llogaritHedhjen();
            h6.thyenHedhjen( hKolorAs, { kolorNjeMeShume: false } ).should.equal( true );
            hNormal.thyenHedhjen( hKolorAs ).should.equal( false );
        } );

        it( 'kolori 131 sillet njesoj si kolori monoton', function() {
            var h131 = new Hedhje( [ new Leter( 18 ), new Leter( 19 ), new Leter( 6 ), new Leter( 45 ), new Leter( 33 ) ], 0 );
            h131.llogaritHedhjen( { kolor131: true } );
            var h242 = new Hedhje( [ new Leter( 19 ), new Leter( 20 ), new Leter( 7 ), new Leter( 46 ), new Leter( 34 ) ], 0 );
            h242.llogaritHedhjen( { kolor131: true } );
            var h343 = new Hedhje( [ new Leter( 20 ), new Leter( 21 ), new Leter( 8 ), new Leter( 47 ), new Leter( 35 ) ], 0 );
            h343.llogaritHedhjen( { kolor131: true } );
            h242.thyenHedhjen( h131 ).should.equal( true );
            h343.thyenHedhjen( h131 ).should.equal( false );
            h343.thyenHedhjen( h131, { kolorNjeMeShume: false } ).should.equal( true );
        } );

    } );

    describe( 'Konstruktori', function() {

    } );

    describe( 'Perjashtimet', function() {

    } );

} );

describe( 'Dore', function() {

    describe( 'Funksionet baze', function() {

        var dora = new Dore( pako.slice( 13, 26 ), 0 );
        var letrat1 = [ new Leter( 1 ), new Leter( 2 ), new Leter( 53 ), new Leter( 14 ) ];

        it( '#rendit i rreshton letrat e dores ne rend rrites', function() {
            dora.rendit();
            for( var i = 1; i < dora.letrat.length; i++ ) {
                dora.letrat[ i ].vlera.should.be.above( dora.letrat[ i -1 ].vlera - 1 );
            }
        } );

        it( '#kaLetrenMeKod verteton nese letra e dhene eshte pjese e dores', function() {
            var dora1 = new Dore( letrat1, 2 );
            dora1.kaLetrenMeKod( 'S3' ).should.be.a.Number;
            dora1.kaLetrenMeKod( 'S4' ).should.equal( 2 )
            dora1.kaLetrenMeKod( 'S5' ).should.be.exactly( -1 );
            dora1.kaLetrenMeKod( 'KZ' ).should.equal( -1 );
            dora1.kaLetrenMeKod( 'D3' ).should.be.exactly( 2 );
        } );

        it( '#kapLetrenNgaKodi gjen dhe kthen letren e dores nisur nga kodi', function() {
            var dora2 = new Dore( letrat1, 1 );
            dora2.kapLetrenNgaKodi( 'S3' ).should.be.instanceOf( Leter ).and.have.properties( { vlera: 3, lloji: 'Spathi' } );
            dora2.kapLetrenNgaKodi( 'S4' ).should.be.instanceOf( Leter ).and.have.property( 'id', 2 );
            dora2.kapLetrenNgaKodi( 'S5' ).should.equal( false );
            dora2.kapLetrenNgaKodi( 'KZ' ).should.equal( false );
            dora2.kapLetrenNgaKodi( 'D3' ).should.be.instanceOf( Leter ).and.have.property( 'vlera', 3 );
        } );

        it( '#kaDyZhola tregon nese dora i ka te dy zholat', function() {
            var dora3 = new Dore( [ new Leter( 53 ), new Leter( 54 ) ], 0 );
            dora3.kaDyZhola().should.equal( true );
            dora3.letrat.splice( 0, 1 );
            dora3.kaDyZhola().should.equal( false );
        } );

    } );

} );
