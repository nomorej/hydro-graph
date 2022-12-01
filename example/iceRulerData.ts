import { IceRulerValue, QwikStartIceRuler, distributeData } from '../src'

export async function iceRulerData(): Promise<QwikStartIceRuler> {
  return {
    sludge: await sludge(),
    shoreIce: await shoreIce(),
    shoreIceSludge: await shoreIceSludge(),
    frazilDrift1: await frazilDrift1(),
    frazilDrift2: await frazilDrift2(),
    frazilDrift3: await frazilDrift3(),
    iceDrift1: await iceDrift1(),
    iceDrift2: await iceDrift2(),
    iceDrift3: await iceDrift3(),
    freezing: await freezing(),
    flangeIce: await flangeIce(),
    iceClearing: await iceClearing(),
    error: await error(),
  }
}

async function sludge(): Promise<QwikStartIceRuler['sludge']> {
  return distributeData<IceRulerValue>([
    {
      date: [2, 27],
      data: {
        value: {},
        comment: '????',
      },
    },
  ])
}

async function shoreIce(): Promise<QwikStartIceRuler['shoreIce']> {
  return distributeData<IceRulerValue>([
    {
      date: [3, 2],
      data: {
        value: {},
        comment: ['Опасное явление !!!'],
      },
    },
  ])
}

async function shoreIceSludge(): Promise<QwikStartIceRuler['shoreIceSludge']> {
  return distributeData<IceRulerValue>([
    {
      date: [3, 5],
      data: {
        value: {},
        comment: ['Опасное явление'],
      },
    },
  ])
}

async function frazilDrift1(): Promise<QwikStartIceRuler['frazilDrift1']> {
  return distributeData<IceRulerValue>([
    {
      date: [3, 10],
      data: {
        value: {},
        comment: ['Что-то произошло'],
      },
    },
  ])
}

async function frazilDrift2(): Promise<QwikStartIceRuler['frazilDrift2']> {
  return distributeData<IceRulerValue>([
    {
      date: [3, 11],
      data: {
        value: {},
        comment: ['И тут что-то произошло'],
      },
    },
  ])
}

async function frazilDrift3(): Promise<QwikStartIceRuler['frazilDrift3']> {
  return distributeData<IceRulerValue>([
    {
      date: [3, 12],
      data: {
        value: {},
        comment: ['Что-то произошло-1', 'Что-то произошло-2'],
      },
    },
    {
      date: [3, 26],
      data: {
        value: {
          upperSign: 'iceDamBelow',
        },
        comment: ['Произошло что-то'],
      },
    },
    {
      date: [3, 27],
      data: {
        value: {
          upperSign: 'iceDamBelow',
        },
        comment: ['Могло произойти'],
      },
    },
    {
      date: [3, 28],
      data: {
        value: {
          upperSign: 'iceDamBelow',
        },
        comment: ['Это невозможно'],
      },
    },
  ])
}

async function iceDrift1(): Promise<QwikStartIceRuler['iceDrift1']> {
  return distributeData<IceRulerValue>([
    {
      date: [3, 15],
      data: {
        value: {},
        comment: ['Какое-то событие'],
      },
    },
  ])
}

async function iceDrift2(): Promise<QwikStartIceRuler['iceDrift2']> {
  return distributeData<IceRulerValue>([
    {
      date: [3, 16],
      data: {
        value: {},
        comment: ['Очень опасно'],
      },
    },
  ])
}

async function iceDrift3(): Promise<QwikStartIceRuler['iceDrift3']> {
  return distributeData<IceRulerValue>([
    {
      date: [3, 17],
      data: {
        value: {},
        comment: ['Опасно'],
      },
    },
    {
      date: [3, 23],
      data: {
        value: {
          upperSign: 'iceJamBelow',
        },
        comment: ['Опаснее некуда'],
      },
    },
    {
      date: [3, 24],
      data: {
        value: {
          upperSign: 'iceJamAbove',
        },
        comment: ['Опасность'],
      },
    },
  ])
}

async function freezing(): Promise<QwikStartIceRuler['freezing']> {
  return distributeData<IceRulerValue>([
    {
      date: [3, 18],
      data: {
        value: {},
        comment: ['Все хорошо'],
      },
    },
    {
      date: [3, 19],
      data: {
        value: {
          upperSign: 'waterOnIce',
        },
        comment: ['Все довольно неплохо'],
      },
    },
    {
      date: [3, 20],
      data: {
        value: {},
        comment: ['Проишествие'],
      },
    },
    {
      date: [3, 21],
      data: {
        value: {},
        comment: ['Событие-1', 'Событие-2'],
      },
    },
    {
      date: [3, 22],
      data: {
        value: {
          upperSign: 'waterOnIce',
          iceShove: true,
        },
        comment: ['Проишествие'],
      },
    },
    {
      date: [3, 25],
      data: {
        value: {},
        comment: ['Случилось чудо'],
      },
    },
    {
      date: [3, 29],
      data: {
        value: {},
        comment: ['Чуда не случилось'],
      },
    },
    {
      date: [3, 30],
      data: {
        value: {
          upperSign: 'iceDamAbove',
        },
        comment: ['Чудо почти случилось'],
      },
    },
    {
      date: [3, 31],
      data: {
        value: {
          upperSign: 'iceDamAbove',
        },
        comment: ['Чудо не могло не произойти'],
      },
    },
  ])
}

async function flangeIce(): Promise<QwikStartIceRuler['flangeIce']> {
  return distributeData<IceRulerValue>([
    {
      date: [3, 20],
      data: {
        value: {},
        comment: ['Произошло ого'],
      },
    },
    {
      date: [3, 22],
      data: {
        value: {},
        comment: ['Произошло ничего себе'],
      },
    },
  ])
}

async function iceClearing(): Promise<QwikStartIceRuler['iceClearing']> {
  return distributeData<IceRulerValue>([
    {
      date: [3, 21],
      data: {
        value: {},
        comment: ['Произошло нет'],
      },
    },
  ])
}

async function error(): Promise<QwikStartIceRuler['error']> {
  return distributeData<IceRulerValue>([
    {
      date: [4, 10],
      data: {
        value: {},
        comment: ['Ошибка 1'],
      },
    },
    {
      date: [4, 11],
      data: {
        value: {},
        comment: ['Ошибка'],
      },
    },
    {
      date: [4, 12],
      data: {
        value: {},
        comment: ['Ошибка'],
      },
    },
    {
      date: [4, 15],
      data: {
        value: {},
        comment: ['Ошибка'],
      },
    },
  ])
}
