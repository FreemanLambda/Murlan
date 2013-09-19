// funksione ndihmese per lojen
var loja = require('./loja');

function percaktoRadhen(roundi, nr_lojtare) {
	var i,j;
	if(!roundi) { // kodi per roundin e pare, fillon treshi mac
		for(i=0;i<nr_lojtare;i++) {
			for(j=0;j<loja.ljt[i].letrat.length;j++) {
				if(loja.ljt[i].letrat[j].kodi === 'M3') return i;
			}
		}
	}
	else { // kodi per roundet tjera, fillon humbesi. nqs humbesi ka dy zhola fillon fituesi
		if(kaDyZhola(loja.humbesi)) return loja.fituesi.poz;
		else return loja.humbesi.poz;
	}
}

function kaDyZhola(lojtari) { // kontrollo letren e parafundit dhe te fundit nqs jane 2 zhola
	if((lojtari.letrat[lojtari.nr_letra-2].kodi==='ZZ')&&(lojtari.letrat[lojtari.nr_letra-1].kodi==='KZ')) return true;
	else return false;
}

function randPlote(kufi) {return Math.floor(Math.random()*kufi);}

function renditLetratLojtar(lojtar) { // bubblesort
	var i,j,prk;
	nr_letra = lojtar.letrat.length;
	lojtar.nr_letra = nr_letra;
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
	var k = (gjendja.roundi ? gjendja.radha : 0);
	var nr_lojtare = gjendja.nr_lojtare;
	for(i=0;i<ljt.length;i++) if(ljt[i]) ljt[i].letrat = new Array();
	for(i=0;i<54;i++) ljt[k++%nr_lojtare].letrat.push(pako[i]);
	// e fshijme pakon tashme
	pako = null;
	// rendisim letrat ne duart e lojtareve
	for(var i=0;i<loja.MAX_USER;i++) if(ljt[i]) renditLetratLojtar(ljt[i]);
}

function pas(lojtari) {
	var gjendja = loja.gjendja;
	gjendja.cikel_pas++;
	if(gjendja.cikel_pas >= gjendja.nr_lojtare - gjendja.lojtare_te_dalur-1) {
		gjendja.fusha.perparesia = -1;
		gjendja.cikel_pas = 0;
	}
}

function llogaritDoren(dora) {
	var i,j,vl,prk;
	// kontrolli
	if(dora.nr_letra > 1) { // kontrolli anashkalohet per dore me 1 leter teke
		if(dora.nr_letra < 5) { // letra te njejta, ose dy zhola
			vl = dora.letrat[0].vlera;
			if(vl < 16) { // jo zhol
				for(i=1;i<dora.nr_letra;i++) if(dora.letrat[i].vlera!=vl) return false;
			}
			else { // zhol
				if(dora.nr_letra!=2) return false;
				if(!loja.rregullat.MUND_TE_HIDHEN_2_ZHOLA) return false;
				if((vl===16)&&(dora.letrat[1].vlera!==17)) return false;
				if((vl===17)&&(dora.letrat[1].vlera!==16)) return false;
			}
		}
		else { // 5 ose me shume letra, shih per kolore
			// rendit letrat bubble sort
			for(i=0;i<dora.nr_letra-1;i++) {
				for(j=0;j<dora.nr_letra-1-i;j++) {
					if(dora.letrat[j].vlera > dora.letrat[j+1].vlera) {
						prk = dora.letrat[j];
						dora.letrat[j] = dora.letrat[j+1];
						dora.letrat[j+1] = prk;
					}
				}
			}		
			// kontrollo nese eshte kolor qe fillon me as
			if((dora.letrat[dora.nr_letra-1].vlera===15)&&(dora.letrat[dora.nr_letra-2].vlera===14)
				&&(dora.letrat[dora.nr_letra-3].vlera!==13)) 
			{
				if(!loja.rregullat.KOLORI_MUND_TE_FILLOJE_ME_AS) return false;
				if(dora.letrat[0].vlera!==3) return false;
				for(i=0;i<dora.nr_letra-3;i++)
					if(dora.letrat[i+1].vlera - dora.letrat[i].vlera!==1) return false;
				dora.letrat[dora.nr_letra-1].vlera -= 13; // asit dhe dyshit i ulet vlera ne kolor ne 1 dhe 2
				dora.letrat[dora.nr_letra-2].vlera -= 13;
			}
			// kontrollo nese eshte kolor qe fillon me dysh
			else if((dora.letrat[dora.nr_letra-1].vlera===15)&&(dora.letrat[dora.nr_letra-2].vlera!==14)) {
				if(!loja.rregullat.KOLORI_MUND_TE_FILLOJE_ME_AS) return false;
				if(dora.letrat[0].vlera!==3) return false;
				for(i=0;i<dora.nr_letra-2;i++)
					if(dora.letrat[i+1].vlera - dora.letrat[i].vlera!==1) return false;
				dora.letrat[dora.nr_letra-1].vlera -= 13;; // dyshit i ulet vlera ne kolor ne 2
			}
			// kontrollo nese eshte kolor i zakonshem
			else {
				for(i=0;i<dora.nr_letra-1;i++)
				if(dora.letrat[i+1].vlera - dora.letrat[i].vlera!==1) return false;
			}
			// rirendit letrat per as || dysh
			for(i=0;i<dora.nr_letra-1;i++) {
				for(j=0;j<dora.nr_letra-1-i;j++) {
					if(dora.letrat[j].vlera > dora.letrat[j+1].vlera) {
						prk = dora.letrat[j];
						dora.letrat[j] = dora.letrat[j+1];
						dora.letrat[j+1] = prk;
					}
				}
			}
		}
	} // perfundimisht dora eshte e vlefshme, meqe funksioni nuk ka bere return false deri ketu
	// vazhdo me llogaritjen e dores
	// perparesia --- 0 = KOT, 1 = BOMBE, 2 = SHKALLE
	if(dora.nr_letra<4) dora.perparesia = 0;
	else if(dora.nr_letra===4) dora.perparesia = 1;
	else if((dora.nr_letra>4)&&(dora.nr_letra<16)) { // kontrollo per kolor SHKALLE
		vl = dora.letrat[0].lloji;
		for(i=1;i<dora.nr_letra;i++) {
			if(dora.letrat[i].lloji!==vl) {
				dora.perparesia = 0;
				break; // nuk u gjet SHKALLE
			}
			dora.perparesia = 2; // u gjet SHKALLE
		}
	}
	// llogarit dhe balanco vleren
	dora.vlera = 0;
	for(i=0;i<dora.nr_letra;i++) dora.vlera += dora.letrat[i].vlera;
	dora.vlera += (1000 * dora.perparesia);
	// fund !!!
	return true;
}

