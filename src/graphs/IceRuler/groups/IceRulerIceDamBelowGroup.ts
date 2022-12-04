import { IceRulerGroupParameters } from '../IceRulerGroup'
import { IceRulerIceDamGroup } from './IceRulerIceDamGroup'

export class IceRulerIceDamBelowGroup extends IceRulerIceDamGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)
  }

  protected drawEdge(x: number, y: number, s: number) {
    const { complexGraph } = this.visualizer
    const { renderer } = complexGraph

    renderer.context.strokeStyle = this.color

    renderer.context.beginPath()
    renderer.context.moveTo(x - s, y + s)
    renderer.context.lineTo(x, y)
    renderer.context.lineTo(x + s, y + s)
    renderer.context.stroke()

    this.drawTriangle(x, y - s, s, this.color, true)
  }
}
