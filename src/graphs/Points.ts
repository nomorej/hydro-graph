import { VisualizerElement, VisualizerElementParameters } from '../visualizer/VisualizerElement'
import {
  VisualizerElementsGroup,
  VisualizerElementsGroupParameters,
} from '../visualizer/VisualizerElementsGroup'
import { linearGraph } from '../utils/graph'
import { XY } from '../utils/ts'
import { pointRectCollision } from '../utils/collisions/pointRectCollision'

export interface PointsElementParameters<T = number> extends VisualizerElementParameters<T> {
  new?: boolean
}

export class PointsElement<T = number> extends VisualizerElement<T> {
  public new: boolean

  constructor(parameters: PointsElementParameters<T>) {
    super(parameters)
    this.new = parameters.new || false
  }
}

export interface PointsGroupParameters<T = number> extends VisualizerElementsGroupParameters<T> {
  maxDaysGap?: number
}

export abstract class PointsGroup<T> extends VisualizerElementsGroup<PointsElement<T>> {
  constructor(parameters: PointsGroupParameters<T>) {
    super(parameters)

    if (parameters.maxDaysGap) {
      let previous: PointsElement<T> | undefined
      let ind = 0

      this.elements.forEach((el) => {
        if (!el.new) {
          if (
            ind > 1 &&
            previous &&
            el.startSegment.daysBefore - previous.startSegment.daysBefore > parameters.maxDaysGap!
          ) {
            el.new = true
            ind = 0
          }
        } else {
          ind = 0
        }

        ind++
        previous = el
      })
    }
  }

  public render(heightStep: number) {
    this.drawLinear()
  }

  protected drawLinear(color = this.color) {
    const { renderer } = this.visualizer.complexGraph
    const { context } = renderer

    context.strokeStyle = color
    context.lineWidth = 1 / renderer.pixelRatio
    linearGraph(context, this.elements)
    context.stroke()
  }

  protected createElement(parameters: PointsElementParameters<T>) {
    return new PointsElement(parameters)
  }
}

export class PointsNumberGroup extends PointsGroup<number> {
  constructor(parameters: PointsGroupParameters<number>) {
    super(parameters)
  }

  public override resize(heightStep: number) {
    const { complexGraph, row, paddingBottom, min } = this.visualizer

    this.elements.forEach((element) => {
      element.width = element.startSegment.x1 - element.endSegment.x1
      element.height = heightStep * (element.value - min)
      element.x = complexGraph.calculator.area.x1 + element.startSegment.x1
      element.y = row.y2 - element.height - paddingBottom
    })
  }

  protected override getElementNumberValue(element: PointsElement<number>): number {
    return element.value
  }

  public override hitTest(pointer: XY<number>) {
    const rectSize = this.visualizer.complexGraph.renderer.minSize * 0.03

    const el = this.elements.find((el) => {
      return pointRectCollision(pointer, {
        x: el.x - rectSize / 2,
        y: el.y - rectSize / 2,
        width: rectSize,
        height: rectSize,
      })
    })

    return el
  }
}
