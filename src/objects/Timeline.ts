import { CGGlobals } from '../core/ComplexGraph'
import { SceneRenderData } from '../core/Scene'
import { SceneObject } from '../core/SceneObject'

export class Timeline extends SceneObject {
  constructor() {
    super()
  }

  public render({ renderer }: SceneRenderData) {
    const { timeline, fontSize } = CGGlobals.calculations

    renderer.context.beginPath()
    renderer.context.moveTo(timeline.primitive.x1, timeline.primitive.middleY)
    renderer.context.lineTo(timeline.primitive.x2, timeline.primitive.middleY)
    renderer.context.lineWidth = timeline.primitive.height * 0.15
    renderer.context.strokeStyle = CGGlobals.colors.timeline
    renderer.context.stroke()

    if (timeline.months.length) {
      renderer.context.font = `${fontSize}px ${CGGlobals.font}`
      renderer.context.textAlign = 'center'
      renderer.context.textBaseline = 'top'
      renderer.context.fillStyle = CGGlobals.colors.default

      const dashYOffset = timeline.primitive.height / 2

      timeline.months.forEach((month) => {
        const sp = month.primitive

        renderer.context.beginPath()
        renderer.context.moveTo(sp.x1, sp.y2 - dashYOffset)
        renderer.context.lineTo(sp.x1, sp.y2 + dashYOffset)
        renderer.context.lineWidth = timeline.primitive.height * 0.2
        renderer.context.stroke()

        renderer.context.fillText(month.data, sp.x1, sp.y2 + timeline.primitive.height * 0.8)
      })
    }
  }
}
