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

export function touchPosition(
  event: TouchEvent,
  container: HTMLElement,
  offset: XY = { x: 0, y: 0 }
) {
  const rect = container.getBoundingClientRect()
  return {
    x: Math.floor(
      ((event.touches[0].clientX - rect.left - offset.x) / (container.offsetWidth - offset.x * 2)) *
        container.offsetWidth
    ),
    y: Math.floor(
      ((event.touches[0].clientY - rect.top - offset.y) / (container.offsetHeight - offset.y * 2)) *
        container.offsetHeight
    ),
  }
}

export function pinchDistance(event: TouchEvent) {
  return Math.hypot(
    event.touches[0].pageX - event.touches[1].pageX,
    event.touches[0].pageY - event.touches[1].pageY
  )
}
