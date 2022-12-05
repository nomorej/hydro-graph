import { ComplexGraph, complexGraphPointer } from '../core/ComplexGraph'

export abstract class Extension {
  public readonly complexGraph: ComplexGraph

  private destroyed: boolean

  constructor() {
    if (!complexGraphPointer.target) {
      throw new Error('[Extension] сперва необходимо создать график')
    }

    this.complexGraph = complexGraphPointer.target
    this.complexGraph.extensions.add(this)

    this.destroyed = false
  }

  public destroy() {
    if (!this.destroyed) {
      this.destroyed = true
      this.complexGraph.extensions.delete(this)
      this.onDestroy?.()
    }
  }

  public onDestroy?(): void
}
