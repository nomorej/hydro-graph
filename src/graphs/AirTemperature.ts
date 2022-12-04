import { pointRectCollision } from '../utils/collisions/pointRectCollision'
import { XY } from '../utils/ts'
import { Visualizer } from '../visualizer'
import { VisualizerElement, VisualizerElementParameters } from '../visualizer/VisualizerElement'
import {
  VisualizerElementsGroup,
  VisualizerElementsGroupData,
  VisualizerElementsGroupParameters,
} from '../visualizer/VisualizerElementsGroup'
import { PointsElement, PointsGroupParameters, PointsNumberGroup } from './Points'

abstract class AirTemperatureSumGroup<T = number> extends VisualizerElementsGroup<
  VisualizerElement<T>
> {
  constructor(parameters: VisualizerElementsGroupParameters<T>) {
    super(parameters)
    this.getElementNumberValue = undefined
  }

  public override resize() {
    const { complexGraph, row, paddingBottom } = this.visualizer

    this.elements.forEach((element) => {
      element.x = complexGraph.calculator.area.x1 + element.startSegment.x1
      element.width = element.endSegment.x1 - element.startSegment.x1

      element.height = paddingBottom / 2
      element.y = row.y2 - paddingBottom / 2
    })
  }

  public override render() {
    const { renderer, scene, calculator } = this.visualizer.complexGraph

    renderer.context.strokeStyle = this.color
    renderer.context.lineWidth = 1 / renderer.pixelRatio

    this.elements.forEach((element) => {
      if (!calculator.isPointVisible(element)) return
      const db = element.endSegment.daysBefore - element.startSegment.daysBefore
      const s = Math.ceil(scene.zoom / 8) * db
      const step = element.width / s

      for (let index = 0; index < s; index++) {
        this.drawElement(element, index, step)
      }
    })
  }

  public override hitTest(pointer: XY<number>) {
    const element = this.elements.find((el) => {
      return pointRectCollision(pointer, el)
    })

    return element
  }

  public override hitInfo(element: VisualizerElement<any>) {
    return [`Срок: ${element.startSegment.date}`, `Сумма: ${element.value}`, ...element.comment]
  }

  protected createElement(parameters: VisualizerElementParameters<T>) {
    return new VisualizerElement(parameters)
  }

  protected abstract drawElement(element: VisualizerElement<T>, index: number, step: number): void
}

class AirTemperatureSumSpringGroup extends AirTemperatureSumGroup {
  constructor(parameters: PointsGroupParameters) {
    super(parameters)
  }

  protected drawElement(element: PointsElement, index: number, step: number) {
    const { renderer } = this.visualizer.complexGraph

    renderer.context.beginPath()
    renderer.context.moveTo(element.x + step * index, element.y)
    renderer.context.lineTo(element.x + step * (index + 0.85), element.y + element.height)
    renderer.context.stroke()
  }
}

class AirTemperatureSumAutumnGroup extends AirTemperatureSumGroup {
  constructor(parameters: PointsGroupParameters) {
    super(parameters)
  }

  protected drawElement(element: PointsElement, index: number, step: number) {
    const { renderer } = this.visualizer.complexGraph

    renderer.context.beginPath()
    renderer.context.moveTo(element.x + step * (index + 0.85), element.y)
    renderer.context.lineTo(element.x + step * index, element.y + element.height)
    renderer.context.stroke()
  }
}

class AirTemperatureSumAllGroup extends AirTemperatureSumGroup {
  constructor(parameters: PointsGroupParameters) {
    super(parameters)
  }

  protected drawElement(element: PointsElement, index: number, step: number) {
    const { renderer } = this.visualizer.complexGraph
    renderer.context.beginPath()
    renderer.context.moveTo(element.x + step * index, element.y)
    renderer.context.lineTo(element.x + step * (index + 0.85), element.y + element.height)
    renderer.context.moveTo(element.x + step * (index + 0.85), element.y)
    renderer.context.lineTo(element.x + step * index, element.y + element.height)
    renderer.context.stroke()
  }
}

export interface AirTemperatureParameters {
  middle?: VisualizerElementsGroupData<number>
  max?: VisualizerElementsGroupData<number>
  min?: VisualizerElementsGroupData<number>
  post?: VisualizerElementsGroupData<number>
  sumTempSpring?: VisualizerElementsGroupData<number>
  sumTempAutumn?: VisualizerElementsGroupData<number>
  sumTempAll?: VisualizerElementsGroupData<number>
}

export function createAirTemperatureGraph(parameters: AirTemperatureParameters) {
  new Visualizer({
    name: 'Температура воздуха',
    row: 0,
    rowFactor: 1,
    scale: {
      title: 't воздуха °C',
      color: '#B13007',
      gridColor: '#B13007',
      gridActive: true,
    },
    paddingBottom: 0.2,
  })

  if (parameters.min) {
    new PointsNumberGroup({
      name: 'Минимальная',
      color: '#0066FF',
      data: parameters.min,
      maxDaysGap: 3,
      hitInfo: (el) => {
        return [`Срок: ${el.startSegment.date}`, `Температура: ${el.value}`, ...el.comment]
      },
    })
  }

  if (parameters.middle) {
    new PointsNumberGroup({
      name: 'Средняя',
      color: '#6B6C7E',
      data: parameters.middle,
      maxDaysGap: 3,
      hitInfo: (el) => {
        return [`Срок: ${el.startSegment.date}`, `Температура: ${el.value}`, ...el.comment]
      },
    })
  }

  if (parameters.max) {
    new PointsNumberGroup({
      name: 'Максимальная',
      color: '#D72929',
      data: parameters.max,
      maxDaysGap: 3,
      hitInfo: (el) => {
        return [`Срок: ${el.startSegment.date}`, `Температура: ${el.value}`, ...el.comment]
      },
    })
  }

  if (parameters.post) {
    new PointsNumberGroup({
      name: 'С поста',
      color: '#B016C9',
      data: parameters.post,
      maxDaysGap: 3,
      hitInfo: (el) => {
        return [`Срок: ${el.startSegment.date}`, `Температура: ${el.value}`, ...el.comment]
      },
    })
  }

  if (parameters.sumTempAll) {
    new AirTemperatureSumAllGroup({
      name: 'CТ: Осень / Весна',
      color: '#561087',
      data: parameters.sumTempAll,
    })
  }

  if (parameters.sumTempAutumn) {
    new AirTemperatureSumAutumnGroup({
      name: 'CТ: Осень',
      color: '#188A1A',
      data: parameters.sumTempAutumn,
    })
  }

  if (parameters.sumTempSpring) {
    new AirTemperatureSumSpringGroup({
      name: 'CТ: Весна',
      color: '#B0433F',
      data: parameters.sumTempSpring,
    })
  }
}
