import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'

export class IceRulerIceShoveGroup extends IceRulerGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)
  }

  public render() {
    const { complexGraph } = this.visualizer
    const { renderer, calculator } = complexGraph

    renderer.context.fillStyle = this.color

    const width = Math.min(this.lineSize * 4, calculator.area.width * 0.001)

    this.elements.forEach((el) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(el)) return

      renderer.context.beginPath()
      renderer.context.fillRect(el.x, el.y, width, el.height)
    })
  }
}
