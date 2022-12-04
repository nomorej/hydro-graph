import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'

export class IceRulerFlangeIceGroup extends IceRulerGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)
  }

  public render() {
    const { complexGraph } = this.visualizer
    const { renderer } = complexGraph

    renderer.context.fillStyle = this.color

    let offset = 0

    this.elements.forEach((el) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(el)) return

      if (this.auxLines?.[0]) {
        offset = this.startLine.y - this.auxLines[0].y
      }

      renderer.context.fillRect(el.x, el.y, el.width, el.height - offset)
    })
  }
}
