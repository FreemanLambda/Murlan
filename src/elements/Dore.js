export default class Dore {
  constructor(letrat, pronari) {
    this.letrat = letrat;
    this.pronari = pronari;
  }

  rendit() {
    this.letrat.sort((l1, l2) => l1.vlera - l2.vlera);
  }

  kaLetrenMeKod(kod) {
    const kaLetren = this.letrat.find((l) => l.kodi === kod);
    return kaLetren ? this.pronari : -1;
  }

  kapLetrenNgaKodi(kod) {
    return this.letrat.find((l) => l.kodi === kod) || false;
  }

  kaDyZhola() {
    return (this.kaLetrenMeKod('KZ') !== -1) && (this.kaLetrenMeKod('ZZ') !== -1);
  }

  paraqitBukur() {
    let paraqitja = this.letrat.sort((l1, l2) => l1.vlera - l2.vlera);
    paraqitja = paraqitja.map((l) => l.kodi).join(' ') || 'Bosh';
    return `Pronari: (${this.pronari}) - Letrat: ${paraqitja}`;
  }
}

// function DoreException( error ) {
// 	this.errorId = error.errorId;
// 	this.msg = error.msg;
// }
