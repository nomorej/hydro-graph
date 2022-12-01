import { QwikStartPhases } from '../src'
import { Months } from '../src/utils/getMonths'

export async function phasesData(months: Months): Promise<QwikStartPhases> {
  return [
    {
      type: 'ОР',
      start: [1, 1, 1],
      end: [2, 15, 10],
    },
    {
      type: 'ОПП',
      start: [2, 15, 10],
      end: [2, 20],
    },
    {
      type: 'ЗАР',
      start: [2, 20],
      end: [3],
    },
    {
      type: 'ЛД',
      start: [3],
      end: [7],
    },
    {
      type: 'ВПП',
      start: [7],
      end: [7, 10],
    },
    {
      type: 'ЛД',
      start: [7, 10],
      end: [7, 15],
    },
    {
      type: 'ВПП',
      start: [7, 15],
      end: [8],
    },
    {
      type: 'ОР',
      start: [8],
      end: [12, 31],
      fill: true,
    },
  ]
}
