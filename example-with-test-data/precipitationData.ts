import { PrecipitationValue, QwikStartPrecipitation, distributeData } from '../src'
import { Months } from '../src/utils/getMonths'
import { testData } from '../src/utils/testData'

export function precipitationData(months: Months): QwikStartPrecipitation {
  return {
    solid: solid(months),
    liquid: liquid(months),
    mixed: mixed(),
  }
}

function solid(months: Months): QwikStartPrecipitation['solid'] {
  return testData(months, { skip: 0.8 })
}

function liquid(months: Months): QwikStartPrecipitation['liquid'] {
  return testData(months, { skip: 0.8 })
}

function mixed(): QwikStartPrecipitation['mixed'] {
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
    {
      date: [2, 25],
      data: {
        value: {
          liquid: 10,
          solid: 10,
        },
      },
    },
    {
      date: [5, 14],
      data: {
        value: {
          liquid: 22,
          solid: 10,
        },
      },
    },
  ])
}
