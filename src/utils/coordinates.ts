import { XY } from './ts'

export function cursorPosition(
  event: MouseEvent,
  container: HTMLElement,
  offset: XY = { x: 0, y: 0 }
) {
  const rect = container.getBoundingClientRect()
  return {
    x: Math.floor(
      ((event.clientX - rect.left - offset.x) / (container.offsetWidth - offset.x * 2)) *
        container.offsetWidth
    ),
    y: Math.floor(
      ((event.clientY - rect.top - offset.y) / (container.offsetHeight - offset.y * 2)) *
        container.offsetHeight
    ),
  }
}
