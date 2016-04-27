import Konstante from './Konstante';
import RregullatBaze from './RregullatBaze';
import Leter from './Leter';

/**
 * letrat jane te renditura
 * Nese letrave u duhet zbritur vlera, kthe letrat e modifikuara
 */
function eshteKolor(letrat, rregullat) {
  const nrLetra = letrat.length;
  const fillimi = letrat[0].vlera;
  const fundi = letrat[nrLetra - 1].vlera;
  // kontrollo per 131
  if (rregullat.kolor131 && letrat.length === 5) {
    let eshte131 = true;
    if (fillimi !== fundi - 2) {
      eshte131 = false;
    }
    for (let i = 1; i < 4; i++) {
      if (letrat[i].vlera !== fillimi + 1) {
        eshte131 = false;
      }
    }
    return eshte131;
  }
  // kontrollo per zhola ne kolor
  if (!rregullat.kolorMeZhol && fundi > 15) {
    return false;
  }
  // kontrollo per kolor qe fillon me as ose dysh

  // kontrollo per kolor normal
  let kolor = true;
  let diferencaMesLetrave;
  let i;
  for (i = 0; i < nrLetra - 1; i++) {
    diferencaMesLetrave = letrat[i + 1].vlera - letrat[i].vlera;
    kolor = kolor && (diferencaMesLetrave === 1);
  }
  // nese lejohet kolori me As dhe Dysh ne fillim, bej nje kontroll te dyte
  let letratFresh;
  if (!kolor && rregullat.kolorMeAs) {
    // nese hedhja permban nje leter me vleren 13, kontrolli nuk duhet bere
    const kaDerr = letrat.find(l => l.vlera === 13);
    if (kaDerr) {
      return false;
    }
    // kur nuk ka derr, zbresim me 13 vleren e asit dhe dyshit
    kolor = true;
    letratFresh = letrat.map(l => {
      const freshL = new Leter(l.id);
      freshL.vlera = l.vlera > 13 ? l.vlera - 13 : l.vlera;
      return freshL;
    }).sort((l1, l2) => l1.vlera - l2.vlera);
    for (i = 0; i < nrLetra - 1; i++) {
      diferencaMesLetrave = letratFresh[i + 1].vlera - letratFresh[i].vlera;
      kolor = kolor && (diferencaMesLetrave === 1);
    }
    if (kolor) {
      return letratFresh;
    }
  }
  // return kolor ? letratFresh : kolor;
  return kolor;
}

export default class Hedhje {
  constructor(letrat, hedhesi) {
    this.letrat = letrat;
    this.hedhesi = hedhesi;
    this.perparesia = Konstante.PERPARESI_ZERO;
    this.vlera = 0;
  }

  renditLetrat() {
    this.letrat.sort((l1, l2) => l1.vlera - l2.vlera);
  }

  kontrolloVlefshmerine(rregullat = RregullatBaze) {
    const nrLetra = this.letrat.length;
    // hedhjet me 1 leter jane gjithmone te vlefshme
    if (nrLetra === 1) {
      return true;
    }
    // hedhjet me 2, 3 ose 4 letra te njejta
    // trajtojme rastin e vecante te hedhjes se dy zholave
    if (rregullat.lejohenDyZhola) {
      return (nrLetra === 2 && this.letrat[0].id === 53 && this.letrat[1].id === 54);
    }
    if (nrLetra < 5) {
      const vlera = this.letrat[0].vlera;
      let teNjejta = true;
      this.letrat.forEach(l => {
        teNjejta = teNjejta && (l.vlera === vlera);
      });
      return teNjejta;
    }
    // 5 letra e lart, kontrollojme per kolor, pasi ti kemi renditur letrat
    this.renditLetrat();
    const eshteKolorResult = eshteKolor(this.letrat, rregullat);
    // apply changes to cards if needed
    if (typeof eshteKolorResult === 'object') {
      this.letrat = eshteKolorResult;
    }
    return !!eshteKolorResult;
  }

  llogaritHedhjen(rregullat = RregullatBaze) {
    if (!this.kontrolloVlefshmerine(rregullat)) {
      return false;
    }
    const nrLetra = this.letrat.length;
    // cakto nivelin e perparesise
    if (nrLetra < 4) {
      this.perparesia = Konstante.PERPARESI_NORMALE;
    } else if (nrLetra === 4) {
      this.perparesia = Konstante.PERPARESI_BOMBE;
    } else if (nrLetra > 4 && nrLetra < 16) {
      // kontrollo a kemi kolor njengjyresh (shkalle)
      const lloji = this.letrat[0].lloji;
      let teNjejta = true;
      this.letrat.forEach(l => {
        teNjejta = teNjejta && (l.lloji === lloji);
      });
      this.perparesia = teNjejta ? Konstante.PERPARESI_SHKALLE : Konstante.PERPARESI_NORMALE;
    }
    // llogarit vleren e hedhjes
    this.vlera = this.letrat.reduce((total, l) => total + l.vlera, 0);
    // shto peshen e perparesise
    this.vlera += 1000 * this.perparesia;
    return true;
  }

  thyenHedhjen(hedhjaTjeter, rregullat = RregullatBaze) {
    // perparesia percakton thyerjen pavaresisht rregullave
    if (this.perparesia > hedhjaTjeter.perparesia) {
      return true;
    } else if (this.perparesia < hedhjaTjeter.perparesia) {
      return false;
    }
    // hedhje normale (perparesi te njejta)
    // duhet numer i njejte letrash
    const nrLetra = this.letrat.length;
    if (nrLetra !== hedhjaTjeter.letrat.length) {
      return false;
    }
    // duhet vlere me e larte se hedhja tjeter
    if (this.vlera <= hedhjaTjeter.vlera) {
      return false;
    }
    // ne rast kolori aplikojme thyerjen me "nji me shume" ose "disa me shume"
    if (nrLetra > 4) {
      // rendisim letrat per rastin e koloreve qe fillojne me As ose Dysh
      hedhjaTjeter.renditLetrat();
      const eVogla = this.letrat[0].vlera;
      const eVoglaTjeter = hedhjaTjeter.letrat[0].vlera;
      const koeficientiDiference = rregullat.kolorNjeMeShume ? 1 : eVogla - eVoglaTjeter;
      const diferencaELejuar = koeficientiDiference * nrLetra;
      return (this.vlera - hedhjaTjeter.vlera === diferencaELejuar);
    }
    // ne fund te kontrolleve ngelet qe hedhja eshte thyerse
    return true;
  }

  kaLetrenMeKod(kod) {
    return this.letrat.find(l => l.kodi === kod) || false;
  }

  paraqitBukur() {
    let paraqitjaLetra = this.letrat.sort((l1, l2) => l1.vlera - l2.vlera);
    paraqitjaLetra = paraqitjaLetra.map(l => l.kodi).join(' ');
    paraqitjaLetra = paraqitjaLetra || 'Bosh';
    return `${paraqitjaLetra} hedhes (${this.hedhesi}) p=${this.perparesia}`;
    // return paraqitjaLetra + ' hedhes (' + this.hedhesi + ') p=' + this.perparesia;
  }
}


// function DoreException( error ) {
//   this.errorId = error.errorId;
//   this.msg = error.msg;
// }
