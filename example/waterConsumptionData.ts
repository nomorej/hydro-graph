import { QwikStartData, TimelineSegmentDate } from '../src'

export async function waterConsumptionData(
  from: TimelineSegmentDate,
  to: TimelineSegmentDate
): Promise<QwikStartData['waterСonsumption']> {
  return {
    calculated: [
      {
        date: '2021-03-01T00:00:00',
        value: 5,
      },
      {
        date: '2021-04-01T00:00:00',
        value: 100,
      },
    ],
    measured: [
      {
        date: '2021-03-01T00:00:00',
        value: 5,
      },
      {
        date: '2021-04-01T00:00:00',
        value: 200,
      },
    ],
    operational: [
      {
        date: '2021-03-01T00:00:00',
        value: 50,
      },
      {
        date: '2021-04-01T00:00:00',
        value: 80,
      },
    ],
    qh: [
      {
        date: '2021-03-01T00:00:00',
        value: 120,
      },
      {
        date: '2021-04-01T00:00:00',
        value: 220,
      },
    ],
  }
}
