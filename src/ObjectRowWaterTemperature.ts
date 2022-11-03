import { appGlobals } from './App'
import { ObjectRow } from './ObjectRow'
import { SceneRenderData } from './Scene'
import { UtilsGraph } from './UtilsGraph'

export class ObjectRowWaterTemperature extends ObjectRow {
  constructor() {
    super('waterTemperature')
  }

  public render({ renderer }: SceneRenderData): void {
    const { graphs } = appGlobals.calculations
    const graph = graphs[this.name]

    const points = UtilsGraph.points(
      [
        10, 20, 30, 10, 50, 10, 100, 123, 30, 70, 80, 10, 20, 30, 10, 50, 10, 55, 200, 30, 70, 80,
        2, 77, 30, 10, 50, 10, 55, 100, 30, 70, 25, 10, 40, 30, 10, 80, 10, 89, 79, 30, 11, 50,
      ],
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
