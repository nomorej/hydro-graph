import { GraphPoint } from '../core/Graph'
import {
  GraphWithScale,
  GraphWithScaleParameters,
  SkipScaleSegmentParameters,
} from '../core/GraphWithScale'

export type PrecipitationGraphsTypes = 'liquid' | 'solid'

export interface PrecipitationParameters
  extends GraphWithScaleParameters<PrecipitationGraphsTypes> {
  liquidColor?: string
  solidColor?: string
}

export type PrecipitationColumn = { point: GraphPoint; type: PrecipitationGraphsTypes }

export class Precipitation extends GraphWithScale<PrecipitationGraphsTypes> {
  public liquidColor: string
  public solidColor: string

  private columns: {
    liquid: Array<PrecipitationColumn>
    solid: Array<PrecipitationColumn>
    mixed: Array<PrecipitationColumn>
  } = null!

  constructor(parameters: PrecipitationParameters) {
    super({
      scaleColor: 'darkgreen',
      gridColor: 'darkgreen',
      ...parameters,
    })

    this.liquidColor = parameters.liquidColor || 'green'
    this.solidColor = parameters.liquidColor || 'darkblue'
    this.columns = {
      liquid: [],
      solid: [],
      mixed: [],
    }
  }

  public override onCreate(): void {
    super.onCreate()

    setTimeout(() => {
      this.columns = {
        liquid: [],
        solid: [],
        mixed: [],
      }

      this.points.liquid.forEach((liquidPoint) => {
        const same = this.points.solid.find((solidPoint) => solidPoint.x === liquidPoint.x)

        if (same) {
          this.columns.mixed.push({ point: liquidPoint, type: 'liquid' })
        } else {
          this.columns.liquid.push({ point: liquidPoint, type: 'liquid' })
        }
      })

      this.points.solid.forEach((solidPoint) => {
        const same = this.columns.mixed.find((mixedPoint) => solidPoint.x === mixedPoint.point.x)

        if (same) {
          this.columns.mixed.push({ point: solidPoint, type: 'solid' })
        } else {
          this.columns.solid.push({ point: solidPoint, type: 'solid' })
        }
      })

      this.columns.mixed.sort((a, b) => b.point.height - a.point.height)
      this.renderGraph()
    }, 0)
  }

  protected renderGraph() {
    const { renderer, scene } = this.complexGraph

    for (const key in this.columns) {
      const columns = this.columns[key as PrecipitationGraphsTypes]

      columns.forEach((column) => {
        const point = column.point
        if (!this.complexGraph.calculator.isPointVisible(scene, point)) return
        renderer.context.beginPath()
        renderer.context.fillStyle = column.type === 'liquid' ? this.liquidColor : this.solidColor

        renderer.context.fillRect(point.x, point.y, point.width, point.height)
      })
    }
  }

  protected skipScaleSegment(data: SkipScaleSegmentParameters): boolean {
    return data.index % 2 !== 0
  }
}
