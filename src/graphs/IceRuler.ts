import { TimelineDay, TimelineHour, TimelineMonth, TimelineSegment } from '../core/Timeline'
import {
  Visualizer,
  VisualizerElement,
  VisualizerGroup,
  VisualizerParameters,
} from '../core/Visualizer'
import { Segmentator } from '../tools/Segmentator'
import { clamp } from '../utils/math'
import { pointRectCollision } from '../utils/pointRectCollision'
import { XY } from '../utils/ts'

export type IceRulerGroupsNames =
  | 'sludge'
  | 'shoreIce'
  | 'shoreIceSludge'
  | 'frazilDrift1'
  | 'frazilDrift2'
  | 'frazilDrift3'
  | 'iceDrift1'
  | 'iceDrift2'
  | 'iceDrift3'
  | 'freezing'
  | 'flangeIce'
  | 'iceClearing'
  | 'error'

export type IceRulerValueUpperSign =
  | 'waterOnIce'
  | 'iceJamBelow'
  | 'iceJamAbove'
  | 'iceDamBelow'
  | 'iceDamAbove'

export type IceRulerValue = {
  iceShove?: boolean
  upperSign?: IceRulerValueUpperSign
  text?: Array<string>
}

export interface IceRulerParameters
  extends VisualizerParameters<IceRulerValue, IceRulerGroupsNames> {
  strokeColor?: string
  rectInsideColor?: string
}

export type IceRulerLinesNames = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'

export type IceRulerLines = {
  [k in IceRulerLinesNames]: { y: number; height: number }
}

interface IceRulerSaved {
  element: VisualizerElement<IceRulerValue>
  group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
}

type DamGroups = Array<Array<IceRulerSaved>>

export class IceRuler extends Visualizer<IceRulerValue, IceRulerGroupsNames> {
  private readonly segmentator: Segmentator
  private readonly lines: IceRulerLines
  private lineWidth: number

  private readonly drawFunctionsMap: {
    [key in IceRulerGroupsNames | IceRulerValueUpperSign]:
      | IceRuler['drawError']
      | IceRuler['drawFlangeIce']
      | IceRuler['drawFrazilDrift']
      | IceRuler['drawFreezing']
      | IceRuler['drawIceClearing']
      | IceRuler['drawIceDrift1']
      | IceRuler['drawIceDrift2']
      | IceRuler['drawIceDrift3']
      | IceRuler['drawShoreIce']
      | IceRuler['drawShoreIceSludge']
      | IceRuler['drawSludge']
      | IceRuler['drawIceDamAboveSign']
      | IceRuler['drawIceDamBelowSign']
      | IceRuler['drawIceJamAboveSign']
      | IceRuler['drawIceJamBelowSign']
      | IceRuler['drawWaterOnIceSign']
  }
  private strokeColor: string
  private rectInsideColor: string
  private minSegment?: TimelineSegment
  private maxSegment?: TimelineSegment
  private iceDamBelowGroups: DamGroups
  private iceDamAboveGroups: DamGroups

  constructor(parameters: IceRulerParameters) {
    super(parameters)

    this.segmentator = new Segmentator({ scale: 1 })
    this.segmentator.cut('1', 0.5)
    this.segmentator.cut('2', 0.2)
    this.segmentator.cut('3', 1)
    this.segmentator.cut('4', 1)
    this.segmentator.cut('5', 1)
    this.segmentator.cut('6', 1)
    this.segmentator.cut('7', 1)
    this.segmentator.cut('8', 0.2)
    this.segmentator.cut('9', 1)
    this.segmentator.cut('10', 0.5)

    this.lines = {} as IceRulerLines

    for (let index = 1; index <= 10; index++) {
      this.lines[(index + '') as IceRulerLinesNames] = {
        y: 0,
        height: 0,
      }
    }

    this.drawFunctionsMap = {
      error: this.drawError,
      flangeIce: this.drawFlangeIce,
      frazilDrift1: this.drawFrazilDrift,
      frazilDrift2: this.drawFrazilDrift,
      frazilDrift3: this.drawFrazilDrift,
      freezing: this.drawFreezing,
      iceClearing: this.drawIceClearing,
      iceDamAbove: this.drawIceDamAboveSign,
      iceDamBelow: this.drawIceDamBelowSign,
      iceDrift1: this.drawIceDrift1,
      iceDrift2: this.drawIceDrift2,
      iceDrift3: this.drawIceDrift3,
      iceJamAbove: this.drawIceJamAboveSign,
      iceJamBelow: this.drawIceJamBelowSign,
      shoreIce: this.drawShoreIce,
      shoreIceSludge: this.drawShoreIceSludge,
      sludge: this.drawSludge,
      waterOnIce: this.drawWaterOnIceSign,
    }

    this.strokeColor = parameters.strokeColor || 'black'
    this.rectInsideColor = parameters.rectInsideColor || 'black'

    this.lineWidth = 0

    this.iceDamBelowGroups = []
    this.iceDamAboveGroups = []
  }

