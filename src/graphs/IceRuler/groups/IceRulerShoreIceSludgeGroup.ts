import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'

export class IceRulerShoreIceSludgeGroup extends IceRulerGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)
  }

  public render() {
    const { complexGraph } = this.visualizer
    const { renderer } = complexGraph

    renderer.context.strokeStyle = this.color

    this.elements.forEach((el) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(el)) return

      renderer.context.beginPath()
      renderer.context.moveTo(el.x, el.y + el.height / 2)
      renderer.context.lineTo(el.x + el.width, el.y + el.height / 2)
      renderer.context.stroke()
    })
  }
}
