import { CGGlobals, GraphsData } from '../core/ComplexGraph'
import { Scene, SceneRenderData } from '../core/Scene'
import { Graph } from '../core/Graph'
import { UtilsGraph } from '../utils/UtilsGraph'

export class Precipitation extends Graph {
  constructor() {
    super('precipitation', 1)
  }

  public render({ renderer, scene }: SceneRenderData): void {
    const { calculations: c, colors, graphsData: g } = CGGlobals

    const row = c.rowsPrimitives[this.row]

    renderer.context.beginPath()
    renderer.context.moveTo(row.x1, row.y2)
    renderer.context.lineTo(row.x2, row.y2)
    renderer.context.strokeStyle = colors.default
    renderer.context.lineWidth = 1
    renderer.context.stroke()

    g.precipitation.scale?.segments.forEach((s) => {
      renderer.context.save()
      renderer.context.beginPath()
      renderer.context.strokeStyle = colors.graphs.precipitation.scale
      renderer.context.lineWidth = 1
      if (!s.isBase) {
        renderer.context.globalAlpha = 0.1
      } else {
        renderer.context.globalAlpha = 0.3
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

    this.drawGraph(scene, 'solid')
    this.drawGraph(scene, 'liquid')
  }

  private drawGraph(scene: Scene, key: keyof GraphsData['precipitation']['graph']) {
    const { calculations: c, graphsData: g, colors } = CGGlobals

    const row = c.rowsPrimitives[this.row]
    const graph = g.precipitation.graph[key]

    if (graph && graph.length) {
      const points = UtilsGraph.points({
        graphName: 'precipitation',
        key: key,
        graphPosition: {
          x: row.x1,
          y: row.y1,
        },
        graphSize: {
          x: row.width,
          y: row.height,
        },
        row: this.row,
      })

      scene.renderer.context.lineWidth = 1
      scene.renderer.context.strokeStyle = colors.default
      scene.renderer.context.fillStyle = colors.graphs.precipitation[key]

      points.forEach((p) => {
        const width = p.width / 24
        scene.renderer.context.beginPath()
        scene.renderer.context.rect(p.x + 1, row.y2 - 1, width, p.y - row.y2 + 1)
        scene.renderer.context.stroke()
        scene.renderer.context.fill()
      })
    }
  }
}
