import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'

export class IceRulerIceClearingGroup extends IceRulerGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)
  }

  public render() {
    const { complexGraph } = this.visualizer
    const { renderer } = complexGraph

    renderer.context.fillStyle = this.color

    let offset1 = 0
    let offset2 = 0
    let offset3 = 0

    this.elements.forEach((el) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(el)) return

      if (this.auxLines?.[0]) {
        offset1 = this.startLine.y - this.auxLines[0].y
      }

      if (this.auxLines?.[1]) {
        offset2 = this.startLine.y - this.auxLines[1].y
      }

      if (this.auxLines?.[2]) {
        offset3 = this.startLine.y - this.auxLines[2].y
      }

      renderer.context.fillRect(el.x, el.y, el.width, el.height - offset3)
      renderer.context.fillRect(el.x, el.y + offset2, el.width, offset2 - offset1)
    })
  }
}
