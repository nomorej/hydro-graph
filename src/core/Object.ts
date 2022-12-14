import { Extension } from './Extension'

export interface ObjectParameters {
  name?: string
  unactive?: true
}

export abstract class Object extends Extension {
  public readonly name: string | undefined
  public isActive: boolean

  constructor(parameters?: ObjectParameters) {
    super()

    this.name = parameters?.name
    this.isActive = parameters?.unactive ? false : true

    setTimeout(() => {
      this.complexGraph.scene.addObject(this)
      this.onObjectReady?.()
      this.complexGraph.renderer.redraw()
    }, 10)
  }

  public override onDestroy() {
    this.complexGraph.scene.removeObject(this)
    this.complexGraph.renderer.redraw()
  }

  public onObjectReady?(): void
  public abstract onRender(): void
  public onResize?(): void
}
