import { QwikStartWaterLevel, distributeData } from '../src'

export function waterLevelData(): QwikStartWaterLevel {
  return {
    default: def(),
  }
}

export function def(): QwikStartWaterLevel['default'] {
  return distributeData([
    {
      date: [6, 1],
      data: {
        value: 0,
      },
    },
    {
      date: [6, 10],
      data: {
        value: 40,
      },
    },
  ])
}
