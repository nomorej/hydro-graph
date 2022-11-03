import { appGlobals } from './App'
import { SceneObject, SceneRenderData } from './Scene'

export class ObjectTimelineSegments extends SceneObject {
  constructor() {
    super()
  }

  public render({ renderer }: SceneRenderData) {
    const { timeline } = appGlobals.calculations

    if (timeline.segments.length) {
      timeline.segments.forEach((segment) => {
        const sp = segment.primitive

        renderer.context.beginPath()
        renderer.context.moveTo(sp.x1, sp.y1)
        renderer.context.lineTo(sp.x1, sp.y2)
        renderer.context.strokeStyle = appGlobals.colors.timelineSegment
        renderer.context.lineWidth = timeline.primitive.height * 0.15
        renderer.context.stroke()
      })
    }
  }
}
