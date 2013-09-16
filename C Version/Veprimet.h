// prototipet
void FilloLojen(Lojtar ljt[NR_LOJTARE]);
void FilloRoundin();
void ShperndajLetrat(); // therret KrijoLetrat, RenditLetratLojtar
void Prej(Leter ltr[54]);
void KrijoLetrat(); // therret KrijoEmrinLeter
void RenditLetratLojtar(Lojtar *l);
void ShfaqLetrat(Lojtar l);
void KrijoEmrinLeter(Leter *l);
int PercaktoRadhen();
int KaloRadhen(int r);
void NdertoDoren(Dore *dora, Lojtar ljt);
bool PranohetDora(Dore *d,Dore *f); // therret LlogaritDoren
bool LlogaritDoren(Dore *d);
void LuajDoren(Dore *fusha, Dore *dora, Lojtar *ljt);
void Pas(Lojtar ljt);
bool KaDyZhola(Lojtar ljt);
void ShkembeLetrat(); // mes fituesit dhe humbesit te roundit paraardhes
void LlogaritRoundin(Lojtar ljt[NR_LOJTARE]);

// funksionet
void FilloLojen(Lojtar ljt[NR_LOJTARE]) {
	int i;
	// lexo emrat e lojtareve
	printf("Miresevini ne tavolinen e Murlanit. Ju lutem prezantohuni.");
	for(i=0;i<nr_lojtare;i++) {
		printf("\nLojtari %d, emri: ",i+1);
		gets(ljt[i].emri);
		ljt[i].AI = false;
	}
	ljt[0].AI = false;

	srand((unsigned)time(NULL));
	roundi = 0;
	for(i=0;i<nr_lojtare;i++) ljt[i].piket = 0;
	duhet_vazhduar_loja = true;
}

void FilloRoundin() {
	lojtare_te_dalur = 0;
	ShperndajLetrat();
	cikel_pas = 0;
	fusha.perparesia = -1;
	fusha.nr_letra = 1;
	numero_duart = 0;
	radha = PercaktoRadhen();
	if(ME_SHKEMBIM) ShkembeLetrat();
	pranohet = true;
}

void ShperndajLetrat() {
	int i,j;
	// shperndaj 54 numra me lotari
	ltr[0].id = rand()%54 + 1;
	i = 1;
	while(i<54) {
		ltr[i].id = rand()%54 + 1;
		for(j=0;j<i;j++) {
			if(ltr[j].id==ltr[i].id) {
				i--;
				break;
			}
		}
		i++;
	}
	// krijo letrat ne baze te lotarise
	KrijoLetrat();
	// ndaj letrat nder lojtare
	for(i=0;i<nr_lojtare;i++) {
		ljt[i].nr_letra = 0;
		ljt[i].dalur = false;
		ljt[i].id = i;
	}
	Prej(ltr);
	int k = radha;
	for(i=0;i<54;i++) {
		ljt[k%nr_lojtare].letrat[i/nr_lojtare] = ltr[i];
		ljt[k%nr_lojtare].nr_letra++;
		k++;
	}
	// rendit letrat per secilin lojtar + fikso numrin fillestar te letrave
	for(i=0;i<nr_lojtare;i++) {
		RenditLetratLojtar(&ljt[i]);
		ljt[i].nr_letra_fillim = ljt[i].nr_letra;
	}
}

void KrijoLetrat() {
	int i;
	for(i=0;i<54;i++) {
		//ltr[i].id = i+1; // id
		ltr[i].ne_loje = true; // ne_loje
		if(ltr[i].id<53) {
			ltr[i].lloji = (ltr[i].id-1)/13; // lloji
			ltr[i].vlera = ((ltr[i].id-1)%13) + 3; // vlera
		}
		else { // zholat
			if(ltr[i].id==53) {
				ltr[i].lloji = ZI;
				ltr[i].vlera = 16;
			}
			else if(ltr[i].id==54) {
				ltr[i].lloji = KUQ;
				ltr[i].vlera = 17;
			}
		}
		KrijoEmrinLeter(&ltr[i]);
	}
}

void Prej(Leter ltr[54]) {
	int preresi,dif_reth;
	Leter prk;
	// percakto preresin
	if(!roundi) preresi = rand()%nr_lojtare;
	else preresi = fituesi;
	// bej prerjen
	printf("\n%s, shtypni nje numer nga 1-54 per te prere pakon e letrave ",ljt[preresi].emri);
	scanf("%d",&zgjedhja[0]);
	zgjedhja[0]--;
	if(ltr[zgjedhja[0]].id==ZZ) printf("\nBRAVO, ju prete nje zhol te zi!");
	else if(ltr[zgjedhja[0]].id==KZ) printf("\nBRAVO, ju prete nje zhol te kuq!"); 
	// percakto diferencen rrethore me radhen
	dif_reth = preresi - radha;
	if(dif_reth<0) dif_reth+=nr_lojtare;
	// vendos zholin ne letrat e lojtarit qe preu
	prk = ltr[dif_reth];
	ltr[dif_reth] = ltr[zgjedhja[0]];
	ltr[zgjedhja[0]] = prk;
}

