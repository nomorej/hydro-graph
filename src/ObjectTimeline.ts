import { appGlobals } from './App'
import { SceneObject, SceneRenderData } from './Scene'

export class ObjectTimeline extends SceneObject {
  constructor() {
    super()
  }

  public render({ renderer }: SceneRenderData) {
    const { timeline, fontSize } = appGlobals.calculations

    renderer.context.beginPath()
    renderer.context.moveTo(timeline.primitive.x1, timeline.primitive.middleY)
    renderer.context.lineTo(timeline.primitive.x2, timeline.primitive.middleY)
    renderer.context.lineWidth = timeline.primitive.height * 0.15
    renderer.context.strokeStyle = appGlobals.colors.timeline
    renderer.context.stroke()

    if (timeline.segments.length) {
      renderer.context.font = `${fontSize}px ${appGlobals.font}`
      renderer.context.textAlign = 'center'
      renderer.context.textBaseline = 'top'

      const dashYOffset = timeline.primitive.height / 2

      timeline.segments.forEach((segment) => {
        const sp = segment.primitive

        renderer.context.beginPath()
        renderer.context.moveTo(sp.x1, sp.y2 - dashYOffset)
        renderer.context.lineTo(sp.x1, sp.y2 + dashYOffset)
        renderer.context.lineWidth = timeline.primitive.height * 0.2
        renderer.context.stroke()

        renderer.context.fillText(segment.data, sp.x1, sp.y2 + timeline.primitive.height * 0.8)
      })
    }
  }
}
