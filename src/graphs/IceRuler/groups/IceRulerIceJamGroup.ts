import { clamp } from '../../../utils/math'
import { IceRulerGroupParameters } from '../IceRulerGroup'
import { IceRulerTriangleGroup } from './IceRulerTriangleGroup'

export interface IceRulerIceJamGroupParameters extends IceRulerGroupParameters {
  rotate?: boolean
}

export class IceRulerIceJamGroup extends IceRulerTriangleGroup {
  protected rotate: boolean

  constructor(parameters: IceRulerIceJamGroupParameters) {
    super(parameters)

    this.rotate = parameters.rotate || false
  }

  public render() {
    const { complexGraph } = this.visualizer
    const { calculator } = complexGraph

    this.elements.forEach((el) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(el)) return

      const x = el.x + el.width / 2
      const s = clamp(calculator.area.width * 0.0011, 1, el.height)
      const o = el.height - s

      this.drawTriangle(x, el.y + o, s, this.color, this.rotate)
    })
  }
}