void KrijoEmrinLeter(Leter *l) {
	// shkronja e pare
	if(l->lloji==SPATHI) l->emri[0] = 'S';
	else if(l->lloji==DINER) l->emri[0] = 'D';
	else if(l->lloji==MAC) l->emri[0] = 'M';
	else if(l->lloji==KUPE) l->emri[0] = 'K';
	else if(l->lloji==ZI) l->emri[0] = 'Z';
	else if(l->lloji==KUQ) l->emri[0] = 'K';
	// shkronja e dyte
	if((l->vlera<11)&&(l->vlera>2)) l->emri[1] = (char)(l->vlera%10+48);
	else if(l->vlera==11) l->emri[1] = 'J';
	else if(l->vlera==12) l->emri[1] = 'Q';
	else if(l->vlera==13) l->emri[1] = 'K';
	else if(l->vlera==14) l->emri[1] = '1';
	else if(l->vlera==15) l->emri[1] = '2';
	else if((l->vlera==16)||(l->vlera==17)) l->emri[1] = 'Z';
	// nulli
	l->emri[2] = '\0';
}

void RenditLetratLojtar(Lojtar *l) {
	int i,j; // bubble sort
	Leter prk;
	for(i=0;i<l->nr_letra-1;i++) {
		for(j=0;j<l->nr_letra-1-i;j++) {
			if(l->letrat[j].vlera>l->letrat[j+1].vlera) { // shkembe
				prk = l->letrat[j];
				l->letrat[j] = l->letrat[j+1];
				l->letrat[j+1] = prk;
			}
		}
	}
}

void ShfaqLetrat(Lojtar l) {
	int j;
	printf("\n%s, letrat tuaja jane keto:",l.emri);
	for(j=0;j<l.nr_letra_fillim;j++) 
		if(l.letrat[j].ne_loje) printf("\n%d.%s ",j+1,l.letrat[j].emri);
}

int KaloRadhen(int r) {
	do {
		r++;
		r%=nr_lojtare;
	} while(ljt[r].dalur);
	return r;
}

void NdertoDoren(Dore *dora, Lojtar ljt) {
	int i;
	printf("Shkruani me radhe numrat perbri letrave qe doni te hidhni:\n");
	dora->nr_letra = 0;
	dora->hedhesi = radha;
	for(i=0;i<nr_pritur;i++) {
		scanf("%d",&zgjedhja[i]);
		zgjedhja[i]--; // pershtat zgjedhjen reale me indeksin ne vektor 1->0 , 4->3 etj
		dora->letrat[i] = ljt.letrat[zgjedhja[i]];
		dora->nr_letra++;
	}
}

