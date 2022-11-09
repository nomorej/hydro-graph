import { CGGlobals, GraphsData } from '../core/ComplexGraph'
import { Renderer } from '../core/Renderer'
import { SceneRenderData } from '../core/Scene'
import { Graph } from '../core/Graph'
import { UtilsGraph } from '../utils/UtilsGraph'

export class AirTemperature extends Graph {
  constructor() {
    super('airTemperature', 0)
  }

  public render({ renderer }: SceneRenderData): void {
    const { colors, calculations: c, graphsData: g } = CGGlobals

    g.airTemperature.scale?.segments.forEach((s) => {
      renderer.context.save()
      renderer.context.beginPath()
      renderer.context.strokeStyle = colors.graphs.airTemperature.scale
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

  private drawGraph(renderer: Renderer, key: keyof GraphsData['airTemperature']['graph']) {
    const { colors, calculations: c, graphsData: g } = CGGlobals

    const graph = g.airTemperature.graph[key]

    if (graph && graph.length) {
      const points = UtilsGraph.points({
        graphName: 'airTemperature',
        key: key,
        graphPosition: {
          x: c.rowsPrimitives[this.row].x1,
          y: c.rowsPrimitives[this.row].y1,
        },
        graphSize: {
          x: c.rowsPrimitives[this.row].width,
          y: c.rowsPrimitives[this.row].height,
        },
        row: this.row,
      })
      renderer.context.lineWidth = 2
      UtilsGraph.smooth(renderer.context, points)
      renderer.context.strokeStyle = colors.graphs.airTemperature[key]
      renderer.context.stroke()
    }
  }
}
