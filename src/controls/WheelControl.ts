import { Extension } from '../core/Extension'
import { cursorPosition } from '../utils/coordinates'
import { clamp } from '../utils/math'

export class WheelControl extends Extension {
  private scaleButtonPressed: boolean

  constructor() {
    super()

    this.scaleButtonPressed = false

    this.complexGraph.container.addEventListener('wheel', this.handleWheel)
    this.complexGraph.container.addEventListener('pointerdown', this.handlePointerDown)
    this.complexGraph.container.addEventListener('pointerup', this.handlePointerUp)
    this.complexGraph.container.addEventListener('contextmenu', this.handleContextMenu)
  }

  public override onDestroy(): void {
    this.complexGraph.container.removeEventListener('wheel', this.handleWheel)
    this.complexGraph.container.removeEventListener('pointerdown', this.handlePointerDown)
    this.complexGraph.container.removeEventListener('pointerup', this.handlePointerUp)
    this.complexGraph.container.removeEventListener('contextmenu', this.handleContextMenu)
  }

  private handleWheel = (event: WheelEvent) => {
    const { scene, renderer, container, calculator } = this.complexGraph

    if (this.scaleButtonPressed) {
      const mousePosition = cursorPosition(event, container, {
        x: calculator.area.x1,
        y: 0,
      }).x

      const zoomSpeed = clamp(event.deltaY, -1, 1) * scene.zoom * 0.2
      renderer.withTicker(() => {
        scene.scaleStep(mousePosition, zoomSpeed)
      })
    } else {
      renderer.withTicker(() => {
        scene.translate(event.deltaY)
      })
    }
  }

  private handlePointerDown = (event: PointerEvent) => {
    if (event.button === 0) {
      event.preventDefault()
      this.scaleButtonPressed = true
    }
  }

  private handlePointerUp = (event: PointerEvent) => {
    if (event.button === 0) {
      event.preventDefault()
      this.scaleButtonPressed = false
    }
  }

  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
  }
}
