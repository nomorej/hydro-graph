import { Visualizer } from '../visualizer'
import { VisualizerElementsGroupData } from '../visualizer/VisualizerElementsGroup'
import { VisualizerGroup, VisualizerGroupParameters } from '../visualizer/VisualizerGroup'
import { PointsNumberGroup } from './Points'

interface WaterLevelEventGroupParameters extends VisualizerGroupParameters {
  value: number
}

class WaterLevelEventGroup extends VisualizerGroup {
  private readonly value: number
  private position: number

  constructor(parameters: WaterLevelEventGroupParameters) {
    super(parameters)

    this.value = parameters.value
    this.position = 0
  }

  public render() {
    const { row, complexGraph } = this.visualizer
    const { renderer } = complexGraph

    renderer.context.lineWidth = (renderer.minSize * 0.002) / renderer.pixelRatio

    renderer.context.beginPath()
    renderer.context.strokeStyle = this.color
    renderer.context.moveTo(row.x1, row.y2 - this.position)
    renderer.context.lineTo(row.x2, row.y2 - this.position)
    renderer.context.stroke()
  }

  public resize(heightStep: number) {
    this.position = heightStep * (this.value - this.visualizer.min)
  }
}

export interface WaterLevelParameters {
  default?: VisualizerElementsGroupData<number>
  adverse?: number
  dangerous?: number
}

export function createWaterLevelGraph(parameters: WaterLevelParameters) {
  new Visualizer({
    name: 'Уровень воды',
    row: 4,
    scale: {
      title: 'Ур. воды, см',
      step: 25,
      color: 'black',
      gridColor: 'black',
      gridActive: true,
    },
    // unactive: true,
  })

  if (parameters.default) {
    new PointsNumberGroup({
      data: parameters.default,
      color: '#0066FF',
      maxDaysGap: 3,
      hitInfo: (el) => {
        return [`Срок: ${el.startSegment.date}`, `Уровень: ${el.value}`, ...el.comment]
      },
    })
  }
  if (parameters.adverse) {
    new WaterLevelEventGroup({
      name: 'УНЯ',
      value: parameters.adverse,
      color: 'orange',
    })
  }

  if (parameters.dangerous) {
    new WaterLevelEventGroup({
      name: 'УОЯ',
      value: parameters.dangerous,
      color: 'red',
    })
  }
}
