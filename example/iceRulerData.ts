import { QwikStartData, TimelineSegmentDate } from '../src'

import { requestData } from './requestData'

export async function iceRulerData(
  from: TimelineSegmentDate,
  to: TimelineSegmentDate
): Promise<QwikStartData['iceRuler']> {
  let data: QwikStartData['iceRuler'] | undefined

  try {
    data = await requestData<QwikStartData['iceRuler']>(
      'https://hydro-api.mapmakers.ru/hydrograph-api/ObsData/GetWaterBodyState/12010',
      from,
      to
    )

    data = [
      {
        fill: 0,
        iceShove: false,
        localTime: '2021-03-01T03:00:00',
        obsTime: '2021-03-01T03:00:00',
        text: ['asdsa'],
        upperSign: 0,
        waterState: 0,
      },
      {
        fill: 1,
        iceShove: false,
        localTime: '2021-03-02T03:00:00',
        obsTime: '2021-03-02T03:00:00',
        text: ['asdsa'],
        upperSign: 1,
        waterState: 0,
      },
      {
        fill: 2,
        iceShove: false,
        localTime: '2021-03-03T03:00:00',
        obsTime: '2021-03-03T03:00:00',
        text: ['asdsa'],
        upperSign: 2,
        waterState: 0,
      },
      {
        fill: 3,
        iceShove: false,
        localTime: '2021-03-04T03:00:00',
        obsTime: '2021-03-04T03:00:00',
        text: ['asdsa'],
        upperSign: 3,
        waterState: 0,
      },
      {
        fill: 4,
        iceShove: false,
        localTime: '2021-03-05T03:00:00',
        obsTime: '2021-03-05T03:00:00',
        text: ['asdsa'],
        upperSign: 4,
        waterState: 0,
      },
      {
        fill: 5,
        iceShove: false,
        localTime: '2021-03-06T03:00:00',
        obsTime: '2021-03-06T03:00:00',
        text: ['asdsa'],
        upperSign: 5,
        waterState: 0,
      },
      {
        fill: 6,
        iceShove: false,
        localTime: '2021-03-07T03:00:00',
        obsTime: '2021-03-07T03:00:00',
        text: ['asdsa'],
        upperSign: 0,
        waterState: 0,
      },
      {
        fill: 7,
        iceShove: false,
        localTime: '2021-03-08T03:00:00',
        obsTime: '2021-03-08T03:00:00',
        text: ['asdsa'],
        upperSign: 0,
        waterState: 0,
      },
      {
        fill: 8,
        iceShove: false,
        localTime: '2021-03-09T03:00:00',
        obsTime: '2021-03-09T03:00:00',
        text: ['asdsa'],
        upperSign: 0,
        waterState: 0,
      },
      {
        fill: 9,
        iceShove: false,
        localTime: '2021-03-10T03:00:00',
        obsTime: '2021-03-10T03:00:00',
        text: ['asdsa'],
        upperSign: 0,
        waterState: 0,
      },
      {
        fill: 10,
        iceShove: false,
        localTime: '2021-03-11T03:00:00',
        obsTime: '2021-03-11T03:00:00',
        text: ['asdsa'],
        upperSign: 0,
        waterState: 0,
      },
      {
        fill: 11,
        iceShove: true,
        localTime: '2021-03-12T03:00:00',
        obsTime: '2021-03-12T03:00:00',
        text: ['asdsa'],
        upperSign: 0,
        waterState: 0,
      },
      {
        fill: 12,
        iceShove: false,
        localTime: '2021-03-13T03:00:00',
        obsTime: '2021-03-13T03:00:00',
        text: ['asdsa'],
        upperSign: 0,
        waterState: 0,
      },

      {
        fill: 8,
        iceShove: false,
        localTime: '2021-03-14T03:00:00',
        obsTime: '2021-03-14T03:00:00',
        text: ['asdsa'],
        upperSign: 0,
        waterState: 0,
      },
      {
        fill: 3,
        iceShove: false,
        localTime: '2021-03-15T03:00:00',
        obsTime: '2021-03-15T03:00:00',
        text: ['asdsa'],
        upperSign: 0,
        waterState: 0,
      },
      {
        fill: 13,
        iceShove: false,
        localTime: '2021-03-16T03:00:00',
        obsTime: '2021-03-16T03:00:00',
        text: ['asdsa'],
        upperSign: 0,
        waterState: 0,
      },
      {
        fill: 13,
        iceShove: false,
        localTime: '2021-03-25T03:00:00',
        obsTime: '2021-03-25T03:00:00',
        text: ['asdsa'],
        upperSign: 0,
        waterState: 0,
      },
    ]
  } catch (e) {
    console.error(e)
  }

  return data
}
