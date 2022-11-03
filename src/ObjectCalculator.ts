import { appGlobals } from './App'
import { Primitive } from './Primitive'
import { SceneObject, SceneRenderData } from './Scene'

export class ObjectCalculator extends SceneObject {
  constructor() {
    super()
  }

  public render({ renderer, scene }: SceneRenderData) {
    const c = appGlobals.calculations

    c.fontSize = appGlobals.sizes.font * renderer.minSize

    c.workspace.x1 = renderer.minSize * appGlobals.sizes.paddingX
    c.workspace.x2 = renderer.size.x - c.workspace.x1
    c.workspace.y1 = renderer.minSize * appGlobals.sizes.paddingY
    c.workspace.y2 = renderer.size.y - c.workspace.y1

    const sceneSize = scene.size.pointer.current - c.workspace.x1

    const timelineHeight = appGlobals.sizes.timelineHeight * renderer.minSize
    const timelineOffsetY = appGlobals.sizes.timelineOffsetY * renderer.minSize

    c.timeline.primitive.x1 = c.workspace.x1
    c.timeline.primitive.x2 = sceneSize
    c.timeline.primitive.y1 = c.workspace.y2 - timelineOffsetY - timelineHeight / 2
    c.timeline.primitive.y2 = c.workspace.y2 - timelineOffsetY + timelineHeight / 2

    const contentWrapperPaddingX = renderer.minSize * appGlobals.sizes.contentPaddingX
    const contentWrapperLeft = c.workspace.x1 + contentWrapperPaddingX
    const contentWrapperRight = c.workspace.x2 - contentWrapperPaddingX

    c.contentWrapper.x1 = contentWrapperLeft + scene.position.pointer.current
    c.contentWrapper.x2 = contentWrapperRight + scene.position.pointer.current
    c.contentWrapper.y1 = c.workspace.y1
    c.contentWrapper.y2 = c.timeline.primitive.y2 * 0.95

    c.content.x1 = contentWrapperLeft
    c.content.x2 = scene.size.pointer.current - contentWrapperLeft
    c.content.y1 = c.contentWrapper.y1
    c.content.y2 = c.contentWrapper.y2

    if (appGlobals.data.months) {
      const length = appGlobals.data.months.length - 1
      const segmentWidth = (c.timeline.primitive.width - contentWrapperPaddingX * 2) / (length + 2)

      appGlobals.data.months.forEach((month, i) => {
        const x1 = segmentWidth + contentWrapperLeft + segmentWidth * i
        const x2 = x1 + segmentWidth
        const y1 = c.workspace.y1
        const y2 = c.timeline.primitive.middleY

        const segment = {
          primitive: new Primitive(x1, x2, y1, y2),
          data: month,
        }

        c.timeline.segments[i] = segment
      })
    }
  }
}
