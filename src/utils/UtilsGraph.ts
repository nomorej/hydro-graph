import { CGGlobals, GraphsData, GraphsNames } from '../core/ComplexGraph'
import { XY } from './UtilsTS'

export abstract class UtilsGraph {
  public static points<T extends GraphsNames>({
    graphName,
    graphSize,
    graphPosition,
    row,
    key,
  }: {
    graphName: T
    key: keyof GraphsData[T]['graph']
    graphSize: XY
    graphPosition: XY
    row: number
  }) {
    const { graphsData, calculations } = CGGlobals
    const { timeline } = calculations

    const graphData = graphsData[graphName]

    const offsetY =
      calculations.rowsPrimitives[row].height / (graphsData[graphName].scale?.segments.length || 1)

    const points: Array<{ x: number; y: number; width: number }> = []

    const monthWidth = graphSize.x / timeline.months.length
    graphData.everyMonth(
      graphData.graphNormalized[key as keyof GraphsData[GraphsNames]['graph']],
      ({ monthIndex, day }) => {
        const step = monthWidth / timeline.months[monthIndex].days
        const x = graphPosition.x + monthWidth * monthIndex + step * day.number
        const y =
          graphPosition.y + offsetY + (graphSize.y - offsetY) - (graphSize.y - offsetY) * day.value

        points.push({
          x,
          y,
          width: step,
        })
      }
    )
    return points
  }

  public static smooth(context: CanvasRenderingContext2D, points: Array<XY>) {
    context.beginPath()

    const sx = points[0].x
    const sy = points[0].y

    context.moveTo(sx, sy)

    for (let i = 0; i < points.length - 1; i++) {
      const x1 = (points[i].x + points[i + 1].x) / 2
      const y1 = (points[i].y + points[i + 1].y) / 2

      const cx1 = (x1 + points[i].x) / 2
      const cy1 = points[i].y

      const x2 = points[i + 1].x
      const y2 = points[i + 1].y

      const cx2 = (x1 + points[i + 1].x) / 2
      const cy2 = points[i + 1].y

      context.quadraticCurveTo(cx1, cy1, x1, y1)
      context.quadraticCurveTo(cx2, cy2, x2, y2)
    }
  }

  public static linear(context: CanvasRenderingContext2D, points: Array<XY>) {
    context.beginPath()

    const sx = points[0].x
    const sy = points[0].y

    context.moveTo(sx, sy)

    for (let i = 1; i < points.length; i++) {
      const x = points[i].x
      const y = points[i].y

      context.lineTo(x, y)
    }
  }
}
