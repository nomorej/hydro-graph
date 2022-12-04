import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'

export class IceRulerWaterOnIceGroup extends IceRulerGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)
  }

  public render() {
    const { complexGraph } = this.visualizer
    const { renderer } = complexGraph

    renderer.context.strokeStyle = this.color

    this.elements.forEach((el) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(el)) return

      renderer.context.strokeRect(el.x, el.y, el.width, el.height)
    })
  }
}
