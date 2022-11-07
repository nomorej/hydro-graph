import { CGGlobals } from '../core/ComplexGraph'
import { SceneRenderData } from '../core/Scene'
import { SceneDataRepresentation } from '../core/SceneDataRepresentation'

export class Precipitation extends SceneDataRepresentation {
  constructor() {
    super('precipitation', 1)
  }

  public render({ renderer }: SceneRenderData): void {
    const { calculations: c, colors } = CGGlobals

    const row = c.rowsPrimitives[this.row]

    renderer.context.beginPath()
    renderer.context.moveTo(row.x1, row.y2)
    renderer.context.lineTo(row.x2, row.y2)
    renderer.context.strokeStyle = colors.default
    renderer.context.lineWidth = 1
    renderer.context.stroke()

    c.scales.precipitation.segments.forEach((s) => {
      renderer.context.save()
      renderer.context.beginPath()
      renderer.context.strokeStyle = colors.reps.precipitation.scale
      renderer.context.lineWidth = 1
      if (!s.isBase) {
        renderer.context.globalAlpha = 0.2
      } else {
        renderer.context.globalAlpha = 0.7
      }
      if (s.value === 0) {
        renderer.context.strokeStyle = colors.default
        renderer.context.lineWidth = 1
        renderer.context.globalAlpha = 1
      }
      renderer.context.moveTo(c.rowsPrimitives[this.row].x1, s.position)
      renderer.context.lineTo(c.rowsPrimitives[this.row].x2, s.position)
      renderer.context.stroke()
      renderer.context.restore()
    })
  }
}
