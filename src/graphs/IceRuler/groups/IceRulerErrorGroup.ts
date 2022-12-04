import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'

export class IceRulerErrorGroup extends IceRulerGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)
  }

  public render() {
    const { renderer, scene } = this.visualizer.complexGraph

    renderer.context.strokeStyle = this.color

    this.elements.forEach((element) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(element)) return

      const db = element.endSegment.daysBefore - element.startSegment.daysBefore
      const s = Math.ceil(scene.zoom / 8) * db
      const step = element.width / s

      for (let index = 0; index < s; index++) {
        const x = element.x

        renderer.context.beginPath()

        renderer.context.moveTo(x + step * index, element.y)
        renderer.context.lineTo(x + step * (index + 0.85), element.y + element.height)

        renderer.context.moveTo(x + step * (index + 0.85), element.y)
        renderer.context.lineTo(x + step * index, element.y + element.height)

        renderer.context.stroke()
      }
    })
  }
}
