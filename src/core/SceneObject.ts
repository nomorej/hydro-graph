import { Scene, SceneCallbackData, SceneRenderData } from './Scene'

export abstract class SceneObject<T extends string = string> {
  public active: boolean
  public readonly name: T | undefined

  constructor(name?: T) {
    this.active = true
    this.name = name
  }

  public abstract render(data: SceneRenderData): void
  public resize?(data: SceneCallbackData): void
  public create?(scene: Scene): void
  public destroy?(scene: Scene): void
}
