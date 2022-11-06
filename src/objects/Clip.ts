import { CGGlobals } from '../core/ComplexGraph'
import { SceneRenderData } from '../core/Scene'
import { SceneObject } from '../core/SceneObject'

export class Clip extends SceneObject {
  constructor() {
    super('clip')
  }

  public render({ renderer }: SceneRenderData): void {
    const { contentWrapper } = CGGlobals.calculations

    renderer.context.beginPath()
    renderer.context.rect(
      contentWrapper.x1,
      contentWrapper.y1,
      contentWrapper.width,
      contentWrapper.height
    )
    renderer.context.clip()

    renderer.context.fillStyle = CGGlobals.colors.content
    renderer.context.fillRect(
      contentWrapper.x1,
      contentWrapper.y1,
      contentWrapper.width,
      contentWrapper.height
    )
  }
}
