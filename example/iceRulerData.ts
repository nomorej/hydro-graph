import { IceRulerValue, QwikStartIceRuler, distributeData } from '../src'

export function iceRulerData(): QwikStartIceRuler {
  return {
    sludge: sludge(),
    shoreIce: shoreIce(),
    shoreIceSludge: shoreIceSludge(),
    frazilDrift1: frazilDrift1(),
    frazilDrift2: frazilDrift2(),
    frazilDrift3: frazilDrift3(),
    iceDrift1: iceDrift1(),
    iceDrift2: iceDrift2(),
    iceDrift3: iceDrift3(),
    freezing: freezing(),
    flangeIce: flangeIce(),
    iceClearing: iceClearing(),
    error: error(),
  }
}

function sludge(): QwikStartIceRuler['sludge'] {
  return distributeData<IceRulerValue>([])
}

function shoreIce(): QwikStartIceRuler['shoreIce'] {
  return distributeData<IceRulerValue>([])
}

function shoreIceSludge(): QwikStartIceRuler['shoreIceSludge'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 5],
      data: {
        value: {},
      },
    },
  ])
}

function frazilDrift1(): QwikStartIceRuler['frazilDrift1'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 10],
      data: {
        value: {},
      },
    },
  ])
}

function frazilDrift2(): QwikStartIceRuler['frazilDrift2'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 11],
      data: {
        value: {},
      },
    },
  ])
}

function frazilDrift3(): QwikStartIceRuler['frazilDrift3'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 12],
      data: {
        value: {},
      },
    },
    {
      date: [3, 26],
      data: {
        value: {
          upperSign: 'iceDamBelow',
        },
      },
    },
    {
      date: [3, 27],
      data: {
        value: {
          upperSign: 'iceDamBelow',
        },
      },
    },
    {
      date: [3, 28],
      data: {
        value: {
          upperSign: 'iceDamBelow',
        },
      },
    },
  ])
}

function iceDrift1(): QwikStartIceRuler['iceDrift1'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 15],
      data: {
        value: {},
      },
    },
  ])
}

function iceDrift2(): QwikStartIceRuler['iceDrift2'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 16],
      data: {
        value: {},
      },
    },
  ])
}

function iceDrift3(): QwikStartIceRuler['iceDrift3'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 17],
      data: {
        value: {},
      },
    },
    {
      date: [3, 23],
      data: {
        value: {
          upperSign: 'iceJamBelow',
        },
      },
    },
    {
      date: [3, 24],
      data: {
        value: {
          upperSign: 'iceJamAbove',
        },
      },
    },
  ])
}

function freezing(): QwikStartIceRuler['freezing'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 18],
      data: {
        value: {},
      },
    },
    {
      date: [3, 19],
      data: {
        value: {
          upperSign: 'waterOnIce',
        },
      },
    },
    {
      date: [3, 20],
      data: {
        value: {},
      },
    },
    {
      date: [3, 21],
      data: {
        value: {},
      },
    },
    {
      date: [3, 22],
      data: {
        value: {
          upperSign: 'waterOnIce',
          iceShove: true,
        },
      },
    },
    {
      date: [3, 25],
      data: {
        value: {},
      },
    },
    {
      date: [3, 29],
      data: {
        value: {},
      },
    },
    {
      date: [3, 30],
      data: {
        value: {
          upperSign: 'iceDamAbove',
        },
      },
    },
    {
      date: [3, 31],
      data: {
        value: {
          upperSign: 'iceDamAbove',
        },
      },
    },
  ])
}

function flangeIce(): QwikStartIceRuler['flangeIce'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 20],
      data: {
        value: {},
      },
    },
    {
      date: [3, 22],
      data: {
        value: {},
      },
    },
  ])
}

function iceClearing(): QwikStartIceRuler['iceClearing'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 21],
      data: {
        value: {},
      },
    },
  ])
}

function error(): QwikStartIceRuler['error'] {
  return distributeData<IceRulerValue>([])
}
