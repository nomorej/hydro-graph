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
      timeline.months.forEach((month, monthIndex) => {
        const sp = month.primitive

        if (monthIndex) {
          renderer.context.beginPath()
          renderer.context.moveTo(sp.x1, sp.y1)
          renderer.context.lineTo(sp.x1, sp.y2)
          renderer.context.strokeStyle = CGGlobals.colors.timelineMonth
          renderer.context.lineWidth = timeline.primitive.height * 0.15
          renderer.context.stroke()
        }

        month.segments.forEach((s, index) => {
          if (monthIndex === 0 && index === 0) return
          renderer.context.save()
          renderer.context.beginPath()
          renderer.context.moveTo(s.position, sp.y1)
          renderer.context.lineTo(s.position, sp.y2)
          renderer.context.globalAlpha = s.value ? 0.3 : 0.1
          renderer.context.strokeStyle = CGGlobals.colors.timelineMonth
          renderer.context.lineWidth = timeline.primitive.height * 0.1
          renderer.context.stroke()
          renderer.context.restore()
        })
      })
    }
  }
}
