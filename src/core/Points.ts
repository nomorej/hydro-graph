import { Visualizer, VisualizerGroup, VisualizerParameters } from './Visualizer'

export type PointsParameters<K extends string = 'default'> = VisualizerParameters<number, K>
export type PointsGroup<K extends string = 'default'> = VisualizerGroup<number, K>

export abstract class Points<K extends string = 'default'> extends Visualizer<number, K> {
  constructor(parameters: PointsParameters<K>) {
    super(parameters)
  }

  protected override calclulateMinMax() {
    this.groups.forEach((group) => {
      group.elements.forEach((element) => {
        this.min = element.value < this.min ? element.value : this.min
        this.max = element.value > this.max ? element.value : this.max
      })
    })
  }

  protected resizeElements(heightStep: number) {
    this.groups.forEach((group) => {
      if (group.isVisible) {
        group.elements.forEach((element) => {
          element.width = element.segment.width
          element.height = heightStep * (element.value - this.min)
          element.x = this.complexGraph.calculator.area.x1 + element.segment.x1
          element.y = this.row.y2 - element.height
        })
      }
    })
  }
}
