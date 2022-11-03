import { appGlobals } from './App'
import { SceneObject, SceneRenderData } from './Scene'

export default class Content extends SceneObject {
  constructor() {
    super()
  }

  public render({ renderer }: SceneRenderData): void {
    const { contentWrapper } = appGlobals.calculations

    renderer.context.beginPath()
    renderer.context.rect(
      contentWrapper.x1,
      contentWrapper.y1,
      contentWrapper.width,
      contentWrapper.height
    )
    renderer.context.clip()

    renderer.context.fillStyle = appGlobals.colors.content
    renderer.context.fillRect(
      contentWrapper.x1,
      contentWrapper.y1,
      contentWrapper.width,
      contentWrapper.height
    )
  }
}
