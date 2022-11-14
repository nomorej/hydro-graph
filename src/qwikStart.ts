import { ComplexGraph, Parameters } from './core/ComplexGraph'
import { GraphMonthData } from './core/Graph'
import { AirTemperature, AirTemperatureParameters } from './graphs/AirTemperature'
import { Precipitation, PrecipitationParameters } from './graphs/Precipitation'
import { SnowLevel, SnowLevelParameters } from './graphs/SnowLevel'
import { WaterLevel, WaterLevelParameters } from './graphs/WaterLevel'
import { WaterTemperature, WaterTemperatureParameters } from './graphs/WaterTemperature'
import { WaterСonsumption, WaterСonsumptionParameters } from './graphs/WaterСonsumption'
import { Content } from './objects/Content'
import { Phase, PhaseParameters } from './objects/Phase'
import { Scrollbar } from './objects/Scrollbar'
import { Timeline } from './objects/Timeline'
import { Buttons } from './plugins/Buttons'
import { Range } from './utils/ts'

const phasesSettings = {
  ОР: {
    fontColor: '#C08C50',
    backgroundColor: '#FEFFD7',
    name: 'Открытое русло',
    shortName: 'ОР',
  },
  ОПП: {
    fontColor: '#C86546',
    backgroundColor: '#FBE9DD',
    name: 'Полное название',
    shortName: 'ОПП',
  },
  ЛД: {
    fontColor: '#243372',
    backgroundColor: '#D5F2FA',
    name: 'Ледостав',
    shortName: 'ЛД',
  },
  ВПП: {
    fontColor: '#2F7B3A',
    backgroundColor: '#E0FFDF',
    name: 'Полное название',
    shortName: 'ВПП',
  },
}

export const monthsSettings = (leapYear = false) =>
  [
    {
      title: 'Октябрь',
      daysNumber: 31,
    },
    {
      title: 'Ноябрь',
      daysNumber: 30,
    },
    {
      title: 'Декабрь',
      daysNumber: 31,
    },
    {
      title: 'Январь',
      daysNumber: 31,
    },
    {
      title: 'Февраль',
      daysNumber: leapYear ? 29 : 28,
    },
    {
      title: 'Март',
      daysNumber: 31,
    },
    {
      title: 'Апрель',
      daysNumber: 30,
    },
    {
      title: 'Май',
      daysNumber: 31,
    },
    {
      title: 'Июнь',
      daysNumber: 30,
    },
    {
      title: 'Июль',
      daysNumber: 31,
    },
    {
      title: 'Август',
      daysNumber: 31,
    },
    {
      title: 'Сентябрь',
      daysNumber: 30,
    },
    {
      title: 'Октябрь',
      daysNumber: 31,
    },
  ] as const

type MonthsLength = ReturnType<typeof monthsSettings>['length']

export function monthsData(
  data: Partial<{
    [KEY in Exclude<Range<MonthsLength>, MonthsLength>]: GraphMonthData<
      Exclude<Range<ReturnType<typeof monthsSettings>[KEY]['daysNumber']>, 0>
    >
  }>
) {
  const months = monthsSettings()
  const preparedData: Array<GraphMonthData> = new Array(months.length)

  for (const key in data) {
    const monthData = data[key as '0']!
    preparedData[key as '0'] = monthData
  }

  for (let index = 0; index < preparedData.length; index++) {
    if (!preparedData[index]) preparedData[index] = []
  }

  return preparedData
}

export interface QwikStartParameters extends Pick<Parameters, 'wrapper' | 'font'> {
  leapYear?: boolean
  data: {
    airTemperature: AirTemperatureParameters['data']
    precipitation: PrecipitationParameters['data']
    waterTemperature: WaterTemperatureParameters['data']
    snowLevel: SnowLevelParameters['data']
    waterlevel: WaterLevelParameters['data']
    waterСonsumption: WaterСonsumptionParameters['data']
    phases?: Array<{
      type: keyof typeof phasesSettings
      start: PhaseParameters['start']
      end: PhaseParameters['end']
    }>
  }
}

export function qwikStart(parameters: QwikStartParameters) {
  const cg = new ComplexGraph({
    smoothness: 5,
    months: monthsSettings(parameters.leapYear) as any,
    ...parameters,
  })

  cg.add(new Content())

  parameters.data.phases?.forEach((phase) => {
    cg.add(
      new Phase({
        ...phasesSettings[phase.type],
        start: phase.start,
        end: phase.end,
      })
    )
  })

  cg.add(new Timeline())
  cg.add(new Scrollbar())

  const airTemperature = cg.add(
    new AirTemperature({
      name: 'Температура воздуха',
      row: 0,
      rowFactor: 1.5,
      scaleTitle: 't воздуха °C',
      data: parameters.data.airTemperature,
      titles: {
        max: 'Максимальная',
        middle: 'Средняя',
        min: 'Минимальная',
      },
    })
  )

  const precipitation = cg.add(
    new Precipitation({
      name: 'Осадки',
      row: 1,
      scaleTitle: 'Осадки, мм',
      data: parameters.data.precipitation,
      titles: {
        liquid: 'Жидкие',
        solid: 'Твердые',
        mixed: 'Смешанные',
      },
      unactive: true,
    })
  )

  const waterTemperature = cg.add(
    new WaterTemperature({
      name: 'Температура воды',
      row: 2,
      scaleTitle: 't воды °C',
      data: parameters.data.waterTemperature,
      unactive: true,
    })
  )

  const snowLevel = cg.add(
    new SnowLevel({
      name: 'Снег, Лед',
      row: 2,
      scaleTitle: 'Снег, лед см',
      data: parameters.data.snowLevel,
      unactive: true,
    })
  )

  const waterlevel = cg.add(
    new WaterLevel({
      name: 'Уровень воды',
      row: 3,
      rowFactor: 2,
      scaleTitle: 'Ур. воды, см',
      scaleStep: 50,
      data: parameters.data.waterlevel,
      unactive: true,
    })
  )

  const waterСonsumption = cg.add(
    new WaterСonsumption({
      name: 'Расход воды',
      row: 3,
      scaleTitle: 'Расход м / c',
      scalePosition: 'right',
      scaleStep: 50,
      data: parameters.data.waterСonsumption,
      titles: {
        calculated: 'Рассчитанные',
        measured: 'Измеренные',
        qh: 'QH',
      },
      unactive: true,
    })
  )

  cg.add(new Buttons())

  return {
    airTemperature,
    precipitation,
    waterTemperature,
    snowLevel,
    waterlevel,
    waterСonsumption,
    destroy() {
      cg.destroy()
    },
  }
}