  public override onCreate() {
    super.onCreate()

    const iceDamAbove: Array<IceRulerSaved> = []
    const iceDamBelow: Array<IceRulerSaved> = []

    this.groups.forEach((group) => {
      if (group.name === 'sludge') return

      group.elements.forEach((element) => {
        if (!this.minSegment) {
          this.minSegment = element.segment
        } else {
          this.minSegment =
            element.segment.x1Normalized < this.minSegment.x1Normalized
              ? element.segment
              : this.minSegment
        }

        if (!this.maxSegment) {
          this.maxSegment = element.segment
        } else {
          this.maxSegment =
            element.segment.x1Normalized > this.maxSegment.x1Normalized
              ? element.segment
              : this.maxSegment
        }

        if (element.value.upperSign === 'iceDamAbove') {
          iceDamAbove.push({
            element,
            group,
          })
        } else if (element.value.upperSign === 'iceDamBelow') {
          iceDamBelow.push({
            element,
            group,
          })
        }
      })
    })

    const getHourSegment = (element: VisualizerElement<IceRulerValue>): TimelineHour => {
      if (element.segment instanceof TimelineDay) {
        return element.segment.hours[0]
      } else if (element.segment instanceof TimelineMonth) {
        return element.segment.days[0].hours[0]
      }

      return element.segment as TimelineHour
    }

    const groupDam = (list: Array<IceRulerSaved>, groups: DamGroups) => {
      const sort = (r: Array<IceRulerSaved>) => {
        r.sort((a, b) => {
          return getHourSegment(a.element).hoursBefore - getHourSegment(b.element).hoursBefore
        })
      }

      sort(list)

      let acc = 0

      for (let index = 0; index < list.length; index++) {
        const itemCurrent = list[index]

        if (!groups[acc]) {
          groups[acc] = [itemCurrent]
        }

        if (!list[index - 1]) continue

        const itemPrev = list[index - 1]
        const delta =
          getHourSegment(itemCurrent.element).hoursBefore -
          getHourSegment(itemPrev.element).hoursBefore

        if (delta === 23 || delta === 1) {
          groups[acc].push(itemCurrent)
        } else {
          acc++
          groups[acc] = [itemCurrent]
        }
      }
    }

    groupDam(iceDamAbove, this.iceDamAboveGroups)
    groupDam(iceDamBelow, this.iceDamBelowGroups)

    this.complexGraph.events.listen('mousemove', this.handleMouseMove)
  }

  public override onDestroy(): void {
    this.complexGraph.events.unlisten('mousemove', this.handleMouseMove)
  }

  protected override renderWithClip() {
    const { renderer } = this.complexGraph

    this.lineWidth = 1

    renderer.context.lineJoin = 'miter'

    if (this.minSegment && this.maxSegment) {
      renderer.context.fillStyle = this.strokeColor
      const x = this.complexGraph.calculator.area.x1 + this.minSegment.x1
      const w = this.maxSegment.x2 - this.minSegment.x1
      renderer.context.fillRect(x, this.lines[2].y, w, this.lines[2].height)
      renderer.context.fillRect(x, this.lines[8].y, w, this.lines[8].height)
    }

    this.groups.forEach((group) => {
      if (!group.isVisible) return

      group.elements.forEach((element) => {
        this.drawFunctionsMap[group.name](element, group)

        if (
          element.value.upperSign &&
          element.value.upperSign !== 'iceDamAbove' &&
          element.value.upperSign !== 'iceDamBelow'
        ) {
          this.drawFunctionsMap[element.value.upperSign](element, group)
        }
      })
    })

    this.groups.forEach((group) => {
      if (!group.isVisible) return
      group.elements.forEach((element) => {
        if (element.value.iceShove) {
          this.drawIceShove(element)
        }
      })
    })

    this.drawDamGroups(this.iceDamAboveGroups, this.drawFunctionsMap.iceDamAbove)
    this.drawDamGroups(this.iceDamBelowGroups, this.drawFunctionsMap.iceDamBelow)
  }

  protected override calclulateMinMax() {
    this.min = 0
    this.max = 6
  }

