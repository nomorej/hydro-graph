import { TimelineSegment } from '../core/Timeline'
import {
  Visualizer,
  VisualizerElement,
  VisualizerGroup,
  VisualizerParameters,
} from '../core/Visualizer'
import { Segmentator } from '../tools/Segmentator'
import { clamp } from '../utils/math'

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
  fillColor?: string
  rectInsideColor?: string
}

export type IceRulerLinesNames = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'

export type IceRulerLines = {
  [k in IceRulerLinesNames]: { y: number; height: number }
}

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
  private fillColor: string
  private rectInsideColor: string
  private minSegment?: TimelineSegment
  private maxSegment?: TimelineSegment

  constructor(parameters: IceRulerParameters) {
    super(parameters)

    this.segmentator = new Segmentator({ scale: 1 })
    this.segmentator.cut('1', 0.2)
    this.segmentator.cut('2', 1)
    this.segmentator.cut('3', 1)
    this.segmentator.cut('4', 1)
    this.segmentator.cut('5', 1)
    this.segmentator.cut('6', 1)
    this.segmentator.cut('7', 0.2)
    this.segmentator.cut('8', 1)

    this.lines = {} as IceRulerLines

    for (let index = 1; index <= 8; index++) {
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
    this.fillColor = parameters.fillColor || 'black'
    this.rectInsideColor = parameters.rectInsideColor || 'black'

    this.lineWidth = 0
  }

  public override onCreate() {
    super.onCreate()
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
      })
    })
  }

  protected override renderWithClip() {
    const { renderer, scene } = this.complexGraph

    this.lineWidth = 1 + this.row.height * 0.005 * clamp(scene.zoom, 0, 3)

    renderer.context.lineJoin = 'miter'

    if (this.minSegment && this.maxSegment) {
      renderer.context.fillStyle = this.strokeColor
      const x = this.complexGraph.calculator.area.x1 + this.minSegment.x1
      const w = this.maxSegment.x2 - this.minSegment.x1
      renderer.context.fillRect(x, this.lines[1].y, w, this.lines[1].height)
      renderer.context.fillRect(x, this.lines[7].y, w, this.lines[7].height)
    }

    this.groups.forEach((group) => {
      if (!group.isVisible) return
      group.elements.forEach((element) => {
        this.drawFunctionsMap[group.name](element, group)
        if (element.value.upperSign) {
          this.drawFunctionsMap[element.value.upperSign](element, group)
        }
      })
    })

    this.groups.forEach((group) => {
      if (!group.isVisible) return
      group.elements.forEach((element) => {
        if (element.value.iceShove) {
          this.drawIceShove(element, group)
        }
      })
    })
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
          element.height = this.lines[3].height
          element.y = this.lines[3].y
        } else if (group.name === 'frazilDrift1') {
          element.height = this.lines[2].height
          element.y = this.lines[1].y
        } else if (group.name === 'frazilDrift2') {
          element.height = this.lines[2].y - this.lines[4].y
          element.y = this.lines[1].y
        } else if (group.name === 'frazilDrift3') {
          element.height = this.lines[2].y - this.lines[5].y
          element.y = this.lines[1].y
        } else if (group.name === 'iceDrift1') {
          element.height = this.lines[2].y - this.lines[4].y
          element.y = this.lines[1].y
        } else if (group.name === 'iceDrift2') {
          element.height = this.lines[2].y - this.lines[5].y
          element.y = this.lines[1].y
        } else if (group.name === 'iceDrift3') {
          element.height = this.lines[2].y - this.lines[6].y
          element.y = this.lines[1].y
        } else if (group.name === 'freezing') {
          element.height = this.lines[1].y - this.lines[7].y - this.lines[7].height
          element.y = this.lines[1].y
        }

        element.y -= element.height
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

  private drawShoreIceSludge = (
    element: VisualizerElement<IceRulerValue>
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    const { renderer } = this.complexGraph

    renderer.context.fillStyle = this.strokeColor
    renderer.context.fillRect(element.x, element.y, element.width, element.height * 0.2)
  }

  private drawFrazilDrift = (
    element: VisualizerElement<IceRulerValue>
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    const { renderer } = this.complexGraph

    renderer.context.fillStyle = this.strokeColor

    const w = element.width * 0.2

    for (let index = 0; index < 3; index++) {
      const x = element.x + ((element.width - w * 2) / 2) * index
      renderer.context.fillRect(x, element.y, w, element.height)
    }
  }

  private drawIceDrift1 = (
    element: VisualizerElement<IceRulerValue>
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    const { renderer } = this.complexGraph

    renderer.context.fillStyle = this.fillColor
    renderer.context.fillRect(element.x, element.y, element.width, element.height)
    renderer.context.fillStyle = this.fillColor
    renderer.context.fillRect(
      element.x,
      element.y - this.lines[4].height,
      this.lineWidth,
      element.height + this.lines[4].height
    )
  }

  private drawIceDrift2 = (
    element: VisualizerElement<IceRulerValue>
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    const { renderer } = this.complexGraph

    renderer.context.fillStyle = this.fillColor

    renderer.context.fillRect(element.x, element.y, element.width, element.height)
  }

  private drawIceDrift3 = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    const { renderer } = this.complexGraph

    renderer.context.fillStyle = this.fillColor

    renderer.context.fillRect(element.x, element.y, element.width, element.height)
    this.drawSpecialRect(element, group, this.lines[6])
  }

  private drawFreezing = (
    element: VisualizerElement<IceRulerValue>
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    const { renderer } = this.complexGraph

    renderer.context.fillStyle = this.fillColor

    renderer.context.fillRect(element.x, element.y, element.width, element.height)
  }

  private drawFlangeIce = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    this.drawSpecialRect(element, group, this.lines[2])
  }

  private drawIceClearing = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    this.drawSpecialRect(element, group, this.lines[2])
    this.drawSpecialRect(element, group, this.lines[3])
  }

  private drawIceShove = (
    element: VisualizerElement<IceRulerValue>,
    _group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    const { renderer } = this.complexGraph
    renderer.context.fillStyle = this.strokeColor

    const offset = this.row.height * 0.1

    const w = Math.min(element.width * 0.2, renderer.minSize * 0.03)
    const x = element.x + element.width / 2 - w / 2
    const y = this.row.y1 - offset
    const h = this.row.height + offset * 2

    renderer.context.fillRect(x, y, w, h)
  }

  private drawError = () =>
    // element: VisualizerElement<IceRulerValue>
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
    {}

  private drawWaterOnIceSign = (
    element: VisualizerElement<IceRulerValue>,
    group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    this.drawSpecialRect(element, group, this.lines[8])
  }

  private drawIceJamBelowSign = (
    element: VisualizerElement<IceRulerValue>
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    const { renderer } = this.complexGraph

    const w = Math.min(element.width * 0.2, renderer.minSize * 0.02)
    const x = element.x + element.width / 2
    const y = this.lines[8].y
    const h = this.lines[8].height

    renderer.context.fillStyle = this.fillColor
    renderer.context.beginPath()
    renderer.context.moveTo(x, y + h)
    renderer.context.lineTo(x - w, y)
    renderer.context.lineTo(x + w, y)
    renderer.context.fill()
  }

  private drawIceJamAboveSign = (
    element: VisualizerElement<IceRulerValue>
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
  ) => {
    const { renderer } = this.complexGraph

    const w = Math.min(element.width * 0.2, renderer.minSize * 0.02)
    const x = element.x + element.width / 2
    const y = this.lines[8].y
    const h = this.lines[8].height

    renderer.context.fillStyle = this.fillColor
    renderer.context.beginPath()
    renderer.context.moveTo(x, y)
    renderer.context.lineTo(x - w, y + h)
    renderer.context.lineTo(x + w, y + h)
    renderer.context.fill()
  }

  private drawIceDamBelowSign = () =>
    // element: VisualizerElement<IceRulerValue>,
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
    {}

  private drawIceDamAboveSign = () =>
    // element: VisualizerElement<IceRulerValue>,
    // group: VisualizerGroup<IceRulerValue, IceRulerGroupsNames>
    {}

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
}
