import { clamp } from '../../../utils/math'
import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'

export class IceRulerWaterOnIceGroup extends IceRulerGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)

    this.hitInfo = undefined
    this.hitTest = undefined
  }

  public render() {
    const { complexGraph } = this.visualizer
    const { renderer, calculator } = complexGraph

    renderer.context.strokeStyle = this.color

    this.elements.forEach((el) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(el)) return

      const s = clamp(calculator.area.width * 0.0011, 1, el.height)

      renderer.context.strokeRect(el.x, el.y + el.height - s, el.width, s)
    })
  }
}
