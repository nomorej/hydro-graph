import { Constructor } from '../../../utils/ts'
import { IceRulerGroup, IceRulerGroupParameters } from '../IceRulerGroup'
import { IceRuleGroupsNames, IceRulerLineNumber } from '../IceRuler'
import { IceRulerErrorGroup } from './IceRulerErrorGroup'
import { IceRulerFlangeIceGroup } from './IceRulerFlangeIceGroup'
import { IceRulerFrazilDriftGroup } from './IceRulerFrazilDriftGroup'
import { IceRulerFreezingGroup } from './IceRulerFreezingGroup'
import { IceRulerIceClearingGroup } from './IceRulerIceClearingGroup'
import { IceRulerIceDamAboveGroup } from './IceRulerIceDamAboveGroup'
import { IceRulerIceDamBelowGroup } from './IceRulerIceDamBelowGroup'
import { IceRulerIceDriftGroup } from './IceRulerIceDriftGroup'
import { IceRulerIceJamAboveGroup } from './IceRulerIceJamAboveGroup'
import { IceRulerIceJamBelowGroup } from './IceRulerIceJamBelowGroup'
import { IceRulerIceShoveGroup } from './IceRulerIceShoveGroup'
import { IceRulerNoneGroup } from './IceRulerNoneGroup'
import { IceRulerShoreIceGroup } from './IceRulerShoreIceGroup'
import { IceRulerShoreIceSludgeGroup } from './IceRulerShoreIceSludgeGroup'
import { IceRulerSludgeGroup } from './IceRulerSludgeGroup'
import { IceRulerWaterOnIceGroup } from './IceRulerWaterOnIceGroup'

type IceRulerGroups = {
  [K in IceRuleGroupsNames]: {
    startLine: IceRulerLineNumber
    endLine: IceRulerLineNumber
    auxLines?: Readonly<Array<IceRulerLineNumber>>
    constructor: Constructor<IceRulerGroup, IceRulerGroupParameters>
    name: string
  }
}

export const iceRulerGroups: IceRulerGroups = {
  error: {
    startLine: 2,
    endLine: 6,
    constructor: IceRulerErrorGroup,
    name: 'Ошибки',
  },
  flangeIce: {
    startLine: 2,
    endLine: 6,
    auxLines: [3],
    constructor: IceRulerFlangeIceGroup,
    name: 'Закраины',
  },
  frazilDrift1: {
    startLine: 2,
    endLine: 3,
    auxLines: [5],
    constructor: IceRulerFrazilDriftGroup,
    name: 'Редкий шугоход',
  },
  frazilDrift2: {
    startLine: 2,
    endLine: 4,
    auxLines: [5],
    constructor: IceRulerFrazilDriftGroup,
    name: 'Средний шугоход',
  },
  frazilDrift3: {
    startLine: 2,
    endLine: 5,
    auxLines: [5],
    constructor: IceRulerFrazilDriftGroup,
    name: 'Густой шугоход',
  },
  freezing: {
    startLine: 2,
    endLine: 6,
    constructor: IceRulerFreezingGroup,
    name: 'Ледостав',
  },
  iceClearing: {
    startLine: 2,
    endLine: 6,
    auxLines: [3, 4, 5],
    constructor: IceRulerIceClearingGroup,
    name: 'Разводья',
  },
  iceDamAbove: {
    startLine: 6,
    endLine: 7,
    constructor: IceRulerIceDamAboveGroup,
    name: 'Зажор выше поста',
  },
  iceDamBelow: {
    startLine: 6,
    endLine: 7,
    constructor: IceRulerIceDamBelowGroup,
    name: 'Зажор ниже поста',
  },
  iceDrift1: {
    startLine: 2,
    endLine: 3,
    constructor: IceRulerIceDriftGroup,
    name: 'Редкий ледоход',
  },
  iceDrift2: {
    startLine: 2,
    endLine: 4,
    constructor: IceRulerIceDriftGroup,
    name: 'Средний ледоход',
  },
  iceDrift3: {
    startLine: 2,
    endLine: 5,
    constructor: IceRulerIceDriftGroup,
    name: 'Густой ледоход',
  },
  iceJamAbove: {
    startLine: 6,
    endLine: 7,
    constructor: IceRulerIceJamAboveGroup,
    name: 'Затор льда выше поста',
  },
  iceJamBelow: {
    startLine: 6,
    endLine: 7,
    constructor: IceRulerIceJamBelowGroup,
    name: 'Затор льда ниже поста',
  },
  iceShove: {
    startLine: 1,
    endLine: 8,
    constructor: IceRulerIceShoveGroup,
    name: 'Подвижка льда',
  },
  none: {
    startLine: 1,
    endLine: 8,
    constructor: IceRulerNoneGroup,
    name: '',
  },
  shoreIce: {
    startLine: 2,
    endLine: 6,
    constructor: IceRulerShoreIceGroup,
    name: 'Заберег',
  },
  shoreIceSludge: {
    startLine: 2,
    endLine: 6,
    constructor: IceRulerShoreIceSludgeGroup,
    name: 'Сало при забереге',
  },
  sludge: {
    startLine: 2,
    endLine: 6,
    constructor: IceRulerSludgeGroup,
    name: 'Сало',
  },
  waterOnIce: {
    startLine: 6,
    endLine: 7,
    constructor: IceRulerWaterOnIceGroup,
    name: 'Вода течет поверх льда',
  },
} as const
