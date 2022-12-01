import { PrecipitationValue, QwikStartPrecipitation, distributeData } from '../src'

export async function precipitationData(): Promise<QwikStartPrecipitation> {
  return {
    solid: await solid(),
    liquid: await liquid(),
    mixed: await mixed(),
  }
}

async function solid(): Promise<QwikStartPrecipitation['solid']> {
  return distributeData([
    {
      date: [1, 10],
      data: {
        value: 20,
      },
    },
  ])
}

async function liquid(): Promise<QwikStartPrecipitation['liquid']> {
  return distributeData([
    {
      date: [1, 20],
      data: {
        value: 5,
      },
    },
  ])
}

async function mixed(): Promise<QwikStartPrecipitation['mixed']> {
  return distributeData<PrecipitationValue>([
    {
      date: [2, 15],
      data: {
        value: {
          liquid: 2,
          solid: 30,
        },
      },
    },
  ])
}
