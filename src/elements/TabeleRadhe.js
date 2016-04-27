function TabeleRadheException(error) {
  this.errorId = error.errorId;
  this.msg = error.msg;
}

export default class TabeleRadhe {
  constructor(lojtare) {
    // kontrollo vlefshmerine e argumentave
    let konstruktorIRregullt = true;

    if (!lojtare || !lojtare.forEach || !lojtare.length) {
      konstruktorIRregullt = false;
    }
    lojtare.forEach(ljt => {
      let ok = (typeof ljt.id !== 'number' && ljt.id < 0);
      ok = ok || (typeof ljt.poz !== 'number' && ljt.poz < 0);
      if (ok) {
        konstruktorIRregullt = false;
      }
    });
    if (!konstruktorIRregullt) {
      throw new TabeleRadheException({
        errorId: 1,
        msg: 'Argumenti i konstruktorit TabelaRadhe nuk eshte i rregullt',
      });
    }

    lojtare.sort((ljt1, ljt2) => ljt1.poz - ljt2.poz);
    this._rreshtat = lojtare.map(ljt => ljt.id);
    this._koka = 0;
  }

  vendosKoken(id) {
    const index = this._rreshtat.indexOf(id);
    if (index === -1) {
      throw new TabeleRadheException({
        errorId: 2,
        msg: `Lojtari me id ${id} nuk ndodhet ne tabelen e radheve.`,
      });
    }
    this._koka = this._rreshtat.indexOf(id);
    // TODO: throw error per boundary check
  }

  gjejTjetrin() {
    if (!this._rreshtat.length) {
      throw new TabeleRadheException({
        errorId: 3,
        msg: 'Tabela nuk ka me asnje lojtar ne gjendje',
      });
    }
    this._koka++;
    this._koka %= this._rreshtat.length;
    return this._rreshtat[this._koka];
  }

  fshijRresht(id) {
    const index = this._rreshtat.indexOf(id);
    if (index === -1) {
      throw new TabeleRadheException({
        errorId: 2,
        msg: `Lojtari me id ${id} nuk ndodhet ne tabelen e radheve.`,
      });
    }
    const vleraAktuale = this._rreshtat[this._koka];
    this._rreshtat.splice(this._rreshtat.indexOf(id), 1);
    const vleraPasFshirjes = this._rreshtat[this._koka];
    // korigjo vendosjen e kokes nese eshte prishur nga fshrija
    if (vleraAktuale !== vleraPasFshirjes) {
      this._koka += this._rreshtat.length - 1;
      this._koka %= this._rreshtat.length;
    }
  }
}
