import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'

export class IceRulerShoreIceGroup extends IceRulerGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)
    this.hitInfo = undefined
    this.hitTest = undefined
  }

  public render() {
    const { complexGraph } = this.visualizer
    const { renderer } = complexGraph

    renderer.context.strokeStyle = this.color

    this.elements.forEach((el) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(el)) return

      const startY = el.y + this.lineSize / 2
      renderer.context.beginPath()
      renderer.context.moveTo(el.x, startY)
      renderer.context.lineTo(el.x + el.width, startY)
      renderer.context.stroke()

      const endY = el.y + el.height - this.lineSize / 2
      renderer.context.beginPath()
      renderer.context.moveTo(el.x, endY)
      renderer.context.lineTo(el.x + el.width, endY)
      renderer.context.stroke()
    })
  }
}
