import { AppPossibleRows } from './App'
import { SceneObject } from './Scene'

export abstract class ObjectRow extends SceneObject {
  constructor(public readonly name: AppPossibleRows) {
    super()
  }
}
