import { appGlobals } from './App'
import { SceneObject, SceneRenderData } from './Scene'

export default class PreCalc extends SceneObject {
  constructor() {
    super()
  }

  public render({ renderer, scene }: SceneRenderData) {
    const c = appGlobals.calculations

    c.paddingX = renderer.size.x * appGlobals.sizes.paddingX
    c.paddingY = renderer.size.x * appGlobals.sizes.paddingY
    c.sceneWidthMinusPadding = scene.size.pointer.current - c.paddingX
    c.timelineYOffset = c.paddingY + renderer.size.y * appGlobals.sizes.timelineYOffset
    c.timelineY = renderer.size.y - c.timelineYOffset
    c.timelineDashSize = appGlobals.sizes.timelineDashSize * renderer.minSize
    c.contentX = appGlobals.sizes.contentPaddingX * renderer.minSize + c.paddingX
    c.contentY = 0
    c.contentWidth = c.sceneWidthMinusPadding - c.contentX * 2 + c.paddingX
    c.contentHeight = renderer.size.y - c.timelineYOffset - c.timelineDashSize - c.contentY
  }
}
