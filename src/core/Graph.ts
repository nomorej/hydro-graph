import { Points, PointsGroup, PointsParameters } from './Points'
import { VisualizerElement } from './Visualizer'

export abstract class Graph<K extends string = 'default'> extends Points<K> {
  constructor(parameters: PointsParameters<K>) {
    super(parameters)
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
}
