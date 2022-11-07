import { CGGlobals } from '../core/ComplexGraph'
import { SceneRenderData } from '../core/Scene'
import { SceneObject } from '../core/SceneObject'
import { UtilsGraph } from '../utils/UtilsGraph'

export class TestGraph extends SceneObject {
  constructor() {
    super()
  }

  public render({ renderer }: SceneRenderData): void {
    const { content } = CGGlobals.calculations
    const points = UtilsGraph.points(
      [
        10, 20, 30, 10, 50, 10, 100, 123, 30, 70, 80, 10, 20, 30, 10, 50, 10, 55, 200, 30, 70, 80,
        2, 77, 30, 10, 50, 10, 55, 100, 30, 70, 25, 10, 40, 30, 10, 80, 10, 89, 79, 30, 11, 50,
      ],
      {
        x: content.width,
        y: content.height,
      },
      {
        x: content.x1,
        y: content.y1,
      }
    )

    renderer.context.lineWidth = 2
    UtilsGraph.smooth(renderer.context, points)
    renderer.context.strokeStyle = CGGlobals.colors.default
    renderer.context.stroke()
  }
}
