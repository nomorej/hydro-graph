import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'

export class IceRulerIceDriftGroup extends IceRulerGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)
  }

  public render() {
    const { complexGraph } = this.visualizer
    const { renderer } = complexGraph

    renderer.context.fillStyle = this.color

    this.elements.forEach((el) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(el)) return
      renderer.context.fillRect(el.x, el.y, el.width, el.height)
    })
  }
}
