import { GraphsNames } from './ComplexGraph'
import { SceneObject } from './SceneObject'

export abstract class Graph extends SceneObject<GraphsNames> {
  public readonly row: number

  constructor(name: GraphsNames, row = 0) {
    super(name)
    this.row = row
  }
}
