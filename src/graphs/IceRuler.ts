import { Timeline, TimelineSegment } from '../core/Timeline'
import {
  Visualizer,
  VisualizerElement,
  VisualizerGroup,
  VisualizerParameters,
} from '../core/Visualizer'
import { Segmentator } from '../tools/Segmentator'
import { clamp } from '../utils/math'

export type IceRulerFill =
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
  | 'none'

export type IceRulerUpperSign =
  | 'waterOnIce'
  | 'iceJamBelow'
  | 'iceJamAbove'
  | 'iceDamBelow'
  | 'iceDamAbove'

export type IceRulerValue = {
  iceShove?: boolean
  upperSign?: IceRulerUpperSign
}

export interface IceRulerParameters extends VisualizerParameters<IceRulerValue, IceRulerFill> {
  darkColor?: string
  middleColor?: string
  lightColor?: string
  errorColor?: string
}

export type IceRulerLinesNames = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'

export type IceRulerLines = {
  [k in IceRulerLinesNames]: { y: number; height: number }
}

interface IceRulerSaved {
  element: VisualizerElement<IceRulerValue>
  group: VisualizerGroup<IceRulerValue, IceRulerFill>
}

type DamGroups = Array<Array<IceRulerSaved>>

type DamType = 'start' | 'end' | 'intermediate'

interface SpecialRectOptions {
  offset?: number
  stroke?: string | false
  fill?: string | false
}

export class IceRuler extends Visualizer<IceRulerValue, IceRulerFill> {
  public readonly lines: IceRulerLines
  private readonly segmentator: Segmentator

