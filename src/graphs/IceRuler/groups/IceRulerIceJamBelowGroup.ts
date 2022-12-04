import { IceRulerGroupParameters } from '../IceRulerGroup'
import { IceRulerIceJamGroup } from './IceRulerIceJamGroup'

export class IceRulerIceJamBelowGroup extends IceRulerIceJamGroup {
  constructor(parameters: IceRulerGroupParameters) {
    super({ ...parameters, rotate: true })
  }
}
