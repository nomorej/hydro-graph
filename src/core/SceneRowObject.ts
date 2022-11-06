import { SceneObject } from './SceneObject'

export abstract class SceneRowObject extends SceneObject {
  public readonly row: number

  constructor(name: string, row = 0) {
    super(name)
    this.row = row
  }
}
