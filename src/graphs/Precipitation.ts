import { Visualizer, VisualizerParameters } from '../core/Visualizer'

export type PrecipitationGroupsNames = 'liquid' | 'solid' | 'mixed'

export type PrecipitationValue = number | { liquid: number; solid: number }

export class Precipitation extends Visualizer<PrecipitationValue, PrecipitationGroupsNames> {
  constructor(parameters: VisualizerParameters<PrecipitationValue, PrecipitationGroupsNames>) {
    super(parameters)
  }

  protected override renderWithClip() {
    const { renderer } = this.complexGraph

    const cornerRound = renderer.minSize * 0.002

    const radii = [cornerRound, cornerRound, 0, 0]

    this.groups.forEach((group) => {
      if (!group.isVisible) return

      group.elements.forEach((element) => {
        if (!this.complexGraph.calculator.isPointVisible(element)) return

        if (typeof element.value === 'object') {
          const step = element.height / (element.value.solid + element.value.liquid)
          const liquidHeight = step * element.value.liquid
          const solidHeight = step * element.value.solid
          renderer.context.beginPath()
          renderer.context.fillStyle = this.groups.get('liquid')!.color
          //@ts-ignore
          renderer.context.roundRect(
            element.x,
            element.y + solidHeight,
            element.width,
            liquidHeight,
            radii
          )
          renderer.context.fill()

          renderer.context.beginPath()
          renderer.context.fillStyle = this.groups.get('solid')!.color
          //@ts-ignore
          renderer.context.roundRect(element.x, element.y, element.width, solidHeight, radii)
          renderer.context.fill()
        } else {
          renderer.context.beginPath()
          renderer.context.fillStyle = group.color
          //@ts-ignore
          renderer.context.roundRect(element.x, element.y, element.width, element.height, radii)
          renderer.context.fill()
        }
      })
    })
  }

  protected override calclulateMinMax() {
    this.groups.forEach((group) => {
      group.elements.forEach((element) => {
        if (typeof element.value === 'object') {
          const acc = element.value.liquid + element.value.solid
          this.min = acc < this.min ? acc : this.min
          this.max = acc > this.max ? acc : this.max
        } else {
          this.min = element.value < this.min ? element.value : this.min
          this.max = element.value > this.max ? element.value : this.max
        }
      })
    })
  }

  protected resizeElements(heightStep: number) {
    this.groups.forEach((group) => {
      if (!group.isVisible) return
      group.elements.forEach((element) => {
        element.width = element.endSegment.x1 - element.startSegment.x1

        if (typeof element.value === 'object') {
          const acc = element.value.liquid + element.value.solid
          element.height = heightStep * (acc - this.min)
        } else {
          element.height = heightStep * (element.value - this.min)
        }

        element.x = this.complexGraph.calculator.area.x1 + element.startSegment.x1
        element.y = this.row.y2 - element.height
      })
    })
  }
}
