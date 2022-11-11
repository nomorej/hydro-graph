import { XY } from './ts'

export function smoothGraph(context: CanvasRenderingContext2D, points: Array<XY>) {
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

export function linearGraph(context: CanvasRenderingContext2D, points: Array<XY>) {
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
