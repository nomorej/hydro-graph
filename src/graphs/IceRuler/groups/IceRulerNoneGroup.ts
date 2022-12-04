import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'

export class IceRulerNoneGroup extends IceRulerGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)
  }

  public render() {}
}
