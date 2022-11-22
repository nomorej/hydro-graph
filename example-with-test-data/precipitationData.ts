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
  return testData(months, { skip: 0.5 })
}

function liquid(months: Months): QwikStartPrecipitation['liquid'] {
  return testData(months, { skip: 0.5 })
}

function mixed(): QwikStartPrecipitation['mixed'] {
  return distributeData<PrecipitationValue>([
    {
      date: [2, 15],
      data: {
        value: {
          value: 25,
          type: 'liquid',
        },
      },
    },
    {
      date: [2, 15],
      data: {
        value: {
          value: 13,
          type: 'solid',
        },
      },
    },
  ])
}