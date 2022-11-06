import { Scene, SceneCallbackData, SceneRenderData } from './Scene'

export abstract class SceneObject {
  public active: boolean
  public readonly name: string | undefined

  constructor(name?: string) {
    this.active = true
    this.name = name
  }

  public abstract render(data: SceneRenderData): void
  public resize?(data: SceneCallbackData): void
  public create?(scene: Scene): void
  public destroy?(scene: Scene): void
}
