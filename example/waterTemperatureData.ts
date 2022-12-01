import { QwikStartWaterTemperature, distributeData, Months } from '../src'

export async function waterTemperatureData(months: Months): Promise<QwikStartWaterTemperature> {
  return {
    default: await def(months),
  }
}

export async function def(months: Months): Promise<QwikStartWaterTemperature['default']> {
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
