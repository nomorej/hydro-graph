import { CGGlobals, ComplexGraphGlobals } from '../core/ComplexGraph'
import { Renderer } from '../core/Renderer'
import { SceneRenderData } from '../core/Scene'
import { SceneRowObject } from '../core/SceneRowObject'
import { UtilsGraph } from '../utils/UtilsGraph'

export class AirTemperature extends SceneRowObject {
  constructor() {
    super('airTemperature', 0)
  }

  public render({ renderer }: SceneRenderData): void {
    const { colors, calculations } = CGGlobals
    const { rowsPrimitives, scales } = calculations

    scales.airTemperature.forEach((s) => {
      renderer.context.save()
      renderer.context.beginPath()
      renderer.context.strokeStyle = colors.airTemperature.scale
      renderer.context.lineWidth = 1
      if (s.data === 0) {
        renderer.context.strokeStyle = colors.default
        renderer.context.lineWidth = 3
      }
      if (!s.isBase) {
        renderer.context.globalAlpha = 0.2
      }
      renderer.context.moveTo(rowsPrimitives[this.row].x1, s.position)
      renderer.context.lineTo(rowsPrimitives[this.row].x2, s.position)
      renderer.context.stroke()
      renderer.context.restore()
    })

    this.drawGraph(renderer, 'min')
    this.drawGraph(renderer, 'middle')
    this.drawGraph(renderer, 'max')
  }

  private drawGraph(renderer: Renderer, name: keyof ComplexGraphGlobals['data']['airTemperature']) {
    const { colors, calculations, data } = CGGlobals
    const { rowsPrimitives, scales } = calculations
    const { airTemperature } = data

    const offset = rowsPrimitives[this.row].height / scales.airTemperature.length

    if (airTemperature[name] && airTemperature[name].length) {
      const points = UtilsGraph.points(
        airTemperature[name],
        {
          x: rowsPrimitives[this.row].width,
          y: rowsPrimitives[this.row].height - offset,
        },
        {
          x: rowsPrimitives[this.row].x1,
          y: rowsPrimitives[this.row].y1 + offset,
        },
        calculations.airTemperatureMax,
        calculations.airTemperatureMin
      )
      renderer.context.lineWidth = 2
      UtilsGraph.smooth(renderer.context, points)
      renderer.context.strokeStyle = colors.airTemperature[name]
      renderer.context.stroke()
    }
  }
}
