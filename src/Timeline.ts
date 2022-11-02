import { appGlobals } from './App'
import { SceneObject, SceneRenderData } from './Scene'

export default class Timeline extends SceneObject {
  constructor() {
    super()
  }

  public render({ renderer }: SceneRenderData) {
    const {
      paddingX,
      paddingY,
      sceneWidthMinusPadding,
      timelineY,
      contentX,
      contentWidth,
      timelineDashSize,
    } = appGlobals.calculations

    renderer.context.save()

    renderer.context.beginPath()
    renderer.context.moveTo(paddingX, timelineY)
    renderer.context.lineTo(sceneWidthMinusPadding, timelineY)
    renderer.context.lineWidth = appGlobals.sizes.timelineAxisThickness * renderer.minSize
    renderer.context.strokeStyle = appGlobals.colors.timeline
    renderer.context.stroke()

    if (appGlobals.data.months) {
      const fontSize = appGlobals.sizes.font * renderer.minSize
      renderer.context.font = `${fontSize}px ${appGlobals.font}`
      renderer.context.textAlign = 'center'
      renderer.context.textBaseline = 'bottom'

      const dashYOffset = timelineDashSize / 2
      const length = appGlobals.data.months.length - 1
      const segmentWidth = contentWidth / (length + 2)

      appGlobals.data.months.forEach((month, i) => {
        const x = contentX + segmentWidth + segmentWidth * i
        const y = renderer.size.y - paddingY
        appGlobals.calculations.timeline[i] = {
          x,
          y,
        }

        renderer.context.beginPath()
        renderer.context.moveTo(x, timelineY - dashYOffset)
        renderer.context.lineTo(x, timelineY + dashYOffset)
        renderer.context.stroke()

        renderer.context.fillText(month, x, y)
      })
    }

    renderer.context.restore()
  }
}
