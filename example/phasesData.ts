import { QwikStartData, TimelineSegmentDate } from '../src'

export async function phasesData(
  from: TimelineSegmentDate,
  to: TimelineSegmentDate
): Promise<QwikStartData['phases']> {
  return [
    {
      type: 'ОР',
      start: '2021-01-01T00:00:00',
      end: '2021-02-15T10:00:00',
    },
    {
      type: 'ОПП',
      start: '2021-02-15T10:00:00',
      end: '2021-02-20T00:00:00',
    },
    {
      type: 'ЗАР',
      start: '2021-02-20T00:00:00',
      end: '2021-03-01T00:00:00',
    },
    {
      type: 'ЛД',
      start: '2021-03-01T00:00:00',
      end: '2021-07-01T00:00:00',
    },
    {
      type: 'ВПП',
      start: '2021-07-01T00:00:00',
      end: '2021-07-10T00:00:00',
    },
    {
      type: 'ЛД',
      start: '2021-07-10T00:00:00',
      end: '2021-07-15T00:00:00',
    },
    {
      type: 'ВПП',
      start: '2021-07-15T00:00:00',
      end: '2021-08-01T00:00:00',
    },
    {
      type: 'ОР',
      start: '2021-08-01T00:00:00',
      end: '2021-12-31T00:00:00',
    },
  ]
}
