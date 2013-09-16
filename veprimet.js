// funksione ndihmese per lojen
var loja = require('./loja');

function percaktoRadhen(roundi, ljt) {
	if(!roundi) {
		// kodi per roundin e pare, fillon treshi mac
	}
	else {
		// kodi per roundet tjera, fillon humbesi. nqs humbesi ka dy zhola fillon fituesi
	}
	// per momentin fillon lojtari ne pozicionin zero
	return 0;
}

function randPlote(kufi) {return Math.floor(Math.random()*kufi);}

function renditLetratLojtar(lojtar) { // bubblesort
	var i,j,prk;
	nr_letra = lojtar.letrat.length;
	for(i=0;i<nr_letra-1;i++) {
		for(j=0;j<nr_letra-1-i;j++) {
			if(lojtar.letrat[j].vlera > lojtar.letrat[j+1].vlera) { // shkembe
				prk = lojtar.letrat[j];
				lojtar.letrat[j] = lojtar.letrat[j+1];
				lojtar.letrat[j+1] = prk;
			}
		}
	}
}

function shperndajLetrat(ljt, pako, gjendja) { // argumentet vjen me reference, veprimet mbi te jane te drejtperdrejta
	var i,j;
	// mbush pakon me 54 letra te ndryshme ne menyre rastesore
	pako[0] = new loja.leter(randPlote(54) + 1);
	i = 1;
	while(i<54) {
		pako[i] = new loja.leter(randPlote(54) + 1);
		for(j=0;j<i;j++) {
			if(pako[j].id === pako[i].id) {
				i--;
				break;
			}
		}
		i++;
	}
	// ploteso te dhenat e tjera te letrave, nisur nga id
	for(i=0;i<54;i++) {
		if(pako[i].id < 53) {
			pako[i].ne_loje = true;
			// lloji
			var lloji_nr = Math.floor((pako[i].id-1) / 13);
			if(lloji_nr === 0) pako[i].lloji = 'Spathi';
			else if(lloji_nr === 1) pako[i].lloji = 'Diner';
			else if(lloji_nr === 2) pako[i].lloji = 'Mac';
			else if(lloji_nr === 3) pako[i].lloji = 'Kupe';
			// vlera
			pako[i].vlera = ((pako[i].id-1) % 13) + 3;
			pako[i].kodi = pako[i].lloji[0] + (pako[i].vlera % 13);
		}
		else { // zholat
			if(pako[i].id === 53) {pako[i].ne_loje = true; pako[i].lloji = 'I zi';  pako[i].vlera = 16; pako[i].kodi = 'ZZ';} // zholi i zi
			else if(pako[i].id === 54) {pako[i].ne_loje = true; pako[i].lloji = 'I kuq'; pako[i].vlera = 17; pako[i].kodi = 'KZ';}
		}
	}
	// bej procesin e prerjes
	// ngelet per tu implementuar
	// shperndaj letrat ndermjet lojtareve ne forme rrethore, si n'jete
	var k = gjendja.radha; var nr_lojtare = gjendja.nr_lojtare;
	for(i=0;i<ljt.length;i++) if(ljt[i]) ljt[i].letrat = new Array();
	for(i=0;i<54;i++) ljt[k++%nr_lojtare].letrat.push(pako[i]);
	// e fshijme pakon tashme
	pako = null;
	// rendisim letrat ne duart e lojtareve
	for(var i=0;i<loja.MAX_USER;i++) if(ljt[i]) renditLetratLojtar(ljt[i]);
}

exports.percaktoRadhen = percaktoRadhen;
exports.shperndajLetrat = shperndajLetrat;