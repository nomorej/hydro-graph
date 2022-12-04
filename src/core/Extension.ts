import { ComplexGraph, complexGraphPointer } from '../core/ComplexGraph'

export abstract class Extension {
  public readonly complexGraph: ComplexGraph

  constructor() {
    if (!complexGraphPointer.target) {
      throw new Error('[Extension] сперва необходимо создать график')
    }

    this.complexGraph = complexGraphPointer.target
    this.complexGraph.extensions.add(this)
  }

  public destroy() {
    this.complexGraph.extensions.delete(this)
    this.onDestroy?.()
  }

  public onDestroy?(): void
}
