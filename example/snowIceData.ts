import { QwikStartSnowIce, distributeData } from '../src'

export function snowIceData(): QwikStartSnowIce {
  return {
    snow: snow(),
    ice: ice(),
  }
}

function ice(): QwikStartSnowIce['ice'] {
  return distributeData([
    {
      date: [4, 10],
      data: {
        value: 10,
      },
    },
    {
      date: [4, 15],
      data: {
        value: 5,
      },
    },
    {
      date: [5, 10],
      data: {
        value: 20,
      },
    },
    {
      date: [5, 15],
      data: {
        value: 13,
      },
    },
  ])
}

function snow(): QwikStartSnowIce['snow'] {
  return distributeData([
    {
      date: [4, 10],
      data: {
        value: -20,
      },
    },
    {
      date: [4, 15],
      data: {
        value: -10,
      },
    },
    {
      date: [5, 10],
      data: {
        value: -20,
      },
    },
    {
      date: [5, 15],
      data: {
        value: -10,
      },
    },
  ])
}
