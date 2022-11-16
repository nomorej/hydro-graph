import { ComplexGraph, Parameters } from './core/ComplexGraph'
import { VisualizerGroupData } from './core/Visualizer'
import { AirTemperature, AirTemperatureGroupsNames } from './graphs/AirTemperature'
import { Precipitation, PrecipitationGroupsNames, PrecipitationValue } from './graphs/Precipitation'
import { SnowIce, SnowIceGroupsNames } from './graphs/SnowIce'
import { WaterLevel } from './graphs/WaterLevel'
import { WaterTemperature } from './graphs/WaterTemperature'
import { WaterСonsumption, WaterСonsumptionGroupsNames } from './graphs/WaterСonsumption'
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
    [KEY in Exclude<Range<MonthsLength>, MonthsLength>]: VisualizerGroupData<any>[number]
  }>
) {
  const months = monthsSettings()
  const preparedData: VisualizerGroupData<any> = new Array(months.length)

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
    airTemperature: { [key in AirTemperatureGroupsNames]?: VisualizerGroupData<number> }
    precipitation: {
      [key in PrecipitationGroupsNames]?: VisualizerGroupData<PrecipitationValue>
    }
    waterTemperature: { default: VisualizerGroupData<number> }
    snowIce: { [key in SnowIceGroupsNames]?: VisualizerGroupData<number> }
    waterlevel: { default: VisualizerGroupData<number> }
    waterСonsumption: { [key in WaterСonsumptionGroupsNames]?: VisualizerGroupData<number> }
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
      scale: {
        title: 't воздуха °C',
        color: '#B13007',
        gridColor: '#B13007',
      },
      groups: {
        min: {
          months: parameters.data.airTemperature.min || [],
          title: 'Минимальная',
          color: '#0066FF',
        },
        middle: {
          months: parameters.data.airTemperature.middle || [],
          title: 'Средняя',
          color: '#6B6C7E',
        },
        max: {
          months: parameters.data.airTemperature.max || [],
          title: 'Минимальная',
          color: '#D72929',
        },
        post: {
          months: parameters.data.airTemperature.post || [],
          title: 'С поста',
          color: '#B016C9',
        },
      },
    })
  )

  const precipitation = cg.add(
    new Precipitation({
      name: 'Осадки',
      row: 1,
      scale: {
        title: 'Осадки, мм',
        color: 'darkgreen',
        gridColor: 'darkgreen',
      },
      groups: {
        solid: {
          months: parameters.data.precipitation.solid || [],
          title: 'Твердые',
          color: '#1351CE',
        },
        liquid: {
          months: parameters.data.precipitation.liquid || [],
          title: 'Жидкие',
          color: '#23C180',
        },
        mixed: {
          months: parameters.data.precipitation.mixed || [],
          title: 'Смешанные',
        },
      },
      unactive: true,
    })
  )

  const snowIce = cg.add(
    new SnowIce({
      name: 'Снег, Лед',
      row: 2,
      scale: {
        title: 'Снег, лед см',
        color: '#A7C7E0',
        position: 'right',
        abs: true,
      },
      snowFillColor: '#a6d9ff',
      iceFillColor: '#00b1ff',
      groups: {
        snow: {
          months: parameters.data.snowIce.snow || [],
          color: '#80c8ff',
          title: 'Снег',
        },
        ice: {
          months: parameters.data.snowIce.ice || [],
          color: '#1588ff',
          title: 'Лед',
        },
      },
      unactive: true,
    })
  )

  const waterTemperature = cg.add(
    new WaterTemperature({
      name: 'Температура воды',
      row: 2,
      scale: {
        title: 't воды °C',
        color: '#B13007',
      },
      groups: {
        default: {
          months: parameters.data.waterTemperature.default || [],
          color: '#EF543F',
        },
      },
      unactive: true,
    })
  )

  const waterlevel = cg.add(
    new WaterLevel({
      name: 'Уровень воды',
      row: 3,
      rowFactor: 2,
      scale: {
        title: 'Ур. воды, см',
        step: 50,
        color: 'black',
        gridColor: 'black',
      },
      groups: {
        default: {
          months: parameters.data.waterlevel.default || [],
          color: '#0066FF',
        },
      },
      unactive: true,
    })
  )

  const waterСonsumption = cg.add(
    new WaterСonsumption({
      name: 'Расходы воды',
      row: 3,
      scale: {
        title: 'Расход м / c',
        position: 'right',
        step: 50,
        color: 'black',
      },
      groups: {
        calculated: {
          months: parameters.data.waterСonsumption.calculated || [],
          title: 'Рассчитанные',
          color: 'brown',
        },
        measured: {
          months: parameters.data.waterСonsumption.measured || [],
          title: 'Измеренные',
          color: '#397634',
        },
        qh: {
          months: parameters.data.waterСonsumption.qh || [],
          title: 'QH',
          color: '#397634',
        },
        operational: {
          months: parameters.data.waterСonsumption.operational || [],
          title: 'Операционные',
          color: '#FFB74E',
        },
      },
      unactive: true,
    })
  )

  cg.add(new Buttons())

  return {
    airTemperature,
    precipitation,
    waterTemperature,
    snowIce,
    waterlevel,
    waterСonsumption,
    destroy() {
      cg.destroy()
    },
  }
}
