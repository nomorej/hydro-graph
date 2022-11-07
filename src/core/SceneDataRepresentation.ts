import { DataReps } from './ComplexGraph'
import { SceneObject } from './SceneObject'

export abstract class SceneDataRepresentation extends SceneObject<DataReps> {
  public readonly row: number

  constructor(name: DataReps, row = 0) {
    super(name)
    this.row = row
  }
}
