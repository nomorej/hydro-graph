import { ComplexGraph } from '../core/ComplexGraph'
import { Object } from '../core/Object'
import { Scene, SceneRenderData } from '../core/Scene'
import { TimelineDay, TimelineHour, TimelineMonth } from '../core/Timeline'

export interface TimelineParameters {
  scaleColor?: string
  fontColor?: string
  monthColor?: string
  dayColor?: string
  hourColor?: string
}

export class Timeline extends Object {
  public scaleColor: string
  public fontColor: string
  public monthColor: string
  public dayColor: string
  public hourColor: string

  constructor(parameters?: TimelineParameters) {
    super()

    this.scaleColor = parameters?.scaleColor || 'black'
    this.fontColor = parameters?.fontColor || 'black'
    this.monthColor = parameters?.monthColor || 'lightblue'
    this.dayColor = parameters?.dayColor || 'lightblue'
    this.hourColor = parameters?.hourColor || 'lightblue'
  }

  public render({ renderer, scene }: SceneRenderData) {
    const sceneOffsetX = renderer.minSize * 0.01
    const contentOffsetY = (renderer.size.y - ComplexGraph.globals.calculator.clipArea.y2) / 3

    const axisX1 = sceneOffsetX
    const axisX2 = scene.size.pointer.current - sceneOffsetX
    const axisY = ComplexGraph.globals.calculator.clipArea.y2 + contentOffsetY
    const gridY = ComplexGraph.globals.calculator.area.y2

    const scaleThickness = renderer.minSize * 0.003

    const monthFontSize = ComplexGraph.globals.calculator.fontSize
    const monthDashSize = scaleThickness * 4

    const dayFontSize = monthFontSize * 0.9
    const dayDashSize = monthDashSize * 0.6

    const hourFontSize = dayFontSize * 0.8
    const hourDashSize = dayDashSize * 0.6

    const segmentHeight = axisY - ComplexGraph.globals.calculator.clipArea.height - contentOffsetY

    renderer.context.lineWidth = scaleThickness
    renderer.context.strokeStyle = this.scaleColor

    renderer.context.beginPath()
    renderer.context.moveTo(axisX1, axisY)
    renderer.context.lineTo(axisX2, axisY)
    renderer.context.stroke()

    renderer.context.fillStyle = this.fontColor
    renderer.context.textAlign = 'center'
    renderer.context.textBaseline = 'top'

    this.renderMonths({
      scene,
      month: (month, x) => {
        renderer.context.beginPath()
        renderer.context.moveTo(x, axisY - monthDashSize)
        renderer.context.lineTo(x, axisY + monthDashSize)
        renderer.context.stroke()

        renderer.context.font = `${monthFontSize}px ${ComplexGraph.globals.font}`
        renderer.context.fillText(month.title.toString(), x, axisY + monthDashSize * 2)
      },
      day: (day, x, visible) => {
        renderer.context.beginPath()
        renderer.context.moveTo(x, axisY - dayDashSize)
        renderer.context.lineTo(x, axisY + dayDashSize)
        renderer.context.stroke()

        if (visible) {
          renderer.context.font = `${dayFontSize}px ${ComplexGraph.globals.font}`
          renderer.context.fillText(day.title.toString(), x, axisY + dayDashSize * 2)
        }
      },
      hour: (hour, x, visible) => {
        renderer.context.beginPath()
        renderer.context.moveTo(x, axisY - hourDashSize)
        renderer.context.lineTo(x, axisY + hourDashSize)
        renderer.context.stroke()

        if (visible) {
          renderer.context.font = `${hourFontSize}px ${ComplexGraph.globals.font}`
          renderer.context.fillText(hour.title.toString(), x, axisY + hourDashSize * 2)
        }
      },
    })

    ComplexGraph.globals.calculator.clip(renderer, () => {
      this.renderMonths({
        scene,
        month: (_, x) => {
          renderer.context.strokeStyle = this.monthColor
          renderer.context.beginPath()
          renderer.context.moveTo(x, gridY)
          renderer.context.lineTo(x, segmentHeight)
          renderer.context.stroke()
        },
        day: (_, x, visible) => {
          renderer.context.save()
          renderer.context.strokeStyle = this.dayColor
          renderer.context.globalAlpha = visible ? 0.5 : 0.3
          renderer.context.beginPath()
          renderer.context.moveTo(x, gridY)
          renderer.context.lineTo(x, segmentHeight)
          renderer.context.stroke()
          renderer.context.restore()
        },
        hour: (_, x, visible) => {
          renderer.context.save()
          renderer.context.strokeStyle = this.hourColor
          renderer.context.globalAlpha = visible ? 0.3 : 0.1
          renderer.context.beginPath()
          renderer.context.moveTo(x, gridY)
          renderer.context.lineTo(x, segmentHeight)
          renderer.context.stroke()
          renderer.context.restore()
        },
      })
    })
  }

  private renderMonths(parameters: {
    scene: Scene
    month: (month: TimelineMonth, x: number) => void
    day: (day: TimelineDay, x: number, visible: boolean) => void
    hour: (hour: TimelineHour, x: number, visible: boolean) => void
  }) {
    ComplexGraph.globals.timeline.forEveryMonth((month) => {
      if (!ComplexGraph.globals.calculator.isSegmentVisible(parameters.scene, month)) return

      if (month.index) {
        parameters.month(month, ComplexGraph.globals.calculator.area.x1 + month.x1)
      }

      if (ComplexGraph.globals.calculator.isDaysZoom) {
        month.forEveryDay((day) => {
          const dayVisible =
            day.index > 0 &&
            ((+day.title % 5 === 0 &&
              !ComplexGraph.globals.calculator.isDaysFullZoom &&
              day.title != 30) ||
              ComplexGraph.globals.calculator.isDaysFullZoom)

          parameters.day(day, ComplexGraph.globals.calculator.area.x1 + day.x1, dayVisible)

          if (ComplexGraph.globals.calculator.isHoursZoom) {
            day.forEveryHour((hour) => {
              const hourVisible =
                hour.index > 0 &&
                ((+hour.title % 4 === 0 && !ComplexGraph.globals.calculator.isHoursFullZoom) ||
                  ComplexGraph.globals.calculator.isHoursFullZoom)
              parameters.hour(hour, ComplexGraph.globals.calculator.area.x1 + hour.x1, hourVisible)
            })
          }
        })
      }
    })
  }
}