  protected resizeElements() {
    for (const key in this.lines) {
      const line = this.lines[key as IceRulerLinesNames]
      line.height = this.row.height * this.segmentator.get(key).s
      line.y = this.row.y2 - this.row.height * this.segmentator.get(key).a - line.height
    }

    this.groups.forEach((group) => {
      if (!group.isVisible) return
      group.elements.forEach((element) => {
        element.width = element.segment.width
        element.x = this.complexGraph.calculator.area.x1 + element.segment.x1

        if (group.name === 'sludge' || group.name === 'shoreIceSludge') {
          element.height = this.lines[4].height
          element.y = this.lines[4].y
        } else if (group.name === 'frazilDrift1') {
          element.height = this.lines[3].height
          element.y = this.lines[2].y
        } else if (group.name === 'frazilDrift2') {
          element.height = this.lines[3].y - this.lines[5].y
          element.y = this.lines[2].y
        } else if (group.name === 'frazilDrift3') {
          element.height = this.lines[3].y - this.lines[6].y
          element.y = this.lines[2].y
        } else if (group.name === 'iceDrift1') {
          element.height = this.lines[3].y - this.lines[5].y
          element.y = this.lines[2].y
        } else if (group.name === 'iceDrift2') {
          element.height = this.lines[3].y - this.lines[6].y
          element.y = this.lines[2].y
        } else if (group.name === 'iceDrift3') {
          element.height = this.lines[3].y - this.lines[7].y
          element.y = this.lines[2].y
        } else if (group.name === 'freezing') {
          element.height = this.lines[2].y - this.lines[8].y - this.lines[8].height
          element.y = this.lines[2].y
        } else if (group.name === 'iceClearing') {
          element.height = this.lines[2].y - this.lines[4].y
          element.y = this.lines[2].y
        } else if (group.name === 'flangeIce') {
          element.height = this.lines[3].height
          element.y = this.lines[2].y
        }

        element.y -= element.height
      })
    })
  }

  private handleMouseMove = (_mouse: XY, mouseZoomed: XY) => {
    let collisionsCount = 0
    this.groups.forEach((g) => {
      g.elements.forEach((item) => {
        if (item.value.text && pointRectCollision(mouseZoomed, item)) {
          collisionsCount++
          this.complexGraph.tooltip.show(item.value.text.join(','))
        }
      })
    })

    if (!collisionsCount) {
      this.complexGraph.tooltip.hide()
    }
  }

  private drawDamGroups(
    groups: DamGroups,
    d: IceRuler['drawIceDamBelowSign'] | IceRuler['drawIceDamAboveSign']
  ) {
    groups.forEach((g) => {
      g.forEach((item, i) => {
        if (g.length === 1) {
          d(item.element, item.group, 'start')
          d(item.element, item.group, 'end')
        } else {
          d(
            item.element,
            item.group,
            i === g.length - 1 ? 'end' : i === 0 ? 'start' : 'intermediate'
          )
        }
      })
    })
  }

  private drawSludge = () =>
    // element: VisualizerElement<IceRulerValue>,
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
    {}

  private drawShoreIce = () =>
    // element: VisualizerElement<IceRulerValue>,
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
    {}

  private drawShoreIceSludge = (element: VisualizerElement<IceRulerValue>) => {
    this.drawRect(element.x, element.y, element.width, element.height * 0.1, this.strokeColor)
  }

  private drawFrazilDrift = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    const w = element.width * 0.2

