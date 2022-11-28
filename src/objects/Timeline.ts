import { Object } from '../core/Object'
import { Scene } from '../core/Scene'
import { TimelineDay, TimelineHour, TimelineMonth } from '../core/Timeline'

export interface TimelineParameters {
  scaleColor?: string
  fontColor?: string
  monthColor?: string
  dayColor?: string
  hourColor?: string
  decadeColor?: string
}

export class Timeline extends Object {
  public scaleColor: string
  public fontColor: string
  public monthColor: string
  public dayColor: string
  public hourColor: string
  public decadeColor: string

  constructor(parameters?: TimelineParameters) {
    super()

    this.scaleColor = parameters?.scaleColor || 'black'
    this.fontColor = parameters?.fontColor || 'black'
    this.monthColor = parameters?.monthColor || '#a5a4a4'
    this.dayColor = parameters?.dayColor || '#d1d1d1'
    this.hourColor = parameters?.hourColor || '#d1d1d1'
    this.decadeColor = parameters?.decadeColor || '#FF5370'
  }

  public onRender() {
    const { renderer, scene } = this.complexGraph

    const sceneOffsetX = renderer.minSize * 0.01
    const contentOffsetY = (renderer.size.y - this.complexGraph.calculator.clipArea.y2) / 3

    const axisX1 = sceneOffsetX
    const axisX2 = scene.size.pointer.current - sceneOffsetX
    const axisY = this.complexGraph.calculator.clipArea.y2 + contentOffsetY
    const gridY = this.complexGraph.calculator.clipArea.y2

    const scaleThickness = renderer.minSize * 0.003

    const monthFontSize = this.complexGraph.calculator.fontSize
    const monthDashSize = scaleThickness * 4

    const dayFontSize = monthFontSize * 0.9
    const dayDashSize = monthDashSize * 0.6

    const hourFontSize = dayFontSize * 0.8
    const hourDashSize = dayDashSize * 0.6

    const segmentHeight = axisY - this.complexGraph.calculator.clipArea.height - contentOffsetY

    renderer.context.strokeStyle = this.scaleColor
    renderer.context.lineWidth = scaleThickness

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
        renderer.context.fillStyle = this.fontColor
        renderer.context.strokeStyle = this.fontColor
        renderer.context.beginPath()
        renderer.context.moveTo(x, axisY - monthDashSize)
        renderer.context.lineTo(x, axisY + monthDashSize)
        renderer.context.stroke()

        renderer.context.font = `${monthFontSize}px ${this.complexGraph.font}`
        renderer.context.fillText(month.title.toString(), x, axisY + monthDashSize * 2)
      },
      day: (day, x, visible) => {
        if (day.title == 11 || day.title == 21) {
          renderer.context.fillStyle = this.decadeColor
          renderer.context.strokeStyle = this.decadeColor
        } else {
          renderer.context.fillStyle = this.fontColor
          renderer.context.strokeStyle = this.fontColor
        }

        renderer.context.beginPath()
        renderer.context.moveTo(x, axisY - dayDashSize)
        renderer.context.lineTo(x, axisY + dayDashSize)
        renderer.context.stroke()

        if (visible) {
          renderer.context.font = `${dayFontSize}px ${this.complexGraph.font}`
          renderer.context.fillText(day.title.toString(), x, axisY + dayDashSize * 2)
        }
      },
      hour: (hour, x, visible) => {
        renderer.context.fillStyle = this.fontColor
        renderer.context.strokeStyle = this.fontColor

        renderer.context.beginPath()
        renderer.context.moveTo(x, axisY - hourDashSize)
        renderer.context.lineTo(x, axisY + hourDashSize)
        renderer.context.stroke()

        if (visible) {
          renderer.context.font = `${hourFontSize}px ${this.complexGraph.font}`
          renderer.context.fillText(hour.title.toString(), x, axisY + hourDashSize * 2)
        }
      },
    })

    this.complexGraph.calculator.clip(renderer, () => {
      this.renderMonths({
        scene,
        month: (_, x) => {
          renderer.context.lineWidth = 1
          renderer.context.strokeStyle = this.monthColor
          renderer.context.beginPath()
          renderer.context.moveTo(x, gridY)
          renderer.context.lineTo(x, segmentHeight)
          renderer.context.stroke()
        },
        day: (_, x, visible) => {
          renderer.context.save()
          renderer.context.lineWidth = 1
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
          renderer.context.lineWidth = 1
          renderer.context.strokeStyle = this.hourColor
          renderer.context.globalAlpha = visible ? 0.3 : 0.1
          renderer.context.beginPath()
          renderer.context.moveTo(x, gridY)
          renderer.context.lineTo(x, segmentHeight)
          renderer.context.stroke()
          renderer.context.restore()
        },
        decade: (_, x) => {
          renderer.context.save()
          renderer.context.lineWidth = 1
          renderer.context.strokeStyle = this.decadeColor
          renderer.context.globalAlpha = 0.3
          renderer.context.beginPath()
          renderer.context.moveTo(x, gridY)
          renderer.context.lineTo(x, segmentHeight)
          renderer.context.stroke()
          renderer.context.restore()
        },
      })

      renderer.context.beginPath()
      renderer.context.moveTo(
        this.complexGraph.calculator.clipArea.x1,
        this.complexGraph.calculator.area.y2
      )
      renderer.context.lineTo(
        this.complexGraph.calculator.clipArea.x1 + this.complexGraph.calculator.clipArea.width,
        this.complexGraph.calculator.area.y2
      )
      renderer.context.strokeStyle = this.scaleColor
      renderer.context.stroke()
    })
  }

  private renderMonths(parameters: {
    scene: Scene
    month: (month: TimelineMonth, x: number) => void
    day: (day: TimelineDay, x: number, visible: boolean) => void
    hour: (hour: TimelineHour, x: number, visible: boolean) => void
    decade?: (day: TimelineDay, x: number, visible: boolean) => void
  }) {
    this.complexGraph.timeline.forEveryMonth((month) => {
      if (!this.complexGraph.calculator.isSegmentVisible(month)) return

      if (month.index) {
        parameters.month(month, this.complexGraph.calculator.area.x1 + month.x1)
      }

      if (this.complexGraph.calculator.isDaysZoom) {
        month.forEveryDay((day) => {
          const dayVisible =
            day.index > 0 &&
            ((+day.title % 5 === 1 &&
              !this.complexGraph.calculator.isDaysFullZoom &&
              day.title != 31) ||
              this.complexGraph.calculator.isDaysFullZoom)

          parameters.day(day, this.complexGraph.calculator.area.x1 + day.x1, dayVisible)

          if (this.complexGraph.calculator.isHoursZoom) {
            day.forEveryHour((hour) => {
              if (hour.title !== 1 && hour.title !== 24) {
                const hourVisible =
                  hour.index > 0 &&
                  ((+hour.title % 4 === 0 && !this.complexGraph.calculator.isHoursFullZoom) ||
                    this.complexGraph.calculator.isHoursFullZoom)
                parameters.hour(hour, this.complexGraph.calculator.area.x1 + hour.x1, hourVisible)
              }
            })
          }
        })
      }

      month.forEveryDay((day) => {
        if (day.title == 11 || day.title == 21) {
          parameters.decade?.(day, this.complexGraph.calculator.area.x1 + day.x1, true)
        }
      })
    })
  }
}
