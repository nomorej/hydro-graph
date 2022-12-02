import { QwikStartIceRuler, iceRulerFills, iceRulerUpperSigns, TimelineSegmentDate } from '../src'

interface ResponseDataItem {
  localTime: TimelineSegmentDate
  obsTime: TimelineSegmentDate
  fill: keyof typeof iceRulerFills
  upperSign: keyof typeof iceRulerUpperSigns
  iceShove: boolean
  waterState: number
  text: Array<string>
}

type ResponseData = Array<ResponseDataItem>

export async function iceRulerWithRealData(): Promise<QwikStartIceRuler> {
  const result: QwikStartIceRuler = {}

  try {
    const data = await request(2021)

    let k: keyof typeof iceRulerFills
    for (k in iceRulerFills) {
      const v = iceRulerFills[k]

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

async function request(year: string | number): Promise<ResponseData> {
  const response = await fetch(
    `https://hydro-api.mapmakers.ru/hydrograph-api/ObsData/GetWaterBodyState/12010?dtFrom=${year}-01-01&dtTo=${year}-12-31`,
    {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic29mdGxpbmUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhZG1pbiIsInVpZCI6IjYyNDMzZTM4NTUxZjE0NmRhOGFlZDFmMSIsInNpZCI6IjYzODljZTMxOTY3ZTdhNzJkZWM0N2U3YyIsIm5iZiI6MTY2OTk3NTYwMSwiZXhwIjoxNjcwMDYyMDAxLCJpc3MiOiJtYXBtYWtlcnMuaHlkcm8iLCJhdWQiOiJ3ZWIifQ.QQRl0GnDAuwBOvOU5I_h55B8vjcfAzqmm38RJPmWNBc`,
      },
    }
  )

  return response.json()
}
