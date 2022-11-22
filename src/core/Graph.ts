import { throttle } from '../utils/function'
import { pointRectCollision } from '../utils/pointRectCollision'
import { XY } from '../utils/ts'
import { Points, PointsGroup, PointsParameters } from './Points'
import { VisualizerElement } from './Visualizer'

export abstract class Graph<K extends string = 'default'> extends Points<K> {
  constructor(parameters: PointsParameters<K>) {
    super(parameters)
  }

  public override onCreate() {
    super.onCreate()
    this.complexGraph.events.listen('mousemove', this.handleMouseMove)
  }

  public override onDestroy() {
    this.complexGraph.events.unlisten('mousemove', this.handleMouseMove)
  }

  protected drawGroup(
    key: K,
    parameters?: {
      beforeLines?: (group: PointsGroup<K>) => void
      beforeStroke?: (group: PointsGroup<K>) => void
      afterStroke?: (group: PointsGroup<K>) => void
      lineWidth?: number
    }
  ) {
    const { renderer } = this.complexGraph

    const group = this.groups.get(key)

    if (group?.elements.length && group.isVisible) {
      parameters?.beforeLines?.(group)
      this.drawLinear(group.elements)
      parameters?.beforeStroke?.(group)
      renderer.context.strokeStyle = group.color
      renderer.context.lineWidth = parameters?.lineWidth || 1
      renderer.context.stroke()
      parameters?.afterStroke?.(group)
    }
  }

  protected drawLinear(elements: Array<VisualizerElement<number>>) {
    if (!elements.length) return

    const { renderer } = this.complexGraph
    const { context } = renderer

    context.beginPath()

    const fe = elements[0]

    const sx = fe.x
    const sy = fe.y

    context.moveTo(sx, sy)

    for (let i = 1; i < elements.length; i++) {
      const ce = elements[i]

      const x = ce.x
      const y = ce.y

      if (ce.new) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    }
  }

  private handleMouseMove = throttle((_mouse: XY, mouseZoomed: XY) => {
    if (this.isActive && mouseZoomed.y > this.row.y1 && mouseZoomed.y < this.row.y2) {
      let collisionsCount = 0
      let visibleGroupsCount = 0

      const rectSize = this.complexGraph.renderer.minSize * 0.05

      this.groups.forEach((group) => {
        if (group?.elements.length && group.isVisible) {
          visibleGroupsCount++

          group.elements.forEach((el) => {
            if (
              pointRectCollision(mouseZoomed, {
                x: el.x - rectSize / 2,
                y: el.y - rectSize / 2,
                width: rectSize,
                height: rectSize,
              })
            ) {
              collisionsCount++
              this.complexGraph.tooltip.show(el.value + '')
            }
          })
        }
      })

      if (!collisionsCount && visibleGroupsCount) {
        this.complexGraph.tooltip.hide()
      }
    }
  }, 0)
}