    for (let index = 0; index < 3; index++) {
      const x = element.x + ((element.width - w * 2) / 2) * index
      this.drawRect(x, element.y, w, element.height, group.color)
    }
  }

  private drawIceDrift1 = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    this.drawRect(element.x, element.y, element.width, element.height, group.color)
  }

  private drawIceDrift2 = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    this.drawRect(element.x, element.y, element.width, element.height, group.color)
  }

  private drawIceDrift3 = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    this.drawRect(element.x, element.y, element.width, element.height, group.color)
    this.drawSpecialRect(element, group, this.lines[7])
  }

  private drawFreezing = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    this.drawRect(element.x, element.y, element.width, element.height, group.color)
  }

  private drawFlangeIce = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    this.drawSpecialRect(element, group, this.lines[3])
  }

  private drawIceClearing = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    this.drawSpecialRect(element, group, this.lines[3])
    this.drawSpecialRect(element, group, this.lines[4])
  }

  private drawIceShove = (element: VisualizerElement<IceRulerValue>) => {
    const { renderer } = this.complexGraph

    const w = Math.min(element.width * 0.2, renderer.minSize * 0.03)
    const x = element.x + element.width / 2 - w / 2
    const y = this.lines[10].y
    const h = this.lines[1].y - this.lines[10].y + this.lines[1].height

    this.drawRect(x, y, w, h, this.strokeColor)
  }

  private drawError = () =>
    // element: VisualizerElement<IceRulerValue>
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
    {}

  private drawWaterOnIceSign = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    this.drawSpecialRect(element, group, this.lines[9])
  }

  private drawIceJamBelowSign = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    this.drawIceJam(element, group, true)
  }

  private drawIceJamAboveSign = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    this.drawIceJam(element, group, false)
  }

  private drawIceJam(
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>,
    r: boolean = false
  ) {
    const { calculator } = this.complexGraph

    const x = element.x + element.width / 2
    const y = this.lines[9].y
    const s = clamp(
      calculator.area.width * 0.001 + calculator.area.width * 0.0001,
      1,
      this.row.height * 0.12
    )
    const o = this.lines[9].height - s

    this.drawTriangle(x, y + o, s, group.color, r)
  }

  private drawIceDamBelowSign = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>,
    type: 'start' | 'end' | 'intermediate' = 'start'
  ) => {
    const { renderer } = this.complexGraph

    const { x, s, y, offset } = this.setupDam(element, type)

    renderer.context.beginPath()
    renderer.context.moveTo(element.x + offset, y)
    renderer.context.lineTo(element.x + element.width - offset, y)
    renderer.context.stroke()

    if (type !== 'intermediate') {
      renderer.context.beginPath()
      renderer.context.moveTo(x - s, y + s)
      renderer.context.lineTo(x, y)
      renderer.context.lineTo(x + s, y + s)
      renderer.context.stroke()

      this.drawTriangle(x, y - s, s, group.color, true)
    }
  }

  private drawIceDamAboveSign = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>,
    type: 'start' | 'end' | 'intermediate' = 'start'
  ) => {
    const { renderer } = this.complexGraph

    const { x, s, y, offset } = this.setupDam(element, type)

    renderer.context.beginPath()
    renderer.context.moveTo(element.x + offset, y)
    renderer.context.lineTo(element.x + element.width - offset, y)
    renderer.context.stroke()

    if (type !== 'intermediate') {
      renderer.context.beginPath()
      renderer.context.moveTo(x - s, y - s)
      renderer.context.lineTo(x, y)
      renderer.context.lineTo(x + s, y - s)
      renderer.context.stroke()

      this.drawTriangle(x, y, s, group.color)
    }
  }

  private setupDam = (
    element: VisualizerElement<IceRulerValue>,
    type: 'start' | 'end' | 'intermediate'
  ) => {
    const { calculator, renderer } = this.complexGraph

    renderer.context.strokeStyle = this.strokeColor
    const s =
      clamp(
        calculator.area.width * 0.001 + calculator.area.width * 0.0001,
        1,
        this.row.height * 0.12
      ) / 2

    const x = element.x + (type === 'end' ? element.width : 0) + (type === 'end' ? s * -1 : s)
    const o1 = this.lines[9].height - s
    const y = this.lines[9].y + o1
    const offset = element.width * 0.25

    return { x, y, s, offset }
  }

  private drawTriangle(
    x: number,
    y: number,
    s: number,
    color: string = 'black',
    r: boolean = false
  ) {
    const { renderer } = this.complexGraph

    renderer.context.fillStyle = color
    renderer.context.strokeStyle = this.strokeColor
    renderer.context.beginPath()
    if (r) {
      renderer.context.moveTo(x, y + s)
      renderer.context.lineTo(x - s, y)
      renderer.context.lineTo(x + s, y)
      renderer.context.lineTo(x, y + s)
    } else {
      renderer.context.moveTo(x, y)
      renderer.context.lineTo(x - s, y + s)
      renderer.context.lineTo(x + s, y + s)
      renderer.context.lineTo(x, y)
    }
    renderer.context.fill()
    renderer.context.stroke()
  }

  private drawSpecialRect(
    element: VisualizerElement<IceRulerValue>,
    _group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>,
    line: IceRulerLines[IceRulerLinesNames],
    offset = 0
  ) {
    const { renderer } = this.complexGraph

    renderer.context.strokeStyle = this.strokeColor
    renderer.context.fillStyle = this.rectInsideColor
    renderer.context.lineWidth = this.lineWidth

    const lw = this.lineWidth / 2

    const x = element.x
    const w = element.width - lw
    const h = line.height - lw
    const y = line.y + h * offset

    renderer.context.fillRect(x + lw, y + lw, w - this.lineWidth, h - this.lineWidth)
    renderer.context.strokeRect(x + lw, y + lw, w - lw, h - lw)
  }

  private drawRect(x: number, y: number, w: number, h: number, color: string = 'black') {
    const { renderer } = this.complexGraph

    const lw = this.lineWidth / 2
    renderer.context.strokeStyle = this.strokeColor
    renderer.context.fillStyle = color
    renderer.context.lineWidth = 1

    renderer.context.fillRect(x + lw, y + lw, w - this.lineWidth, h - this.lineWidth)
    renderer.context.strokeRect(x + lw, y + lw, w - lw, h - lw)
  }
}