bool LlogaritDoren(Dore *d) { // kthen false nqs dora nuk ploteson rregullat, perndryshe llogarit vleren dhe perparesine e dores
	int i,j,vl;
	Leter prk;

	// kontrollo nese dora permban letra te luajtura me pare:
	for(i=0;i<d->nr_letra;i++) 
		if(!d->letrat[i].ne_loje) return false;

	// 1. kontrolli i vlefshmerise se dores (logjike negative)
   if(d->nr_letra!=1) { // dora kontrollohet per vlefshmeri vetem nese ka me shume se 1 leter
	if(d->nr_letra<5) { // kontrollo nese letrat jane te njejta ne vlere, ose dy zhola
		vl = d->letrat[0].vlera;
		if(vl<16) { // jo zhol
			for(i=1;i<d->nr_letra;i++)
				if(d->letrat[i].vlera!=vl) return false;
		}
		else { // ka zhol, mundeso hedhjen e 2 zholave
			if(d->nr_letra!=2) return false;
			if(!MUND_TE_HIDHEN_2_ZHOLA) return false;
			if((vl==16)&&(d->letrat[1].vlera!=17)) return false;
			if((vl==17)&&(d->letrat[1].vlera!=16)) return false;
		}
	}
	else { // 5 letra ose me shume
		// rendit letrat bubble sort
		for(i=0;i<d->nr_letra-1;i++) {
			for(j=0;j<d->nr_letra-1-i;j++) {
				if(d->letrat[j].vlera>d->letrat[j+1].vlera) {
					prk = d->letrat[j];
					d->letrat[j] = d->letrat[j+1];
					d->letrat[j+1] = prk;
				}
			}
		}
		// kontrollo nese eshte kolor qe fillon me as
		if((d->letrat[d->nr_letra-1].vlera==15)&&(d->letrat[d->nr_letra-2].vlera==14)&&(d->letrat[d->nr_letra-3].vlera!=13)) {
			if(!KOLORI_MUND_TE_FILLOJE_ME_AS) return false;
			if(d->letrat[0].vlera!=3) return false;
			for(i=0;i<d->nr_letra-3;i++)
				if(d->letrat[i+1].vlera-d->letrat[i].vlera!=1) return false;
			d->letrat[d->nr_letra-1].vlera-=13; // asit dhe dyshit i ulet vlera ne kolor ne 1 dhe 2
			d->letrat[d->nr_letra-2].vlera-=13;
		}
		// kontrollo nese eshte kolor qe fillon me dysh
		else if((d->letrat[d->nr_letra-1].vlera==15)&&(d->letrat[d->nr_letra-2].vlera!=14)) {
			if(!KOLORI_MUND_TE_FILLOJE_ME_AS) return false;
			if(d->letrat[0].vlera!=3) return false;
			for(i=0;i<d->nr_letra-2;i++)
				if(d->letrat[i+1].vlera-d->letrat[i].vlera!=1) return false;
			d->letrat[d->nr_letra-1].vlera-=13;; // dyshit i ulet vlera ne kolor ne 2
		}
		// kontrollo nese eshte kolor i zakonshem
		else {
			for(i=0;i<d->nr_letra-1;i++)
			if(d->letrat[i+1].vlera-d->letrat[i].vlera!=1) return false;
		}
		// rirendit letrat per as || dysh
		for(i=0;i<d->nr_letra-1;i++) {
			for(j=0;j<d->nr_letra-1-i;j++) {
				if(d->letrat[j].vlera>d->letrat[j+1].vlera) {
					prk = d->letrat[j];
					d->letrat[j] = d->letrat[j+1];
					d->letrat[j+1] = prk;
				}
			}
		}
	}
   }  // dora eshte e vlefshme (nuk ka return false)

    // 2. vazhdo llogaritjen e perparesise
	if(d->nr_letra<4) d->perparesia = KOT;
	else if(d->nr_letra==4) d->perparesia =	BOMBE;
	else if((d->nr_letra>4)&&(d->nr_letra<16)) { // kontrollo per kolor SHKALLE
		vl = d->letrat[0].lloji;
		for(i=1;i<d->nr_letra;i++) {
			if(d->letrat[i].lloji!=vl) {
				d->perparesia = KOT;
				break; // nuk u gjet SHKALLE
			}
			d->perparesia = SHKALLE; // u gjet SHKALLE
		}
	}

	// 3. llogarit & balanco vleren
	d->vlera = 0;
	for(i=0;i<d->nr_letra;i++) d->vlera+=d->letrat[i].vlera;
	d->vlera+=(250*d->perparesia);
	
	return true;
}

bool PranohetDora(Dore *d,Dore *f) { // logjike negative
	if(!LlogaritDoren(d)) return false;
	// dora kenaq rregullat
	if((!roundi)&&(!numero_duart)) { // sigurohu qe dora e pare e roundit te pare te filloje me treshin mac
		for(int i=0;i<d->nr_letra;i++) {
			if(d->letrat[i].id==M3) return true;
			if(i>2) break;
		}
		return false; // treshi nuk u gjet
	}
	if(d->perparesia>f->perparesia) return true; // bobme,shkalle,marrje,turni i pare
	if(d->perparesia<f->perparesia) return false;
	
	if(d->perparesia==f->perparesia) {
		if(d->nr_letra!=f->nr_letra) return false;
		if(d->vlera<=f->vlera) return false;
		if(KOLORI_THYHET_ME_NJE_ME_SHUME) 
			if((d->nr_letra>4)&&(d->vlera-f->vlera!=d->nr_letra)) return false; // kolori nuk eshte 1 me i madh
	}
	return true;
}

void LuajDoren(Dore *fusha, Dore *dora, Lojtar *ljt) {
	int i;
	bool doli_lojtar = false;
	*fusha = *dora;
	for(i=0;i<dora->nr_letra;i++) ljt->letrat[zgjedhja[i]].ne_loje = false;
	ljt->nr_letra-=dora->nr_letra;
	if(ljt->nr_letra<=0) {
		ljt->dalur = true;
		doli_lojtar = true;
		r_renditja[lojtare_te_dalur] = ljt->id;
		lojtare_te_dalur++;
		printf("\n%s doli!!!\n",ljt->emri);
	}
	printf("\n%s luajti: ",ljt->emri);
	for(i=0;i<dora->nr_letra;i++) printf("%s ",dora->letrat[i].emri);
	if(doli_lojtar) cikel_pas = -1; // -1, per te korigjuar vendosjen e perparesise -1 nga Pas()
	else cikel_pas = 0;
	radha = KaloRadhen(radha);
	numero_duart++;
}

