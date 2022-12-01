import { QwikStartSnowIce, distributeData } from '../src'

export function snowIceData(): QwikStartSnowIce {
  return {
    default: def(),
  }
}

function def(): QwikStartSnowIce['default'] {
  return distributeData([
    {
      date: [4, 10],
      data: {
        value: {
          snow: 5,
          ice: 10,
        },
      },
    },
    {
      date: [4, 11],
      data: {
        value: {
          snow: 10,
          ice: 5,
        },
      },
    },
    {
      date: [4, 12],
      data: {
        value: {
          snow: 0,
          ice: 3,
        },
      },
    },
  ])
}
