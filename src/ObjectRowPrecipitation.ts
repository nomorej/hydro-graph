import { appGlobals } from './App'
import { ObjectRow } from './ObjectRow'
import { SceneRenderData } from './Scene'
import { UtilsGraph } from './UtilsGraph'

export class ObjectRowPrecipitation extends ObjectRow {
  constructor() {
    super('precipitation')
  }

  public render({ renderer }: SceneRenderData): void {
    const { rows, calculations } = appGlobals
    const row = rows[this.name]
    if (!row) return
    const { graphs } = calculations
    const graph = graphs[this.name]

    const points = UtilsGraph.points(
      [29, 75, 31, 9, 62, 0, 45, 47, 37, 23, 85, 88, 75, 17, 12, 80, 0, 16, 29, 83],
      {
        x: graph.width,
        y: graph.height,
      },
      {
        x: graph.x1,
        y: graph.y1,
      }
    )

    renderer.context.lineWidth = 2
    UtilsGraph.smooth(renderer.context, points)
    renderer.context.strokeStyle = appGlobals.colors.default
    renderer.context.stroke()
  }
}
