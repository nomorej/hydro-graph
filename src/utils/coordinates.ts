export function cursorPosition(event: MouseEvent, container: HTMLElement) {
  const rect = container.getBoundingClientRect()
  return {
    x: Math.floor(((event.clientX - rect.left) / (rect.right - rect.left)) * container.offsetWidth),
    y: Math.floor(((event.clientY - rect.top) / (rect.bottom - rect.top)) * container.offsetHeight),
  }
}
