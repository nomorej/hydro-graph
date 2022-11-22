import { XY } from './ts'

export function pointRectCollision(point: XY, rect: XY & { width: number; height: number }) {
  if (
    point.x < rect.x + rect.width &&
    point.x > rect.x &&
    point.y < rect.y + rect.height &&
    point.y > rect.y
  ) {
    return true
  }
}
