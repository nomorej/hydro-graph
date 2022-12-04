import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'

export abstract class IceRulerTriangleGroup extends IceRulerGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)
  }

  protected drawTriangle(
    x: number,
    y: number,
    s: number,
    color: string = 'black',
    r: boolean = false
  ) {
    const { renderer } = this.visualizer.complexGraph

    renderer.context.fillStyle = color
    renderer.context.beginPath()

    if (r) {
      renderer.context.moveTo(x, y + s)
      renderer.context.lineTo(x - s, y)
      renderer.context.lineTo(x + s, y)
      renderer.context.lineTo(x, y + s)
    } else {
      renderer.context.moveTo(x, y)
      renderer.context.lineTo(x - s, y + s)
      renderer.context.lineTo(x + s, y + s)
      renderer.context.lineTo(x, y)
    }

    renderer.context.fill()
  }
}
