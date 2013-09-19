var ndihmesi = require('./veprimet');
const MAX_USER = 4;
var rregullat = {MUND_TE_HIDHEN_2_ZHOLA : true, KOLORI_THYHET_ME_NJE_ME_SHUME : false, KOLORI_MUND_TE_FILLOJE_ME_AS : true,
ME_SHKEMBIM : true, MUND_TE_SHKEMBEHET_LETER_MBI_DHJETE : false}
// per lojtaret
var ljt = new Array(null, null, null, null);
function cakto_poz() { for(var i=0;i<MAX_USER;i++) if(ljt[i]===null) return i; return -1; }
function lojtar(socket,emri,poz,online,piket,dalur) {this.socket=socket; this.emri=emri; this.poz = poz; this.online=online; this.piket=piket; this.dalur=dalur;}
function shkaterro_lojtar(sock_id) { for(var i=0;i<MAX_USER;i++) if(ljt[i] && (ljt[i].socket.id === sock_id)) { var viktima = ljt[i]; ljt[i] = null; return viktima; } }
var humbesi, fituesi;
// per letrat
var pako = new Array();
function leter(id/*, vlera, lloji, kodi, ne_loje*/) {this.id=id;/* this.vlera=vlera; this.kodi=kodi; this.ne_loje=ne_loje;*/}

// per duart qe luhen
function dore(nr_letra, letrat, vlera, hedhesi, perparesia) {this.nr_letra=nr_letra; this.letrat=letrat; 
	this.vlera=vlera; this.hedhesi=hedhesi; this.perparesia=perparesia;}

// gjendja e lojes
var gjendja;
function krijo_gjendje(/*radha, */nr_lojtare, lojtare_te_dalur, cikel_pas, roundi, duhet_vazhduar_loja, fusha) {/*this.radha=radha;*/ 
	this.nr_lojtare=nr_lojtare; this.lojtare_te_dalur=lojtare_te_dalur; this.cikel_pas=cikel_pas; this.roundi=roundi; 
	this.duhet_vazhduar_loja=duhet_vazhduar_loja; this.fusha = fusha;}

function s_fillo_lojen(nr_lojtare) {
	gjendja = new krijo_gjendje(nr_lojtare, 0, 0, 0, true, null);
	gjendja.fusha = new dore(1, null, 0, null, -1);
	ndihmesi.shperndajLetrat(ljt, pako, gjendja);
	gjendja.radha = ndihmesi.percaktoRadhen(0, nr_lojtare);
	exports.gjendja = gjendja;
}

function pranohetDora(dora, fusha) { return ndihmesi.pranohetDora(dora, fusha); }
function luajDoren(dora, fusha) { return ndihmesi.luajDoren(dora, fusha); }
function kaloRadhen() { ndihmesi.kaloRadhen(); }
function perfundoRoundin() { return ndihmesi.perfundoRoundin(); }
function pas(lojtari) { ndihmesi.pas(lojtari); }

exports.MAX_USER = MAX_USER;
exports.rregullat = rregullat;
exports.ljt = ljt;
exports.cakto_poz = cakto_poz;
exports.lojtar = lojtar;
exports.shkaterro_lojtar = shkaterro_lojtar;
exports.fituesi = fituesi;
exports.humbesi = humbesi;
exports.pako = pako;
exports.leter = leter;
exports.dore = dore;
exports.s_fillo_lojen = s_fillo_lojen;
exports.pranohetDora = pranohetDora;
exports.luajDoren = luajDoren;
exports.kaloRadhen = kaloRadhen;
exports.perfundoRoundin = perfundoRoundin;
exports.pas = pas;
//exports.gjendja = gjendja;