function pranohetDora(dora, fusha) { // logjike negative
	if(!llogaritDoren(dora)) return false;
	// dora kenaq rregullat
	if((!loja.gjendja.roundi)&&(!fusha.letrat)) { // sigurohu qe dora e pare e roundit te pare te filloje me treshin mac
		for(var i=0;i<dora.nr_letra;i++) if(dora.letrat[i].kodi==='M3') return true;
		return false; // treshi nuk u gjet
	}
	if(dora.perparesia > fusha.perparesia) return true; // bobme,shkalle,marrje,turni i pare
	if(dora.perparesia < fusha.perparesia) return false;
	
	if(dora.perparesia === fusha.perparesia) {
		if(dora.nr_letra !== fusha.nr_letra) return false;
		if(dora.vlera <= fusha.vlera) return false;
		if(loja.rregullat.KOLORI_THYHET_ME_NJE_ME_SHUME) 
			if((dora.nr_letra > 4)&&(dora.vlera - fusha.vlera !== dora.nr_letra)) return false; // kolori nuk eshte 1 me i madh
	}
	return true;
}

function luajDoren(dora, fusha) {
	var i;
	loja.gjendja.fusha = dora;
	for(i=0;i<dora.nr_letra;i++) fshijLeter(dora.letrat[i], dora.hedhesi.letrat);
	dora.hedhesi.nr_letra -= dora.nr_letra;
	if(dora.hedhesi.nr_letra <= 0) {
		dora.hedhesi.dalur = true;
		loja.gjendja.lojtare_te_dalur++;
		if(loja.gjendja.lojtare_te_dalur >= loja.gjendja.nr_lojtare - 1) perfundoRoundin();
		loja.gjendja.cikel_pas = -1;
	}
	else loja.gjendja.cikel_pas = 0;
	return dora.hedhesi.dalur;
}

function fshijLeter(letra, letrat) {
	for(var i=0;i<letrat.length;i++) if(letrat[i].kodi === letra.kodi) letrat.splice(i, 1);
	console.log('U fshi letra me kod ' + letra.kodi);
}

function kaloRadhen() {
	var gjendja = loja.gjendja;
	do {
		gjendja.radha++;
		gjendja.radha%=gjendja.nr_lojtare;
	} while(loja.ljt[gjendja.radha].dalur);
}

function perfundoRoundin() {
	loja.gjendja.duhet_vazhduar_loja = false;
	return 'Roundi mbaroi.';
	// per tu implementuar
}

exports.percaktoRadhen = percaktoRadhen;
exports.shperndajLetrat = shperndajLetrat;
exports.pranohetDora = pranohetDora;
exports.luajDoren = luajDoren;
exports.kaloRadhen = kaloRadhen;
exports.perfundoRoundin = percaktoRadhen;
exports.pas = pas;