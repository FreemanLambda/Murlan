function LeterException(error) {
  this.errorId = error.errorId;
  this.msg = error.msg;
}

export default class Leter {
  constructor(id) {
    if (!Number(id) || id < 0 || id > 54) {
      throw new LeterException({
        errorId: 1,
        msg: 'Vlera e palejuar per id, duhet nga 1 ne 54',
      });
    }
    this.id = id;
    let lloji;
    let vlera;
    let kodi;
    if (id < 53) {
      // lloji
      lloji = Math.floor((id - 1) / 13);
      if (lloji === 0) {
        lloji = 'Spathi';
      } else if (lloji === 1) {
        lloji = 'Diner';
      } else if (lloji === 2) {
        lloji = 'Mac';
      } else if (lloji === 3) {
        lloji = 'Kupe';
      }
      // vlera
      vlera = (id - 1) % 13 + 3;
      // kodi
      kodi = lloji[0] + (vlera % 13 || 13);
    } else {
      // zholat
      if (id === 53) {
        // zholi i zi
        lloji = 'I zi';
        vlera = 16;
        kodi = 'ZZ';
      } else if (id === 54) {
        // zholi i kuq
        lloji = 'I kuq';
        vlera = 17;
        kodi = 'KZ';
      }
    }

    this.vlera = vlera;
    this.lloji = lloji;
    this.kodi = kodi;
  }
}
