import { Visualizer } from '../visualizer'
import { VisualizerElementsGroupData } from '../visualizer/VisualizerElementsGroup'
import { PointsNumberGroup } from './Points'

export interface WaterTemperatureParameters {
  default?: VisualizerElementsGroupData<number>
}

export function createWaterTemperatureGraph(parameters: WaterTemperatureParameters) {
  new Visualizer({
    name: 'Температура воды',
    row: 2,
    rowFactor: 0.5,
    scale: {
      title: 't воды °C',
      color: '#B13007',
      gridColor: '#B13007',
      gridActive: true,
    },
  })

  if (parameters.default) {
    new PointsNumberGroup({
      data: parameters.default,
      color: '#EF543F',
      maxDaysGap: 3,
      hitInfo: (el) => {
        return [`Срок: ${el.startSegment.date}`, `Температура: ${el.value}`, ...el.comment]
      },
    })
  }
}
