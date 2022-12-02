import { QwikStartPrecipitation, TimelineSegmentDate } from '../src'

export async function precipitationData(
  from: TimelineSegmentDate,
  to: TimelineSegmentDate
): Promise<QwikStartPrecipitation> {
  return {
    liquid: [
      {
        date: '2021-02-01T00:00:00',
        value: 10,
        fillDay: true,
      },
    ],
    solid: [
      {
        date: '2021-02-03T00:00:00',
        value: 20,
        fillDay: true,
      },
    ],
    mixed: [
      {
        date: '2021-02-05T00:00:00',
        value: {
          liquid: 5,
          solid: 15,
        },
        fillDay: true,
      },
    ],
  }
}
