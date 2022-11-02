import { SceneObject, SceneRenderData } from './Scene'
import { UtilsGraph } from './UtilsGraph'

export default class Timeline extends SceneObject {
  constructor() {
    super()
  }

  public render({ canvas, scene }: SceneRenderData): void {
    const points = UtilsGraph.points(
      [
        10, 20, 30, 10, 50, 10, 100, 123, 30, 70, 80, 10, 20, 30, 10, 50, 10, 55, 200, 30, 70, 80,
        2, 77, 30, 10, 50, 10, 55, 100, 30, 70, 25, 10, 40, 30, 10, 80, 10, 89, 79, 30, 11, 50,
      ],
      {
        x: scene.size.pointer.current,
        y: canvas.size.y,
      }
    )
    UtilsGraph.smooth(canvas.context, points)
    canvas.context.lineWidth = 1
    canvas.context.stroke()
  }
}
