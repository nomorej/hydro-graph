import { ComplexGraph, Parameters } from './core/ComplexGraph'
import { SceneParameters } from './core/Scene'
import { TimelineParameters } from './core/Timeline'

import { TouchControl } from './controls/TouchControl'
import { WheelControl } from './controls/WheelControl'

import { Content } from './objects/Content'
import { createPhases, PhasesParameters } from './objects/Phase'
import { Scrollbar } from './objects/Scrollbar'
import { Timeline } from './objects/Timeline'

import { AirTemperatureParameters, createAirTemperatureGraph } from './graphs/AirTemperature'
import { createPrecipitationGraph, PrecipitationParameters } from './graphs/Precipitation'
import { createSnowIceGraph, SnowIceParameters } from './graphs/SnowIce'
import { createWaterLevelGraph, WaterLevelParameters } from './graphs/WaterLevel'
import { createWaterTemperatureGraph, WaterTemperatureParameters } from './graphs/WaterTemperature'
import { createWaterConsumptionGraph, WaterConsumptionParameters } from './graphs/WaterСonsumption'

import { createIceRulerGraph } from './graphs/IceRuler'
import { IceRulerData } from './graphs/IceRuler/IceRuler'
import { Tooltips } from './plugins/Tooltips'
import { Print } from './plugins/Print'
import { Valves } from './plugins/Valves'

export interface QwikStartData {
  airTemperature?: AirTemperatureParameters
  precipitation?: PrecipitationParameters
  waterTemperature?: WaterTemperatureParameters
  waterlevel?: WaterLevelParameters
  snowIce?: SnowIceParameters
  iceRuler?: IceRulerData
  waterСonsumption?: WaterConsumptionParameters
  phases?: PhasesParameters
}

export interface QwikStartParameters
  extends Pick<Parameters, 'wrapper' | 'font' | keyof SceneParameters> {
  leapYear?: boolean
  timeline: TimelineParameters
  data: QwikStartData
}

export function qwikStart(parameters: QwikStartParameters) {
  function create(parameters: QwikStartParameters) {
    const cg = new ComplexGraph(parameters)

    new WheelControl()
    new TouchControl()

    new Content()

    if (parameters.data.phases) {
      createPhases(parameters.data.phases)
    }

    new Timeline()
    new Scrollbar()

    if (parameters.data.airTemperature) {
      createAirTemperatureGraph(parameters.data.airTemperature)
    }

    if (parameters.data.precipitation) {
      createPrecipitationGraph(parameters.data.precipitation)
    }

    if (parameters.data.waterTemperature) {
      createWaterTemperatureGraph(parameters.data.waterTemperature)
    }

    if (parameters.data.waterlevel) {
      createWaterLevelGraph(parameters.data.waterlevel)
    }

    if (parameters.data.waterСonsumption) {
      createWaterConsumptionGraph(parameters.data.waterСonsumption)
    }

    if (parameters.data.snowIce) {
      createSnowIceGraph(parameters.data.snowIce)
    }

    if (parameters.data.iceRuler) {
      createIceRulerGraph(parameters.data.iceRuler)
    }

    new Valves()
    new Tooltips()
    new Print()

    return cg
  }

  let cg = create(parameters)

  const state = {
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
    destroy() {
      cg.destroy()
    },
  }

  return state
}
