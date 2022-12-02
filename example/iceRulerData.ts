import {
  QwikStartIceRuler,
  iceRulerFills,
  iceRulerUpperSigns,
  TimelineSegmentDateWithTime,
  TimelineSegmentDate,
} from '../src'
import { requestData } from './requestData'

/**
 * Одна запись из массива GetWaterBodyState
 */
interface ResponseDataItem {
  localTime: TimelineSegmentDateWithTime
  obsTime: TimelineSegmentDateWithTime
  fill: keyof typeof iceRulerFills
  upperSign: keyof typeof iceRulerUpperSigns
  iceShove: boolean
  waterState: number
  text: Array<string>
}

/**
 * Все записи GetWaterBodyState
 */
type ResponseData = Array<ResponseDataItem>

export async function iceRulerData(
  from: TimelineSegmentDate,
  to: TimelineSegmentDate
): Promise<QwikStartIceRuler> {
  const result: QwikStartIceRuler = {}

  try {
    /**
     * Записи из API
     */
    const data = await requestData<ResponseData>(
      'https://hydro-api.mapmakers.ru/hydrograph-api/ObsData/GetWaterBodyState/12010',
      from,
      to
    )

    /**
     * параметр fill(число)
     */
    let k: keyof typeof iceRulerFills
    for (k in iceRulerFills) {
      /**
       * параметр fill(Название)
       */
      const v = iceRulerFills[k]

      /**
       * Список записей для каждого парамера fill
       */
      result[v] = data
        .filter((item) => k == item.fill)
        .map((item) => {
          return {
            date: item.obsTime,
            value: {
              iceShove: item.iceShove,
              upperSign: iceRulerUpperSigns[item.upperSign],
            },
            comment: item.text,
          }
        })
    }
  } catch (e) {
    console.error(e)
  }

  return result
}
