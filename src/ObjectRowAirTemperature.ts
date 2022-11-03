import { appGlobals } from './App'
import { ObjectRow } from './ObjectRow'
import { SceneRenderData } from './Scene'
import { UtilsGraph } from './UtilsGraph'

export class ObjectRowAirTemperature extends ObjectRow {
  constructor() {
    super('airTemperature')
  }

  public render({ renderer }: SceneRenderData): void {
    const { rows, calculations } = appGlobals
    const row = rows[this.name]
    if (!row) return
    const { graphs } = calculations
    const graph = graphs[this.name]

    const points = UtilsGraph.points(
      [65, 52, 28, 65, 78, 70, 1, 54, 13, 18, 59, 69, 30, 11, 50, 78, 29, 29, 82, 67],
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
