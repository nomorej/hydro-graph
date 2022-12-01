import { PrecipitationValue, QwikStartPrecipitation, distributeData, Months } from '../src'

export async function precipitationData(months: Months): Promise<QwikStartPrecipitation> {
  return {
    solid: await solid(months),
    liquid: await liquid(months),
    mixed: await mixed(months),
  }
}

async function solid(months: Months): Promise<QwikStartPrecipitation['solid']> {
  return distributeData([
    {
      date: [1, 10],
      data: {
        value: 20,
      },
    },
  ])
}

async function liquid(months: Months): Promise<QwikStartPrecipitation['liquid']> {
  return distributeData([
    {
      date: [1, 20],
      data: {
        value: 5,
      },
    },
  ])
}

async function mixed(months: Months): Promise<QwikStartPrecipitation['mixed']> {
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
