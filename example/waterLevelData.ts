import { QwikStartWaterLevel, distributeData, Months } from '../src'

export async function waterLevelData(months: Months): Promise<QwikStartWaterLevel> {
  return {
    default: await def(months),
  }
}

export async function def(months: Months): Promise<QwikStartWaterLevel['default']> {
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
