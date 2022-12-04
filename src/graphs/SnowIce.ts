import { ScaleSegment } from '../core/Scale'
import { pointRectCollision } from '../utils/collisions/pointRectCollision'
import { XY } from '../utils/ts'
import { Visualizer } from '../visualizer'
import { VisualizerElement } from '../visualizer/VisualizerElement'
import { HitInfoCallback, VisualizerElementsGroupData } from '../visualizer/VisualizerElementsGroup'
import { PointsElement, PointsGroup, PointsGroupParameters } from './Points'

interface SnowIceValue {
  snow: number
  ice: number
}

interface SnowIceDefaultGroupParameters extends Omit<PointsGroupParameters<SnowIceValue>, 'color'> {
  snowFillColor?: string
  snowStrokeColor?: string
  iceFillColor?: string
  iceStrokeColor?: string
}

class SnowIceGroup extends PointsGroup<SnowIceValue> {
  private readonly snowFillColor: string
  private readonly snowStrokeColor: string
  private readonly iceFillColor: string
  private readonly iceStrokeColor: string

  private readonly sortedElements: Array<Array<PointsElement<SnowIceValue>>>
  private scaleZeroSegment?: ScaleSegment

  constructor(parameters: SnowIceDefaultGroupParameters) {
    super(parameters)

    this.snowFillColor = parameters.snowFillColor || 'black'
    this.snowStrokeColor = parameters.snowStrokeColor || 'black'
    this.iceFillColor = parameters.iceFillColor || 'black'
    this.iceStrokeColor = parameters.iceStrokeColor || 'black'

    this.sortedElements = [[]]

    let groupIndex = 0
    this.elements.forEach((el) => {
      if (el.new) {
        groupIndex++
        this.sortedElements[groupIndex] = []
      }

      this.sortedElements[groupIndex].push(el)
    })

    this.scaleZeroSegment = undefined
  }

  public resize(heightStep: number) {
    const { complexGraph, row, min } = this.visualizer

    if (!this.scaleZeroSegment) {
      this.scaleZeroSegment = this.visualizer.scale!.segments.find((s) => s.value === 0)!
    }

    this.elements.forEach((element) => {
      element.width = element.endSegment.x1 - element.startSegment.x1
      element.height = heightStep * (element.value.snow - min)
      element.x = complexGraph.calculator.area.x1 + element.startSegment.x1
      element.y = row.y2 - element.height
    })
  }

  public override render(heightStep: number) {
    const { row, min } = this.visualizer

    this.fill(this.snowFillColor)
    this.stroke(this.snowStrokeColor)

    this.elements.forEach((element) => {
      element.height = heightStep * (Math.abs(element.value.ice) * -1 - min)
      element.y = row.y2 - element.height
    })

    this.fill(this.iceFillColor)
    this.stroke(this.iceStrokeColor)
  }

  public override hitTest(pointer: XY<number>) {
    const { complexGraph, row } = this.visualizer
    const { renderer } = complexGraph

    const columnSize = renderer.minSize * 0.03

    const element = this.elements.find((el) => {
      return pointRectCollision(pointer, {
        x: el.x - columnSize / 2,
        y: row.y1,
        width: columnSize,
        height: row.height,
      })
    })

    return element
  }

  public override hitInfo(element: VisualizerElement<any>) {
    return [
      `Срок: ${element.startSegment.date}`,
      `Уровни`,
      `Снег: ${element.value.snow}`,
      `Лед: ${element.value.ice}`,
      ...element.comment,
    ]
  }

  protected override getElementNumberValue(
    element: PointsElement<SnowIceValue>
  ): number | [number, number] {
    return [Math.abs(element.value.ice) * -1, element.value.snow]
  }

  private stroke(color: string) {
    this.drawLinear(color)
  }

  private fill(color: string) {
    const { renderer, calculator } = this.visualizer.complexGraph

    if (this.scaleZeroSegment) {
      this.sortedElements.forEach((g) => {
        const fe = g[0]
        const le = g[g.length - 1]

        if (!calculator.isPointVisible(fe, (fe.x - le.x) * -1)) return

        renderer.context.fillStyle = color
        renderer.context.beginPath()
        renderer.context.moveTo(fe.x, this.scaleZeroSegment!.y)

        g.forEach((el) => {
          renderer.context.lineTo(el.x, el.y)
        })

        renderer.context.lineTo(le.x, this.scaleZeroSegment!.y)
        renderer.context.fillStyle = color
        renderer.context.fill()
      })
    }
  }
}

export interface SnowIceParameters {
  default?: VisualizerElementsGroupData<SnowIceValue>
}

export function createSnowIceGraph(parameters: SnowIceParameters) {
  new Visualizer({
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
  })

  if (parameters.default) {
    new SnowIceGroup({
      data: parameters.default,
      snowFillColor: '#a6d9ff',
      iceFillColor: '#00b1ff',
      snowStrokeColor: '#80c8ff',
      iceStrokeColor: '#1588ff',
      maxDaysGap: 3,
    })
  }
}
