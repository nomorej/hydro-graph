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
  return distributeData<IceRulerValue>([
    {
      date: [2, 27],
      data: {
        value: {
          text: ['????'],
        },
      },
    },
  ])
}

function shoreIce(): QwikStartIceRuler['shoreIce'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 2],
      data: {
        value: {
          text: ['Опасное явление !!!'],
        },
      },
    },
  ])
}

function shoreIceSludge(): QwikStartIceRuler['shoreIceSludge'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 5],
      data: {
        value: {
          text: ['Опасное явление'],
        },
      },
    },
  ])
}

function frazilDrift1(): QwikStartIceRuler['frazilDrift1'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 10],
      data: {
        value: {
          text: ['Что-то произошло'],
        },
      },
    },
  ])
}

function frazilDrift2(): QwikStartIceRuler['frazilDrift2'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 11],
      data: {
        value: {
          text: ['И тут что-то произошло'],
        },
      },
    },
  ])
}

function frazilDrift3(): QwikStartIceRuler['frazilDrift3'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 12],
      data: {
        value: {
          text: ['Что-то произошло-1', 'Что-то произошло-2'],
        },
      },
    },
    {
      date: [3, 26],
      data: {
        value: {
          upperSign: 'iceDamBelow',
          text: ['Произошло что-то'],
        },
      },
    },
    {
      date: [3, 27],
      data: {
        value: {
          upperSign: 'iceDamBelow',
          text: ['Могло произойти'],
        },
      },
    },
    {
      date: [3, 28],
      data: {
        value: {
          upperSign: 'iceDamBelow',
          text: ['Это невозможно'],
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
        value: {
          text: ['Какое-то событие'],
        },
      },
    },
  ])
}

function iceDrift2(): QwikStartIceRuler['iceDrift2'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 16],
      data: {
        value: {
          text: ['Очень опасно'],
        },
      },
    },
  ])
}

function iceDrift3(): QwikStartIceRuler['iceDrift3'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 17],
      data: {
        value: {
          text: ['Опасно'],
        },
      },
    },
    {
      date: [3, 23],
      data: {
        value: {
          upperSign: 'iceJamBelow',
          text: ['Опаснее некуда'],
        },
      },
    },
    {
      date: [3, 24],
      data: {
        value: {
          upperSign: 'iceJamAbove',
          text: ['Опасность'],
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
        value: {
          text: ['Все хорошо'],
        },
      },
    },
    {
      date: [3, 19],
      data: {
        value: {
          upperSign: 'waterOnIce',
          text: ['Все довольно неплохо'],
        },
      },
    },
    {
      date: [3, 20],
      data: {
        value: {
          text: ['Проишествие'],
        },
      },
    },
    {
      date: [3, 21],
      data: {
        value: {
          text: ['Событие-1', 'Событие-2'],
        },
      },
    },
    {
      date: [3, 22],
      data: {
        value: {
          upperSign: 'waterOnIce',
          iceShove: true,
          text: ['Проишествие'],
        },
      },
    },
    {
      date: [3, 25],
      data: {
        value: {
          text: ['Случилось чудо'],
        },
      },
    },
    {
      date: [3, 29],
      data: {
        value: {
          text: ['Чуда не случилось'],
        },
      },
    },
    {
      date: [3, 30],
      data: {
        value: {
          upperSign: 'iceDamAbove',
          text: ['Чудо почти случилось'],
        },
      },
    },
    {
      date: [3, 31],
      data: {
        value: {
          upperSign: 'iceDamAbove',
          text: ['Чудо не могло не произойти'],
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
        value: {
          text: ['Произошло ого'],
        },
      },
    },
    {
      date: [3, 22],
      data: {
        value: {
          text: ['Произошло ничего себе'],
        },
      },
    },
  ])
}

function iceClearing(): QwikStartIceRuler['iceClearing'] {
  return distributeData<IceRulerValue>([
    {
      date: [3, 21],
      data: {
        value: {
          text: ['Произошло нет'],
        },
      },
    },
  ])
}

function error(): QwikStartIceRuler['error'] {
  return distributeData<IceRulerValue>([])
}
