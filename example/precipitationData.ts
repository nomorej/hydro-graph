import { PrecipitationValue, QwikStartPrecipitation, distributeData } from '../src'

export function precipitationData(): QwikStartPrecipitation {
  return {
    solid: solid(),
    liquid: liquid(),
    mixed: mixed(),
  }
}

function solid(): QwikStartPrecipitation['solid'] {
  return distributeData([
    {
      date: [1, 10],
      data: {
        value: 20,
      },
    },
  ])
}

function liquid(): QwikStartPrecipitation['liquid'] {
  return distributeData([
    {
      date: [1, 20],
      data: {
        value: 5,
      },
    },
  ])
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
