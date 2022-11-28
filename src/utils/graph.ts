import { XY } from './ts'

export function linearGraph(
  context: CanvasRenderingContext2D,
  points: Array<XY & { new?: boolean }>
) {
  context.beginPath()

  const fe = points[0]

  const sx = fe.x
  const sy = fe.y

  context.moveTo(sx, sy)

  for (let i = 1; i < points.length; i++) {
    const ce = points[i]

    const x = ce.x
    const y = ce.y

    if (ce.new) {
      context.moveTo(x, y)
    } else {
      context.lineTo(x, y)
    }
  }
}
