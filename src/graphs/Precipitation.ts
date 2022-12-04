import { pointRectCollision } from '../utils/collisions/pointRectCollision'
import { XY } from '../utils/ts'
import { Visualizer } from '../visualizer'
import { VisualizerElement, VisualizerElementParameters } from '../visualizer/VisualizerElement'
import {
  VisualizerElementsGroup,
  VisualizerElementsGroupData,
  VisualizerElementsGroupParameters,
} from '../visualizer/VisualizerElementsGroup'

export interface PrecipitationMixedElementValue {
  solid: number
  liquid: number
}

export class PrecipitationMixedElement extends VisualizerElement<PrecipitationMixedElementValue> {
  constructor(parameters: VisualizerElementParameters<PrecipitationMixedElementValue>) {
    super(parameters)
  }
}

export class PrecipitationDefaultGroup extends VisualizerElementsGroup<VisualizerElement<number>> {
  constructor(parameters: VisualizerElementsGroupParameters<number>) {
    super(parameters)
  }

  public render(heightStep: number) {
    const { complexGraph } = this.visualizer
    const { renderer } = complexGraph

    const cornerRound = renderer.minSize * 0.002
    const radii = [cornerRound, cornerRound, 0, 0]

    this.elements.forEach((element) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(element)) return

      renderer.context.beginPath()
      renderer.context.fillStyle = this.color
      //@ts-ignore
      renderer.context.roundRect(element.x, element.y, element.width, element.height, radii)
      renderer.context.fill()
    })
  }

  public resize(heightStep: number): void {
    const { complexGraph, row, paddingBottom, min } = this.visualizer

    this.elements.forEach((element) => {
      element.width = element.endSegment.x1 - element.startSegment.x1
      element.height = heightStep * (element.value - min)
      element.x = complexGraph.calculator.area.x1 + element.startSegment.x1
      element.y = row.y2 - element.height - paddingBottom
    })
  }

  public override hitTest(pointer: XY<number>) {
    const element = this.elements.find((el) => {
      return pointRectCollision(pointer, {
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
      })
    })

    return element
  }

  public override hitInfo(element: VisualizerElement<any>) {
    return [`Срок: ${element.startSegment.date}`, `Уровень: ${element.value}`, ...element.comment]
  }

  protected createElement(parameters: VisualizerElementParameters<number>) {
    return new VisualizerElement(parameters)
  }

  protected override getElementNumberValue(element: VisualizerElement<number>) {
    return element.value
  }
}

export interface PrecipitationMixedGroupParameters
  extends Omit<VisualizerElementsGroupParameters<PrecipitationMixedElementValue>, 'color'> {
  liquidColor?: string
  solidColor?: string
}

export class PrecipitationMixedGroup extends VisualizerElementsGroup<PrecipitationMixedElement> {
  private readonly liquidColor: string
  private readonly solidColor: string

  constructor(parameters: PrecipitationMixedGroupParameters) {
    super(parameters)

    this.liquidColor = parameters.liquidColor || 'black'
    this.solidColor = parameters.solidColor || 'black'
  }

  public render() {
    const { complexGraph } = this.visualizer
    const { renderer } = complexGraph

    const cornerRound = renderer.minSize * 0.002
    const radii = [cornerRound, cornerRound, 0, 0]

    this.elements.forEach((element) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(element)) return

      const step = element.height / (element.value.solid + element.value.liquid)
      const liquidHeight = step * element.value.liquid
      const solidHeight = step * element.value.solid
      renderer.context.beginPath()
      renderer.context.fillStyle = this.liquidColor
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
      renderer.context.fillStyle = this.solidColor
      //@ts-ignore
      renderer.context.roundRect(element.x, element.y, element.width, solidHeight, radii)
      renderer.context.fill()
    })
  }

  public override resize(heightStep: number): void {
    const { complexGraph, row, min } = this.visualizer

    this.elements.forEach((element) => {
      element.width = element.endSegment.x1 - element.startSegment.x1

      const acc = element.value.liquid + element.value.solid
      element.height = heightStep * (acc - min)

      element.x = complexGraph.calculator.area.x1 + element.startSegment.x1
      element.y = row.y2 - element.height
    })
  }

  public override hitTest(pointer: XY<number>) {
    const element = this.elements.find((el) => {
      return pointRectCollision(pointer, {
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
      })
    })

    return element
  }

  public override hitInfo(element: VisualizerElement<any>) {
    return [
      `Срок: ${element.startSegment.date}`,
      `Уровни`,
      `Твердый: ${element.value.solid}`,
      `Жидкий: ${element.value.liquid}`,
    ]
  }

  protected createElement(parameters: VisualizerElementParameters<PrecipitationMixedElementValue>) {
    return new PrecipitationMixedElement(parameters)
  }

  protected override getElementNumberValue(element: PrecipitationMixedElement): number {
    return element.value.liquid + element.value.solid
  }
}

export interface PrecipitationParameters {
  solid?: VisualizerElementsGroupData<number>
  liquid?: VisualizerElementsGroupData<number>
  mixed?: VisualizerElementsGroupData<PrecipitationMixedElementValue>
}

export function createPrecipitationGraph(parameters: PrecipitationParameters) {
  new Visualizer({
    name: 'Осадки',
    row: 1,
    rowFactor: 0.4,
    scale: {
      title: 'Осадки, мм',
      color: 'darkgreen',
      gridColor: 'darkgreen',
      gridActive: true,
    },
    // unactive: true,
  })

  if (parameters.solid) {
    new PrecipitationDefaultGroup({
      name: 'Твердые',
      color: '#00b1ff',
      data: parameters.solid,
    })
  }

  if (parameters.liquid) {
    new PrecipitationDefaultGroup({
      name: 'Жидкие',
      color: '#136945',
      data: parameters.liquid,
    })
  }

  if (parameters.mixed) {
    new PrecipitationMixedGroup({
      name: 'Смешанные',
      liquidColor: '#136945',
      solidColor: '#00b1ff',
      data: parameters.mixed,
    })
  }
}
