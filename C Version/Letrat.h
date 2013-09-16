// LLOJET
#define SPATHI 0
#define DINER 1
#define MAC 2
#define KUPE 3
#define ZI 4
#define KUQ 5

// ID-TE E LETRAVE (S-SPATHI,D-DINER,M-MAC,K-KUPE,Z-ZI,K-KUQ)
#define S3 1
#define S4 2
#define S5 3
#define S6 4
#define S7 5
#define S8 6
#define S9 7
#define S10 8
#define S11 9
#define S12 10
#define S13 11
#define S1 12
#define S2 13

#define D3 14
#define D4 15
#define D5 16
#define D6 17
#define D7 18
#define D8 19
#define D9 20
#define D10 21
#define D11 22
#define D12 23
#define D13 24
#define D1 25
#define D2 26

#define M3 27
#define M4 28
#define M5 29
#define M6 30
#define M7 31
#define M8 32
#define M9 33
#define M10 34
#define M11 35
#define M12 36
#define M13 37
#define M1 38
#define M2 39

#define K3 40
#define K4 41
#define K5 42
#define K6 43
#define K7 44
#define K8 45
#define K9 46
#define K10 47
#define K11 48
#define K12 49
#define K13 50
#define K1 51
#define K2 52

#define ZZ 53
#define KZ 54

// PERPARESITE
#define KOT 0
#define BOMBE 1
#define SHKALLE 2
#define MARRJE 3

// STRUKTURAT
struct Leter {
	int id; // 1-54
	int vlera; // 3-17 (3 per tresh 17 per zhol te kuq)
	int lloji; // 0-5 (spathi,diner,mac,kupe,zi,kuq)
	char emri[3]; // sipas ID, per printim
	bool ne_loje; // ne loje - jashte loje
};

struct Dore {
	int nr_letra; // 1-15
	Leter letrat[15];
	int vlera; // 3-?
	int hedhesi; // 0-3
	int perparesia; // KOT,BOMBE,SHKALLE,MARRJE
};

struct Lojtar {
	bool AI; // eshte njeri apo AI
	int id; // 0-3
	char emri[16];
	int nr_letra; // numri i letrave dinamik
	int nr_letra_fillim;  // numri i letrave ne fillim te roundit
	Leter letrat[19];
	bool dalur; // nqs ka dalur gjate roundit
	int piket;
};