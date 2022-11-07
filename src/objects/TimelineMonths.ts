import { CGGlobals } from '../core/ComplexGraph'
import { SceneRenderData } from '../core/Scene'
import { SceneObject } from '../core/SceneObject'

export class TimelineMonths extends SceneObject {
  constructor() {
    super()
  }

  public render({ renderer }: SceneRenderData) {
    const { timeline } = CGGlobals.calculations

    if (timeline.months.length) {
      timeline.months.forEach((month) => {
        const sp = month.primitive

        renderer.context.beginPath()
        renderer.context.moveTo(sp.x1, sp.y1)
        renderer.context.lineTo(sp.x1, sp.y2)
        renderer.context.strokeStyle = CGGlobals.colors.timelineMonth
        renderer.context.lineWidth = timeline.primitive.height * 0.15
        renderer.context.stroke()
      })
    }
  }
}
