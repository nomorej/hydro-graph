import { ComplexGraph, Parameters } from './core/ComplexGraph'
import { VisualizerGroupData } from './core/Visualizer'
import { AirTemperature, AirTemperatureGroupsNames } from './graphs/AirTemperature'
import { IceRuler, IceRulerGroupsNames, IceRulerValue } from './graphs/IceRuler'
import { Precipitation, PrecipitationGroupsNames, PrecipitationValue } from './graphs/Precipitation'
import { SnowIce, SnowIceValue } from './graphs/SnowIce'
import { WaterLevel } from './graphs/WaterLevel'
import { WaterTemperature } from './graphs/WaterTemperature'
import { WaterСonsumption, WaterСonsumptionGroupsNames } from './graphs/WaterСonsumption'
import { Content } from './objects/Content'
import { Phase, PhaseParameters } from './objects/Phase'
import { Scrollbar } from './objects/Scrollbar'
import { Timeline } from './objects/Timeline'
import { Print } from './plugins/Print'
import { Tooltips } from './plugins/Tooltips'
import { Valves } from './plugins/Valves'
import { Months } from './utils/getMonths'

const phasesPresets = {
  ОР: {
    fontColor: '#C08C50',
    backgroundColor: '#FEFFD7',
    name: 'Открытое русло',
    shortName: 'ОР',
  },
  ОПП: {
    fontColor: '#C86546',
    backgroundColor: '#FBE9DD',
    name: 'Осенний переходный',
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
    name: 'Весенний переходный',
    shortName: 'ВПП',
  },
  ЗАР: {
    fontColor: '#128B8C',
    backgroundColor: '#BFD4D0',
    name: 'Зарастание',
    shortName: 'ЗАР',
  },
}

export type QwikStartAirTemperature = {
  [key in AirTemperatureGroupsNames]?: VisualizerGroupData<number>
}

export type QwikStartPrecipitation = {
  [key in PrecipitationGroupsNames]?: VisualizerGroupData<PrecipitationValue>
}

export type QwikStartWaterTemperature = { default?: VisualizerGroupData<number> }

export type QwikStartSnowIce = { default?: VisualizerGroupData<SnowIceValue> }

export type QwikStartIceRuler = {
  [key in IceRulerGroupsNames]?: VisualizerGroupData<IceRulerValue>
}

export type QwikStartWaterLevel = {
  default?: VisualizerGroupData<number>
  adverse?: number
  dangerous?: number
}

export type QwikStartWaterConsumption = {
  [key in WaterСonsumptionGroupsNames]?: VisualizerGroupData<number>
}

export type QwikStartPhases = Array<{
  type: keyof typeof phasesPresets
  start: PhaseParameters['start']
  end: PhaseParameters['end']
}>

export interface QwikStartParameters extends Pick<Parameters, 'wrapper' | 'font'> {
  leapYear?: boolean
  months: Months
  data: {
    airTemperature: QwikStartAirTemperature
    precipitation: QwikStartPrecipitation
    waterTemperature: QwikStartWaterTemperature
    snowIce: QwikStartSnowIce
    iceRuler: QwikStartIceRuler
    waterlevel: QwikStartWaterLevel
    waterСonsumption: QwikStartWaterConsumption
    phases?: QwikStartPhases
  }
}

