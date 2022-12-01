import { IceRulerValue, QwikStartIceRuler, distributeData, Months, getDate } from '../src'

const FILL = {
  0: 'none',
  1: 'sludge',
  2: 'shoreIceSludge',
  3: 'shoreIce',
  4: 'iceDrift1',
  5: 'iceDrift2',
  6: 'iceDrift3',
  7: 'iceClearing',
  8: 'freezing',
  9: 'frazilDrift1',
  10: 'frazilDrift2',
  11: 'frazilDrift3',
  12: 'flangeIce',
  13: 'error',
} as const

const UPPER_SIGN = {
  1: 'waterOnIce',
  2: 'iceJamBelow',
  3: 'iceJamAbove',
  4: 'iceDamBelow',
  5: 'iceDamAbove',
} as const

interface ResponseDataItem {
  localTime: string
  obsTime: string
  fill: keyof typeof FILL
  upperSign: keyof typeof UPPER_SIGN
  iceShove: boolean
  waterState: number
  text: Array<string>
}

type ResponseData = Array<ResponseDataItem>

export async function iceRulerWithRealData(months: Months): Promise<QwikStartIceRuler> {
  const key =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic29mdGxpbmUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhZG1pbiIsInVpZCI6IjYyNDMzZTM4NTUxZjE0NmRhOGFlZDFmMSIsInNpZCI6IjYzODg1OGIwOTY3ZTdhNzJkZWM0N2U3YSIsIm5iZiI6MTY2OTg3OTk4NCwiZXhwIjoxNjY5OTY2Mzg0LCJpc3MiOiJtYXBtYWtlcnMuaHlkcm8iLCJhdWQiOiJ3ZWIifQ.JbwbSuClzmQ4hweudBBxgmIBolW0gFQTjtmZEsufArU'

  const response = await fetch(
    'https://hydro-api.mapmakers.ru/hydrograph-api/ObsData/GetWaterBodyState/12010?dtFrom=2021-01-01&dtTo=2021-12-31',
    {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    }
  )

  const data = (await response.json()) as ResponseData

  console.log(data)

  return {
    sludge: getParts('sludge', months, data),
    shoreIce: getParts('shoreIce', months, data),
    shoreIceSludge: getParts('shoreIceSludge', months, data),
    frazilDrift1: getParts('frazilDrift1', months, data),
    frazilDrift2: getParts('frazilDrift2', months, data),
    frazilDrift3: getParts('frazilDrift3', months, data),
    iceDrift1: getParts('iceDrift1', months, data),
    iceDrift2: getParts('iceDrift2', months, data),
    iceDrift3: getParts('iceDrift3', months, data),
    freezing: getParts('freezing', months, data),
    flangeIce: getParts('flangeIce', months, data),
    iceClearing: getParts('iceClearing', months, data),
    error: getParts('error', months, data),
    none: getParts('none', months, data),
  }
}

function getParts(
  name: keyof QwikStartIceRuler,
  months: Months,
  data: ResponseData
): QwikStartIceRuler['sludge'] {
  return distributeData<IceRulerValue>(
    data
      .filter((item) => FILL[item.fill] === name)
      .map((item) => {
        return {
          date: getDate(months, item.obsTime, true),
          data: {
            value: {
              iceShove: item.iceShove,
              upperSign: UPPER_SIGN[item.upperSign],
            },
            comment: item.text,
          },
        }
      })
  )
}
