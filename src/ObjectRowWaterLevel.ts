import { appGlobals } from './App'
import { ObjectRow } from './ObjectRow'
import { SceneRenderData } from './Scene'
import { UtilsGraph } from './UtilsGraph'

export class ObjectRowWaterLevel extends ObjectRow {
  constructor() {
    super('waterLevel')
  }

  public render({ renderer }: SceneRenderData): void {
    const { graphs } = appGlobals.calculations
    const graph = graphs[this.name]

    const points = UtilsGraph.points(
      [64, 46, 52, 57, 64, 48, 33, 9, 61, 93, 7, 17, 52, 37, 46, 20, 38, 72, 0, 46],
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
