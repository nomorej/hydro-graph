import { GraphsData, GraphsNames, Parameters } from '../core/ComplexGraph'
import { GraphData, GraphDataParameters } from '../core/GraphData'
import { AirTemperature } from '../objects/AirTemperature'
import { AirTemperatureScale } from '../objects/AirTemperatureScale'
import { Calculator } from '../objects/Calculator'
import { Clip } from '../objects/Clip'
import { IceCover } from '../objects/IceCover'
import { IceRuler } from '../objects/IceRuler'
import { Precipitation } from '../objects/Precipitation'
import { PrecipitationScale } from '../objects/PrecipitationScale'
import { Scrollbar } from '../objects/Scrollbar'
import { SnowAmount } from '../objects/SnowAmount'
import { Timeline } from '../objects/Timeline'
import { TimelineMonths } from '../objects/TimelineMonths'
import { WaterConsumption } from '../objects/WaterConsumption'
import { WaterLevel } from '../objects/WaterLevel'
import WaterTemperature from '../objects/WaterTemperature'

export interface PresetParameters {
  months: Parameters['monthsData']
  data: {
    [K in GraphsNames]: Omit<GraphDataParameters<GraphsData[K]['graph']>, 'scale'> & {
      scale?: string
    }
  }
  container: Parameters['container']
}

export function presetDefault({ months, data, container }: PresetParameters): Parameters {
  const settings: Parameters['settings'] = {
    maxZoom: 100,
    smoothness: 7,
    wheelZoomAcceleration: 1,
    wheelTranlationSpeed: 1,
    zoomMouseButton: 'left',
  }

  const colors: Parameters['colors'] = {
    clear: '#ffffff',
    default: '#000000',
    timeline: '#000000',
    timelineMonth: '#66f5ff',
    content: '#f5fcff',
    graphs: {
      airTemperature: {
        scale: '#ff9494',
        min: '#ae00ff',
        middle: '#737373',
        max: '#ff2e2e',
      },
      precipitation: {
        scale: '#000000',
        liquid: '#00ff00',
        solid: '#0000ff',
      },
      iceCover: {
        scale: '#000000',
      },
      iceRuler: {
        scale: '#000000',
      },
      snowAmount: {
        scale: '#000000',
      },
      waterConsumption: {
        scale: '#000000',
      },
      waterLevel: {
        scale: '#000000',
      },
      waterTemperature: {
        scale: '#000000',
      },
    },
  }

  const sizes: Parameters['sizes'] = {
    font: 0.02,
    paddingX: 0.005,
    paddingTop: 0.02,
    contentPaddingX: 0.1,
    timelineOffsetY: 0.05,
    timelineHeight: 0.02,
    scaleThickness: 0.002,
    rowsFactors: {
      '0': 2,
      '1': 1,
      '2': 1,
      '3': 1,
      '4': 1,
    },
    rowsGap: 0.05,
    scaleOffset: 0.015,
    scaleMarkSize: 0.005,
    scalePointerSize: 0.01,
  }

  const graphsData: Parameters['graphsData'] = {
    airTemperature: new GraphData({
      graph: data.airTemperature.graph,
      title: data.airTemperature.title,
      scale: data.airTemperature.scale
        ? {
            title: data.airTemperature.scale,
            process: (seg) => {
              if (seg.value % 20 !== 0) {
                seg.isBase = false
              }
            },
          }
        : undefined,
    }),
    precipitation: new GraphData({
      graph: data.precipitation.graph,
      title: data.precipitation.title,
      scale: data.airTemperature.scale
        ? {
            title: data.airTemperature.scale,
            process: (seg) => {
              if (seg.value === 0 || seg.value % 10 !== 0) {
                seg.isBase = false
              }
            },
            step: 2,
          }
        : undefined,
    }),
    // snowAmount: new GraphData(data.precipitation.graph),
    // waterConsumption: new GraphData(data.precipitation.graph),
    // waterLevel: new GraphData(data.precipitation.graph),
    // waterTemperature: new GraphData(data.precipitation.graph),
    // iceCover: new GraphData(data.precipitation.graph),
    // iceRuler: new GraphData(data.precipitation.graph),
  }

  return {
    container,
    settings,
    colors,
    sizes,
    font: 'sans-serif',
    monthsData: months,
    rowsVisibility: {},
    graphsData,
    objects: [
      new Calculator(),
      new Scrollbar(),
      new Timeline(),
      new AirTemperatureScale(),
      new PrecipitationScale(),
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
