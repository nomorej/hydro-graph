import { ComplexGraph, Parameters } from './core/ComplexGraph'
import { SceneParameters } from './core/Scene'
import { TimelineParameters } from './core/Timeline'
import { VisualizerGroupData } from './core/Visualizer'
import { AirTemperature, AirTemperatureGroupsNames } from './graphs/AirTemperature'
import { IceRuler, IceRulerFillNames, IceRulerValue } from './graphs/IceRuler'
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
  [key in IceRulerFillNames]?: VisualizerGroupData<IceRulerValue>
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

export interface QwikStartParameters
  extends Pick<Parameters, 'wrapper' | 'font' | keyof SceneParameters> {
  leapYear?: boolean
  timeline: TimelineParameters
  data: {
    airTemperature?: QwikStartAirTemperature
    precipitation?: QwikStartPrecipitation
    waterTemperature?: QwikStartWaterTemperature
    snowIce?: QwikStartSnowIce
    iceRuler?: QwikStartIceRuler
    waterlevel?: QwikStartWaterLevel
    waterСonsumption?: QwikStartWaterConsumption
    phases?: QwikStartPhases
  }
}

export function qwikStart(parameters: QwikStartParameters) {
  function create(parameters: QwikStartParameters) {
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

    cg.add(
      new AirTemperature({
        name: 'Температура воздуха',
        row: 0,
        rowFactor: 1,
        maxDaysGap: 3,
        scale: {
          title: 't воздуха °C',
          color: '#B13007',
          gridColor: '#B13007',
          gridActive: true,
        },
        groups: {
          min: {
            data: parameters.data.airTemperature?.min || [],
            title: 'Минимальная',
            color: '#0066FF',
          },
          middle: {
            data: parameters.data.airTemperature?.middle || [],
            title: 'Средняя',
            color: '#6B6C7E',
          },
          max: {
            data: parameters.data.airTemperature?.max || [],
            title: 'Минимальная',
            color: '#D72929',
          },
          post: {
            data: parameters.data.airTemperature?.post || [],
            title: 'С поста',
            color: '#B016C9',
          },
          sumTempAll: {
            data: parameters.data.airTemperature?.sumTempAll || [],
            title: 'CТ: Осень / Весна',
            color: '#561087',
          },
          sumTempAutumn: {
            data: parameters.data.airTemperature?.sumTempAutumn || [],
            title: 'CТ: Осень',
            color: '#188A1A',
          },
          sumTempSpring: {
            data: parameters.data.airTemperature?.sumTempSpring || [],
            title: 'CТ: Весна',
            color: '#B0433F',
          },
        },
        // unactive: true,
      })
    )

    cg.add(
      new Precipitation({
        name: 'Осадки',
        row: 1,
        rowFactor: 0.4,
        scale: {
          title: 'Осадки, мм',
          color: 'darkgreen',
          gridColor: 'darkgreen',
          gridActive: true,
        },
        groups: {
          solid: {
            data: parameters.data.precipitation?.solid || [],
            title: 'Твердые',
            color: '#00b1ff',
          },
          liquid: {
            data: parameters.data.precipitation?.liquid || [],
            title: 'Жидкие',
            color: '#136945',
          },
          mixed: {
            data: parameters.data.precipitation?.mixed || [],
            title: 'Смешанные',
          },
        },
        // unactive: true,
      })
    )

    cg.add(
      new SnowIce({
        name: 'Снег, Лед',
        row: 2,
        rowFactor: 0.5,
        maxDaysGap: 3,
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
            data: parameters.data.snowIce?.default || [],
            color: '#80c8ff',
            title: 'Снег',
          },
        },
        // unactive: true,
      })
    )

    cg.add(
      new WaterTemperature({
        name: 'Температура воды',
        row: 2,
        rowFactor: 0.5,
        maxDaysGap: 3,
        scale: {
          title: 't воды °C',
          color: '#B13007',
          gridColor: '#B13007',
          gridActive: true,
        },
        groups: {
          default: {
            data: parameters.data.waterTemperature?.default || [],
            color: '#EF543F',
          },
        },
        // unactive: true,
      })
    )

    cg.add(
      new IceRuler({
        name: 'Ледовая линейка',
        row: 3,
        rowFactor: 0.3,
        defaultColor: '#6c757d',

        groups: {
          sludge: {
            data: parameters.data.iceRuler?.sludge || [],
            // title: 'Сало',
          },
          shoreIce: {
            data: parameters.data.iceRuler?.shoreIce || [],
            // title: 'Заберег',
          },
          shoreIceSludge: {
            data: parameters.data.iceRuler?.shoreIceSludge || [],
            // title: 'Сало при забереге',
          },
          frazilDrift1: {
            data: parameters.data.iceRuler?.frazilDrift1 || [],
            // title: 'Редкий шугоход',
          },
          frazilDrift2: {
            data: parameters.data.iceRuler?.frazilDrift2 || [],
            // title: 'Средний шугоход',
          },
          frazilDrift3: {
            data: parameters.data.iceRuler?.frazilDrift3 || [],
            // title: 'Густой шугоход',
          },
          iceDrift1: {
            data: parameters.data.iceRuler?.iceDrift1 || [],
            // title: 'Редкий ледоход',
          },
          iceDrift2: {
            data: parameters.data.iceRuler?.iceDrift2 || [],
            // title: 'Средний ледоход',
          },
          iceDrift3: {
            data: parameters.data.iceRuler?.iceDrift3 || [],
            // title: 'Густой ледоход',
          },
          freezing: {
            data: parameters.data.iceRuler?.freezing || [],
            // title: 'Ледостав',
          },
          flangeIce: {
            data: parameters.data.iceRuler?.flangeIce || [],
            // title: 'Закраины',
          },
          iceClearing: {
            data: parameters.data.iceRuler?.iceClearing || [],
            // title: 'Разводья',
          },
          error: {
            data: parameters.data.iceRuler?.error || [],
            // title: 'Ошибки',
          },
          none: {
            data: parameters.data.iceRuler?.none || [],
            // title: 'Ошибки',
          },
        },
        // unactive: true,
      })
    )

    cg.add(
      new WaterLevel({
        name: 'Уровень воды',
        row: 4,
        maxDaysGap: 3,
        scale: {
          title: 'Ур. воды, см',
          step: 25,
          color: 'black',
          gridColor: 'black',
          gridActive: true,
        },
        adverseEventColor: 'orange',
        dangerousEventColor: 'red',
        adverseEventValue: parameters.data.waterlevel?.adverse,
        dangerousEventValue: parameters.data.waterlevel?.dangerous,
        groups: {
          default: {
            data: parameters.data.waterlevel?.default || [],
            color: '#0066FF',
          },
        },
        // unactive: true,
      })
    )

    cg.add(
      new WaterСonsumption({
        name: 'Расходы воды',
        row: 4,
        maxDaysGap: 3,
        scale: {
          title: 'Расход м / c',
          position: 'right',
          step: 25,
          color: 'black',
          gridColor: 'black',
        },
        groups: {
          calculated: {
            data: parameters.data.waterСonsumption?.calculated || [],
            title: 'Рассчитанные',
            color: 'brown',
          },
          measured: {
            data: parameters.data.waterСonsumption?.measured || [],
            title: 'Измеренные',
            color: '#397634',
          },
          qh: {
            data: parameters.data.waterСonsumption?.qh || [],
            title: 'С кривой QH',
            color: '#397634',
          },
          operational: {
            data: parameters.data.waterСonsumption?.operational || [],
            title: 'Оперативные',
            color: '#FFB74E',
          },
        },
        // unactive: true,
      })
    )

    cg.add(new Valves())
    cg.add(new Tooltips())
    cg.add(new Print())

    return cg
  }

  let cg = create(parameters)

  const state = {
    /**
     * Уничтожает предыдущий график и создает новый
     * @param parameters - новые параметры
     * @param previousZoom - используется позиция и увеличение предыдущего графика
     */
    recreate(parameters: QwikStartParameters, previousZoom = false) {
      let sizeProgress: undefined | number
      let positionProgress: undefined | number
      let zoom: undefined | number

      if (previousZoom) {
        sizeProgress = cg.scene.size.progress.target
        positionProgress = cg.scene.position.progress.target
        zoom = cg.scene.zoom
      }

      cg.destroy()
      cg = create({ ...parameters, zoom, sizeProgress, positionProgress })
    },
    /**
     * уничтожает все слушатели и элементы
     */
    destroy() {
      cg.destroy()
    },
  }

  return state
}
