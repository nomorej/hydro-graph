import { Graph } from '../core/Graph'
import { PointsParameters } from '../core/Points'
import { Timeline } from '../core/Timeline'
import { VisualizerElement, VisualizerGroup } from '../core/Visualizer'

export type AirTemperatureGroupsNames =
  | 'middle'
  | 'max'
  | 'min'
  | 'post'
  | 'sumTempSpring'
  | 'sumTempAutumn'
  | 'sumTempAll'

export class AirTemperature extends Graph<AirTemperatureGroupsNames> {
  constructor(parameters: PointsParameters<AirTemperatureGroupsNames>) {
    super({ ...parameters, paddingBottom: 0.15 })
  }

  protected override renderWithClip() {
    this.drawGroup('min')
    this.drawGroup('middle')
    this.drawGroup('max')
    this.drawGroup('post')
    this.drawSumTempSpring()
    this.drawSumTempAutumn()
    this.drawSumTempAll()
  }

  protected override calclulateMinMax() {
    this.groups.forEach((group) => {
      if (this.isGraphGroup(group)) {
        group.elements.forEach((element) => {
          this.min = element.value < this.min ? element.value : this.min
          this.max = element.value > this.max ? element.value : this.max
        })
      }
    })
  }

  protected override resizeElements(heightStep: number) {
    this.groups.forEach((group) => {
      if (group.isVisible) {
        group.elements.forEach((element) => {
          element.x = this.complexGraph.calculator.area.x1 + element.segment.x1

          if (this.isGraphGroup(group)) {
            element.width = element.segment.width
            element.height = heightStep * (element.value - this.min)
            element.y = this.row.y2 - element.height - this.paddingBottom
          } else {
            element.width = Timeline.getDaySegment(element.segment).width
            element.height = this.paddingBottom / 2
            element.y = this.row.y2 - this.paddingBottom / 2
          }
        })
      }
    })
  }

  private isGraphGroup(group: VisualizerGroup<number, AirTemperatureGroupsNames>) {
    return (
      group.name === 'middle' ||
      group.name === 'max' ||
      group.name === 'min' ||
      group.name === 'post'
    )
  }

  private drawSumTempSpring() {
    const { renderer } = this.complexGraph

    const group = this.groups.get('sumTempSpring')

    if (group) {
      this.drawSum(group, (element, index, step) => {
        renderer.context.beginPath()
        renderer.context.moveTo(element.x + step * index, element.y)
        renderer.context.lineTo(element.x + step * (index + 0.85), element.y + element.height)
        renderer.context.stroke()
      })
    }
  }

  private drawSumTempAutumn() {
    const { renderer } = this.complexGraph

    const group = this.groups.get('sumTempAutumn')

    if (group) {
      this.drawSum(group, (element, index, step) => {
        renderer.context.beginPath()
        renderer.context.moveTo(element.x + step * (index + 0.85), element.y)
        renderer.context.lineTo(element.x + step * index, element.y + element.height)
        renderer.context.stroke()
      })
    }
  }

  private drawSumTempAll() {
    const { renderer } = this.complexGraph

    const group = this.groups.get('sumTempAll')

    if (group) {
      this.drawSum(group, (element, index, step) => {
        renderer.context.beginPath()
        renderer.context.moveTo(element.x + step * index, element.y)
        renderer.context.lineTo(element.x + step * (index + 0.85), element.y + element.height)
        renderer.context.moveTo(element.x + step * (index + 0.85), element.y)
        renderer.context.lineTo(element.x + step * index, element.y + element.height)
        renderer.context.stroke()
      })
    }
  }

  private drawSum(
    group: VisualizerGroup<number, AirTemperatureGroupsNames>,
    callback: (element: VisualizerElement<number>, index: number, step: number) => void
  ) {
    const { renderer, scene, calculator } = this.complexGraph

    if (group.isVisible) {
      renderer.context.strokeStyle = group.color

      group.elements.forEach((element) => {
        renderer.context.lineWidth = 1 / renderer.pixelRatio

        if (!calculator.isPointVisible(element)) return

        const s = Math.ceil(scene.zoom / 4)
        const step = element.width / s

        for (let index = 0; index < s; index++) {
          callback(element, index, step)
        }
      })
    }
  }
}
