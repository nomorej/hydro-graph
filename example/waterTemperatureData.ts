import { QwikStartWaterTemperature, distributeData } from '../src'

export function waterTemperatureData(): QwikStartWaterTemperature {
  return {
    default: def(),
  }
}

export function def(): QwikStartWaterTemperature['default'] {
  return distributeData([
    {
      date: [2, 1],
      data: {
        value: 0,
      },
    },
    {
      date: [2, 10],
      data: {
        value: 40,
      },
    },
  ])
}
