import { appGlobals } from './App'
import { SceneObject, SceneRenderData } from './Scene'

export default class Timeline extends SceneObject {
  constructor() {
    super()
  }

  public render({ renderer, scene }: SceneRenderData) {
    const yOffset = renderer.size.y * appGlobals.sizes.timelineYOffset
    const xOffset = renderer.size.x * appGlobals.sizes.minXOffset

    renderer.context.save()

    renderer.context.beginPath()
    renderer.context.moveTo(xOffset, renderer.size.y - yOffset)
    renderer.context.lineTo(scene.size.pointer.current - xOffset * 2, renderer.size.y - yOffset)
    renderer.context.lineWidth = appGlobals.sizes.timelineAxisThickness * renderer.minSize
    renderer.context.strokeStyle = appGlobals.colors.timeline
    renderer.context.stroke()

    if (appGlobals.data.months) {
      appGlobals.data.months.forEach(() => {})
    }

    renderer.context.restore()
  }
}
