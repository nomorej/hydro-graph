import { Graph } from '../core/Graph'
import { PointsParameters } from '../core/Points'

export type WaterСonsumptionGroupsNames = 'qh' | 'measured' | 'calculated' | 'operational'

export class WaterСonsumption extends Graph<WaterСonsumptionGroupsNames> {
  constructor(parameters: PointsParameters<WaterСonsumptionGroupsNames>) {
    super(parameters)
  }

  protected override renderWithClip() {
    const { renderer } = this.complexGraph

    this.drawGroup('qh')
    this.drawGroup('calculated')
    this.drawGroup('operational')

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
