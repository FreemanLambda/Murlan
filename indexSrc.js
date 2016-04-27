const express = require('express');
const winston = require('winston');
// const config = require('config');
const app = express();
// const http = require('http').Server(app);
import 'babel-polyfill';
import GameEngine from './lib/GameEngine';
import Lojtar from './lib/elements/Lojtar';
import Hedhje from './lib/elements/Hedhje';

/**
 * Load controllers
 */
app.use(require('./lib/controllers'));

const ge = new GameEngine({});

const lojtaret = [
  new Lojtar(0, 'Edra', 0),
  new Lojtar(1, 'Mario', 1),
  new Lojtar(2, 'Azmi', 2),
  new Lojtar(3, 'Miri', 3),
];

const stdin = process.openStdin();

// trajtimi i sinjaleve ne dalje te GameEngine

ge.sinjalizuesi.on('jep radhen', data => {
  const doraLjt = data.duart.find(d => d.pronari === data.radha);
  // console.log( 'radhen e ka: ' + ljt.emer + ' (' + ljt.id + ')' );
  // console.log( data.fusha.paraqitBukur() );
  // console.log( doraLjt.paraqitBukur() );
  setTimeout(() => {
    let i = 0;
    let eThen = false;
    let h;
    const m3 = doraLjt.kapLetrenNgaKodi('M3');
    if (!ge._raundi && m3) {
      h = new Hedhje([m3], data.radha);
      eThen = true;
    } else {
      do {
        h = new Hedhje([doraLjt.letrat[i]], data.radha);
        h.llogaritHedhjen();
        eThen = h.thyenHedhjen(data.fusha);
        i++;
      } while (!eThen && i < doraLjt.letrat.length);
    }

    if (eThen) {
      const kodet = h.letrat.map(l => l.kodi);
      // console.log( ljt.emer + ' hodhi ' + kodet[ 0 ] );
      ge.sinjalizuesi.emit('hidh', {
        kodet,
        hedhesi: h.hedhesi,
      });
    } else {
      // winston.log('info', `${ljt.emer} beri pas`);
      ge.sinjalizuesi.emit('pas', data.radha);
    }
  }, 1);
});

ge.sinjalizuesi.on('refuzo hedhjen', arsye => {
  winston.log('info', arsye);
});

ge.sinjalizuesi.on('doli lojtar', data => {
  winston.log('info', `doli lojtari: ${lojtaret[data.id].emer}`);
  winston.log('info', `fitoi ${data.piket} pike`);
});

ge.sinjalizuesi.on('shpall raundin', data => {
  winston.log('info', 'Raundi mbaroi');
  winston.log('info', `Piket e raundit: ${data.piket}`);
  winston.log('info', `Renditja e pergjithshme: ${data.renditja}`);
  const h = data.historia.humbesi;
  const f = data.historia.fituesi;
  winston.log('info', `Raundin tjeter (${h}) do i jape leter (${f})`);
});

let lojraGjithsej = 0;
ge.sinjalizuesi.on('mbyll lojen', data => {
  lojraGjithsej++;
  if (lojraGjithsej > 99) {
    winston.log('info', 'boll mo!');
    return;
  }
  winston.log('info', 'Loja mbaroi! Renditja perfundimtare:');
  winston.log('info', data.renditja);
  lojtaret.forEach(ljt => {
    const freshLjt = new Lojtar(ljt.id, ljt.emer, ljt.poz);
    return freshLjt;
  });
  ge.sinjalizuesi.emit('fillo', {
    lojtaret,
    rregullat: {},
  });
});

// futja e sinjaleve ne hyrje te GameEngine
stdin.addListener('data', d => {
  const consoleInput = (d.toString().trim());
  const parts = consoleInput.split(' ');
  const hedhja = {
    hedhesi: parseInt(parts[0], 10),
    kodet: parts.splice(1),
  };
  if (hedhja.kodet[0] === 'pas') {
    ge.sinjalizuesi.emit('pas', hedhja.pronari);
  } else {
    ge.sinjalizuesi.emit('hidh', hedhja);
  }
});

ge.sinjalizuesi.emit('fillo', {
  lojtaret,
  rregullat: {},
});
