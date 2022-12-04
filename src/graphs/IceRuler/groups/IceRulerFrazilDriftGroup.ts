import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'

export interface IceRulerFrazilDriftGroupParameters extends IceRulerGroupParameters {
  backgroundColor?: string
}

export class IceRulerFrazilDriftGroup extends IceRulerGroup {
  private readonly backgroundColor: string

  constructor(parameters: IceRulerFrazilDriftGroupParameters) {
    super(parameters)

    this.backgroundColor = parameters.backgroundColor || '#738d73'
  }

  public render() {
    const { complexGraph } = this.visualizer
    const { renderer, scene } = complexGraph

    renderer.context.fillStyle = this.backgroundColor

    renderer.context.strokeStyle = this.color

    let offset = 0

    if (this.auxLines?.[0]) {
      offset = this.startLine.y - this.auxLines[0].y
    }

    this.elements.forEach((el) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(el)) return

      renderer.context.fillRect(el.x, el.y - offset, el.width, el.height + offset)

      const s = Math.ceil(scene.zoom / 3)
      const step = el.width / s

      for (let index = 0; index < s; index++) {
        const x = el.x + step * index + 1

        renderer.context.beginPath()
        renderer.context.moveTo(x, el.y)
        renderer.context.lineTo(x, el.y + el.height)
        renderer.context.stroke()
      }
    })
  }
}