void Pas(Lojtar ljt) {
	if(fusha.perparesia==-1) {
		printf("\nNuk mund te beni pas.");
		return;
	}

	printf("\n%s beri PAS",ljt.emri);
	cikel_pas++;
	if(cikel_pas>=NR_LOJTARE-lojtare_te_dalur-1) {
		fusha.perparesia = -1;
		cikel_pas = 0;
	}
	radha = KaloRadhen(radha);
}

bool KaDyZhola(Lojtar ljt) { // kontrollo letren e parafundit dhe te fundit nqs jane 2 zhola
	if((ljt.letrat[ljt.nr_letra-2].id==ZZ)&&(ljt.letrat[ljt.nr_letra-1].id==KZ)) return true;
	else return false;
}

int PercaktoRadhen() {
	int i,j;
	if(!roundi) { // ne roundin 0, fillon lojtari me treshin mac
		for(i=0;i<nr_lojtare;i++) {
			for(j=0;j<4;j++) {
				if(ljt[i].letrat[j].id==M3) return i;
			}
		}
	}
	else { // ne roundet tjera fillon humbesi i roundit te fundit. nqs humbesi ka dy zholat, fillon fituesi
		if(KaDyZhola(ljt[humbesi])) return fituesi;
		else return humbesi;
	}
}

void ShkembeLetrat() {
	if(!roundi) return;
	if(KaDyZhola(ljt[humbesi])) {
		printf("\n%s ka ne dore 2 zholat, shpeton nga dhenia e letres me te mire",ljt[humbesi].emri);
		return;
	}
	Leter prk;
	printf("\n%s ju fituat. Zgjidhni letren qe doni te shkembeni me %s.",ljt[fituesi].emri,ljt[humbesi].emri);
	if(MUND_TE_SHKEMBEHET_LETER_MBI_DHJETE) { // sipas rregullit
		ShfaqLetrat(ljt[fituesi]);
		scanf("%d",&zgjedhja[0]);
	}
	else {
		bool pranohet_zgjedhja=false;
		do {
			ShfaqLetrat(ljt[fituesi]);
			scanf("%d",&zgjedhja[0]);
			zgjedhja[0]--;
			if(ljt[fituesi].letrat[zgjedhja[0]].vlera<11) pranohet_zgjedhja = true;
			if(!pranohet_zgjedhja) printf("\nLetra nuk mund te jete me e madhe se dhjete, ju lutem zgjidhni nje leter tjeter.");
		} while(!pranohet_zgjedhja);
	}
	// shkembe
	prk = ljt[humbesi].letrat[ljt[humbesi].nr_letra-1]; // letra me e madhe e humbesit
	ljt[humbesi].letrat[ljt[humbesi].nr_letra-1] = ljt[fituesi].letrat[zgjedhja[0]];
	ljt[fituesi].letrat[zgjedhja[0]] = prk;
	// rendit serish letrat e humbesit dhe fituesit
	RenditLetratLojtar(&ljt[humbesi]);
	RenditLetratLojtar(&ljt[fituesi]);
}

void LlogaritRoundin(Lojtar ljt[NR_LOJTARE]) {
	int i,j;
	// percakto renditjen dhe jep piket
	for(i=0;i<nr_lojtare;i++)
		if(!ljt[i].dalur) r_renditja[nr_lojtare-1] = ljt[i].id;
	fituesi = r_renditja[0];
	humbesi = r_renditja[nr_lojtare-1];
	for(i=0;i<nr_lojtare;i++) ljt[r_renditja[nr_lojtare-1-i]].piket += i;
	printf("\n\nNe vend te pare doli %s, ndersa ne vend te fundit %s.",ljt[fituesi].emri,ljt[humbesi].emri);
	printf("\n\nPiket deri tani jane: ");
	for(i=0;i<nr_lojtare;i++) printf("%s %d    ",ljt[i].emri,ljt[i].piket);
	// rendit piket ne rend zbrites dhe percakto a ka fitues perfundimtar
	for(i=0;i<nr_lojtare;i++) r_renditja[i] = ljt[i].piket;
	for(i=0;i<nr_lojtare-1;i++) {
		for(j=0;j<nr_lojtare-1-i;j++) {
			if(r_renditja[j]<r_renditja[j+1]) {
				prk = r_renditja[j];
				r_renditja[j] = r_renditja[j+1];
				r_renditja[j+1] = prk;
			}
		}
	}
	if((r_renditja[0]>=KUFIRI_PIKE)&&(r_renditja[0]!=r_renditja[1])) duhet_vazhduar_loja = false;
	roundi++;
}