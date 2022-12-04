import { IceRuler, IceRulerData } from './IceRuler'

export function createIceRulerGraph(data: IceRulerData) {
  new IceRuler({
    name: 'Ледовая линейка',
    row: 3,
    rowFactor: 0.3,
    data,
  })
}