  private readonly drawFunctionsMap: {
    [key in IceRulerFill | IceRulerUpperSign]:
      | IceRuler['drawNone']
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
  private darkColor: string
  private middleColor: string
  private lightColor: string
  private errorColor: string
  private minSegment?: TimelineSegment
  private maxSegment?: TimelineSegment
  private iceDamBelowGroups: DamGroups
  private iceDamAboveGroups: DamGroups

  constructor(parameters: IceRulerParameters) {
    super(parameters)

    this.segmentator = new Segmentator({ scale: 1 })
    this.segmentator.cut('1', 0.5)
    this.segmentator.cut('2', 0.05)
    this.segmentator.cut('3', 1)
    this.segmentator.cut('4', 1)
    this.segmentator.cut('5', 1)
    this.segmentator.cut('6', 1)
    this.segmentator.cut('7', 0.05)
    this.segmentator.cut('8', 1)
    this.segmentator.cut('9', 0.5)

    this.lines = {} as IceRulerLines

    for (let index = 1; index <= 9; index++) {
      this.lines[(index + '') as IceRulerLinesNames] = {
        y: 0,
        height: 0,
      }
    }

    this.drawFunctionsMap = {
      none: this.drawNone,
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

    this.darkColor = parameters.darkColor || 'black'
    this.middleColor = parameters.middleColor || 'black'
    this.lightColor = parameters.lightColor || 'black'
    this.errorColor = parameters.errorColor || '#ea7060'

    this.iceDamBelowGroups = []
    this.iceDamAboveGroups = []
  }

  public override onCreate() {
    super.onCreate()

    const iceDamAbove: Array<IceRulerSaved> = []
    const iceDamBelow: Array<IceRulerSaved> = []

    this.groups.forEach((group) => {
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

    const groupDam = (list: Array<IceRulerSaved>, groups: DamGroups) => {
      let acc = 0

      for (let index = 0; index < list.length; index++) {
        const itemCurrent = list[index]

        if (!groups[acc]) {
          groups[acc] = [itemCurrent]
        }

        if (!list[index - 1]) continue

        const itemPrev = list[index - 1]
        const delta =
          Timeline.getHourSegment(itemCurrent.element.segment).hoursBefore -
          Timeline.getHourSegment(itemPrev.element.segment).hoursBefore

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

    let allElements: Array<VisualizerElement<any>> = []

    this.groups.forEach((g) => {
      allElements = [...allElements, ...g.elements]
    })

    allElements.sort(
      (a, b) =>
        Timeline.getHourSegment(a.segment).hoursBefore -
        Timeline.getHourSegment(b.segment).hoursBefore
    )

    allElements.forEach((el, i) => {
      el.nextSegment = allElements[i + 1]?.segment
    })
  }

  protected override renderWithClip() {
    const { renderer } = this.complexGraph

    renderer.context.lineJoin = 'miter'

    if (this.minSegment && this.maxSegment) {
      renderer.context.save()
      renderer.context.globalAlpha = 0.2
      renderer.context.fillStyle = this.lightColor
      const x = this.complexGraph.calculator.area.x1 + this.minSegment.x1
      const w = this.maxSegment.x2 - this.minSegment.x1
      renderer.context.fillRect(x, this.lines[2].y, w, this.lines[2].height)
      renderer.context.fillRect(x, this.lines[7].y, w, this.lines[7].height)
      renderer.context.restore()
    }

    this.groups.forEach((group) => {
      if (!group.isVisible) return

      group.elements.forEach((element) => {
        this.drawFunctionsMap[group.name](element)

        if (
          element.value.upperSign &&
          element.value.upperSign !== 'iceDamAbove' &&
          element.value.upperSign !== 'iceDamBelow'
        ) {
          this.drawFunctionsMap[element.value.upperSign](element)
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
        element.width =
          (element.nextSegment?.x1 || Timeline.getDaySegment(element.segment).x2) -
          element.segment.x1
        element.x = this.complexGraph.calculator.area.x1 + element.segment.x1

        if (group.name === 'sludge' || group.name === 'shoreIceSludge') {
          element.height = Math.max(
            this.complexGraph.renderer.minSize * 0.003,
            this.lines[4].height * 0.09
          )
          element.y = this.lines[4].y
        } else if (group.name === 'frazilDrift1' || group.name === 'iceDrift1') {
          element.height = this.lines[3].height
          element.y = this.lines[2].y
        } else if (group.name === 'frazilDrift2' || group.name === 'iceDrift2') {
          element.height = this.lines[3].y - this.lines[5].y
          element.y = this.lines[2].y
        } else if (group.name === 'frazilDrift3' || group.name === 'iceDrift3') {
          element.height = this.lines[3].y - this.lines[6].y
          element.y = this.lines[2].y
        } else if (
          group.name === 'freezing' ||
          group.name === 'iceClearing' ||
          group.name === 'flangeIce'
        ) {
          element.height = this.lines[2].y - this.lines[7].y - this.lines[7].height
          element.y = this.lines[2].y
        } else if (group.name === 'shoreIce') {
          element.height = Math.max(
            this.complexGraph.renderer.minSize * 0.003,
            this.lines[2].height
          )
          element.y = this.lines[1].y
        } else if (group.name === 'error') {
          element.height = this.lines[2].y - this.lines[7].y
          element.y = this.lines[2].y
        } else if (group.name === 'none') {
          element.height = this.lines[2].y - this.lines[7].y
          element.y = this.lines[2].y
        }

        element.y -= element.height
      })
    })
  }

  private drawNone() {}

  private drawDamGroups(
    groups: DamGroups,
    d: IceRuler['drawIceDamBelowSign'] | IceRuler['drawIceDamAboveSign']
  ) {
    groups.forEach((g) => {
      g.forEach((item, i) => {
        if (g.length === 1) {
          d(item.element, 'start')
          d(item.element, 'end')
        } else {
          d(item.element, i === g.length - 1 ? 'end' : i === 0 ? 'start' : 'intermediate')
        }
      })
    })
  }

  private drawShoreIce = (element: VisualizerElement<IceRulerValue>) => {
    this.drawRect(element.x, element.y, element.width, element.height, {
      fill: this.darkColor,
    })
    this.drawRect(element.x, this.lines[8].y, element.width, element.height, {
      fill: this.darkColor,
    })
  }

  private drawSludge = (element: VisualizerElement<IceRulerValue>) => {
    this.drawRect(element.x, element.y, element.width, element.height, {
      fill: this.darkColor,
    })
  }

  private drawShoreIceSludge = (element: VisualizerElement<IceRulerValue>) => {
    this.drawRect(element.x, element.y, element.width, element.height, {
      fill: this.darkColor,
    })
  }

  private drawFrazilDrift = (element: VisualizerElement<IceRulerValue>) => {
    const { scene } = this.complexGraph

    const s = Math.ceil(scene.zoom / 5)
    const step = element.width / s

    for (let index = 0; index < s; index++) {
      const x = element.x + step * index
      this.drawRect(x, element.y, step * 0.3, element.height, { fill: this.lightColor })
    }
  }

  private drawIceDrift1 = (element: VisualizerElement<IceRulerValue>) => {
    this.drawRect(element.x, element.y, element.width, element.height, {
      fill: this.lightColor,
    })
  }

  private drawIceDrift2 = (element: VisualizerElement<IceRulerValue>) => {
    this.drawRect(element.x, element.y, element.width, element.height, {
      fill: this.lightColor,
    })
  }

  private drawIceDrift3 = (element: VisualizerElement<IceRulerValue>) => {
    this.drawRect(element.x, element.y, element.width, element.height, {
      fill: this.lightColor,
    })
  }

  private drawFreezing = (element: VisualizerElement<IceRulerValue>) => {
    this.drawRect(element.x, element.y, element.width, element.height, {
      fill: this.lightColor,
    })
  }

  private drawFlangeIce = (element: VisualizerElement<IceRulerValue>) => {
    const clipSize = this.lines[3].height

    this.drawRect(element.x, element.y, element.width, element.height - clipSize, {
      fill: this.lightColor,
    })

    this.drawRect(element.x, element.y + element.height - clipSize, element.width, clipSize - 1, {
      stroke: this.lightColor,
    })
  }

  private drawIceClearing = (element: VisualizerElement<IceRulerValue>) => {
    const clipSize = this.lines[3].height

    this.drawRect(element.x, element.y, element.width, element.height - clipSize * 3, {
      fill: this.lightColor,
    })

    this.drawRect(element.x, element.y + element.height - clipSize * 3, element.width, clipSize, {
      stroke: this.lightColor,
    })

    this.drawRect(element.x, element.y + element.height - clipSize * 2, element.width, clipSize, {
      fill: this.lightColor,
    })

    this.drawRect(element.x, element.y + element.height - clipSize, element.width, clipSize - 1, {
      stroke: this.lightColor,
    })
  }

  private drawIceShove = (element: VisualizerElement<IceRulerValue>) => {
    const { renderer, calculator } = this.complexGraph

    const w = Math.min(calculator.area.width * 0.001, renderer.minSize * 0.01)
    const x = element.x + element.width / 2 - w / 2
    const y = this.lines[9].y
    const h = this.lines[1].y - this.lines[9].y + this.lines[1].height

    this.drawRect(x, y, w, h, { fill: this.darkColor })
  }

  private drawError = (element: VisualizerElement<IceRulerValue>) => {
    const { renderer, scene } = this.complexGraph

    renderer.context.strokeStyle = this.errorColor
    renderer.context.lineWidth = 1 / renderer.pixelRatio

    const s = Math.ceil(scene.zoom / 4)
    const step = element.width / s

    const h = element.height / 2

    for (let index = 0; index < s; index++) {
      renderer.context.beginPath()
      const x = element.x + 1
      renderer.context.moveTo(x + step * index, element.y)
      renderer.context.lineTo(x + step * (index + 0.85), element.y + h)

      renderer.context.moveTo(x + step * (index + 0.85), element.y)
      renderer.context.lineTo(x + step * index, element.y + h)

      renderer.context.moveTo(x + step * index, element.y + h)
      renderer.context.lineTo(x + step * (index + 0.85), element.y + h * 2)

      renderer.context.moveTo(x + step * (index + 0.85), element.y + h)
      renderer.context.lineTo(x + step * index, element.y + h * 2)

      renderer.context.stroke()
    }
  }

  private drawWaterOnIceSign = (element: VisualizerElement<IceRulerValue>) => {
    this.drawSpecialRect(element, this.lines[8], { stroke: this.lightColor })
  }

  private drawIceJamBelowSign = (element: VisualizerElement<IceRulerValue>) => {
    this.drawIceJam(element, true)
  }

  private drawIceJamAboveSign = (element: VisualizerElement<IceRulerValue>) => {
    this.drawIceJam(element, false)
  }

  private drawIceJam(element: VisualizerElement<IceRulerValue>, r: boolean = false) {
    const { calculator } = this.complexGraph

    const x = element.x + element.width / 2
    const y = this.lines[8].y
    const s = clamp(
      calculator.area.width * 0.001 + calculator.area.width * 0.0001,
      1,
      this.row.height * 0.12
    )
    const o = this.lines[8].height - s

    this.drawTriangle(x, y + o, s, this.middleColor, r)
  }

  private drawIceDamBelowSign = (
    element: VisualizerElement<IceRulerValue>,
    type: DamType = 'start'
  ) => {
    const { renderer } = this.complexGraph

    const { x, s, y } = this.setupDam(element, type)

    if (type !== 'intermediate') {
      renderer.context.beginPath()
      renderer.context.moveTo(x - s, y + s)
      renderer.context.lineTo(x, y)
      renderer.context.lineTo(x + s, y + s)
      renderer.context.stroke()

      this.drawTriangle(x, y - s, s, this.middleColor, true)
    }
  }

  private drawIceDamAboveSign = (
    element: VisualizerElement<IceRulerValue>,
    type: DamType = 'start'
  ) => {
    const { renderer } = this.complexGraph

    const { x, s, y } = this.setupDam(element, type)

    if (type !== 'intermediate') {
      renderer.context.beginPath()
      renderer.context.moveTo(x - s, y - s)
      renderer.context.lineTo(x, y)
      renderer.context.lineTo(x + s, y - s)
      renderer.context.stroke()

      this.drawTriangle(x, y, s, this.middleColor)
    }
  }

  private setupDam = (element: VisualizerElement<IceRulerValue>, type: DamType) => {
    const { calculator, renderer } = this.complexGraph

    const s =
      clamp(
        calculator.area.width * 0.001 + calculator.area.width * 0.0001,
        1,
        this.row.height * 0.12
      ) / 2

    const x = element.x + (type === 'end' ? element.width : 0) + (type === 'end' ? s * -1 : s)
    const o1 = this.lines[8].height - s
    const y = this.lines[8].y + o1
    const offset = s * 3

    renderer.context.strokeStyle = this.middleColor
    renderer.context.save()
    renderer.context.beginPath()
    renderer.context.setLineDash([10])
    renderer.context.moveTo(element.x + offset, y)
    renderer.context.lineTo(element.x + element.width - offset, y)
    renderer.context.stroke()
    renderer.context.restore()

    return { x, y, s }
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
  }

  private drawSpecialRect(
    element: VisualizerElement<IceRulerValue>,
    line: IceRulerLines[IceRulerLinesNames],
    options: SpecialRectOptions = {}
  ) {
    const x = element.x
    const w = element.width
    const h = line.height
    const y = line.y + h * (options.offset || 0)

    this.drawRect(x, y, w, h, options)
  }

  private drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    { stroke = false, fill = false }: SpecialRectOptions = {}
  ) {
    const { renderer } = this.complexGraph

    if (fill) {
      renderer.context.fillStyle = fill
      renderer.context.fillRect(x, y, w + 1, h)
    }

    if (stroke) {
      renderer.context.strokeStyle = stroke
      renderer.context.strokeRect(x, y, w, h)
    }
  }
}
