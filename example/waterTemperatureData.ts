import { QwikStartData, TimelineSegmentDate } from '../src'

export async function waterTemperatureData(
  from: TimelineSegmentDate,
  to: TimelineSegmentDate
): Promise<QwikStartData['waterTemperature']> {
  return {
    default: [
      {
        date: '2021-03-05T00:00:00',
        value: 5,
      },
      {
        date: '2021-04-15T00:00:00',
        value: 30,
      },
    ],
  }
}
