import { QwikStartData, TimelineSegmentDate } from '../src'

import { requestData } from './requestData'

export async function iceRulerWithRealData(
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
  } catch (e) {
    console.error(e)
  }

  return data
}
