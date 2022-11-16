import { Visualizer, VisualizerElement, VisualizerParameters } from '../core/Visualizer'

export type PrecipitationGroupsNames = 'liquid' | 'solid' | 'mixed'

export type PrecipitationValue = number | { value: number; type: 'liquid' | 'solid' }

export class Precipitation extends Visualizer<PrecipitationValue, PrecipitationGroupsNames> {
  constructor(parameters: VisualizerParameters<PrecipitationValue, PrecipitationGroupsNames>) {
    super(parameters)
  }

  public override onCreate() {
    super.onCreate()

    const { renderer } = this.complexGraph
    //@ts-ignore
    renderer.context.roundRect = renderer.context.roundRect || renderer.context.rect
  }

  protected override renderWithClip() {
    const { renderer } = this.complexGraph

    const cornerRound = renderer.minSize * 0.005

    this.groups.forEach((group) => {
      if (!group.isVisible) return

      group.elements.forEach((element) => {
        if (!this.complexGraph.calculator.isPointVisible(element)) return

        renderer.context.beginPath()

        if (typeof element.value === 'object') {
          renderer.context.fillStyle =
            element.value.type === 'liquid'
              ? this.groups.get('liquid')!.color
              : this.groups.get('solid')!.color
        } else {
          renderer.context.fillStyle = group.color
        }

        //@ts-ignore
        renderer.context.roundRect(element.x, element.y - 1, element.width, element.height, [
          cornerRound,
          cornerRound,
          0,
          0,
        ])

        renderer.context.fill()
      })
    })
  }

  protected calclulateMinMax() {
    this.groups.forEach((group) => {
      group.elements.forEach((element) => {
        if (typeof element.value === 'object') {
          this.min = element.value.value < this.min ? element.value.value : this.min
          this.max = element.value.value > this.max ? element.value.value : this.max
        } else {
          this.min = element.value < this.min ? element.value : this.min
          this.max = element.value > this.max ? element.value : this.max
        }
      })
    })
    ;(
      this.groups.get('mixed')!.elements as Array<
        VisualizerElement<Exclude<PrecipitationValue, number>>
      >
    ).sort((a, b) => b.value.value - a.value.value)
  }

  protected resizeElements(heightStep: number) {
    this.groups.forEach((group) => {
      if (!group.isVisible) return
      group.elements.forEach((element) => {
        element.width = element.segment.width
        if (typeof element.value === 'object') {
          element.height = heightStep * (element.value.value - this.min)
        } else {
          element.height = heightStep * (element.value - this.min)
        }
        element.x = this.complexGraph.calculator.area.x1 + element.segment.x1
        element.y = this.row.y2 - element.height
      })
    })
  }
}
