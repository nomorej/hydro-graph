import { QwikStartWaterTemperature, distributeData } from '../src'

export async function waterTemperatureData(): Promise<QwikStartWaterTemperature> {
  return {
    default: await def(),
  }
}

export async function def(): Promise<QwikStartWaterTemperature['default']> {
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
