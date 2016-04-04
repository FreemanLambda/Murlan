#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include <string.h>
// konstante globale
#define NR_LOJTARE 4
#define KUFIRI_PIKE 4

// ndryshoret globale
int radha,nr_lojtare=NR_LOJTARE,lojtare_te_dalur,cikel_pas,zgjedhja[15],nr_pritur,numero_duart,prk;
int roundi,fituesi,humbesi,kryesuesi,r_renditja[4];
bool pranohet,duhet_vazhduar_loja;

#include "Rregulla.h"
#include "Letrat.h"
Leter ltr[54];
Lojtar ljt[4];
Dore dora,fusha;
#include "Veprimet.h"
#include "AI_murlan.h"

int main(/*int argc, char *argv[]*/) {
	int i;
	FilloLojen(ljt);
	/*for(i=0;i<argc-1;i++) {
		strcpy(ljt[i].emri,argv[i+1]);
		ljt[i].AI = false;
	}
	if(argc!=5) {
		for(i=argc-1;i<nr_lojtare;i++) {
			strcpy(ljt[i].emri,"AI ");
			ljt[i].emri[3] = (char)(i+49);
			ljt[i].emri[4] = '\0';
			ljt[i].AI = true;
		}
	}
	printf("\n%d",argc);
	for(i=0;i<argc;i++) printf("\n%s",argv[i]);
	for(i=0;i<nr_lojtare;i++) printf("\n%s",ljt[i].emri);*/

    do { // cikli i madh i lojes

	FilloRoundin();
	do { // cikli i roundit
	  do { // cikel perserites nqs lojtari zgjedh dore te papershtatshme
		// informo lojtarin mbi gjendjen ne fushe
		printf("\n\nRadhen per te luajtur e ka %s",ljt[radha].emri);
		if(fusha.perparesia!=-1) {
			printf("\nLetrat ne fushe jane: ");
			for(i=0;i<fusha.nr_letra;i++) printf("%s ",fusha.letrat[i].emri);
			printf(" hedhesi %s",ljt[fusha.hedhesi].emri);
		}
		else printf("\nJeni i lire te hidhni cfare te doni ne fushe");
		ShfaqLetrat(ljt[radha]); // fundi i informimit
		if(ljt[radha].AI) LuajAI(&ljt[radha]); // luan AI 
		else { // luan njeriu
			// fillo ndertimin e dores
			printf("\nSa letra doni te hidhni?");
			scanf("%d",&nr_pritur);
			if(nr_pritur) { // nqs nuk kishte pas
				NdertoDoren(&dora,ljt[radha]); // fundi i ndertimit
				pranohet = PranohetDora(&dora,&fusha);
				if(pranohet) LuajDoren(&fusha,&dora,&ljt[radha]);
				else printf("\nDora e %s nuk e mund doren ne fushe, luani nje dore tjeter ju lutem.",ljt[radha].emri);
			}
			else Pas(ljt[radha]);
		}
	  } while(!pranohet); // cikli i dores se papershtatshme

	} while(lojtare_te_dalur<nr_lojtare-1); // cikli i roundit

	LlogaritRoundin(ljt);

	} while(duhet_vazhduar_loja);

	// gjej dhe shpall fitimtarin
	int max = 0;
	for(i=1;i<nr_lojtare;i++) {
		if(ljt[i].piket>ljt[max].piket) max = i;
	}
	printf("\n\n\nURIME %s!!!! JU DOLET I PARI!!!!",ljt[max].emri);

	return 0;
}