import { pointRectCollision } from '../../utils/collisions/pointRectCollision'
import { XY } from '../../utils/ts'
import { VisualizerElement } from '../../visualizer/VisualizerElement'
import { VisualizerGroup, VisualizerGroupParameters } from '../../visualizer/VisualizerGroup'
import { IceRulerLine } from './IceRuler'

export interface IceRulerGroupParameters extends VisualizerGroupParameters {
  elements: Array<VisualizerElement<undefined>>
  startLine: IceRulerLine
  endLine: IceRulerLine
  auxLines?: Array<IceRulerLine>
}

export abstract class IceRulerGroup extends VisualizerGroup {
  protected elements: Array<VisualizerElement<undefined>>

  protected startLine: IceRulerLine
  protected endLine: IceRulerLine
  protected auxLines?: Array<IceRulerLine>

  protected lineSize: number

  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)

    this.elements = parameters.elements

    this.startLine = parameters.startLine
    this.endLine = parameters.endLine

    this.auxLines = parameters.auxLines

    this.lineSize = 1
  }

  public resize() {
    const { complexGraph } = this.visualizer
    const { renderer } = complexGraph

    this.lineSize = (renderer.minSize * 0.002) / renderer.pixelRatio
    renderer.context.lineWidth = this.lineSize

    this.elements.forEach((element) => {
      element.x = complexGraph.calculator.area.x1 + element.startSegment.x1
      element.width = element.endSegment.x1 - element.startSegment.x1 + 1
      element.height = this.startLine.y - this.endLine.y
      element.y = this.startLine.y - element.height
    })
  }

  public hitTest?(pointer: XY) {
    const { row } = this.visualizer

    const el = this.elements.find((el) => {
      return pointRectCollision(pointer, {
        x: el.x,
        y: row.y1,
        width: el.width,
        height: row.height,
      })
    })

    return el
  }

  public hitInfo?(element: VisualizerElement<undefined>) {
    return [`Срок: ${element.startSegment.date}`, ...element.comment]
  }
}
