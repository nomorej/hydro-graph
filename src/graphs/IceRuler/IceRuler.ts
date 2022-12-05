import { TimelineSegmentDateWithTime } from '../../core/Timeline'
import { Segmentator } from '../../tools/Segmentator'
import { Range } from '../../utils/ts'
import { Visualizer, VisualizerParameters } from '../../visualizer'
import { VisualizerElement } from '../../visualizer/VisualizerElement'
import { iceRulerGroups } from './groups'
import { IceRulerGroup } from './IceRulerGroup'

export enum IceRulerFills {
  none,
  sludge,
  shoreIceSludge,
  shoreIce,
  iceDrift1,
  iceDrift2,
  iceDrift3,
  iceClearing,
  freezing,
  frazilDrift1,
  frazilDrift2,
  frazilDrift3,
  flangeIce,
  error,
}

export enum IceRulerUpperSigns {
  waterOnIce = 1,
  iceJamBelow,
  iceJamAbove,
  iceDamBelow,
  iceDamAbove,
}

export type IceRuleGroupsNames =
  | keyof typeof IceRulerFills
  | keyof typeof IceRulerUpperSigns
  | 'iceShove'

export interface IceRulerLine {
  y: number
}

export interface IceRulerItemData {
  localTime: TimelineSegmentDateWithTime
  obsTime: TimelineSegmentDateWithTime
  fill: IceRulerFills
  upperSign: IceRulerUpperSigns | 0 | false
  iceShove: boolean
  waterState: number
  text: Array<string>
}

export type IceRulerData = Array<IceRulerItemData>

export interface IceRulerParameters extends VisualizerParameters {
  data: IceRulerData
}

export type IceRulerLineNumber = Exclude<Range<9>, 0>

export class IceRuler extends Visualizer<IceRulerGroup> {
  public readonly lines: Array<IceRulerLine>
  private readonly segmentator: Segmentator<IceRulerLineNumber>

  constructor(parameters: IceRulerParameters) {
    super(parameters)

    this.segmentator = new Segmentator({ scale: 1 })
    this.segmentator.cut(1, 0)
    this.segmentator.cut(2, 1)
    this.segmentator.cut(3, 1)
    this.segmentator.cut(4, 1)
    this.segmentator.cut(5, 1)
    this.segmentator.cut(6, 1)
    this.segmentator.cut(7, 1)
    this.segmentator.cut(8, 0)

    this.lines = []

    for (let index = 0; index < this.segmentator.segments.size; index++) {
      this.lines[index] = { y: 0 }
    }

    const sortedData: Map<IceRuleGroupsNames, Array<VisualizerElement<undefined>>> = new Map()

    parameters.data.sort((a, b) => new Date(a.obsTime).getTime() - new Date(b.obsTime).getTime())

    parameters.data.forEach((d, di) => {
      const startSegment = this.complexGraph.timeline.segments.find((s) => s.date === d.obsTime)

      if (!startSegment) {
        throw new Error(`[IceRuler] Сегмент с датой ${d.obsTime} не найден.`)
      }

      const nextD = parameters.data[di + 1]
      const endSegment = nextD
        ? this.complexGraph.timeline.segments.find((s) => s.date === nextD.obsTime) ||
          startSegment.nextDaySegment
        : startSegment.nextDaySegment

      const key = IceRulerFills[d.fill] as IceRuleGroupsNames

      if (!sortedData.has(key)) {
        sortedData.set(key, [])
      }

      if (d.iceShove) {
        if (!sortedData.has('iceShove')) {
          sortedData.set('iceShove', [])
        }
        const element = new VisualizerElement<undefined>({
          startSegment,
          endSegment,
          comment: d.text,
          value: undefined,
        })

        sortedData.get('iceShove')!.push(element)
      }

      if (d.upperSign) {
        const signKey = IceRulerUpperSigns[d.upperSign] as IceRuleGroupsNames

        if (!sortedData.has(signKey)) {
          sortedData.set(signKey, [])
        }

        const element = new VisualizerElement<undefined>({
          startSegment,
          endSegment,
          comment: d.text,
          value: undefined,
        })

        sortedData.get(signKey)!.push(element)
      }

      const element = new VisualizerElement<undefined>({
        startSegment,
        endSegment,
        comment: d.text,
        value: undefined,
      })

      sortedData.get(key)!.push(element)
    })

    sortedData.forEach((v, k) => {
      new iceRulerGroups[k].constructor({
        name: iceRulerGroups[k].name,
        elements: v,
        startLine: this.lines[iceRulerGroups[k].startLine - 1],
        endLine: this.lines[iceRulerGroups[k].endLine - 1],
        auxLines: iceRulerGroups[k].auxLines?.map((ln) => this.lines[ln - 1]),
        color: k === 'error' ? 'red' : '#333333',
      })
    })
  }

  public override onRender() {
    for (let index = 0; index < this.lines.length; index++) {
      const s = this.segmentator.get((index + 1) as IceRulerLineNumber)
      this.lines[index].y = this.row.y2 - this.row.height * (s.a + s.s / 2)
      this.lines[index].y = Math.floor(this.lines[index].y) + 0.5
    }

    console.log(this.segmentator)

    const { renderer } = this.complexGraph

    renderer.context.lineWidth = 1 / renderer.pixelRatio

    renderer.context.strokeStyle = '#cccccc'

    renderer.context.beginPath()
    renderer.context.moveTo(this.row.x1, this.lines[1].y)
    renderer.context.lineTo(this.row.x2, this.lines[1].y)
    renderer.context.stroke()

    renderer.context.beginPath()
    renderer.context.moveTo(this.row.x1, this.lines[5].y)
    renderer.context.lineTo(this.row.x2, this.lines[5].y)
    renderer.context.stroke()

    super.onRender()
  }
}
