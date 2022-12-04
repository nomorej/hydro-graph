import { Visualizer } from '../visualizer'
import { VisualizerElementsGroupData } from '../visualizer/VisualizerElementsGroup'
import { PointsGroupParameters, PointsNumberGroup } from './Points'

class WaterConsumptionMeasuredGroup extends PointsNumberGroup {
  constructor(parameters: PointsGroupParameters) {
    super(parameters)
  }

  public override render() {
    const { renderer, calculator } = this.visualizer.complexGraph

    renderer.context.fillStyle = this.color

    this.elements.forEach((element) => {
      if (!calculator.isPointVisible(element)) return

      renderer.context.beginPath()
      renderer.context.arc(element.x, element.y, renderer.minSize * 0.005, 0, Math.PI * 2)
      renderer.context.fill()
    })
  }
}

export interface WaterConsumptionParameters {
  calculated?: VisualizerElementsGroupData<number>
  qh?: VisualizerElementsGroupData<number>
  operational?: VisualizerElementsGroupData<number>
  measured?: VisualizerElementsGroupData<number>
}

export function createWaterConsumptionGraph(parameters: WaterConsumptionParameters) {
  new Visualizer({
    name: 'Расходы воды',
    row: 4,
    scale: {
      title: 'Расход м / c',
      position: 'right',
      step: 25,
      color: 'black',
      gridColor: 'black',
    },
  })

  if (parameters.calculated) {
    new PointsNumberGroup({
      data: parameters.calculated,
      name: 'Рассчитанные',
      color: 'brown',
      maxDaysGap: 3,
      hitInfo: (el) => {
        return [`Срок: ${el.startSegment.date}`, `Расход: ${el.value}`, ...el.comment]
      },
    })
  }

  if (parameters.qh) {
    new PointsNumberGroup({
      data: parameters.qh,
      name: 'С кривой QH',
      color: '#397634',
      maxDaysGap: 3,
      hitInfo: (el) => {
        return [`Срок: ${el.startSegment.date}`, `Расход: ${el.value}`, ...el.comment]
      },
    })
  }

  if (parameters.operational) {
    new PointsNumberGroup({
      data: parameters.operational,
      name: 'Оперативные',
      color: '#FFB74E',
      maxDaysGap: 3,
      hitInfo: (el) => {
        return [`Срок: ${el.startSegment.date}`, `Расход: ${el.value}`, ...el.comment]
      },
    })
  }

  if (parameters.measured) {
    new WaterConsumptionMeasuredGroup({
      data: parameters.measured,
      name: 'Измеренные',
      color: '#397634',
      maxDaysGap: 3,
      hitInfo: (el) => {
        return [`Срок: ${el.startSegment.date}`, `Расход: ${el.value}`, ...el.comment]
      },
    })
  }
}
