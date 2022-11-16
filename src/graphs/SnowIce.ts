import { Graph } from '../core/Graph'
import { PointsGroup, PointsParameters } from '../core/Points'
import { ScaleSegment } from '../core/Scale'

export type SnowIceGroupsNames = 'snow' | 'ice'

export interface SnowIceParameters extends PointsParameters<SnowIceGroupsNames> {
  snowFillColor?: string
  iceFillColor?: string
}

export class SnowIce extends Graph<SnowIceGroupsNames> {
  private scaleZeroSegment?: ScaleSegment

  private snowFillColor: string
  private iceFillColor: string

  constructor(parameters: SnowIceParameters) {
    super(parameters)

    this.snowFillColor = parameters.snowFillColor || parameters.groups?.snow?.color || 'black'
    this.iceFillColor = parameters.iceFillColor || parameters.groups?.ice?.color || 'black'
  }

  public override onCreate(): void {
    super.onCreate()
    this.scaleZeroSegment = this.scale?.segments.find((s) => s.value === 0)
  }

  protected override renderWithClip() {
    const lineWidth = 2
    const offset = lineWidth / 2

    if (this.scaleZeroSegment) {
      this.drawGroup('snow', {
        lineWidth,
        afterStroke: (group) => {
          this.fillGroup(group, this.snowFillColor, offset)
        },
      })
      this.drawGroup('ice', {
        lineWidth,
        afterStroke: (group) => {
          this.fillGroup(group, this.iceFillColor, offset * -1)
        },
      })
    }
  }

  private fillGroup(group: PointsGroup<SnowIceGroupsNames>, color: string, offset = 0) {
    const { renderer, calculator } = this.complexGraph

    const fe = group.elements[0]
    const le = group.elements[group.elements.length - 1]
    if (!calculator.isPointVisible(fe, (fe.x - le.x) * -1)) return

    renderer.context.save()
    renderer.context.beginPath()
    renderer.context.moveTo(fe.x, this.scaleZeroSegment!.y)

    group.elements.forEach((el) => {
      renderer.context.lineTo(el.x, el.y + offset)
    })

    renderer.context.lineTo(le.x, this.scaleZeroSegment!.y)
    renderer.context.fillStyle = color
    renderer.context.fill()
    renderer.context.restore()
  }
}
