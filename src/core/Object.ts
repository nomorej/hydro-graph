import { ComplexGraph } from './ComplexGraph'

export interface ObjectParameters {
  name?: string
}

export abstract class Object {
  public readonly name: string | undefined
  public isActive: boolean
  public complexGraph: ComplexGraph = null!

  constructor(parameters?: ObjectParameters) {
    this.name = parameters?.name
    this.isActive = true
  }

  public abstract onRender(): void
  public onResize?(): void
  public onCreate?(): void
  public onDestroy?(): void
}
