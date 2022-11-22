import { ComplexGraph, Parameters } from './core/ComplexGraph'
import { VisualizerGroupData } from './core/Visualizer'
import { AirTemperature, AirTemperatureGroupsNames } from './graphs/AirTemperature'
import { IceRuler, IceRulerGroupsNames, IceRulerValue } from './graphs/IceRuler'
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
import { Months } from './utils/getMonths'

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

export type QwikStartSnowIce = { [key in SnowIceGroupsNames]?: VisualizerGroupData<number> }

export type QwikStartIceRuler = {
  [key in IceRulerGroupsNames]?: VisualizerGroupData<IceRulerValue>
}

export type QwikStartWaterLevel = { default?: VisualizerGroupData<number> }

export type QwikStartWaterConsumption = {
  [key in WaterСonsumptionGroupsNames]?: VisualizerGroupData<number>
}

export type QwikStartPhases = Array<{
  type: keyof typeof phasesSettings
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
      // unactive: true,
    })
  )

  const precipitation = cg.add(
    new Precipitation({
      name: 'Осадки',
      row: 1,
      rowFactor: 0.7,
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
      // unactive: true,
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
      // unactive: true,
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
      // unactive: true,
    })
  )

  const iceRuler = cg.add(
    new IceRuler({
      name: 'Ледовая линейка',
      row: 3,
      rowFactor: 1,
      rectInsideColor: '#D5F2FA',
      strokeColor: '#333333',
      groups: {
        sludge: {
          months: parameters.data.iceRuler.sludge || [],
          // title: 'Сало',
          color: 'lightgrey',
        },
        shoreIce: {
          months: parameters.data.iceRuler.shoreIce || [],
          // title: 'Заберег',
          color: 'lightgrey',
        },
        shoreIceSludge: {
          months: parameters.data.iceRuler.shoreIceSludge || [],
          // title: 'Сало при забереге',
          color: 'lightgrey',
        },
        frazilDrift1: {
          months: parameters.data.iceRuler.frazilDrift1 || [],
          // title: 'Редкий шугоход',
          color: 'lightgrey',
        },
        frazilDrift2: {
          months: parameters.data.iceRuler.frazilDrift2 || [],
          // title: 'Средний шугоход',
          color: 'lightgrey',
        },
        frazilDrift3: {
          months: parameters.data.iceRuler.frazilDrift3 || [],
          // title: 'Густой шугоход',
          color: 'lightgrey',
        },
        iceDrift1: {
          months: parameters.data.iceRuler.iceDrift1 || [],
          // title: 'Редкий ледоход',
          color: 'lightgrey',
        },
        iceDrift2: {
          months: parameters.data.iceRuler.iceDrift2 || [],
          // title: 'Средний ледоход',
          color: 'lightgrey',
        },
        iceDrift3: {
          months: parameters.data.iceRuler.iceDrift3 || [],
          // title: 'Густой ледоход',
          color: 'lightgrey',
        },
        freezing: {
          months: parameters.data.iceRuler.freezing || [],
          // title: 'Ледостав',
          color: 'lightgrey',
        },
        flangeIce: {
          months: parameters.data.iceRuler.flangeIce || [],
          // title: 'Закраины',
          color: 'grey',
        },
        iceClearing: {
          months: parameters.data.iceRuler.iceClearing || [],
          // title: 'Разводья',
          color: 'grey',
        },
        error: {
          months: parameters.data.iceRuler.error || [],
          // title: 'Ошибки',
          color: 'grey',
        },
      },
      // unactive: true,
    })
  )

  const waterlevel = cg.add(
    new WaterLevel({
      name: 'Уровень воды',
      row: 4,
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
      // unactive: true,
    })
  )

  cg.add(new Buttons())

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
