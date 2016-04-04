function TabeleRadhe( lojtare ) {
    // kontrollo vlefshmerine e argumentave
    var konstruktorIRregullt = true;

    if( !lojtare || !lojtare.forEach || !lojtare.length ) {
        konstruktorIRregullt = false;
    }
    lojtare.forEach( function( ljt ) {
        if( ( typeof ljt.id !== 'number' && ljt.id < 0 ) || ( typeof ljt.poz !== 'number' && ljt.poz < 0 ) ) {
            konstruktorIRregullt = false;
        }
    } );
    if( !konstruktorIRregullt ) {
        throw new TabeleRadheException( {
            errorId: 1,
            msg: 'Argumenti i konstruktorit TabelaRadhe nuk eshte i rregullt'
        } );
    }

    lojtare.sort( function( ljt1, ljt2 ) {
        return ljt1.poz - ljt2.poz;
    } );
    this._rreshtat = lojtare.map( function( ljt ) {
        return ljt.id;
    } );
    this._koka = 0;
}

TabeleRadhe.prototype = {
    vendosKoken: function( id ) {
        var index = this._rreshtat.indexOf( id );
        if( index === -1 ) {
            throw new TabeleRadheException( {
                errorId: 2,
                msg: 'Lojtari me id ' + id + ' nuk ndodhet ne tabelen e radheve'
            } );
        }
        this._koka = this._rreshtat.indexOf( id );
        // TODO: throw error per boundary check
    },

    gjejTjetrin: function() {
        if( !this._rreshtat.length ) {
            throw new TabeleRadheException( {
                errorId: 3,
                msg: 'Tabela nuk ka me asnje lojtar ne gjendje'
            } );
        }
        this._koka++;
        this._koka %= this._rreshtat.length;
        return this._rreshtat[ this._koka ];
    },

    fshijRresht: function( id ) {
        var index = this._rreshtat.indexOf( id );
        if( index === -1 ) {
            throw new TabeleRadheException( {
                errorId: 2,
                msg: 'Lojtari me id ' + id + ' nuk ndodhet ne tabelen e radheve'
            } );
        }
        var vleraAktuale = this._rreshtat[ this._koka ];
        this._rreshtat.splice( this._rreshtat.indexOf( id ), 1 );
        var vleraPasFshirjes = this._rreshtat[ this._koka ];
        // korigjo vendosjen e kokes nese eshte prishur nga fshrija
        if( vleraAktuale !== vleraPasFshirjes ) {
            this._koka += this._rreshtat.length - 1;
            this._koka %= this._rreshtat.length;
        }
    }
}

function TabeleRadheException( error ) {
    this.errorId = error.errorId;
    this.msg = error.msg;
}

exports = module.exports = TabeleRadhe;
