import { Extension } from '../core/Extension'
import { pinchDistance, touchPosition } from '../utils/coordinates'

export class TouchControl extends Extension {
  constructor() {
    super()

    this.complexGraph.container.addEventListener('touchstart', this.handleTouch)
  }

  public override onDestroy() {
    this.complexGraph.container.removeEventListener('touchstart', this.handleTouch)
  }

  private handleTouch = (startEvent: TouchEvent) => {
    const { renderer, scene, container, calculator } = this.complexGraph

    const handleMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length === 2) {
        const movePinchDistance = pinchDistance(moveEvent)
        const pinchDelta = movePinchDistance - startPinchDistance
        const minimizer = 100
        const acceleration = scene.zoom * 0.2
        const zoom = lastZoom + (pinchDelta / minimizer) * acceleration

        renderer.withTicker(() => {
          scene.scaleSet(pivot, zoom)
        })
      } else {
        const delta =
          lastPosition + (startEvent.touches[0].clientX - moveEvent.touches[0].clientX) * 2

        if (Math.abs(delta) > 100) {
          renderer.withTicker(() => {
            scene.setTranslate(delta)
          })
        }
      }
    }

    const handleEnd = () => {
      removeEventListener('touchmove', handleMove)
      removeEventListener('touchend', handleEnd)
    }

    let startPinchDistance = 0

    const lastPosition = scene.position.pointer.current
    const lastZoom = scene.zoom

    let pivot = 0

    if (startEvent.touches.length === 2) {
      startPinchDistance = pinchDistance(startEvent)
      pivot = touchPosition(startEvent, container, {
        x: calculator.area.x1,
        y: 0,
      }).x
    } else {
      pivot = touchPosition(startEvent, container, {
        x: calculator.area.x1,
        y: 0,
      }).x
    }

    addEventListener('touchmove', handleMove)
    addEventListener('touchend', handleEnd)
  }
}
