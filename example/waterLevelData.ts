import { QwikStartWaterLevel, distributeData } from '../src'

export async function waterLevelData(): Promise<QwikStartWaterLevel> {
  return {
    default: await def(),
  }
}

export async function def(): Promise<QwikStartWaterLevel['default']> {
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
