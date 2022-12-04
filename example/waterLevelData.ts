import { QwikStartData, TimelineSegmentDate } from '../src'

export async function waterLevelData(
  from: TimelineSegmentDate,
  to: TimelineSegmentDate
): Promise<QwikStartData['waterlevel']> {
  return {
    adverse: 100,
    dangerous: 200,
    default: [
      {
        date: '2021-05-05T00:00:00',
        value: 5,
      },
      {
        date: '2021-05-07T00:00:00',
        value: 300,
      },
    ],
  }
}
