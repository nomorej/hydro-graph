import { QwikStartData, TimelineSegmentDate } from '../src'

export async function airTemperatureData(
  from: TimelineSegmentDate,
  to: TimelineSegmentDate
): Promise<QwikStartData['airTemperature']> {
  return {
    min: [
      {
        date: '2021-01-01T00:00:00',
        value: 10,
      },
      {
        date: '2021-02-01T00:00:00',
        value: 30,
      },
      {
        date: '2021-02-03T00:00:00',
        value: 15,
      },
      {
        date: '2021-02-10T00:00:00',
        value: 30,
      },
    ],
    middle: [
      {
        date: '2021-01-01T00:00:00',
        value: -20,
      },
      {
        date: '2021-02-01T00:00:00',
        value: 10,
      },
    ],
    max: [
      {
        date: '2021-01-01T00:00:00',
        value: 5,
      },
      {
        date: '2021-02-01T00:00:00',
        value: 16,
      },
    ],
    post: [
      {
        date: '2021-01-01T00:00:00',
        value: 3,
      },
      {
        date: '2021-02-01T00:00:00',
        value: 12,
      },
    ],
    sumTempAll: [
      {
        date: '2021-01-05T00:00:00',
        value: 8,
        fillDay: true,
      },
    ],
    sumTempAutumn: [
      {
        date: '2021-01-06T00:00:00',
        value: 20,
        fillDay: true,
      },
    ],
    sumTempSpring: [
      {
        date: '2021-01-07T00:00:00',
        value: 5,
        fillDay: true,
      },
    ],
  }
}
