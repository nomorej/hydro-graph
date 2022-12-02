import { QwikStartSnowIce, TimelineSegmentDate } from '../src'

export async function snowIceData(
  from: TimelineSegmentDate,
  to: TimelineSegmentDate
): Promise<QwikStartSnowIce> {
  return {
    default: [
      {
        date: '2021-03-01T00:00:00',
        value: {
          ice: 10,
          snow: 20,
        },
      },
      {
        date: '2021-03-03T00:00:00',
        value: {
          ice: 15,
          snow: 5,
        },
      },
      {
        date: '2021-03-15T00:00:00',
        value: {
          ice: 15,
          snow: 5,
        },
      },
      {
        date: '2021-03-17T00:00:00',
        value: {
          ice: 15,
          snow: 5,
        },
      },
    ],
  }
}
