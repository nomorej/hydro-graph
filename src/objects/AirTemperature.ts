import { CGGlobals, GraphsData } from '../core/ComplexGraph'
import { Renderer } from '../core/Renderer'
import { SceneRenderData } from '../core/Scene'
import { SceneDataRepresentation } from '../core/SceneDataRepresentation'
import { UtilsGraph } from '../utils/UtilsGraph'

export class AirTemperature extends SceneDataRepresentation {
  constructor() {
    super('airTemperature', 0)
  }

  public render({ renderer }: SceneRenderData): void {
    const { colors, calculations: c } = CGGlobals

    c.scales.airTemperature.segments.forEach((s) => {
      renderer.context.save()
      renderer.context.beginPath()
      renderer.context.strokeStyle = colors.reps.airTemperature.scale
      renderer.context.lineWidth = 1
      if (s.value === 0) {
        renderer.context.strokeStyle = colors.default
        renderer.context.lineWidth = 3
      }
      if (!s.isBase) {
        renderer.context.globalAlpha = 0.2
      } else {
        renderer.context.globalAlpha = 0.7
      }
      renderer.context.moveTo(c.rowsPrimitives[this.row].x1, s.position)
      renderer.context.lineTo(c.rowsPrimitives[this.row].x2, s.position)
      renderer.context.stroke()
      renderer.context.restore()
    })

    this.drawGraph(renderer, 'min')
    this.drawGraph(renderer, 'middle')
    this.drawGraph(renderer, 'max')
  }

  private drawGraph(renderer: Renderer, name: keyof GraphsData['airTemperature']['graph']) {
    const { colors, calculations: c, data } = CGGlobals
    const { reps } = data

    const offset = c.rowsPrimitives[this.row].height / c.scales.airTemperature.segments.length

    const graph = reps.airTemperature.graph[name]

    if (graph && graph.length) {
      const points = UtilsGraph.points(
        graph,
        {
          x: c.rowsPrimitives[this.row].width,
          y: c.rowsPrimitives[this.row].height - offset,
        },
        {
          x: c.rowsPrimitives[this.row].x1,
          y: c.rowsPrimitives[this.row].y1 + offset,
        },
        c.scales.airTemperature.max,
        c.scales.airTemperature.min
      )
      renderer.context.lineWidth = 2
      UtilsGraph.smooth(renderer.context, points)
      renderer.context.strokeStyle = colors.reps.airTemperature[name]
      renderer.context.stroke()
    }
  }
}