export function qwikStart(parameters: QwikStartParameters) {
  const cg = new ComplexGraph({
    smoothness: 5,
    ...parameters,
  })

  cg.add(new Content())

  parameters.data.phases?.forEach((phase) => {
    cg.add(
      new Phase({
        ...phasesPresets[phase.type],
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
      rowFactor: 1,
      scale: {
        title: 't воздуха °C',
        color: '#B13007',
        gridColor: '#B13007',
        gridActive: true,
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
      // unactive: true,
    })
  )

  const precipitation = cg.add(
    new Precipitation({
      name: 'Осадки',
      row: 1,
      rowFactor: 0.5,
      scale: {
        title: 'Осадки, мм',
        color: 'darkgreen',
        gridColor: 'darkgreen',
        gridActive: true,
      },
      groups: {
        solid: {
          months: parameters.data.precipitation.solid || [],
          title: 'Твердые',
          color: '#00b1ff',
        },
        liquid: {
          months: parameters.data.precipitation.liquid || [],
          title: 'Жидкие',
          color: '#136945',
        },
        mixed: {
          months: parameters.data.precipitation.mixed || [],
          title: 'Смешанные',
        },
      },
      // unactive: true,
    })
  )

  const snowIce = cg.add(
    new SnowIce({
      name: 'Снег, Лед',
      row: 2,
      rowFactor: 0.5,
      scale: {
        title: 'Снег, лед см',
        color: '#A7C7E0',
        gridColor: '#A7C7E0',
        position: 'right',
        abs: true,
      },
      snowFillColor: '#a6d9ff',
      iceFillColor: '#00b1ff',
      snowStrokeColor: '#80c8ff',
      iceStrokeColor: '#1588ff',
      groups: {
        default: {
          months: parameters.data.snowIce.default || [],
          color: '#80c8ff',
          title: 'Снег',
        },
      },
      // unactive: true,
    })
  )

  const waterTemperature = cg.add(
    new WaterTemperature({
      name: 'Температура воды',
      row: 2,
      rowFactor: 0.5,
      scale: {
        title: 't воды °C',
        color: '#B13007',
        gridColor: '#B13007',
        gridActive: true,
      },
      groups: {
        default: {
          months: parameters.data.waterTemperature.default || [],
          color: '#EF543F',
        },
      },
      // unactive: true,
    })
  )

  const iceRuler = cg.add(
    new IceRuler({
      name: 'Ледовая линейка',
      row: 3,
      rowFactor: 0.5,
      darkColor: '#343a40',
      middleColor: '#495057',
      lightColor: '#6c757d',
      specialColor: '#adb5bd',

      groups: {
        sludge: {
          months: parameters.data.iceRuler.sludge || [],
          // title: 'Сало',
        },
        shoreIce: {
          months: parameters.data.iceRuler.shoreIce || [],
          // title: 'Заберег',
        },
        shoreIceSludge: {
          months: parameters.data.iceRuler.shoreIceSludge || [],
          // title: 'Сало при забереге',
        },
        frazilDrift1: {
          months: parameters.data.iceRuler.frazilDrift1 || [],
          // title: 'Редкий шугоход',
        },
        frazilDrift2: {
          months: parameters.data.iceRuler.frazilDrift2 || [],
          // title: 'Средний шугоход',
        },
        frazilDrift3: {
          months: parameters.data.iceRuler.frazilDrift3 || [],
          // title: 'Густой шугоход',
        },
        iceDrift1: {
          months: parameters.data.iceRuler.iceDrift1 || [],
          // title: 'Редкий ледоход',
        },
        iceDrift2: {
          months: parameters.data.iceRuler.iceDrift2 || [],
          // title: 'Средний ледоход',
        },
        iceDrift3: {
          months: parameters.data.iceRuler.iceDrift3 || [],
          // title: 'Густой ледоход',
        },
        freezing: {
          months: parameters.data.iceRuler.freezing || [],
          // title: 'Ледостав',
        },
        flangeIce: {
          months: parameters.data.iceRuler.flangeIce || [],
          // title: 'Закраины',
        },
        iceClearing: {
          months: parameters.data.iceRuler.iceClearing || [],
          // title: 'Разводья',
        },
        error: {
          months: parameters.data.iceRuler.error || [],
          // title: 'Ошибки',
        },
      },
      // unactive: true,
    })
  )

  const waterlevel = cg.add(
    new WaterLevel({
      name: 'Уровень воды',
      row: 4,
      scale: {
        title: 'Ур. воды, см',
        step: 25,
        color: 'black',
        gridColor: 'black',
        gridActive: true,
      },
      adverseEventColor: 'orange',
      dangerousEventColor: 'red',
      adverseEventValue: parameters.data.waterlevel.adverse,
      dangerousEventValue: parameters.data.waterlevel.dangerous,
      groups: {
        default: {
          months: parameters.data.waterlevel.default || [],
          color: '#0066FF',
        },
      },
      // unactive: true,
    })
  )

  const waterСonsumption = cg.add(
    new WaterСonsumption({
      name: 'Расходы воды',
      row: 4,
      scale: {
        title: 'Расход м / c',
        position: 'right',
        step: 25,
        color: 'black',
        gridColor: 'black',
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
      // unactive: true,
    })
  )

  cg.add(new Valves())
  cg.add(new Tooltips())
  cg.add(new Print())

  return {
    airTemperature,
    precipitation,
    waterTemperature,
    snowIce,
    iceRuler,
    waterlevel,
    waterСonsumption,
    destroy() {
      cg.destroy()
    },
  }
}
