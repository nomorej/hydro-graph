import { Graph } from '../core/Graph'
import { PointsParameters } from '../core/Points'

export type WaterСonsumptionGroupsNames = 'qh' | 'measured' | 'calculated'

export class WaterСonsumption extends Graph<WaterСonsumptionGroupsNames> {
  constructor(parameters: PointsParameters<WaterСonsumptionGroupsNames>) {
    super(parameters)
  }

  protected override renderWithClip() {
    const { renderer, calculator } = this.complexGraph

    this.drawGroup('qh', {
      beforeStroke() {
        renderer.context.save()
        renderer.context.setLineDash([calculator.clipArea.width * 0.01])
      },
      afterStroke() {
        renderer.context.restore()
      },
    })

    this.drawGroup('calculated')

    const measuredGroup = this.groups.get('measured')

    if (measuredGroup && measuredGroup.isVisible) {
      renderer.context.fillStyle = measuredGroup.color
      measuredGroup.elements.forEach((element) => {
        if (!this.complexGraph.calculator.isPointVisible(element)) return
        renderer.context.beginPath()
        renderer.context.arc(element.x, element.y, renderer.minSize * 0.005, 0, Math.PI * 2)
        renderer.context.fill()
      })
    }
  }
}
