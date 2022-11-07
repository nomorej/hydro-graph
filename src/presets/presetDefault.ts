import {
  ComplexGraphGlobalsConfig,
  ComplexGraphParameters,
  ComplexGraphSettings,
} from '../core/ComplexGraph'
import { AirTemperature } from '../objects/AirTemperature'
import { AirTemperatureScale } from '../objects/AirTemperatureScale'
import { Calculator } from '../objects/Calculator'
import { Clip } from '../objects/Clip'
import { IceCover } from '../objects/IceCover'
import { IceRuler } from '../objects/IceRuler'
import { Precipitation } from '../objects/Precipitation'
import { SnowAmount } from '../objects/SnowAmount'
import { Timeline } from '../objects/Timeline'
import { TimelineMonths } from '../objects/TimelineMonths'
import { WaterConsumption } from '../objects/WaterConsumption'
import { WaterLevel } from '../objects/WaterLevel'
import WaterTemperature from '../objects/WaterTemperature'

export interface PresetParameters {
  data: ComplexGraphParameters['globals']['data']
  container: ComplexGraphParameters['container']
}

export function presetDefault({ data, container }: PresetParameters): ComplexGraphParameters {
  const settings: Partial<ComplexGraphSettings> = {
    maxZoom: 15,
    smoothness: 7,
    wheelZoomSpeed: 1,
    wheelTranlationSpeed: 1,
    zoomMouseButton: 'left',
  }

  const colors: ComplexGraphGlobalsConfig['colors'] = {
    default: '#1e6062',
    timeline: '#000000',
    timelineMonth: '#66f5ff',
    content: '#ccfcff',
    airTemperature: {
      scale: '#b44646',
      min: '#ae00ff',
      middle: '#adadad',
      max: '#ff5c5c',
    },
  }

  const sizes: ComplexGraphGlobalsConfig['sizes'] = {
    font: 0.02,
    paddingX: 0.005,
    paddingY: 0.0,
    contentPaddingX: 0.1,
    timelineOffsetY: 0.05,
    timelineHeight: 0.02,
    scaleThickness: 0.0025,
    rowsFactors: {
      '0': 2,
      '1': 1,
      '2': 1,
      '3': 1,
      '4': 1,
      '5': 1,
    },
    rowsGap: 0.05,
    scaleOffset: 0.015,
    scaleMarkSize: 0.005,
    scalePointerSize: 0.01,
  }

  return {
    container,
    settings,
    globals: {
      colors,
      sizes,
      font: 'sans-serif',
      data,
      rowsVisibility: {},
    },
    objects: [
      new Calculator(),
      new Timeline(),
      new AirTemperatureScale(),
      new Clip(),
      new TimelineMonths(),
      new AirTemperature(),
      new Precipitation(),
      new WaterTemperature(),
      new IceCover(),
      new SnowAmount(),
      new IceRuler(),
      new WaterLevel(),
      new WaterConsumption(),
    ],
  }
}
