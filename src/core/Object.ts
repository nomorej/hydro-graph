import { Scene, SceneCallbackData, SceneRenderData } from './Scene'

export interface ObjectParameters {
  name?: string
}

export abstract class Object {
  public readonly name: string | undefined
  public active: boolean

  constructor(parameters?: ObjectParameters) {
    this.name = parameters?.name
    this.active = true
  }

  public abstract render(data: SceneRenderData): void
  public resize?(data: SceneCallbackData): void
  public create?(scene: Scene): void
  public destroy?(scene: Scene): void
}
